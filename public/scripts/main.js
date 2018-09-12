class Person{
    constructor (name) {
        this.name = name;
    }

    hello(){
        if(typeof this.name === 'string'){
            return 'Hello '+name;
        } else {
            return 'Hello';
        }
    }
}

var person = new Person('khanh 13');
var greetHTML = templates['greeting']({
    message: person.hello()
});

document.write(greetHTML); 