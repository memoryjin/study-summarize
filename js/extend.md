## 1. 有两个构造函数Person和Female，现想让Female的实例同时可以继承Person实例的属性和Person.prototype的方法:

```js
const Person = function() {
	this.name = 'jinchs';
	this.age = 25;
}
Person.prototype.sayMessage = function() {
	console.log(`The name is ${this.name}, and the age is ${this.age}.`);
}
const Female = function() {
	Person.call(this);
}
Female.prototype.sayYes = function() {
	console.log('yes');
}

/*---------------------方法1 通过ES6来设置原型链--------------------------*/
Object.setPrototypeOf(Female.prototype, Person.prototype);

/*--------------方法2 将一个构造函数的原型对象指向另一个构造函数的实例-----------------*/
Female.prototype = new Person();
Female.prototype.constructor = Female;

/*--------------方法3 通过Object.create方法实现原型链继承-----------------*/
Female.prototype = Object.create(Person.prototype);
Female.prototype.constructor = Female;

const female = new Female();
```

### 总结比较：

(1) 上述3个方法中，后两者相当于重写了子类的原型对象，因此sayYes的方法不复存在；  

(2) 而方法1是在没有重写子类原型对象的基础上改变了\_\_proto\_\_的指向，因此sayYes方法依旧存在；  

(3) 纯粹的原型链，继承的永远是原型对象上的属性和方法，定义在构造函数体内的属性和方法是无法通过原型链来实现继承的。  

## 2. 有一个obj1对象，现想让该对象可以直接调用定义在obj2上的方法，如何实现？

```js
const obj1 = {
	name: 'jinchs',
	age: 25
};
const obj2 = {
	sayMessage: function() {
		console.log(`The name is ${this.name}, and the age is ${this.age}.`);
	}
};
// 默认情况下，obj1.__proto__指向了Object.prototype，这里通过调用setPrototypeOf的方法，
// 将obj1.__proto__的指向改为obj2，从而obj1上可以调用obj2上的方法
Object.setPrototypeOf(obj1, obj2);

obj1.__proto__ === obj2 // true
obj1.__proto__.__proto__ === Object.prototype // true
```

#### 注意：由于改变了obj1.\_\_proto\_\_的指向，如果obj1之前继承自另一个构造函数Person，那么改变了\_\_proto\_\_指向后意味着obj1已经无法访问Person.prototype上的属性和方法了。

_思考题：如何在不打破原先继承关系的基础上让obj1也能调用obj2上的方法??_



