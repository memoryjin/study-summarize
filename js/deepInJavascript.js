Function.prototype.call = function (context, ...args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.apply = function (context, args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}

Function.prototype.bind = function (context, ...args1) {
  const self = this
  return function (...args2) {
    // 为了模拟ES5，然后我用了ES6. - -
    if (typeof new.target !== 'undefined') {
      context = this
    }
    return self.call(context, ...args1, ...args2)
  }
}

// 模拟new实现
function objectFactory (func, ...args) {
  const obj = {}
  const temp = func.apply(obj, args)
  Object.setPrototypeOf(obj, func.prototype)
  return typeof temp === 'object' ? temp : obj
}
