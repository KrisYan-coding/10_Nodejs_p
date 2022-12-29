
const {Person, f2} = require('./Person2'); 
// --匯入時解構

console.log('Hiii');

const p1 = new Person('David', 25);

console.log(p1.toString());
console.log(f2(2));
console.log(f1(2)); // ReferenceError: f1 is not defined : 因為 Person2.js 沒有匯出