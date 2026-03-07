const MAX_CONCURRENT = 5;

let activeExecutions = 0;
const queue: (() => Promise<void>)[] = [];

export const enqueue = async (task: () => Promise<void>) => {
  return new Promise<void>((resolve, reject) => {
    const wrappedTask = async () => {
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
      wrappedTask();
    } else {
      queue.push(wrappedTask);
    }
  });
};

const processQueue = () => {
  if (queue.length === 0) return;

  if (activeExecutions >= MAX_CONCURRENT) return;

  const nextTask = queue.shift();

  if (nextTask) {
    nextTask();
  }
};