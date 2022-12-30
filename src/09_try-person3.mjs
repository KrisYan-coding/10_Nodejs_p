
// ESM 就不能用 require，會出錯
// import Person from './08_Person2.mjs';
// // --export default 可以直接 import，

// console.log("Hi");

// import {f1} from './08_Person2.mjs';
// --一般 export 會被包成物件，需要解構

// --跟CJS一樣 './08_Person2.mjs' 也不會被執行兩次

// --shorten--

import Person, {f1, f2} from './08_Person2.mjs';
// --default 要放最前面


const p1 = new Person('David', 25);

console.log(p1.toString());
console.log(f1(2));
console.log(f2(2)); 