import workerFunction from './worker.js';

export default function webWorkerThread({
  fn,
  args = [],
  context
}) {
  function _isRegularFunction(fn) {
    return Object.getPrototypeOf(fn) === Function.prototype;
  }
  
  function _isAsyncFunction(fn) {
    return fn instanceof (async function () { }).constructor;
  }
  
  return new Promise((resolve, reject) => {
    if (!fn) {
      reject('function not provided');
    }

    const isRefularFunction = _isRegularFunction(fn);
    const isAsyncFunction = isRefularFunction ? false : _isAsyncFunction(fn);

    if (isRefularFunction || isAsyncFunction) {
      const blobData = `(${workerFunction})()`;
      const blob = new Blob([blobData], {
        type: 'application/javascript'
      });

      // create URL for this blob object
      const blobURL = URL.createObjectURL(blob);
      const worker = new Worker(blobURL);

      const workerData = {
        fn,
        args,
        context
      }

      const stringifiedWorkerData = JSON.stringify(workerData, (_, value) => {
        if (typeof value === 'function') {
          return `__function__${value.toString()}`
        }
        return value;
      })

      worker.postMessage(stringifiedWorkerData);

      worker.onmessage = e => {
        worker.terminate();
        const {
          isSuccessful,
          result,
          errorMessage
        } = e.data;
        if (isSuccessful) {
          resolve(result);
        } else {
          reject(errorMessage)
        }
      }
    } else {
      reject('fn should be a function');
    }
  })
}