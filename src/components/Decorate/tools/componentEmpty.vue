<template>
  <div class="empty_data">
      <img class="empty_data_img" :src="require('../../Decorate/defImg/'+componentData.title+'.jpg')" alt="">
      <p>点击编辑{{componentData && (componentData.title || componentData.name)}}</p>
  </div>
</template>

<script>
export default {
  name: 'componentVideo',
  components: {},
  props: ['componentData'],
  data () {
    return {
      show: true
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.empty_data{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background:#fff;
  padding:20px 0;
  img{

  }
  p{
    margin-top:10px;
    font-size:14px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(175,175,176,1);
  }
}
</style>
