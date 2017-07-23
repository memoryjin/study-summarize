const dateUtil = {};

function pad(t, min, c, r) {
    t = '' + t;
    if (t.length < min) {
        const p = new Array(min - t.length + 1).join(c);
        return r ? t + p : p + t;
    }
    return t;
};


/**
 * @function addDay
 * @description 日期增加天数
 * @param {Date} date - 传入的日期
 * @param {number} days  增加天数
 * @returns {*}  返回增加后的天数
 */
dateUtil.addDay = function(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}

/**
 * @function isInRange
 * @description 日期是否在某个区间内
 * @param {Date} date - 传入的日期
 * @param {Object} range - 传入的范围,需要range.start和range.end
 * @param {Date} range.start 开始日期
 * @param {Date} range.end 结束日期
 * @returns {boolean}  返回true或false
 */
dateUtil.isInRange = function(date, range) {
    const time = date.getTime();
    return (time >= range.start.getTime()) && (time <= range.end.getTime());
}

/**
 * @function resetToDate
 * @description 将日期重置到天（归零时分秒）
 * @param {Date} date - 传入的日期
 */
dateUtil.resetToDate = function(date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
}


/**
 * @function getDays
 * @description  获取两个日期的差距天数，重置为0点再计算
 * @param {Date} start - 传入的开始日期
 * @param {Date} end - 传入的结束日期
 * @returns {number}  计算后的天数
 */
dateUtil.getDays = function(start, end) {
    start = new Date(start);
    end = new Date(end);
    dateUtil.resetToDate(start);
    dateUtil.resetToDate(end);

    return (end.getTime() - start.getTime()) / 1000 / 3600 / 24;
}

/**
 * @function format
 * @description  设置日期格式
 * @param {Date} src - 传入的日期
 * @param {string} format - 输出的日期格式，例如'yyyy-mm-dd'
 * @returns {string}  处理格式后的日期
 */
dateUtil.format = function(src, format) {
    let date = new Date();
    if (typeof src === 'object') {
        date = src;
    } else if (typeof src === 'string' && src) {
        src = src.replace(/-/g, '/');
        if( src == Number(src) && src.length === 8 ) {
            var arr = src.split('')
            arr.splice(4,0,'-')
            arr.splice(-2,0,'-')
            date = new Date(arr.join(''));
        } else {
            date = new Date(src);
        }
    } else if (typeof src === 'number' && src) {
        date = new Date(src);
    } else {
        return src;
    }
    return format.replace(/y+|m+|d+|h+|M+|s+|f+/g, function(m) {
        let r = "";
        switch (m[0]) {
            case 'y':
                r = date.getFullYear();
                break;
            case 'm':
                r = date.getMonth() + 1;
                break;
            case 'd':
                r = date.getDate();
                break;
            case 'h':
                r = date.getHours();
                break;
            case 'M':
                r = date.getMinutes();
                break;
            case 's':
                r = date.getSeconds();
                break;
            case 'f':
                return pad(date.getMilliseconds(), m.length, '0').substr(0, m.length);
        }
        return pad(r, m.length, '0');
    });
};

/**
 * @function getWeekDay
 * @description  获取星期数
 * @param {Date} date - 传入的日期
 * @returns {string}  返回星期数
 */
const WEEK_DAY_TEXT = ['日', '一', '二', '三', '四', '五', '六']
dateUtil.getWeekDay = function(date) {
    return date ? '周' + WEEK_DAY_TEXT[date.getDay()] : '';
};
/**
 * @exports module:dateUtil
 */
export default dateUtil;