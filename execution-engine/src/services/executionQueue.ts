const MAX_CONCURRENT = 5;

let activeExecutions = 0;
const queue: (() => void)[] = [];

export const enqueue = (task: () => Promise<void>) => {
  return new Promise<void>((resolve, reject) => {
    const runTask = async () => {
      activeExecutions++;

      try {
        await task();
        resolve();
      } catch (err) {
        reject(err);
      } finally {
        activeExecutions--;
        processQueue();
      }
    };

    if (activeExecutions < MAX_CONCURRENT) {
      runTask();
    } else {
      queue.push(runTask);
    }
  });
};

const processQueue = () => {
  if (queue.length > 0 && activeExecutions < MAX_CONCURRENT) {
    const nextTask = queue.shift();
    if (nextTask) nextTask();
  }
};