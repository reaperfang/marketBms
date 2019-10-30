<template>
  <div class="l_container">
    <p class="l_title">等级信息：</p>
    <br />
    <div class="clearfix">
      <span class="icon_title">等级图标：</span>
      <img v-if="ruleForm.levelImageUrl" :src="ruleForm.levelImageUrl" alt class="level_icon" />
      <img v-else src="../../assets/images/client/icon_level.png" alt class="level_icon" />
      <el-upload
        class="avatar-uploader"
        :action="uploadUrl"
        :show-file-list="false"
        :limit="1"
        :data="{json: JSON.stringify({cid: cid})}"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-button size="small" class="border_btn upload_btn">上传图片</el-button>
      </el-upload>
      <span class="l_warn fl" style="margin: 16px 0 0 32px">大小不超过2M</span>
    </div>
    <div class="level_order">
      <span class="red">*</span>
      等级序号：{{ levelName }}
      <span class="l_warn">（等级序号为等级在系统的排序，不展示给用户）</span>
    </div>
    <div class="form_container">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right">
        <el-form-item label="等级称谓：" prop="name">
          <div class="input_wrap">
            <el-input v-model="ruleForm.name" placeholder="请输入等级名称，比如普通会员" :maxLength="15"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="等级说明：" style="margin-left: 9px">
          <div class="input_wrap">
            <el-input v-model="ruleForm.explain" placeholder="请输入等级描述" :maxLength="25"></el-input>
          </div>
        </el-form-item>
        <div class="line"></div>
        <p class="l_title" style="margin-left: -19px;">升级条件：</p>
        <br />
        <el-form-item v-if="getIndex(this.conditionList,'完善信息') !== -1">
          <el-checkbox v-model="condition1" :disabled="disabled1" class="fl">完善信息</el-checkbox>
          <span class="fl marl20" v-if="condition1">已选：</span>
          <div class="fl" v-if="condition1">
            <p v-for="item in conInfos" :key="item">{{item}}</p>
          </div>
          <p
            style="margin-left:20px;"
            class="fl addMainColor pointer marl20"
            @click="openDialog"
          >选择变更</p>
          <!-- <p style="margin-left:115px;">姓名 <span class="addMainColor marL20 pointer" @click="openDialog">选择变更</span></p> -->
        </el-form-item>
        <el-form-item>
          <div class="radio_line" v-if="getIndex(this.conditionList,'消费金额满') !== -1">
            <el-radio v-model="condition2" label="消费金额满" @change="handleCheck1">消费金额满：</el-radio>
            <div class="input_wrap2">
              <el-input placeholder="请输入数字" v-model="xfjem" @keyup.native="checkZero($event, xfjem,'xfjem')" ></el-input>
            </div>
            <span>元</span>
            <span>即可升级</span>
          </div>
          <div class="radio_line" v-if="getIndex(this.conditionList,'消费次数满') !== -1">
            <el-radio v-model="condition2" label="消费次数满" @change="handleCheck2">消费次数满：</el-radio>
            <div class="input_wrap2">
              <el-input placeholder="请输入数字" v-model="xfcsm" @keyup.native="checkZero($event, xfcsm,'xfcsm')"></el-input>
            </div>
            <span>次</span>
            <span>即可升级</span>
          </div>
          <div class="radio_line" v-if="getIndex(this.conditionList,'积分获得满') !== -1">
            <el-radio v-model="condition2" label="积分获得满">积分获得满：</el-radio>
            <div class="input_wrap2">
              <el-input placeholder="请输入数字" v-model="jfhdm" @keyup.native="checkZero($event, jfhdm,'jfhdm')"></el-input>
            </div>
            <span>分</span>
            <span>即可升级</span>
          </div>
        </el-form-item>
        <div class="line"></div>
        <p class="l_title" style="margin-left: -19px;">等级权益（最少选1个）：</p>
        <br />
        <el-form-item v-if="getIndex(this.rightsList,'满包邮') !== -1">
          <el-checkbox v-model="right1" @change="handleCheck3">满包邮</el-checkbox>
          <span class="marl20">订单金额满</span>
          <div class="input_wrap3">
            <el-input placeholder="请输入数字" v-model="mby" @keyup.native="checkZero($event, mby,'mby')"></el-input>
          </div>
          <span>包邮</span>
        </el-form-item>
        <el-form-item v-if="getIndex(this.rightsList,'会员折扣') !== -1">
          <el-checkbox v-model="right2" @change="handleCheck4">会员折扣</el-checkbox>
          <span class="marl20">享受后买商品售价</span>
          <div class="input_wrap">
            <el-input placeholder="填写数字（如：八折输入8,八五折输入8.5）" v-model="hyzk" @blur="handleBlur($event, hyzk, 'hyzk')"></el-input>
          </div>
          <span>折</span>
          <span class="l_warn">（仅对支仅持参加会员折扣的商品生效）</span>
        </el-form-item>
        <div class="line"></div>
        <p class="l_title" style="margin-left: -19px;">升级奖励（非必选，可多选）：</p>
        <br />
        <el-form-item v-if="getIndex(this.rewardList,'赠送积分') !== -1">
          <el-checkbox v-model="upgrade1" @change="handleCheck5" class="marR20">赠送积分</el-checkbox>
          <span>送</span>
          <div class="input_wrap3">
            <el-input placeholder="填写数字" v-model="zsjf" @keyup.native="checkZero($event, zsjf,'zsjf')"></el-input>
          </div>
          <span>积分</span>
        </el-form-item>
        <el-form-item v-if="getIndex(this.rewardList,'赠送红包') !== -1">
          <el-checkbox v-model="upgrade2" @change="showRedDialog" class="fl marR20">赠送红包</el-checkbox>
          <div class="giftList">
            <div v-for="(item, index) in selectedReds" :key="item.id">
              <span>{{ item.name }}</span>
              <span style="margin-left:20px" class="pointer" @click="deleteRed(index)">删除</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="getIndex(this.rewardList,'赠送赠品') !== -1">
          <el-checkbox v-model="upgrade3" @change="showGiftDialog" class="fl marR20">赠送赠品</el-checkbox>
          <div class="giftList">
            <div v-for="(item, index) in selectedGifts" :key="item.id">
              <span>{{ item.goodsName }}</span>
              <el-input-number v-model="item.number" :max="10"></el-input-number>
              <span style="margin-left:20px" class="pointer" @click="deleteGift(index)">删除</span>
            </div>
          </div>
        </el-form-item>
        <el-form-item v-if="getIndex(this.rewardList,'赠送优惠券') !== -1">
          <el-checkbox v-model="upgrade4" @change="showCouponDialog" class="fl marR20">赠送优惠券</el-checkbox>
          <div class="giftList">
            <div v-for="(item, index) in selectedCoupons" :key="item.id">
              <span>{{ item.name }}</span>
              <el-input-number v-model="item.number" :max="10"></el-input-number>
              <span style="margin-left:20px" class="pointer" @click="deleteCoupon(index)">删除</span>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn_container" style="text-align: center">
      <el-button type="primary" @click="save">保 存</el-button>
      <el-button @click="_routeTo('clientLevel')">返 回</el-button>
    </div>
    <component
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      :data="currentData"
      @getSelection="getSelection"
      @getSelectedCoupon="getSelectedCoupon"
      @getSelectedRed="getSelectedRed"
      @getSelectedInfo="getSelectedInfo"
      @changeSwitch="changeSwitch"
    ></component>
  </div>
