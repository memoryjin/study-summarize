## props和data的二三事

#### demo1

```javascript
Vue.component('module-test', {
  template: `
    <div>
      props：{{name}}
      <br />
      data: {{personName}}
    </div>
  `,
  props: {
    name: String
  },
  data () {
    return {
      personName: this.name
    }
  }
})

let name = 'jinchs'

vm = new Vue({
  el: '#app',
  data: {
    name
  },
  methods: {
    changeName () {
      this.name = 'hello' + parseInt(Math.random() * 100)
    }
  },
  template: `
    <div>
      <module-test :name="name" />
      <button @click="changeName">改变name</button>
    </div>
  `
})
```

两个问题：

1. `name = 'tree'`，视图刷新？

2. 点击按钮，视图刷新？



#### demo2

```javascript
Vue.component('module-test', {
  template: `
    <div>
      props1：{{name}}
      <br />
      props2: {{person.age}}
      <br />
      <button @click="changeProps1">改变props1</button>
      <br />
      <button @click="changeProps2">改变props2</button>
    </div>
  `,
  props: {
    name: String,
    person: Object
  },
  methods: {
    changeProps1 () {
      this.name = 'changeProps'
    },
    changeProps2 () {
      this.person.age = 100
      setTimeout(() => {
        this.person = { age: 0 }
      }, 2000)
    }
  }
})

vm = new Vue({
  el: '#app',
  data: {
    name: 'jinchs',
    person: { age: 18 }
  },
  template: `
    <div>
      <module-test :name="name" :person="person" />
    </div>
  `
})
```

两个问题：

1. 点击两个按钮，视图如何响应？

2. changeProps2中的两处赋值操作有何不同之处？