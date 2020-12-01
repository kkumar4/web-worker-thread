import workerThread from '../src.js';

function adder(a, b, ...nums) {
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
  .catch(error => console.log(error));

function randomNoGenerator(max, min) {
  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  let randomNos = [];
  for (let i = 0; i < 100000; i++) {
    randomNos.push(generateRandomNumber(min, max));
  }
  return randomNos;
}

workerThread({
  fn: randomNoGenerator,
  args: [1, 10]
})
  .then(result => console.log(result))
  .catch(error => console.log(error));

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