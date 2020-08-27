<template>
  <div class="base_wxpay">
    <div class="b_w_wrap">
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
  .b_w_wrap {
    min-height: 300px;
    padding: 20px;
  }
  .i_base_btns {
    width: 830px;
    margin-top: 20px;
    text-align: center;
  }
</style>
