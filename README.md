## 电商前端pc端框架

http://test-omo.aiyouyi.cn/xiaoyaoji/doc/2ShuYz40m这个是接口地址

名：admin-mdl  密码：123456

### 项目运行


```bash
git clone http://git.300.cn/NRCP/nrcp-web/bms.git    //项目克隆

cd bms  //进入根目录
 
npm install  //安装依赖包

npm run dev   //启动开发服务器

npm run build:dev   //本地开发打包

npm run build:test   //测试环境打包

npm run build:prod   //正式环境打包

```

### 项目详情

```
.
├── build                                       // webpack配置文件和服务启动文件
├── config                                      // 环境变量配置
├── dist                                        // 打包后的静态文件
├── src                                          
│   ├── api                                     // 接口api（其中index.js是聚合索引文件）
│   ├── assets                                  // 静态文件目录
│   ├── components                              // 公共组件目录（很多页面级的功能组件继承自此目录下的base组件）
│   ├── config                                  // 项目配置目录
│   ├── router                                  // 路由目录（其中index.js是聚合索引文件，按需模块化的添加你的路由文件）
│   ├── store                                   // 状态管理目录
│   ├── styles                                  // 样式目录
│   ├── system                                  
│   │  ├── appConfig.js                         // 系统配置
│   │  ├── auth.js                              // 系统认证token管理
│   │  ├── permission.js                        // 系统权限验证
│   │  ├── request.js                           // 接口请求方法封装
│   │  ├── constant.js                          // 常量配置
│   ├── utils                                   // 工具箱集合（其中index.js是聚合索引文件,使用时在页面中导入utils模块，然后用.运算符直接取到对应的方                                                              法名即可使用）
│   ├── views                                   // 页面目录
│   ├── App.vue                                 // vue主文件
│   ├── main.js                                 // 项目主文件
.
```

## 添加一个第三方插件
文件路径： \src\components\static\index.js

```js
//添加时间轴demo
import LightTimeline from 'vue-light-timeline';
Vue.use(LightTimeline);
```


## 添加一个api接口
目录路径： \src\api
* 在目录下新建一个模块文件（例如订单模块order, 商品模块goods）
* 在api文件里的index.js里添加此模块
```js
// 添加api模块
import * as demo from "./demo"; 
export default {
	demo
};

```
* 在新建的文件里面添加api接口，写法如下：(注：url即接口相对地址，target即接口唯一标识号，baseURL:基础url, data： post请求时传入的业务参数，params: get请求时传入的业务参数)
```js
// 获取列表
export function getList(data) {
  return request({
    url: '/admin/shop/all',
    method: 'post',
    baseURL: process.env.DATA_API,
    data
  })
}
```


## 页面中使用api接口获取数据
目录路径： 你的vue页面文件

备注：
* 所有的api接口都挂载在this._apis上
* _apis后面接api模块名（即你起的文件名字）
* 模块名后面接你的具体api名
* 示例： this._apis.模块名.api名
```js
//获取列表demo
this._apis.demo.getList({}).then((response)=>{
      this.data = response;
}).catch((error)=>{
      this.$message.error(error);
})
```


## 添加一个websocket接口

目录路径： \src\api
* 在目录下新建一个模块文件（例如订单模块order, 商品模块goods）
* 在api文件里的index.js里添加此模块
```js
// 添加api模块
import * as demo2 from "./demo2"; 
export default {
	demo2
};

```
* 在新建的文件里面添加websocket接口，写法如下：(注：url即接口相对地址，baseURL:基础url, data： 传入的业务参数， methods: 传入的业务回调函数，包含onopen、onmessage、onclose、onerror方法)
```js
// 获取数据
export function getData(data, methods) {
  return websocket({
    url: '/sockjs-node/873/euznsvbv/websocket',
    method: 'get',
    baseURL: process.env.WEBSOCKET_server,
    data,
    methods
  })
}
```


## 在页面中获取websocket发来的数据
目录路径： 你的vue页面文件
备注：
* 所有的websocket接口都挂载在this._apis上
* _apis后面接websocket模块名（即你起的文件名字）
* 模块名后面接你的具体websocket接口名
* 示例： this._apis.模块名.websocket名
```js
//长连接demo
this._apis.websocketDemo.getData({aaa:1}, {
      onopen: () => {
      console.log('opened');
      },
      onmessage: (res) => {
      _self.socketValue = res;
      console.log(res);
      },
      onclose: (onclose) => {
      console.log('closed原因：' + onclose);
      },
      onerror: (error) => {
      console.error(error);
      }
});
```


