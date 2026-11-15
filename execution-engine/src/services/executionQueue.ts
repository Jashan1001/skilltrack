const MAX_CONCURRENT = 5;
const MAX_WAITING = 50;

export class ExecutionQueueFullError extends Error {
  constructor() {
    super("Execution queue is full");
    this.name = "ExecutionQueueFullError";
  }
}

let activeExecutions = 0;
const queue: Array<() => void> = [];

const startNext = () => {
  const next = queue.shift();
  if (next) next();
};

export const enqueue = <T>(task: () => Promise<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    const start = () => {
      activeExecutions++;

      void (async () => {
        try {
          resolve(await task());
        } catch (error) {
          reject(error);
        } finally {
          activeExecutions--;
          startNext();
        }
      })();
    };

    if (activeExecutions < MAX_CONCURRENT) {
      start();
      return;
    }

    if (queue.length >= MAX_WAITING) {
      reject(new ExecutionQueueFullError());
      return;
    }

    queue.push(start);
  });
