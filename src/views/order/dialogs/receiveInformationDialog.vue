<template>
  <DialogBase
    :visible.sync="visible"
    @submit="submit"
    :title="title"
    width="640px"
    :showFooter="showFooter"
  >
    <div class="receive-information-dialog" v-if="sendGoods == 'send'">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="发货人姓名" prop="sendName">
          <el-input v-model="ruleForm.sendName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="发货人电话" prop="sendPhone">
          <el-input v-model="ruleForm.sendPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="发货地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入并点击搜索图标确定发货地址" @input="changeAddress">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searshMap"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="sendDetail">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入补充地址信息，必填项"
            maxlength="100"
            v-model="ruleForm.sendDetail"
          ></el-input>
        </el-form-item>
        <map-search
          ref="mapSearch"
          :address="getAddress"
          :boundary="boundary"
          :scaleControl="mapStyle.scaleControl"
          :zoom="mapStyle.zoom"
          :zoomControl="mapStyle.zoomControl"
          :panControl="mapStyle.panControl"
          :center="center"
          @getMapClickPoi="getMapClickPoi"
          :isInitSearch="true"
        ></map-search>
        <div class="footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button @click="submit('ruleForm')" type="primary">确定</el-button>
        </div>
      </el-form>
    </div>
    <div class="receive-information-dialog" v-else>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="收货人姓名" prop="receivedName">
          <el-input v-model="ruleForm.receivedName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="收货人电话" prop="receivedPhone">
          <el-input v-model="ruleForm.receivedPhone" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="收货地址" prop="address">
          <el-input v-model="ruleForm.address" placeholder="请输入并点击搜索图标确定收货地址" @input="changeAddress">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searshMap"></i>
          </el-input>
        </el-form-item>
        <el-form-item label="详细地址" prop="receivedDetail">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入补充地址信息，必填项"
            maxlength="100"
            v-model="ruleForm.receivedDetail"
          ></el-input>
        </el-form-item>
        <map-search
          ref="mapSearch"
          class="map"
          :address="getAddress"
          :boundary="boundary"
          :scaleControl="mapStyle.scaleControl"
          :zoom="mapStyle.zoom"
          :zoomControl="mapStyle.zoomControl"
          :panControl="mapStyle.panControl"
          :center="center"
          @getMapClickPoi="getMapClickPoi"
          :isInitSearch="true"
        ></map-search>
        <div class="footer">
          <el-button @click="visible = false">取消</el-button>
          <el-button @click="submit('ruleForm')" type="primary">确定</el-button>
        </div>
      </el-form>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import mapSearch from "@/components/mapSearch";

