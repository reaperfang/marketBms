import Pagination from '@/components/Pagination'

export const search = {
	data() {
		return {
			listQuery: {
        startIndex: 1,
        pageSize: 20,
      },
      total: 0,
      list: []
		}
	},
	methods: {
		resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getList(param) {
      
    },
  },
  components: {
    Pagination,
  }
}

export const deliveryWay1 = {
  data() {
    return {
      expressCompanyList: [],
      params: {},
      _list: [],
    }
  },
  methods: {
    getExpressCompanyList() {
      this._apis.order
        .getElectronicFaceSheetExpressCompanyList()
        .then(res => {
          res.forEach(val => {
            val.expressCompanyCode = val.expressCode
            val.expressCompany = val.expressName
          })
          res.push({
            expressCompanyCode: 'other',
            expressCompany: '其他'
          })
          this.expressCompanyList = res;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
  },
  components: {
    
  }
}

export const common = {
  data() {
    return {
      sending: false,
      shopAddressInfo: null,
    }
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
  },
  methods: {
    cancel() {
      this.sending = false
    },
  },
  components: {
    
  }
}