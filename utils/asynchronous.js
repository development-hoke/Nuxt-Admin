/**
 * @param {Function[]} callbacks
 * @returns Promise
 */
export const createSequence = (callbacks, waitNextMs = 0) => {
  return new Promise((resolve, reject) => {
    let lastPromise = callbacks.shift()()

    callbacks.forEach((callback) => {
      lastPromise = lastPromise
        .then((_resolve) => {
          setTimeout(_resolve, waitNextMs)
        })
        .then(callback)
    })

    lastPromise.then(resolve).catch(reject)
  })
}
