import axios from "axios";
import { Message, MessageBox } from "element-ui";
import store from "@/store";
import utils from "@/utils";
import { getToken } from '@/system/auth'
import md5 from 'md5'
import appConfig from '@/system/appConfig';
class Ajax {
  constructor() {
    this.systemRequest = 'head';
    this.service = axios.create({
      timeout: 100000, // request timeout
    });

    this.initGlobal();
  }
  static getInstance() {
    return (this.instance = this.instance || new this());
  }

  // request拦截器
  requestGlobal(config) {
    let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
    let cid = shopInfo && shopInfo.id || ''
    config.headers = Object.assign(
      {
        businessId: 1,
        tenantId: localStorage.getItem('userInfo') && JSON.parse(localStorage.getItem('userInfo')).tenantInfoId,
        merchantId: cid,
        loginUserId: 1,
        token: store.getters.token || getToken('authToken')
      },
      config.headers
    ) 
  }

  // respone拦截器
  initGlobal() {
    this.service.interceptors.response.use(
      response => {
        const res = response.data
        if (res.status === 'success' || res.status === 200) {
          if (res.accessToken) {
            return res;
          }
          if(res.msg == 'existProduct') {
            return res
          }
          return res.data;
        }else if(res.status === 'error' && res.code === "10088"){
          MessageBox.alert('该店铺已停用！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('LogOut').then(() => {
                location.reload()
              })
            }
          });
        }else if(res.status === 'error' && res.code === "10089"){
          MessageBox.alert('该店铺已过期！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('LogOut').then(() => {
                location.reload()
              })
            }
          });
        }else if(res.status === 'error' && res.code === "10090"){
          MessageBox.alert('该店铺为延迟开通，请先设置开通！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('LogOut').then(() => {
                location.reload()
              })
            }
          });
        }else if(res.status === 'error' && res.code === "10020"){
          MessageBox.alert('用户登录已经超时！', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              store.dispatch('LogOut').then(() => {
                location.reload()
              })
            }
          });
        }else if (res.errno === 0) {
          return res.data;
        }else {
          return Promise.reject(res.msg)
        }
      },
      error => {
        if (error.code === "ECONNABORTED") {
          // error.message = "登录连接超时（后台不能连接，请联系系统管理员）";
          error.message = "网络连接失败，请刷新重试";
        }
        return Promise.reject(error.message);
      }

    );
  }

  request(config) {
    this.setApiAddress(config);
    if (config.target) {
      config = this.setRequestParams(config);
    } else {
      this.requestGlobal(config);
    }
    return this.service(config);
  }

  // 根据后端接口重置请求 -- 电商
  setRequestParams(config) {
    const CONST = appConfig[this.systemRequest];
    if (!CONST) {
      MessageBox.alert('请求参数错误', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
    }

    //拼接参数head
    let head = {
        target: config.target,
        // accessToken:'09255c7724fe9b8df952aa2f7e3ec718eb753655b3975a50a4f6307bc84718bd',
        accessToken: store.getters.token || getToken('authToken'),
        client: CONST.CLIENT,
        version: CONST.VERSION,
        requestTime: utils.formatDate(new Date(), "yyyy-MM-dd hh:mm:ss"),
        channel: CONST.CHANNEL,
        key: CONST.KEY
      };
      head.value = md5(CONST.VALUE + head.target + head.requestTime);

    //获取cid和shopInfoId
    // let cid = store.getters.userInfo && store.getters.userInfo.cid ? store.getters.userInfo.cid : '';
    let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
    let cid = shopInfo && shopInfo.id || ''
    let shopInfoId = store.getters.userInfo && store.getters.userInfo.shopInfoId ? store.getters.userInfo.shopInfoId
      : '';

    //获取cid
    // let cid = store.getters.cid || (/\/bms\/order\//.test(location.pathname) ? '2' : '7')
    //拼接全部参数
    if (config.method == "post") {
      if (config.noCid) {
        config.data = `json=${encodeURI(JSON.stringify({ head, data: config.data }))}`;
      } else {
        config.data = `json=${encodeURI(JSON.stringify({ head, data: { cid, ...config.data } }))}`;
      }
    } else if (config.method == "get") {
      if (config.noCid) {
        config.params = { json: { head, data: config.params } };
      } else {
        config.params = { json: { head, data: { ...config.params, cid } } };
      }
    }
    return config;
  }

  //配置接口地址
  setApiAddress(config) {
    if (!config.baseURL) {
      if (config.apiType) {
        switch (config.apiType) {
          case 'member':  //新零售商城
            config.baseURL = `${process.env.DATA_API}/api-member-web/member/api.do`;
            break;
          case 'coupon':  //优惠券系统
            config.baseURL = `${process.env.DATA_API}/coupon/api.do`; //测试环境
            break;
          case 'monitor': //埋点项目
            config.baseURL = `${process.env.DATA_API}/monitor-web/monitor/api.do`;
            break;
          case 'goods': //商品系统
            config.baseURL = `${process.env.DATA_API}/api-commodity-web/commodity/api.do`; // 王浩
            break;
          case 'order': //订单系统
            config.baseURL = `${process.env.DATA_API}/api-order-web/order/api.do`; // 李刚 尹茂凯
            //config.baseURL = `/order_server/api-order-web/order/api.do`; // 李刚 尹茂凯
            break;
          case 'decorate':  //装修接口
            config.baseURL = `${process.env.DATA_API}/api-decoration-web/decoration/api.do`;
            break;
          case 'finance':  //财务接口
            config.baseURL = `${process.env.DATA_API}/api-financial-web/financial/api.do`;
            break;
          case 'goodsOperate':  //商品运营
            config.baseURL = `${process.env.DATA_API}/api-public-web/public/api.do`;
            //config.baseURL = `/goodsOperate_server/api-public-web/public/api.do`;
            break;
          case 'manager':  //广告和导航开关修改  许涛
            config.baseURL = `${process.env.DATA_API}/api-manager-web/manager/api.do`;
            break;
          case 'data':  //数据
            config.baseURL = `${process.env.DATA_API}/api-behavior-web/behavior/api.do`;
            break;
          case 'overview':  //概况待办售罄
            config.baseURL = `${process.env.DATA_API}/api-commodity-web/commodity/api.do`;
            break;
          case 'pay':  //微信支付设置
            config.baseURL = `${process.env.DATA_API}/api-payment-web/payment/api.do`;
            break;
          case 'uploadImage':  //图片上传
            config.baseURL = `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`;
            break;
          case 'matrix':  //智能运营数据查询条件来源
            config.baseURL = `${process.env.DATA_API}/matrix-admin/matrix/api.do`;
            break;
        }
      }
    }

  }
}

let ajax = Ajax.getInstance();

export default ajax.request.bind(ajax);
