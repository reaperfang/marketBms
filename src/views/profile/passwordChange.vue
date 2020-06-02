/*修改密码 */
<template>
    <div class="main">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="请输入旧密码:" prop="oldPassWord">
                <el-input type="password" v-model="form.oldPassWord" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="请输入新密码:" prop="password">
                <el-input type="password" v-model="form.password" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="重复新密码:" prop="confirmPass">
                <el-input type="password" v-model="form.confirmPass" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')" class="mtb200">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>    
</template>

<script>
// import { listArea } from '@/api/area'
export default {
  name: 'passwordChange',
  data() {
      var valOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入旧密码'));
        } else {
          callback();
        }
      };
      var valNewPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else {
         
          callback();
        }
      };
      var valConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入新密码'));
        } else if(value != this.form.password) {
            callback(new Error('请确认新密码'));
        }else{
          callback();
        }
      };
    return {
      form: {
          oldPassWord:'',
          password:'',
          confirmPass:''
      },
      rules: {
          oldPassWord: [
            { validator: valOldPass, trigger: 'blur' }
          ],
          password: [
            { validator: valNewPass, trigger: 'blur' }
          ],
          confirmPass: [
            { validator: valConfirmPass, trigger: 'blur' }
          ],
      imageUrl: '',
      area: [],
    }
    }
  },
  components: {},
  watch: {
    
  },
  computed:{
    userInfo(){
      return JSON.parse(localStorage.getItem("userInfo"));
    }
  },
  created() {

  },
  methods: {
    // 修改密码
    onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updatePass()
          } else {
            return false;
          }
        });
    },
    updatePass(){
      let query = {
        id:this.userInfo.id,
        oldPassWord:this.form.oldPassWord,
        password:this.form.password
      }
      this._apis.login.updatePass(query).then(response =>{
        this.$message.success('更新成功！');
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
</style>
