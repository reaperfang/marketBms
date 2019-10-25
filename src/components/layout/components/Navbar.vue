<template>
  <div>
    <div class="navbar">
      <div class="navbar-item">{{shopName}}</div>
      <!-- <div class="navbar-item"></div> -->
      <div class="right-menu">
        <router-link to="/profile/upgrade" class="set_meal">套餐升级 </router-link> 
        <el-dropdown class="avatar-container right-menu-item" trigger="click">
          <div class="avatar-wrapper">
            <i class="el-icon-user-solid"/>
            {{(userInfo && userInfo.userName) || '用户名称' }}
            <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
            <i class="el-icon-caret-bottom"/>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>
                <!-- {{ $t('navbar.dashboard') }} -->
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item>
              <span @click="init"> 
                <i class="el-icon-s-operation"></i>
                切换店铺 
              </span>            
            </el-dropdown-item>
            <el-dropdown-item divided>
              <router-link to="/profile/accountInfo">
                <i class="el-icon-s-order"></i>
                账号信息
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item divided v-if="!userType">
              <router-link to="/profile/passwordChange">
                <i class="el-icon-lock"></i>
                修改密码
              </router-link>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span style="display:block;" @click="logout"> 
                <i class="el-icon-setting"></i>
                退出登录
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <shopsDialog :showShopsDialog="showShopsDialog" @handleClose="handleClose" :shopList="shopList" :route="route"></shopsDialog>
  </div>
</template>

<script>
import { mapGetters, Store } from 'vuex'
import Hamburger from '@/components/Hamburger'
import shopsDialog from '@/views/login/shopsDialog'
import { userInfo } from 'os';

export default {
  data(){
    return{
      showShopsDialog:false,
      shopList:[],
      route:'index',
      shopName:''
    }
  },
  components: {
    Hamburger,
    shopsDialog
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
    ]),
    userInfo(){
      return JSON.parse(this.$store.getters.userInfo)
    },
    userType(){
      let userInfo = JSON.parse(this.$store.getters.userInfo)

      if(userInfo && userInfo.type == "admin") {
        return true
      }
      return false
    }
  },
  created(){ 
    this.getShopName()
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    //推出登录
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        console.log('退出')
        location.reload()// In order to re-instantiate the vue-router object to avoid bugs
      })
    },

    //监听弹窗关闭
    handleClose(){
      this.showShopsDialog = false
      this.getShopName()
    },

    //获取店铺名称
    getShopName(){
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      this.shopName = shopInfo && shopInfo.shopName
    },

    //切换店铺
    init(){
      let info = JSON.parse(localStorage.getItem('userInfo'))
      let arr = Object.keys(info.shopInfoMap) 
      if(arr.length == 0){
        this.shopList = []
      }else{
        this.shopList = info.shopInfoMap
        this.showShopsDialog = true
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  width: calc(100% - 120px);
  line-height: 64px;
  border-radius: 0px !important;
  background:#fff;
  color: #92929B;
  padding:0px 20px;
  font-size:14px;
  position: fixed;
  left: 120px;
  top: 0;
  z-index: 1000;
  display:flex;
  justify-content:space-between;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .breadcrumb-container{
    float: left;
  }
  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }
  .right-menu {
    // display: none;
    // float: right;
    height: 100%;
    margin-right: 20px;
    &:focus{
     outline: none;
    }
    .set_meal{
      margin-right: 20px;
      font-size: 14px;
      color: #44434B;
      cursor: pointer;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
.navbar-item{
  font-size: 14px;
  color: #333333;
  font-weight: bold;
}
</style>
