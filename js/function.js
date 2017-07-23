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