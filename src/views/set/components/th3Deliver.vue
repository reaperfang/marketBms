<template>
  <div v-calcHeight="60 + 60 + 20 + 20"  v-loading="isInitLoading" element-loading-background="rgba(255,255,255,1)" style="background-color:#fff;min-height: 430px;">
   <div v-if="!isInitLoading" class="th3Deliver">
     <div class="switch-area">
       <span>启用第三方配送：</span>
       <el-switch class="btn" active-color="#13ce66" inactive-color="#CACACF" v-model="isOpenTh3Deliver"></el-switch>
       <span>开启后，将有第三方物流代您进行配送，配送产生的费用，开启后表示同意</span>
       <el-button class="agree" type="text" @click="onPprotocol()">《第三方配送协议》</el-button>
     </div>
     <!-- 发货地址 -->
     <div class="row" v-show="isTableShow">
       <div class="label">
         发货地址：
       </div>
       <div class="content">
        <span v-if="address"> {{ address }}</span><el-button class="address-btn" @click="handleToTh3Info" v-if="isHasAuth()" type="text">{{ btnTxt }}</el-button>
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
                    v-permission="['设置','同城配送', '第三方配送', '充值/查看余额']"
                    v-if="scope.row.status === 1"
                  >充值</el-button>
                  <el-button
                    class="tableBox-btn"
                    type="text"
                    size="medium"
                    @click="viewBalance"
                    v-permission="['设置','同城配送', '第三方配送', '充值/查看余额']"
                    v-if="scope.row.status === 1"
                  >查看余额</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
       </div>
     </div>
     <div class="row auto-call"  v-show="isHasOpenTh3Config">
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
     <div class="btn" v-show="saveShow">
      <el-button
        type="primary"
        class="submit"
        @click="handleSubmit('ruleForm')"
        v-permission="['设置','同城配送','第三方配送', '保存']"
        :loading="isLoading"
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
import { isExistAuth } from '@/system/user.js';
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
      isOpenTh3Deliver: false,
      status: 1,
      rechargeShow: false,
      btnShow: false,
      saveShow: true,
      isLoading: false,
      isInitLoading: true, // 初始化加载loading显示
      // isTableShow: false, // 是否显示列表
      dataList: [
        {
          thirdType:1,
          name: "达达",
          status: 0,
        }
      ],
      dialogVisible: true,
      currentDialog: "",
      isOpenAutoCall: 0,
      isApplyOpen: false
    }
  },

  computed: {
    btnTxt() {
      return this.address ? '修改': '新建'
    },
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    },
    isHasOpenTh3Config() {
      const obj = this.dataList.find(item => item.status === 1)
      return obj ? true : false
    },
    isTableShow() {
      // console.log('this.isHasOpenTh3Config:',this.isHasOpenTh3Config, 'isOpenTh3Deliver:',this.isOpenTh3Deliver, 'isApplyOpen:',this.isApplyOpen)
      if ((!this.isHasOpenTh3Config && !this.isOpenTh3Deliver) || this.isApplyOpen) return false
      return true
    }
  },

  watch: {
    isOpenTh3Deliver(val) {
      // console.log('isOpenTh3Deliver',val)
      // this.isTableShow = this.isOpen
      if (!val) this.isApplyOpen = false
      this.btnShow = false
      this.saveShow = true
    }
  },

  created() {
    this.init()
  },

  mounted() {},

  methods: {
    isHasAuth() {
      let permission = []
      if (this.address) permission = ['设置','地址管理', '默认页面', '编辑']
      else permission = ['设置','地址管理', '默认页面', '新建地址']
      return isExistAuth(permission)
    },
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
      // console.log('-----formatTh3DeliverList---', list)
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
        this.$router.push({ path:'/set/addressUpdate', query: {id: this.addressId, source: 1, sourceType: 2 } })
      } else {
        this.$router.push({ path:'/set/addressAdd', query: { source: 1, sourceType: 2 } })
      }
    },
    getTh3DeliverAddress() {
      return this._apis.set.getAddressDefaultSender({ isBindThirdsend: 1}).then((response) => {
        return response
      }).catch((err) => {
        // console.log('err',err)
        this.$message.error(err || '数据获取失败')
      })
    },
    getShopInfo() {
      return this.$store.dispatch('getShopInfo').then(response => {
          if (!response) return false
          this.isOpenTh3Deliver = response.isOpenTh3Deliver === 1 ? true : false
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
        is_defalt_return_address: this.addressInfo.isDefaltReturnAddress,
        address: this.addressInfo.address,
        addressDetail: this.addressInfo.addressDetail,
        areaCode: this.addressInfo.areaCode,
        areaName: this.addressInfo.areaName,
        cityCode: this.addressInfo.cityCode,
        cityName: this.addressInfo.cityName,
        latitude: this.addressInfo.latitude,
        longitude: this.addressInfo.longitude,
        provinceCode: this.addressInfo.provinceCode,
        provinceName: this.addressInfo.provinceName
      }
      return this._apis.set.editAddressById(req)
    },
    updateShopInfo() {
      const req = Object.create(null)
      req.autoCall = this.isOpenAutoCall
      req.isOpenTh3Deliver = this.isOpenTh3Deliver ? 1 : 0
      req.id = this.cid
      return this._apis.shopInfo.updateShopInfo(req)
    },
    updateStoreInfo() {
      // 没有
      if (!this.addressInfo || !this.isOpenTh3Deliver) return Promise.resolve()
      const req = {
        cid: this.cid,
        cityName: this.addressInfo.cityName,
        cityCode: this.addressInfo.cityCode,
        areaName: this.addressInfo.areaName,
        areaCode: this.addressInfo.areaCode,
        stationAddress: (this.addressInfo.address || this.addressInfo.addressDetail) ?  `${this.addressInfo.address} ${this.addressInfo.addressDetail}` : '',
        lng: this.addressInfo.longitude,
        lat: this.addressInfo.latitude,
        thirdType: 1,
        contactName: this.addressInfo.name,
        phone: this.addressInfo.mobile
      }
      return this._apis.set.updateStore(req)
    },
    save() {
      const p1 = this.setBindThirdsend()
      const p2 = this.updateShopInfo()
      const p3 = this.updateStoreInfo()
      Promise.all([p1, p2, p3]).then(response =>{
        let html = `<span class="sucess">保存成功！</span>`
        if (this.isOpenTh3Deliver) html += `<span class="prompt" style="">第三方配送-达达配送已开启。</span>`
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
    handleSubmit() {
      if (this.isLoading) return false
      // 判断是否设置发货地址和开通达达设置
      if (this.isOpenTh3Deliver && !this.hasSetting()) {
        this.confirm({
          title: '',
          iconWarning: true,
          text: '您未完成发货地址或开通第三方等配置项设置，设置成功后，才能成功开启第三方配送开关。',
          confirmText: '我知道了',
          customClass: 'setting-custom',
          showCancelButton: false
        }).finally(() => {
          this.isOpenTh3Deliver = false
        });
        
        return false
      }
      this.isLoading = true
      if (this.isOpenTh3Deliver) {
        // 地址是否为达达覆盖范围
        this.isDaDaCoveredArea().then(() => {
          this.save()
        }).catch(() => {
          this.isLoading = false
          this.handleNoDaDaCoveredArea()
        })
      } else {
        this.save()
      }
      // const p1 = this.setBindThirdsend()
      // const p2 = this.updateShopInfo()
      // Promise.all([p1, p2]).then(response =>{
      //   let html = `<span class="sucess">保存成功！</span>`
      //   if (this.isOpenTh3Deliver) html += `<span class="prompt" style="">第三方配送-达达配送已开启。</span>`
      //   this.confirm({
      //     title: '',
      //     iconSuccess: true,
      //     text: html,
      //     customClass: 'setting-custom',
      //     confirmText: '确定',
      //     showCancelButton: false
      //   });
      // }).catch(error =>{
      //   this.$message.error(error || '保存失败');
      // }).finally(() => {
      //   this.isLoading = false
      //   this.getShopInfo()
      // })
    },
    viewBalance() {
      // 查看余额
      this.$router.push({ path: '/set/rechargeRecord'})
    },
    // 去充值
    goPay() {
      this.$router.push({ path: '/set/recharge'})
    },
    //第三放协议
    onPprotocol() {
      this.currentDialog = "protocolDialog";
      this.dialogVisible = true;
    },
    //注册成功
    submitForm() {
      // this.isTableShow = true;
      this.isApplyOpen = false
      this.btnShow = false;
      this.saveShow = true;
      this.getTh3DeliverList()
    },
    //注册新的达达账号
    handleClickRegister() {
      this.currentDialog = "registerDialog";
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
    // 达达是否覆盖
    isDaDaCoveredArea(curr) {
      const req = {
        cid: this.cid,
        cityCode: this.cityCode,
        areaCode: this.areaCode,
        thirdType: curr && curr.thirdType || 1
      }
      return this._apis.set.isDaDaCoveredArea(req)
    },
    // 处理达达没有覆盖的逻辑
    handleNoDaDaCoveredArea(){
      this.confirm({
        title: '', 
        iconWarning: true, 
        text: '非常抱歉，发货地所在的城市尚未开通达达同城配送，暂无法使用，敬请期待。',
        confirmText: '我知道了',
        customClass: 'setting-custom',
        showCancelButton: false
      });
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
        // this.isTableShow = false;
        this.isApplyOpen = true
        this.btnShow = true;
        this.saveShow = false;
      }).catch(() => {
        this.handleNoDaDaCoveredArea()
      })
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
    display: flex;
    justify-content: flex-start;
    >span, .agree {
      font-size: 14px;
      font-weight: 400;
      color: #44434B;
    }
    .agree {
      color:#655EFF;
      padding: 0;
      margin: 0;
      border: 0;
    }
    .btn {
      padding: 0 10px;
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
      width: 132px;
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
        font-weight: 400;
        color: #655EFF;
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
    td {
      padding: 15px 0;
    }
  }
  .tableBox-btn {
    padding:0;
    padding-right: 10px;
    padding-left: 8px;
    border-right: 1px solid rgba(218, 218, 227, 1);
    margin-left:0;
    border-radius: 0;
    &:last-of-type {
      padding-right: 0;
      border-right: 0;
    }
  }
  >.btn {
    position: absolute;
    left: 0;
    bottom: 50px;
    width: 100%;
    text-align: center;
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
