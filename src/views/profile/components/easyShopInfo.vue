/*店铺信息 */
<template>
  <div class="shopInfo">
    <steps class="steps" :step="step"></steps>
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="160px">
      <h2>店铺信息</h2>
      <el-form-item label="店铺名称:" prop="shopName">
        <el-input v-model.trim="form.shopName" style="width:226px;"></el-input>
         <span class="shopInfo-show">
          <!--用于展示给消费者的品牌形象 -->
          <span @mouseover="showShop = true" @mouseout="showShop = false">查看样例</span>
        </span>
      </el-form-item>
      <el-form-item label="店铺LOGO:">
        <span v-if="form.logo" class="avatar">
          <img :src="form.logo" class="logo_img" />
          <canvas ref="canvas1" width="80px" height="80px" v-show="false"></canvas>
        </span>
        <span
          class="uploadFont"
          @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'"
        >上传</span>
        <p class="note">logo支持jpg、jpeg、png格式内容；建议大小300px*300px图片大小不得大于3M</p>
      </el-form-item>
      <el-form-item label="公司名称:" prop="companyName">
        <el-input
          type="textarea"
          autosize
          v-model="form.companyName"
          placeholder="请输入公司名称"
          style="width:226px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="客服电话:" prop="phone">
        <!-- <el-input v-model="form.phone" placeholder="区号" style="width:70px;"></el-input>
        ——-->
        <el-input v-model="form.phone" placeholder="请输入手机号，不填区号" style="width:226px;"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱:" prop="companyEmail">
        <el-input v-model="form.companyEmail" placeholder="请输入公司邮箱" style="width:226px;"></el-input>
      </el-form-item>
      <el-form-item label="联系地址:" prop="sendAddress">
        <el-input v-model="form.sendAddress" @change="handleChangeAddress" style="width:226px;" placeholder="请输入并点击搜索图标确定联系地址" />
        <DialogMapSearch @getMapClickPoi="getMapClickPoi" :sendAddress="form.sendAddress"></DialogMapSearch>
        <!-- <el-button class="search-map" @click="searchMap" plain>搜索地图<i class="el-icon-search"></i></el-button> -->
      </el-form-item>
      <!-- <el-form-item label="详细地址:" prop="address">
        <el-input v-model="form.address" style="width:300px;" placeholder="请输入补充地址信息，非必填项" />
      </el-form-item> -->
      <!-- <el-form-item label="店铺简介:" prop="shopIntroduce">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.shopIntroduce"
          style="width:300px;"
        ></el-input>
      </el-form-item> -->
      <h2>店铺渠道</h2>
      
      <el-form-item prop="channel">
        <el-checkbox-group v-model="form.channel">
          <el-checkbox :label="1" disabled name="channel">微信公众号</el-checkbox>
          <el-checkbox :label="2" name="channel">微信小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item class="btn">
        <el-button class="prev">上一步</el-button> 
        <el-button
          class="next"
          type="primary"
          @click="onSubmit('form')"
          v-loading="loading"
        >下一步</el-button>
      </el-form-item>
      <div v-show="showShop" class="shop-set">
        <div class="top">{{form.shopName}}</div>
        <div class="center">{{form.shopName}}</div>
      </div>
    </el-form>
    <!-- map -->
    <!-- 动态弹窗 -->
    <component
      v-if="dialogVisible"
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      @imageSelected="imageSelected"
    ></component>
  </div>
</template>
<script>
import Steps from './steps'
import shopInfo from '@/mixins/shopInfo.js'
export default {
  name: "easyShopInfo",
  props: {
    step: {
      type: Number,
      default: 2
    }
  },
  mixins: [shopInfo],
  data() {
    return {
      form: {
        channel: [1]
      }
    };
  },
  components: { Steps },
  watch: {},
  created() {
    // Promise.all([this.getOperateCategoryList()]).then(() => {
      this.getShopInfo();
    // });
  },
  mounted() {
  },
  methods: {
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

.shopInfo {
  width: 100%;
  background: #fff;
  padding: 20px;
  h1 {
    font-size: 14px;
    color: #3d434a;
    font-weight: 500;
    margin-bottom: 30px;
  }
  .map {
    position:absolute;
    right: -20px;
    top: 0;
    padding: 20px;
    width: calc(100% - 580px);
    height: 700px;
    // border-left: 1px solid #ccc;
  }
  .search-map {
    margin-left: 17px;
    width:106px;
    height:34px;
    border: 0;
    padding: 7px 12px;
    background:rgba(240,239,255,1);
    border-radius:4px;
    color:rgba(101,94,255,1);
    i {
      padding-left: 6px;
    }
  }
}
/deep/ .area-select .area-selected-trigger {
  padding: 0 0 0 10px;
}
.note {
  color: #92929b;
  font-size: 12px;
}
/deep/ .avatar-uploader {
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
}
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: inline-block;
}
/deep/ .avatar-uploader .el-upload:hover {
  border-color: #655EFF;
}
/deep/ .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}
/deep/ .avatar {
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
  position: relative;
  .uploadFont {
    position: absolute;
    color: #655eff;
    font-size: 14px;
    display: block;
    right: -58px;
    bottom: -8px;
    cursor: pointer;
  }
}
.avatar img,
-moz-img {
  width: 80px;
  height: 80px;
  max-width: 80px;
  max-height: 80px;
  object-fit: fill;
  display: inline-block;
}
.-moz-logo_img,
.logo_img {
  width: 80px;
  height: 80px;
  max-width: 80px;
  max-height: 80px;
  object-fit: fill;
  display: inline-block;
  border:1px dashed #e6e6e6;
}
.shopInfo-show {
  font-size: 12px;
  color: rgba(146, 146, 155, 1);
  span {
    color: rgba(101, 94, 255, 1);
    font-size: 14px;
    margin-left: 10px;
    cursor: pointer;
  }
}
/deep/ .el-form {
  position: relative;
  padding-top: 42px;
  h2 {
    font-size:16px;
    font-weight:500;
    color:rgba(68,67,75,1);
    line-height:22px;
    padding-bottom: 15px;
    padding-left: 13px;
  }
  .shop-set {
    position: absolute;
    width: 300px;
    height: 534px;
    background: url('~@/assets/images/set/shop-set.jpg') no-repeat;
    background-size: 100% 100%;
    right: 60px;
    top: 0;
    z-index: 3;
    .top {
      position: absolute;
      left: 50%;
      top: 24px;
      font-size: 16px;
      color: #000000;
      transform: translateX(-50%);
      font-weight: 400;
    }
    .center {
      position: absolute;
      left: 69px;
      top: 148px;
      font-size: 16px;
      color: #fff;
      font-weight: 600;
    }
  }
  .btn {
    padding-top:66px;
    text-align: center;
    .prev {
      margin-right: 45px;
    }
  }
}
.category-display {
  font-size: 12px;
}
</style>