## 添加你的路由
目录路径： \src\router
* 在目录中添加一个路由模块文件
```js
import Layout from '@/components/layout/Layout'

export default [
  {
		path: '/demo',
    component: Layout,
    redirect: {
      name: 'helloWorld'
    },
    name: 'demoPage',
    meta: {
      roles: ['shop'],
      title: 'demo展示',
      icon: 'shop'
    },
    children: [
    	{
        path: 'helloWorld',
        component: () => import('@/views/demo/helloWorld'),
        name: 'helloWorld',
        meta: { title: 'elementUi', noCache: true }
      },
    	{
        path: 'helloWorld2',
        component: () => import('@/views/demo/helloWorld2'),
        name: 'helloWorld2',
        meta: { title: '过滤器使用demo', noCache: true }
      },
    	{
        path: 'helloWorl3',
        component: () => import('@/views/demo/helloWorld3'),
        name: 'helloWorld3',
        meta: { title: '腾讯地图demo', noCache: true }
      },
    	{
        path: 'helloWorld4',
        component: () => import('@/views/demo/helloWorld4'),
        name: 'helloWorld4',
        meta: { title: '页面组件demo', noCache: true }
      },
    	{
        path: 'helloWorld5',
        component: () => import('@/views/demo/helloWorld5'),
        name: 'helloWorld5',
        meta: { title: '图表demo', noCache: true }
      },
    	{
        path: 'helloWorld6',
        component: () => import('@/views/demo/helloWorld6'),
        name: 'helloWorld6',
        meta: { title: '富文本和弹窗demo', noCache: true }
      },
    	{
        path: 'helloWorld7',
        component: () => import('@/views/demo/helloWorld7'),
        name: 'helloWorld7',
        meta: { title: '数据请求demo', noCache: true }
      },
    ]
	}
]
```
* 在目录中的index.js中添加此路由模块
```js
import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/layout/Layout'
Vue.use(Router)
import demoRouter from './demoRouter';
 
export const asyncRouterMap = [  //异步路由表
	...demoRouter
]

export default new Router({
  mode: 'history', 
  scrollBehavior: () => ({ y: 0 }),
  routes: syncRouterMap
})

```


## 添加公共功能组件并使用
目录路径： \src\components
* 带base的组件是基础功能组件，使用此类功能的业务组件可从此类文件继承以获得基本能力，在各视图目录中的业务组件中去做具体的实现
* layout组件是布局基础组件，部分页面骨架基于此布局组件
* static目录是导入第三方组件的入口，需求的话可以去添加
```js
<script type='es6'>
import mapBase from "@/components/MapBase";
export default {
  name: "demoMap2",
  extends: mapBase,
  data() {
    return {};
  },
  methods: {

    //实例初始化结束
    inited() {
      this.initEvent();
      var marker = new qq.maps.Marker({
          position: this.centerObj,
          map: this.mapObj
      });

      var marker2 = new qq.maps.Label({
          position: this.centerObj,
          map: this.mapObj,
          content:'数码庄园'
      });
    },

    //初始化事件
    initEvent() {}
  },
  components: {}
};
```


## 添加业务组件
路径：你的视图目录
* 新建一个components文件夹
* 新建你的业务子组件
* 在你的页面vue里面引用即可使用
```html
<template>
  <demoMap1 :width="'600px'" :height="'300px'" :zoom="11" :center="[39.9046900000,116.4071700000]"></demoMap1>
</template>
```

```js
<script>
import utils from '@/utils';
import demoMap1 from './components/demoMap1';
export default {
  name: 'HelloWorld3',
  components: {demoMap1},
  data () {
    return {}
  }
}
</script>
```


## 添加系统配置项
文件路径： \src\system\appConfig.js
```js
export default {
      head: {
		VERSION: "vsesion-1.0.0.1", // 版本号
		CHANNEL: "新零售", // 渠道
		KEY:"134147627CD2", // 公钥，由Leader平台系统进行分配
		VALUE:"EB24B602A9364B87AA967B7678676B84", // 私钥
		CLIENT:7 //客户端
	},
	//地图参数配置
	map: {
		url: 'https://map.qq.com/api/js?v=2.exp',
		key: '7FYBZ-SKMKW-D5HR6-RUHRK-Z76EE-DNBYL',
		defaultCenter: [39.9046900000,116.4071700000]
	}
}
```


## 添加常量
文件路径： \src\system\constant.js
```js
/* 常量 */
export default {
  AAA: '阿实际不符',
  BBB: '奥术飞镖束带结发',
};

```


## 添加工具方法
目录路径： \src\utils
*对于单独的工具方法，可放在base.js中，使用时可直接在utils上调用添加的方法
*对于需要一个文件来承载的工具类，可添加对应的js文件，然后在index.js中注册此文件，使用时也可直接在utils上调用添加的方法（需注意名称对应）
```js
base.js
/**
 * 数值百分比转换
 * @param value 
 * @param fmt string , 转换格式
 * demo ->  {{data | percent(2)}}
 */
export function percent(value, fmt) {
  return `${((value || 0) * 100).toFixed(fmt || 2)}%`;
}
```
```js
index.js
import * as utils from "./base"; //基础工具方法
import clipboard from "./clipboard"; //剪切板
import * as eventHub from "./eventHub"; //全局事件中心
import print from "./print"; //打印工具箱
import * as validate from "./validate"; //验证工具箱

export default Object.assign(utils, {
	clipboard,
	eventHub,
	print,
	validate
});

```


