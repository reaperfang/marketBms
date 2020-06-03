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
      circle: null,
      visible: false,
      marker: null,
      marker2: null
    };
  },
  methods: {

    //实例初始化结束
    inited() {
      console.log('---inited--',this.center)
      // if (this.center && this.center.length <= 0) return false
      // this.initEvent();
      // if (!this.address) {
        this.marker = new qq.maps.Marker({
            position: this.centerObj,
            map: this.mapObj,
            visible: this.visible
        });

        this.marker2 = new qq.maps.Label({
            position: this.centerObj,
            map: this.mapObj,
            content:this.address,
            visible: this.visible
        });
        const radius = (this.radius || 0) * 1000 // 经测试图上半径为米来进行计算
        // const visible = this.address ? true : false
        this.circle = new qq.maps.Circle({
            map: this.mapObj,
            center: this.centerObj,
            radius,
            fillColor: new qq.maps.Color(0, 255, 0, 0.5),
            strokeWeight: 5,
            visible: this.visible
        });
        // if (visible) {
        // this.setRadius(radius)
        // }
      // }
      
      // this.circle.setRadius()
      // circle.setFillColor("0, 255, 0, 0.5");
    },
    // 设置根据地区经纬度变化改变当前地图中心
    setPanTo(lng, lat, zoom = 17) {
      console.log('-lng, lat---',lng, lat)
      const oLatLng = new qq.maps.LatLng(lat, lng)
      this.mapObj.panTo(oLatLng)
      this.mapObj.zoomTo(zoom)
    },
    setRadius(val) {
      if ((this.center && this.center.length <= 0) || !val) return false
      const radius = (val || 0) * 1000 // 经测试图上半径为米来进行计算
      // this.visible = true
      
      if (radius <= 0) return false
      const LatLng = new qq.maps.LatLng(this.center[0], this.center[1])
      this.marker.setVisible(true)
      this.marker.setPosition(LatLng)
      this.marker2.setVisible(true)
      this.marker2.setPosition(LatLng)
      this.circle.setVisible(true)
      this.circle.setRadius(radius)
      this.circle.setCenter(LatLng)
      let zoom = 13
      if (radius > 1000 * 1000) {
        zoom = 5
      } else if (radius > 500 * 1000){
        zoom = 6
      } else if (radius > 250 * 1000){
        zoom = 7
      } else if (radius > 100 * 1000){
        zoom = 8
      } else if (radius > 50 * 1000){
        zoom = 9
      } else if (radius > 25 * 1000){
        zoom = 10
      } else if (radius > 10 * 1000){
        zoom = 11
      } else if (radius > 5 * 1000){
        zoom = 12
      }else {
        zoom = 13
      }
      console.log('---zoom---', zoom)
      this.setPanTo(this.center[1], this.center[0], zoom)
    }
  },
  components: {},
  watch: {
    radius(curr) {
      console.log(curr)
      if (curr) {
        // this.inited()
        this.setRadius(curr)
      }
    },
    center(curr) {
      if (curr && curr.length > 0) {
        this.setRadius(this.radius)
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

