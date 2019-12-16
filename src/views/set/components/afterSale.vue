/*售后相关 */
<template>
  <div class="main">
    <el-form ref="form" :model="form" :rules="rules" label-width="200px">
        <div class="item">
            <h2>自动收货： <span>说明：仅对有物流信息的订单生效，对没有物流信息的订单需要手动确认</span></h2>
            <el-form-item label="买家自动确认收货时间："></el-form-item>
            <el-form-item label="买家物流签收" prop="memberAutoConfirmReceive">
                <el-input-number 
                v-model="form.memberAutoConfirmReceive" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="请输入整数，清空数值则关闭该功能"
                :min="1" 
                :max="30">
                </el-input-number>
                天后，自动确认收货
            </el-form-item>
            <el-form-item label="卖家自动确认收货时间："></el-form-item>
            <el-form-item label="卖家物流签收" prop="shopAutoConfirmReceive">
                <el-input-number 
                v-model="form.shopAutoConfirmReceive" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="请输入整数，清空数值则关闭该功能"
                :min="1" 
                :max="30">
                </el-input-number>
                天后，自动确认收货
            </el-form-item>
        </div>
        <div class="item">
            <h2>售后自动关闭时间：</h2>
            <el-form-item label="订单完成" prop="orderAutoFinished">
                <el-input-number 
                v-model="form.orderAutoFinished" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="请输入整数，清空数值则关闭该功能"
                :min="1" 
                :max="30">
                </el-input-number>
                天后，售后自动关闭
            </el-form-item>
        </div>
        <!-- <div class="item">
            <h2>评价相关：</h2>
            <el-form-item label="评价功能开启" prop="orderComment">
                <el-radio-group v-model="form.orderComment">
                    <el-radio :label="1" class="mr10">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
                <span class="note">
                  说明：启用后买家可以对购买商品进行评论，您可以根据评论内容进行回复。
                </span>
            </el-form-item>
            <el-form-item label="订单完成" prop="orderCommentGood">
                <el-input-number 
                v-model="form.orderCommentGood" 
                controls-position="right" 
                style="width:96px;" 
                placeholder="请输入整数，清空数值则关闭该功能"
                :min="1" 
                :max="30">
                </el-input-number>
                天后,自动评价为好评
            </el-form-item>
        </div> -->
        <div class="item">
            <h2>资产相关：</h2>
            <el-form-item label="发票功能开启" prop="invoiceOpen">
                <el-radio-group v-model="form.invoiceOpen">
                    <el-radio :label="1" class="mr10">是</el-radio>
                    <el-radio :label="2">否</el-radio>
                </el-radio-group>
                <span class="note">
                  说明：启用后买家可以申请开发票。
                </span>
            </el-form-item>
            <!-- <el-form-item label="整笔订单退款"></el-form-item>
            <el-form-item label="是否退回优惠券" prop="name7">
                <el-radio-group v-model="form.name7">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否退回优惠码" prop="name8">
                <el-radio-group v-model="form.name8">
                    <el-radio :label="3">是</el-radio>
                    <el-radio :label="6">否</el-radio>
                </el-radio-group>
            </el-form-item> -->
        </div>
        <div class="item">
            <h2>
                物流查询：
                <span class="note">电子面单和物流轨迹查询服务是与第三方快递鸟合作，开启服务器需注册快递鸟会员，相关费用直接与快递鸟结算</span>    
            </h2>
            <el-form-item label="是否开启物流轨迹查询服务：" prop="isTrace">
                <el-radio-group v-model="form.isTrace">
                    <el-radio :label="1" class="mr10">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="请注册快递鸟并输入用户ID:" prop="kdBusinessId" v-if="form.isTrace == 1">
                <el-input placeholder="请输入用户ID" v-model="form.kdBusinessId" style="width:260px;"></el-input>
            </el-form-item>
            <el-form-item label="请注册快递鸟并输入API Key:" prop="apiKey" v-if="form.isTrace == 1">
                <el-input placeholder="请输入用户API Key" v-model="form.apiKey" style="width:260px;"></el-input>
            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '交易设置', '售后相关', '保存']" v-loading="loading">保存</el-button>
        </el-form-item>
    </el-form>
  </div>     
</template>

<script>
export default {
  name: 'afterSale',
  data() {
    return {
      loading:false,
      currentTab: 'afterSale',
      form: {
            memberAutoConfirmReceive: '',
            shopAutoConfirmReceive: '',
            orderAutoFinished: '',
            orderComment:'1',
            orderCommentGood: '',
            invoiceOpen:'1',
            isTrace:'0',
            apiKey:'',
            kdBusinessId:''
        },
      rules: {
          name1: [
          // { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
     options: [
        {
          value: '1',
          label: '小时'
        }, 
        {
          value: '2',
          label: '分钟'
        }, 
     ]
    }
  },
  components: {},
  watch: {
    
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },
  created() {
      this.getShopInfo()
      this.getShopLogistics()
  },

  methods: {
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.form.memberAutoConfirmReceive = response.memberAutoConfirmReceive,
        this.form.shopAutoConfirmReceive = response.shopAutoConfirmReceive,
        this.form.orderAutoFinished = response.orderAutoFinished,
        this.form.orderComment = response.orderComment,
        this.form.orderCommentGood = response.orderCommentGood,
        this.form.invoiceOpen = response.invoiceOpen
      }).catch(error =>{
        console.log(error)
      })
    },
    
    getShopLogistics(){
      let id = this.cid
      this._apis.set.getShopLogistics({cid:id}).then(response =>{
        this.form.isTrace = response.isTrace,
        this.form.apiKey = response.apiKey,
        this.form.kdBusinessId = response.kdBusinessId
      }).catch(error =>{
        console.log(error)
      })
    },

    onSubmit(formName){
      this.loading = true
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.afterSale()
          }
      })
    },
    afterSale(){
      let id = this.cid
      let data = {
          id:id,
          memberAutoConfirmReceive:this.form.memberAutoConfirmReceive,
          shopAutoConfirmReceive:this.form.shopAutoConfirmReceive,
          orderAutoFinished:this.form.orderAutoFinished,
          orderComment:this.form.orderComment,
          orderCommentGood:this.form.orderCommentGood,
          invoiceOpen:this.form.invoiceOpen,
        }
        this._apis.set.updateShopInfo(data).then(response =>{
          this.loading = false
          this.logistics()
        }).catch(error =>{
          this.loading = false
      })
    },
    logistics(){
      let id = this.cid
      let data = {
          id:id,
          isTrace:this.form.isTrace,
          apiKey:this.form.apiKey,
          kdBusinessId:this.form.kdBusinessId
      }
      this._apis.set.updateShopLogistics(data).then(response =>{
          this.$notify.success({
            title: '成功',
            message: '保存成功！'
          });
        }).catch(error =>{
          this.$notify.error({
            title: '失败',
            message: '保存失败！'
          });
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.item{
    border-bottom: 1px dashed #D3D3D3;
    padding-bottom: 20px;
    margin-bottom: 20px;
    h2{
        font-size: 14px;
        color: #3D434A;
        margin-bottom: 20px;
        span{
            font-size: 12px;
            color: #92929B;
        }
    }
}
.note{
    font-size: 12px;
    color: #92929B;
}
.mr10{
  margin-right:10px;
}
</style>