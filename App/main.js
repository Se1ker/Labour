import App from './App'
import Vue from 'vue'
import uView from "uview-ui";
import store from './store/store.js'
import request from './request/index.js'
//把vuex定义成全局组件
Vue.prototype.$store = store
//把request定义成全局组件
Vue.prototype.$request = request
Vue.use(uView);
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif