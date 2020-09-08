<template>
  <div class="base_shop">
    <h2 class="sub_title">店铺基础信息建设</h2>

    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item label="1、店铺名称:" prop="shopName">
        <el-input v-model.trim="form.shopName" style="width:283px;"></el-input>
        <p class="shopInfo-show">
          用于展示给消费者的品牌形象
          <span @mouseover="showShopPreview = true">查看样例</span>
        </p>
      </el-form-item>
      <div class="preview_shop_pic" v-show="showShopPreview">
        <img class="bg_pic" src="" alt="">
        <span class="close" @click="showShopPreview = false"></span>
        <div class="top">{{form.shopName}}</div>
        <div class="center">{{form.shopName}}</div>
      </div>

      <el-form-item label="2、设置您的个性化短信群发签名/模板:">
        <el-button class="button-link"  @click="linkToMessage"> 短信群发 </el-button>
      </el-form-item>

      <el-form-item label="3、预览并生效您的公众号首页菜单栏:">
        <el-button class="button-link" @click="linkToGZH"> 公众号菜单管理 </el-button>
      </el-form-item>

      <el-form-item label="4、客服电话:" prop="phone">
        <el-input v-model="form.phone" placeholder="请输入手机号，不填区号" style="width:283px;"></el-input>
      </el-form-item>

      <el-form-item label="5、联系地址:" prop="sendAddress">
        <el-input v-model="form.sendAddress" @change="handleChangeAddress" style="width:283px;" placeholder="请输入和点击搜索图标确定联系地址" />
        <dialog-map-search @getMapClickPoi="getMapClickPoi" :sendAddress="form.sendAddress"></dialog-map-search>

      </el-form-item>

    </el-form>

<!--    <div class="bottom_buttons">-->
<!--      <el-button @click="$emit('base-step', 'base', 2)"> 上一步 </el-button>-->
<!--      <el-button type="primary" @click="completed"> 完成 </el-button>-->
<!--    </div>-->
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
        isMapChoose: false,  // 是否打开了地图获取了经纬度
        rules: {
          shopName: { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" },
          phone: { validator: (rule, value, callback) => {
              const mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
              // const tel = /^\d{3,4}-?\d{7,9}$/;&& !tel.test(value)
              if (value !== '' && !mobile.test(value)) return callback(new Error("请填写联系电话(座机格式'区号-座机号码')"));
              else callback();
            }, trigger: "blur" }
        },
        showShopPreview: false, // 右侧预览店铺名图片
      }
    },
    computed: {
      shopInfo() {
        return localStorage.getItem("shopInfos") ? JSON.parse(localStorage.getItem("shopInfos")) : null
      },
    },
    created() {
      this.getShopInfo();
      console.log(shopInfo);
    },
    methods: {
      /** 完成 */
      async completed() {
        try {
          const valid = await this.$refs.form.validate();
          console.log(valid);
          console.log('%c valid', 'color: deepskyblue');
        } catch (e) {
          this.$message.error('请正确填写表单');
          return
        }
        try {
          this.$emit("update-completed-loading", true);
          const params = {
            id: this.shopInfo.id,
            shopName: this.form.shopName,
            phone: this.form.phone,
            provinceCode:this.form.addressCode[0],
            cityCode:this.form.addressCode[1],
            areaCode:this.form.addressCode[2],
            sendAddress: this.form.sendAddress,
            latitude: this.form.lat,
            longitude: this.form.lng,
          };
          const result = await this._apis.set.updateShopInfo(params);
        } catch (e) {
          this.$message.error(e || '出错了，请稍后再试~');
          console.error(e)
        } finally {
          console.log("update-shopInfo: finally");
          this.$emit("update-completed-loading", false);
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

      /**  地图  */
      getMapClickPoi(poi) {
        console.log('poi----getMapClickPoi', poi);
        if (!poi) return false;
        this.form.sendAddress = poi.address;
        this.form.lat = poi.location.lat;
        this.form.lng = poi.location.lng;
        this.form.addressCode = [poi.provinceCode, poi.cityCode, poi.areaCode];
        this.province = poi.provinceName;
        this.city = poi.cityName;
        this.area = poi.areaName;
        this.$nextTick(() => {
          this.$refs.form.validateField('sendAddress')
        })
      },

      /** get店铺信息 */
      getShopInfo() {
        let id = this.cid;
        this._apis.set.getShopInfo({ id })
          .then(response => {
            this.form.shopName = response.shopName || '';
            this.form.phone = response.phone || '';
            this.form.sendAddress = response.sendAddress || '';

            if (response.provinceCode) {
              let arr = [];
              arr.push(response.provinceCode);
              arr.push(response.cityCode);
              arr.push(response.areaCode);
              this.form.addressCode = arr;
            }
            // 解决省市区名称第二次保存时，没有点选地图的重新获取地址时，省市区名称丢失问题
            this.province = response.province || this.province;
            this.city = response.city || this.city;
            this.area = response.area || this.area;
            // 经纬度
            this.form.lat = response.latitude;
            this.form.lng = response.longitude
          })
          .catch(error => {
            this.$message.error('查询失败');
          });
      },

      /** 需要重新地图选点 */
      handleChangeAddress() {
        this.isMapChoose = false
      },

    }
  }
</script>

<style lang="scss" scoped>
  .sub_title {
    font-size: 16px;
    color: $contentColor;
    margin-bottom:  20px;
  }

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
      left: 418px;
      top: 0;
      z-index: 3;
      .bg_pic {
        width: 100%;
        z-index: 1;
      }
      .top {
        position: absolute;
        left: 50%;
        top: 61px;
        font-size: 16px;
        color: #000000;
        transform: translateX(-50%);
        font-weight: 400;
      }
      .center {
        position: absolute;
        left: 69px;
        top: 177px;
        font-size: 16px;
        color: #fff;
        font-weight: 600;
      }
      .close {
        position: absolute;
        right: 20px;
        top: 15px;
        display: block;
        width: 15px;
        height: 15px;
        cursor: pointer;
      }
    }

    .button-link {
      font-size: 14px;
      border-color: $globalMainColor;
      color: $globalMainColor;
    }
  }
</style>
