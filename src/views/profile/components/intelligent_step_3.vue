<template>
  <section class="intelligent_enable">
    <h2 class="enable_title">
      <img class="icon-enable-success" src="../../../assets/images/profile/intelligent_enable_success.png"
           alt="SUCCESS">
      <br/>
      模板启用成功
    </h2>

    <div class="gray_area">
      <h3 class="list_title">所含数据已预设置您的店铺内，请按需置换成您的个性化数据：</h3>
      <ol class="enable_list">
        <li class="enable_item">①、管理店铺预置商品数据<span class="button-link" @click="linkToNewTab('goods')">商品列表  <i class="ce-icon-arrow-right"></i></span></li>
        <li class="enable_item">②、编辑店铺个性化装修页面<span class="button-link" @click="linkToNewTab('design')">创意设计  <i class="ce-icon-arrow-right"></i></span></li>
        <li class="enable_item">③、修改店铺交易配送运费模板<span class="button-link" @click="linkToNewTab('freight')">配送设置  <i class="ce-icon-arrow-right"></i></span></li>
      </ol>
    </div>

    <div class="bottom_buttons">
      <el-button type="primary" @click="nextStep"> 下一步，基础建设 </el-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: "intelligent_enable",
    props: {
      stepId: null,
    },
    data() {
      return {
        nextStepLoading: false
      }
    },
    methods: {
      /**
       * 跳转到新的标签页面
       */
      linkToNewTab(linkName) {
        const linkObject =  {
          'goods': '/goods/goodsList',
          'design': '/shop/m_pageManageIndex',
          'freight': '/set/ordinaryExpress',
        };
        const routeData =  this.$router.resolve({path:linkObject[linkName]});
        // const linkAddress = routeData.href;
          window.open(routeData.href, '_blank');
      },
      async nextStep() {
       try {
         this.nextStepLoading = true;
         const result = await this._apis.profile.intelligentUpdateStep({changeStep: 4, status: 0, id: this.stepId});
         this.$emit('update-step', 4);
       }catch (e) {
         this.$message.error(e || "网络错误，请稍后再试");
       }finally {
         this.nextStepLoading = false;
       }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .intelligent_enable {
    margin: 0 auto;
    width: 560px;
    padding-top: 7px;

    .enable_title {
      font-size: 24px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 32px;
      text-align: center;
      margin-bottom: 24px;

      .icon-enable-success {
        width: 72px;
        height: 72px;
        margin-bottom: 20px;
        vertical-align: top;
      }
    }

    .gray_area {
      height: 186px;
      margin-bottom: 50px;
      padding: 24px 40px;
      background-color: #FAFAFA;
      box-sizing: border-box;

      .list_title {
        font-size: 16px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }

      .enable_item {
        font-size: 14px;
        color: $secondaryColor;
        line-height: 22px;
        margin-top: 16px;

        .button-link {
          margin-left: 16px;
          color: $globalMainColor;
          cursor: pointer;
          .ce-icon-arrow-right {
            margin-left: 5px;
          }
        }
      }
    }

  }

  .ce-icon-arrow-right {
    display: inline-block;
    vertical-align: center;
    width: 6px;
    height: 10px;
    background: url("../../../assets/images/profile/icon-arrow-right-textlink.png");
    background-size: cover;
  }
</style>
