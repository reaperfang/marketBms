<template>
  <div class="authorization">
      <p v-if="!status">确认授权中，请稍候</p>
      <p v-else><el-button type="success" icon="el-icon-check" circle style="position:relative;top:-4px;margin-right:10px;"></el-button>设备授权成功，请您关闭当前窗口回到原页面继续打印。</p>
  </div>
</template>
<script>
export default {
  data() {
    return{
      status:false
    };
  },
  created(){
      this.sendAuthorization();
  },
  methods: {
      sendAuthorization(){
        var params = {
            code: this.$route.query.code,
            response_type: this.$route.query.response_type,
            state: this.$route.query.state
        };
        this._apis.order.sendYlyunResult(params).then(res => {
            this.status = true;
        }).catch(error => {
            this.$message.error(error);
        })
      }
  }
};
</script>
<style scoped lang="scss">
.authorization{
    background: #fff;
    height: 100%;
    width: 100%;
    p{
        padding-top: 300px;
        text-align: center;
        font-size: 24px;
        line-height: 32px;
    }
}
</style>