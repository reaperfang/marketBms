<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import appConfig from '@/system/appConfig';
export default{
  name: 'App',
  created() {
     /* 加载腾讯地图库,jsonp回调 */
      this.$jsonp(appConfig.map.url,{
        key: appConfig.map.key
      }).then(()=>{
        this.$store.commit('SET_MAP_STATE', true);
        this._globalEvent.$emit('mapLoaded');
      })
  },
  mounted() {
    const _self = this;
    window.onresize = function() {
      _self._globalEvent.$emit('resize')
    }

    /* 接受来自应用系统的路由跳转 */
    window.addEventListener('message', function (e) {
      let data = e.data;
      if(data.jumpPath) {
        _self.$router.push({
          name: data.jumpPath
        })
      }
    });
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
</style>
