<template>
  <section class="intelligent_base">

    <div class="i_base_wrap">
      <div class="i_base_side">
        <ul class="i_base_step">
          <!-- 公众号或小城绑定任一即为通过 -->
          <li :class="{'i_base_act': baseStatus === 1, 'i_base_suc': (bindWechatAccount === 1) || (bindWechatApplet === 1)}">
            <div class="title">绑定渠道</div>
            <div class="number"><span>1</span><img src="../../../assets/images/profile/i_base_success.png" class="el-icon-check" alt="" /></div>
            <div class="line"></div>
          </li>
          <li :class="{'i_base_act': baseStatus === 2, 'i_base_suc': wechatPay === 1}">
            <div class="title">微信支付设置</div>
            <div class="number"><span>2</span><img src="../../../assets/images/profile/i_base_success.png" class="el-icon-check" alt="" /></div>
            <div class="line"></div>
          </li>
          <li :class="{'i_base_act': baseStatus === 3, 'i_base_suc': isCompleted === 1}">
            <div class="title">店铺基础信息建设</div>
            <div class="number">3</div>
          </li>
        </ul>
      </div>

      <div class="i_base_box">
        <!--  绑定渠道  -->
        <channel v-show="baseStatus === 1" @base-step="baseStep"></channel>

        <!--  微信支付设置  -->
        <wx v-show="baseStatus === 2" @base-step="baseStep"></wx>

        <!--  店铺信息  -->
        <shop v-show="baseStatus === 3" @base-step="baseStep"></shop>
      </div>
    </div>

    <div class="i_base_btns">
      <el-button size="medium" plain @click="backBaseStep()"> 上一步 </el-button>
      <el-button size="medium" type="primary" @click="nextBaseStep()"> 稍后，下一步 </el-button>
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
    data() {
      return {
        baseStatus: 1, // 基础信息进行到了第几步
        bindWechatAccount: 1,  // 是否绑定公众号 0:未绑定 1:已绑定
        bindWechatApplet: 0,  // 是否绑定小程序0:未绑定 1:已绑定
        wechatPay: 1,  // 是否开启微信支付 0:否 1:是
        isCompleted: 0, // 是否完成 0:否 1:是
      }
    },
    methods:{
      /** 上一步 */
      backBaseStep() {
        if (this.baseStatus === 1) {
          // 返回启用模板
          this.$emit('update-step', 3);
        } else {
          this.baseStatus = this.baseStatus - 1;
        }
      },

      /** 下一步 */
      nextBaseStep() {
        this.baseStatus = this.baseStatus + 1;
      },

    }
  }
</script>

<style lang="scss" scoped>
  .intelligent_base {
    padding-bottom: 50px;
  }

  .i_base_wrap {
    width: 850px;
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
    }
  }

  .i_base_step{
    display: flex;
    flex-flow: column;
    align-items: center;
    // justify-content: center;
    margin-top: 80px;

    li {
      display: flex;
      position: relative;
      flex-basis: 28px;
      margin-bottom: 36px;
      font-size: 16px;
      color: #44434B;

      .title {
        width: 8em;
        text-align: right;
        height: 28px;
        line-height: 30px;
        margin-right: 20px;
        font-weight: 400;
      }

      .number {
        width: 28px;
        height: 28px;
        line-height: 28px;
        background: #FBFBFC;
        border: 1px solid #B6B5C8;
        border-radius: 50%;
        text-align: center;
        font-size: 15px;
        color: #92929B;

        span {
          display: inline;
        }

        .el-icon-check {
          display: none;
          width: 17px;
          height: 13px;
          margin-top: 8px;
        }
      }

      .line {
        position: absolute;
        right: 13px;
        top: 28px;
        width: 1px;
        height: 36px;
        background: #B6B5C8;
      }
    }

    .i_base_act {
      color: #655EFF;

      .title {
        font-weight: 500;
      }

      .number {
        position: relative;
        background: #655EFF;
        border: 1px solid #fff;
        box-shadow: #fff 0px 0px 0px 1px;
        color: #fff;
        z-index: 2;
      }

      &::after {
        content:'';
        display: block;
        position: absolute;
        right: -12px;
        top: 3px;
        width: 16px;
        height: 22px;
        background: url('../../../assets/images/profile/i_base_status.png') no-repeat;
        background-size: contain;
        z-index: 1;
      }

      &.i_base_suc {
        color: #655EFF;

        .number {
          background: #655EFF;
          border: 1px solid #fff;

          span {
            display: inline;
          }

          .el-icon-check {
            display: none;
          }
        }
      }
      
    }

    .i_base_suc {
      color: #6CD521;

      .title {
        font-weight: 500;
      }

      .number {
        background: #6CD521;
        border: 1px solid #FBFBFC;
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
  }

</style>
