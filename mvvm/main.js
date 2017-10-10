import MVVM from './based-on-vue/Mvvm.js'
const vm = new MVVM({
  el: '#mvvm-app',
  data: {
      word: 'Hello World!',
      age: 25
  },
  methods: {
      sayHi: function() {
          this.word = 'Hi, everybody!'
      }
  },
  computed: {
    wordReverse () {
      return this.word.split('').reverse().join('')
    }
  }
})
