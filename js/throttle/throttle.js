function throttle (func, interval = 2000) {
  let timer
  const throttled = (...args) => {
    if (timer) return
    timer = setTimeout(() => {
      func(...args)
      timer = true
    }, interval)
  }
  throttled.cancel = () => {
    clearTimeout(timer)
    timer = false
  }
  return throttled
}