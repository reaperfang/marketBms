<template>
   <div class="th3Deliver">
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
         北京市北京市东城区长保大厦<el-button class="address-btn" type="text">修改</el-button>
       </div>
     </div>
     <!-- 第三方列表 -->
     <div class="row" v-show="isTableShow">
       <div class="label">
         开通第三方：
       </div>
       <div class="content">
         <div class="tableBox">
            <el-table style="width: 700px;" :data="dataList" class="table" :show-header="false" align="center" border>
              <el-table-column prop="name" label="名称" align="center" width="115"></el-table-column>
              <el-table-column prop="isOpen" label="是否开通" align="center" width="216">
                <template slot-scope="scope">
                  <p v-if="status==1 || status==3">
                    未开通
                    <br />
                    {{scope.row.isOpen}}
                  </p>
                  <p v-else-if="status==2">已开通</p>
                </template>
              </el-table-column>
              <el-table-column prop="explanation" label="说明" align="center" width="230"></el-table-column>

              <el-table-column label="操作" align="center" width="136">
                <template slot-scope="scope">
                  <el-button
                    v-if="status==1"
                    @click="handleClickIsopen(scope.row)"
                    type="text"
                    size="medium"
                  >申请开通</el-button>
                  <p v-else-if="status==2">审核通过</p>
                  <p v-else-if="status==3">审核中</p>
                </template>
              </el-table-column>
            </el-table>
            <!-- <div style="width:255px">
              <div class="btnRight" >
                <el-button @click="onRecharge" type="text" size="mini">充值</el-button>
                <i class="icon">|</i>
                <el-button @click="onRechargeReCord" type="text" size="mini">充值记录</el-button>
                <i class="icon">|</i>
              </div>
            </div> -->
          </div>
       </div>
     </div>
     <div class="btn" v-show="btnShow">
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
</template>

<script>
import protocolDialog from "@/views/set/dialogs/protocolDialog";
export default {
  components: {
    protocolDialog
  },

  props: {},

  data () {
    return {
      isOpen: false,
      status: 1,
      rechargeShow: false,
      btnShow: false,
      saveShow: true,
      isLoading: false,
      isTableShow: false, // 是否显示列表
      dataList: [
        {
          id: 1,
          name: "达达",
          isOpen: "预计3个工作日审核完成",
          explanation: "配费说明",
          adopt: ""
        }
      ],
      dialogVisible: true,
      currentDialog: "",
    }
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  methods: {
    handleIsOpen() {
      console.log('isOpen',this.isOpen)
      this.isTableShow = this.isOpen
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
    //申请开通
    handleClickIsopen() {
      //  this.isTableShow = false;
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
  }
  .btn {
    text-align: center;
    padding-top:40px;
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