</template>
<script type="es6">
import levelInfoDialog from "./dialogs/levelInfo/levelInfoDialog";
import giftListDialog from "./dialogs/levelInfo/giftListDialog";
import couponListDialog from "./dialogs/levelInfo/couponListDialog";
import redListDialog from "./dialogs/levelInfo/redListDialog";
export default {
  name: "levelInfo",
  components: {
    levelInfoDialog,
    giftListDialog,
    couponListDialog,
    redListDialog
  },
  data() {
    return {
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      fileList: [],
      ruleForm: {
        id: this.$route.query.id,
        name: "",
        levelImageUrl: "",
        explain: ""
      },
      rules: {
        name: [{ required: true, message: "请输入等级称谓", trigger: "blur" }]
      },
      condition1: false,
      condition2: "",
      xfjem: "",
      xfcsm: "",
      jfhdm: "",
      right1: "",
      right2: "",
      mby: "",
      hyzk: "",
      upgrade1: "",
      upgrade2: "",
      upgrade3: "",
      upgrade4: "",
      zsjf: "",
      currentDialog: "",
      currentData: {},
      dialogVisible: false,
      levelName: "",
      conditionList: [],
      rightsList: [],
      rewardList: [],
      selectedGifts: [],
      selectedCoupons: [],
      selectedReds: [],
      selectedInfos: {
        phone: true,
        name: true,
        gender: false,
        birthday: false,
        email: false,
        area: false,
        hobby: false
      },
      disabled1: false,
      conInfos: [],
      canSubmit: true,
      mapCondition: {
        "birthday": "生日", "area": "地区", "gender": "性别", "name": "姓名", "email": "邮箱", "hobby": "爱好", "phone":"绑定手机号"
      }
    };
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  methods: {
    checkZero(event,val,ele) {
      val = val.replace(/[^\d]/g,'');
      val = val.replace(/^0/g,'');
      this[ele] = val;
    },
    handleBlur(event,val,ele) {
      val = val.replace(/[^\d.]/g,'');
      val = val.replace(/\.{2,}/g,'.');
      val = val.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
      val = val.replace(/^0/g,'');
      if(val >= 10) {
        this.$notify({
          title: "警告",
          message: "只能输入10以内数字",
          type: "warning"
        });
        val = "";
      }else if(val <= 0) {
        this.$notify({
          title: "警告",
          message: "不能输入小于0数字",
          type: "warning"
        });
        val = "";
      }
      this[ele] = val;
    },
    handleCheck1() {
      if(this.condition2 == "消费金额满") {
        this.xfcsm = "";
      }
    },
    handleCheck2() {
      if(this.condition2 == "消费次数满") {
        this.xfjem = "";
      }
    },
    handleCheck3(val) {
      if(!val) {
        this.mby = "";
      }
    },
    handleCheck4(val) {
      if(!val) {
        this.hyzk = "";
      }
    },
    handleCheck5(val) {
      if(!val) {
        this.zsjf = "";
      }
    },
    handleAvatarSuccess(res, file) {
      // this.fileData = res.data
      this.ruleForm.levelImageUrl = res.data.url;
    },
    beforeAvatarUpload(file) {
      //const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //     this.$message.error('上传图片只能是 JPG 格式!');
      // }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    openDialog() {
      this.currentDialog = "levelInfoDialog";
      this.dialogVisible = true;
    },
    getLevelsInfo(id) {
      this._apis.client
        .getLevelsInfo({ id: id })
        .then(response => {
          this.levelName = response.alias;
          this.ruleForm = Object.assign({}, response);
          //用于回显升级条件
          if (this.ruleForm.levelConditionList) {
            this.ruleForm.levelConditionList.map(v => {
              if (
                v.levelConditionId == this.getId(this.conditionList, "完善信息")
              ) {
                this.condition1 = true;
                this.currentData.info = JSON.parse(v.conditionValue);
                for(let i in this.currentData.info) {
                  if(this.currentData.info[i] == true) {
                    this.conInfos.push(this.mapCondition[i]);
                  }
                }
                this.selectedInfos = this.currentData.info;
              }
              if (
                v.levelConditionId ==
                this.getId(this.conditionList, "消费金额满")
              ) {
                this.condition2 = "消费金额满";
                this.xfjem = v.conditionValue;
              }
              if (
                v.levelConditionId ==
                this.getId(this.conditionList, "消费次数满")
              ) {
                this.condition2 = "消费次数满";
                this.xfcsm = v.conditionValue;
              }
              if (
                v.levelConditionId ==
                this.getId(this.conditionList, "积分获得满")
              ) {
                this.condition2 = "积分获得满";
                this.jfhdm = v.conditionValue;
              }
            });
          }
          //用于回显等级权益
          if (this.ruleForm.rightsList) {
            this.ruleForm.rightsList.map(v => {
              if (v.rightsInfoId == this.getId(this.rightsList, "满包邮")) {
                this.right1 = true;
                this.mby = v.rightsValue;
              }
              if (v.rightsInfoId == this.getId(this.rightsList, "会员折扣")) {
                this.right2 = true;
                this.hyzk = v.rightsValue;
              }
            });
          }
          //用于回显升级奖励
          let redArr = [],
            giftArr = [],
            couponArr = [];
          if (this.ruleForm.upgradeRewardList) {
            this.ruleForm.upgradeRewardList.map(v => {
              if (
                v.upgradeRewardInfoId == this.getId(this.rewardList, "赠送积分")
              ) {
                this.upgrade1 = true;
                this.zsjf = v.giftNumber;
              }
              if (
                v.upgradeRewardInfoId == this.getId(this.rewardList, "赠送红包")
              ) {
                this.upgrade2 = true;
                this.selectedReds.push({ name: v.giftName, id: v.giftProduct,  });
                redArr.push(v.giftProduct);
              }
              if (
                v.upgradeRewardInfoId == this.getId(this.rewardList, "赠送赠品")
              ) {
                this.upgrade3 = true;
                this.selectedGifts.push({
                  id: v.giftProduct,
                  goodsName: v.giftName,
                  number: v.giftNumber
                });
                giftArr.push(v.giftProduct);
              }
              if (
                v.upgradeRewardInfoId ==
                this.getId(this.rewardList, "赠送优惠券")
              ) {
                this.upgrade4 = true;
                this.selectedCoupons.push({
                  id: v.giftProduct,
                  name: v.giftName,
                  number: v.giftNumber
                });
                couponArr.push(v.giftProduct);
              }
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changeSwitch(obj) {
      switch (obj.label) {
        case "name":
          if (obj.val) {
            this.conInfos.push("姓名");
          } else {
            let index = this.conInfos.indexOf("姓名");
            this.conInfos.splice(index, 1);
          }
          break;
        case "gender":
          if (obj.val) {
            this.conInfos.push("性别");
          } else {
            let index = this.conInfos.indexOf("性别");
            this.conInfos.splice(index, 1);
          }
          break;
        case "birthday":
          if (obj.val) {
            this.conInfos.push("生日");
          } else {
            let index = this.conInfos.indexOf("生日");
            this.conInfos.splice(index, 1);
          }
          break;
        case "email":
          if (obj.val) {
            this.conInfos.push("邮箱");
          } else {
            let index = this.conInfos.indexOf("邮箱");
            this.conInfos.splice(index, 1);
          }
          break;
        case "area":
          if (obj.val) {
            this.conInfos.push("地区");
          } else {
            let index = this.conInfos.indexOf("地区");
            this.conInfos.splice(index, 1);
          }
          break;
        case "area":
          if (obj.val) {
            this.conInfos.push("地区");
          } else {
            let index = this.conInfos.indexOf("地区");
            this.conInfos.splice(index, 1);
          }
          break;
        case "hobby":
          if (obj.val) {
            this.conInfos.push("爱好");
          } else {
            let index = this.conInfos.indexOf("爱好");
            this.conInfos.splice(index, 1);
          }
          break;
        default:
          break;
      }
    },
    getIndex(arr, val) {
      let i = arr.findIndex((value, index, arr) => {
        return value.name == val;
      });
      return i;
    },
    getId(arr, val) {
      let id = "";
      arr.map(v => {
        if (v.name == val) {
          id = v.id;
        }
      });
      return id;
    },
    //获取升级条件
    getLevelCondition() {
      this._apis.client
        .levelConditionList({ type: 0 })
        .then(response => {
          let _arr = [];
          response.map(v => {
            let _obj = {};
            _obj.name = v.name;
            _obj.id = v.id;
            _arr.push(_obj);
          });
          this.conditionList = [].concat(_arr);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取等级权益
    getRightsList() {
      this._apis.client
        .getRightsList({ rightsType: 0 })
        .then(response => {
          let _arr = [];
          response.map(v => {
            let _obj = {};
            _obj.name = v.name;
            _obj.id = v.id;
            _arr.push(_obj);
          });
          this.rightsList = [].concat(_arr);
          this.getLevelsInfo(this.$route.query.id);
        })
        .catch(error => {
          console.log(error);
        });
    },
    //获取升级奖励
    getRewardList() {
      this._apis.client
        .getRewardList({ type: 0 })
        .then(response => {
          let _arr = [];
          response.map(v => {
            let _obj = {};
            _obj.name = v.name;
            _obj.id = v.id;
            _arr.push(_obj);
          });
          this.rewardList = [].concat(_arr);
        })
        .catch(error => {
          console.log(error);
        });
    },
    showGiftDialog(val) {
      if (val) {
        this.dialogVisible = true;
        this.currentDialog = "giftListDialog";
      } else {
        this.dialogVisible = false;
        this.selectedGifts = [];
      }
    },
    showCouponDialog(val) {
      if (val) {
        this.dialogVisible = true;
        this.currentDialog = "couponListDialog";
      } else {
        this.dialogVisible = false;
        this.selectedCoupons = [];
      }
    },
    showRedDialog(val) {
      if (val) {
        this.dialogVisible = true;
        this.currentDialog = "redListDialog";
      } else {
        this.dialogVisible = false;
        this.selectedReds = [];
      }
    },
    getSelection(obj) {
      let arr = [];
      obj.selection.map(v => {
        let o = {};
        o.goodsName = v.goodsName;
        o.id = v.id;
        o.number = 1;
        arr.push(o);
      });
      this.selectedGifts = [].concat(arr);
    },
    deleteGift(index) {
      this.selectedGifts.splice(index, 1);
    },
    getSelectedCoupon(obj) {
      let arr = [];
      obj.selection.map(v => {
        let o = {};
        o.name = v.name;
        o.number = 1;
        o.id = v.id;
        arr.push(o);
      });
      this.selectedCoupons = [].concat(arr);
    },
    deleteCoupon(index) {
      this.selectedCoupons.splice(index, 1);
    },
    getSelectedRed(obj) {
      this.selectedReds = [];
      this.selectedReds.push(obj.selection);
    },
    deleteRed(index) {
      this.selectedReds.splice(index, 1);
    },
    getSelectedInfo(obj) {
      this.selectedInfos = Object.assign({}, obj);
    },
    save() {
      if (this.ruleForm.name == "") {
        this.$notify({
          title: "警告",
          message: "等级称谓不能为空",
          type: "warning"
        });
      } else {
        this.canSubmit = true;
        let formObj = {};
        let levelConditionList = [];
        if (!this.right1 && !this.right2) {
          this.$notify({
            title: "警告",
            message: "请选择一项等级权益",
            type: "warning"
          });
        }else if(this.$route.query.level !== 1 && this.condition2 == "") {
          this.$notify({
            title: "警告",
            message: "请选择升级条件",
            type: "warning"
          });
        } else {
          if (this.condition1) {
            let params1 = {};
              params1.levelConditionId = this.getId(
                this.conditionList,
                "完善信息"
              );
              params1.conditionValue = this.selectedInfos;
              params1.label = "完善信息";
              levelConditionList.push(params1);
          }
          if (this.condition2) {
            let params2 = {};
            switch (this.condition2) {
              case "消费金额满":
                params2.levelConditionId = this.getId(
                  this.conditionList,
                  "消费金额满"
                );
                if(this.xfjem == "") {
                  this.$notify({
                    title: '警告',
                    message: '请输入消费金额',
                    type: 'warning'
                  });
                  this.canSubmit = false;
                }else{
                  params2.conditionValue = this.xfjem;
                  params2.label = "消费金额满";
                }
                break;
              case "消费次数满":
                params2.levelConditionId = this.getId(
                  this.conditionList,
                  "消费次数满"
                );
                if(this.xfcsm == "") {
                  this.$notify({
                    title: '警告',
                    message: '请输入消费次数',
                    type: 'warning'
                  });
                  this.canSubmit = false;
                }else{
                  params2.conditionValue = this.xfcsm;
                  params2.label = "消费次数满";
                }
                break;
              case "积分获得满":
                params2.levelConditionId = this.getId(
                  this.conditionList,
                  "积分获得满"
                );
                if(this.jfhdm == "") {
                  this.$notify({
                    title: '警告',
                    message: '请输入积分获得',
                    type: 'warning'
                  });
                  this.canSubmit = false;
                }else{
                  params2.conditionValue = this.jfhdm;
                  params2.label = "积分获得满";
                } 
                break;
              default:
                break;
            }
            levelConditionList.push(params2);
          }
          let receiveConditionsRemarks = "";
          levelConditionList.map(v => {
            receiveConditionsRemarks += "" + v.label + v.conditionValue + ",";
          });
          receiveConditionsRemarks = receiveConditionsRemarks.replace(
            "[object Object]",
            ""
          );
          receiveConditionsRemarks = receiveConditionsRemarks.substring(0,receiveConditionsRemarks.length - 1);
          levelConditionList.map(v => {
            delete v.label;
          });
          let rightsList = [];
          if (this.right1) {
            if (this.mby == "") {
              this.$notify({
                title: "警告",
                message: "请输入满包邮数",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              let params3 = {};
              params3.rightsInfoId = this.getId(this.rightsList, "满包邮");
              params3.rightsValue = this.mby;
              params3.label = "满包邮";
              rightsList.push(params3);
            }
          }
          if (this.right2) {
            if (this.hyzk == "") {
              this.$notify({
                title: "警告",
                message: "请输入会员折扣数",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              let params4 = {};
              params4.rightsInfoId = this.getId(this.rightsList, "会员折扣");
              params4.rightsValue = this.hyzk;
              params4.label = "会员折扣";
              rightsList.push(params4);
            }
          }
          let rights = "";
          rightsList.map(v => {
            rights += "" + v.label + v.rightsValue + ",";
          });
          rights = rights.substring(0, rights.length - 1);
          rightsList.map(v => {
            delete v.label;
          });
          let upgradeRewardList = [];
          let upgradePackage = "";
          if (this.upgrade1) {
            if (this.zsjf == "") {
              this.$notify({
                title: "警告",
                message: "请输入赠送积分数",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              let params5 = {};
              params5.upgradeRewardInfoId = this.getId(
                this.rewardList,
                "赠送积分"
              );
              params5.giftNumber = this.zsjf;
              params5.label = "赠送积分";
              upgradeRewardList.push(params5);
              upgradePackage = upgradePackage + "赠送" + this.zsjf + "个积分,";
            }
          }
          if (this.upgrade2) {
            if (this.selectedReds.length == 0) {
              this.$notify({
                title: "警告",
                message: "请选择红包",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              this.selectedReds.map(v => {
                let obj = {};
                obj.upgradeRewardInfoId = this.getId(
                  this.rewardList,
                  "赠送红包"
                );
                obj.giftProduct = v.id;
                obj.giftName = v.name;
                obj.giftNumber = 1;
                obj.label = "赠送红包";
                upgradeRewardList.push(obj);
                if(!!v.hongbaoTotalMoney) {
                  upgradePackage = upgradePackage + "赠送" + v.hongbaoTotalMoney + "元红包,";
                }else{
                  upgradePackage = upgradePackage + "赠送红包,";
                }
              });
            }
          }
          if (this.upgrade3) {
            let zpNum = 0;
            if (this.selectedGifts.length == 0) {
              this.$notify({
                title: "警告",
                message: "请选择赠品",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              this.selectedGifts.map(v => {
                let obj = {};
                obj.upgradeRewardInfoId = this.getId(
                  this.rewardList,
                  "赠送赠品"
                );
                obj.giftProduct = v.id;
                obj.giftName = v.goodsName;
                obj.label = "赠送赠品";
                obj.giftNumber = v.number;
                upgradeRewardList.push(obj);
                zpNum = zpNum + v.number;
              });
              upgradePackage = upgradePackage + "赠送" + zpNum + "个赠品,";
            }
          }
          if (this.upgrade4) {
            var yhzNum = 0;
            if (this.selectedCoupons.length == 0) {
              this.$notify({
                title: "警告",
                message: "请选择优惠券",
                type: "warning"
              });
              this.canSubmit = false;
            } else {
              this.selectedCoupons.map(v => {
                let obj = {};
                obj.upgradeRewardInfoId = this.getId(
                  this.rewardList,
                  "赠送优惠券"
                );
                obj.giftProduct = v.id;
                obj.giftName = v.name;
                obj.giftNumber = v.number;
                obj.label = "赠送优惠券";
                upgradeRewardList.push(obj);
                yhzNum = yhzNum + v.number;
              });
              upgradePackage = upgradePackage + "赠送" + yhzNum + "张优惠券";
            }
          }
          upgradeRewardList.map(v => {
            if (v.label) {
              delete v.label;
            }
          });
          if(this.condition2 == "消费金额满") {
            let params = {
              level: this.$route.query.level,
              type: 0,
              levelConditionId: this.getId(this.conditionList, "消费金额满"),
              conditionValue: this.xfjem
            }
            this._apis.client.checkLevelValue(params).then((response) => {
                if(response == "no") {
                  this.$notify({
                    title: "警告",
                    message: "高会员卡等级条件数值要大于低会员卡等级的条件数值",
                    type: "warning"
                  });
                }else{
                  if(!!this.canSubmit) {
                    formObj.levelConditionList = [].concat(levelConditionList);
                    formObj.rightsList = [].concat(rightsList);
                    formObj.upgradeRewardList = [].concat(upgradeRewardList);
                    formObj.upgradePackage = upgradePackage;
                    formObj.receiveConditionsRemarks = receiveConditionsRemarks;
                    formObj.rights = rights;
                    formObj.id = this.ruleForm.id;
                    formObj.cid = this.ruleForm.cid;
                    formObj.name = this.ruleForm.name;
                    formObj.levelImageUrl = this.ruleForm.levelImageUrl;
                    formObj.explain = this.ruleForm.explain;
                    this._apis.client
                      .editLevel(formObj)
                      .then(response => {
                        this.$notify({
                          title: "成功",
                          message: "等级编辑成功",
                          type: "success"
                        });
                        this._routeTo("clientLevel");
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }
                }
              }).catch((error) => {
                console.log(error);
              })
          }else if(this.condition2 == "消费次数满") {
            let params = {
              level: this.$route.query.level,
              type: 0,
              levelConditionId: this.getId(this.conditionList, "消费次数满"),
              conditionValue: this.xfcsm
            }
            this._apis.client.checkLevelValue(params).then((response) => {
                if(response == "no") {
                  this.$notify({
                    title: "警告",
                    message: "高会员卡等级条件数值要大于低会员卡等级的条件数值",
                    type: "warning"
                  });
                }else{
                  if(!!this.canSubmit) {
                    formObj.levelConditionList = [].concat(levelConditionList);
                    formObj.rightsList = [].concat(rightsList);
                    formObj.upgradeRewardList = [].concat(upgradeRewardList);
                    formObj.upgradePackage = upgradePackage;
                    formObj.receiveConditionsRemarks = receiveConditionsRemarks;
                    formObj.rights = rights;
                    formObj.id = this.ruleForm.id;
                    formObj.cid = this.ruleForm.cid;
                    formObj.name = this.ruleForm.name;
                    formObj.levelImageUrl = this.ruleForm.levelImageUrl;
                    formObj.explain = this.ruleForm.explain;
                    this._apis.client
                      .editLevel(formObj)
                      .then(response => {
                        this.$notify({
                          title: "成功",
                          message: "等级编辑成功",
                          type: "success"
                        });
                        this._routeTo("clientLevel");
                      })
                      .catch(error => {
                        console.log(error);
                      });
                  }
                }
              }).catch((error) => {
                console.log(error);
              })
          }else{
            if(!!canSubmit) {
              formObj.levelConditionList = [].concat(levelConditionList);
              formObj.rightsList = [].concat(rightsList);
              formObj.upgradeRewardList = [].concat(upgradeRewardList);
              formObj.upgradePackage = upgradePackage;
              formObj.receiveConditionsRemarks = receiveConditionsRemarks;
              formObj.rights = rights;
              formObj.id = this.ruleForm.id;
              formObj.cid = this.ruleForm.cid;
              formObj.name = this.ruleForm.name;
              formObj.levelImageUrl = this.ruleForm.levelImageUrl;
              formObj.explain = this.ruleForm.explain;
              this._apis.client
                .editLevel(formObj)
                .then(response => {
                  this.$notify({
                    title: "成功",
                    message: "等级编辑成功",
                    type: "success"
                  });
                  this._routeTo("clientLevel");
                })
                .catch(error => {
                  console.log(error);
                });
            }
          }
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.level == "1") {
      this.condition1 = true;
      this.disabled1 = true;
    }
    this.getLevelCondition();
    this.getRightsList();
    this.getRewardList();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-upload {
  height: 30px !important;
  line-height: 30px !important;
}
.l_container {
  padding: 20px;
  background-color: #fff;
  .marl20 {
    margin-left: 20px;
  }
  .marR20{
    margin-right: 20px;
  }
  .level_order {
    color: #3d434a;
    margin: 20px;
    .red {
      color: #fd4c2b;
    }
  }
  .icon_title {
    float: left;
    margin: 17px 0 0 30px;
    color: #44434b;
  }
  .upload_btn {
    float: left;
    margin: 8px 0 0 30px;
  }
  .l_warn {
    color: #92929b;
    font-size: 12px;
  }
  .level_icon {
    float: left;
    width: 45px;
    height: 45px;
    display: block;
    background-color: #eee;
    border-radius: 22.5px;
  }
  .form_container {
    color: #44434b;
    padding: 0 20px;
    .input_wrap {
      width: 338px;
      display: inline-block;
    }
    .input_wrap2 {
      width: 160px;
      display: inline-block;
    }
    .input_wrap3 {
      width: 100px;
      display: inline-block;
    }
    .line {
      height: 1px;
      border-bottom: 1px dashed #d3d3d3;
      margin-bottom: 18px;
    }
    .radio_line {
      margin: 0 0 10px 20px;
    }
    .giftList {
      float: left;
      width: 500px;
      margin-left: 10px;
      > div {
        margin-bottom: 10px;
      }
    }
  }
}
</style>