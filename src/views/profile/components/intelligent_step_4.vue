<template>
  <section class="intelligent_base">
    <!--  绑定渠道  -->
    <channel></channel>

    <!--  微信支付设置  -->
    <wx></wx>

    <!--  店铺信息  -->
    <shop></shop>

  </section>
</template>

<script>
  import channel from './intelligent_step_4_1'
  import wx from './intelligent_step_4_2'
  import shop from './intelligent_step_4_3'
  export default {
    name: "intelligent_step_4",
    components: { channel, wx, shop }
  }
</script>

<style scoped>

</style>
