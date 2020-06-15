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
    console.log('加载腾讯地图库,jsonp回调')
     /* 加载腾讯地图库,jsonp回调 */
      this.$jsonp(appConfig.map.url,{
        key: appConfig.map.key
      }).then(()=>{
        this.$store.commit('SET_MAP_STATE', true);
        this._globalEvent.$emit('mapLoaded');
      })

      this._globalEvent.$on('addGoodsEvent', (flag) => {
        if(!this.isIE()) return
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
    isIE() {
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            return true;
        } else if(isEdge) {
            return true;
        } else if(isIE11) {
            return true;
        }else{
            return false
        }
    },
  }
}
</script>
<style lang="scss" scoped>
</style>
