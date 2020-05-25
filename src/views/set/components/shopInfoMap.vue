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
          <el-pagination 
            v-if="pois.length > 0"
            class="pagination"
            background
            small
            :pager-count="5"
            :total="totalNum" 
            layout="prev, pager, next"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
          >
          </el-pagination>
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
    },
    city: {
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
      page: 1,
      pageSize: 10,
      totalNum: 0,
      keyword: ''
    };
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val
      this.search()
    },
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
    getSearch(data) {
      return new Promise((resolve, reject) => {
        this._apis.map.getSearch(data).then((response)=> {
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
    },
    getCities(address) {
      const reg = /.+?(市|自治区|自治州|县|区)/g
      const arr = address.match(reg)
      let city = ''
      if (arr && arr.length > 0) {
        city = arr[0]
      }
      return city
    },
    //执行搜索
    search() {
      this.clearAllMaker()
      let city = this.getCities(this.keyword)
      if (!city) {
        city = this.city || '北京市'
      }
      const data = {
        keyword: this.keyword,
        boundary: `region(${this.city},1)`,
        mapPageIndex: this.page,
        mapPageSize: this.pageSize
      }

      //根据输入的城市设置搜索范围
      this.searchService.setLocation(city);
      //设置搜索页码
      this.searchService.setPageIndex(this.page);
      //设置每页的结果数
      this.searchService.setPageCapacity(this.pageSize);
      //根据输入的关键字在搜索范围内检索
      this.searchService.search(data.keyword);
      this.mapObj.zoomTo(17)
      // this.getSearch(data).then((response) => {
      //   console.log('---response---', response)
      //   this.totalNum = response.count
      //   this.pois = response.data || []
      //   this.searchCompleted(response)
      // }).catch((err) => {
      // })
    },
    handlePropSearch(keyword) {
      this.keyword = keyword
      this.search()
      // this.clearAllMaker()
      // this.searchService.search(keyword);
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
      console.log('setMarker: poi.latLng', poi.latLng)
      const self = this
      // 创建MarkerDecoration
      // let content = index + 1;
      // let decoration = new qq.maps.MarkerDecoration(content, new qq.maps.Point(0, -5))
      let marker = new qq.maps.Marker({
        map: this.mapObj,
        position: poi.latLng
      });
      // marker.setPosition(poi.latLng);
      marker.setTitle(index + 1);
      
      qq.maps.event.addListener(marker, 'click', function(e) {
        
        self.info.close();
        self.openInfoWindow(self.info, marker, self.mapObj, poi)
        self.$emit('getMapClickPoi', poi)
      })
      return marker
    },
    //搜索结束
    // searchCompleted(results) {
    //   const self = this
    //   // debugger
    //   console.log('---searchCompleted----', results)
    //   let latlngBounds = new qq.maps.LatLngBounds();
    //   this.markers = [];
    //   let pois = results.data;
    //   // this.pois = pois
    //   var infoWin = new qq.maps.InfoWindow({
    //     map: this.mapObj
    //   });
    //   this.setPanTo(pois[0].location)
    //   for (let i = 0, l = pois.length; i < l; i++) {
    //     console.log('-------', i, l)
    //     let poi = pois[i];
    //     console.log(poi.location)
    //     //扩展边界范围，用来包含搜索到的Poi点
    //     latlngBounds.extend(poi.location);
    //     // const marker = this.setMarker(poi, i+1)
    //     // console.log('---marker---', marker)
    //     (function(poi) {
    //       console.log('setMarker: poi.location', poi.location)
    //       // 创建MarkerDecoration
    //       // let content = index + 1;
    //       // let decoration = new qq.maps.MarkerDecoration(content, new qq.maps.Point(0, -5))
    //       let marker = new qq.maps.Marker({
    //         map: self.mapObj,
    //         // decoration
    //       });
    //       marker.setPosition(poi.location);
    //       marker.setTitle(index + 1);
          
    //       self.markers.push(marker);
    //       qq.maps.event.addListener(marker, 'click', function(e) {
           
    //         self.openInfoWindow(self.info, marker, self.mapObj, poi)
    //         self.$emit('getMapClickPoi', poi)
            
    //       })
    //     })(poi);
    //   }
    //   //调整地图视野
    //   this.mapObj.fitBounds(latlngBounds);
    // },
    // //搜索结束
    searchCompleted(results) {
      console.log('---searchCompleted----', results)
      let latlngBounds = new qq.maps.LatLngBounds();
      this.markers = [];
      let pois = results.detail.pois;
      this.pois = pois
      this.totalNum = results.detail.totalNum
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
      console.log('-lng, lat---',lng, lat)
      const oLatLng = new qq.maps.LatLng(lat, lng)
      this.mapObj.panTo(oLatLng)
      this.mapObj.zoomTo(17)
    },
    // 通过address 获取经纬度 待api开发
    getGeocoderByAddress() {
      console.log('-----获取经纬度----')
      // const lng = 116.307015
      // const lat = 39.982915
      this._apis.map.getGeocoderAddress({ address: this.address }).then((res) => {
        const lng = res.result.location.lng
        const lat = res.result.location.lat
        this.setPanTo(lng, lat)
      }).catch((err) => {
        console.log(err)
      })
      // setTimeout(() => {
      //   this.setPanTo(lng, lat)
      // }, 2000)
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
    width: 360px;
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
    /deep/ ol li {
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
    .pagination {
      text-align: center;
    }
  }
}
.test{
  color:red;
}
</style>

