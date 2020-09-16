<template>
  <div  v-loading="isInitLoading" element-loading-background="rgba(255,255,255,1)" style="min-height:200px;background-color:#fff;">
   <div v-if="!isInitLoading" class="th3Deliver">
     <div class="switch-area">
       <span>启用第三方配送：</span>
       <el-switch active-color="#13ce66" inactive-color="#cacfcb" v-model="isOpen" @change="handleIsOpen"></el-switch>
       <span>开启后，将有第三方物流代您进行配送，配送产生的费用，开启后表示同意</span>
       <el-button class="agree" type="text" @click="onPprotocol()">《第三方配送协议》</el-button>
     </div>
     <!-- 发货地址 -->
     <div class="row">
       <div class="label">
         发货地址：
       </div>
       <div class="content">
        <span v-if="address"> {{ address }}</span><el-button class="address-btn" type="text">{{ btnTxt }}</el-button>
       </div>
     </div>
     <!-- 第三方列表 -->
     <div class="row" v-show="isTableShow">
       <div class="label">
         开通第三方：
       </div>
       <div class="content">
         <div class="tableBox">
            <el-table style="width: 663px;" :data="dataList" class="table" :show-header="false" align="center" border>
              <el-table-column prop="name" label="名称" align="center" width="220"></el-table-column>
              <el-table-column prop="isOpen" label="是否开通" align="center" width="220">
                <template slot-scope="scope">
                  <p v-if="status==1 || status==3">
                    未开通
                    <br />
                    {{scope.row.isOpen}}
                  </p>
                  <p v-else-if="status==2">已开通</p>
                  <p class="prompt">审核通过</p>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="explanation" label="说明" align="center" width="230"></el-table-column> -->

              <el-table-column label="操作" align="center" width="221">
                <template slot-scope="scope">
                  <el-button
                    class="tableBox-btn"
                    v-if="status==1"
                    @click="handleClickIsopen(scope.row)"
                    type="text"
                    size="medium"
                  >申请开通</el-button>
                  <el-button
                    class="tableBox-btn"
                    type="text"
                    size="medium"
                    @click="goPay"
                  >充值</el-button>
                  <el-button
                    class="tableBox-btn"
                    type="text"
                    size="medium"
                    @click="viewBalance"
                  >查看余额</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
       </div>
     </div>
     <div class="row auto-call"  v-show="isTableShow">
       <div class="label">
         自动呼叫：
       </div>
       <div class="content">
         <div>
          <el-radio class="radio" v-model="isOpenAutoCall" :label="1">开启</el-radio>
          <el-radio class="radio" v-model="isOpenAutoCall" :label="0">关闭</el-radio>
         </div>
         <p class="prompt">说明：开通自动呼叫后，使用第三方配送的订单，在商户余额充足的情况下，将在订单付款完成后自动发单给第三方， 若商户余额不足则无法执行自动呼叫，需要手动接单给第三方发单。</p>
       </div>
     </div>
     <div class="btn btn-register" v-show="btnShow">
      <el-button class="register" @click="handleClickRegister" type="primary" size="small">注册新的达达账号</el-button>
     </div>
     <div class="btn">
      <el-button
        type="primary"
        class="submit"
        @click="handleSubmit('ruleForm')"
        :loading="isLoading"
        v-show="saveShow"
      >保 存</el-button>
    </div>
    <component
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      @submitForm="submitForm"
    ></component>
   </div>
  </div> 
</template>

<script>
import protocolDialog from "@/views/set/dialogs/protocolDialog";
import registerDialog from "@/views/set/dialogs/registerDialog";

