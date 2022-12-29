
const Person2 = require('./Person2');
console.log('Hi kris');
const {Person, f2} = require('./Person2'); 
// --require 2 次並不會執行 Person2.js 2 次，require 過的資源會被記錄，將原有的參照直接再給 const {Person, f2}

console.log('Hiii');

const p1 = new Person('David', 25);

console.log(p1.toString());
console.log(f2(2));
