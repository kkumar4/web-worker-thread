# Description
    A promise based npm package for off-loading CPU intensive tasks to the web worker.
    This package has no dependency on any external package and works on all modern browsers.

# Installation
    npm i web-worker-thread --save

# Supported Functions
  - Function Declaration
  - Function Expression
  - Arrow Functions
  - Object Methods
  - Async Functions

# Usage

  webWorkerThread expects a single argument of type object with three properties:
  - fn(required): the function to be executed
  - args(optional): the array of arguments that will be passed to the function
  - context(optional): the `this` keyword to be used inside the function 

# Examples

  #### Normal Function

  ```
    import webWorkerThread from 'web-worker-thread';

    function randomNoGenerator(max, min) {
      const generateRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
      }

      let randomNos = [];
      for (let i = 0; i < 1000000; i++) {
        randomNos.push(generateRandomNumber(min, max));
      }
      return randomNos;
    }

    webWorkerThread({
      fn: randomNoGenerator,
      args: [1, 10]
    })
      .then(result => console.log(result))
      .catch(error => console.log(error));
```

#### Object Method

  ```
    import webWorkerThread from 'web-worker-thread';

    function Person(firstName, lastName) {
      this.firstName = firstName;
      this.lastName = lastName;
    }

    Person.prototype.getFullName = function () {
      return `${this.firstName} ${this.lastName}`;
    }

    const john = new Person('John', 'Doe');

    webWorkerThread({
      fn: john.getFullName,
      context: john
    })
      .then(result => console.log(result))
      .catch(error => console.error(error));
  ```

#### Async Function

  ```
    import webWorkerThread from 'web-worker-thread';

    async function getUsers() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        return data;
      } catch (e) {
        return [];
      }
    }

    webWorkerThread({
      fn: getUsers
    })
      .then(data => console.log(data))
      .catch(error => console.log(error))
  ```