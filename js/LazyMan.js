// 队列 + next
class Man {
  constructor(name) {
    this.taskList = [];
    this.taskList.push(this.createTask({
      type: 'sayHi',
      msg: name
    }));
    setTimeout(() => this.next(), 0);
  }

  createTask(param) {
    const {
      type,
      msg
    } = param;
    switch (type) {
      case 'sayHi':
        return () => {
          console.log(`Hi!This is ${msg}`);
          this.next();
        }
      case 'eat':
        return () => {
          console.log(`Eat ${msg}~~`);
          this.next();
        }
      case 'wake':
        return () => {
          setTimeout(() => {
            console.log(`Wake up after ${msg}`);
            this.next();
          }, msg * 1000);
        }
      default:
        return null;
    }
  }

  next() {
    const task = this.taskList.shift();
    task && task();
  }

  eat(part) {
    const task = this.createTask({
      type: 'eat',
      msg: part
    });
    this.taskList.push(task);
    return this;
  }

  sleep(sec) {
    const task = this.createTask({
      type: 'wake',
      msg: sec
    });
    this.taskList.push(task);
    return this;
  }

  sleepFirst(sec) {
    const task = this.createTask({
      type: 'wake',
      msg: sec
    });
    this.taskList.unshift(task);
    return this;
  }
}

const LazyMan = function (name) {
  return new Man(name);
}


// async function
class Man {
  constructor(name) {
    this.tasks = []
    this.tasks.push(this.createTask({
      type: 'sayHi',
      msg: name
    }))
    setTimeout(() => {
      this.runTask()
    }, 0)
  }

  createTask(param) {
    const {
      type,
      msg
    } = param
    switch (type) {
      case 'sayHi':
        return () => {
          return new Promise(resolve => {
            console.log(`Hi! This is ${msg}`)
            resolve()
          })
        }
      case 'eat':
        return () => {
          return new Promise(resolve => {
            console.log(`eat ${msg}~~`)
            resolve()
          })
        }
      case 'sleep':
        return () => {
          return new Promise(resolve => {
            setTimeout(() => {
              console.log(`wake up after ${msg} second`)
              resolve()
            }, msg * 1000)
          })
        }
    }
  }

  eat(part) {
    this.tasks.push(this.createTask({
      type: 'eat',
      msg: part
    }))
    return this
  }

  sleep(second) {
    this.tasks.push(this.createTask({
      type: 'sleep',
      msg: second
    }))
    return this
  }

  sleepFirst(second) {
    this.tasks.unshift(this.createTask({
      type: 'sleep',
      msg: second
    }))
    return this
  }

  async runTask() {
    if (this.tasks && this.tasks.length) {
      for (const task of this.tasks) {
        await task()
      }
    }
  }
}

const lazyMan = function (name) {
  return new Man(name)
}