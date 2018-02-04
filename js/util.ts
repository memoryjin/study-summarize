interface Data {
  children?: Data[],
  key: string,
  value: string | number,
  [propName: string]: any
}

interface Dobject {
  [propName: string]: any
}

/**
 * @description 获取树状数据的最大(小)深度
 * @param {Data[]} dataList 
 * @param {boolean} [minDepth=false] 
 * @returns {number} 
 */
function getDepth (dataList: Data[], minDepth = false): number {
  const method = minDepth ? 'min' : 'max'
  return Math[method](...dataList.map(data => {
    return data.children && data.children.length ? 1 + getDepth(data.children, minDepth) : 1
  }))
}

/**
 * @description 获取树状结构中目标数值的路径
 * @param {Data[]} dataList 
 * @param {(string | number)} target 
 * @returns {string[]} 
 */
function findPath (dataList: Data[], target: string | number): string[] {
  const dataSource = JSON.parse(JSON.stringify(dataList))
  const res: Data[] = []
  let result: string[] = []
  res.push(...dataSource)
  for (const curData of res) {
    if (curData.value === target) {
      const findParent = (node: Data) => {
        result.unshift(node.key)
        if (node.parent) findParent(node.parent)
      }
      findParent(curData)
      return result
    }
    if (curData.children && curData.children.length) {
      res.push(...curData.children.map((d: Data) => {
        d.parent = curData
        return d
      }))
    }
  }
  return []
}

function isObject (obj: any): boolean {
  return (typeof obj === 'object' && obj !== null)
}
/**
 * @description 判断两个‘值’是否相等，注意isEqual([1,2,3], [1,2,3])为true
 * @param {*} obj1 
 * @param {*} obj2 
 * @returns {boolean} 
 */
function isEqual (obj1: any, obj2: any): boolean {
  if (isObject(obj1) && isObject(obj2)) {
    const key1List = Object.keys(obj1)
    const key2List = Object.keys(obj2)
    if (key1List.length !== key2List.length) return false
    return key1List.every(key => {
      return isEqual(obj1[key], obj2[key])
    })
  } else {
    return obj1 === obj2
  }
}

/**
 * @description 判断数值类型: undefined, null, boolean, string, number, symbol, array, function, object, set, map...
 * @param {*} obj 
 * @returns {string} 
 */
function type (obj: any): string {
  return Object.prototype.toString.call(obj)
    .replace(/\[object\s|\]/g, '')
    .replace(/[A-Z]/g, ($1: string) => $1.toLowerCase())
}

/**
 * @description 函数防抖, 在事件触发N秒后再触发回调
 * @param {Function} func 
 * @param {number} [delay=2000] 
 * @param {boolean} [immediate=true] 
 * @returns {(...args: any[]) => void} 
 */
