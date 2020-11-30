# Description
    npm package for off-loading CPU intensive tasks to web worker.
# Installation
    npm i worker-thread --save

    import workerThread from 'worker-thread';

    workerThread({
      fn: adder,
      args: [1, 2, 3]
    })
      .then(result => console.log(result))
      .catch(error => console.error(error));

    function adder(a, b, ...nums) {
      return a + b + nums.reduce((res, num) => {
        res += num;
        return res;
      }, 0);
    }