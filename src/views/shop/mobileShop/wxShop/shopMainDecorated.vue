<template>
  <div class="preview_wrapper">
    <!-- 装修编辑器 -->
    <Decorate 
      v-calcHeight="197"
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
    <div class="shop_info" v-calcHeight="197">
      <div class="shop_code">
        <h3>店铺微信预览</h3>
        <h4>使用微信扫描二维码，预览店铺效果</h4>
        <!-- {{this.homePageData.shareUrl.replace("&","[^]")}} -->
        <div class="qrcode_wrapper">
          <img :src="qrCode" alt="">
        </div>
      </div>
      <div class="tools">
        <h3>店铺工具</h3>
        <ul class="tile-list n3">
          <li>
            <el-button type="primary" plain @click="_routeTo('m_ADManageIndex')">首页广告</el-button>
            <p>{{shopInfo.adOpenType === 1 ? '已开启' : '已关闭'}}</p>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('m_shopNavIndex')">店铺导航</el-button>
            <p>{{shopInfo.shopNavigation === 1 ? '已开启' : '已关闭'}}</p>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('m_shopStyle')">店铺风格</el-button>
            <div class="color_wrapper">
              <div class="style_block" v-for="(item, key) of colorStyle.colors" :key="key" :style="{'backgroundColor': item}"></div>
            </div>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('m_shopEditor', {pageId: decoratePageData.id})">首页装修</el-button>
          </li>
          <li>
            <el-button type="primary" plain  @click="_routeTo('m_templateManageIndex')">店铺模板</el-button>
          </li>
          <li v-if="miniProgramStatus && miniProgramStatus.status === 1">
            <el-popover
              ref="popover2"
              placement="top-start"
              title=""
              style="margin-left:10px;"
              width="170"
              trigger="click"
              content="">
              <img v-if="showCode" :src="miniAppcode" alt="" style="width:150px;height:150px;">
              <span v-else>无分享地址</span>
              <el-button slot="reference" @click="getMiniAppQrcode();showCode=true" type="primary" plain :disabled="!miniProgramStatus.data || miniProgramStatus.data.current_status !== 'published'">
                <el-tooltip class="item" effect="dark" content="小程序需通过微信审核后修改设置才将生效" placement="bottom-end">
                  <span>小程序 <i class="el-icon-question" style="font-size:12px;color:#000"></i></span>
                </el-tooltip>
              </el-button>
            </el-popover>
            <!-- <el-button type="primary" plain>
              <el-tooltip class="item" effect="dark" content="小程序需通过微信审核后修改设置才将生效" placement="bottom-end">
                <span>小程序 <i class="el-icon-question" style="font-size:12px;color:#000"></i></span>
              </el-tooltip>
            </el-button> -->
            <p v-if="miniProgramStatus.data" :style="{color: getMiniAppColor(miniProgramStatus.data.current_status)}">{{miniProgramStatus.data.current_name || ''}}</p>  
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import Decorate from '@/components/Decorate';
export default {
  name: "shopMainDecorated",
  props: ['decorateData'],
  components: {Decorate},
  data() {
    return {
      utils,
      qrCode: '',
      miniAppcode: '',   //小程序码
      miniProgramStatus: null,
      openMiniAppcodeLoading: false,  //获取小程序码loading
      showCode: false,  //显示小程序码
       /* 装修编辑器配置 */
      config: {
        pageBase: {
          type: 'pageInfo',
          isBase: true,
          hidden: true,
          title: '页面信息'
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
        renderCalcHeight: 212+10  //渲染区扣减高度
      },
      decoratePageData: this.decorateData
    };
  },
  computed: {
    colorStyle() {
      return this.$store.getters.colorStyle || {};
    },
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
    },
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
    this.$store.commit("clearEditor");
    this.getQrcode();
    this.getMiniAppQrcode();
    this.getMiniProgramStatus();
  },
  mounted() {
  },
  watch: {
    shopInfo: {
      handler(newValue) {
        this.getQrcode();
      },
      deep: true
    },
    decorateData: {
      handler(newValue) {
        this.decoratePageData = newValue;
      },
      deep: true
    },
  },
  methods: {

     /* 拼装基础数据 */
    setBaseInfo(data) {
      return {
        name: data.name,
        title: data.title,
        explain: data.explain,
        pageCategoryInfoId: data.pageCategoryInfoId,
        colorStyle: data.colorStyle,
        pageKey: data.pageKey,
        pageTemplateId: data.pageTemplateId
      }
    },

      /* 获取二维码 */
    getQrcode(codeType, callback) {
      this._apis.shop.getQrcode({
        url: 'https:' + this.decoratePageData.shareUrl.split(':')[1].replace("&","[^]"),
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

    /* 获取小程序状态 */
    getMiniProgramStatus() {
      this._apis.shop.getMiniProgramStatus().then((response)=>{
        this.miniProgramStatus = response;
      }).catch((error)=>{
        console.error(error);
      });
    },

    /* 获取小程序状态文字颜色值 */
    getMiniAppColor(status) {
      switch(status) {
        case 'none':
          return '#FD4C2B';
          break;
        case 'uncheck':
          return '#655EFF';
          break;
        case 'checking':
          return '#655EFF';
          break;
        case 'checkerr':
          return '#FD4C2B';
          break;
        case 'published':
          return '#008000';
          break;
        case 'unauthorize':
          return '#FD4C2B';
          break;
      }
    },

    //   /* 获取小程序码 */
    // getMiniAppQrcode() {
    //   this.openMiniAppcodeLoading = true;
    //   this._apis.shop.getMiniAppQrcode({id: '1'}).then((response)=>{
    //     this.miniAppcode = response;
    //     this.openMiniAppcodeLoading = false;
    //   }).catch((error)=>{
    //     this.openMiniAppcodeLoading = false;
    //     this.$message({ message: error, type: 'error' });
    //   });
    // },

    //获取小程序太阳码
    getMiniAppQrcode(){
      this.openMiniAppcodeLoading = true;
      this._apis.shopInfo
        .getSmallQRcode({id:this.cid}).then(response => {
          this.miniAppcode = `data:image/png;base64,${response}`;
          this.openMiniAppcodeLoading = false;
        })
        .catch(error => {
          console.error(error);
          this.$message({ message: error, type: 'error' });
          this.openMiniAppcodeLoading = false;
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

<style lang="scss">
  .preview_wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding-top:20px;
    /deep/.module {
      &.view {
        width: 377px;
        height: 100% !important;
        border: 1px #D0D6E4 solid;
        box-shadow: none !important;
        .phone-body {
          height: 592px;
        }
      }
    }
    .shop_info{
      width:336px;
      margin-left:40px;
      overflow-y: auto;
      .shop_logo{
        height:100px;
        width:100%;
      }
      .shop_name{
        margin-top:18px;
        font-size:18px;
        text-align:center;
      }
      .shop_code{
        padding:25px 30px 30px 30px;
        box-sizing: border-box;
        text-align:center;
        background:#fff;
        border: 1px #D0D6E4 solid;
        border-radius: 2px;
        h3{
          font-size:18px;
        }
        h4{
           font-size:16px;
           margin-top:30px;
          text-align: left;
        }
        .qrcode_wrapper{
          padding:5px;
          img{
            width: 250px;
            height: 250px;
            display: block;
            border: 1px solid #ddd;
            margin: 40px auto 0;
          }
        }
      }
      .tools{
        margin-top:10px;
        padding:20px 20px 10px 20px;
        box-sizing: border-box;
        text-align:center;
        background: #fff;
        border: 1px #D0D6E4 solid;
        border-radius: 2px;
        h3{
          text-align:center;
          font-size:18px;
          color:rgba(68,67,75,1);
        }
        ul{
          margin-top:30px;
          li{
            p{
              margin-top: 12px;
              color:rgba(211,211,211,1);
            }
            .color_wrapper{
              margin: 12px 0 0 10px;
              display:flex;
              flex-direction: row;
              justify-content: flex-start;
              cursor:pointer;
              border: 2px dashed transparent;
              .style_block{
                width:18px;
                height:18px;
              }
            }
          }
        }
      }
    }
  }
</style>