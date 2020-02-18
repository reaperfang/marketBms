<template>
  <!-- 图片广告 -->
  <div class="componentArticleAD" v-if="currentComponentData && currentComponentData.data">
    <template v-if="hasContent">

      <!-- 1、一行一个 -->
      <div v-if="currentComponentData.data.templateType==1" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <div class="article_first">
          <img
            :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
            v-for="(item, key) of currentComponentData.data.itemList"
            :key="key"
            :src="item.url"
            :style="{'marginBottom':currentComponentData.data.imgMargin+'px'}"
            alt
          />
        </div>
      </div>
      <!-- 2、轮播海报 -->
      <div v-if="currentComponentData.data.templateType==2" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 3、大图横向滑动 -->
      <div v-if="currentComponentData.data.templateType==3" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :autoplay="2000" :duration="3000" :loop="true" :show-indicators="false" :width="340 + currentComponentData.data.imgMargin" :height="'auto'" class="big_image">
          <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
        <span style="color:#aaa;">模拟效果，请以手机实际滑动效果为准。</span>
      </div>
      <!-- 4、小图横向滑动 -->
      <div v-if="currentComponentData.data.templateType==4" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :autoplay="2000" :duration="3000" :loop="true" :show-indicators="false" :width="118 + currentComponentData.data.imgMargin" :height="110">
          <van-swipe-item class="pdr_16" v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
        <span style="color:#aaa;">模拟效果，请以手机实际滑动效果为准。</span>
      </div>
      <!-- 5、导航横向滑动 -->
      <div v-if="currentComponentData.data.templateType==5" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :autoplay="2000" :duration="3000" :loop="true" :show-indicators="false" :width="93 + currentComponentData.data.imgMargin" :height="93">
          <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
        <span style="color:#aaa;">模拟效果，请以手机实际滑动效果为准。</span>
      </div>
    </template>
    <div v-else class="temp_block">
       <img class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
    </div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentArticleAD',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      
    }
  },
  created() {

  },
  computed: {
     /* 检测是否有数据 */
    hasContent() {
      let value = false;
      let array = [];
      if(this.currentComponentData.data.itemList) {
        if(Object.prototype.toString.call(this.currentComponentData.data.itemList) === '[object Object]') {
          this.currentComponentData.data.itemList = [...this.currentComponentData.data.itemList];
        }
        for(let item of this.currentComponentData.data.itemList) {
          if(item.url) {
            value = true;
            break;
          }
        }
      }
      return value;
    }
  },
  watch: {
    'currentComponentData.data.templateType'(newValue) {
      let tempData = [...this.currentComponentData.data.itemList];
      this.currentComponentData.data.itemList = [];
      this.$nextTick(()=>{
        this.currentComponentData.data.itemList = tempData;
      })
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentArticleAD {

  .article_first {
    width: 100%;
    height: 100%;
    & > img {
      width: 100%;
      // height: 180px;
      display: block;
      //   object-fit: contain;
    }
    & > img:last-child {
      margin-bottom: 0px !important;
    }
  }
  /deep/ .van-swipe__track {
    height: 160px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .big_image{
    /deep/ .van-swipe__track {
      height: auto;
      img {
        width: 100%;  
        height: 100%;
      }
    }
  }
  /deep/ .van-swipe-item {
    height: 160px;
  }
  .pdr_16 {
    padding-right: 8px;
  }
  .sle:last-child {
    margin-right: 0px;
  }
  //   圆角
  .borderRadius {
    border-radius: 5px;
  }
  //   投影
  .boxShadow {
    box-shadow: 0px 5px 10px 0px rgba(232, 232, 240, 1);
  }
}
</style>
