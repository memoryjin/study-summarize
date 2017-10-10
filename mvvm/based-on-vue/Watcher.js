import Dep from './Dep.js'
import objUtil from './objUtil.js'

class Watcher {
  constructor (vm, expOrFn, cb) {
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn
    this.depIds = {}

    this.getter = typeof expOrFn === 'function' ? expOrFn : this.parseGetter(expOrFn)
    this.value = this.get()
  }

  update () {
    this.run()
  }

  run () {
    const val = this.get()
    const oldVal = this.value
    if (val !== oldVal) {
      this.value = val
      this.cb.call(this.vm, val, oldVal)
    }
  }

  /* 
  1.Watcher每次实例化或者update的时候都会触发相应属性的getter，
    getter里会触发dep.depend()，继而触发这里的addDep
  2.假如相应属性的dep.id已经在当前watcher的depIds里，说明不是一个新的属性，
    仅仅是改变了其值而已，则不需要增加订阅者，反之增加一个订阅者
  */
  addDep (dep) {
    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep
    }
  }

  get () {
    Dep.target = this
    const value = this.getter.call(this.vm, this.vm)
    Dep.target = null
    return value
  }

  parseGetter (exp) {
    if (/[^\w.$]/.test(exp)) return
    return function (obj) {
      return objUtil.get(obj, exp)
    }
  }
}

export default Watcher