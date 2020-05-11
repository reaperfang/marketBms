/* 移动H5已装修 -- 继承自 微信已装修 */
<template>
  <div class="shop_index_wrapper">
    <div class="tips">
      <i></i>
      <div class="words">
        <p>店铺的“个人中心”“商品分类”“店铺导航”记得要去开启生效哦~ </p>
        <p>否则会影响店铺在C端的显示~ </p>
      </div>
    </div>
    <div class="preview_wrapper">
      <!-- 装修编辑器 -->
      <Decorate ref="Decorate" :decorateData="decoratePageData" :config="config" :height="175+7+64"></Decorate>
      <div class="shop_info" v-calcHeight="175+10">
        <div class="shop_code">
          <h3>H5店铺手机预览</h3>
          <h4>请您使用手机内自带浏览器扫描二维码，预览店铺效果</h4>
          <div class="qrcode_wrapper">
            <img :src="qrCode" alt="">
          </div>
        </div>
        <div class="url">
          <h3>H5店铺预览地址：</h3>
          <el-input v-model="shareUrl"></el-input>
          <div class="url_btn">
            <el-button type="primary" v-clipboard:copy="shareUrl" v-clipboard:success="onCopy">一键复制</el-button>
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
  </div>
</template>
<script>
import shopMainDecorated from '../wxShop/shopMainDecorated';
export default {
  name: "h5ShopMainDecorated",  
  extends: shopMainDecorated,
  watch: {
    decoratePageData: {
      handler(newValue) {
        this.shareUrl = newValue ? newValue.shareUrl : '';
      },
      deep: true
    }
  },
  created() {
    this.shareUrl = this.decoratePageData ? this.decoratePageData.shareUrl : '';
  },
  methods: {
    onCopy () {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
    },
  }
}
</script>
<style lang="scss" scoped>
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
</style>