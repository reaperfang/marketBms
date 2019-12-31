/* 预览装修弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="(baseInfo.name || '页面名称') + '预览'">
    <div class="preview_wrapper">
      <editView :dragable="false" v-if="height > 0" :height="height"></editView>
      <div class="shop_info">
        <img class="shop_logo" :src="shopInfo.logoCircle || shopInfo.logo" alt />
        <div class="shop_name">{{shopInfo.shopName || '店铺名称'}}</div>
        <div class="shop_code">
          <h3>手机扫码访问</h3>
          <h4>微信扫一扫分享至朋友圈</h4>
          <img :src="qrCode" alt="">
        </div>
      </div>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import editView from "@/components/Decorate/editView";
import utils from "@/utils";
export default {
  name: "dialogDecoratePreview",
  components: {DialogBase, editView},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      decorateData: {
        type: Object
      }
  },
  data() {
    return {
      utils,
      qrCode: '',
      height: 0
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    },
    baseInfo() {
      return this.$store.getters.baseInfo;
    },
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
    this.getQrcode();
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

    /* 获取二维码 */
    getQrcode(codeType, callback) {
      if(!this.decorateData) {
        return;
      }
      this._apis.shop.getQrcode({
        url: this.decorateData.shareUrl.replace("&","[^]"),
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