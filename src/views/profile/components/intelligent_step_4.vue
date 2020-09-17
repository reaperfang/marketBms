<template>
  <section class="intelligent_base">

    <div class="i_base_wrap">
      <div class="i_base_side">
        <ul class="i_base_step">
          <!-- 公众号或小城绑定任一即为通过 -->
          <li :class="{'i_base_act': baseStatus === 1, 'i_base_suc': (bindWechatAccount === 1) || (bindWechatApplet === 1)}">
            <div class="i_b_title">绑定渠道</div>
            <div class="i_b_number"><span>1</span><img src="../../../assets/images/profile/i_base_success.png" class="el-icon-check" alt="" /></div>
            <div class="i_b_line"></div>
          </li>
          <li :class="{'i_base_act': baseStatus === 2, 'i_base_suc': wechatPay === 1}">
            <div class="i_b_title">微信支付设置</div>
            <div class="i_b_number"><span>2</span><img src="../../../assets/images/profile/i_base_success.png" class="el-icon-check" alt="" /></div>
            <div class="i_b_line"></div>
          </li>
          <li :class="{'i_base_act': baseStatus === 3, 'i_base_suc': isCompleted === 1}">
            <div class="i_b_title">店铺基础信息建设</div>
            <div class="i_b_number"><span>3</span></div>
          </li>
        </ul>
      </div>

      <div class="i_base_box">
        <!--  绑定渠道  -->
        <channel v-show="baseStatus === 1" @wechat-status="wechatStatus"></channel>

        <!--  微信支付设置  -->
        <wx v-show="baseStatus === 2" @wxpay-status="wechatPayStatus"></wx>

        <!--  店铺信息  -->
        <shop v-show="baseStatus === 3" ref="BaseShopInfoView" :wx-account="bindWechatAccount" @update-completed-loading="updateCompletedLoading"></shop>
      </div>
    </div>

    <div class="i_base_btns">
      <el-button plain @click="backBaseStep()" :loading="prevStepLoading"> 上一步 </el-button>
      <el-button type="primary" @click="nextBaseStep()" :loading="completedIsLoading">
        <template v-if="baseStatus === 3"> 完  成 </template>
        <template v-else>稍后，下一步</template>
      </el-button>
    </div>

  </section>
</template>

<script>
  import channel from './intelligent_step_4_1'
  import wx from './intelligent_step_4_2'
  import shop from './intelligent_step_4_3'
  export default {
    name: "intelligent_base",
    components: { channel, wx, shop },
    props: {
      stepId: null,
    },
    data() {
      return {
        baseStatus: 1, // 基础信息进行到了第几步
        bindWechatAccount: '',  // 是否绑定公众号 0:未绑定 1:已绑定
        bindWechatApplet: '',  // 是否绑定小程序0:未绑定 1:已绑定
        wechatPay: '',  // 是否开启微信支付 0:否 1:是
        isCompleted: 0, // 是否完成 0:否 1:是
        completedIsLoading: false,
        prevStepLoading: false,
      }
    },
    methods:{
      /** 微信绑定状态 */
      wechatStatus(data) {
        console.log('wechatStatus: ', data);
        this.bindWechatAccount = data.bindWechatAccount;
        this.bindWechatApplet = data.bindWechatApplet;
      },

      /** 微信支付状态 */
      wechatPayStatus(data) {
        console.log('payStatus: ', data);
        this.wechatPay = data;
      },

      /** 上一步 */
      async backBaseStep() {
        if (this.baseStatus === 1) {
          // 返回启用模板成功页
          try {
            this.prevStepLoading = true;
            const result = await this._apis.profile.intelligentUpdateStep({changeStep: 3, status: 1});
            this.$emit('update-step', 3);
          }catch (e) {
            this.$message.error(e);
          }finally {
            this.prevStepLoading = false;
          }
        } else {
          this.baseStatus -= 1;
        }
      },

      /** 下一步 */
      nextBaseStep() {
        if(this.baseStatus === 3 && !this.completedIsLoading) {
          this.$refs.BaseShopInfoView.completed();
        } else {
          this.baseStatus += 1;
        }

      },

      /** 更新按钮loading的状态 */
      updateCompletedLoading(flag) {
        this.completedIsLoading = flag
      },
    }
  }
</script>

<style lang="scss" scoped>
  .intelligent_base {
    padding-bottom: 50px;
  }

  .i_base_wrap {
    width: 848px;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin: auto auto 40px;

    .i_base_side {
      flex: 0 0 234px;
      width: 234px;
      min-height: 400px;
      background: #FBFBFC;
    }

    .i_base_box {
      width: 594px;
      min-height: 400px;
      background: #FBFBFC;
      padding: 80px 20px 20px;
    }
  }

  .i_base_step{
    display: flex;
    flex-flow: column;
    align-items: center;
    // justify-content: center;
    margin-top: 80px;
    user-select: none;

    li {
      display: flex;
      position: relative;
      flex-basis: 28px;
      margin-bottom: 36px;
      font-size: 16px;
      color: $contentColor;

      .i_b_title {
        width: 8em;
        text-align: right;
        height: 28px;
        line-height: 0;
        padding-top: 14px;
        margin-right: 20px;
        font-weight: 400;
      }

      .i_b_number {
        position: relative;
        width: 28px;
        height: 28px;
        line-height: 0;
        background: #FBFBFC;
        border: 1px solid $borderColor;
        border-radius: 50%;
        text-align: center;
        font-size: 15px;
        color: $grayColor;

        span {
          display: inline-block;
          margin-top: 13px;
        }

        .el-icon-check {
          display: none;
          width: 17px;
          height: 13px;
          margin-top: 8px;
        }
      }

      .i_b_line {
        position: absolute;
        right: 13px;
        top: 28px;
        width: 1px;
        height: 36px;
        background: $borderColor;
      }
    }

    .i_base_act {
      color: $globalMainColor;

      .i_b_title {
        font-weight: 500;
      }

      .i_b_number {
        position: relative;
        background: $globalMainColor;
        border: none;
        color: #fff;
        z-index: 2;

        &::after {
          content: '';
          display: block;
          position: absolute;
          left: -2px;
          top: -2px;
          width: 32px;
          height: 32px;
          border: 2px solid #fff;
          border-radius: 50%;
          box-sizing: border-box;
        }

        span {
          display: inline-block;
          margin-top: 14px;
        }
      }

      &::after {
        content:'';
        display: block;
        position: absolute;
        right: -14px;
        top: 3px;
        width: 16px;
        height: 22px;
        background: url('../../../assets/images/profile/i_base_status.png') no-repeat;
        background-size: contain;
        z-index: 1;
      }

      &.i_base_suc {
        color: $globalMainColor;

        .i_b_number {
          background: $globalMainColor;
          border: none;

          span {
            display: inline-block;
            margin-top: 14px;
          }

          .el-icon-check {
            display: none;
          }
        }
      }

    }

    .i_base_suc {
      color: $successBorderColor;

      .i_b_title {
        font-weight: 500;
      }

      .i_b_number {
        background: $successBorderColor;
        border: none;
        color: #fff;

        span {
          display: none;
        }

        .el-icon-check {
          display: inline;
        }
      }

    }

  }

  .i_base_btns {
    text-align: center;

    button:first-of-type {
      margin-right: 10px;
    }

    .el-button--small {
      font-size: 14px;
    }
  }

</style>
