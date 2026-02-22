import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ExecutionResult } from "../types/ExecutionResult";

export const runJavaScript = (
  code: string,
  input: string
): Promise<ExecutionResult> => {
  return new Promise((resolve) => {
    const jobId = uuidv4();
    const jobDir = path.join(__dirname, "..", "..", "jobs", jobId);

    fs.mkdirSync(jobDir, { recursive: true });

    const codePath = path.join(jobDir, "code.js");
    fs.writeFileSync(codePath, code);

    const dockerArgs = [
      "run",
      "--rm",
      "--memory=128m",
      "--cpus=0.5",
      "--pids-limit=64",
      "--network=none",
      "-i", // required for stdin piping
      "-v",
      `${jobDir.replace(/\\/g, "/")}:/app`,
      "-w",
      "/app",
      "node:20-alpine",
      "node",
      "code.js"
    ];

    const startTime = Date.now();
    const child = spawn("docker", dockerArgs);

    let stdout = "";
    let stderr = "";
    let outputSize = 0;
    let resolved = false;

    const MAX_OUTPUT = 1024 * 1024; // 1MB
    const TIME_LIMIT = 5000; // 5 seconds

    const cleanup = () => {
      try {
        fs.rmSync(jobDir, { recursive: true, force: true });
      } catch {}
    };

    const resolveOnce = (result: ExecutionResult) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(result);
      }
    };

    // Send input safely
    if (input) {
      child.stdin.write(input);
    }
    child.stdin.end();

    // Capture stdout with limit
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

    // Capture stderr
    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    // Timeout protection
    const timeout = setTimeout(() => {
      child.kill();
      resolveOnce({
        status: "time_limit_exceeded",
        stdout: "",
        stderr: "Execution timed out",
        executionTime: Date.now() - startTime
      });
    }, TIME_LIMIT);

    // When container exits
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

    // ocker spawn failure
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
};