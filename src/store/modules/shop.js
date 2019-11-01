// import Cookies from 'js-cookie'
import utils from '@/utils';

const app = {
  state: {
    shopInfo: {},  //店铺信息
    colorStyle: {}  //店铺颜色风格
  },
  mutations: {
    setShopInfo: (state, data) => {
      state.shopInfo = data;
    },
    setColorStyle: (state, data) => {
      state.colorStyle = data;
    }
  },
  actions: {

    // 获取店铺信息
    getShopInfo({ commit }) {
      return new Promise((resolve, reject) => {
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        let cid = shopInfo.id || '';
        this._apis.shop.getShopInfo({id: cid}).then((response)=>{
          commit('setShopInfo', response);
          resolve()
        }).catch((error)=>{
          commit('setShopInfo', {});
          reject(error)
        });
      })
    },

    // 获取店铺样式
    getShopStyle({ commit }) {
      return new Promise((resolve, reject) => {
        this._apis.shop.getShopStyle({}).then((response)=>{
          commit('setColorStyle', JSON.parse(utils.uncompileStr(response.colorStyle)));
          resolve()
        }).catch((error)=>{
          commit('setColorStyle', {});
          reject(error)
        });
      })
    }
  }
}

export default app
