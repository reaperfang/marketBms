<template>
    <div>
        <el-dialog
        title=""
        :visible.sync="showShopsDialog"
        width="50%"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="showClose"
        style="margin-top:20vh;">
        <span slot="title" class="dialog_title">
            <!-- <a href="https://www.300.cn/ " target="_blank">返回官网</a>  -->
            我的店铺
        </span>
        <div class="content">
          <div v-for="item in shopList" :key="item.id" @click="toShop(item)" class="shopItem">
              <!-- <span>{{item.shopName}}</span>
              <span>移动商城</span> -->
              <p>
                <span class="shopName">{{item.shopName}}</span>
                <span class="status">营业中</span>
              </p>
              <p>
                <span class="base">基础版</span>
                <span class="major">专业版</span>
              </p>
              <p>创建时间：2018.09.12 12:00:00</p>
              <p>有效期至：2019.09.12 12:00:00</p>
          </div>
        </div>
        </el-dialog>
    </div>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import { removeToken } from '@/system/auth'
export default {
  name: 'shopsDialog',
  computed: {
    isAdminUser(){
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      console.log('userInfo', userInfo)
      if(userInfo && userInfo.type == "admin") {
        return true
      }
      return false
    }
  },
  data() {
      return {
          shopName:'',
          showDialog:false,
          shopLists:[]
      }
  },
  props:['showShopsDialog','shopList','route','showClose'],
  watch: {
      showShopsDialog(newValue,oldValue){
          this.showDialog = newValue
      },
  },
  created(){},
  methods: {
    //进入店铺
    toShop(shop){
      this._apis.set.getShopInfo({cid:shop.id,id:shop.id}).then(response =>{
          this.$store.dispatch('setShopInfos',shop).then(() => {
            this.$store.dispatch('getShopInfo')
            this._globalEvent.$emit('refreshProfile')
            this.getShopAuthList()
            this.handleClose()
            console.log('shop.storeGuide',this.isAdminUser,shop.storeGuide)
            if (this.isAdminUser && shop.storeGuide === -1) {
                this.$router.push({ path: '/profile/guidePrompt' })
              } else {
                this.$router.push({ path: '/profile/profile' })
              }
          }).catch(error => {
            this.$message.error(error);
          })
      }).catch(error => {
        console.log(error)
      })
    },
    getShopAuthList() {
      this.$store.dispatch('getShopAuthList').then(() => {
        window.eventHub.$emit('onGetShopAuthList')
      })
    },
    handleClose(){
      this.showDialog = false
      this.$emit('handleClose')
    }
  }
}
</script>

<style scoped rel="stylesheet/scss" lang="scss">
.dialog_title{
  font-size: 22px;
  color: #44434B;
}
.content{
  width: 100%;
  margin:20px 0px 30px 0px;
  .shopItem{
    width:30%;
    height:121px;
    background:rgba(255,255,255,1);
    border-radius:3px;
    border:1px solid rgba(218,218,227,1);
    margin:0px 10px 10px 0px;
    padding: 10px;
    cursor: pointer;
    display:inline-block;
    p:nth-of-type(1){
      display: flex;
      justify-content: space-between;
      .shopName{
        font-size: 14px;
        color: #44434B;
        font-weight:500;
      }
      .status{
        font-size: 12px;
        color: #FD932B;
      }
    }
    p:nth-of-type(2){
      line-height: 40px;
      span{
        width:62px;
        height:22px;
        line-height: 22px;
        border-radius:3px;
        display: inline-block;
        text-align: center;
        font-size: 12px;
        color: #FFFFFF;
      }
      .base{
        background: #578EFA;
      }
      .major{
        background: #FD932B;
      }
    }
    p:nth-of-type(3),p:nth-of-type(4){
      font-size: 12px;
      color: #92929B;
      line-height: 25px;
    }
  }
}
.el-dialog__header{
  background:rgba(101,94,255,0.09);
}
</style>
