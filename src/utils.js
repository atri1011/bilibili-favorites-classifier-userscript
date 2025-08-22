/**
 * A utility function to retry a promise-based function with exponential backoff.
 * This is useful for handling transient network errors or API rate limits.
 *
 * @param {() => Promise<any>} fn The function that returns a promise to be executed.
 * @param {number} maxRetries The maximum number of retries.
 * @param {number} initialDelay The initial delay between retries in ms.
 * @param {(attempt: number) => void} onRetry A callback function that gets called before a retry attempt.
 * @returns {Promise<any>} A promise that resolves with the result of the function or rejects after all retries fail.
 */
export function retry(fn, { maxRetries = 3, initialDelay = 1000, onRetry = () => {} } = {}) {
    return new Promise((resolve, reject) => {
        let attempt = 0;

        const tryRequest = () => {
            fn()
                .then(resolve)
                .catch(err => {
                    attempt++;
                    if (attempt <= maxRetries) {
                        const delay = initialDelay * Math.pow(2, attempt - 1);
                        onRetry(attempt, delay);
                        setTimeout(tryRequest, delay);
                    } else {
                        reject(new Error(`Failed after ${maxRetries} retries: ${err.message}`));
                    }
                });
        };

        tryRequest();
    });
}