export default {
  data() {
    var sendNameValidator = (rule, value, callback) => {
      if (!this.ruleForm.sendName) {
        callback(new Error("发货人姓名不能为空"));
      } else {
        if (/^\s+$/.test(this.ruleForm.sendName)) {
          callback(new Error("发货人姓名不能为空白字符"));
        } else {
          if(this.ruleForm.sendName.length > 50) {
            callback(new Error("发货人姓名不能超过50个字符"));
          }else if(!/^[a-zA-Z0-9\s\u4e00-\u9fa5]*$/.test(this.ruleForm.sendName)){
            callback("发货人姓名中含有特殊字符请修改");
          }else {
            callback();
          }
        }
      }
    };
    var receivedNameValidator = (rule, value, callback) => {
      if (!this.ruleForm.receivedName) {
        callback(new Error("收货人姓名不能为空"));
      } else {
        if (/^\s+$/.test(this.ruleForm.receivedName)) {
          callback(new Error("收货人姓名不能为空白字符"));
        } else {
          if(this.ruleForm.receivedName.length > 50) {
            callback(new Error("收货人姓名不能超过50个字符"));
          }else if(!/^[a-zA-Z0-9\s\u4e00-\u9fa5]*$/.test(this.ruleForm.receivedName)){
            callback("收货人姓名中含有特殊字符请修改");
          }else {
            callback();
          }
        }
      }
    };
    var sendPhoneValidator = (rule, value, callback) => {
      if (!this.ruleForm.sendPhone) {
        callback(new Error("发货人电话不能为空"));
      } else {
        if (!/^\d{11}$/.test(this.ruleForm.sendPhone)) {
          callback(new Error("电话格式错误"));
        } else {
          callback();
        }
      }
    };
    var receivedPhoneValidator = (rule, value, callback) => {
      if (!this.ruleForm.receivedPhone) {
        callback(new Error("收货人电话不能为空"));
      } else {
        if (!/^\d{11}$/.test(this.ruleForm.receivedPhone)) {
          callback(new Error("电话格式错误"));
        } else {
          callback();
        }
      }
    };
    var sendDetailValidator = (rule, value, callback) => {
      if (!this.ruleForm.sendDetail) {
        callback(new Error("详细地址不能为空"));
      } else {
        if (/^\s+$/.test(this.ruleForm.sendDetail)) {
          callback(new Error("详细地址不能为空白字符"));
        } else {
          callback();
        }
      }
    };
    var receivedDetailValidator = (rule, value, callback) => {
      if (!this.ruleForm.receivedDetail) {
        callback(new Error("详细地址不能为空"));
      } else {
        if (/^\s+$/.test(this.ruleForm.receivedDetail)) {
          callback(new Error("详细地址不能为空白字符"));
        } else {
          callback();
        }
      }
    };
    return {
      ruleForm: {
        receivedName: "",
        receivedPhone: "",
        receivedDetail: "",
        sendName: "",
        sendPhone: "",
        sendDetail: "",
        address: "",
        addressCode: "",
        lat: "",
        lng: "",
        tencentCode: ""
      },
      rules: {
        receivedName: [{ validator: receivedNameValidator, trigger: "blur" }],
        receivedPhone: [{ validator: receivedPhoneValidator, trigger: "blur" }],
        // receivedDetail: [
        //   { validator: receivedDetailValidator, trigger: "blur" }
        // ],
        address: [
          { required: true, message: "请选择收货地址", trigger: "blur" }
        ],
        sendDetail: [
          { required: true, message: "请输入补充地址信息", trigger: "blur" }
        ],
        receivedDetail: [
          { required: true, message: "请输入补充地址信息", trigger: "blur" }
        ],

        sendName: [{ validator: sendNameValidator, trigger: "blur" }],
        sendPhone: [{ validator: sendPhoneValidator, trigger: "blur" }],
        //sendDetail: [{ validator: sendDetailValidator, trigger: "blur" }]
      },
      showFooter: false,
      address: "北京市大兴区亦庄经济开发区地盛北街1号",
      province: "",
      city: "",
      area: "",
      center: [39.90469, 116.40717],
      mapStyle: {
        zoom: 12,
        zoomControl: false,
        panControl: false,
        scaleControl: false
      },
      boundary: "",
      submitFlag:false
    };
  },
  created() {
    this.getDetail();
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.getDetail();
      }
    }
  },
  methods: {
    changeAddress(){
      this.submitFlag = false;
    },
    getMapClickPoi(poi, tencentCode) {
      console.log(poi);
      this.submitFlag = true
      this.ruleForm.provinceCode = poi.provinceCode;
      this.ruleForm.cityCode = poi.cityCode;
      this.ruleForm.areaCode = poi.areaCode;
      this.ruleForm.provinceName = poi.provinceName;
      this.ruleForm.cityName = poi.cityName;
      this.ruleForm.areaName = poi.areaName;
      this.ruleForm.address = poi.address;
      this.ruleForm.lat = poi.location.lat;
      this.ruleForm.lng = poi.location.lng;
      this.ruleForm.tencentCode = tencentCode;
    },
    searshMap(poi) {
      this.$refs.mapSearch.handlePropSearch(this.ruleForm.address);
    },
    getDetail() {
      //如果是发货，则回显对应发货的信息
      if (this.sendGoods == "send") {
        this.submitFlag = !!this.data.sendLongitude;
        this.ruleForm = {
          provinceCode: this.data.sendProvinceCode,
          provinceName: this.data.sendProvinceName,
          cityCode: this.data.sendCityCode,
          cityName: this.data.sendCityName,
          areaCode: this.data.sendAreaCode,
          areaName: this.data.sendAreaName,
          sendName: this.data.sendName,
          sendPhone: this.data.sendPhone,
          sendDetail: this.data.sendDetail,
          address: this.data.sendAddress,
          lat: this.data.sendLatitude,
          lng: this.data.sendLongitude,
          tencentCode: this.data.sendAreaCode
        }
        if(this.data.sendLongitude){
          this.center = [this.data.sendLatitude, this.data.sendLongitude];
          this.$nextTick(() => {
            this.searshMap();
          })
        }
        
      } else { //如果是收货，订单详情处也是收货
        this.submitFlag = !!this.data.receivedLongitude;
        this.ruleForm = {
          provinceCode: this.data.receivedProvinceCode,
          provinceName: this.data.receivedProvinceName,
          cityCode: this.data.receivedCityCode,
          cityName: this.data.receivedCityName,
          areaCode: this.data.receivedAreaCode,
          areaName: this.data.receivedAreaName,
          receivedName: this.data.receivedName,
          receivedPhone: this.data.receivedPhone,
          receivedDetail: this.data.receivedDetail,
          address: this.data.receiveAddress,
          lat: this.data.receivedLatitude,
          lng: this.data.receivedLongitude,
          tencentCode: this.data.receivedAreaCode
        }
        if(this.data.receivedLongitude){
          this.center = [this.data.receivedLatitude, this.data.receivedLongitude];
          this.$nextTick(() => {
            this.searshMap();
          })
        }
      }
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
        if(this.submitFlag == false){
            this.$message.error("请在地图上标记位置!");
            return false;
          }


          if (this.sendGoods && !this.ajax) {
            let obj = {};

            if (this.sendGoods == "received") {
              obj = {
                receivedProvinceCode: this.ruleForm.provinceCode,
                receivedProvinceName: this.ruleForm.provinceName,
                receivedCityCode: this.ruleForm.cityCode,
                receivedCityName: this.ruleForm.cityName,
                receivedAreaCode: this.ruleForm.areaCode,
                receivedAreaName: this.ruleForm.areaName,
                receiveAddress: this.ruleForm.address,
                receivedDetail: this.ruleForm.receivedDetail,
                receivedPhone: this.ruleForm.receivedPhone,
                receivedName: this.ruleForm.receivedName,
                receivedLat: this.ruleForm.lat,
                receivedLng: this.ruleForm.lng
              };
            } else if (this.sendGoods == "send") {

              obj = {
                sendProvinceCode: this.ruleForm.provinceCode,
                sendProvinceName: this.ruleForm.provinceName,
                sendCityCode: this.ruleForm.cityCode,
                sendCityName: this.ruleForm.cityName,
                sendAreaCode: this.ruleForm.areaCode,
                sendAreaName: this.ruleForm.areaName,
                sendAddress: this.ruleForm.address,
                sendDetail: this.ruleForm.sendDetail,
                sendPhone: this.ruleForm.sendPhone,
                sendName: this.ruleForm.sendName,
                sendLat: this.ruleForm.lat,
                sendLng: this.ruleForm.lng
              };

              // this._apis.order
              //   .addSendGoodsAddress({
              //     cid: this.cid,
              //     sendAddress: this.ruleForm.address,
              //     sendDetail: this.ruleForm.sendDetail,
              //     sendPhone: this.ruleForm.sendPhone,
              //     sendName: this.ruleForm.sendName,
              //     addressCode: this.ruleForm.addressCode,
              //     sendLat: this.ruleForm.lat,
              //     sendLng: this.ruleForm.lng
              //   })
              //   .then(res => {
              //     this.$emit("submit", obj);
              //     this.visible = false;
              //     this.$message.success("修改成功！");
              //   })
              //   .catch(error => {
              //     this.visible = false;
              //     this.$message.error(error);
              //   });
            }
            this.$emit("submit", obj);
            this.visible = false;
            return;
          }
          let params

          params = {
            // id:
            //   typeof this.data == "string"
            //     ? this.data
            //     : this.$route.query.orderId || this.$route.query.id,
            //   receivedProvinceCode: this.ruleForm.provinceCode,
            //   receivedProvinceName: this.ruleForm.provinceName,
            //   receivedCityCode: this.ruleForm.cityCode,
            //   receivedCityName: this.ruleForm.cityName,
            //   receivedAreaCode: this.ruleForm.areaCode,
            //   receivedAreaName: this.ruleForm.areaName,
            //   receiveAddress: this.ruleForm.address,
            //   receivedDetail: this.ruleForm.receivedDetail,
            //   receivedPhone: this.ruleForm.receivedPhone,
            //   receivedName: this.ruleForm.receivedName,
            //   receivedLat: this.ruleForm.lat,
            //   receivedLng: this.ruleForm.lng
            [this.sendGoods == 'send' ? 'sendName' : 'receivedName']: this.sendGoods == 'send' ? this.ruleForm.sendName : this.ruleForm.receivedName,
            [this.sendGoods == 'send' ? 'sendPhone' : 'receivedPhone']: this.sendGoods == 'send' ? this.ruleForm.sendPhone : this.ruleForm.receivedPhone,
            isOrderAfter: this.$route.query.afterSale ? true : false,
            tencentCode: this.ruleForm.tencentCode,  
            [this.sendGoods == 'send' ? 'sendAddress' : 'receiveAddress']: this.ruleForm.address,
            [this.sendGoods == 'send' ? 'sendDetail' : 'receivedDetail']: this.sendGoods == 'send' ? this.ruleForm.sendDetail : this.ruleForm.receivedDetail,
            [this.sendGoods == 'send' ? 'sendLatitude': 'receivedLatitude']: this.ruleForm.lat,
            [this.sendGoods == 'send' ? 'sendLongitude': 'receivedLongitude']: this.ruleForm.lng
          }
          if(this.$route.name == 'deliverGoods'){//发货页面
            if(!this.$route.query.afterSale) {
              params = Object.assign({}, params, {
                orderIds: (this.$route.query.ids || this.$route.query.id).split(',').map(id => id),
                orderSendInfoIds: this.$route.query._ids ? this.$route.query._ids.split(',').map(id => id) : this._ids,
              })
            } else {
               params = Object.assign({}, params, {
                orderAfterIds: (this.$route.query.ids || this.$route.query.id).split(',').map(id => id)
              })
            }
          }else if(this.$route.name == 'orderDetail'){//订单详情页
              params = Object.assign({}, params, {
                orderIds: [this.data.id],
                orderId:this.data.id,
                isSyncUpdateOrder:1
              })
          } else {
            if(!this.$route.query.afterSale) {
              params = Object.assign({}, params, {
                orderIds: (this.$route.query.ids || this.$route.query.id).split(',').map(id => id),
                orderSendInfoIds: this.$route.query._ids ? this.$route.query._ids.split(',').map(id => id) : this._ids,
              })
            } else {
               params = Object.assign({}, params, {
                orderAfterIds: (this.$route.query.ids || this.$route.query.id).split(',').map(id => id),
                //orderId: this.$route.query._ids ? this.$route.query._ids : this._ids
              })
            }
          }
          try {
            if(this.$refs.mapSearch.poi) {
              params.tencentCode = this.$refs.mapSearch.poi.ad_info.adcode
            } else {
              params.tencentCode = this.$refs.mapSearch.pois[0].ad_info.adcode
            }
          } catch(e) {
            console.error(e)
          }
          this._apis.order
            .updateReceiveAndSend(params)
            .then(res => {
            if(this.$route.name == 'deliverGoods') {
                if(this.list) {
                    this.$emit('getDetail', this.multipleSelection, JSON.parse(JSON.stringify(this.list)))
                  } else {
                    this.$emit('getDetail', this.multipleSelection)
                  }
              } else {
                if(this.list) {
                    this.$emit('getDetail', this.multipleSelection, JSON.parse(JSON.stringify(this.list)))
                  } else {
                    this.$emit('getDetail', this.multipleSelection)
                  }
              } 
              this.$emit('submit');
              this.visible = false;
              this.$message.success("修改成功！");
            })
            .catch(error => {
              this.visible = false;
              this.$message.error(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showMap() {
      this.$nextTick(() => {
        this.$refs.mapSearch.isShowMap = true;
      });
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    contentText() {
      return "是否确认删除？";
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    getAddress() {
      return `${this.province}${this.city}${this.area}`;
    }
  },
  mounted() {
    this.showMap();
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    },
    sendGoods: {
      type: String
    },
    title: {
      type: String,
      default: "修改收货信息"
    },
    ajax: {
      type: Boolean,
      default: false
    },
    _ids: {
      type: Array,
      default: () => []
    },
    multipleSelection: {

    },
    list: {

    }
  },
  components: {
    DialogBase,
    mapSearch
  }
};
</script>
<style lang="scss" scoped>
.receive-information-dialog {
  height: 670px;
  .wrapper {
    height: 300px;
    width: 100%;
    margin-bottom: 40px;
    /deep/ .result {
      .search {
        height: 220px;
        width: 260px;
      }
      .info-div {
        max-height: 200px;
        overflow: auto;
    }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
  }
}
/deep/.el-input {
  width: 100% !important;
}
/deep/ .receive-information-dialog .area-select.large {
  width: 100% !important;
}
/deep/ .el-textarea {
  width: 100% !important;
  height: 96px !important;
  textarea {
    height: 96px !important;
  }
}
/deep/ label[for="sendPhone"]::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
/deep/ label[for="receivedPhone"]::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
/deep/ label[for="sendName"]::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
/deep/ label[for="receivedName"]::before {
  content: "*";
  color: #f56c6c;
  margin-right: 4px;
}
/deep/ .isIE {
  .area-select {
    .area-selected-trigger {
      display: inline;
    }
  }
  .area-select.large {
    width: 100%;
  }
}
/deep/.el-form-item {
  margin-bottom: 24px;
}
/deep/ .el-dialog {
  border-radius:3px!important;
  border:1px solid rgba(204,204,204,1);
}
.footer /deep/ .el-button {
  order: 1;
  &.el-button--primary {
    order: 0;
    margin: 0 10px 0 0;
  }
}
</style>
