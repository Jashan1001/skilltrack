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

        let filename = "";
        let dockerImage = "";
        let dockerCommand: string[] = [];

        // Language Selection
        if (language === "javascript") {
          filename = "code.js";
          dockerImage = "node:20-alpine";
          dockerCommand = ["node", filename];
        } else if (language === "python") {
          filename = "code.py";
          dockerImage = "python:3.11-alpine";
          dockerCommand = ["python3", filename];
        } else if (language === "cpp") {
          filename = "code.cpp";
          dockerImage = "gcc:13";
          dockerCommand = ["sh", "-c", `g++ ${filename} -o main && ./main`];
        } else {
          resolveOuter({
            status: "internal_error",
            stdout: "",
            stderr: "Unsupported language",
            executionTime: 0
          });
          resolveQueue();
          return;
        }

        const filePath = path.join(jobDir, filename);
        fs.writeFileSync(filePath, code);

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
          ...dockerCommand
        ];

        const startTime = Date.now();
        const child = spawn("docker", dockerArgs);

        let stdout = "";
        let stderr = "";
        let outputSize = 0;
        let resolved = false;

        const MAX_OUTPUT = 1024 * 1024;
        const TIME_LIMIT = 5000;

        const cleanup = () => {
          try {
            fs.rmSync(jobDir, { recursive: true, force: true });
          } catch {}
        };

        const resolveOnce = (result: ExecutionResult) => {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolveOuter(result);
            resolveQueue();
          }
        };

        if (input) {
          child.stdin.write(input);
        }
        child.stdin.end();

        child.stdout.on("data", (data) => {
          outputSize += data.length;

          if (outputSize > MAX_OUTPUT) {
            child.kill();
            resolveOnce({
              status: "runtime_error",
              stdout: "",
              stderr: "Output limit exceeded",
              executionTime: Date.now() - startTime
            });
          } else {
            stdout += data.toString();
          }
        });

        child.stderr.on("data", (data) => {
          stderr += data.toString();
        });

        const timeout = setTimeout(() => {
          child.kill();
          resolveOnce({
            status: "time_limit_exceeded",
            stdout: "",
            stderr: "Execution timed out",
            executionTime: Date.now() - startTime
          });
        }, TIME_LIMIT);

        child.on("close", () => {
          clearTimeout(timeout);

          if (!resolved) {
            resolveOnce({
              status: stderr ? "runtime_error" : "accepted",
              stdout,
              stderr,
              executionTime: Date.now() - startTime
            });
          }
        });

        child.on("error", () => {
          clearTimeout(timeout);
          resolveOnce({
            status: "internal_error",
            stdout: "",
            stderr: "Execution failed",
            executionTime: Date.now() - startTime
          });
        });
      });
    });
  });
};