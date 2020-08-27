<template>
  <section class="intelligent_base">

    <el-steps :active="baseStatus" :space="200" finish-status="success">
      <el-step title="绑定渠道" :class="{'i_base_act': baseStatus === 1}"></el-step>
      <el-step title="微信支付设置" :class="{'i_base_act': baseStatus === 2}"></el-step>
      <el-step title="店铺基础信息建设" :class="{'i_base_act': baseStatus === 3}"></el-step>
    </el-steps>

    <!--  绑定渠道  -->
    <channel v-if="baseStatus === 1" @base-step="baseStep"></channel>

    <!--  微信支付设置  -->
    <wx v-if="baseStatus === 2" @base-step="baseStep"></wx>

    <!--  店铺信息  -->
    <shop v-show="baseStatus === 3" @base-step="baseStep"></shop>

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
      }
    },
    methods:{
      /**
       * 基础信息 步骤
       * @param {string} eventType 返回启用模板:'enable'，继续基础建设:'base'
       * @param {number} stepNum 去第几步
       */
      baseStep(eventType, stepNum) {
        if (eventType === 'enable') {
          this.$emit('update-step', stepNum)
        } else {
          this.baseStatus = stepNum
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
  .intelligent_base {
    padding: 20px;
  }

  /deep/ .el-step__head {
    display: none;
  }

  /deep/ .el-step__main {
    text-align: center;
    margin-right: 5px;
  }

  .i_base_act /deep/ .el-step__main {
    background: #655eff;
  }

  /deep/ .el-step__main .el-step__title {
    border: 1px solid #eee;
  }

  .i_base_act /deep/ .el-step__title.is-success {
    color: #fff;
    border: 1px solid #655eff;
  }

  /deep/ .el-step__title.is-process {
    font-weight: normal;
  }

  /deep/ .el-step__main .el-step__description {
    display: none;
  }


</style>
