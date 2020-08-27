<template>
  <div class="base_channel">
    <div class="i_b_channel">
      <p>请绑定您的经营渠道：</p>
      <p>绑定微信小程序和公众号，推广您的店铺。</p>
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
        channel: '',  // 渠道信息
      }
    },
    methods:{
      /**
       * 返回启用模板 或 继续基础建设
       * @param {string} eventType 返回启用模板:'enable'，继续基础建设:'base'
       * @param {number} stepNum
       */
      updateBaseStep(eventType, stepNum) {
        this.$emit('base-step', eventType, stepNum)
      },

    }
  }
</script>

<style lang="scss" scope>
  .i_b_channel {
    height: 300px;
    padding: 20px;
  }

  .i_base_btns {
    margin-top: 60px;
  }
</style>