function debounce (func: Function, delay = 2000, immediate = true): (...args: any[]) => void {
  let timer: number
  const debounced = (...args: any[]) => {
    timer && clearTimeout(timer)
    if (immediate && !timer) {
      func(...args)
      timer = 1
      return
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
  debounced.cancel = () => {
    clearTimeout(timer)
    timer = 0
  }
  return debounced
}

/**
 * @description 函数节流, 在时间T内事件最多触发一次
 * @param {Function} func 
 * @param {number} [interval=2000] 
 * @returns {(...args: any[]) => void} 
 */
function throttle (func: Function, interval = 2000): (...args: any[]) => void {
  let timer: number
  const throttled = (...args: any[]) => {
    if (timer) return
    timer = setTimeout(() => {
      func(...args)
      timer = 1
    }, interval)
  }
  throttled.cancel = () => {
    clearTimeout(timer)
    timer = 0
  }
  return throttled
}

/**
 * @description 获取一定范围内的随机数
 * @param {(number|string)} start 
 * @param {(number|string)} end 
 * @returns {number} 
 */
function random (start: number|string, end: number|string): number {
  start = +start
  end = +end
  return start + Math.floor(Math.random() * (end - start + 1))
}

const objUtil = {
  get (obj = {}, path: string) {
    path = path.replace(/\]/g, '').replace(/\[/g, '.')
    const keyList = path.split('.')
    for (const key of keyList) {
      obj = obj[key]
      if (obj === null && typeof obj === 'undefined') {
        return null
      }
    }
    return obj
  },
  set (obj = {}, path: string, value: any): void {
    path = path.replace(/\]/g, '').replace(/\[/g, '.')
    const keyList = path.split('.')
    for (let i = 0; i < keyList.length; i++) {
      if (i < keyList.length - 1) {
        obj = obj[keyList[i]]
        if (obj === null && typeof obj === 'undefined') {
          obj = {}
        }
      } else {
        obj[keyList[i]] = value
      }
    }
  },
  remove (obj = {}, path: string): void {
    path = path.replace(/\]/g, '').replace(/\[/g, '.')
    const keyList = path.split('.')
    for (let i = 0; i < keyList.length; i++) {
      if (i < keyList.length - 1) {
        obj = obj[keyList[i]]
        if (obj === null && typeof obj === 'undefined') {
          return
        }
      } else {
        delete obj[keyList[i]]
      }
    }
  }
}

/**
 * @description 函数科里化
 * @param {Function} fn 
 * @param {any[]} [args=[]] 
 * @returns {Function} 
 */
function curry (fn: Function, args: any[] = []): Function {
  return function (...params: any[]) {
    const _args = args.slice(0)
    for (const arg of params) {
      _args.push(arg)
    }
    if (_args.length < fn.length) {
      return curry.call(this, fn, _args)
    } else {
      return fn.apply(this, _args)
    }
  }
}

/**
 * @description 根据某个值重新排列数组，默认为升序排列
 * @param {Dobject[]} arr 
 * @param {string} path 
 * @param {string} [direction='asc'] 
 * @returns {Dobject[]} 
 */
function sortArrByRule (arr: Dobject[], path: string, direction = 'asc'): Dobject[] {
  return arr.sort((a, b) => {
    const valueA = objUtil.get(a, path)
    const valueB = objUtil.get(b, path)
    return direction === 'asc' ? valueA - valueB : valueB - valueA
  })
}

/**
 * @description 懒加载图片
 * @param {string} url 
 * @returns {Promise<{}>} 
 */
function lazyLoadImg (url: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = function () {
      resolve(img)
    }
    img.onerror = function (err) {
      reject(err)
    }
  })
}

function loadJs (url: string): Promise<{}> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    document.body.appendChild(script)
    script.onload = function () {
      resolve()
    }
    script.onerror = function () {
      reject()
    }
  })
}

class EventEmitter {
  tasks: {
    [propName: string]: Function[]
  }
  onceTasks: {
    [propName: string]: {
      fns: Function[],
      hasFired: boolean
    }
  }
  constructor () {
    this.tasks = {}
    this.onceTasks = {}
  }

  on (event, fn) {
    if (!this.tasks[event]) this.tasks[event] = []
    this.tasks[event].push(fn)
  }

  once (event, fn) {
    if (!this.onceTasks[event]) {
      this.onceTasks[event] = {
        fns: [],
        hasFired: false
      }
    }
    this.onceTasks[event].fns.push(fn)
  }

  fire (event, ...args) {
    const fns = this.tasks[event]
    const onceFns = this.onceTasks[event]
    if (fns && fns.length) {
      for (let fn of fns) {
        fn.apply(this, args)
      }
    }
    if (onceFns && !onceFns.hasFired) {
      for (let fn of onceFns.fns) {
        fn.apply(this, args)
      }
      onceFns.hasFired = true
    }
  }

  off (event, fn = null) {
    const fns = this.tasks[event]
    const onceFns = this.onceTasks[event]
    if (fns && fns.length) {
      this.tasks[event] = fn ? fns.filter(item => item !== fn) : []
    }
    if (onceFns && onceFns.fns && onceFns.fns.length) {
      this.onceTasks[event].fns = fn ? onceFns.fns.filter(item => item !== fn) : []
    }
  }
}

function sleep (seconds: number): Promise<{}> {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, seconds * 1000)
  })
}
