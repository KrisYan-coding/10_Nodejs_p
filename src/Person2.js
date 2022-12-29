
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

const f1 = a => a*a;
const f2 = a => a*a*a;


console.log('這是在 Person2 裡面')

module.exports = {Person, f2}; //同時匯出多個
// --匯出什麼對方就只能匯入什麼

console.log('這是在 Person2 裡面最後')