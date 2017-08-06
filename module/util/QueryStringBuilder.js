class QueryStringBuilder {
    constructor(url) {
        this.search = url ? decodeURIComponent(url).replace(/^[^?]+\??/, '') : decodeURIComponent(window.location.search).slice(1);
        this.queryObj = this.buildQueryObj();
    }

    buildQueryObj() {
        const queryObj = {};
        const itemList = this.search.split('&');
        itemList.forEach(item => {
            const [key, value] = item.split('=');
            // 如果queryObj中没有改属性
            if (!queryObj.hasOwnProperty(key)) {
                if (value === undefined || value === '') {
                    queryObj[key] = true;
                } else {
                    // 能转换成int类型的转换成int类型
                    queryObj[key] = +value === +value ? +value : value;
                }
            } else {
                // 如果queryObj中已经包含了该属性，且该属性对应的value是数组，直接push
                if (Array.isArray(queryObj[key])) {
                    if (value === undefined || value === '') {
                        queryObj[key].push(true);
                    } else {
                        queryObj[key].push(+value === +value ? +value : value);
                    }
                } else {
                    // 如果queryObj中包含了该属性，但该属性对应的value不是数组，先转换成数组，然后push
                    queryObj[key] = [].concat(queryObj[key]);
                    if (value === undefined || value === '') {
                        queryObj[key].push(true);
                    } else {
                        queryObj[key].push(+value === +value ? +value : value);
                    }
                }
            }
        });
        return queryObj;
    }

    buildQueryString() {
        const queryObj = this.queryObj;
        let search = '';
        const keyList = Object.keys(queryObj);
        keyList.forEach(key => {
            if (!Array.isArray(queryObj[key])) {
                const value = queryObj[key] === true ? '' : queryObj[key];
                search += `&${key}=${value}`;
            } else {
                queryObj[key].forEach(item => {
                    const value = item === true ? '' : item;
                    search += `&${key}=${value}`;
                })
            }
        });
        return search;
    }

    get(key) {
        return this.queryObj[key];
    }

    set(key, value) {
        this.queryObj[key] = value;
        this.search = this.buildQueryString();
    }

    remove(key) {
        delete this.queryObj[key];
        this.search = this.buildQueryString();
    }
}

export default QueryStringBuilder