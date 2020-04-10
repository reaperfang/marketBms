/******************************* 基础模块 *****************************/

import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '@/directives/index.js'  //导入指令
import '@/styles/index.scss' // 导入全局scss
import '@/system/permission' // 权限控制
import utils from '@/utils'; //导入全局工具箱
Vue.config.productionTip = false


/****************************** 浏览器兼容性处理 *************************/

import "babel-polyfill" //引入IE浏览器兼容垫片
import Promise from 'promise-polyfill'
require('es6-promise').Promise
if (!window.Promise) {
  window.Promise = Promise
}

/****************************** 全局实例挂载 ******************************/

//将工具箱里的方法注册到指令中
Object.keys(utils).forEach(key => {
  Vue.filter(key, utils[key])
})

//讲工具箱里的方法绑定到vue实例上
Vue.prototype.utils = utils;

//全局路由跳转快捷方式  routeTo('login', {a:1, b:2})
Vue.prototype._routeTo = utils.routeTo;

//挂载全局事件对象，跨组件发通知,单例对象
Vue.prototype._globalEvent = utils.eventHub.default;

//挂载接口配置表
import api from '@/api';
Vue.prototype._apis = api;

//挂载自定义确认弹窗(作者：chenbaochao)，文件位于utils里面的confirm.js
Vue.prototype.confirm = utils.confirm.default;  


/****************************** 第三方库或者插件 ******************************/

//导入cookie插件
import Cookies from 'js-cookie'

//注册elementUI库
import Element from 'element-ui'
import '@/assets/theme/index.css'
Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size
})

//注册jsonp插件
import vueJsonp from 'vue-jsonp';  
Vue.use(vueJsonp);

// //注册取色器插件
// import vcolorpicker from 'vcolorpicker'
// Vue.use(vcolorpicker)

//注册拖拽插件
import VueDND from 'awe-dnd';
Vue.use(VueDND)

//注册省市区县四级联动插件  
//demo地址  https://liangzibo.github.io/area-linkage-vue/
import { pcaa } from 'area-data-vue';
import 'area-linkage-vue/dist/index.css';
import AreaLinkageVue from 'area-linkage-vue';
Vue.use(AreaLinkageVue)
Vue.prototype.$pcaa = pcaa;

//注册时间轴插件
import LightTimeline from 'vue-light-timeline';
Vue.use(LightTimeline);

//注册瀑布流插件
//插件文档  https://github.com/AwesomeDevin/vue-waterfall2/blob/master/CHINESE-README.md
import waterfall from 'vue-waterfall2'   
Vue.use(waterfall)

//按需注册vant组件
import { Swipe, SwipeItem, NoticeBar, CountDown } from 'vant';
Vue.use(Swipe).use(SwipeItem);
Vue.use(NoticeBar);
Vue.use(CountDown);


/*注册复制剪贴板组件 */
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)


/* ***************************** 导出vue实例 ******************************/
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
