<template>
  <!-- 图片广告 -->
  <div class="componentArticleAD" v-if="currentComponentData && currentComponentData.data">

    <div class="temp_block" v-if="!currentComponentData.data.itemList[0].title && !currentComponentData.data.itemList[0].linkTo">
      <p>点击编辑图片广告</p>
    </div>
    <template v-else>

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
        <van-swipe :loop="false" :width="340 + currentComponentData.data.imgMargin">
          <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 4、小图横向滑动 -->
      <div v-if="currentComponentData.data.templateType==4" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :loop="false" :show-indicators="false" :width="118 + currentComponentData.data.imgMargin" :height="110">
          <van-swipe-item class="pdr_16" v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>
      <!-- 5、导航横向滑动 -->
      <div v-if="currentComponentData.data.templateType==5" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
        <van-swipe :loop="false" :show-indicators="false" :width="93 + currentComponentData.data.imgMargin" :height="93">
          <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
            <img
              :src="item.url"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
              alt
            />
          </van-swipe-item>
        </van-swipe>
      </div>
    </template>

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
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentArticleAD {
  .temp_block{
    width: 100%;
    height: 180px;
    background: #eeedfb;
    display: flex;
    justify-content: center;
    align-items: center;
    p{
      font-size:15px;
      color:rgba(101,94,255,1);
    }
  }

  .article_first {
    width: 100%;
    height: 100%;
    & > img {
      width: 100%;
      // height: 180px;
      display: inline-block;
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
