/**
 * @param promise A promise to resolve
 * @param maxAtempts  Number of tries before rejecting
 * @desc Retries a promise n no. of times before rejecting.
 * @returns resolved promise
 */
export async function retryPromise<T>(
  promise: Promise<T>,
  maxAtempts: number,
): Promise<T> {
  try {
    // try to resolve the promise
    const data = await promise;
    // if resolved simply return the result back to the caller
    return data;
  } catch (e) {
    // if the promise fails and we are down to 1 try we reject
    if (maxAtempts === 1) {
      return Promise.reject(e);
    }
    // if the promise fails and the current try is not equal to 1
    // we call this function again from itself but this time
    // we reduce the no. of tries by one
    // so that eventually we reach to "1 try left" where we know we have to stop and reject
    console.log('retrying', maxAtempts, 'time');
    // we return whatever is the result of calling the same function
    return retryPromise(promise, maxAtempts - 1);
  }
}
