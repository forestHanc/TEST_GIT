import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 导入全局样式表(CDN导入elementUI 不用再导入了)
// import './plugins/element.js'
// 导入阿里icon
import './assets/font_ugfw03kydt9/iconfont.css'
import './assets/CSS/global.css'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入进度条对应的js和css
import NProgress from 'nprogress'
// 导入axios
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://139.196.148.44:8888/api/private/v1/'
// axios请求拦截器
// request拦截器 在执行request时执行 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// 在执行完后隐藏进度条 执行 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
// 挂载axios
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 时间处理器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// 注册富文本编辑器全局可用
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
