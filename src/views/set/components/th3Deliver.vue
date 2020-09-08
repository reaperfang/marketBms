<template>
   <div class="th3Deliver">
     <div class="switch-area">
       <span>启用第三方配送：</span>
       <el-switch active-color="#13ce66" inactive-color="#cacfcb" v-model="isOpen" @change="handleIsOpen"></el-switch>
       <span>开启后，将有第三方物流代您进行配送，配送产生的费用，开启后表示同意</span>
       <el-button class="agree" type="text">《第三方配送协议》</el-button>
     </div>
   </div>
</template>

<script>
export default {
  components: {},

  props: {},

  data () {
    return {
      isOpen: false
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleIsOpen() {

    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.th3Deliver {
  background: #fff;
  padding: 20px;
  .switch-area {
    background: #F9F9F9;
    padding: 20px;
    >span, .argee {
      font-size: 14px;
      font-weight: 400;
      color: #44434B;
      line-height: 20px;
    }
    .argee {
      color:#655EFF;
    }
  }
}
</style>