/**
 * @constructor QueryStringBuilder
 * @description 模块引入后返回的构造函数
 * @param {string} baseQueryString - 传入需要解析的字符串 
 * @returns {object} 返回解析后的对象
 */

class QueryStringBuilder {
    constructor(baseQueryString) {
        this.model = {};
        if (baseQueryString) {
            baseQueryString = baseQueryString.replace(/^.*\?/, '');
            const collections = baseQueryString.split('&');
            if(collections) {
                collections.forEach(keyValue => {
                    const [key, value] = keyValue.split('=');
                    if(key) {
                        this.model[key] = value;
                    }
                })
            }
        }
    }

    get(key) {
        if(typeof key === 'undefined') {
            return this.model;
        } else {
            return this.model[key];
        }
    }

    set(key, value) {
        this.model[key] = value;
    }

    remove(key) {
        if(typeof key === 'undefined') {
            this.model = {};
        } else {
            delete this.model[key];
        }
    }

    toString() {
        let str = JSON.stringify(this.model).replace(/[{}"]/g, '')
                      .replace(/:/g, '=')
                      .replace(/,/g, '&');
        return `?${str}`;
    }
}

export default QueryStringBuilder