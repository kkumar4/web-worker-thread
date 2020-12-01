# Description
    A promise based npm package for off-loading CPU intensive tasks to the web worker. Please note that this will only work in the browser and not in the node environment.

# Installation
    npm i web-worker-thread --save

# Limitations
  - Async functions are not supported as of now but I do have plan to support that soon.

# Supported Function types
  - Function Declaration
  - Function Expression
  - Arrow Functions
  - Object Methods

# Usage

  workerThread expects a single argument of type object with three properties:
  - fn(required): the function to be executed
  - args(optional): the array of arguments that will be passed to the function
  - context(optional): the `this` keyword to be used inside the function 

# Examples

  #### Function Declaration

  ```
    import workerThread from 'web-worker-thread';

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
```

#### Function Expression

  ```
    import workerThread from 'web-worker-thread';

    const adder = function(a, b, ...nums) {
      return a + b + nums.reduce((res, num) => {
        res += num;
        return res;
      }, 0);
    }

    workerThread({
      fn: adder,
      args: [1, 2, 3]
    })
      .then(result => console.log(result))
      .catch(error => console.error(error));
```

#### Arrow Function

  ```
    import workerThread from 'web-worker-thread';

    const adder = (a, b, ...nums) => {
      return a + b + nums.reduce((res, num) => {
        res += num;
        return res;
      }, 0);
    }

    workerThread({
      fn: adder,
      args: [1, 2, 3]
    })
      .then(result => console.log(result))
      .catch(error => console.error(error));
```

#### Object Method

  ```
    import workerThread from 'web-worker-thread';

    function Person(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    Person.prototype.getFullName = function () {
      return `${this.firstName} ${this.lastName}`;
    }

    const john = new Person('John', 'Doe');

    workerThread({
      fn: john.getFullName,
      context: john
    })
      .then(result => console.log(result))
      .catch(error => console.error(error));
  ```