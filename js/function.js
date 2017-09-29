/**
 * @function makeEleDragble
 * @description 赋予某元素在一定范围内拖动的能力
 * @param {string} [containerSelector='body'] - 容器css选择器，默认为‘body’
 * @param {string} moveSelector - 可拖动的元素选择符
 */
const makeEleDragble = function(containerSelector = 'body', moveSelector) {
  let mousedown = false;
  let diffX, diffY;
  const moveEle = document.querySelector(moveSelector);
  const containerEle = document.querySelector(containerSelector);
  moveEle.style.position = 'absolute';
  if (getComputedStyle(containerEle).position === 'static') {
    containerEle.style.position = 'relative';
  }

  const getCanMoveArea = function() {
    const maxLeft = containerEle.offsetWidth - moveEle.offsetWidth - parseInt(getComputedStyle(containerEle)['border-width']) * 2;
    const maxTop = containerEle.offsetHeight - moveEle.offsetHeight - parseInt(getComputedStyle(containerEle)['border-width']) * 2;
    return [maxLeft, maxTop];
  }
  let [maxLeft, maxTop] = getCanMoveArea();

  const activateMove = function(e) {
    mousedown = true;
    diffX = e.clientX - moveEle.getBoundingClientRect().left;
    diffY = e.clientY - moveEle.getBoundingClientRect().top;
  }
  const cancelMove = function() {
    mousedown = false;
  }

  const move = function(e) {
    if (mousedown) {
      let left = e.clientX - containerEle.getBoundingClientRect().left - diffX - parseInt(getComputedStyle(containerEle)['border-width']);
      let top = e.clientY - containerEle.getBoundingClientRect().top - diffY - parseInt(getComputedStyle(containerEle)['border-width']);
      if (left >= 0 && left <= maxLeft) {
        moveEle.style.left = left + 'px';
      } else {
        moveEle.style.left = left < 0 ? 0 + 'px' : maxLeft + 'px';
      }
      if (top >= 0 && top <= maxTop) {
        moveEle.style.top = top + 'px';
      } else {
        moveEle.style.top = top < 0 ? 0 + 'px' : maxTop + 'px';
      }
    }
  }
  moveEle.addEventListener('mousedown', activateMove, false);
  document.addEventListener('mouseup', cancelMove, false);
  document.addEventListener('mousemove', move, false);

  return {
    enable() {
      moveEle.addEventListener('mousedown', activateMove, false);
      document.addEventListener('mouseup', cancelMove, false);
      document.addEventListener('mousemove', move, false);
    },
    disable() {
      moveEle.removeEventListener('mousedown', activateMove, false);
      document.removeEventListener('mouseup', cancelMove, false);
      document.removeEventListener('mousemove', move, false);
    }
  }
}

/**
 * @function sortArrByRule
 * @description 从一个数组中取出第k大的数——思路：去重 + 排序
 * @param {array} arr - 目标数组
 * @param {int} index - 序号
 * @returns {int} 返回第k大的数
 * @example
 * // return 3
 * getMaxValue([1,2,2,3,5,5,8], 3)
 */
const getMaxValue = function(arr, index) {
  if (!Array.isArray(arr)) {
    return;
  } else {
    const newArr = [...(new Set(arr))];
    newArr.sort((value1, value2) => value2 - value1);
    return newArr[index - 1];
  }
}

/**
 * @function objUtil
 * @description 对象的扩展方法，包括set、get和remove
 * @returns {object} 返回一个对象
 */
const objUtil = function() {
  return {
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
}

/**
 * @function getMaxValue
 * @description 按一定的规则对数组进行排序，例如根据每个对象的age排序，id排序等等
 * @param {array} arr - 目标数组
 * @param {string} path - 路径描述符，格式为'a.b.c'...
 * @param {string} direction - 方向，asc为升序，des为降序
 * @example
 * sortArrByRule([{person: {age: 25}}, {person: {age: 55}}, {person: {age: 5}}, {person: {age: 78}}], 'person.age', 'des')
 */
const sortArrByRule = function(arr, path, direction = 'asc') {
  const obj = objUtil();
  if (!Array.isArray(arr) || typeof path !== 'string') {
    return;
  } else {
    arr.sort((a, b) => {
      const valueA = obj(a, path);
      const valueB = obj(b, path);
      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    })
  }
}

/**
 * @function removeDuplicates
 * @description 删除两个数组中相同的元素
 * @param {array} arr1 - 数组1
 * @param {string} arr2 - 数组2
 * @returns {array} 返回去重相同元素后的两个数组
 * @example
 * // return [[2, 4], [3, 5]]
 * removeDuplicates([1, 2, 4], [1, 3, 5])
 */
const removeDuplicates = function(arr1, arr2) {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) {
    return;
  }
  const initArr1 = arr1;
  arr1 = arr1.filter(value => !arr2.includes(value));
  arr2 = arr2.filter(value => !initArr1.includes(value));
  return [arr1, arr2];
}

// 生成一个一定范围内的随机数
const createRandomNum = function(start, end) {
  const isNumOrStr = value => typeof value === 'number' || typeof value === 'string';
  if (isNumOrStr(start) && isNumOrStr(end)) {
    start = +start;
    end = +end;
    if (end - start > 0) {
      return start + Math.floor(Math.random() * (end - start + 1));
    }
  }
}

// 判断一个值是否是对象
const isObject = function(obj) {
  const type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

// 图片懒加载
const lazyLoadImg = function(url) {
  const promise = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = function() {
      resolve(img);
    };
    img.onerror = function() {
      reject();
    }
  });
  return promise;
}
// 数组求和
const caculateArraySum = function(arr) {
  return arr.reduce((sum, value) => {
    return sum + value;
  }, 0);
}

