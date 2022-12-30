
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

module.exports = Person;