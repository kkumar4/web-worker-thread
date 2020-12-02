export default function () {
  function _isAsyncFunction(fn) {
    return fn instanceof (async function () { }).constructor;
  }

  function getFunctionTypeParametersAndBody(fn) {
    try {
      let
        fnParams = '',
        fnBody = '',
        isAsyncFunction = fn.startsWith('async')
        ;
      if (isAsyncFunction) {
        fn = fn.slice(5).trim();
      }
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
        fnBody,
        isAsyncFunction
      }
    } catch (e) {
      throw new Error('something went wrong while getting function parameters and body');
    }
  }

  self.onmessage = async function (e) {
    try {
      const data = JSON.parse(e.data, function (_, value) {
        if (typeof value === 'string' && value.startsWith('__function__')) {
          const {
            fnParams,
            fnBody,
            isAsyncFunction
          } = getFunctionTypeParametersAndBody(value.slice(12));
          if (!isAsyncFunction) {
            return new Function(fnParams, fnBody);
          } else {
            const AsyncFunctionConstructor = Object.getPrototypeOf(async function () { }).constructor;
            return new AsyncFunctionConstructor(fnParams, fnBody);
          }
        }
        return value;
      });
      const {
        fn,
        args,
        context = self
      } = data;
      let result;
      if (_isAsyncFunction(fn)) {
        result = await fn.call(context, ...args);
      } else {
        result = fn.call(context, ...args);
      }

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