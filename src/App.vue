<template>
  <div id="app" :class="{'hide-fenlei': hideFenlei}">
    <router-view/>
  </div>
</template>

<script>
import appConfig from '@/system/appConfig';
export default{
  name: 'App',
  data() {
    return {
      hideFenlei: false
    }
  },
  created() {
     /* 加载腾讯地图库,jsonp回调 */
      this.$jsonp(appConfig.map.url,{
        key: appConfig.map.key
      }).then(()=>{
        this.$store.commit('SET_MAP_STATE', true);
        this._globalEvent.$emit('mapLoaded');
      })

      this._globalEvent.$on('addGoodsEvent', (flag) => {
          if(flag) {
            this.hideFenlei = true
          } else {
            this.hideFenlei = false
          }
      });
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
          name: data.jumpPath,
          query: data.query
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
