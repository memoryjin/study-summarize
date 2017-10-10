const objUtil = {
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

export default objUtil