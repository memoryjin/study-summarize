## example 1

```js
const pms1 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const num = Math.ceil(Math.random() * 10);
            num <= 5 ? resolve(num) : reject('这个数字太大了吧！');
        }, 4000);
    })
}
setInterval(() => {
    const promise = pms1();
    promise.then(data => {
        console.log(data);
    }, data => {
        console.log(data);
    })
}, 1000);

// 先放结论，第一次过5s输出一个结果，之后每隔1s输出一个结果，why？

/*
	0s --> initial
	1s --> 1个promise实例，wait 4s
	2s --> 2个promise实例，wait 4s 3s
	3s --> 3个promise实例，wait 4s 3s 2s
	4s --> 4个promise实例，wait 4s 3s 2s 1s
	5s --> 5个promise实例，wait 4s 3s 2s 1s，first one __promiseState__ enter fulfilled or rejected，执行完then()方法后根据垃圾回收机制将被销毁
	6s --> 5个promise实例，wait 4s 3s 2s 1s，first one __promiseState__ enter fulfilled or rejected，执行完then()方法后根据垃圾回收机制将被销毁
	...
*/
```

## example 2

```js
const pms1 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务1');
            resolve('执行任务1成功');
        }, 4000);
    })
}

const pms2 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务2');
            resolve('执行任务2成功');
        }, 3000);
    })
}

const pms3 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务3');
            resolve('执行任务3成功');
        }, 2000);
    })
}

// pms1, pms2, pms3并行执行，当三者全部执行结束后才会进入then方法
Promise.all([pms1(), pms2(), pms3()]).then(data => {
    console.log(data); // ["执行任务1成功", "执行任务2成功", "执行任务3成功"]
})

// 注意Promise.all的用法，此时调用then方法时对应的data也是一个数组，且与Promise.all(arr)中arr的value一一对应
```

## example 3
```js
const pms1 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务1');
            resolve('执行任务1成功');
        }, 4000);
    })
}

const pms2 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务2');
            resolve('执行任务2成功');
        }, 3000);
    })
}

const pms3 = function() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('执行任务3');
            resolve('执行任务3成功');
        }, 2000);
    })
}

// pms1, pms2, pms3并行执行，当三者中任意一个执行结束后即进入then方法中，此时的data即为第一个结束的promise的data
Promise.race([pms1(), pms2(), pms3()]).then(data => {
    console.log(data); // ["执行任务1成功", "执行任务2成功", "执行任务3成功"]
})

// Promise.all --> 谁跑的慢，以谁为准执行回调，回调参数为各个promise的data构成的数组
// Promise.race --> 谁跑的快，以谁为准执行回调，回调参数为最快的那个promise的data
```