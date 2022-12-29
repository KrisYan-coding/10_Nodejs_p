
const Person2 = require('./Person2'); 
// --Person2 = {Person, f2} 這個 object
// --require 時會執行被 require的檔案全部( Person2.js )

console.log('Hiii');

const p1 = new Person2.Person('David', 25);
// --Person2 = {Person: Person, f2: f2} 

console.log(p1.toString());
console.log(Person2.f2(2));