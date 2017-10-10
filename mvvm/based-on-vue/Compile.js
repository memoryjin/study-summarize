import objUtil from './objUtil.js'
import Watcher from './Watcher.js'
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
    new Watcher(vm, exp, (val, oldVal) => {
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
    return objUtil.get(vm, exp)
  },

  _setVMVal (vm, exp, val) {
    objUtil.set(vm, exp, val)
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

export default Compile