<template>
  <div class="wrapper">
    <!-- <el-input
      class="search"
      placeholder="地图搜索"
      suffix-icon="el-icon-search"
      v-model="keyword" @keyup="search" @blur="search">
    </el-input> -->
    <div class="result"  v-show="isShowMap">
      <div class="search">
        <el-input class="search-input"
          placeholder="地图搜索"
          clearable
          v-model="keyword">
        <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
      </el-input>
        <div class="info-div" v-if="pois.length > 0">
          <ol>
            <li v-for="(item, index) in pois" @click="handleClickPoi(item, index)"
              :key="index">
              <p v-if="item.name" ><span>{{ index + 1 }}.</span>{{ item.name }}</p>
              <p v-if="item.address">{{ item.address }}</p>
              <p v-if="item.phone"> {{ item.phone }}</p>
            </li>
          </ol>
          <!-- <pagination v-show="pois.length > 0" :total="pois.totalNum" :page.sync="pois.pageIndex" :limit.sync="pois.pageCapacity" /> -->
          <!-- <span class="temp">这里是搜索结果列表</span> -->
          <!-- <el-timeline>
            <el-timeline-item
              v-for="(item, index) in pois"
              :key="index">
              <div class="item">
                <p v-if="item.name" >{{ item.name }}</p>
                <p v-if="item.address">{{ item.address }}</p>
                <p v-if="item.phone"> {{ item.phone }}</p>
              </div>
            </el-timeline-item>
          </el-timeline> -->
        </div>
      </div>
      <div id="mapContainer"  v-show="isShowMap" ref="mapContainer"></div>
    </div>
  </div>
</template>

