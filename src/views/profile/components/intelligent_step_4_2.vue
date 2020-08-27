<template>
  <div class="base_wxpay">
    <div class="i_b_wxpay">
      <p>请您先进行【渠道绑定】操作后再进行【开启支付】操作</p>
    </div>
    <div class="i_base_btns">
      <el-button @click="$emit('base-step', 'base', 1)"> 上一步 </el-button>
      <el-button type="primary" @click="$emit('base-step', 'base', 3)"> 稍后，下一步 </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "intelligent_base_wx"
  }
</script>

<style lang="scss" scope>
  .i_b_wxpay {
    height: 300px;
    padding: 20px;
  }
  .i_base_btns {
    margin-top: 60px;
  }
</style>
