<template>
  <div class="base_channel">
    <p class="b_c_title">请绑定您的经营渠道：</p>
    <p class="b_c_description">绑定微信小程序和公众号，推广您的店铺。</p>

    <ul>
      <li class="b_c_item">
        <img src="../../../assets/images/profile/i_w_pub.png" class="i_w_ico" alt="授权微信公众号" />
        <div>
          <span class="b_c_set" v-if="bindWechatAccount === 0" @click="linkToOfficialAccounts"> 授权微信公众号 </span>
          <span class="b_c_on" v-else-if="bindWechatAccount === 1"> 公众号授权成功 </span>
          <span class="b_c_on" v-else><i class="el-icon-loading"></i></span>
        </div>
      </li>
      <li class="b_c_item">
        <img src="../../../assets/images/profile/i_w_app.png" class="i_w_ico" alt="授权微信小程序" />
        <div>
          <span class="b_c_set" v-if="bindWechatApplet === 0" @click="linkToMiniProgram"> 授权微信小程序 </span>
          <span class="b_c_on" v-else-if="bindWechatApplet === 1"> 小程序授权成功 </span>
          <span class="b_c_on" v-else><i class="el-icon-loading"></i></span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "intelligent_base_channel",
    data() {
      return {
        bindWechatAccount: null,  // 是否绑定公众号 0:未绑定 1:已绑定
        bindWechatApplet: null,  // 是否绑定小程序 0:未绑定 1:已绑定
      }
    },
    computed:{
      cid(){
          let shopInfo = this.$store.getters.shopInfos
          return shopInfo.id
      },
    },
    created() {
      this.getBindStatus()
    },
    methods:{
      /** 获取店铺微信绑定状态 */
      getBindStatus() {
        this._apis.profile.getwxBindStatus({ id: this.cid }).then(response => {
          // console.log('获取店铺微信绑定状态: ', response);
          this.bindWechatAccount = response.bindWechatAccount;
          this.bindWechatApplet = response.bindWechatApplet;
          this.$emit('wechat-status', {bindWechatAccount: this.bindWechatAccount, bindWechatApplet: this.bindWechatApplet});
        }).catch(error => {
          this.$message.warning(error);
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
    color: $contentColor;
  }

  .b_c_title {
    margin: 4px 0 10px;
    font-size: 16px;
    font-weight: 550;
  }

  .b_c_description {
    margin-bottom: 30px;
    font-size: 14px;
    font-weight: 400;
  }

  .b_c_item {
    display: inline-block;
    text-align: center;
    width: 214px;
    height: 170px;
    background: rgba(218, 218, 227, 0.2);
    user-select: none;

    &:first-of-type {
      margin-right: 16px;
    }
  }
  
  .i_w_ico {
    width: 50px;
    height: 50px;
    margin: 40px auto 17px;
  }

  .b_c_set {
    display: inline-block;
    width: 108px;
    height: 30px;
    border-radius: 4px;
    border: 1px solid #92929B;
    font-size: 12px;
    font-weight: 400;
    color: $contentColor;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
  }

  .b_c_on {
    display: inline-block;
    width: 108px;
    height: 30px;
    border-radius: 4px;
    opacity: 0.5;
    border: 1px solid #DADAE3;
    font-size: 12px;
    font-weight: 400;
    color: #92929B;
    line-height: 28px;
    text-align: center;
    cursor: default;
  }
</style>
