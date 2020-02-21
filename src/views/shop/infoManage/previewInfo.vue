<template>
    <div class="info_preview_container">
      <h2>{{data.title}}</h2>
      <p class="time"><i class="el-icon-alarm-clock"></i>&nbsp;{{data.updateTime}}</p>
      <div class="rich_wrapper" v-if="data.data" v-html="data.data"></div>
      <div class="confirm_btn">
        <el-button @click="$router.go(-1)">返回</el-button>
      </div>
    </div>
</template>

<script>
export default {
  name: "previewInfo",
  components: {},
  data() {
    return {
      loading: false,
      data: {}
    };
  },
  created() {
    this.fetch();
  },
  methods: {

    /* 获取资讯数据 */
    fetch() {
      if(!this.$route.query.id) {
        return;
      };
      this.loading = true;
      this._apis.shop.getInfo({id: this.$route.query.id}).then((response)=>{
        this.data = response;
        if(response && response.data) {
          const string = unescape(response.data);
          if(string) {
            this.data.data = string;
          }
        }
         this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.info_preview_container{
  padding:20px;
  box-sizing: border-box;
  background:#fff;
  h2{
    font-size:18px;
    font-weight:700;
    color:rgba(22,22,23,1);
    line-height:25px;
    margin-bottom:10px;
  }
  p.time{
    color:rgba(181,189,202,1);
    line-height:17px;
    margin-bottom:30px;
  }
  .rich_wrapper{
    max-width:640px;
  }
  .confirm_btn{
    display:flex;
    flex-direction: row;
    justify-content: center;
    padding-bottom: 30px;
  }
}
</style>
