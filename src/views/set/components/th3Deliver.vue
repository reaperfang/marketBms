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
        <span v-if="address"> {{ address }}</span><el-button class="address-btn" @click="handleToTh3Info" type="text">{{ btnTxt }}</el-button>
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
              <el-table-column label="是否开通" align="center" width="220">
                <template slot-scope="scope">
                  <p v-if="scope.row.status !== 1">
                    未开通
                    <br />
                    预计3个工作日审核完成
                  </p>
                  <p v-if="scope.row.status === 1">已开通</p>
                  <p v-if="scope.row.status === 1" class="prompt">审核通过</p>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="explanation" label="说明" align="center" width="230"></el-table-column> -->

              <el-table-column label="操作" align="center" width="221">
                <template slot-scope="scope">
                  <el-button
                    class="tableBox-btn"
                    v-if="scope.row.status !== 1"
                    @click="handleClickIsopen(scope.row)"
                    type="text"
                    size="medium"
                  >申请开通</el-button>
                  <el-button
                    class="tableBox-btn"
                    type="text"
                    size="medium"
                    @click="goPay"
                    v-if="scope.row.status === 1"
                  >充值</el-button>
                  <el-button
                    class="tableBox-btn"
                    type="text"
                    size="medium"
                    @click="viewBalance"
                    v-if="scope.row.status === 1"
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
        v-permission="['设置','同城配送','第三方配送', '保存']"
        :loading="isLoading"
        v-show="saveShow"
      >保 存</el-button>
    </div>
    <component
      :is="currentDialog"
      :addressInfo="addressInfo"
      :data="currTh3Deliver"
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
      currTh3Deliver: null,
      addressInfo: null,
      address: null, // 发货地址
      provinceCode: null,
      cityCode: null,
      areaCode: null,
      lng: null,
      lat: null,
      addressId: null,
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
          thirdType:1,
          name: "达达",
          status: 0,
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
      const p1 = this.getTh3DeliverAddress()
      const p2 = this.getShopInfo()
      const p3 = this.getTh3DeliverList()
      Promise.all([p1, p2, p3]).then(([res1,res2, res3])=> {
        if (res1) {
          this.addressInfo = res1
          this.provinceCode = res1.provinceCode
          this.cityCode = res1.cityCode
          this.areaCode = res1.areaCode
          this.address =  `${res1.address} ${res1.addressDetail}`
          this.lng = res1.longitude
          this.lat = res1.latitude
          this.addressId = +res1.id
        }
      }).finally(() => {
        this.isInitLoading = false
      })
    },
    formatTh3DeliverList(list) {
      console.log('-----formatTh3DeliverList---', list)
      let arr = [
        {
          thirdType: 1,
          name: "达达",
          status: 0,
        }
      ]
      if (list.length <= 0) return arr
      arr = list.map((item) => {
        const map = Object.create(null)
        map.thirdType = item.thirdType
        map.status = item.status
        if (item.thirdType === 1) map.name = '达达'

        return map
      })
      return arr
    },
    // 获取三方配送列表
    getTh3DeliverList() {
      return this._apis.set.getTh3DeliverList().then((res) => {
        this.dataList = this.formatTh3DeliverList(res)
        return res
      }).catch((err) => {
        this.$message.error(err)
      })  
    },
    handleToTh3Info() {
      if (this.addressId) {
        // this.confirm({
        //   title: "提示",
        //   icon: true,
        //   text: '修改发货地址后请重新确认其它商家配送设置项，如无修改将以新的发货地址为中心按原配送规则执行',
        //   confirmText: '去修改'
        // }).then(() => {
          // source 1 商家配送
        this.$router.push({ path:'/set/addressUpdate', query: {id: this.addressId, source: 1, sourceType: 2 } })
        // }).catch(()=> {
        // });
      } else {
        this.$router.push({ path:'/set/addressAdd', query: { source: 1, sourceType: 2 } })
      }
    },
    getTh3DeliverAddress() {
      return this._apis.set.getAddressDefaultSender({ isBindThirdsend: 1}).then((response) => {
        // if (response) {
        //   this.address = `${response.address} ${response.addressDetail}`
        //   this.ruleForm.lng = response.longitude
        //   this.ruleForm.lat = response.latitude
        //   this.addressId = response.id
        // }
        return response
      }).catch((err) => {
        // console.log('err',err)
        this.$message.error(err || '数据获取失败')
      })
    },
    getShopInfo() {
      let id = this.cid;
      return this._apis.set
        .getShopInfo({ id: id })
        .then(response => {
          if (!response) return false
          this.isOpen = response.isOpenTh3Deliver === 1 ? true : false
          this.isOpenAutoCall = response.autoCall === 1 ? 1 : 0
          // 自动呼叫 isOpenAutoCall
        })
        .catch(error => {
          this.$message.error(error || '查询失败');
        });
    },
    // 是否有设置发货地址与开通达达设置
    hasSetting() {
      const isFullAddress = this.isFullAddress()
      const isOpenTh3 = this.dataList.find(item => item.status === 1)
      return isFullAddress && isOpenTh3
    },
    // 设置绑定三方配送
    setBindThirdsend() {
      if (!this.addressInfo) return Promise.resolve()
      const req = {
        id: this.addressInfo.id,
        isBindThirdsend: 1,
        addressType: this.addressInfo.addressType,
        is_defalt_sender_address: this.addressInfo.isDefaltSenderAddress,
        is_defalt_return_address: this.addressInfo.isDefaltReturnAddress
      }
      return this._apis.set.editAddressById(req)
    },
    handleSubmit() {
      if (this.isLoading) return false
      // 判断是否设置发货地址和开通达达设置
      if (this.isOpen && !this.hasSetting()) {
        this.confirm({
          title: '',
          iconWarning: true,
          text: '您未完成发货地址或开通第三方等配置项设置，设置成功后，才能成功开启第三方配送开关。',
          confirmText: '我知道了',
          customClass: 'setting-custom',
          showCancelButton: false
        }).finally(() => {
          this.isOpen = false
        });
        
        return false
      }
      this.isLoading = true

      const req = Object.create(null)
      req.autoCall = this.isOpenAutoCall
      req.isOpenTh3Deliver = this.isOpen ? 1 : 0
      req.id = this.cid
      const p1 = this.setBindThirdsend()
      const p2 = this._apis.set.updateShopInfo(req)
      Promise.all([p1, p2]).then(response =>{
        const html = '<span class="sucess">保存成功！</span><span class="prompt" style="">第三方配送-达达配送已开启。</span>'
        this.confirm({
          title: '', 
          iconSuccess: true, 
          text: html,
          customClass: 'setting-custom',
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
    submitForm() {
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
      this.getTh3DeliverList()
      // this.rechargeShow = false;

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
      return this.address && this.provinceCode && this.cityCode && this.areaCode && this.lat && this.lng
    },
    isDaDaCoveredArea(curr) {
      const req = {
        cid: this.cid,
        cityCode: this.cityCode,
        areaCode: this.areaCode,
        thirdType: curr.thirdType || 1
      }
      return this._apis.set.isDaDaCoveredArea(req)
    },
    //申请开通
    handleClickIsopen(row) {
      if (!this.isFullAddress()) {
        this.confirm({
          title: '', 
          iconWarning: true, 
          text: '请先将发货地址补充完成，再申请开通。',
          customClass: 'setting-custom',
          confirmText: '我知道了',
          showCancelButton: false
        });
        return false
      }
      this.currTh3Deliver = row
      // 判断达达是否覆盖
      this.isDaDaCoveredArea(row).then(() => {
        this.isTableShow = false;
        this.btnShow = true;
        this.saveShow = false;
      }).catch(() => {
        this.confirm({
          title: '', 
          iconWarning: true, 
          text: '非常抱歉，发货地所在的城市尚未开通达达同城配送，暂无法使用，敬请期待。',
          confirmText: '我知道了',
          customClass: 'setting-custom',
          showCancelButton: false
        });
      })
      
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.setting-custom {
  .el-icon-success {
    font-size: 32px;
    color:rgba(108, 213, 33, 1);
  }
  .success,.prompt {
    display: block;
  }
  .success {
    font-size: 16px;font-weight: 500;color: #44434B;line-height: 22px;
  }
  .prompt {
    padding-top: 10px;
    font-size: 12px;font-weight: 400;color: #44434B;line-height: 20px;
  }
  &.no-cancel .el-button {
    letter-spacing: 0;
  }
}
</style>
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
