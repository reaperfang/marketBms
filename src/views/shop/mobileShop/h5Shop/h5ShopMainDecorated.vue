/* 移动H5已装修 -- 继承自 微信已装修 */
<template>
  <div class="preview_wrapper">
    <!-- 装修编辑器 -->
    <Decorate ref="Decorate" :decorateData="decoratePageData" :config="config" :height="175+7+64"></Decorate>
    <div class="shop_info" v-calcHeight="175+10">
      <div class="shop_code">
        <h3>H5店铺手机预览</h3>
        <h4>请您使用手机内自带浏览器扫描二维码，预览店铺效果</h4>
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
<script>
import shopMainDecorated from '../wxShop/shopMainDecorated';
export default {
  name: "h5ShopMainDecorated",
  extends: shopMainDecorated,
}
</script>