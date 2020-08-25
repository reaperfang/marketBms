<template>
  <section class="intelligent_preview">

    <ul>
      <li> 展示模板名称  / 手机预览 选择 </li>
      <li> 展示模板名称  / 手机预览 选择 </li>
      <li> 展示模板名称  / 手机预览 选择 </li>
      <li> 展示模板名称  / 手机预览 选择 </li>
      <li> 展示模板名称  / 手机预览 选择 </li>
    </ul>

    <el-button @click="$emit('update-step', 1)"> 上一步 </el-button>
    <el-button type="primary" @click="$emit('update-step', 3)"> 启用模板 </el-button>
  </section>
</template>

<script>
  export default {
    name: "intelligent_step_2"
  }
</script>

<style scoped>

</style>
