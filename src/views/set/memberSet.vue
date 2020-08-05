/*会员设置 */
<template>
  <div class="main">
    <h1>成为老会员条件：</h1>
    <el-form ref="form" :rules="rules" :model="form">
      <el-radio-group class="radio-group" label-position="right" v-model="form.oldMemberType" >
        <div class="radio">
          <el-radio :label="1">交易次数</el-radio>
        </div>
        <div class="label">
          <el-form-item label="新会员交易次数达到" prop="num" label-width="170px">
            <el-input-number
              size="large"
              v-model="form.num" 
              :min="1" 
              :precision="0"
              style="width:151px;" 
              label="请输入阿拉伯数字进行设置">
            </el-input-number>
            即为老会员
            <span class="note">（交易次数：已付款订单数量）</span>
          </el-form-item>
        </div>
        <div  class="radio">
          <el-radio :label="2">交易金额</el-radio>
        </div>
        <div class="label">
          <el-form-item label="新会员交易金额达到" prop="sum" label-width="170px">
            <el-input
              size="large"
              v-model="form.sum" 
              :min="1" 
              :maxlength="9"
              :precision="0"
              placeholder="请输入正数"
              style="width:151px;" 
              label="请输入正整数">
            </el-input>
            即为老会员
            <span class="note">（交易金额：累计付款金额，不包含退款金额）</span>
          </el-form-item>
        </div>
      </el-radio-group>
      <el-form-item class="mtb50 btn">
          <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '会员设置', '默认页面', '修改']" v-loading="loading">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'memberSet',
  data() {
    const validateNum = (rule, value, callback) => {
      if (this.form.oldMemberType === 2)  return callback();
      const reg = /^\d+$/
      if (!reg.test(value)) return callback(new Error('请输入具体次数'));
      return callback();
    };
    const validateSum = (rule, value, callback) => {
      if (this.form.oldMemberType === 1) return callback();
      if (value === '') {
        return callback(new Error('请输入交易金额'));
      }
      const reg = /^\d{1,9}$/
      if (!reg.test(value)) {
        return callback(new Error('请输入正整数'));
      }
      return callback();
      
    };
    return {
        loading:false,
        form:{
            num: null,
            sum: null,
            oldMemberType: null,
        },
        rules:{
          num: [
            { validator: validateNum, trigger: 'blur' }
          ],
          sum: [
            { validator: validateSum, trigger: 'blur' }
          ],
        }
    }
  },
  created(){
    this.getShopInfo()
  },
  computed:{
    cid(){
      const shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      return shopInfo.id
    }
  },
  methods:{
    handleEchoData(data) {
      const form = this.form
      form.oldMemberType = data.oldMemberType
      form.num = form.oldMemberType === 1 ? data.oldMemberSet : 2
      form.sum = form.oldMemberType === 2 ? data.oldMemberSet : ''
    },
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({ id }).then(response =>{
        this.handleEchoData(response)
      }).catch(error =>{
        // this.$message.error(error);
      })
    },
    getReqData() {
      const id = this.cid
      const form = this.form
      const oldMemberType = form.oldMemberType
      const oldMemberSet = oldMemberType === 1 ? form.num : form.sum
      const data = {
        id,
        oldMemberSet,
        oldMemberType
      }
      return data
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = this.getReqData()
          this._apis.set.updateShopInfo(data).then(response =>{
            this.$message.success('保存成功！');
          }).catch(error =>{
            this.$message.error(error);
          }).finally(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main{
  width: 100%;
  background: #fff;
  padding:15px 20px;
  h1{
    font-size:14px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:20px;
    margin-bottom: 30px;
  }
  .radio-group {
    width: 100%;
    padding-left: 40px;
    .radio {
      padding-bottom: 10px;
    }
    .radio, .label {
      font-size:14px;
      font-weight:400;
      color:rgba(68,67,75,1);
      line-height:20px;
    }
    .note{
      font-size: 12px;
      color: #92929B;
    }
  }
  .mtb50{
      margin: 50px 0;
  }
  .btn {
    text-align: center;
  }
}
</style>