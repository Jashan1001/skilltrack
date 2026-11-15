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

const MAX_OUTPUT_BYTES = 64 * 1024;
const MAX_CODE_BYTES = 80 * 1024;
const MAX_INPUT_BYTES = 10 * 1024;
const RUN_TIME_LIMIT_SECONDS = 3;
const COMPILE_TIME_LIMIT_SECONDS = 10;
const OUTER_TIMEOUT_MS = 60_000;
type LanguageConfig = {
  filename: string;
  image: string;
  command: string[];
  timeoutMs: number;
  memory: string;
  cpus: string;
  compileFailureCode?: number;
};

const getLanguageConfig = (language: string): LanguageConfig | null => {
  switch (language) {
    case "javascript":
      return {
        filename: "code.js",
        image: "node:20-alpine",
        command: [
          "sh",
          "-c",
          `timeout -s KILL ${RUN_TIME_LIMIT_SECONDS} node /app/code.js; status=$?; if [ $status -eq 124 ] || [ $status -eq 137 ]; then echo SKILLTRACK_RUNTIME_TIMEOUT >&2; exit 102; fi; exit $status`,
        ],
        timeoutMs: OUTER_TIMEOUT_MS,
        memory: "128m",
        cpus: "0.5",
      };
    case "python":
      return {
        filename: "code.py",
        image: "python:3.11-alpine",
        command: [
          "sh",
          "-c",
          `timeout -s KILL ${RUN_TIME_LIMIT_SECONDS} python3 /app/code.py; status=$?; if [ $status -eq 124 ] || [ $status -eq 137 ]; then echo SKILLTRACK_RUNTIME_TIMEOUT >&2; exit 102; fi; exit $status`,
        ],
        timeoutMs: OUTER_TIMEOUT_MS,
        memory: "128m",
        cpus: "0.5",
      };
    case "cpp":
      return {
        filename: "code.cpp",
        image: "gcc:13-bookworm",
        command: [
          "sh",
          "-c",
          `timeout -s KILL ${COMPILE_TIME_LIMIT_SECONDS} g++ /app/code.cpp -O2 -std=c++17 -o /tmp/main; status=$?; if [ $status -eq 124 ] || [ $status -eq 137 ]; then echo SKILLTRACK_COMPILE_TIMEOUT >&2; exit 101; fi; if [ $status -ne 0 ]; then exit 100; fi; timeout -s KILL ${RUN_TIME_LIMIT_SECONDS} /tmp/main; status=$?; if [ $status -eq 124 ] || [ $status -eq 137 ]; then echo SKILLTRACK_RUNTIME_TIMEOUT >&2; exit 102; fi; exit $status`,
        ],
        timeoutMs: OUTER_TIMEOUT_MS,
        memory: "512m",
        cpus: "1",
        compileFailureCode: 100,
      };
    default:
      return null;
  }
};

const result = (
  status: ExecutionResult["status"],
  stdout = "",
  stderr = "",
  executionTime = 0
): ExecutionResult => ({ status, stdout, stderr, executionTime });

const removeContainer = (containerName: string): Promise<void> =>
  new Promise((resolve) => {
    const cleanup = spawn("docker", ["rm", "-f", containerName], {
      stdio: "ignore",
    });
    const timeout = setTimeout(() => {
      cleanup.kill("SIGKILL");
      resolve();
    }, 5_000);
    cleanup.once("error", () => {
      clearTimeout(timeout);
      resolve();
    });
    cleanup.once("close", () => {
      clearTimeout(timeout);
      resolve();
    });
  });

