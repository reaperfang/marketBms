/* 移动H5已装修 -- 继承自 微信已装修 */
<template>
  <div class="shop_index_wrapper" v-loading="loading" v-calcHeight="160">
    <div v-if="!webStatus || (webStatus === 0) || (webStatus === 2)" class="no_open">
      <img src="../../../../assets/images/shop/no-open-h5.png" alt="">
      <p>您尚未开启移动H5店铺，请您去“应用中心-渠道应用”设置域名并开启店铺：</p>
      <div class="button" @click="linkToOpenH5"><span>渠道应用</span></div>
    </div>
    <!-- <div v-if="webStatus === 2" class="no_bind">
      <img src="../../../../assets/images/shop/no-open-h5.png" alt="">
      <p>您尚未成功开启H5店铺，店铺域名未连接成功，请您去“渠道应用-H5店铺”重新设置：</p>
      <div class="button" @click="linkToBindDomain"><span>移动</span>H5</div>
    </div> -->
    <template v-if="webStatus === 1">
      <div class="tips">
        <i></i>
        <div class="words">
          <p>店铺的“个人中心”“商品分类”“店铺导航”记得要去开启生效哦~ </p>
          <p>否则会影响店铺在C端的显示~ </p>
        </div>
      </div>
      <div class="preview_wrapper">
        <!-- 装修编辑器 -->
        <Decorate 
          ref="Decorate" 
          :decorateData="decorateData" 
          :config="config" 
          @widgetInited="widgetInited"
          @renderInited="renderInited"
          @propsInited="propsInited"
          @baseComponentInited="baseComponentInited"
          @dataInited="dataInited"
        ></Decorate>
        <div class="shop_info" v-calcHeight="260+10">
          <div class="shop_code">
            <h3>H5店铺手机预览</h3>
            <h4>请您使用手机内自带浏览器扫描二维码，预览店铺效果</h4>
            <div class="qrcode_wrapper">
              <img :src="qrCode" alt="">
            </div>
          </div>
          <div class="url">
            <h3>H5店铺预览地址：</h3>
            <el-input v-model="h5ShareUrl"></el-input>
            <div class="url_btn">
              <el-button type="primary" v-clipboard:copy="h5ShareUrl" v-clipboard:success="onCopy">一键复制</el-button>
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
                <el-button type="primary" plain @click="_routeTo('m_h5ShopNavIndex')">店铺导航</el-button>
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
            </ul>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import shopMainDecorated from '../wxShop/shopMainDecorated';
import { mapMutations } from 'vuex'
export default {
  name: "h5ShopMainDecorated",
  extends: shopMainDecorated,
  data() {
    return {
      loading: true,
      webStatus: null,  //未绑定过域名
      h5ShareUrl: '',  //h5店铺分享地址

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
        renderCalcHeight: 260+10  //渲染区扣减高度
      },
    }
  },
  props: {
    webPageStatus: {
      default: null
    },
    statusLoading: {
      type: Boolean
    }
  },
  watch: {
    // decoratePageData: {
    //   handler(newValue) {
    //     this.shareUrl = newValue ? newValue.shareUrl : '';
    //   },
    //   deep: true
    // }
    webPageStatus(newValue) {
      this.webStatus = newValue;
    },
    statusLoading(newValue) {
      this.loading = newValue;
    }
  },
  created() {
    // this.shareUrl = this.decoratePageData ? this.decoratePageData.shareUrl : '';
    this.webStatus = this.webPageStatus;
    this.loading = this.statusLoading;
    this.getH5StoreDomainList();
  },
  methods: {
    ...mapMutations(['SETCURRENT']),
    onCopy () {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
    },

    /* 去开通H5店铺 */
    linkToOpenH5() {
      this.$router.push({path:'/apply',query:{paths:'/application/channelapp', menuId:3}})
      this.SETCURRENT(8)
    },

    /* 去绑定H5店铺域名 */
    linkToBindDomain() {
      this.$router.push({path:'/apply',query:{paths:'/application/channelapp/mobileHFive', menuId:3}})
      this.SETCURRENT(8)
    },

    /* 获取H5店铺域名列表 */
    getH5StoreDomainList() {
      this.loading = true;
      this._apis.shop.getH5StoreDomainList({status: 1}).then((response)=>{
        this.h5ShareUrl = Array.isArray(response) && response[0] && response[0].domainName ? 'https:' + '//' + response[0].domainName : '';
        this.getQrcode();
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

      /* 获取二维码 */
    getQrcode(codeType, callback) {
      this._apis.shop.getQrcode({
        url: this.h5ShareUrl,
        width: '250',
        height: '250',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        console.error(error);
      });
    }
  }
}
</script>
<style lang="scss">
.shop_index_wrapper{
   min-height: 500px!important;
  .no_open,.no_bind{
    display:flex;
    flex-direction: column;
    align-items: center;
    img{
      margin-top:33px;
      width:403px;
      height:330px;
    }
    p{
      font-size:16px;
      font-family:MicrosoftYaHei;
      color:rgba(68,67,75,1);
      margin-top:37px;
    }
    .button{
      margin-top: 24px;
      width: 152px;
      height: 34px;
      /* line-height: 34px; */
      background: #655EFF;
      font-size: 14px;
      font-family: PingFangSC-Regular,PingFang SC;
      font-weight: 400;
      color: #fff;
      padding: 7px 20px 7px 32px;
      box-sizing: border-box;
      text-align: center;
      border-radius: 4px;
      line-height: 1.3;
      cursor: pointer;
      span{
        letter-spacing: 8px;
      }
    }
  }
  .no_bind{
    .button{
      padding: 7px 30px 7px 32px;
    }
  }
  .tips{
    display:flex;
    justify-content: flex-start;
    align-items: center;
    margin-top:18px;
    i{
      background: url('../../../../assets/images/shop/abc.png') no-repeat 0 0;
      width: 18px;
      height: 20px;
      display:block;
      margin-right:14px;
    }
    .words{
      font-size:16px;
      font-family:MicrosoftYaHei;
      color:rgba(101,94,255,1);
    }
  }
  .url{
    background: #fff;
    padding: 25px 20px 15px 20px;
    margin-top: 10px;
    h3{
      font-size:18px;
      font-family:MicrosoftYaHei;
      color:rgba(68,67,75,1);
      margin-bottom:23px;
    }
    .url_btn{
      margin-top: 23px;
      display:flex;
      justify-content: flex-end;
    }
  }
}
</style>
