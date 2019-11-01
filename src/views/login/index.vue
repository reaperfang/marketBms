<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
      <img src="@/assets/images/chahua.png" alt="">
      <div class="main">
        <div class="title-container">
          <h3 class="title">新零售客户营销系统</h3>
        </div>
        <el-form-item prop="userName">
          <span class="svg-container svg-container_login">
            <img src="@/assets/images/icon_username.png">
          </span>
          <el-input v-model="loginForm.userName" name="userName" type="text" placeholder="用户名" style="border:none;"  class="login_input"/>
        </el-form-item>

        <el-form-item prop="password">
          <span class="svg-container">
            <img src="../../assets/images/icon_password.png">
          </span>
          <el-input :type="passwordType" v-model="loginForm.password" name="password" placeholder="密码" @keyup.enter.native="handleLogin" class="login_input"/>
          <span class="show-pwd" @click="showPwd">
            <i class="el-icon-view"></i>
            <!-- <svg-icon icon-class="eye" /> -->
          </span>
        </el-form-item>
        <p style="color:red">{{errorMsg}}</p>
        <el-form-item class="remember">
          <span>
            <!-- <el-checkbox v-model="checked">记住用户名</el-checkbox>             -->
          </span>
          <!-- <span @click="_routeTo('profile/passwordChange')">修改密码</span> -->
        </el-form-item>
        <el-button :loading="loading" type="primary" class="btn-login" @click.prevent="handleLogin">登 录</el-button>
      </div>
    </el-form>
    <el-dialog
      title="未创建店铺"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleCloses"
      style="margin-top:20vh;">
      <span class="content">对不起，您还没有创建店铺,请先创建店铺再登录</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">立即创建</el-button>
        <el-button @click="dialogVisible = false">暂不创建</el-button>
      </span>
    </el-dialog>
    <shopsDialog :showShopsDialog="showShopsDialog" @handleClose="handleClose" :shopList="shopList" :route="route"></shopsDialog>
  </div>
</template>

<script>
import shopsDialog from '@/views/login/shopsDialog'
import { removeToken } from '@/system/auth'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (validateUsername == null) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('用户密码长度应大于6'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: '',
        validateCodeKey: '700233df-30c6-4412-92cd-6eebd24af07a',
        validateCode: 'K5UW',
        platform: '134160222D87'
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword },
        { min: 1, max: 8, message: '密码不能超过8位', trigger: 'blur' }]
      },
      passwordType: 'password',
      loading: false,
      dialogVisible:false,
      showShopsDialog:false,
      checked:false,
      shopName:'',
      shopList:[],
      errorMsg:'',
      route:'login'
    }
  },
  components: {
    shopsDialog
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    // this.autoLogin()
  },
  destroyed() {

  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && !this.loading) {
          this.loading = true
          this.$store.dispatch('login', this.loginForm).then((response) => {
            this.loading = false
            this.shopList = []
            let info = JSON.parse(localStorage.getItem('userInfo'))
            let arr = Object.keys(info.shopInfoMap) 
            if(arr.length == 0){//没有店铺时，提示去创建店铺
              this.dialogVisible = true
            }else{//有店铺时
              let data = info.shopInfoMap
              for(let key in data){
                let shopObj = data[key]
                this.shopList.push(shopObj)
              }
              if(this.shopList.length == 1){//一个店铺时，无店铺列表弹窗
                this.$store.dispatch('setShopInfos',this.shopList[0]).then(() => {
                  this.$router.push({ path: '/profile/profile' })
                }).catch(error => {
                  this.$notify.error({
                    title: '失败',
                    message: error
                  })
                })
              }else{//多个店铺时，展示店铺列表弹窗
                this.showShopsDialog = true
              }
            }
          }).catch(error => {
            this.errorMsg = error
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // login(userName, password) {
    //   this.loading = true
    //   this.loginForm = Object.assign({}, this.loginForm, {userName, password})
    //   this.$store.dispatch('login', this.loginForm).then(() => {
    //     this.loading = false
    //     this.$router.push({ path: '/profile/profile' })
    //   }).catch(error => {
    //     this.$notify.error({
    //       title: '失败',
    //       message: error
    //     })
    //     this.loading = false
    //   })
    // },
    // autoLogin() {
    //   let userName = this.$route.query.name
    //   let password = this.$route.query.password
    //   if(userName!=undefined && password!=undefined) {
    //     this.login('admin-lqx', '111111')
    //   }
    // },
    handleCloses(){
      this.dialogVisible = false
    },
    handleClose(){
      this.showShopsDialog = false
      this.loginForm.userName = ''
      this.loginForm.password = ''
    }
  },
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
$light_block:#000;

/* reset element-ui css */
.login-container {
  background-image: url(../../assets/images/bg_login.png);
  background-size: 100%;
  .login_input {
    display: inline-block;
    height: 47px;
    width: calc(100% - 30px);
    input {
      background: transparent;
      border: 0px;
      border-bottom:1px solid #EEEEEE;
      border-color:#eee;
      -webkit-appearance: none;
      border-radius: 0px;
      margin:0px 5px;
      padding:12px 5px 12px 35px;
      color: $light_block;
      height: 47px;
      font-size: 16px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    // border: 1px solid rgba(255, 255, 255, 0.1);
    // background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$light_blue:#3b89fe;
$bg_white:#fff;

.login-container {
  position: relative;
  height: 100%;
  width: 100%;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 814px;
    padding: 60px 40px;
    margin: 120px auto;
    border-radius:10px;
    background-color:$bg_white;
    display: flex;
    flex: 1;
    .main{
      margin-left: 30px;
      width: 350px;
      .remember{
        clear: both;
        padding: 0 10px;
        span:nth-of-type(1){
          float: left;
        }
        span:nth-of-type(2){
          float: right;
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    // padding: 6px 5px 6px 15px;
    // color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    position:absolute;
    left:10px;
    top:10px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $bg;
      margin: 0px auto 40px auto;
      padding-left:10px; 
      // text-align: center;
      // font-weight: bold;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
.btn-login{
  width:100%;
  height: 50px;
  border-radius:25px;
  font-size:20px;
  color:$bg-white;
  margin-top:30px;
}
/deep/ .el-dialog__footer{
  text-align: center;
}
.content{
  width: 100%;
  display:block;
  text-align: center;
  color: red;
}
.dialog_title{
  font-size: 14px;
  color: #655EFF;
}
.input-with-select{
  background-color: #fff;
  width: 250px;
  .search{
    color: #655EFF;
    font-weight: bold;
  }
}
// .content{
//   .content_top{
//     display: flex;
//     justify-content: space-between;
//   }
//   .content_main{
//     display:flex;
//     justify-content: space-between;
//     flex: 1;
//     margin:20px 0px 30px 0px;
//     div{
//       width: 143px;
//       height: 60px;
//       border-radius:4px;
//       background:rgba(101,94,255,1);
//       opacity:0.5;
//       span{
//         padding:10px;
//         height: 20px;
//         line-height: 20px;
//         display: block;
//         font-size: 14px;
//         color: #FFFFFF;
//         text-align: left;
//       }
//     }
//   }
// }
/deep/ .el-dialog__body{
  padding:10px 20px;
}

</style>