const runInContainer = (
  config: LanguageConfig,
  jobDir: string,
  containerName: string,
  input: string
): Promise<ExecutionResult> =>
  new Promise((resolve) => {
    const sourceDirectory = path.resolve(jobDir).replace(/\\/g, "/");
    const dockerArgs = [
      "run",
      "--rm",
      "--name",
      containerName,
      "--network=none",
      `--memory=${config.memory}`,
      `--memory-swap=${config.memory}`,
      `--cpus=${config.cpus}`,
      "--pids-limit=64",
      "--read-only",
      "--stop-timeout=1",
      "--cap-drop=ALL",
      "--security-opt=no-new-privileges:true",
      "--user=65534:65534",
      "--tmpfs",
      "/tmp:rw,nosuid,size=64m",
      "--mount",
      `type=bind,source=${sourceDirectory},target=/app,readonly`,
      "-w",
      "/app",
      "-i",
      config.image,
      ...config.command,
    ];

    const child = spawn("docker", dockerArgs, { stdio: ["pipe", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let settled = false;
    let outputExceeded = false;
    let timedOut = false;
    const startedAt = Date.now();

    const finish = (value: ExecutionResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(value);
    };

    const stopAndFinish = async (value: ExecutionResult) => {
      if (settled) return;
      child.kill("SIGKILL");
      await removeContainer(containerName);
      finish(value);
    };

    const timeout = setTimeout(() => {
      timedOut = true;
      void stopAndFinish(
        result("time_limit_exceeded", "", "Execution timed out", Date.now() - startedAt)
      );
    }, config.timeoutMs);

    child.stdout.on("data", (chunk: Buffer) => {
      if (settled || outputExceeded) return;
      stdoutBytes += chunk.length;
      if (stdoutBytes > MAX_OUTPUT_BYTES) {
        outputExceeded = true;
        void stopAndFinish(
          result("runtime_error", "", "Output exceeded the 64 KB limit", Date.now() - startedAt)
        );
        return;
      }
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk: Buffer) => {
      if (settled || outputExceeded) return;
      stderrBytes += chunk.length;
      if (stderrBytes > MAX_OUTPUT_BYTES) {
        outputExceeded = true;
        void stopAndFinish(
          result("runtime_error", "", "Error output exceeded the 64 KB limit", Date.now() - startedAt)
        );
        return;
      }
      stderr += chunk.toString("utf8");
    });

    child.once("error", () => {
      void stopAndFinish(result("internal_error", "", "Docker execution failed"));
    });

    child.once("close", (code) => {
      if (settled || timedOut || outputExceeded) return;
      const normalizedStdout = stdout.replace(/\r\n/g, "\n").trim();
      const normalizedStderr = stderr.replace(/\r\n/g, "\n").trim();
      const executionTime = Date.now() - startedAt;

      if (code === 0) {
        finish(result("accepted", normalizedStdout, normalizedStderr, executionTime));
      } else if (
        (code === 101 && normalizedStderr.includes("SKILLTRACK_COMPILE_TIMEOUT")) ||
        (code === 102 && normalizedStderr.includes("SKILLTRACK_RUNTIME_TIMEOUT"))
      ) {
        finish(result("time_limit_exceeded", normalizedStdout, "Execution timed out", executionTime));
      } else if (config.compileFailureCode === code) {
        finish(result("runtime_error", "", normalizedStderr || "Compilation failed", executionTime));
      } else if (code === null) {
        finish(result("internal_error", "", "Docker execution was interrupted", executionTime));
      } else {
        finish(result("runtime_error", normalizedStdout, normalizedStderr || "Program exited with an error", executionTime));
      }
    });

    child.stdin.on("error", () => {
      // A program may exit before consuming all input; the close event owns the result.
    });
    child.stdin.end(input);
  });

const execute = async (
  language: string,
  code: string,
  input: string
): Promise<ExecutionResult> => {
  const config = getLanguageConfig(language);
  if (!config) return result("internal_error", "", "Unsupported language");

  const jobId = uuidv4();
  const jobDir = path.join(__dirname, "..", "..", "jobs", jobId);
  const containerName = `skilltrack-${jobId}`;

  try {
    fs.mkdirSync(jobDir, { recursive: true, mode: 0o755 });
    fs.writeFileSync(path.join(jobDir, config.filename), code, { mode: 0o644 });
    return await runInContainer(config, jobDir, containerName, input);
  } catch {
    return result("internal_error", "", "Execution setup failed");
  } finally {
    try {
      fs.rmSync(jobDir, { recursive: true, force: true });
    } catch {
      // A later cleanup pass can remove a directory if the host briefly holds a file.
    }
  }
};

export const runCode = (language: string, code: string, input: string) => {
  if (Buffer.byteLength(code, "utf8") > MAX_CODE_BYTES) {
    return Promise.resolve(result("internal_error", "", "Code exceeds the execution limit"));
  }
  if (Buffer.byteLength(input, "utf8") > MAX_INPUT_BYTES) {
    return Promise.resolve(result("internal_error", "", "Input exceeds the execution limit"));
  }

  return enqueue(() => execute(language, code, input));
};