// flaten array
const flatenArray = function(arr) {
  return arr.reduce((preArr, value) => {
    return preArr.concat(Array.isArray(value) ? flatenArray(value) : value);
  }, [])
}

// 动态加载js脚本
const loadJS = function(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    document.body.appendChild(script);
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState === 'loaded' || script.readyState === 'complete') {
          script.onreadystatechange = null;
          resolve();
        }
      }
    } else {
      script.onload = () => {
        resolve();
      }
    }

    script.onerror = () => {
      reject();
    }
  });
}

const url1 = "http://code.jquery.com/jquery-3.2.1.js";
const url2 = "https://cdn.bootcss.com/bootstrap/4.0.0-alpha.6/js/bootstrap.js";
const url3 = "https://cdn.bootcss.com/bootstrap/4.0.0-alpha.5/js/bootstrap.js";

// 串行加载
loadJS(url1).then(() => loadJS(url2))
  .then(() => loadJS(url3))
  .then(() => { console.log('done') });

// 并行加载
Promise.all([loadJS(url1), loadJS(url2), loadJS(url3)]).then(() => {
  console.log('done');
})


// 简易的ajax
const ajax = function(options) {
  const formatParams = function(data) {
    const arr = [];
    const keyList = Object.keys(data);
    keyList.forEach(key => {
      arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    });
    return arr.join('&');
  }

  options = options || {};
  options.method = (options.method || 'GET').toUpperCase();
  options.dataType = options.dataType || 'json';
  const params = formatParams(options.data);
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      const status = xhr.status;
      if (status >= 200 && status < 300 || status === 304) {
        options.onSuccess && options.onSuccess(xhr.responseText);
      } else {
        options.onFail && options.onFail(status);
      }
    }
  }
  if (options.method === 'GET') {
    const url = `${options.url}?${params}`;
    xhr.open('GET', url, true);
    xhr.send(null);
  } else if (options.method === 'POST') {
    xhr.open('POST', options.url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
  }
}

// jsonp跨域请求封装
const jsonp = function(options) {
  const formatParams = function(data) {
    const arr = [];
    const keyList = Object.keys(data);
    keyList.forEach(key => {
      arr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
    });
    return arr.join('&');
  }

  options = options || {};

  //创建 script 标签并加入到页面中
  const cbName = ('jsonp_' + Math.random()).replace('.', '');
  const headElm = document.getElementsByTagName('head')[0];
  const params = formatParams(options.data);
  const scriptElm = document.createElement('script');
  headElm.appendChild(scriptElm);

  //创建jsonp回调函数
  window[cbName] = function(data) {
    headElm.removeChild(scriptElm);
    clearTimeout(scriptElm.timer);
    window[cbName] = null;
    options.onSuccess && options.onSuccess(data);
  }

  // 发送请求
  scriptElm.src = options.url + '?' + params;

  // 超时处理
  if (options.expireTime) {
    scriptElm.timer = setTimeout(() => {
      window[cbName] = null;
      headElm.removeChild(scriptElm);
      options.onFail && options.onFail({ message: '请求超时' });
    }, options.expireTime);
  }
}

// deep clone object
const deepClone = function(obj) {
  const judgeType = function(obj) {
    if (obj && typeof obj === 'object' || typeof obj === 'function') {
      if (Array.isArray(obj)) {
        return 'array';
      }
      if (obj instanceof Date) {
        return 'date';
      }
      if (obj instanceof RegExp) {
        return 'reg';
      }
      // 不是array、date和regExp的话就当做普通对象处理，
      // 暂不考虑set和map，后期添加
      if (typeof obj === 'object') {
        return 'object';
      }
      if (typeof obj === 'function') {
        return 'function';
      }
    }
  }
  let result;
  if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
    return obj;
  } else {
    switch (judgeType(obj)) {
      case 'array':
        result = [];
        obj.forEach(item => {
          result.push(deepClone(item));
        });
        break;
      case 'date':
        result = new Date(obj);
        break;
      case 'reg':
        const source = obj.source;
        let modifier = '';
        modifier += obj.ignoreCase ? 'i' : '';
        modifier += obj.global ? 'g' : '';
        modifier += obj.multiline ? 'm' : '';
        result = new RegExp(source, modifier);
        break;
      case 'object':
        result = {};
        const keyList = Object.getOwnPropertyNames(obj);
        keyList.forEach(key => {
          result[key] = deepClone(obj[key]);
        });
        break;
      case 'function':
        // 函数暂时没有实现深度克隆，
        // 一是没有很好的思路实现
        // 二是考虑到实际场合中很少需要‘克隆函数’，一般直接覆盖
        result = obj;
        break;
    }
    return result;
  }
}

class EventEmitter {
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

  fire (event, ...rest) {
    const fns = this.tasks[event]
    const onceFns = this.onceTasks[event]
    if (fns && fns.length) {
      for (let fn of fns) {
        fn.apply(this, rest)
      }
    }
    if (onceFns && !onceFns.hasFired) {
      for (let fn of onceFns.fns) {
        fn.apply(this, rest)
      }
      this.onceTasks.hasFired = true
    }
  }

  off (event, fn = null) {
    const fns = this.tasks[event]
    if (!fns || !fns.length) return

    if (fn) {
      this.tasks[event] = fns.filter(item => item !== fn)
    } else {
      this.tasks[event] = []
    }
  }
}