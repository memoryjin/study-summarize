const isPrivateModel = (function() {
    const testKey = 'TEST_PRIVATE_MODEL',
        storage = window.localStorage;
    try {
        storage.setItem(testKey, 1);
        storage.removeItem(testKey);
    } catch (e) {
        return true;
    }
    return false;
})();

const Obj = {
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

const dateFormat = function(date) {
    if (!date) {
        return '';
    }

    if (typeof date === 'string') {
        date = new Date(date);
    }

    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

const getMemoryStore = function() {
    const host = window.location.host;
    const hostObj = {};
    const MemoryStorage = {
        dataMap: {},
        init() {
            try {
                const compressSt = window.name || '\{\}';
                const nameObj = JSON.parse(compressSt)[host];
                if (typeof nameObj === 'object') {
                    MemoryStorage.dataMap = { ...MemoryStorage.dataMap, ...nameObj };
                }
            } catch (e) {
                console.log(e);
            }
        },
        setItem(key, value) {
            MemoryStorage.dataMap[key] = value;
            MemoryStorage.resetName();
        },
        getItem(key) {
            return MemoryStorage.dataMap[key];
        },
        removeItem(key) {
            delete MemoryStorage.dataMap[key];
            MemoryStorage.resetName();
        },
        clear() {
            MemoryStorage.dataMap = {};
            MemoryStorage.resetName();
        },
        resetName() {
            if (isPrivateModel) {
                hostObj[host] = MemoryStorage.dataMap;
                try {
                    window.name = JSON.stringify(hostObj);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    };
    MemoryStorage.init();
    return MemoryStorage;
}

class BaseStore {
    constructor() {
        this.Storage = isPrivateModel ? getMemoryStore() : window.localStorage;
        this.overdueClearKey = 'CLEAR_OVERDUE_CATCH';
    }

    _buildStorageObj(value, expireTime) {
        return { value, expireTime };
    }

    _addOverdueItem(key, expireTime) {
        expireTime = (expireTime || '').replace(/-/ig, '/');
        if (!key || !expireTime || +new Date(expireTime) < +new Date()) {
            return;
        }
        let overdueStorage = {},
            oldStorageArr = [],
            oldStorageStr = this.Storage.getItem(this.overdueClearKey);
        overdueStorage.key = key;
        overdueStorage.expireTime = expireTime;
        if (oldStorageStr) {
            oldStorageArr = JSON.parse(oldStorageStr);
        }
        const isKeyAlreadyIn = oldStorageArr.some(oldStorage => oldStorage.key === key);
        if (!isKeyAlreadyIn) {
            oldStorageArr.push(overdueStorage);
        }
        this.Storage.setItem(this.overdueClearKey, JSON.stringify(oldStorageArr));
    }

    _removeOldLately(num = 5) {
        let oldStorageStr = this.Storage.getItem(this.overdueClearKey),
            oldStorageArr = [];
        if (oldStorageStr) {
            oldStorageArr = JSON.parse(oldStorageStr);
            //排序删除第一个，排序比较耗时
            oldStorageArr.sort((a, b) => {
                let timeA = +new Date(a.expireTime),
                    timeB = +new Date(b.expireTime);
                return timeA - timeB;
            });
            const delStorageArr = oldStorageArr.splice(0, num);
            delStorageArr.forEach(delStorage => this.Storage.removeItem(delStorage));
            if (oldStorageArr.length) {
                this.Storage.setItem(this.overdueClearKey, JSON.stringify(oldStorageArr));
            } else {
                this.Storage.removeItem(this.overdueClearKey);
            }
        }
    }

    set(key, value, expireTime) {
        expireTime = dateFormat(expireTime);
        //将key和过期时间放到缓存中
        this._addOverdueItem(key, expireTime);
        const storageObj = this._buildStorageObj(value, expireTime);
        try {
            this.Storage.setItem(key, JSON.stringify(storageObj));
            return true;
        } catch (e) {
            //localstorage写满时,全清掉
            if (e.name == 'QuotaExceededError') {
                //localstorage写满时，选择离过期时间最近的数据删除，但是感觉比全清除好些，如果缓存过多，此过程比较耗时
                this._removeOdCLately();
                this.set(key, value, expireTime);
            }
        }
        return false;
    }

    get(key) {
        let result = null;
        try {
            result = this.Storage.getItem(key);
            if (result) {
                result = JSON.parse(result);
                if (+new Date(result.expireTime) >= +new Date()) {
                    result = result.value;
                } else {
                    this.remove(key);
                    result = null;
                }
            }
        } catch (e) {
            console.log(e);
        }
        return result;
    }

    remove(key) {
        this.Storage.removeItem(key);
    }

    getExpireTime(key) {
        let result, expireTime = null;
        try {
            result = this.Storage.getItem(key);
            if (result) {
                result = JSON.parse(result);
                expireTime = result.expireTime;
            }
        } catch (e) {
            console.log(e);
        }
        return expireTime;
    }
}

class Store extends BaseStore {
    constructor(key, lifeTime = '30D') {
        super();
        this.key = key;
        this.value = this.get(key);
        this.expireTime = this.getExpireTime(key);
        lifeTime = +lifeTime.slice(0, -1);
        if (!this.value) {
            let time = new Date();
            time.setDate(time.getDate() + lifeTime);
            this.set(key, {}, time);
            this.value = this.get(key);
            this.expireTime = this.getExpireTime(key);
        }
    }

    getAttr(key) {
        return Obj.get(this.value, key);
    }

    setAttr(key, value) {
        Obj.set(this.value, key, value);
        this.set(this.key, this.value, this.expireTime);
    }

    removeAttr(key) {
        if (key) {
            Obj.remove(this.value, key);
        } else {
            this.value = {};
        }
        this.set(this.key, this.value, this.expireTime);
    }

    clear() {
        this.remove(this.key);
    }
}

export Store