import webWorkerThread from '../src/index.js';

// Normal function
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


// Object Method
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

// Async Function
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