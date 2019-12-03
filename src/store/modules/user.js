import { getToken, setToken, removeToken } from '@/system/auth'
import utils from "@/utils";

const user = {
  state: {
    token: getToken(),
    roles: [],
    userInfo: null,
    shopInfos:''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USER_INFO: (state, userInfo) => {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      state.userInfo = userInfo
    },
    SET_SHOP_INFO:(state, shop) =>{
      localStorage.setItem('shopInfos', JSON.stringify(shop));
      state.shopInfos = shop
    }
  },

  actions: {
    // 用户名登录
    login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        this._apis.login.login(userInfo).then(response => {
          if(response.accessToken){
            commit('SET_TOKEN', response.accessToken);
            setToken(response.accessToken);
          }
          if(response.info){
            const user = JSON.parse(response.info);
            if(user){
              // commit('SET_ROLES', ['shop'])
              //所有店铺的功能点列表由扁平化数据转为树形结构
              let data = user.shopInfoMap
              for(let key in data){
                if(data[key].data){
                  let list = JSON.parse(JSON.stringify(data[key].data.msfList))
                  let functions = utils.buildTree(list)
                  data[key].data = Object.assign(data[key].data,{functions:functions})
                }
              }
              commit('SET_USER_INFO', user)
            }
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
     
    //设置本地店铺信息缓存
    setShopInfos({commit},shop){
      return new Promise((resolve, reject) => {
        commit('SET_SHOP_INFO',shop)
        // window.eventHub.$emit('onShopInfos')
        resolve()
      }).catch(error => {
        reject(error)
      })
    },

    //根据店铺cid，查询店铺信息，并更新缓存
    // getShopInfos({commit},cid){
    //   return new Promise((resolve, reject) => {
    //     this._apis.set.getShopInfo({id:cid}).then(response =>{
    //       commit('SET_SHOP_INFO',response)
    //       window.eventHub.$emit('onShopInfos')        
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    //退出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        // logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          localStorage.removeItem('userInfo')
          localStorage.removeItem('shopInfos')
          resolve()
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        localStorage.removeItem('userInfo')
        localStorage.removeItem('shopInfos')
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        let roles = []
        commit('SET_ROLES', roles)
        // commit('SET_TOKEN', role)
        // setToken(role)
      //   this.$api.getUserInfo(role).then(response => {
      //     const data = response.data
      //     commit('SET_ROLES', data.roles)
      //     commit('SET_USER_INFO', data)
      //     dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
      //     resolve()
      //   })
      })
    },
  }
}

export default user
