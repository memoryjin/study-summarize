import Dep from './Dep.js'
class Observer {
  constructor (data) {
    this.data = data
    this.walk(data)
  }

  walk (data) {
    Object.keys(data).forEach(key => {
      this.defineReactive(this.data, key, data[key])
    })
  }

  defineReactive (data, key, val) {
    const dep = new Dep()
    // 如果val是对象的继续遍历添加get和set
    observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        Dep.target && dep.depend() //收集依赖
        return val
      },
      set: function (newVal) {
        if (newVal === val) {
          return
        }
        val = newVal
        // 如果设置的新值是对象的话则对新对象继续遍历添加get和set
        observe(newVal)
        dep.notify()
      }
    })
  }
}

const observe = function (value) {
  if (typeof value !== 'object' || value === null) {
    return
  }
  new Observer(value)
}

export default observe
