/*店铺信息 */
<template>
  <div class="shopInfo">
    <steps class="steps" :step="step"></steps>
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="160px">
      <h2>店铺信息</h2>
      <el-form-item label="店铺名称:" prop="shopName">
        <el-input v-model.trim="form.shopName" placeholder="请输入店铺名称" style="width:226px;"></el-input>
         <span class="shopInfo-show">
          <!--用于展示给消费者的品牌形象 -->
          <span @mouseover="showShop = true" @mouseout="showShop = false">查看样例</span>
        </span>
      </el-form-item>
      <el-form-item label="店铺LOGO:">
        <div v-if="form.logo" class="avatar">
          <img :src="form.logo" class="logo_img" />
          <canvas ref="canvas1" width="80px" height="80px" v-show="false"></canvas>
          <div class="btn">
            <el-button @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'" class="uploadImg" size="mini" type="primary">更换图片</el-button>
          </div>
        </div>
        <div
          class="uploadFont"
           v-if="!form.logo"
          @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'"
        >
          <i class="el-icon-plus"></i>
          <p>上传图片</p>
        </div>
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
        <el-input v-model="form.phone" placeholder="请输入客服手机号" style="width:226px;"></el-input>
      </el-form-item>
      <el-form-item label="联系邮箱:" prop="companyEmail">
        <el-input v-model="form.companyEmail" placeholder="请输入联系邮箱" style="width:226px;"></el-input>
      </el-form-item>
      <el-form-item label="联系地址:" prop="sendAddress">
        <el-input v-model="form.sendAddress" @change="handleChangeAddress" style="width:226px;" placeholder="请输入联系地址" />
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
      <p class="channelPrompt">请您告诉我们您将在哪个渠道经营您的店铺：</p>
      <el-form-item prop="businessChannel" class="businessChannel">
        <el-checkbox-group v-model="form.businessChannel">
          <el-checkbox :label="2" style="margin-right:78px;" disabled name="businessChannel">微信公众号</el-checkbox>
          <el-checkbox :label="1" name="businessChannel">微信小程序</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div class="btn">
        <el-button class="prev" @click="goPrev">上一步</el-button> 
        <el-button
          class="next"
          type="primary"
          :disabled="isDisabled"
          @click="onSubmit('form')"
          v-loading="loading"
        >下一步</el-button>
      </div>
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
    };
  },
  computed: {
    isDisabled() {
      // shopName: "",
      //   logo: "",
      //   logoCircle: "",
      //   phone: "",
      //   addressCode: "",
      //   address: null,
      //   shopIntroduce: null,
      //   business: null,
      //   itemCat: "",
      //   sellCategoryId: null,
      //   sellCategory: null,
      //   companyName: "",
      //   companyEmail: null,
      //   lat: "",
      //   lng: "",
      //   sendAddress: "",
      //   businessChannel: [2]
      return !this.form.shopName || !this.form.phone || !this.form.sendAddress || !this.form.companyName || !this.form.companyEmail
    }
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
    goPrev() {
      this.$emit('getStep', 1)
    },
    updateStep() {
      const cid = this.cid;
      const step = 3
      return new Promise((resolve, reject) => {
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            setTimeout(() => {
              this.$emit('getStep', step)
            }, 500)
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
      })
    },
    setShopName() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      let name = shopInfo.shopName;
      if (name != this.form.shopName) {
        shopInfo.shopName = this.form.shopName;
      }
      this.$store
        .dispatch("setShopInfos", shopInfo)
        .then(() => {
          // this.$message.success("保存成功！");
          // this.loading = false;
        })
        .catch(error => {});
    },
    updateShopInfo() {
      // if (this.tempSendAddress !== this.form.sendAddress) {
      //   deliverServiceRadius = ''
      // }
      const data = this.getReqData()
      return new Promise((resolve, reject) => {
        this._apis.set.updateShopInfo(data).then(response =>{
          this.setShopName()    
          this.$store.dispatch('getShopInfo');    
          // this.$nextTick(()=> {
          //   this.$refs.shopInfoMap.clearSearchResultList()
          //   this.$refs.shopInfoMap.clearKeyword()
          // })
          resolve(response)
        }).catch(error =>{
          console.log('updateShopInfo:error', error)
          // this.$message.error('保存失败');
          reject(reject)
        }).finally(() => {
          // this.loading = false
        })
      })
      
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isMapChoose) {
            this.$message.error('保存失败')
            this.form.sendAddress = ''
            this.$refs.form.validateField('sendAddress')
            return false
          }
          this.loading = true
          const p1 = this.updateShopInfo()
          const p2 = this.updateStep()
          // .then(response => {
          //   this.$emit('getStep', step)
          // }).catch((err) => {
          //   console.log(err)
          // })
          Promise.all([p1, p2]).then((res) => {
            this.$message.success("保存成功！");
          }).catch(() => {
            this.$message.error('保存失败');
          })
          
        }
      });
    },
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
  .channelPrompt {
    padding-left: 100px;
    font-size:14px;
    font-weight:400;
    color:rgba(68,67,75,1);
    line-height:20px;
    padding-bottom: 15px;
  }
  .businessChannel {
    /deep/ .el-form-item__content {
      margin-left: 100px !important;
    }
  }
}
/deep/ .area-select .area-selected-trigger {
  padding: 0 0 0 10px;
}
.note {
  color:rgba(146, 146, 155, .5);
  font-size: 12px;
}
.avatar {
  display: inline-block;
  width:80px;
  height:80px;
  position: relative;
  img {
    width: 100%;
    height: 100%;
  }
  .btn {
    display: none;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background:rgba(0,0,0,.2);
    .uploadImg {
      position:absolute;
      left: 8px;
      bottom: 6px;
      width: 64px;
      padding: 5px 0;
    }
  }
  &:hover .btn {
    display: block;
  }
}
.uploadFont {
  display: inline-block;
  width:80px;
  height:80px;
  border:1px dashed rgba(182,181,200,1);
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
  p {
    text-align: center;
    font-size:14px;
    font-weight:400;
    color:rgba(146,146,155,1);
    line-height:20px;
  }
  i {
    color:#92929B;
    font-size: 30px;
  }
}
// /deep/ .avatar-uploader {
//   width: 80px;
//   height: 80px;
//   display: inline-block;
//   vertical-align: middle;
// }
// /deep/ .avatar-uploader .el-upload {
//   border: 1px dashed #d9d9d9;
//   border-radius: 6px;
//   cursor: pointer;
//   position: relative;
//   overflow: hidden;
//   display: inline-block;
// }
// /deep/ .avatar-uploader .el-upload:hover {
//   border-color: #655EFF;
// }
// /deep/ .avatar-uploader-icon {
//   font-size: 28px;
//   color: #8c939d;
//   width: 60px;
//   height: 60px;
//   line-height: 60px;
//   text-align: center;
//   position: absolute;
//   top: 10px;
//   left: 10px;
//   z-index: 10;
// }

