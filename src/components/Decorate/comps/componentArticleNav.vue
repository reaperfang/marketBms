<template>
  <!-- 图文导航 -->
  <div class="component_wrapper" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div class="componentArticleNav" :style="{'backgroundColor':currentComponentData.data.backgroundColor}" v-if="currentComponentData && currentComponentData.data">

        <!-- 1、图片导航 -->
        <div v-if="currentComponentData.data.templateType===1">
            <!-- (1)固定 -->
              <div v-if="currentComponentData.data.slideType===1">
                <template v-if="hasContent">
                  <ul class="img_nav" :class="{'five':currentComponentData.data.itemList.length>4}">
                    <li ref="img_w" v-for="(item,index) in currentComponentData.data.itemList" :key="index">
                      <div :class="{'default': !item.url}">
                        <el-image v-if="item.url" :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" :src="item.url" alt lazy>
                          <div slot="placeholder" class="el-image__lazyloading" style="font-size: 12px;">
                              加载中
                          </div>
                        </el-image>
                      </div>
                      <p class="ellipsis" :style="{color:currentComponentData.data.fontColor}">{{item.title}}</p>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                    src="../../../assets/images/shop/defaultImage/nav1.jpg"
                    alt
                  />
                </template>
              </div>
            <!-- (2)横向滑动 -->
              <div v-else-if="currentComponentData.data.slideType===2" class="scroll_wrapper" :class="{'scroll_wrapper_preview': bodyClass}">
                <template v-if="hasContent">
                  <ul class="img_nav2 clearfix" ref="scrollContent">
                    <li ref="img_w" v-for="(item,index) in currentComponentData.data.itemList" :key="index">
                      <div >
                        <el-image v-if="item.url" :scroll-container="bodyClass ?  '.scroll_wrapper_preview' : '.scroll_wrapper'" :src="item.url" alt lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                        <div v-else class="el-image" style="border: 1px #ddd solid;"></div>
                      </div>
                      <p class="ellipsis" :style="{color:currentComponentData.data.fontColor}">{{item.title}}</p>
                    </li>
                  </ul>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                    src="../../../assets/images/shop/defaultImage/nav2.jpg"
                    alt
                  />
                </template>
              </div>
        </div>
        <!-- 2、文字导航 -->
        <div v-if="currentComponentData.data.templateType===2">
            <!-- (1)固定 -->
            <div v-if="currentComponentData.data.slideType===1">
              <template v-if="hasContent">
                <ul :class="currentComponentData.data.itemList.length>5?'img_nav4':'img_nav3'">
                  <li ref="img_w" v-for="(item,index) in currentComponentData.data.itemList" :key="index">
                    <span :style="{color:currentComponentData.data.fontColor}">{{item.title}}</span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <img
                  class="default_image"
                  :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                  src="../../../assets/images/shop/defaultImage/nav3.jpg"
                  alt
                />
              </template>
            </div>
            <!-- (2)横向滑动 -->
            <div v-if="currentComponentData.data.slideType===2" class="scroll_wrapper">
              <template v-if="hasContent">
                <ul class="img_nav5 clearfix" ref="scrollContent2">
                  <li ref="img_w" v-for="(item,index) in currentComponentData.data.itemList" :key="index">
                    <span class="ellipsis" :style="{color:currentComponentData.data.fontColor}">{{item.title}}</span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <img
                  class="default_image"
                  :class="[currentComponentData.data.imgChamfer==1?'':'borderRadius', currentComponentData.data.imgStyle===1?'':'boxShadow']"
                  src="../../../assets/images/shop/defaultImage/nav4.jpg"
                  alt
                />
              </template>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: "componentArticleNav",
  mixins:[mixinCompsBase],
  components: {},
  data() {
    return {
      clientHight: ""
    };
  },
  created() {},
  mounted() {
    this.dataLoaded = true;
    this.calcScroll();
  },
  watch: {
    'currentComponentData.data': {
      handler (newValue){
        if(this.$refs.img_w) {
          this.clientHight = this.$refs.img_w[0].clientWidth - 5;
        }
        this.calcScroll();
      }
    }
  },
  computed: {
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.currentComponentData.data.itemList) {
          if(Object.prototype.toString.call(this.currentComponentData.data.itemList) === '[object Object]') {
            this.currentComponentData.data.itemList = [...this.currentComponentData.data.itemList];
          }
          return !!this.currentComponentData.data.itemList.length
        }
        return value;
    }
  },
  methods: {
    /* 计算横向滚动宽度 */
    calcScroll() {
      this.$nextTick(()=>{
        const name = this.currentComponentData.data.templateType === 1 ? 'scrollContent' : 'scrollContent2';
        if(this.$refs[name]) {
          let width = this.currentComponentData.data.itemList.length * (75 + 10);
          this.$refs[name].style.width = width + "px";
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.componentArticleNav {
  .scroll_wrapper{
    overflow-x: auto;
  }
  .default_image{
    width:100%;
  }

  // 小于5个数
  .img_nav {
    font-size:0;
    white-space:nowrap;
    overflow:hidden;
    padding:11.5px 0 19px;
    .el-image {
      display: block;
      width: 100%;
      height: 100%;
    }
    & > li {
      width:25%;
      float:left;
      padding:7.5px 0;
      & > div {
        width:50px;
        height:50px;
        margin:0 auto;
        &.default{
          background: #ddd;
        }
        & > img {
          width: 100%;
          height: 100%;
        }
      }
      & > p {
        font-size: 14px;
        margin-top: 2.5px;
        text-align:center;
      }
    }
    & > li:last-child {
      padding-right: 0px;
    }
  }
  .img_nav.five{
    li{
      width:20%;
      &>div{
        width:40px;
        height:40px;
      }
    }
  }
  //   大于5个时候换行。
  // .img_nav1 {
  //   display: flex;
  //   flex-direction: row;
  //   flex-wrap: wrap;
  //   // padding: 22px;
  //   & > li {
  //     width: 20%;
  //     text-align: center;
  //     // padding-right: 20px;
  //     padding-bottom: 10px;
  //     & > div {
  //       margin: 0 auto;
  //       & > img {
  //         width: 100%;
  //         height: 100%;
  //       }
  //     }
  //     & > p {
  //       font-size: 28px;
  //       padding-top: 20px;
  //       color: #1c1d1f;
  //     }
  //   }
  //   & > li:nth-child(5n) {
  //     padding-right: 0px;
  //   }
  // }
  //   横向滑动
  .img_nav2 {
    display: -webkit-box;
    overflow-x: scroll;
    .el-image {
      display: block;
      width: 100%;
      height: 80px;
    }
    & > li {
      width: 80px;
      text-align: center;
      & > div {
        margin: 0 auto;
        & > img {
          width: 100%;
          height: 80px;
        }
      }
      & > p {
        font-size: 14px;
        padding: 5px 0px;
        color: #1c1d1f;
      }
    }
  }
  // 文字导航小于5个数
.img_nav3 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  height: 42px;
  & > li {
      flex: 1;
      text-align: center;
      box-sizing: border-box;
      position: relative;
    & > span {
      font-size: 14px;
      position: absolute;
      // box-sizing: border-box;
      left: 50%;
      top: 50%;
      transform: (-50% -50%);
      transform: translate(-50%, -50%);
      width: 100%;
      border-left: 1px solid #e5e5e5;
    }
    &:first-child{
      &>span{
      border-left:0;
      }
    }
  }
  }
  // 文字导航大于5个数
  .img_nav4 {
    min-height: 42px;
    overflow:hidden;
    padding:5px 0;
    & > li {
      text-align: center;
      box-sizing: border-box;
      position: relative;
      float:left;
      width:20%;
      margin-top:5px;
      &:nth-of-type(1){
        margin-top:0;
      }
      &:nth-of-type(2){
        margin-top:0;
      }
      &:nth-of-type(3){
        margin-top:0;
      }
      &:nth-of-type(4){
        margin-top:0;
      }
      &:nth-of-type(5){
        margin-top:0;
      }               
      & > span {
        font-size: 14px;
        width: 100%;
        display:block;
        border-left: 1px solid #e5e5e5;
      }         
    }
    & > li:nth-of-type(5n+1) {
      & > span {
        border-left: 0px;
      }
    }
  }
  // 文字导航横向滑动
  .img_nav5 {
    display: -webkit-box;
    width: 100%;
    height: 42px;
    & > li {
      width: 75px;
      text-align: center;
      box-sizing: border-box;
      position: relative;
      & > span {
        font-size: 14px;
        position: absolute;
        // box-sizing: border-box;
        left: 50%;
        top: 50%;
        transform: (-50% -50%);
        transform: translate(-50%, -50%);
        width: 100%;
        border-right: 1px solid #e5e5e5;
      }
    }
    & > li:last-child {
      & > span {
        border-right: 0px;
      }
    }
  }
}
</style>