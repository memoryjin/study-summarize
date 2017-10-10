const loadJS = function(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        document.body.appendChild(script);
        if(script.readyState) {
            script.onreadystatechange = () => {
                if(script.readyState === 'loaded' || script.readyState === 'complete') {
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
            .then(() => {console.log('done')});

// 并行加载
Promise.all([loadJS(url1), loadJS(url2), loadJS(url3)]).then(() => {
    console.log('done');
})