// /deep/ .avatar {
//   width: 80px;
//   height: 80px;
//   display: inline-block;
//   vertical-align: middle;
//   position: relative;
//   .uploadFont {
//     position: absolute;
//     color: #655eff;
//     font-size: 14px;
//     display: block;
//     right: -58px;
//     bottom: -8px;
//     cursor: pointer;
//   }
// }
// .avatar img,
// -moz-img {
//   width: 80px;
//   height: 80px;
//   max-width: 80px;
//   max-height: 80px;
//   object-fit: fill;
//   display: inline-block;
// }
// .-moz-logo_img,
// .logo_img {
//   width: 80px;
//   height: 80px;
//   max-width: 80px;
//   max-height: 80px;
//   object-fit: fill;
//   display: inline-block;
//   border:1px dashed #e6e6e6;
// }
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
.form {
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
    left: 600px;
    top: 20px;
    z-index: 3;
    .top {
      position: absolute;
      left: 50%;
      top: 24px;
      font-size: 16px;
      color: #000000;
      transform: translateX(-50%);
      font-weight: 400;
      overflow: hidden;
      width: 150px;
      height: 18px;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  >.btn {
    padding-top:66px;
    text-align: center;
    .prev {
      margin-right: 45px;
      border-radius:4px;
      border:1px solid rgba(101,94,255,1);
      font-size:12px;
      font-weight:400;
      color:rgba(101,94,255,1);
    }
  }
}
.category-display {
  font-size: 12px;
}
</style>
