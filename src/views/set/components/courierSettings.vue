<template>
   <div class="courierSettings">
     <el-form ref="form" label-position="right" :model="form" label-width="124px">
       <!-- <el-form-item label="开启普通快递">
        <el-switch v-model="form.isOpen" @change="handleIsOpen"></el-switch>
        <span class="promit"><span>{{ getSwitchTxt }}</span>启用后，买家下单可以选择快递发货，由你安排快递送货上门</span>
      </el-form-item> -->
      <!-- <el-form-item class="isTrace" label="开启物流轨迹查询" prop="isTrace">
        <el-radio-group v-model="form.isTrace">
          <el-radio :label="1" class="pr50">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <p class="explain" v-if="form.isTrace == 1">说明：本系统电子面单服务是与第三方快递鸟合作的，使用电子面单需注册快递鸟，若未注册快递鸟，将无法使用电子面单在线发货</p>
      <el-form-item class="idKey" label-width="255px" label="请注册快递鸟并输入用户ID和API key" prop="kdBusinessId" v-if="form.isTrace == 1">
        <el-input placeholder="请输入用户ID" v-model="form.kdBusinessId" style="width:302px; height:34px;"></el-input>
      </el-form-item>
      <el-form-item class="idKey" label-width="255px"  prop="apiKey" v-if="form.isTrace == 1">
        <el-input placeholder="请输入用户API Key" v-model="form.apiKey" style="width:302px; height:34px;"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-permission="['设置','普通快递','快递设置', '保存']" v-loading="loading" @click="handleOnSubmit('form')">保存</el-button>
      </el-form-item>
     </el-form>
   </div>
</template>

<script>
let isHasOtherWay 
export default {
  components: {},

  data () {
    return {
      form: {
        isOpen: false,
        isTrace:1,
        apiKey:'',
        kdBusinessId:''
      },
      loading: false
    }
  },

  computed: {
    cid(){
      let shopInfo = this.$store.getters.shopInfos
      return shopInfo.id
    },
    getSwitchTxt() {
      return this.form.isOpen ? '已开启' : '已关闭'
    },
    shopInfo() {
      return this.$store.state.shop.shopInfo
    }
  },

  watch: {
  },

  created() {
    this.getShopLogistics()
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.$store.dispatch('getShopInfo').then(response => {
          console.log('----response-', response.isOpenOrdinaryExpress, typeof response.isOpenOrdinaryExpress)
          this.form.isOpen = response.isOpenOrdinaryExpress === 1 ? true : false
          isHasOtherWay = response.isOpenMerchantDeliver === 1 || response.isOpenTh3Deliver === 1 || response.isOpenSelfLift === 1
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    handleIsOpen(val) {
      // return false
      // console.log('val', val)
      // 当前是否开启普通快递
      if (val) {
        this.open()
        // return false
      } else {
        this.close()
        // return false
      }
    },
    updateShopInfo(data) {
      const id = this.cid

      return new Promise((resolve, reject) => {
        this._apis.shopInfo.updateShopInfo({...data, id }).then(response =>{
          this.$store.dispatch('getShopInfo');    
          resolve(response)
        }).catch(error =>{
          console.error(error)
          reject(error)
        })
      })
    },
    open() {
      this.updateShopInfo({ isOpenOrdinaryExpress: 1 }).then(response =>{
        this.confirm({
          iconSuccess: true,
          text: '已成功开启快递配送！',
          confirmText: '我知道了',
          showCancelButton: false
        });
        if (!this.form.isOpen) {
          this.form.isOpen = true
        }
      }).catch(error =>{
        this.form.isOpen = false
        this.$message.error(error);
        // this.loading = false
      })
      
    },
    close() {
      // 判断是否有其他配送方式
      // const isHasOtherWay = Math.random() * 10  > 5 ? true : false // mock data

      if (isHasOtherWay) {
        this.confirm({
          icon: true,
          text: '关闭快递配送功能，买家下单时将不能使用普通快递配送 您确定要关闭吗？'
        }).then(() => {
          this.updateShopInfo({ isOpenOrdinaryExpress: 0 }).then(response =>{  
            this.form.isOpen = false
            this.$message.success('保存成功！');
          }).catch(error =>{
            this.form.isOpen = true
            this.$message.error(error);
            // this.loading = false
          })
        }).catch(()=> {
            this.form.isOpen = true
        });
      } else {
        this.confirm({
          icon: true,
          text: '至少需要开启快递发货、商家配送中的一种配送方式 店铺才能正常经营',
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          // console.log('----finally--')
          this.form.isOpen = true
        });
      }
    },
    handleOnSubmit(formName){
      this.loading = true
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.logistics()
          }else{
            this.loading = false
          }
      })
    },
    logistics(){
      let id = this.cid
      let data = {
          id,
          // isTrace: this.form.isTrace,
          isTrace: 1,
          apiKey: this.form.apiKey,
          kdBusinessId: this.form.kdBusinessId
      }
      this._apis.set.updateShopLogistics(data).then(response =>{
          this.$message.success('保存成功！');
        }).catch(error =>{
          this.$message.error('保存失败 '+ error);
      }).finally(() => {
        this.loading = false
      })
    },
    getShopLogistics(){
      let id = this.cid
      this._apis.set.getShopLogistics({cid:id}).then(response =>{
        // this.form.isTrace = response.isTrace,
        this.form.isTrace = 1
        this.form.apiKey = response.apiKey,
        this.form.kdBusinessId = response.kdBusinessId
      }).catch(error =>{
        console.error(error)
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-icon-warning-color1 {
  color:#fd932b;
}
.courierSettings {
  background-color: #fff;
  padding: 6px 20px 50px 20px;
  .isTrace {
    margin-bottom: 0px;
  }
  .promit {
    font-size:12px;
    font-weight:400;
    color:rgba(61,67,74,.5);
    line-height:17px;
    span {
      padding-left: 7px;
      padding-right: 10px;
      font-size:14px;
      color:rgba(68,67,75,1);
      line-height:20px;
    }
  }
  .explain {
    padding-top: 4px;
    padding-left: 125px;
    padding-bottom: 20px;
    font-size:12px;
    font-weight:400;
    color:rgba(61,67,74,.5);
    line-height:17px;
  }
  .idKey {
    padding-left: 110px;
    margin-bottom: 10px;
  }
  .pr50 {
    padding-right: 50px;
  }
}
</style>