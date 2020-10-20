/*支付方式 */
<template>
    <div class="main">
        <div class="pay_item">
          <div class="left_cont">
            <img src="@/assets/images/set/set-pay1.png"/>
            <div class="note">
              <h3>微信支付</h3>
              <p style="width:90%">如需正常使用微信支付，除需要“设置支付信息”中的内容外，还请在微信商户平台（<a href="pay.weixin.qq.com" target="_blank" class="links">pay.weixin.qq.com</a>）设置您的JSAPI支付支付目录,（设置路径：商户平台-->产品中心-->开发配置)中追加一条支付授权目录：<a :href="origin + '/cp/'" target="_blank" class="links">{{origin + '/cp/'}}</a></p>
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
              <p>开启后，用户可以用账户余额在商城消费。</p>
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
      pageName:'',
      protocol: location.protocol,
      isOnlyOpenAkindPayWay: false, // 是否仅打开一种支付方式
      origin: location.origin
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
    // 是否仅打开一种支付方式
    // isOnlyOpenAkindPayWay() {
    //   let count = 0
    //   if (this.wechatPay) count++
    //   if (this.aliPay) count++
    //   if (this.balanceOfAccountPay) count++
    //   if (this.payOnDelivery) count++
    //   if (count <= 1) {
    //     return true
    //   }
    //   return false
    // },
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        let count = 0
        if (response.wechatPay) count++
        if (response.alipayPay) count++
        if (response.balanceOfAccountPay) count++
        if (response.payOnDelivery) count++
        this.isOnlyOpenAkindPayWay = count > 1 ? false : true
        this.wechatPay = response.wechatPay == 1 ? true : false
        this.aliPay = response.alipayPay == 1 ? true : false
        this.balanceOfAccountPay = response.balanceOfAccountPay == 1 ? true : false
        this.payOnDelivery = response.payOnDelivery == 1 ? true : false
        this.wechatBinding = response.wechatBinding
        this.alipayBinding = response.alipayBinding
        
      }).catch(error =>{
        this.$message.error(error);
      })
    },
    // 处理打开微信支付开关逻辑
    handleOpenWechatPay() {
      // this.confirm({
      //   title: '提示', 
      //   customClass: 'goods-custom', 
      //   icon: true, 
      //   text: '此操作将设置微信支付开关, 是否继续?'
      // }).then(() => {
        let data = {
          wechatPay:this.wechatPay == true ? 1 : 0,
        }
        this.onSubmit(data)          
      // }).catch(() => {
      //   this.getShopInfo()        
      // });
    },
    // 处理关闭微信支付开关逻辑
    handleCloseWechatPay() {
      if (this.isOnlyOpenAkindPayWay) {
        const html = '<p>您需要至少开启一种支付方式</p><p>保证买家完成订单付款！</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          customClass: 'goods-custom',
          text: html,
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          this.wechatPay = true
        });
      } else {
        const html = '<p style="font-size:18px;color: #443D4A;line-height: 28px;">您确定要关闭微信支付吗？</p><p style="color:rgba(146,146,155,1);font-size:16px;line-height: 28px;">关闭后买家将无法使用微信支付完成订单付款。</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          customClass: 'goods-custom',
          text: html,
          confirmText: '确定',
          // showCancelButton: false
        }).then(() => {
          const data = {
            wechatPay:this.wechatPay == true ? 1 : 0,
          }
          this.onSubmit(data) 
        }).catch(() => {
          this.wechatPay = true
        });
         
      }
    },
    //微信支付开关
    handleWechatPay(val){
      // this.getShopInfo()
      if(val == true && this.wechatBinding == 0){
        this.wechatPay = false
        this.dialogVisible = true
        this.pageName = 'wxSet'
      } else {
        if (!val) {
          // 关闭的逻辑处理
          this.handleCloseWechatPay()
        } else {
          // 开启的逻辑处理
          this.handleOpenWechatPay()
        }
      }
    },
    handleCloseAliPay() {
      if (this.isOnlyOpenAkindPayWay) {
        const html = '<p>您需要至少开启一种支付方式</p><p>保证买家完成订单付款！</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          text: html,
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          this.aliPay = true
        });
      } else {
        const html = '<p style="font-size:18px;color: #443D4A;line-height: 28px;">您确定要关闭支付宝支付吗？</p><p style="color:rgba(146,146,155,1);font-size:16px;line-height: 28px;">关闭后买家将无法使用支付宝支付完成订单付款。</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          customClass: 'goods-custom',
          text: html,
          confirmText: '确定',
          // showCancelButton: false
        }).then(() => {
          const data = {
            alipayPay:this.aliPay == true ? 1 : 0
          }
          this.onSubmit(data) 
        }).catch(() => {
          this.aliPay = true
        });
         
      }
    },
    handleOpenAliPay() {
      // this.confirm({
      //   title: '提示', 
      //   customClass: 'goods-custom', 
      //   icon: true, 
      //   text: '此操作将设置支付宝支付开关, 是否继续?'
      // }).then(() => {
        let data = {
          alipayPay:this.aliPay == true ? 1 : 0,
        }
        this.onSubmit(data)          
      // }).catch(() => {
      //   this.getShopInfo()        
      // });
    },
    //支付宝支付开关
    handleAliPay(val){
      if(val == true && this.alipayBinding == 0){
        this.aliPay = false
        this.dialogVisible = true
        this.pageName = 'zfbSet'
      }else{
        if (!val) {
          // 关闭的逻辑处理
          this.handleCloseAliPay()
        } else {
          // 开启的逻辑处理
          this.handleOpenAliPay()
        }
      }
    },
    handleCloseBalanceOfAccountPay() {
      if (this.isOnlyOpenAkindPayWay) {
        const html = '<p>您需要至少开启一种支付方式</p><p>保证买家完成订单付款！</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          text: html,
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          this.balanceOfAccountPay = true
        });
      } else {
        const html = '<p style="font-size:18px;color: #443D4A;line-height: 28px;">您确定要关闭账户余额吗？</p><p style="color:rgba(146,146,155,1);font-size:16px;line-height: 28px;">关闭后买家将无法使用余额支付完成订单付款。</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          customClass: 'goods-custom',
          text: html,
          confirmText: '确定',
          // showCancelButton: false
        }).then(() => {
          const data = {
            balanceOfAccountPay:this.balanceOfAccountPay == true ? 1 : 0,
          }
          this.onSubmit(data) 
        }).catch(() => {
          this.balanceOfAccountPay = true
        });
         
      }
    },
    handleOpenBalanceOfAccountPay() {
      // this.confirm({
      //   title: '提示', 
      //   customClass: 'goods-custom', 
      //   icon: true, 
      //   text: '此操作将设置余额支付开关, 是否继续?'
      // }).then(() => {
        let data = {
          balanceOfAccountPay:this.balanceOfAccountPay == true ? 1 : 0,
        }
        this.onSubmit(data)        
      // }).catch(() => {
      //   this.getShopInfo()        
      // });
    },
    //账户余额支付开关 
    handleBalanceOfAccountPay(val){
      if (!val) {
        // 关闭的逻辑处理
        this.handleCloseBalanceOfAccountPay()
      } else {
        // 开启的逻辑处理
        this.handleOpenBalanceOfAccountPay()
      }
    },
    handleClosePayOnDelivery() {
      if (this.isOnlyOpenAkindPayWay) {
        const html = '<p>您需要至少开启一种支付方式</p><p>保证买家完成订单付款！</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          text: html,
          confirmText: '我知道了',
          showCancelButton: false
        }).finally(() => {
          this.payOnDelivery = true
        });
      } else {
        const html = '<p style="font-size:18px;color: #443D4A;line-height: 28px;">您确定要关闭货到付款吗？</p><p style="color:rgba(146,146,155,1);font-size:16px;line-height: 28px;">关闭后买家将无法使用货到付款完成订单付款。</p>'
        this.confirm({
          title: '提示', 
          iconWarning: true, 
          customClass: 'goods-custom',
          text: html,
          confirmText: '确定',
          // showCancelButton: false
        }).then(() => {
          const data = {
            payOnDelivery:this.payOnDelivery == true ? 1 : 0,
          }
          this.onSubmit(data) 
        }).catch(() => {
          this.payOnDelivery = true
        });
      }
    },
    handleOpenPayOnDelivery() {
      // this.confirm({
      //   title: '提示', 
      //   customClass: 'goods-custom', 
      //   icon: true, 
      //   text: '此操作将设置货到付款开关, 是否继续?'
      // }).then(() => {
        let data = {
          payOnDelivery:this.payOnDelivery == true ? 1 : 0,
        }
        this.onSubmit(data)     
      // }).catch(() => {
      //   this.getShopInfo()        
      // });
    },
    //货到付款开关
    handlePayOnDelivery(val){
      if (!val) {
        // 关闭的逻辑处理
        this.handleClosePayOnDelivery()
      } else {
        // 开启的逻辑处理
        this.handleOpenPayOnDelivery()
      }
    },
    isOpenPrompt(query = {}) {
      console.log('query',query, query.hasOwnProperty('balanceOfAccountPay'))
      // wechatPay
      // aliPay
      // balanceOfAccountPay
      // payOnDelivery
      let isOpenPrompt = false
      if (query.hasOwnProperty('wechatPay')) isOpenPrompt = query.wechatPay == 1 ? true : false
      if (query.hasOwnProperty('alipayPay')) isOpenPrompt = query.alipayPay == 1 ? true : false
      if (query.hasOwnProperty('balanceOfAccountPay')) isOpenPrompt = query.balanceOfAccountPay == 1 ? true : false
      if (query.hasOwnProperty('payOnDelivery')) isOpenPrompt = query.payOnDelivery == 1 ? true : false
      return isOpenPrompt
    },
    onSubmit(data){
      let id = this.cid
      let query = Object.assign({id:id},data)
      const isOpen = this.isOpenPrompt(query)
      this._apis.set.updateShopInfo(query).then(response =>{
        console.log(123213131321, isOpen)
        if (isOpen) this.$message.success('开启成功')
        else this.$message.success('关闭成功');
        // this.$message.success('开启成功');
        this.getShopInfo()
      }).catch(error =>{
        this.$message.error(error);
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