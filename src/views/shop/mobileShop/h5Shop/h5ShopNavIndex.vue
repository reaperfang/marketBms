/* 移动H5导航首页装修 -- 继承自 微信导航首页装修 */
<template>
  <div>
    <el-tabs v-model="navigation_type" type="card" @tab-click="handleClick">
      <el-tab-pane label="移动H5导航" name="0"></el-tab-pane>
    </el-tabs>
    <div class="on_off">
      <p>店铺的各个页面可以通过导航串联起来。通过精心设置的导航，方便买家在栏目间快速切换，引导买家前往你期望的页面。  </p>
      <el-switch
        v-model="openNav"
        active-color="#13ce66"
        @change="switchStatusChange"
        inactive-color="#ff4949">
      </el-switch>
    </div>
    <component :is="navigation_type === '0' ? 'h5NavEdit' : 'miniNavEdit'" :apiNavData="apiNavData" @submitNavData="submit" @resetNavData="resetData"></component>
  </div>
</template>
<script>
import shopNavIndex from '../wxShop/shopNavIndex'
export default {
  name: "h5ShopNavIndex",
  extends: shopNavIndex,
}
</script>