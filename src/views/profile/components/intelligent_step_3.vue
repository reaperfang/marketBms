<template>
  <section class="intelligent_enable">
    <h2 class="title">模板启用成功，所含数据已预设置您的店铺内，请按需置换成您的个性化数据：</h2>
    <ol>
      <li>1、管理店铺预置商品数据<el-button>商品列表</el-button></li>
      <li>2、编辑店铺个性化装修页面<el-button>创意设计</el-button></li>
      <li>3、修改店铺交易配送运费模板<el-button>配送设置</el-button></li>
    </ol>
    <div class="bottom_buttons">
      <el-button type="primary" @click="$emit('update-step', 4)"> 下一步，基础建设 </el-button>
    </div>
  </section>
</template>

<script>
  export default {
    name: "intelligent_ enable"
  }
</script>

<style scoped>

</style>
