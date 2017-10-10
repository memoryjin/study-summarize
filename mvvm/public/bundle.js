/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
let uid = 0
class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  depend () {
    Dep.target.addDep(this)
  }

  removeSub (sub) {
    const index = this.subs.indexOf(sub)
    if (index !== -1) {
      this.subs.splice(index, 1)
    }
  }

  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
Dep.target = null

/* harmony default export */ __webpack_exports__["a"] = (Dep);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const objUtil = {
  get(obj = {}, path) {
    if (!obj || !path) {
      return null;
    }
    const array = path.split('.');
    for (let i = 0, len = array.length; i < len; i++) {
      obj = obj[array[i]];
      if (obj === null || typeof obj === 'undefined') {
        return null;
      }
    }
    return obj;
  },
  set(obj = {}, path, value) {
    if (!obj || !path) {
      return null;
    }
    const array = path.split('.');
    for (let i = 0, len = array.length; i < len; i++) {
      if (i < len - 1) {
        obj = (obj[array[i]] = obj[array[i]] || {});
      } else {
        obj[array[i]] = value;
      }
    }
  },
  remove(obj = {}, path) {
    if (!obj || !path) {
      return null;
    }
    const array = path.split('.');
    for (let i = 0, len = array.length; i < len; i++) {
      if (i < len - 1) {
        obj = (obj[array[i]] = obj[array[i]] || {});
      } else {
        delete obj[array[i]];
      }
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (objUtil);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dep_js__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__objUtil_js__ = __webpack_require__(1);



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
    __WEBPACK_IMPORTED_MODULE_0__Dep_js__["a" /* default */].target = this
    const value = this.getter.call(this.vm, this.vm)
    __WEBPACK_IMPORTED_MODULE_0__Dep_js__["a" /* default */].target = null
    return value
  }

  parseGetter (exp) {
    if (/[^\w.$]/.test(exp)) return
    return function (obj) {
      return __WEBPACK_IMPORTED_MODULE_1__objUtil_js__["a" /* default */].get(obj, exp)
    }
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Watcher);

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__based_on_vue_Mvvm_js__ = __webpack_require__(4);

const vm = new __WEBPACK_IMPORTED_MODULE_0__based_on_vue_Mvvm_js__["a" /* default */]({
  el: '#mvvm-app',
  data: {
      word: 'Hello World!',
      age: 25
  },
  methods: {
      sayHi: function() {
          this.word = 'Hi, everybody!'
      }
  },
  computed: {
    wordReverse () {
      return this.word.split('').reverse().join('')
    }
  }
})


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__observe_js__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Compile_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Watcher_js__ = __webpack_require__(2);



class MVVM {
  constructor (options) {
    this.$options = options
    const data = this._data = this.$options.data
    Object.keys(data).forEach(key => {
      this._proxyData(key)
    })

    this._initComputed()
    console.log(this)

    Object(__WEBPACK_IMPORTED_MODULE_0__observe_js__["a" /* default */])(data, this)

    this.$compile = new __WEBPACK_IMPORTED_MODULE_1__Compile_js__["a" /* default */](options.el || document.body, this)
  }

  $watch (key, cb, options) {
    new __WEBPACK_IMPORTED_MODULE_2__Watcher_js__["a" /* default */](this, key, cb)
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

/* harmony default export */ __webpack_exports__["a"] = (MVVM);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Dep_js__ = __webpack_require__(0);

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
    const dep = new __WEBPACK_IMPORTED_MODULE_0__Dep_js__["a" /* default */]()
    // 如果val是对象的继续遍历添加get和set
    observe(val)
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get: function () {
        __WEBPACK_IMPORTED_MODULE_0__Dep_js__["a" /* default */].target && dep.depend() //收集依赖
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

/* harmony default export */ __webpack_exports__["a"] = (observe);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__objUtil_js__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Watcher_js__ = __webpack_require__(2);


class Compile {
  constructor (el, vm) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    if (this.$el) {
      // 将目标节点底下的所有子节点移动到documentFragment中
      this.$fragment = this.node2Fragment(this.$el)
      // 初始化编译fragment下所有节点
      this.init()
      // 将编译后的所有节点重新挂载到目标元素之下
      this.$el.appendChild(this.$fragment)
    }
  }

  node2Fragment (el) {
    let fragment = document.createDocumentFragment(),
        child
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }

  init () {
    this.compileElement(this.$fragment)
  }

  compileElement (el) {
    let childNodes = el.childNodes
    for (let node of childNodes) {
      const text = node.textContent,
            reg = /\{\{(.*)\}\}/

      if (this.isElementNode(node)) {
        this.compileAttr(node) //元素节点编译所有的属性
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1) //编译匹配的文本节点
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    }
  }

  compileAttr (node) {
    const nodeAttrs = node.attributes
    for (let attr of nodeAttrs) {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const exp = attr.value,
              dir = attrName.substring(2)
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir)
        } else {
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }
        node.removeAttribute(attrName)
      }
    }
  }

  compileText (node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  isDirective (attr) {
    return attr.indexOf('v-') === 0
  }

  isEventDirective (dir) {
    return dir.indexOf('on') === 0
  }

  isElementNode (node) {
    return node.nodeType === 1
  }

  isTextNode (node) {
    return node.nodeType === 3
  }
}

const compileUtil = {
  text (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  html (node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },

  model (node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    let val = this._getVMVal(vm, exp)
    node.addEventListener('input', e => {
      const newVal = e.target.value
      if (val === newVal) return
      this._setVMVal(vm, exp, newVal)
      val = newVal
    })
  },

  class (node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  bind (node, vm, exp, dir) {
    // 根据指令类型调用对应方法更新视图
    const updaterFn = updater[dir + 'Updater']
    updaterFn && updaterFn(node, this._getVMVal(vm, exp))
    // 订阅数据变化，绑定更新函数
    new __WEBPACK_IMPORTED_MODULE_1__Watcher_js__["a" /* default */](vm, exp, (val, oldVal) => {
      updaterFn && updaterFn(node, val, oldVal)
    })
  },

  eventHandler (node, vm, exp, dir) {
    const eventType = dir.split(':')[1],
          fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm))
    }
  },

  _getVMVal (vm, exp) {
    return __WEBPACK_IMPORTED_MODULE_0__objUtil_js__["a" /* default */].get(vm, exp)
  },

  _setVMVal (vm, exp, val) {
    __WEBPACK_IMPORTED_MODULE_0__objUtil_js__["a" /* default */].set(vm, exp, val)
  }
}

const updater = {
  textUpdater (node, val) {
    node.textContent = typeof val === 'undefined' ? '' : val
  },

  htmlUpdater (node, val) {
    node.innerHTML = typeof val === 'undefined' ? '' : val
  },

  classUpdater (node, val, oldVal) {
    let className = node.className
    className = className.replace(oldVal, '').replace(/\s$/, '')
    const space = className && String(val) ? ' ' : ''
    node.className = className + space + val
  },

  modelUpdater (node, val, oldVal) {
    node.value = typeof val === 'undefined' ? '' : val
  }
}

/* harmony default export */ __webpack_exports__["a"] = (Compile);

/***/ })
/******/ ]);