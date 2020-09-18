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
        <img class="bg_pic" src="../../../assets/images/shop-preview-name-example.png" alt="bgp">
        <span class="close" @click="showShopPreview = false"></span>
        <div class="top">{{form.shopName}}</div>
        <div class="center">{{form.shopName}}</div>
      </div>

      <el-form-item label="2、设置您的个性化短信群发签名/模板:">
        <el-button class="button-link"  @click="linkToMessage"> 短信群发 </el-button>
      </el-form-item>

      <el-form-item label="3、预览并生效您的公众号首页菜单栏:">
        <el-button class="button-link" @click="linkToGZH" :loading="isLoadingBindStatus"> 公众号菜单管理 </el-button>
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
    props: {
      wxAccount: 0,  // 是否绑定微信公众号  0 否  1 是
    },
    data() {
      return {
        form: {
          shopName: "",
          phone: "",
          addressCode: "",
          lat: "",
          lng: "",
          sendAddress: ""
        },
        isMapChoose: false,  // 是否打开了地图获取了经纬度, 由于可以不填，所以默认为true
        rules: {
          shopName: { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" },
          phone: { validator: (rule, value, callback) => {
              const mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
              const tel = /^\d{3,4}-?\d{7,9}$/;
              if (value !== '' && !mobile.test(value) && !tel.test(value)) return callback(new Error("请填写联系电话(座机格式'区号-座机号码')"));
              else callback();
            }, trigger: "blur" }
        },
        showShopPreview: false, // 右侧店铺名预览区
        isLoadingBindStatus: false,
      }
    },
    computed: {
      shopInfos() {
        return localStorage.getItem("shopInfos") ? JSON.parse(localStorage.getItem("shopInfos")) : null
      }
    },
    created() {
      this.getShopInfo();
    },
    methods: {
      /** 完成 */
      async completed() {
        try {
          const valid = await this.$refs.form.validate();
        } catch (e) {
          this.$message.error("请正确填写表单");
          return
        }
        if(this.form.sendAddress !== "" && !this.isMapChoose) {
          this.$message.error("保存失败");
          this.form.sendAddress = "";
          return
        }

        try {
          this.$emit("update-completed-loading", true);
          const params = {
            id: this.shopInfos.id,
            shopName: this.form.shopName,
            phone: this.form.phone,
            provinceCode: this.form.addressCode[0],
            cityCode: this.form.addressCode[1],
            areaCode: this.form.addressCode[2],
            sendAddress: this.form.sendAddress,
            latitude: this.form.lat,
            longitude: this.form.lng,
          };
          const formResult = await this._apis.set.updateShopInfo(params);
          // changeStep 更改步骤 1 选择行业 2 预览模板 3 启用模板 4 基础建设
          // status 状态 0 未完成 1 已完成
          const stepResult = await this._apis.profile.intelligentUpdateStep({changeStep: 4, status: 1});
          // 店铺名更新
          let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
          if (shopInfo.shopName !== this.form.shopName) shopInfo.shopName = this.form.shopName;
          let setRes = await this.$store.dispatch("setShopInfos", shopInfo);
          await this.$store.dispatch('getShopInfo');
          // 跳转到概况页
          this.$router.push("/profile/profile");

        } catch (e) {
          this.$message.error(e || "出错了，请稍后再试~");
          console.error(e)
        } finally {
          console.log("update-shopInfo: finally");
          this.$emit("update-completed-loading", false);
        }
      },

      // 校验对象 所有的key对应的value是否为空
      isAllValueEmpty(obj) {
        let emptyCount = 0;
        for (const key in obj) {
          if(obj[key] === "") {emptyCount ++}
        }
        if(Object.values(obj).length === emptyCount) return true;
        else return false;
      },

      /** 跳转到 '短信群发'页面 */
      linkToMessage() {
        const routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/toolapp/paySms',applyId:'2'}});
        window.open(routeData.href, '_blank');
      },

      /** 跳转到 '公众号设置' */
      async linkToGZH() {
        try {
          if(this.wxAccount === 1) { // 已绑定，去 "自定义菜单" 应用
            let routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/channelapp/custommenu',applyId:'3'}});
            window.open(routeData.href, '_blank');
            return
          }
          this.isLoadingBindStatus = true;
          // 请求接口 获取最新的状态
          let bindResult = await this._apis.profile.getwxBindStatus({ id: this.shopInfos.id });

          // 更新父组件状态，达到同步兄弟组件状态
          this.$emit('wechat-status', {bindWechatAccount: bindResult.bindWechatAccount, bindWechatApplet: bindResult.bindWechatApplet});

          this.isLoadingBindStatus = false;

          if(bindResult.bindWechatAccount === 0){ // 未绑定，去 "自定义菜单" 的上一级菜单
            let routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/channelapp/wechat',applyId:'3'}});
            window.open(routeData.href, '_blank');
          } else {  // 已绑定，去 "自定义菜单" 应用
            let routeData =  this.$router.resolve({path:'/apply',query:{paths:'/application/channelapp/custommenu',applyId:'3'}});
            window.open(routeData.href, '_blank');
          }
        }catch (e) {
          this.$message.error(e || "出错了，请稍后再试~");
          console.log(e);
        }
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
        this.isMapChoose = true;
        this.$nextTick(() => {
          this.$refs.form.validateField('sendAddress')
        })
      },

      /** get店铺信息 */
      async getShopInfo() {
        /*本地拿到的会有旧的数据， 先不用了， 直接请求接口*/
        // this.form.shopName = this.shopInfos.shopName || '';
        // this.form.phone = this.shopInfos.phone || '';
        // this.form.sendAddress = this.shopInfos.sendAddress || '';
        // this.province = this.shopInfos.province || this.province;
        // this.city = this.shopInfos.city || this.city;
        // this.area = this.shopInfos.area || this.area;
        // this.form.addressCode = this.shopInfos.provinceCode ? [ this.shopInfos.provinceCode, this.shopInfos.cityCode, this.shopInfos.areaCode ] : '';
        // this.form.lat = this.shopInfos.latitude || "";
        // this.form.lng = this.shopInfos.longitude || "";
        try {
          let id = this.shopInfos.id;
          let result = await this._apis.set.getShopInfo({ id });
          this.form.shopName = result.shopName || "";
          this.form.phone = result.phone || "";
          this.form.sendAddress = result.sendAddress || "";
          this.province = result.province || "";
          this.city = result.city || "";
          this.area = result.area || "";
          if (result.provinceCode) {
            let arr = [];
            arr.push(result.provinceCode);
            arr.push(result.cityCode);
            arr.push(result.areaCode);
            this.form.addressCode = arr;
          }
          // 经纬度
          this.form.lat = result.latitude;
          this.form.lng = result.longitude;
          this.isMapChoose = true;
        }catch (e) {
          this.$message.error(e || '查询失败');
        }

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
    .el-form {
    position: relative;

    .preview_shop_pic {
      position: absolute;
      width: 342px;
      left: 395px;
      top: 0;
      z-index: 3;
      .bg_pic {
        width: 100%;
        z-index: 1;
      }
      .top {
        position: absolute;
        left: 50%;
        top: 76px;
        font-size: 16px;
        color: #000000;
        transform: translateX(-50%);
        font-weight: 400;
      }
      .center {
        position: absolute;
        left: 79px;
        top: 223px;
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
