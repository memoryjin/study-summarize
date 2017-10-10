// 各类基本的排序算法总结

// 1. 冒泡排序法
const bubbleSort = function(arr) {
    const exchange = function(arr, i, j) {
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    let count = 1;
    let noExchange = true;
    while(count < arr.length) {
        for(let i = 0; i < (arr.length - count); i++) {
            if(arr[i] > arr[i+1]) {
                exchange(arr, i, i+1);
                noExchange = false;
            }
        }
        // 如果在某次循环中没有发生元素的置换，说明排序已完成，直接退出。
        if(noExchange) {
            break;
        } else {
            count++;
            noExchange = true;
        }
        
    }
    return arr;
}

// 2. 快速排序法
const quickSort = function(arr) {
    if(arr.length < 2) {
        return arr;
    }
    const pivotIndex = Math.floor(arr.length / 2);
    const pivotValue = arr.splice(pivotIndex, 1)[0];
    const left = [];
    const right = [];
    arr.forEach(item => {
        item < pivotValue ? left.push(item) : right.push(item);
    });
    return quickSort(left).concat([pivotValue], quickSort(right));
}