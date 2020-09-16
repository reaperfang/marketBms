export const deliveryWay1 = {
  data() {
    return {
      expressCompanyList: [],
      params: {},
      _list: [],
      title: "",
      express: null,
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
    checkExpress() {
      let expressName

      if (this.ruleForm.expressNos) {
        this.ruleForm.expressNos = ''
      }
      if (this.ruleForm.other) {
        this.ruleForm.other = ''
      }
      if (this.ruleForm.expressCompanyCode == 'other') {
        expressName = 'other'
      } else {
        expressName = this.expressCompanyList.find(
          val => val.expressCompanyCode == this.ruleForm.expressCompanyCode
        ).expressCompany;
      }
      this._apis.order
        .checkExpress({ expressName })
        .then(res => {
          this.express = res;
          if (this.express == null) {
            this.$set(this.rules, "expressNos", [
              { required: true, message: "请输入快递单号", trigger: "blur" }
            ]);
          } else {
            this.$set(this.rules, "expressNos", [
              { required: false, message: "请输入快递单号", trigger: "blur" }
            ]);
          }

          this._list.splice(0, 1, Object.assign({}, this._list[0], {
            expressCompanyCodes: this.ruleForm.expressCompanyCode,
            express: res
          }))
          console.log(this._list)
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
  },
  components: {

  }
}

export const deliveryWay2 = {
  data() {
    return {
      distributorList: [], //配送员筛选后的数据
      distributorListFilter: [], //所有配送员数据
      distributorName: '', //配送员名字
      distributorId: '', //配送员id
      isDistributorShow: false, //尚未创建配送员信息提示控制
      distributorSet: false,
    }
  },
  methods: {
    //获取配送员列表
    getDistributorList() {
      this._apis.order
        .getDistributorList({
          "shopInfoId": this.cid,
          "roleName": "配送员",
          "startIndex": 1,
          "pageSize": 1000
        })
        .then(res => {
          //如果没有配送员，则提示去创建
          if (res.list.length == 0) {
            this.isDistributorShow = true;
          } else {
            this.isDistributorShow = false;
          }
          res.list.forEach((item) => {
            item.name = item.userName;
            item.phone = item.mobile;
          })
          //如果没有子帐号配置权限，则默认自己是配送员
          if (!this.distributorSet) {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            res.list = [
              {
                "id": 1,
                "name": userInfo.userName,
                "phone": userInfo.mobile
              }
            ];
            this.ruleFormStore.distributorValue = userInfo.userName;
            this.distributorName = userInfo.userName;
            this.ruleFormStore.phone = userInfo.mobile;
          }
          this.distributorListFilter = res.list;
          //如果是刷新按钮触发 ，且已经有配送员名字，则重新过滤一下。
          if (this.ruleFormStore.distributorValue) {
            this.distributorList = this.distributorListFilter.filter((item) => {
              if (item.name.includes(this.distributorName) || item.name.toUpperCase().includes(this.distributorName.toUpperCase())) {
                return true
              }
            })
          } else { //否则直接赋值全部配送员
            this.distributorList = res.list;
          }
        })
        .catch(error => { });
    },
    selectFocus(e) {
      const value = e.target.value;
      const input = this.$refs.searchSelect.$children[0].$refs.input;
      this.$nextTick(() => {
        input.setAttribute('placeholder', '请输入或选择');
        input.value = value;
        input.setAttribute('maxlength', 20);
        input.selectionStart = input.selectionEnd = input.value.length
      })
    },
    visibleChange(val) {
      if (!val) {
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        input.blur();
      } else {
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        let value = input.value;
        this.$nextTick(() => {
          input.value = value;
        })
      }
    },
    selectBlur() {
      //失去焦点时如果input中有值，且发生了变化，则需要根据name查询出对应的数据
      if (this.ruleFormStore.distributorValue != '' && this.ruleFormStore.distributorValue != this.distributorName) {
        let arr = this.distributorListFilter.filter((item) => {
          if (item.name === this.ruleFormStore.distributorValue) {
            return true
          }
        })
        //如果未查询到，则把没有id，只记录配送员名字
        if (arr.length == 0) {
          this.distributorName = this.ruleFormStore.distributorValue;
          this.distributorId = '';
        } else {
          this.distributorName = arr[0].name;
          this.distributorId = arr[0].id;
          this.ruleFormStore.phone = arr[0].phone;
          this.$refs.ruleFormStore.validateField('phone');
        }
      }
    },
    dataFilter() {
      //这里需要使用input本身的value，且过滤前后空格
      const input = this.$refs.searchSelect.$children[0].$refs.input;
      const val = input.value.trim();
      this.ruleFormStore.distributorValue = val;
      if (val) {
        this.distributorList = this.distributorListFilter.filter((item) => {
          if (item.name.includes(val) || item.name.toUpperCase().includes(val.toUpperCase())) {
            return true
          }
        })
      } else {
        this.distributorList = this.distributorListFilter;
      }
    },
    selectChange(val) {
      //选择后，把筛选列表重置
      this.distributorList = this.distributorListFilter.filter((item) => {
        if (item.name.includes(val) || item.name.toUpperCase().includes(val.toUpperCase())) {
          return true
        }
      })
      //根据name查询出对应数据，把选择的name和id给到相关字段
      let arr = this.distributorListFilter.filter((item) => {
        if (item.name === val) {
          return true
        }
      })
      this.distributorName = arr[0].name;
      this.distributorId = arr[0].id;
      this.ruleFormStore.phone = arr[0].phone;
      this.$refs.ruleFormStore.validateField('phone');
    },
    //新页面打开子帐号管理
    gotoSubaccountManage() {
      let routeData = this.$router.resolve({ path: '/set/subaccountManage' });
      window.open(routeData.href, '_blank');
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
      ajax: true,
      currentDialog: "",
      dialogVisible: false,
      currentData: {},
      sendGoods: "",
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
