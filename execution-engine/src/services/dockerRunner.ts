import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { enqueue } from "./executionQueue";

export interface ExecutionResult {
  status:
    | "accepted"
    | "wrong_answer"
    | "runtime_error"
    | "time_limit_exceeded"
    | "internal_error";
  stdout: string;
  stderr: string;
  executionTime: number;
}

const MAX_OUTPUT = 1024 * 1024; // 1MB
const TIME_LIMIT = 3000; // 3 seconds

export const runCode = (
  language: string,
  code: string,
  input: string
): Promise<ExecutionResult> => {
  return new Promise((resolveOuter) => {
    enqueue(async () => {
      const jobId = uuidv4();
      const jobDir = path.join(__dirname, "..", "..", "jobs", jobId);

      fs.mkdirSync(jobDir, { recursive: true });

      const cleanup = () => {
        try {
          fs.rmSync(jobDir, { recursive: true, force: true });
        } catch {}
      };

      const resolveOnce = (result: ExecutionResult) => {
        cleanup();
        resolveOuter(result);
      };

      let filename = "";
      let compileImage = "";
      let runImage = "";

      /* =============================== */
      /* LANGUAGE CONFIG                 */
      /* =============================== */

      if (language === "javascript") {
        filename = "code.js";
        compileImage = "node:20-alpine";
        runImage = "node:20-alpine";
      } else if (language === "python") {
        filename = "code.py";
        compileImage = "python:3.11-alpine";
        runImage = "python:3.11-alpine";
      } else if (language === "cpp") {
        filename = "code.cpp";
        compileImage = "gcc:13";
        runImage = "gcc:13-bookworm";
      } else {
        resolveOnce({
          status: "internal_error",
          stdout: "",
          stderr: "Unsupported language",
          executionTime: 0,
        });
        return;
      }

      const filePath = path.join(jobDir, filename);
      fs.writeFileSync(filePath, code);

      /* =============================== */
      /* C++ COMPILE STEP                */
      /* =============================== */

      const compileCpp = (): Promise<boolean> => {
        return new Promise((resolveCompile) => {
          const compileArgs = [
            "run",
            "--rm",
            "-v",
            `${jobDir.replace(/\\/g, "/")}:/app`,
            "-w",
            "/app",
            compileImage,
            "g++",
            filename,
            "-O2",
            "-std=c++17",
            "-static",
            "-o",
            "main",
          ];

          const compile = spawn("docker", compileArgs);

          let compileError = "";

          compile.stderr.on("data", (data) => {
            compileError += data.toString();
          });

          compile.on("close", (code) => {
            if (code !== 0) {
              resolveOnce({
                status: "runtime_error",
                stdout: "",
                stderr: compileError.trim() || "Compilation failed",
                executionTime: 0,
              });
              resolveCompile(false);
            } else {
              resolveCompile(true);
            }
          });

          compile.on("error", () => {
            resolveOnce({
              status: "internal_error",
              stdout: "",
              stderr: "Compiler execution failed",
              executionTime: 0,
            });
            resolveCompile(false);
          });
        });
      };

      /* =============================== */
      /* RUN PROGRAM                     */
      /* =============================== */

      const runProgram = (command: string[]) => {
        const dockerArgs = [
          "run",
          "--rm",
          "--memory=128m",
          "--cpus=0.5",
          "--pids-limit=64",
          "--network=none",
          "-i",
          "-v",
          `${jobDir.replace(/\\/g, "/")}:/app`,
          "-w",
          "/app",
          runImage,
          ...command,
        ];

        const child = spawn("docker", dockerArgs);

        let stdout = "";
        let stderr = "";
        let resolved = false;

        const startTime = Date.now();

        const timeout = setTimeout(() => {
          child.kill("SIGKILL");

          if (!resolved) {
            resolved = true;

            resolveOnce({
              status: "time_limit_exceeded",
              stdout: "",
              stderr: "Execution timed out",
              executionTime: Date.now() - startTime,
            });
          }
        }, TIME_LIMIT);

        /* STDIN */
        if (input) {
          child.stdin.write(input.endsWith("\n") ? input : input + "\n");
        }

        child.stdin.end();

        /* STDOUT */
        child.stdout.on("data", (data) => {
          stdout += data.toString();

          if (stdout.length > MAX_OUTPUT) {
            stdout = stdout.slice(0, MAX_OUTPUT);
            child.kill("SIGKILL");
          }
        });

        /* STDERR */
        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("close", (code) => {
          clearTimeout(timeout);

          stdout = stdout.replace(/\r\n/g, "\n").trim();
          stderr = stderr.replace(/\r\n/g, "\n").trim();

          if (!resolved) {
            resolved = true;

            if (code !== 0 && stderr.length > 0) {
              resolveOnce({
                status: "runtime_error",
                stdout,
                stderr,
                executionTime: Date.now() - startTime,
              });
            } else {
              resolveOnce({
                status: "accepted",
                stdout,
                stderr,
                executionTime: Date.now() - startTime,
              });
            }
          }
        });

        child.on("error", () => {
          clearTimeout(timeout);

          if (!resolved) {
            resolved = true;

            resolveOnce({
              status: "internal_error",
              stdout: "",
              stderr: "Execution failed",
              executionTime: Date.now() - startTime,
            });
          }
        });
      };

      /* =============================== */
      /* EXECUTION FLOW                  */
      /* =============================== */

      if (language === "cpp") {
        const compiled = await compileCpp();
        if (!compiled) return;

        runProgram(["./main"]);
      } else {
        const cmd =
          language === "javascript"
            ? ["node", filename]
            : ["python3", filename];

        runProgram(cmd);
      }
    });
  });
};