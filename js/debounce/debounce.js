function debounce (func, delay = 2000, immediate = true) {
  let timer
  const debounced = (...args) => {
    timer && clearTimeout(timer)
    if (immediate && !timer) {
      func(...args)
      timer = true
      return
    }
    timer = setTimeout(() => {
      func(...args)
    }, delay)
  }
  debounced.cancel = () => {
    clearTimeout(timer)
    timer = false
  }
  return debounced
}