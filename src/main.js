/* 基础模块 */
import "babel-polyfill" //引入IE浏览器兼容垫片
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import utils from '@/utils';
import Cookies from 'js-cookie'
Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})
Vue.config.productionTip = false


/* 浏览器兼容性处理 */
require('es6-promise').Promise
import Promise from 'promise-polyfill'
if (!window.Promise) {
  window.Promise = Promise
}
import 'babel-polyfill';


/* 第三方 */
import Element from 'element-ui'
import '@/assets/theme/index.css'
Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size
})
import vueJsonp from 'vue-jsonp';  //使用jsonp
Vue.use(vueJsonp);
import '@/components/static/index.js';

Vue.prototype.confirm = function({title, icon, text, cancel, width, confirmText, customClass}) {
  return new Promise((resolve, reject) => {
    let str = ''

    if(icon) {
      str += '<i class="el-icon-warning"></i>'
    }
    str += `<p class="content-text">${text}</p>`

    this.$confirm(str, title, {
      confirmButtonText: confirmText || '确认',
      cancelButtonText: '取消',
      dangerouslyUseHTMLString: true,
      width: width,
      customClass: customClass ? customClass + ' confirm confirm-big' : 'confirm confirm-big',
    }).then(() => {
      resolve()
    }).catch((error) => {
      reject(error)
    });
  })
}

/*按钮复制链接地址 */
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


/* 自定义全局变量或方法挂载 */
Vue.prototype._routeTo = utils.routeTo; //全局路由跳转快捷方式  routeTo('login', {a:1, b:2})
Vue.prototype._globalEvent = utils.eventHub.default;  //挂载全局事件对象，跨组件发通知,单例对象
import '@/directives/index.js'
import api from '@/api';
Vue.prototype._apis = api;


/* 自定义公共模块 */
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/variables.scss'
import '@/styles/index.scss' // global css
import '@/views/shop/shopStyle.scss';
import '@/system/permission' // permission control


new Vue({
  el: '#app', 
  router,
  store,
  render: h => h(App)
})
