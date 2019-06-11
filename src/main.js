// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
// import './mock/index'
import iview from 'iview'
import 'iview/dist/styles/iview.css'
import '../static/css/font.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import axios from './utils/http.js'
import echarts from 'echarts'
// v-viewer
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

// 使用iview组件
Vue.use(iview)
Vue.use(VueAwesomeSwiper)
Vue.use(Viewer, {
  defaultOptions: {
    navbar: false
  }
})
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts

Vue.prototype.axios = axios
/* eslint-disable no-new */

Vue.prototype.getConfigJson = function () {
  axios.get('serverConfig.json').then((res) => {
    axios.defaults.timeout = res.axios.timeout
    axios.defaults.baseURL = res.axios.url
    Vue.prototype.thirdSys = res.thirdSys
    Vue.prototype.baseURL = res.axios.url
    Vue.prototype.jsonURL = res.axios.json
    Vue.prototype.websocketURL = res.axios.websocket

    new Vue({
      el: '#app',
      store,
      router,
      axios,
      components: { App },
      template: '<App/>'
    })
  }).catch((e) => {
    console.log('读取配置文件失败:' + e)
  })
}

Vue.prototype.getConfigJson() // 调用声明的全局方法
