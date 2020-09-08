<template>
  <div class="intelligent_guide">
    <h2>请选择您需要的开店方式</h2>
    <div class="i_guide_btns">
      <el-button @click="toProfile"> 再看看 </el-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'intelligent-guide',
    data() {
      return {
        test: null,
      }
    },
    created() {
      
    },
    methods: {
      toProfile(){
        this.$router.push({ path: '/profile/profile' });
      },
    },
  }
</script>

<style lang="scss">

</style>
