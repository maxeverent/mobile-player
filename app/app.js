import Vue from 'nativescript-vue'
import store from './store'
import Home from './components/Home'



new Vue({
  store,
  render: (h) => h('frame', [h(Home)]),
}).$start()
