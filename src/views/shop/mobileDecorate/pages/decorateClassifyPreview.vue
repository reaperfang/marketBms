/* 分类预览装修页面 */
<template>
  <div class="preview_wrapper">
     <!-- 装修编辑器 -->
    <Decorate 
      ref="Decorate" 
      :decorateData="decorateData" 
      :config="config" 
      @widgetPanelInited="widgetPanelInited"
      @renderPanelInited="renderPanelInited"
      @propsPanelInited="propsPanelInited"
      @responseDataInited="responseDataInited"
      @propDataChanged="propDataChanged"
      @dataLoadProgress="dataLoadProgress"
      @finished="finished"
    ></Decorate>
    <div class="shop_info" v-calcHeight="66+30">
      <img class="shop_logo" :src="shopInfo.logoCircle || shopInfo.logo" alt />
      <div class="shop_name">{{shopInfo.shopName || '店铺名称'}}</div>
      <div class="shop_code">
        <h3>手机扫码访问</h3>
        <h4>微信扫一扫分享至朋友圈</h4>
        <img :src="qrCode" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import Decorate from '@/components/Decorate';
import utils from '@/utils';
export default {
  name: "decorateClassifyPreview",
  components: {Decorate, },
  data() {
    return {
      utils,
      qrCode: '',
      height: 0,
      loading: true,
       /* 装修编辑器配置 */
      config: {
        pageBase: {
          type: 'pageInfo'
        },
        components: {
          // 可在此处覆写配置表中的所有组件配置
        },
        callbacks: {
          setBaseInfo: this.setBaseInfo
        },
        showWidget: false,
        showProp: false,
        dragable: false,
        renderCalcHeight: 66+10+20,  //渲染区扣减高度
      },
      decorateData: null,
      id: this.pageId || this.$route.query.pageId
    };
  },
  computed: {
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    componentDataIds() {
      return this.$store.getters.componentDataIds;
    },
    componentDataMap() {
      return this.$store.getters.componentDataMap;
    },
    basePropertyId() {
      return this.$store.getters.basePropertyId;
    },
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
    this.$store.commit("clearEditor");
    this.fetch();
  },
  mounted() {
    this.height = document.body.clientHeight - 290;
  },
  watch: {
    shopInfo:{
      handler(newValue) {
        this.getQrcode();
      },
      deep: true
    }
  },
  methods: {

     /* 获取店铺装修数据 */
    fetch() {
      if(!this.id) {
        return;
      }
      this.loading = true;
      this._apis.shop.getClassifyInfo({id: this.id}).then((response)=>{
        this.loading = false;
        this.decorateData = response;
        this.getQrcode();
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

     /* 拼装基础数据 */
    setBaseInfo(data) {
       return {
        name: data.name,
        sortType: data.sortType,
        explain: utils.uncompileStr(data.explain),
        showType: data.showType,
        pageInfos: data.pageInfos
      }
    },

    /* 获取二维码 */
    getQrcode(codeType, callback) {
      if(!this.decorateData) {
        return;
      }
      this._apis.shop.getQrcode({
        url: 'https:' + this.decorateData.shareUrl.split(':')[1].replace("&","[^]"),
        width: '250',
        height: '250',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        console.error(error);
      });
    },

    /* 控件面板初始化 */
    widgetPanelInited(scope) {
      // console.log('控件面板初始化结束');
    },
    
    /* 渲染面板初始化 */
    renderPanelInited(scope) {
      // console.log('渲染面板初始化结束');
    },
    
    /* 属性面板初始化 */
    propsPanelInited(scope) {
      // console.log('属性面板初始化结束');
    },

    /* 请求数据转换初始化事件 */
    responseDataInited(scope) {
      // console.log('请求数据转换初始化结束');
    },

    /* 组件数据发生改变事件 */
    propDataChanged(scope, id, data) {
      // console.log('组件数据发生改变');
    },

    /* 组件数据加载进度事件 */
    dataLoadProgress(scope, value, component) {
      // console.log('组件数据加载进度');
    },

    /* 编辑器整体加载完毕事件 */
    finished(scope) {
      // console.log('编辑器整体加载完毕');
    }
  }
};
</script>

<style lang="scss" scoped>
  .preview_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding-top:20px;
    /deep/.module {
      &.view {
        width: 374px;
        .phone-body {
          height: 592px;
        }
      }
    }
    .shop_info{
      width:336px;
      margin-left:64px;
      overflow-y: auto;
      .shop_logo{
        height:100px;
        width:100%;
        object-fit: contain;
        border: 1px solid #ddd;
      }
      .shop_name{
        margin-top:18px;
        font-size:18px;
        text-align:center;
      }
      .shop_code{
        margin-top:70px;
        padding:30px;
        box-sizing: border-box;
        text-align:center;
        border:1px solid rgba(211,211,211,1);
        background:rgba(248,248,248,1);
        h3{
          font-size:18px;
        }
        h4{
           font-size:16px;
           margin-top:30px;
        }
        img{
          width:100%;
          margin-top:40px;
        }
      }
    }
  }
// }
</style>