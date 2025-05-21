
/**
 * Utility to create a promise that rejects after a timeout
 * @param ms Timeout in milliseconds
 */
export const createTimeout = (ms: number) => {
  return new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operação expirou após ${ms}ms`));
    }, ms);
  });
};

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap
 * @param ms Timeout in milliseconds
 */
export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    createTimeout(ms)
  ]);
};

/**
 * Retries a function with exponential backoff
 * @param fn Function that returns a promise
 * @param retries Maximum number of retries
 * @param initialDelay Initial delay in ms
 * @param factor Backoff factor
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  initialDelay = 1000,
  factor = 2
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) {
      throw error;
    }
    
    // Wait for the delay
    await new Promise(resolve => setTimeout(resolve, initialDelay));
    
    // Retry with increased delay
    return withRetry(fn, retries - 1, initialDelay * factor, factor);
  }
};

/**
 * Creates an abortable fetch request
 * @param url The URL to fetch
 * @param options Fetch options
 * @param timeoutMs Timeout in milliseconds
 */
export const abortableFetch = <T>(
  url: string,
  options?: RequestInit,
  timeoutMs = 10000
): { promise: Promise<T>; abort: () => void } => {
  const controller = new AbortController();
  const { signal } = controller;
  
  const promise = withTimeout(
    fetch(url, { ...options, signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      }),
    timeoutMs
  );
  
  return {
    promise,
    abort: () => controller.abort()
  };
};
