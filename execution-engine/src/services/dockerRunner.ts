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

export const runCode = (
  language: string,
  code: string,
  input: string
): Promise<ExecutionResult> => {
  return new Promise((resolveOuter) => {
    enqueue(() => {
      return new Promise<void>((resolveQueue) => {
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
          resolveQueue();
        };

        let filename = "";
        let dockerImage = "";

        if (language === "javascript") {
          filename = "code.js";
          dockerImage = "node:20-alpine";
        } else if (language === "python") {
          filename = "code.py";
          dockerImage = "python:3.11-alpine";
        } else if (language === "cpp") {
          filename = "code.cpp";
          dockerImage = "gcc:13";
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
        /* CPP FLOW — Compile then Execute */
        /* =============================== */
        if (language === "cpp") {
          const compileArgs = [
            "run",
            "--rm",
            "-v",
            `${jobDir.replace(/\\/g, "/")}:/app`,
            "-w",
            "/app",
            dockerImage,
            "g++",
            filename,
            "-O2",
            "-std=c++17",
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
                stderr: compileError || "Compilation failed",
                executionTime: 0,
              });
              return;
            }

            // Execution phase
            const runArgs = [
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
              dockerImage,
              "./main",
            ];

            const child = spawn("docker", runArgs);

            let stdout = "";
            let stderr = "";
            let resolved = false;
            const MAX_OUTPUT = 1024 * 1024;
            const TIME_LIMIT = 3000;
            const startTime = Date.now();

            const timeout = setTimeout(() => {
              child.kill();
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

            if (input) {
              child.stdin.write(input);
            }
            child.stdin.end();

            child.stdout.on("data", (data) => {
              stdout += data.toString();
              if (stdout.length > MAX_OUTPUT) {
                child.kill();
              }
            });

            child.stderr.on("data", (data) => {
              stderr += data.toString();
            });

            child.on("close", () => {
              clearTimeout(timeout);
              if (!resolved) {
                resolved = true;
                resolveOnce({
                  status: stderr ? "runtime_error" : "accepted",
                  stdout,
                  stderr,
                  executionTime: Date.now() - startTime,
                });
              }
            });
          });

          return;
        }

        /* =============================== */
        /* JS + PYTHON FLOW */
        /* =============================== */

        const dockerCommand =
          language === "javascript"
            ? ["node", filename]
            : ["python3", filename];

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
          dockerImage,
          ...dockerCommand,
        ];

        const child = spawn("docker", dockerArgs);

        let stdout = "";
        let stderr = "";
        let resolved = false;
        const MAX_OUTPUT = 1024 * 1024;
        const TIME_LIMIT = 3000;
        const startTime = Date.now();

        const timeout = setTimeout(() => {
          child.kill();
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

        if (input) {
          child.stdin.write(input);
        }
        child.stdin.end();

        child.stdout.on("data", (data) => {
          stdout += data.toString();
          if (stdout.length > MAX_OUTPUT) {
            child.kill();
          }
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        child.on("close", () => {
          clearTimeout(timeout);
          if (!resolved) {
            resolved = true;
            resolveOnce({
              status: stderr ? "runtime_error" : "accepted",
              stdout,
              stderr,
              executionTime: Date.now() - startTime,
            });
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
      });
    });
  });
};