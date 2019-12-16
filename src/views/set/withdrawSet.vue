/*提现设置 */
<template>
    <div class="main">
      <el-form ref="form" :model="form">
        <el-form-item label="是否允许提现:" prop="cashOut">
          <el-radio-group v-model="form.cashOut">
            <el-radio :label="0">不允许</el-radio>
            <el-radio :label="1" style="margin-left:10px;">允许</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="pdl100" v-if="form.cashOut == 1">
          <p class="note note1">提示：请确认您在微信支付中开通了【商户支付】功能，否则用户将无法提现！</p>
          <p class="note note2">
            开通教程链接：
            <a href="https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1" target="_blank">
              https://pay.weixin.qq.com/wiki/doc/api/tools/mch_pay.php?chapter=14_1
            </a>            
          </p>
          <el-form-item prop="cashOutUpper">
            <el-checkbox v-model="cashOutUpperChecked"></el-checkbox>
            单笔提现金额上限
            <el-input-number v-model="form.cashOutUpper" :min="0" :max="5000" label="请输入整数" :precision="0">
            </el-input-number> 元
          </el-form-item>
          <el-form-item prop="cashOutLower">
            <el-checkbox v-model="cashOutLowerChecked"></el-checkbox>
            单笔最低提现金额
            <el-input-number v-model="form.cashOutLower" :min="0" :max="5000" label="请输入整数" :precision="0">
            </el-input-number> 元
          </el-form-item>
          <el-form-item prop="cashOutTimes">
            <el-checkbox v-model="cashOutTimesChecked"></el-checkbox>
            每日提现次数上限
            <el-input-number v-model="form.cashOutTimes" :min="0" label="请输入整数" :precision="0">
            </el-input-number> 次
          </el-form-item>
          <el-form-item prop="cashOutMoney">
            <el-checkbox v-model="cashOutMoneyChecked"></el-checkbox>
            余额满
            <el-input-number v-model="form.cashOutMoney" :min="0" :max="5000" label="请输入整数" :precision="0">
            </el-input-number> 元,可提现
          </el-form-item>
        </div>
        <el-form-item class="save">
          <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '提现设置', '默认页面', '保存']" v-loading="loading">保存</el-button>
        </el-form-item>
      </el-form>
    </div>    
</template>

<script>
export default {
  name: 'withdrawSet',
  data() {
    return {
      loading:false,
      form:{
        cashOut:0,
        cashOutUpper:0,
        cashOutLower:0,
        cashOutTimes:0,
        cashOutMoney:0,        
      },
      cashOutUpperChecked:false,
      cashOutLowerChecked:false,
      cashOutTimesChecked:false,
      cashOutMoneyChecked:false,
    }
  },
  components: {},
  watch: {
   
  },
  created() {
    this.getShopInfo()
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },
  destroyed() {
    
  },
  methods: {
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.form = response
        this.form.cashOutUpper != null  && (this.cashOutUpperChecked = true)
        this.form.cashOutLower != null  && (this.cashOutLowerChecked = true)
        this.form.cashOutTimes != null  && (this.cashOutTimesChecked = true)
        this.form.cashOutMoney != null  && (this.cashOutMoneyChecked = true)
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    onSubmit(formName){
      this.loading = true
      this.$msgbox({
        title: '确认提示',
        message: '请确认开通了【商户支付】功能，否则将可能会产生相关客诉，因此产生的法律风险商家需要自行承担',
        showCancelButton: true,
        confirmButtonText: '确认已开通，继续保存',
        cancelButtonText: '返回',
      }).then(() => {
        this.save(formName)
      })
    },

    save(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.form.cashOutUpper <= this.form.cashOutLower){
              this.$message.error('单笔提现金额上限应大于单笔最低提现金额');
            }else if(!(this.cashOutUpperChecked || this.cashOutLowerChecked || this.cashOutTimesChecked || this.cashOutMoneyChecked)){
              this.$message.error('允许状态下至少勾选一个条件');
            }else{
              let id = this.cid
              if(this.cashOutUpperChecked == false){
                this.form.cashOutUpper = null
              }else if(String(this.form.cashOutUpper).trim()== 'undefined'){
                this.$message({
                  message: '单笔提现金额上限,请输入有效数字',
                  type: 'warning'
                });
              }else if(this.cashOutLowerChecked == false){
                this.form.cashOutLower = null
              }else if(!String(this.form.cashOutLower).trim()== 'undefined'){
                this.$message({
                  message: '单笔最低提现金额,请输入有效数字',
                  type: 'warning'
                });
              }else if(this.cashOutTimesChecked == false){
                this.form.cashOutTimes = null
              }else if(!String(this.form.cashOutTimes).trim()== 'undefined'){
                this.$message({
                  message: '每日提现次数上限,请输入有效数字',
                  type: 'warning'
                });
              }else if(this.cashOutMoneyChecked == false){
                this.form.cashOutMoney = null
              }else if(!String(this.form.cashOutMoney).trim()== 'undefined'){
                this.$message({
                  message: '体现余额限制,请输入有效数字',
                  type: 'warning'
                });
              }else{
                let data = Object.assign({id:id},this.form)
                this._apis.set.updateShopInfo(data).then(response =>{
                  this.loading = false
                  this.$notify.success({
                    title: '成功',
                    message: '保存成功！'
                  });
                }).catch(error =>{
                  this.loading = false
                  this.$notify.error({
                    title: '错误',
                    message: error
                  });
                })
              }
            }
          }
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
  padding: 20px;
  .note{
    font-size: 12px;
    line-height: 30px;
  }
  .note1{
    color: #E94D49;
  }
  .note2{
    color: #ccc;
    a{
      &:hover{
        color:#655EFF;
      }
    }
  }
  .save{
    margin: 200px 0 200px 140px;
  }
  .pdl100{
    padding-left: 100px;
  }
}
</style>