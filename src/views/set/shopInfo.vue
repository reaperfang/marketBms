/*店铺信息 */
<template>
  <div class="shopInfo">
    <h1>基本信息</h1>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商户名称:" prop="shopName">
        <el-input v-model.trim="form.shopName" style="width:200px;"></el-input>
        <p class="shopInfo-show">
          用于展示给消费者的品牌形象
          <span @mouseover="showShop = true" @mouseout="showShop = false">查看样例</span>
        </p>
      </el-form-item>
      <el-form-item label="主营类目:" prop="business">
        <!-- {{form.business}} -->
        <el-cascader
          :options="itemCatList"
          v-model="form.business"
          @change="itemCatHandleChange"
          :props="{ multiple: false, checkStrictly: true }"
          clearable
          filterable
        ></el-cascader>
        <div class="category-display" v-if="itemCatText">您当前的选择是：{{itemCatText}}</div>
      </el-form-item>
      <el-form-item
        label="创建日期:"
      >{{new Date(form.createTime*1) | formatDate('yyyy-MM-dd hh:mm:ss')}}</el-form-item>
      <el-form-item label="商户LOGO:">
        <span v-if="form.logo" class="avatar">
          <img :src="form.logo" class="logo_img" />
          <canvas ref="canvas1" width="80px" height="80px" v-show="false"></canvas>
        </span>
        <span
          class="uploadFont"
          @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'"
        >上传</span>
        <!-- <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :data="{json: JSON.stringify({cid: cid})}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>-->
        <p class="note">logo支持jpg、jpeg、png格式内容；建议大小300px*300px图片大小不得大于3M</p>
      </el-form-item>
      <el-form-item label="公司名称:" prop="companyName">
        <el-input
          type="textarea"
          autosize
          v-model="form.companyName"
          placeholder="请输入公司名称"
          style="width:200px;"
        ></el-input>
      </el-form-item>
      <el-form-item label="客服电话:" prop="phone">
        <!-- <el-input v-model="form.phone" placeholder="区号" style="width:70px;"></el-input>
        ——-->
        <el-input v-model="form.phone" placeholder="请输入手机号，不填区号" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="公司邮箱:" prop="companyEmail">
        <el-input v-model="form.companyEmail" placeholder="请输入公司邮箱" style="width:200px;"></el-input>
      </el-form-item>
      <el-form-item label="联系地址:" prop="addressCode">
        <area-cascader
          :level="1"
          :data="$pcaa"
          ref="cascaderAddr"
          v-model="form.addressCode"
          @change="handleChange"
          style="width:200px;"
        ></area-cascader>
        <!-- <el-cascader :options="cityLists" :props="cityProps" v-model="form.addressCode" expand-trigger="hover"/> -->
      </el-form-item>
      <el-form-item label="详细地址:" prop="address">
        <el-input v-model="form.address" style="width:300px;" placeholder="详细地址" />
        <el-button class="search-map" @click="searchMap" plain>搜索地图<i class="el-icon-search"></i></el-button>
      </el-form-item>
      <el-form-item label="店铺简介:" prop="shopIntroduce">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="form.shopIntroduce"
          style="width:300px;"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit('form')"
          v-permission="['设置', '店铺信息', '默认页面', '保存']"
          v-loading="loading"
        >保存</el-button>
      </el-form-item>
      <div v-show="showShop" class="shop-set">
        <div class="top">{{form.shopName}}</div>
        <div class="center">{{form.shopName}}</div>
      </div>
      <shopInfoMap class="map" ref="shopInfoMap" :address="getAddress" :scaleControl="mapStyle.scaleControl" :zoom="mapStyle.zoom" :zoomControl="mapStyle.zoomControl" :panControl="mapStyle.panControl" :center="[39.9046900000,116.4071700000]" @getMapClickPoi="getMapClickPoi"></shopInfoMap>
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
import shopInfoMap from './components/shopInfoMap'
import dialogSelectImageMaterial from "@/views/shop/dialogs/dialogSelectImageMaterial";
import axios from "axios";
export default {
  name: "shopInfo",
  data() {
    var validatePass = (rule, value, callback) => {
      let mobile = /^(13[0-9]{9})|(18[0-9]{9})|(14[0-9]{9})|(17[0-9]{9})|(15[0-9]{9})$/;
      let tel = /^\d{3,4}-?\d{7,9}$/;
      if (!tel.test(value) && !mobile.test(value)) {
        return callback(new Error("请填写联系电话(座机格式'区号-座机号码')"));
      } else {
        callback();
      }
    };
    var emailValidatePass = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;

      if (!reg.test(value)) {
        return callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    return {
      itemCatText: "",
      itemCatList: [],
      operateCategoryList: [],
      showShop: false,
      dialogVisible: false,
      currentDialog: "",
      form: {
        shopName: "",
        logo: "",
        logoCircle: "",
        phone: "",
        addressCode: "",
        address: "",
        shopIntroduce: "",
        business: "",
        itemCat: "",
        sellCategoryId: "",
        sellCategory: "",
        companyName: "",
        companyEmail: ""
      },
      rules: {
        shopName: [
          { required: true, message: "请输入商户名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ],
        addressCode: [
          { required: true, message: "请输入联系地址", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        shopIntroduce: [
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          }
        ],
        business: [
          { required: true, message: "请选择主营类目", trigger: "change" }
        ],
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在 1 到 30 个字符", trigger: "blur" }
        ],
        companyEmail: [
          { required: true, message: "请输入公司邮箱", trigger: "blur" },
          { validator: emailValidatePass, trigger: "blur" }
        ]
      },
      imageUrl: "",
      area: [],
      shopInfo: {},
      province: "",
      city: "",
      area: "",
      loading: false,
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      uploadUrlBase64: `${process.env.UPLOAD_SERVER}/web-file/file-server-base64/api_file_remote_upload.do`,
      mapStyle: {
        zoom: 12,
        zoomControl: false,
        panControl: false,
        scaleControl: false
      } // 地图配置
      //canvas:{}
    };
  },
  components: { dialogSelectImageMaterial, shopInfoMap },
  watch: {},
  computed: {
    canvas() {
      return this.$refs.canvas1;
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    getAddress() {
      return `${this.province}${this.city}${this.area}`
    }
  },
  created() {
    Promise.all([this.getOperateCategoryList()]).then(() => {
      this.getShopInfo();
    });
  },
  mounted() {},
  methods: {
    imageSelected(item) {
      this.form.logo = item.filePath;
      this.handleAvatarSuccess(item.filePath);
    },
    itemCatHandleChange(value) {
      let _value = [...value];
      let arr = this.form.business.map(id => {
        return this.operateCategoryList.find(val => val.id == id);
      });

      this.itemCatText = arr.map(val => val.name).join(" > ");
      this.form.sellCategoryId = _value.pop();
      this.form.sellCategory = arr[arr.length - 1].name;
      console.log('---itemCatHandleChange---')
    },
    // 获取商品类目列表
    getOperateCategoryList() {
      return new Promise((resolve, reject) => {
        this._apis.goodsOperate
          .fetchCategoryList({ enable: 1 })
          .then(res => {
            let arr = this.transTreeData(res, 0);
            this.operateCategoryList = res;
            this.itemCatList = arr;
            resolve(res.list);
          })
          .catch(error => {
            this.$message.error(error);
            reject(error);
          });
      });
    },
    transTreeData(data, pid) {
      var result = [],
        temp;
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId == pid) {
          var obj = {
            categoryName: data[i].name,
            id: data[i].id,
            parentId: data[i].parentId,
            level: data[i].level,
            sort: data[i].sort,
            image: data[i].image,
            enable: data[i].enable,
            label: data[i].name,
            value: data[i].id
          };
          temp = this.transTreeData(data, data[i].id);
          if (temp.length > 0) {
            obj.children = temp;
          }
          result.push(obj);
        }
      }
      return result;
    },
    // 获取类目
    getCategoryInfoIds(arr, id) {
      try {
        let parentId = this.operateCategoryList.find(val => val.id == id)
          .parentId;

        arr.unshift(id + "");

        if (parentId && parentId != 0) {
          this.getCategoryInfoIds(arr, parentId);
        }
      } catch (e) {
        console.error(e);
      }
    },
    handleChange() {
      this.province = this.$pcaa[86][this.form.addressCode[0]];
      this.city = this.$pcaa[this.form.addressCode[0]][
        this.form.addressCode[1]
      ];
      this.area = this.$pcaa[this.form.addressCode[1]][
        this.form.addressCode[2]
      ];
    },

    getShopInfo() {
      let id = this.cid;
      this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
          let itemCatAr = [];

          this.getCategoryInfoIds(itemCatAr, response.sellCategoryId);
          let _arr = itemCatAr.map(id => {
            return this.operateCategoryList.find(val => val.id == id);
          });
          this.itemCatText = _arr.map(val => val.name).join(" > ");

          this.form = Object.assign({}, response, {
            business: itemCatAr
          });
          if (response.provinceCode) {
            let arr = [];
            arr.push(response.provinceCode);
            arr.push(response.cityCode);
            arr.push(response.areaCode);
            this.form.addressCode = arr;
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },

    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            let id = this.cid
            let data = {
              id:id,
              shopName:this.form.shopName,
              logo:this.form.logo,
              logoCircle:this.form.logoCircle,
              phone:this.form.phone,
              province: this.province,
              city: this.city,
              area: this.area,
              provinceCode:this.form.addressCode[0],
              cityCode:this.form.addressCode[1],
              areaCode:this.form.addressCode[2],
              address:this.form.address,
              shopIntroduce:this.form.shopIntroduce,
              sellCategoryId: this.form.sellCategoryId,
              sellCategory: this.form.sellCategory,
              companyName: this.form.companyName,
              companyEmail: this.form.companyEmail
            }
            this._apis.set.updateShopInfo(data).then(response =>{
              this.setShopName()    
              this.$store.dispatch('getShopInfo');          
            }).catch(error =>{
              this.$message.error(error);
              this.loading = false
            })
        }
      });
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
          this.$message.success("保存成功！");
          this.loading = false;
        })
        .catch(error => {});
    },

    handleAvatarSuccess(res) {
      //圆形图片处理
      var ctx = this.canvas.getContext("2d");
      let _self = this;
      var img = new Image();
      img.setAttribute("crossOrigin",'Anonymous')
      img.onload = function () {
          ctx.beginPath();
          // 绘制圆，参数（x坐标，y坐标，圆半径，起始角度，终止角度）
          ctx.arc(40, 40, 40, 0, 2*Math.PI);
          ctx.save();
          // 剪切形状
          ctx.clip();
          // 绘制头像，参数（图片资源，x坐标，y坐标，宽度，高度）
          ctx.drawImage(img, 0, 0, 80, 80);
          ctx.restore();
          ctx.closePath();
          let base64 = _self.canvas.toDataURL("image/png"); 
          let urlData = base64.substring(22, base64.length);          
          _self.uploadCircle(urlData)
      }
      img.src = res;
    },

    uploadCircle(urlData){
      axios.post(
        this.uploadUrlBase64,
        "json={\"cid\":\""+this.cid+"\", \"content\":\""+ encodeURI(urlData).replace(/\+/g,'%2B')+"\"}",
        {headers: {'Origin':location.protocol.split(':')[0]}}
      ).then((response) => {
        this.form.logoCircle = response.data.data.url
      }).catch((error) => {
        console.log(error);
      })
    },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isJPEG || isPNG)) {
        this.$message.error("上传头像图片只能是JPG、JPEG、PNG格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG || isJPEG || (isPNG && isLt2M);
    },
    // 模糊搜索地址列表
    searchMap() {
      this.$refs.shopInfoMap.handlePropSearch(this.form.address)
      this.$refs.shopInfoMap.isShowMap = true
    },
    getMapClickPoi(poi) {
      this.form.address = poi.address
    }
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
    width: 800px;
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
  .shop-set {
    position: absolute;
    width: 300px;
    height: 534px;
    background: url(../../assets/images/set/shop-set.jpg) no-repeat;
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
}
.category-display {
  font-size: 12px;
}
</style>
