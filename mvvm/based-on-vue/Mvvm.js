import observe from './observe.js'
import Compile from './Compile.js'
import Watcher from './Watcher.js'
class MVVM {
  constructor (options) {
    this.$options = options
    const data = this._data = this.$options.data
    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })

    this._initComputed()
    console.log(this)

    observe(data, this)

    this.$compile = new Compile(options.el || document.body, this)
  }

  $watch (key, cb, options) {
    new Watcher(this, key, cb)
  }

  _proxyData(key) {
    const self = this
    Object.defineProperty(self, key, {
      configurable: false,
      enumerable: true,
      get: function () {
        return self._data[key]
      },
      set: function (newVal) {
        self._data[key] = newVal
      }
    })
  }

  _initComputed () {
    const self = this
    const computed = this.$options.computed
    if (typeof computed === 'object' && computed !== null) {
      Object.keys(computed).forEach(key => {
        Object.defineProperty(self, key, {
          get: computed[key]
        })
      })
    }
  }
}

export default MVVM