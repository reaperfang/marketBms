<template>
  <div class="base_channel">
    <div class="b_c_wrap">
      <p class="b_c_title">请绑定您的经营渠道：</p>
      <p class="b_c_description">绑定微信小程序和公众号，推广您的店铺。</p>

      <div class="b_c_content">
        <div>
          <el-button type="primary" plain v-if="bindWechatAccount == 0" @click="linkToOfficialAccounts"> 授权微信公众号 </el-button>
          <el-button type="info" plain disabled v-else> 公众号授权成功 </el-button>
          <el-button type="primary" plain v-if="bindWechatApplet == 0" @click="linkToMiniProgram"> 授权微信小程序 </el-button>
          <el-button type="info" plain disabled v-else> 小程序授权成功 </el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  export default {
    name: "intelligent_base_channel",
    data() {
      return {
        bindWechatAccount: 1,  // 是否绑定公众号 0:未绑定 1:已绑定
        bindWechatApplet: 0,  // 是否绑定小程序0:未绑定 1:已绑定
      }
    },
    computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      },
    },
    created() {
      this.getBindStatus()
    },
    methods:{
      /** 获取店铺微信绑定状态 */
      getBindStatus() {
        console.log('this.cid', this.cid);
        this._apis.profile.getwxBindStatus({ id: this.cid }).then(response => {
          console.log('getBindStatus', response);
          this.bindWechatAccount = response.bindWechatAccount;
          this.bindWechatApplet = response.bindWechatApplet;
        }).catch(error => {
          // this.$message.warning(error);
          console.warn('api catch error:', error)
        })
      },

      /** 授权微信公众号 */
      linkToOfficialAccounts() {
        let routeUrl = this.$router.resolve({path: '/apply', query: {paths: '/application/channelapp/publicnum', applyId: '3'}});
        window.open(routeUrl.href, '_blank');
      },

      /** 授权微信小程序 */
      linkToMiniProgram() {
        let routeUrl = this.$router.resolve({path: '/apply', query: {paths: '/application/channelapp/smallapp', applyId: '3'}});
        window.open(routeUrl.href, '_blank');
      },

    }
  }
</script>

<style lang="scss" scope>
  .base_channel {
    color: #44434B;
  }

  .b_c_wrap {
    min-height: 400px;
    padding: 20px;
    background: #FBFBFC;

    .b_c_title {
      margin: 62px 0 10px;
      font-size: 16px;
      font-weight: 500;
    }

    .b_c_description {
      margin-bottom: 30px;
      font-size: 14px;
      font-weight: 400;
    }
  }

  .b_c_content {
    
  }
</style>
