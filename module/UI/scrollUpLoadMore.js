const getPageScrollPos = function() {
    const docEle = document.documentElement;
    const docBody = document.body;
    return {
        left: Math.max(docElm.scrollLeft, docBody.scrollLeft),
        top: Math.max(docElm.scrollTop, docBody.scrollTop),
        width: Math.min(docElm.clientWidth, docBody.clientWidth),
        height: Math.min(docElm.clientHeight, docBody.clientHeight),
        pageWidth: Math.max(docElm.scrollWidth, docBody.scrollWidth),
        pageHeight: Math.max(docElm.scrollHeight, docBody.scrollHeight)
    }
}

const bind = function(callback) {
    let isScrollUp = false;
    let startPosY;
    window.addEventListener('touchstart', function(e) {
      startPosY = e.touches[0].pageY;
    }, false);
    window.addEventListener('touchmove', function(e) {
      isScrollUp = startPosY - e.touches[0].pageY > 0 ? true : false;
    }, false);
    window.addEventListener('scroll', function(e) {
        const pos = getPageScrollPos();
        if(pos.top === 0) {
            return;
        } else {
            const deltaHeight = pos.pageHeight - pos.top - pos.height;
            if(deltaHeight <= 5 && isScrollUp) {
                callback();
            }
        }
    }, false);
}

export default bind;