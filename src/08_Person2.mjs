
console.log('這是在 Person2 裡面一開始')

class Person{
    constructor(name='Kris', age=25){
        this.name = name;
        this.age = age;
    };

    toString(){
        const {name, age} = this;
        return JSON.stringify({name, age})
    }
};

// ESM 一般匯出(第一種)--
export const f1 = a => a*a;
const f2 = a => a*a*a;


console.log('這是在 Person2 裡面')

// 使用 ESM 時，要匯出跟要匯入的檔案 附檔名都要為 .mjs
// ESM 預設匯出--
export default Person;  // default: 預設(主要)匯出的東西，只能有一個

console.log('這是在 Person2 裡面最後')

// ESM 一般匯出(第二種)--
export {f2};