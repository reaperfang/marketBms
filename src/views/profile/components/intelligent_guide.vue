<template>
  <div class="intelligent_guide">
    <h1>引导</h1>

    <el-button @click="$emit('hide-guide')"> 我准备好了 </el-button>
  </div>
</template>

<script>
  export default {
    name: "intelligent_guide",
    methods: {

    }
  }
</script>

<style lang="scss">
  .intelligent_guide {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: #ff4400;
    z-index: 2;
  }
</style>
