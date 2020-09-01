<template>
  <div class="profile_intelligent" v-if="stepStatus < 4">
    <p class="p_i_title">
      智能开店：
      <span>
        让做生意变得更简单
      </span>
    </p>

    <el-row class="p_i_content">
      <el-col :span="24">
        <el-button type="primary" class="to_intelligent" @click.native="toIntelligent">立即体验</el-button>
        <el-steps space="30%" :active="stepStatus" finish-status="finish">
          <el-step title="选择所属行业"></el-step>
          <el-step title="预览行业模板"></el-step>
          <el-step title="启用行业模板">
            <template slot="description" >
              <el-popover
                placement="top-start"
                width="208"
                trigger="hover"
                offset="10"
                popper-class="pop_box">
                <div class="pop_content">您的行业模板数据配置失败、模板未启用成功，请您点击“立即体验”再次配置模板数据</div>
                <img src="../../../assets/images/profile/i_tip.png" class="pop_icon" :class="{'show': intelligentTip}" slot="reference" alt="提示" />
              </el-popover>
            </template>
          </el-step>
          <el-step title="店铺基础信息建设"></el-step>
        </el-steps>
      </el-col>
    </el-row>
    <!-- <router-link to="/profile/intelligent" class="to_intelligent">立即体验</router-link> -->
    <!-- <router-link :to="{name: 'intelligent', query: {isShowGuide: isFirst, stepStatus: stepStatus}}" class="to_intelligent">立即体验</router-link> -->

  </div>
</template>

<script>
export default {
    name: 'profile_intelligent',
    data() {
      return {
        isFirst: false, // 是否首次
        stepStatus: 1, // 进行到了第几步
        intelligentTip: false,  // 是否有第三步提示
      }
    },
    created() {
      this.getIntelligent();
    },
    methods:{
      /** 获取智能开店信息 */
      getIntelligent() {
        // test
        this.isFirst = true;
        this.stepStatus = 2;
        this.intelligentTip = true;
      },

      /** 智能开店体验引导 */
      toIntelligent() {
        this.$router.push({ path: '/profile/intelligent' });
        // this._routeTo('intelligent', {isShowGuide: this.isFirst, stepStatus: this.stepStatus});
      },

    }
}
</script>

<style lang="scss" scoped>
  .profile_intelligent {
    margin-top: 15px;
    padding: 26px;
    border-radius: 5px;
    background-color: #fff;

    .p_i_title {
      font-size: 14px;
      font-weight: 500;
      color: #161617;
      line-height: 22px;

      span {
        font-size: 12px;
        font-weight: 400;
        color: #92929B;
        padding-left: 10px;
      }
    }

    .p_i_content {
      margin-top: 10px;
    }
  }
  
  .to_intelligent {
    float: right;
  }

  /deep/ .el-steps--horizontal{
    margin-top: 10px;
  }

  /deep/ .el-step__main {
    margin-top: -15px;
    margin-left: 28px;
  }

  /deep/ .el-step__main .el-step__title {
    font-size: 12px;
    line-height: 12px;
    position: relative;
  }

  /deep/ .el-step__head .el-step__icon.is-text {
    width: 18px;
    height: 18px;
    font-size: 12px;
    box-shadow: none;
  }

  /deep/ .el-step .el-step__head.is-finish .el-step__icon {
    box-shadow: none;
    background-color: #fff;
    color: #655eff;
    border: 1px solid #655eff;
  }

  /deep/ .el-step .el-step__head.is-process .el-step__icon {
    background-color: #655eff;
    color: #fff;
    border: 1px solid #655eff;
  }

  /deep/ .el-step .el-step__head.is-wait .el-step__icon {
    background-color: #fff;
    color: #92929B;
    border: 1px solid #92929B;
  }

  /deep/ .el-step .el-step__head .el-step__line {
    height: 1px;
    top: 8px;
    right: 14px;
    margin-left: 115px;
    background-color: #ccc;
    overflow-y: hidden;
  }
  
  /deep/ .el-step .el-step__title.is-process, /deep/ .el-step__icon-inner {
    font-weight: normal;
  }

  /deep/ .el-step .el-step__title.is-wait {
    color: #92929B;
  }

  /deep/ .el-step__main .el-step__description {
    position: relative;
  }

  .pop_icon {
    position: absolute;
    top: -16px;
    left: 67px;
    width: 15px;
    height: 15px;
    display: none;

    &.show {
      display: block;
    }
  }

  .pop_box {
    margin-bottom: 3px;
    padding: 10px 12px;

    .pop_content {
      font-size: 12px;
      line-height: 17px;
    }
  }

</style>
