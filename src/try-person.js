
// const Person = require('./Person.js');
const Person = require('./Person'); // 副檔名可省略(.js / .json)
// --一定要 './' 不然會被以為是套件

const p1 = new Person('David', 25);

console.log(p1.toString());