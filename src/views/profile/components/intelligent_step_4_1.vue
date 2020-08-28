<template>
  <div class="base_channel">
    <p class="b_c_title">请绑定您的经营渠道：</p>
    <div class="b_c_wrap">

      <div class="b_c_side">

      </div>

      <div class="b_c_content">
        <p class="b_c_description">绑定微信小程序和公众号，推广您的店铺。</p>
        <div>
          <el-button type="primary" plain v-if="bindWechatAccount == 0" @click="linkToOfficialAccounts"> 授权微信公众号 </el-button>
          <el-button type="info" plain disabled v-else> 公众号授权成功 </el-button>
          <el-button type="primary" plain v-if="bindWechatApplet == 0" @click="linkToMiniProgram"> 授权微信小程序 </el-button>
          <el-button type="info" plain disabled v-else> 小程序授权成功 </el-button>
        </div>
      </div>

    </div>

    <div class="i_base_btns">
      <el-button @click="updateBaseStep('enable', 3)"> 上一步 </el-button>
      <el-button type="primary" @click="updateBaseStep('base', 2)"> 稍后，下一步 </el-button>
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

      /**
       * 返回启用模板 或 继续基础建设
       * @param {string} eventType 返回启用模板:'enable'，继续基础建设:'base'
       * @param {number} stepNum 去第几步
       */
      updateBaseStep(eventType, stepNum) {
        this.$emit('base-step', eventType, stepNum)
      },

    }
  }
</script>

<style lang="scss" scope>
  .b_c_title {
    margin: 20px;
  }

  .b_c_wrap {
    min-height: 300px;
    padding: 20px;
  }

  .b_c_side {
    float: left;
    width: 400px;
    height: 200px;
  }

  .b_c_content {
    float: left;
    border-left: 1px solid #eee;
    padding-left: 20px;
  }

  .b_c_description {
    margin-bottom: 20px;
  }

  .i_base_btns {
    width: 830px;
    margin-top: 20px;
    text-align: center;
  }
</style>
