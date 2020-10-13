// import Cookies from 'js-cookie'
import utils from '@/utils';

const app = {
  state: {
    shopInfo: {},  //店铺信息
    colorStyle: {},  //店铺颜色风格
    storeGuide: null
  },
  mutations: {
    setShopInfo: (state, data) => {
      state.shopInfo = data;
    },
    setColorStyle: (state, data) => {
      state.colorStyle = data;
    },
    setStoreGuide(state, val) {
      state.storeGuide = +val
    }
  },
  actions: {

    // 获取店铺信息
    getShopInfo({ commit, state }, params) {
      // debugger
      params = params || {}
      return new Promise((resolve, reject) => {
        const loalShopInfo = localStorage.getItem('shopInfos');
        const hasShopInfo = loalShopInfo && JSON.parse(loalShopInfo) && Object.prototype.toString.call(JSON.parse(loalShopInfo)) === '[object Object]';
        if(!hasShopInfo) {
          reject('未找到店铺信息!')
          return;
        }
        let shopInfo = JSON.parse(loalShopInfo);
        let cid = shopInfo.id || '';
        this._apis.shopInfo.getShopInfo(Object.assign({id: cid}, params)).then((response)=>{
          commit('setShopInfo', response);
          commit('setStoreGuide', response.storeGuide);
          resolve(response)
        }).catch((error)=>{
          commit('setShopInfo', {});
          commit('setStoreGuide', null);
          reject(error)
        });
      })
    },

    // 获取店铺样式
    getShopStyle({ commit }) {
      return new Promise((resolve, reject) => {
        this._apis.shop.getShopStyle({}).then((response)=>{
          if(response && response.colorStyle) {
            commit('setColorStyle', JSON.parse(utils.uncompileStr(response.colorStyle)));
          }else{
            commit('setColorStyle', {});
          }
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