## 在页面中使用工具方法
路径：你的页面文件或js文件
```js
import utils from "@/utils";
let date = utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss")
let value = utils.percent(0.34546757, 3)
```


## 使用全局快捷公共方法
* 路由快捷跳转
```html
  <button  @click="_routeTo('page1')">按钮</button>
  <button  @click="_routeTo('page2', {id: 123, name: 'hahaha'})">按钮</button>
```

* 全局事件中心(观察者模式跨作用域消息通讯)
```js
  注册事件： this._globalEvent.$on('mapLoaded', ()=>{
                  this.init();
            });

  发送事件： this._globalEvent.$emit('mapLoaded');
```


## 使用地图（以腾讯地图为例）
编写路径： 你的视图业务组件目录
* 创建一个业务地图组件文件，放到对应的views组件中
* 继承公共组件中的mapBase组件，获取基本能力
```js
import mapBase from "@/components/MapBase";
export default {
  name: "demoMap2",
  extends: mapBase,
};
</script>
```
* 编写inited的处理函数
```js
//实例初始化结束
inited() {
      this.initEvent();
      //以下是其他处理，比如标记点和标签等
      var marker = new qq.maps.Marker({
            position: this.centerObj,
            map: this.mapObj
      });

      var marker2 = new qq.maps.Label({
            position: this.centerObj,
            map: this.mapObj,
            content:'数码庄园'
      });
},
```
* 编写initEvent的处理函数(如有)
```js
//初始化事件
    initEvent() {
       
    }
```
* 编写search和searchCompleted方法的处理函数(如需要)
```js
 //执行搜索
search() {
      this.searchService.search(this.keyword);
},

//搜索结束
searchCompleted(results) {
      let latlngBounds = new qq.maps.LatLngBounds();
      let markers = [];
      let pois = results.detail.pois;
      for (let i = 0, l = pois.length; i < l; i++) {
            let poi = pois[i];
            //扩展边界范围，用来包含搜索到的Poi点
            latlngBounds.extend(poi.latLng);
            let marker = new qq.maps.Marker({
            map: this.mapObj,
            position: poi.latLng
            });

            marker.setTitle(i + 1);

            markers.push(marker);
      }
      //调整地图视野
      this.mapObj.fitBounds(latlngBounds);
}
```

组件调用路径： 你的页面
```html
<template>
  <demoMap1 :width="'600px'" :height="'300px'" :zoom="11" :center="[39.9046900000,116.4071700000]"></demoMap1>
</template>
```

```js
<script>
import utils from '@/utils';
import demoMap1 from './components/demoMap1';
export default {
  name: 'HelloWorld3',
  components: {demoMap1},
  data () {
    return {}
  }
}
</script>
```


## 使用图表（以echarts的折线图为例）

方法同地图使用


## 使用富文本编辑器（以ckeditor为例）

```html
组件调用
<CKEditor></CKEditor>
```

```js
组件引入
import CKEditor from '@/components/CKEditor';
export default {
  name: 'HelloWorld6',
  components: {CKEditor}
}
</script>
```


## 过滤器添加和使用
添加方法同工具方法，utils工具方法可和过滤器共用

页面中使用：
```html
<button>日期事件过滤器（{{new Date() | formatDate('yyyy-MM-dd hh:mm:ss')}}）</button>
<button>颜色转换过滤器（{{'rgb(45,123,67)' | colorRGB2Hex()}}）</button>
<button>数字格式化过滤器（{{3453478565 | formatNumber()}}）</button>
<button>百分比格式化过滤器（{{0.2398 | percent(2)}}）</button>
```

##页面中多个弹窗使用
* 在你的views视图目录中新建dialogs文件夹
* 新建你的弹窗组件文件
* 继承公共组件中的dialogBase, 获取基本能力, 并编写你的具体业务
```js
<script>
demoDialog.vue

import dialogBase from '@/components/DialogBase';
export default {
  name: 'demoDialog',
  extends: dialogBase,
  props: ['data'],
  data() {
    return {}
  },
  methods: {}
}
</script>
```
* 在你的业务页面中调用动态组件，并动态设置弹窗组件名称以实现区分打开不同的弹窗，并添加你的props和methods
```html
helloWorld.vue

 <!-- 动态弹窗 -->
<component :is="currentDialog" :data="editorData" @dialogClose="dialogClose" :refresh="fetch"></component>
```