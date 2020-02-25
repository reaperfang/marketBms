/*支付方式 */
<template>
    <div class="main">
        <div class="pay_item">
          <div class="left_cont">
            <img src="@/assets/images/set/set-pay1.png"/>
            <div class="note">
              <h3>微信支付</h3>
              <p style="width:90%">如需正常使用微信支付，除需要“设置支付信息”中的内容外，还请在微信商户平台（<a href="pay.weixin.qq.com" target="_blank" class="links">pay.weixin.qq.com</a>）设置您的JSAPI支付支付目录,（设置路径：商户平台-->产品中心-->开发配置)中追加一条支付授权目录：<a href="http://omo.aiyouyi.cn/cp/" target="_blank" class="links">http://omo.aiyouyi.cn/cp/</a></p>
            </div>
          </div>
          <div class="right_cont">
            <el-switch
              v-model="wechatPay"
              @change="handleWechatPay"
              active-color="#13ce66"
              inactive-color="#eee"
              v-permission="['设置', '支付方式', '默认页面', '开启/关闭']">
            </el-switch>
            <a class="wxinfo_set" @click="_routeTo('wxSet')" v-permission="['设置', '支付方式', '默认页面', '设置支付信息']">设置支付信息</a>
          </div>
        </div>
        <div class="pay_item">
          <div class="left_cont">
            <img src="@/assets/images/set/set-pay4.png"/>
            <div class="note">
              <h3>支付宝支付</h3>
              <p>开启后用户可以通过支付宝进行在线支付。（只在pc和wap端生效，微信小程序和微信公众号不支持）</p>
            </div>
          </div>
          <div class="right_cont">
            <el-switch
              v-model="aliPay"
              @change="handleAliPay"
              active-color="#13ce66"
              inactive-color="#eee"
              v-permission="['设置', '支付方式', '默认页面', '开启/关闭']">
            </el-switch>
            <a class="wxinfo_set" @click="_routeTo('zfbSet')" v-permission="['设置', '支付方式', '默认页面', '设置支付信息']">设置支付信息</a>
          </div>
        </div>
        <div class="pay_item">
          <div class="left_cont">
            <img src="@/assets/images/set/set-pay2.png"/>
            <div class="note">
              <h3>账户余额</h3>
              <p>开启后，客户可以用账户余额在商城消费。</p>
            </div>
          </div>
          <div class="right_cont">
            <el-switch
              v-model="balanceOfAccountPay"
              @change="handleBalanceOfAccountPay"
              active-color="#13ce66"
              inactive-color="#eee"
              v-permission="['设置', '支付方式', '默认页面', '开启/关闭']">
            </el-switch>
          </div>
        </div>
        <div class="pay_item">
          <div class="left_cont">
            <img src="@/assets/images/set/set-pay3.png"/>
            <div class="note">
              <h3>货到付款</h3>
              <p>启用货到付款后，请自行安排合作快递完成收款和结算，系统不提供代收货款服务。</p>
            </div>
          </div>
          <div class="right_cont">
            <el-switch
              v-model="payOnDelivery"
              @change="handlePayOnDelivery"
              active-color="#13ce66"
              inactive-color="#eee"
              v-permission="['设置', '支付方式', '默认页面', '开启/关闭']">
            </el-switch>
          </div>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%">
          <span>未设置支付信息</span>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="_routeTo(pageName)">去设置</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
          </span>
        </el-dialog>
    </div>    
</template>

<script>
export default {
  name: 'payType',
  data() {
    return {
      wechatPay:false,
      aliPay:false,
      balanceOfAccountPay:false,
      payOnDelivery:false,
      wechatBinding:0,
      alipayBinding:0,
      dialogVisible:false,
      pageName:''
    }
  },
  components: {},
  watch: { },

  created() {
    this.getShopInfo()
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },

  methods: {    
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.wechatPay = response.wechatPay == 1 ? true : false
        this.aliPay = response.alipayPay == 1 ? true : false
        this.balanceOfAccountPay = response.balanceOfAccountPay == 1 ? true : false
        this.payOnDelivery = response.payOnDelivery == 1 ? true : false
        this.wechatBinding = response.wechatBinding
        this.alipayBinding = response.alipayBinding
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //微信支付开关
    handleWechatPay(val){
      // this.getShopInfo()
      if(val == true && this.wechatBinding == 0){
        this.wechatPay = false
        this.dialogVisible = true
        this.pageName = 'wxSet'
      }else{
        this.$confirm('此操作将设置微信支付开关, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            wechatPay:this.wechatPay == true ? 1 : 0,
          }
          this.onSubmit(data)          
        }).catch(() => {
          this.getShopInfo()        
        });
      }
    },

    //支付宝支付开关
    handleAliPay(val){
      if(val == true && this.alipayBinding == 0){
        this.aliPay = false
        this.dialogVisible = true
        this.pageName = 'zfbSet'
      }else{
        this.$confirm('此操作将设置支付宝支付开关, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            alipayPay:this.aliPay == true ? 1 : 0,
          }
          this.onSubmit(data)          
        }).catch(() => {
          this.getShopInfo()        
        });
      }
    },

    //账户余额支付开关 
    handleBalanceOfAccountPay(){
        this.$confirm('此操作将设置余额支付开关, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            balanceOfAccountPay:this.balanceOfAccountPay == true ? 1 : 0,
          }
          this.onSubmit(data)        
        }).catch(() => {
          this.getShopInfo()        
        });
    },
    //货到付款开关
    handlePayOnDelivery(){
      this.$confirm('此操作将设置货到付款开关, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            payOnDelivery:this.payOnDelivery == true ? 1 : 0,
          }
          this.onSubmit(data)     
        }).catch(() => {
          this.getShopInfo()        
        });
    },

    onSubmit(data){
      let id = this.cid
      let query = Object.assign({id:id},data)
      this._apis.set.updateShopInfo(query).then(response =>{
        this.$notify.success({
          title: '成功',
          message: '保存成功！'
        });
        this.getShopInfo()
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.main{
  width: 100%;
  background: #fff;
  padding: 20px 20px 300px 20px;
}
.pay_item{
  width: 100%;
  border-radius: 10px;
  background: #F5F5F5;
  padding: 20px;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .left_cont{
    display: flex;
    img{
      width: 40px;
      height: 40px;
    }
    .note{
      font-size: 14px;
      color: #3D434A;
      margin-left: 15px;
      h3{
        font-weight:500;
      }
      p{
        font-weight:400;
        line-height: 25px;
      }
    }
  }
  .right_cont{
    width: 140px;
    text-align: right;
    .wxinfo_set{
      font-size: 14px;
      color: #655EFF;
      display: block;
      margin-top: 10px;
    }
  }
}
.links:hover{
  color:#655EFF;
}
</style>