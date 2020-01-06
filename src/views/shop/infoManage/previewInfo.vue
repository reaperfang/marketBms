<template>
    <div>
      <h2>{{data.title}}</h2>
      <span>{{data.updatetime}}</span>
      <span>文章浏览宽度默认为640px。如需调整，为了保障用户的阅读体验，建议不要超过720px</span>
      <div class="rich_wrapper" v-if="data.data" v-html="data.data"></div>
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

    /* 获取分类装修数据 */
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
.rich_wrapper{
  line-height: initial;
  background:#fff;
  width:640px;
  p{
    margin: 5px 0;
  }
}
</style>
