const Person = function(name) {
	this.name = name;
}
Person.prototype.sayName = function() {
	console.log(this.name);
}
const Female = function(name) {
	this.name = name;
};
Object.setPrototypeOf(Female.prototype, Person.prototype); // 通过ES6来设置原型链
// Female.prototype = new Person(); // 让构造函数的原型对象等于另一个构造函数的实例
// Female.prototype = Object.create(Person.prototype); //通过create实现原型链继承
// Female.prototype.constructor = Female;
const female = new Female('ljy');



const obj = {name: 'jinchs'};
Object.setPrototypeOf(obj, Person.prototype);