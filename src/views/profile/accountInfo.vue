/*账号信息 */
<template>
    <div class="main">
        <el-form ref="form" :model="form" label-width="120px" v-loading="loading">
            <el-form-item label="登录账号:" >
                {{form.userName}}
            </el-form-item>
            <el-form-item label="昵称:" prop="remark">
                <el-input v-model="form.remark" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="性别:">
                <el-radio-group v-model="form.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="2" class="ml10">女</el-radio>
                    <!-- <el-radio :label="3" class="ml10">保密</el-radio> -->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号:" >
                <el-input v-model="form.mobile" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="QQ:" >
                <el-input v-model="form.qq" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="邮箱:" prop="email">
                <el-input v-model="form.email" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit()" class="mtb200">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>    
</template>

<script>
// import { listArea } from '@/api/area'
export default {
  name: 'accountInfo',
  data() {
    return {
      loading:true,
      form: {
          remark:'',
          userName: '',
          sex: 2,
          mobile:'',
          qq: '',
          email: ''
      },
      userNameOld:'',
      imageUrl: '',
      area: [],
    }
  },
  components: {},
  watch: {
    
  },
  computed:{
    userInfo(){
      return JSON.parse(this.$store.getters.userInfo)
    }
  },
  created() {
      this.init()
  },
  methods: {
    init(){
        this._apis.login.getUserInfo({id:this.userInfo.id}).then(response =>{
            this.userNameOld = response.userName
            this.form = response
            this.loading = false
        }).catch(error =>{
            this.loading = false
            this.$notify.error({
                title: '失败',
                message: error
            })
        })
    },
    // 修改账号信息
    onSubmit(){
        let query = {
            id:this.form.id,
            userName:this.form.userName,
            userNameOld:this.userNameOld,
            remark:this.form.remark,
            email:this.form.email,
            qq:this.form.qq,
            sex:this.form.sex,
            mobile:this.form.mobile
        }
        this._apis.login.updateUserInfo(query).then(response =>{
            this.$notify.success({
                title: '成功',
                message: '更新成功！'
            });
            this.init()
        }).catch(error =>{
            this.$notify.error({
                title: '失败',
                message: error
            })
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
   height: 100%;
   background: #fff; 
   padding: 20px;
   h1{
       font-size:14px;
       color: #3D434A;
       font-weight:500;
       margin-bottom: 30px;
     }
}
.mtb200{
    margin: 200px 0;
}
.ml10{
    margin-left: 10px;
}
</style>
