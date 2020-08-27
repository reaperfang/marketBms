<template>
  <div class="base_shop">
    店铺基础信息设置
    <div class="bottom_buttons">
      <el-button @click="$emit('base-step', 'base', 2)"> 上一步 </el-button>
      <el-button type="primary"> 完成 </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "intelligent_base_shop"
  }
</script>

<style lang="scss">

</style>
