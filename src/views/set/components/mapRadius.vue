/* demo腾讯地图-数码庄园 */
<template>
  <div id="mapContainer" ref="mapContainer" :style="{width: width, height: height}"></div>
</template>

<script type='es6'>
import mapBase from "@/components/MapBase";
export default {
  name: "mapRadius",
  extends: mapBase,
  props: {
    radius: {
      type: String,
      default: '0'
    },
    address: {
       type: String,
        default: '数码庄园'
    }
  },
  data() {
    return {
      circle: null
    };
  },
  methods: {

    //实例初始化结束
    inited() {
      // this.initEvent();
      var marker = new qq.maps.Marker({
          position: this.centerObj,
          map: this.mapObj
      });

      var marker2 = new qq.maps.Label({
          position: this.centerObj,
          map: this.mapObj,
          content:this.address
      });
      this.circle = new qq.maps.Circle({
          map: this.mapObj,
          center: this.centerObj,
          radius: 1000,
          fillColor: new qq.maps.Color(0,255,0, 0.5),
          strokeWeight: 5
      });
      // circle.setFillColor("0, 255, 0, 0.5");
    },
    setRadius(val) {
      const radius = val * 1000 // 经测试图上半径为米来进行计算
      this.circle.setRadius(radius)
    }
  },
  components: {},
  watch: {
    radius(curr) {
      console.log(curr)
      if (curr) {
        this.setRadius(curr)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
#mapContainer{
  width:100%;
  height:100%;
}
</style>

