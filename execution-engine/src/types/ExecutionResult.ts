export type ExecutionStatus =
  | "accepted"
  | "runtime_error"
  | "time_limit_exceeded"
  | "internal_error";

export interface ExecutionResult {
  status: ExecutionStatus;
  stdout: string;
  stderr: string;
  executionTime: number;
}