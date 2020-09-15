const order = {
  state: {
    expressCompanyList: []
  },

  mutations: {
    SET_EXPRESS_COMPANY_LIST:(state, list) =>{
      localStorage.setItem('expressCompanyList', JSON.parse(JSON.stringify(list)));
      state.expressCompanyList = list
    },
  },

  actions: {
    getExpressCompanyList({ commit, state }) {
      return new Promise((resolve, reject) => {
        this._apis.order.getElectronicFaceSheetExpressCompanyList().then(res => {
          res.forEach(val => {
            val.expressCompanyCode = val.expressCode
            val.expressCompany = val.expressName
          })
          res.push({
            expressCompanyCode: 'other',
            expressCompany: '其他'
          })
          commit('SET_EXPRESS_COMPANY_LIST', res)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
  }
}

export default order
