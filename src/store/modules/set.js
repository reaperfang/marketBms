const set = {
  state: {
    anotherAuthEnable: 0
  },

  mutations: {
    SET_SET_INFO:(state, enable) =>{
      localStorage.setItem('anotherAuthEnable', enable + '');
      state.anotherAuthEnable = enable
    }
  },

  actions: {
    // 店铺授权平台列表
    getShopAuthList({ commit, state }) {
      return new Promise((resolve, reject) => {
        this._apis.set.getShopAuthList().then(res => {
          let enable = 0
          let item = res.find(val => val.platformType == 1)

          if(item && item.enable) {
            enable = 1
          }
          commit('SET_SET_INFO', enable)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default set
