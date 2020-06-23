<template>
  <!-- 图片广告 -->
  <div class="component_wrapper">
    <div class="componentArticleAD" v-if="currentComponentData && currentComponentData.data">
        <!-- 1、一行一个 -->
        <div v-if="currentComponentData.data.templateType==1" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
          <template v-if="hasContent">
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
          </template>
          <template v-else>
            <img
              class="default_image"
              :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
              src="../../../assets/images/shop/defaultImage/ad1.jpg"
              alt
            />
          </template>
        </div>
        <!-- 2、轮播海报 -->
        <div v-if="currentComponentData.data.templateType==2" :style="{'padding':currentComponentData.data.pageMargin+'px','height':type3Height,'overflow':'hidden'}">
          <template v-if="hasContent">
            <van-swipe :autoplay="3000" indicator-color="white"  @change="type3Change">
              <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
                <img
                  :src="item.url"
                  :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                  alt
                  ref="imgOption"
                  @load="type3ChangeFirstLoad(key)"
                />
              </van-swipe-item>
            </van-swipe>
          </template>
          <template v-else>
            <img
                class="default_image"
                :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                src="../../../assets/images/shop/defaultImage/ad2.jpg"
                alt
              />
          </template>
        </div>
        <!-- 3、大图横向滑动 -->
        <div v-if="currentComponentData.data.templateType==3" :style="{'padding':currentComponentData.data.pageMargin+'px','height':type3Height,'overflow':'hidden'}">
          <template v-if="hasContent">
            <van-swipe :autoplay="2000" :duration="3000" :loop="true" :show-indicators="false" :width="340 + currentComponentData.data.imgMargin" :height="'auto'" class="big_image" @change="type3Change">
              <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
                <img
                  :src="item.url"
                  :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                  :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
                  alt
                  ref="imgOption"
                  @load="type3ChangeFirstLoad(key)"
                />
              </van-swipe-item>
            </van-swipe>
            <span style="color:#aaa;">模拟效果，请以手机实际滑动效果为准。</span>
          </template>
          <template v-else>
            <img
                class="default_image"
                :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                src="../../../assets/images/shop/defaultImage/ad3.jpg"
                alt
              />
          </template>
        </div>
        <!-- 4、小图横向滑动 -->
        <div v-if="currentComponentData.data.templateType==4" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
          <template v-if="hasContent">
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
          </template>
          <template v-else>
            <img
                class="default_image"
                :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                src="../../../assets/images/shop/defaultImage/ad4.jpg"
                alt
              />
          </template>
        </div>
        <!-- 5、导航横向滑动 -->
        <div v-if="currentComponentData.data.templateType==5"  class="style5" :style="{'padding':currentComponentData.data.pageMargin+'px'}">
          <template v-if="hasContent">
            <!-- <van-swipe :autoplay="2000" :duration="3000" :loop="true" :show-indicators="false" :width="93 + currentComponentData.data.imgMargin" :height="93">
              <van-swipe-item v-for="(item, key) of currentComponentData.data.itemList" :key="key">
                <img
                  :src="item.url"
                  :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                  :style="{'paddingRight':currentComponentData.data.imgMargin+'px'}"
                  alt
                />
              </van-swipe-item>
            </van-swipe> -->
            <div class="container">
              <img
                v-for="(item, key) of currentComponentData.data.itemList"
                :key="key" 
                :src="item.url"
                :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                alt
                :style="{'marginLeft':currentComponentData.data.imgMargin + 'px'}"
              />
            </div>
            <span style="color:#aaa;">模拟效果，请以手机实际滑动效果为准。</span>
          </template>
          <template v-else>
            <img
                class="default_image"
                :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                src="../../../assets/images/shop/defaultImage/ad5.jpg"
                alt
              />
          </template>
        </div>
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
      type3Height:'auto'
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
    type3Change(index){
      this.type3Height=this.$refs.imgOption[index].height + 'px';
      console.log(index,this.type3Height);
    },
    type3ChangeFirstLoad(index){
      if(index==0){
        this.type3Height=this.$refs.imgOption[index].height + 'px';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.componentArticleAD {
  .default_image{
    object-fit: none;
    width:100%;
  }

  .article_first {
    width: 100%;
    height: 100%;
    & > img {
      width: 100%;
      // height: 180px;
      object-fit: fill;
      display: block;
    }
    & > img:last-child {
      margin-bottom: 0px !important;
    }
  }
  /deep/ .van-swipe__track {
    height: auto;
    img {
      width: 100%;
      display:block;
    }
  }
  .big_image{
    /deep/ .van-swipe__track {
      height: auto;
      img {
        width: 100%;  
        display:block;
      }
    }
  }
  /deep/ .van-swipe-item {
    height: auto;
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
.style5{
  overflow:hidden;
  .container{
    width:100%;
    overflow-x:scroll;
    white-space:nowrap;
    font-size:0;
    img{
      display:inline-block;
      width:110px;
      height:55px;
      &:first-child{
        margin-left:0 !important;
      }
    }
  }
}
</style>