<script>
import mapBase from "@/components/MapBase";
import appConfig from '@/system/appConfig';
export default {
  name: "shopInfoMap",
  extends: mapBase,
  props: {
    address: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      //搜索参数对象
      searchParams: {
        location: '北京',
        pageIndex:  1,
        pageCapacity: 10,
        autoExtend: true,
      },
      isShowMap: false, // 是否显示地图
      lng: null,
      lat: null,
      info: null,
      markers: [],
      pois: [],
      keyword: ''
    };
  },
  methods: {
    //实例初始化结束
    inited() {
      this.info = new qq.maps.InfoWindow({
        map: this.mapObj
      })
      // this.initEvent();
      // let marker = new qq.maps.Marker({
      //   position: this.centerObj,
      //   map: this.mapObj
      // });
      // this.infoWindow = new qq.maps.InfoWindow({
      //   map: this.mapObj
      // })
      // let marker2 = new qq.maps.Label({
      //   position: this.centerObj,
      //   map: this.mapObj,
      //   content: "天安门"
      // });

      // let cirle = new qq.maps.Circle({
      //   center: new qq.maps.LatLng(39.92, 116.405),
      //   radius: 2000,
      //   map: this.mapObj
      // });
    },

    //初始化事件
    // initEvent() {
    //   this.eventList["click"] = qq.maps.event.addListener(
    //     this.mapObj,
    //     "click",
    //     function(event) {
    //       // alert("您点击了地图。");
    //     }
    //   );
    //   this.eventList["mouseup"] = qq.maps.event.addListener(
    //     this.mapObj,
    //     "mouseup",
    //     function(event) {
    //       // alert("您在地图上抬起了鼠标。");
    //     }
    //   );
    // },

    // clear maker
    clearMarker(index) {
      if (index) {
        this.markers[index].setMap(null)
      }
    },
    clearAllMaker() {
      const markers = this.markers
      let len = markers.length
      if (len > 0) {
        for( let i = 0; i < len; i++) {
          markers[i].setMap(null)
        }
      }
    },
    //执行搜索
    search() {
      this.clearAllMaker()
      this.searchService.search(this.keyword);
    },
    handlePropSearch(keyword) {
      this.keyword = keyword
      this.clearAllMaker()
      this.searchService.search(keyword);
    },
    openInfoWindow(info, marker, map, poi) {
      info.open();
      let html = ''
      if (poi.name) {
        html += `<p style="line-height:22px;">${poi.name}</p>`
      }
      if (poi.address) {
        html += `<p style="color:#ccc; line-height:22px;border-top:1px solid #ccc; ">${poi.address}</p>`
      }
      // self.$emit('getMapClickPoi', poi)
      info.setContent(html);
      info.setPosition(marker.getPosition());
      // setTimeout(function() {
      //   info.close();
      // }, 2000);
    },
    setMarker(poi, index) {
      const self = this
      // 创建MarkerDecoration
      // let content = index + 1;
      // let decoration = new qq.maps.MarkerDecoration(content, new qq.maps.Point(0, -5))
      let marker = new qq.maps.Marker({
        map: this.mapObj,
        position: poi.latLng,
        // decoration
      });

      marker.setTitle(index + 1);
      
      qq.maps.event.addListener(marker, 'click', function(e) {
        
        self.info.close();
        self.openInfoWindow(self.info, marker, self.mapObj, poi)
        self.$emit('getMapClickPoi', poi)
      })
      return marker
    },
    //搜索结束
    searchCompleted(results) {
      console.log('---searchCompleted----', results)
      let latlngBounds = new qq.maps.LatLngBounds();
      this.markers = [];
      let pois = results.detail.pois;
      this.pois = pois
      for (let i = 0, l = pois.length; i < l; i++) {
        let poi = pois[i];
        //扩展边界范围，用来包含搜索到的Poi点
        latlngBounds.extend(poi.latLng);
        const marker = this.setMarker(poi, i+1)
        this.markers.push(marker);
      }
      //调整地图视野
      this.mapObj.fitBounds(latlngBounds);
    },
    // 设置根据地区经纬度变化改变当前地图中心
    setPanTo(lng, lat) {
      const oLatLng = new qq.maps.LatLng(lat, lng)
      this.mapObj.panTo(oLatLng)
      // this.mapObj.zoomTo(12)
    },
    // 通过address 获取经纬度 待api开发
    getGeocoderByAddress() {
      console.log('-----获取经纬度----')
      const lng = 116.307015
      const lat = 39.982915
      setTimeout(() => {
        this.setPanTo(lng, lat)
      }, 2000)
      // const url = `${appConfig.map.apiBaseUrl}v1/`
      // this.$jsonp(url,{
      //   address: this.address,
      //   key: appConfig.map.key
      // }).then((response)=>{
      //   console.log('-----response----',response)
      // })
    },
    handleClickPoi(item, index) {
      this.setPanTo(item.latLng.lng, item.latLng.lat)
      this.info.close();
      this.openInfoWindow(this.info, this.markers[index], this.mapObj, item)
      this.$emit('getMapClickPoi', item)
    }
  },
  watch: {
    address(curr) {
      console.log('----watch---',curr)
      if (curr) {
        this.isShowMap = true
        this.getGeocoderByAddress()
      } else {
        this.isShowMap = false
      }
    }
  }
};
</script>
<style lang="scss">
.wrapper {
  .result {
    position: relative;
    width: 100%;
    height: 100%;
  }
  #mapContainer {
    width: 100%;
    height: 100%;
  }
  .search {
    position: absolute;
    width: 340px;
    padding:15px;
    z-index: 2;
    
  }
  .search /deep/ .el-input__inner {
    border:0;
  }
  .info-div{
    text-align: left;
    font-size: 14px;
    max-height: 580px;
    padding: 10px;
    overflow: auto;
    margin-top: 10px;
    background: #fff;
    .temp{
      margin-left: 5px;
    }
    ol{
      overflow-y: auto;
    }
    /deep/ li {
      overflow: hidden;
      padding: 5px 5px 5px 20px;
      line-height: 16px;
      cursor: pointer;
      &:hover {
        background: #f3f1f1;
      }
      p {
        color:#999999;font-size:12px;
      }
      p:first-child {
        position: relative;
        color:#0059B3;
        span {
          position: absolute;
          top: 0;
          right: 100%;
          padding-right: 5px;
        }
      }
    }
  }
}
.test{
  color:red;
}
</style>

