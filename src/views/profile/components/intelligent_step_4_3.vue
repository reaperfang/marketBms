<template>
  <div class="base_shop">
    店铺基础信息设置
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商户名称:" prop="shopName">
        <el-input v-model.trim="form.shopName" style="width:200px;"></el-input>
        <p class="shopInfo-show">
          用于展示给消费者的品牌形象
          <span @mouseover="showShopPreview = true" @mouseout="showShopPreview = false">查看样例</span>
        </p>
      </el-form-item>
      <div class="preview_shop_pic" v-show="showShopPreview">
        <div class="top">{{form.shopName}}</div>
        <div class="center">{{form.shopName}}</div>
      </div>

      <el-form-item label="设置您的个性化短信群发签名/模板:" label-width="275px">
        <el-button type="primary" @click="linkToMessage"> 短信群发 </el-button>
      </el-form-item>

      <el-form-item label="预览并生效您的公众号首页菜单栏:" label-width="275px">
        <el-button type="primary" @click="linkToGZH"> 公众号菜单管理 </el-button>
      </el-form-item>

      <el-form-item label="客服电话:">
        <el-input v-model="form.phone" placeholder="请输入手机号，不填区号" style="width:200px;"></el-input>
      </el-form-item>

      <el-form-item label="联系地址:" prop="sendAddress">
        <el-input v-model="form.sendAddress" @change="handleChangeAddress" style="width:300px;" placeholder="请输入并点击搜索图标确定联系地址" />
        <dialog-map-search @getMapClickPoi="getMapClickPoi" :sendAddress="form.sendAddress"></dialog-map-search>
      </el-form-item>

    </el-form>

    <div class="bottom_buttons">
      <el-button @click="$emit('base-step', 'base', 2)"> 上一步 </el-button>
      <el-button type="primary" @click="completed"> 完成 </el-button>
    </div>
  </div>
</template>

<script>
  import DialogMapSearch from '@/components/mapSearchDialog'
  export default {
    name: "intelligent_base_shop",
    components: { DialogMapSearch },
    data() {
      return {
        form: {
          shopName: '',
          phone: '',
          addressCode: '',
          lat: '',
          lng: '',
          sendAddress: ''
        },
        rules: {
          shopName: { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" },
          phone: { validator: (rule, value, callback) => {
              const mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
              const tel = /^\d{3,4}-?\d{7,9}$/;
              if (!tel.test(value) && !mobile.test(value)) return callback(new Error("请填写联系电话(座机格式'区号-座机号码')"));
              else callback();
            }, trigger: "blur" }
        },
        showShopPreview: false, // 右侧预览店铺名图片
      }
    },
    methods: {
      /** 完成 */
      async completed() {
        try {
          // const res = this._apis.profile.xxx

        }catch (e) {
          this.$message.error(e.msg || '出错了，请稍后再试~');
          console.error(e)
        }
      },

      /** 跳转到 '短信群发'页面 */
      linkToMessage() {
        const routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/toolapp/paySms',applyId:'2'}});
        window.open(routeData.href, '_blank');
      },

      /** 跳转到 '公众号设置' */
      linkToGZH() {
        const routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/channelapp/wechat',applyId:'3'}});
        window.open(routeData.href, '_blank');
      },

      handleChangeAddress() {
        this.isMapChoose = false
      },

      getMapClickPoi(poi) {
        console.log('poi----getMapClickPoi', poi);
        if (!poi) return false;
        this.form.sendAddress = poi.address;
        this.tempSendAddress = poi.address;
        this.form.lat = poi.location.lat;
        this.form.lng = poi.location.lng;
        this.isMapChoose = true;
        this.form.addressCode = [poi.provinceCode, poi.cityCode, poi.areaCode];
        this.province = poi.provinceName;
        this.city = poi.cityName;
        this.area = poi.areaName;
        this.$nextTick(() => {
          this.$refs.form.validateField('sendAddress')
        })
      }

    }
  }
</script>

<style lang="scss" scoped>
  .shopInfo-show {
    font-size: 12px;
    color: $grayColor;
    span {
      color: $globalMainColor;
      font-size: 14px;
      margin-left: 10px;
      cursor: pointer;
    }
  }
  /deep/ .el-form {
    position: relative;
    .preview_shop_pic {
      position: absolute;
      width: 300px;
      height: 534px;
      background: url(../../../assets/images/set/shop-set.jpg) no-repeat;
      background-size: 100% 100%;
      right: 60px;
      top: 0;
      z-index: 3;
      .top {
        position: absolute;
        left: 50%;
        top: 25px;
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
  }
</style>
