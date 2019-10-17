/*会员设置 */
<template>
    <div class="main">
        <h1>成为老会员条件：</h1>
        <el-form ref="form" :model="form">
            <el-form-item label="新会员交易次数达到" prop="num">
                <el-input-number 
                v-model="form.oldMemberSet" 
                :min="1" 
                style="width:200px;" 
                label="请输入阿拉伯数字进行设置">
                </el-input-number>
                即为老会员
                <span class="note">（交易次数：已付款订单数量）</span>
            </el-form-item>
            <el-form-item class="mtb200">
                <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '会员设置', '默认页面', '修改']">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'memberSet',
  data() {
    return {
        form:{
            oldMemberSet:''
        }
    }
  },
  created(){
      this.getShopInfo()
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },
  methods:{
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.form = response
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.cid
            let data = {
              id:id,
              oldMemberSet:this.form.oldMemberSet
            }
            this._apis.set.updateShopInfo(data).then(response =>{
              this.$notify.success({
                title: '成功',
                message: '保存成功！'
              });
            }).catch(error =>{
              this.$notify.error({
                title: '错误',
                message: error
              });
            })
          }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main{
    width: 100%;
    background: #fff;
    padding: 20px;
    h1{
        font-size: 14px;
        color: #3D434A;
        margin-bottom: 30px;
    }
}
.note{
    font-size: 12px;
    color: #92929B;
}
.mtb200{
    margin: 200px 0;
}
</style>