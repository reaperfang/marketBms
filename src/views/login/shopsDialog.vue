<template>
    <div>
        <el-dialog
        title=""
        :visible.sync="showShopsDialog"
        width="680px"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="showClose"
        style="margin-top:5vh;">
        <span slot="title" class="dialog_title">
            我的店铺
        </span>
        <div class="content"  v-loading="loading">
          <div v-for="item in shopLists" :key="item.id" @click="toShop(item)" class="shopItem">
              <p>
                <span :class="item.shopExpire == 1 ? 'e-shopName' : 'shopName'">{{item.shopName}}</span>
                <span :class="item.shopExpire == 1 ? 'e-status' : 'status'">{{item.shopExpire == 1 ? '已过期' : '营业中'}}</span>
              </p>
              <p>
                <span :class="item.shopExpire == 1 ? 'expire' : 'base'" v-if="item.bossProductId == 3">基础版</span>
                <span :class="item.shopExpire == 1 ? 'expire' : 'major'" v-if="item.bossProductId == 100">专业版</span>
              </p>
              <p>创建时间：{{item.openTime}}</p>
              <p>有效期至：{{item.shopExpireTime}}</p>
          </div>
          <p class="p_center">
            <el-pagination
              v-if="shopLists.length >= 9"
              @current-change="handleCurrentChange"
              :current-page="Number(startIndex) || 1"
              :page-size="pageSize*1"
              layout="prev, pager, next"
              :total="total*1"
              :background="background">
            </el-pagination>
          </p>
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
      if(userInfo && userInfo.type == "admin") {
        return true
      }
      return false
    },
  },
  data() {
      return {
          shopName:'',
          showDialog:false,
          shopLists:[],
          startIndex:1,
          pageSize:9,
          total:0,
          loading:true
      }
  },
  props:['showShopsDialog','shopList','route','showClose','background'],
  watch: {
      showShopsDialog(newValue,oldValue){
          this.showDialog = newValue
      },
      shopList(newValue,oldValue){
        newValue.length !=0 && this.getShopList()
      }
  },

  created(){
  },

  methods: {
    //获取店铺列表
    getShopList(){
      let userInfo = JSON.parse(localStorage.getItem('userInfo')) 
      let tid = '',id = '',type = ''
      if(userInfo){
        tid = userInfo.tenantInfoId
        id = userInfo.id
        type = userInfo.type
      }

      let obj =  {
        startIndex:this.startIndex,
        pageSize:this.pageSize,
        tenantInfoId:tid,
        shopUserId: type == 'admin' ? '' : id
      }
      this._apis.profile.getShopList(obj).then(response => {
        this.total = response.total
        this.shopLists = response.list
        this.loading = false
      }).catch(error =>{
        this.loading = false
        this.$message.error(error);
      })
    },

    //进入店铺
    toShop(shop){
      this._apis.set.getShopInfo({cid:shop.id,id:shop.id}).then(response =>{
          let shopInfo = {}
          this.shopList.map(item =>{
            item.id == shop.id && (shopInfo = item)
          })
          this.$store.dispatch('setShopInfos',shopInfo).then(() => {
            this.$store.dispatch('getShopInfo')
            this._globalEvent.$emit('refreshProfile')
            this.getShopAuthList()
            this.handleClose()
            this.$store.commit('setStoreGuide', shop.storeGuide)
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
    },
    
    handleCurrentChange(val){
      this.startIndex = val
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
  margin-left:10px;
  .shopItem{
    width:200px;
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
      .e-shopName{
        font-size: 14px;
        color:rgba(146,146,155,1);
        font-weight:500;
      }
      .status{
        font-size: 12px;
        color: #FD932B;
      }
      .e-status{
        font-size: 12px;
        color:rgba(146,146,155,1);
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
      .expire{
        background: rgba(146,146,155,0.5);;
      }
    }
    p:nth-of-type(3),p:nth-of-type(4){
      font-size: 12px;
      color: #92929B;
      line-height: 25px;
    }
  }
  .shopItem:hover{
    border:1px solid #5B54E6;
  }
}
/deep/ .el-dialog__header{
  background:rgba(101,94,255,0.09) !important;
}
.p_center{
  text-align: center;
}
</style>
