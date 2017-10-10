let uid = 0
class Dep {
  constructor () {
    this.id = uid++
    this.subs = []
  }

  addSub (sub) {
    this.subs.push(sub)
  }

  depend () {
    Dep.target.addDep(this)
  }

  removeSub (sub) {
    const index = this.subs.indexOf(sub)
    if (index !== -1) {
      this.subs.splice(index, 1)
    }
  }

  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}
Dep.target = null

export default Dep