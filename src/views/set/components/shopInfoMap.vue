<template>
  <div class="wrapper">
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
              <p v-if="item.title" ><span>{{ index + 1 }}.</span>{{ item.title }}</p>
              <p v-if="item.address">{{ item.address }}</p>
              <p v-if="item.tel"> {{ item.tel }}</p>
            </li>
          </ol>
          <el-pagination 
            v-if="pois.length > 0"
            class="pagination"
            :background="true"
            small
            :pager-count="5"
            :total="totalNum" 
            layout="prev, pager, next, sizes"
            @current-change="handleCurrentChange"
            :current-page.sync="page"
            :page-size="pageSize"
          >
          </el-pagination>
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
    boundary: {
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
      keyword: '',
      markerClusterer: null
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
    },
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
          this.clearMarker(i)
        }
      }
    },
    getSearch(data) {
      return new Promise((resolve, reject) => {
        this._apis.map.getSearch(data).then((response)=> {
          resolve(response)
        }).catch((err) => {
          console.error(err)
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
      let boundary = this.getCities(this.keyword)
      if (!boundary) {
        boundary = this.boundary || '北京市'
      }
      const data = {
        keyword: this.keyword,
        boundary: `region(${this.boundary},1)`,
        mapPageIndex: this.page,
        mapPageSize: this.pageSize
      }

      this.getSearch(data).then((response) => {
        this.totalNum = response.count
        this.pois = response.data || []
        if (this.pois.length > 0) {
          this.addMarkers(response)
        } else {
          this.$message.error('暂无查询结果')
        }
      }).catch((err) => {
        this.$message.error('查询失败')
      })
    },
    handlePropSearch(keyword) {
      this.keyword = keyword
      this.search()
    },
    openInfoWindow(info, marker, map, poi) {
      info.open();
      let html = ''
      if (poi.title) {
        html += `<p style="line-height:22px;">${poi.title}</p>`
      }
      if (poi.address) {
        html += `<p style="color:#ccc; line-height:22px;border-top:1px solid #ccc; ">${poi.address}</p>`
      }
      // self.$emit('getMapClickPoi', poi)
      info.setContent(html);
      let position = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
      info.setPosition(position);
    },
    
    addMarkers(results) {
      const self = this
      const pois = results.data
      // console.log('--addMarkers--', pois)
      if (pois.length <= 0) return false
      // let latlngBounds = new qq.maps.LatLngBounds();
      for (var i = 0; i < pois.length; i++) {
        let poi = pois[i]
        // latlngBounds.extend(poi.location);
        let position = new qq.maps.LatLng(poi.location.lat, poi.location.lng);
        // let decoration = new qq.maps.MarkerDecoration(i, new qq.maps.Point(0, -5));
        let makerAdd = new qq.maps.Marker(({
          'position': position,
          // 'decoration': decoration,
          'map': self.mapObj
        }))
        // console.log('makerAdd', makerAdd)
        qq.maps.event.addListener(makerAdd, 'click', function(e) {    
          self.info.close();
          self.openInfoWindow(self.info, makerAdd, self.mapObj, poi)
          self.$emit('getMapClickPoi', poi)
        })
        this.markers.push(makerAdd)
      }
      this.setPanTo(pois[0].location.lng, pois[0].location.lat)
    },
    // 设置根据地区经纬度变化改变当前地图中心
    setPanTo(lng, lat) {
      // console.log('-lng, lat---',lng, lat)
      const oLatLng = new qq.maps.LatLng(lat, lng)
      this.mapObj.panTo(oLatLng)
      this.mapObj.zoomTo(17)
    },
    // 通过address 获取经纬度 待api开发
    getGeocoderByAddress() {
      // console.log('-----获取经纬度----')
      // const lng = 116.307015
      // const lat = 39.982915
      this._apis.map.getGeocoderAddress({ address: this.address }).then((res) => {
        const lng = res.result.location.lng
        const lat = res.result.location.lat
        this.setPanTo(lng, lat)
      }).catch((err) => {
        console.error(err)
      })
    },
    handleClickPoi(item, index) {
      this.setPanTo(item.location.lng, item.location.lat)
      if (this.info) {
        this.info.close();
      }
      this.openInfoWindow(this.info, this.markers[index], this.mapObj, item)
      this.$emit('getMapClickPoi', item)
    }
  },
  watch: {
    address(curr) {
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
</style>