export default {
  components: {
    registerDialog,
    protocolDialog
  },

  props: {},

  data () {
    return {
      address: null, // 发货地址
      provinceCode: null,
      cityCode: null,
      areaCode: null,
      isOpen: false,
      status: 1,
      rechargeShow: false,
      btnShow: false,
      saveShow: true,
      isLoading: false,
      isInitLoading: true, // 初始化加载loading显示
      isTableShow: false, // 是否显示列表
      dataList: [
        {
          id: 1,
          name: "达达",
          isOpen: "预计3个工作日审核完成",
          // explanation: "配费说明",
          adopt: ""
        }
      ],
      dialogVisible: true,
      currentDialog: "",
      isOpenAutoCall: 0
    }
  },

  computed: {
    btnTxt() {
      return this.address ? '修改': '新建'
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },

  watch: {
    isOpen(val) {
      this.isTableShow = this.isOpen
      this.btnShow = false
      this.saveShow = true
    }
  },

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    init() {
      this.isInitLoading = true
      const p1 = this.getShopInfo()
      const p2 = this.getTh3DeliverAddress()
      Promise.all([p1, p2]).finally(() => {
        this.isInitLoading = false
      })
    },
    getTh3DeliverAddress() {
      // mock
      this.provinceCode = ''
      this.cityCode = ''
      this.areaCode = ''
      this.address = '北京大兴区数码庄园'
      return new Promise((resolve, reject) => {
        resolve(this.address)
      })
    },
    getShopInfo() {
      let id = this.cid;
      return this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
          if (!response) return false
          this.isOpen = response.isOpenTh3Deliver === 1 ? true : false
          // 自动呼叫 isOpenAutoCall
        })
        .catch(error => {
          this.$message.error(error || '查询失败');
        });
    },
    handleSubmit() {
      if (this.isLoading) return false
      this.isLoading = true
      const req = Object.create(null)
      // req.isOpenAutoCall = this.isOpenAutoCall
      req.isOpenTh3Deliver = this.isOpen ? 1 : 0
      req.id = this.cid
      this._apis.set.updateShopInfo(req).then(response =>{
        const html = '<p style="font-size: 16px;font-weight: 500;color: #44434B;line-height: 22px;">保存成功</p><p style="font-size: 12px;font-weight: 400;color: #44434B;line-height: 20px;">第三方配送-达达配送已开启。</p>'
        this.confirm({
          title: '提示', 
          iconSuccess: true, 
          text: html,
          customClass: 'th3Deliver-custom',
          confirmText: '确定',
          showCancelButton: false
        });
      }).catch(error =>{
        this.$message.error(error || '保存失败');
      }).finally(() => {
        this.isLoading = false
        this.getShopInfo()
      })
    },
    viewBalance() {
      // 查看余额
      this.$router.push({ path: '/set/rechargeRecord'})
    },
    // 去充值
    goPay() {
      this.$router.push({ path: '/set/recharge'})
    },
    handleIsOpen() {
      console.log('isOpen',this.isOpen)
      // this.isTableShow = this.isOpen
      // this.btnShow = false
      // this.saveShow = true
    },
    //第三放协议
    onPprotocol() {
      this.currentDialog = "protocolDialog";
      this.dialogVisible = true;
    },
    //注册成功
    submitForm(val) {
      this.sourceId = val;
      this.status = 3;
      // this.dataList = [
      //   {
      //     name: "达达",
      //     isOpen: "预计3个工作日审核完成",
      //     explanation: "配费说明",
      //     adopt: "申请中"
      //   }
      // ];
      this.isTableShow = true;
      this.btnShow = false;
      this.saveShow = true;
      this.rechargeShow = false;
    },
    //注册新的达达账号
    handleClickRegister() {
      // this.rechargeShow = true;
      //   this.sourceId=78117
      // this.status=2

      // this.isTableShow = true;
      //  this.btnShow = false;
      //  this.saveShow = true;
      //    this.rechargeShow= true
      this.currentDialog = "registerDialog";
      this.dialogVisible = true;
    },
    //同步
    onSyncAddress() {
      this.currentDialog = "syncAddressDialog";
      this.dialogVisible = true;
    },
    //充值
    onRecharge() {
      this.$router.push({
        name: "recharge",
        params: { sourceId: this.sourceId }
      });
    },
    onRechargeReCord() {
      this.$router.push({
        name: "rechargeRecord",
        params: { sourceId: this.sourceId }
      });
    },
    isFullAddress() {
      return this.address && this.provinceCode && this.cityCode && this.areaCode
    },
    //申请开通
    handleClickIsopen() {
      if (!this.isFullAddress()) {
        this.confirm({
          title: '提示', 
          iconSuccess: true, 
          text: '请先将发货地址补充完成，再申请开通。',
          confirmText: '确定',
          showCancelButton: false
        });
        return false
      }
      // 判断达达是否覆盖
      this.isDaDaCoveredArea()
      this.isTableShow = false;
      this.btnShow = true;
      this.saveShow = false;
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.th3Deliver {
  background: #fff;
  padding: 20px;
  .switch-area {
    background: #F9F9F9;
    padding: 20px;
    >span, .argee {
      font-size: 14px;
      font-weight: 400;
      color: #44434B;
      line-height: 20px;
    }
    .argee {
      color:#655EFF;
    }
  }
  .row {
    display: flex;
    flex-direction: row;
    padding-top: 20px;
    &.auto-call {
      padding-top: 40px;
      .radio {
        margin-right: 30px;
        /deep/.el-radio__label {
          padding-left: 5px;
        }
        &:last-of-type {
          margin-right: 0;
        }
      }
      .prompt {
        padding-top: 16px;
        max-width: 728px;
        font-size: 14px;
        font-weight: 400;
        color: #FD932B;
        line-height: 20px;
      }
    }
    .label, .content {
      font-size: 14px;
      font-weight: 400;
      color: #44434B;
      line-height: 20px;
    }
    .label {
      width: 152px;
      text-align: right;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .content {
      flex: 1;
      padding-left: 10px;
      >.address-btn {
        padding: 0 0 0 20px;
        font-size:14px;
      }
    }
  }
  .tableBox {
    .btnRight {
      display: inline-block;
      margin: 0px 0 0 20px;
      font-size: 14px;
    }
    i.icon {
      color: #d0d6e4;
      display: inline-block;
      padding: 0 15px;
    }
    .prompt {
      font-size: 14px;
      font-weight: 400;
      color: #13CE66;
    }
  }
  .tableBox-btn {
    padding:0;
    padding-right: 8px;
    padding-left: 8px;
    border-right: 1px solid rgba(218, 218, 227, 1);
    margin-left:0;
    &:last-of-type {
      padding-right: 0;
      border-right: 0;
    }
  }
  .btn {
    text-align: center;
    padding-top:40px;
    &-register {
      padding-top: 400px;
    }
    .register {
      width: 128px;
      height: 32px;
      background: #655EFF;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      color: #FFFFFF;
    }
  }
}
</style>
