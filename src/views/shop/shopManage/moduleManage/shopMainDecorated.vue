<template>
  <div class="preview_wrapper">
    <div class="module view" :style="{backgroundColor: baseInfo&&baseInfo.pageBackground}">
      <editView :dragable="false" v-if="height > 0" :height="height"></editView>
    </div>
    <div class="shop_info">
      <div class="shop_code">
        <h3>店铺手机预览</h3>
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
            <el-button type="primary" plain @click="_routeTo('ADManageIndex')">首页广告</el-button>
            <p>{{shopInfo.adOpenType === 1 ? '已开启' : '已关闭'}}</p>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('shopNav')">店铺导航</el-button>
            <p>{{shopInfo.shopNavigation === 1 ? '已开启' : '已关闭'}}</p>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('shopStyle')">店铺风格</el-button>
            <div class="color_wrapper">
              <div class="style_block" v-for="(item, key) of colorStyle.colors" :key="key" :style="{'backgroundColor': item}"></div>
            </div>
          </li>
          <li>
            <el-button type="primary" plain @click="_routeTo('shopEditor', {pageId: homePageData.id})">首页装修</el-button>
          </li>
          <li>
            <el-button type="primary" plain  @click="_routeTo('templateManageIndex')">店铺模板</el-button>
          </li>
          <!-- <li>
            <el-button type="primary" plain>小程序</el-button>
            <el-tooltip class="item" effect="dark" content="小程序需通过微信审核后修改设置才将生效" placement="bottom-end">
              <span>？</span>
            </el-tooltip>
            <p>{{miniProgramStatus === 1 ? '已生效' : '审核中'}}</p>  
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import editView from "@/components/Decorate/editView";
export default {
  name: "shopMainDecorated",
  props: ['homePageData'],
  components: {editView},
  data() {
    return {
      utils,
      qrCode: '',
      height: 0,
      miniProgramStatus: 1
    };
  },
  computed: {
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    },
    colorStyle() {
      return this.$store.getters.colorStyle || {};
    },
  },
  created() {
    this.$store.dispatch('getShopInfo');
    this.$store.dispatch('getShopStyle');
    this.getQrcode();
    this.getMiniProgramStatus();
  },
  mounted() {
    this.height = document.body.clientHeight - 238 - 20;
  },
  watch: {
    shopInfo: {
      handler(newValue) {
        this.getQrcode();
      },
      deep: true
    }
  },
  methods: {

      /* 获取二维码 */
    getQrcode(codeType, callback) {
      this._apis.shop.getQrcode({
        url: this.homePageData.shareUrl.replace("&","[^]"),
        width: '250',
        height: '250',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
      });
    },

    /* 获取小程序状态 */
    getMiniProgramStatus() {
      this._apis.shop.getMiniProgramStatus().then((response)=>{
        this.miniProgramStatus = response;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
      });
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
        width: 374px;
        .phone-body {
          height: 592px;
        }
      }
    }
    .shop_info{
      width:336px;
      margin-left:40px;
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
        margin-top:20px;
        padding:30px;
        box-sizing: border-box;
        text-align:center;
        border:1px solid rgba(211,211,211,1);
        background:rgba(248,248,248,1);
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