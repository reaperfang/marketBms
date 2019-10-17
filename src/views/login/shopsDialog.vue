<template>
    <div>
        <el-dialog
        title=""
        :visible.sync="showShopsDialog"
        width="40%"
        :before-close="handleClose"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        style="margin-top:20vh;">
        <span slot="title" class="dialog_title">
            <a>返回官网</a> | <a>创建店铺</a>
        </span>
        <div class="content">
            <div class="content_top">
            <!-- <el-input placeholder="请输入店铺名称" v-model="shopName" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" class="search"></el-button>
            </el-input> -->
            <!-- <el-button>创建店铺</el-button> -->
            </div>
            <div class="content_main">
              <div v-for="item in shopList" :key="item.id" @click="toShop(item)" class="shopItem">
                  <span>{{item.shopName}}</span>
                  <span>移动商城</span>
              </div>
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
  data() {
      return {
          shopName:'',
          showDialog:false,
          shopLists:[]
      }
  },
  props:['showShopsDialog','shopList','route'],
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
        if(response.enable == 1){
          this.$store.dispatch('setShopInfos',shop).then(() => {
            this.handleClose()
            this.$router.push({ path: '/profile/profile' })
          }).catch(error => {
            this.$notify.error({
              title: '失败',
              message: error
            })
          })
        }else{
          this.$notify.warning({
            title: '提示',
            message: '该店铺已停用！'
          })
        }
      }).catch(error => {
        console.log(error)
      })
    },

    handleClose(){
      this.showDialog = false
      // this.route == 'login' && removeToken()
      this.$emit('handleClose')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.content{
  .content_top{
    display: flex;
    justify-content: space-between;
  }
  .content_main{
    width: 100%;
    display:flex;
    flex-wrap: wrap;
    flex: 1;
    margin:20px 0px 30px 0px;
    .shopItem{
      width: 143px;
      height: 76px;
      border-radius:4px;
      background:rgba(101,94,255,1);
      opacity:0.5;
      margin:0px 10px 10px 0px;
      cursor: pointer;
      display:inline-block;
        span{
          width: 123px;
          height:35px;
          line-height: 25px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          padding:10px;
          display: block;
          font-size: 14px;
          color: #FFFFFF;
        }

      // span{
      //   padding:10px;
      //   height: 30px;
      //   line-height: 30px;
      //   display: block;
      //   font-size: 14px;
      //   color: #FFFFFF;
      //   text-align: left;
      // }
    }
  }
}
/deep/ .el-dialog__body{
  padding:10px 20px;
}
.dialog_title a{
  cursor: pointer;
}
.dialog_title a:hover{
  text-decoration: underline;
}
// .shopItem{
//   cursor: pointer;
//   width:200px;
//   span{
//      width: 100%;
//      height:35px;
//      line-height: 35px;
//      overflow: hidden;
//      white-space: nowrap;
//      text-overflow: ellipsis;
//      padding:10px;
//      display: block;
//      font-size: 14px;
//      color: #FFFFFF;
//   }
// }
</style>
