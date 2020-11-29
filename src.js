(function () {
  function workerFunction() {
    function getFunctionParametersAndBody(fn) {
      try {
        let
          fnParams = '',
          fnBody = ''
          ;
        if (fn.startsWith('function') || fn.match(/^[$A-Z_][0-9A-Z_$]*[\s]*\(/i)) {
          // get parameters between opening and closing parentheses
          fnParams = fn.slice(fn.indexOf('(') + 1, fn.indexOf(')'));

          fnBody = fn.slice(fn.indexOf('{') + 1, fn.length - 1);
        } else {
          // arrow function

          // arrow function in turn can contain arrow functions
          // so don't split on '=>'
          const indexOfArrow = fn.indexOf('=>');
          const params = fn.slice(0, indexOfArrow).trim();
          const body = fn.slice(indexOfArrow + 2).trim();
          if (params.startsWith('(')) {
            fnParams = fn.slice(fn.indexOf('(') + 1, fn.indexOf(')'));
          } else {
            fnParams = params;
          }
          if (body.startsWith('{')) {
            fnBody = body.slice(body.indexOf('{') + 1, body.length - 1);
          } else {
            fnBody = `return ${body}`;
          }
        }
        return {
          fnParams,
          fnBody
        }
      } catch (e) {
        throw new Error('something went wrong while getting function parameters and body');
      }
    }

    self.onmessage = function (e) {
      try {
        const data = JSON.parse(e.data, function (_, value) {
          if (typeof value === 'string' && value.startsWith('__function__')) {
            const { fnParams, fnBody } = getFunctionParametersAndBody(value.slice(12));
            return new Function(fnParams, fnBody);
          }
          return value;
        });
        const {
          fn,
          args,
          context = self
        } = data;
        const result = fn.call(context, ...args);
        self.postMessage({
          result,
          isSuccessful: true
        });
      } catch (e) {
        self.postMessage({
          isSuccessful: false,
          errorMessage: e.message
        });
      }
    }
  }

  function workerThread({
    fn,
    args = [],
    context
  }) {
    return new Promise((resolve, reject) => {
      if (!fn) {
        reject('function not provided');
      }

      if (Object.getPrototypeOf(fn) === Function.prototype) {
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
        reject('fn must of type function');
      }
    })
  }

  window.workerThread = workerThread;
})();

window.workerThread({
  fn: adder,
  args: [1, 2, 3]
})
  .then(result => console.log(result))
  .catch(error => console.log(error));

function adder(a, b, ...nums) {
  return a + b + nums.reduce((res, num) => {
    res += num;
    return res;
  }, 0);
}

function randomNoGenerator(max, min) {
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  let randomNos = [];
  for (let i = 0; i < 10000000; i++) {
    randomNos.push(generateRandomNumber(min, max));
  }
  return randomNos;
}