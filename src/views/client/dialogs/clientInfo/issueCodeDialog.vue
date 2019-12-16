<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="发放优惠码" :hasCancel="hasCancel" :showFooter="false">
    <div class="c_container">
      <p class="marB20">客户ID: {{data.memberSn}}</p>
      <div class="clearfix">
        <div class="fl l_block">
          选择优惠码：
        </div>
        <div class="fl r_block">
          <div class="sel_cont" v-for="(i,index) in selectList" :key="index">
            <el-select v-model="i.appCouponId" style="margin-bottom: 10px" @change="handleChange">
              <el-option v-for="item in data.allCodes" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-input-number v-model="i.couponNum" :min="1" :max="10"></el-input-number>
            <span class="addMainColor pointer" @click="handleDelete(index)" style="margin-left: 20px">删除</span>
          </div>
          <span class="add pointer" @click="handleAdd">添加</span>
        </div>
      </div>
    </div>
    <div>
            <span slot="footer" class="dialog-footer fcc">
                <el-button type="primary" @click="submit" :loading="btnLoading">确 认</el-button>
                <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
            </span>
        </div>
  </DialogBase>
</template>
<script>
import clientApi from "@/api/client";
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "issueCouponDialog",
  data() {
    return {
      hasCancel: true,
      coupon:"",
      selectList: [
        {couponNum: 1,appCouponId:"",memberId:this.data.id,receiveType:"1",receiveActivityId:"1",weChartNickname: this.data.weChartNickname}
      ],
      btnLoading: false
    };
  },
  methods: {
    submit() {
      this.btnLoading = true;
      let canSubmit = true;
      this.selectList.map((v) => {
        if(v.appCouponId == "") {
          canSubmit = false;
        }
      })
      if(this.selectList[0].appCouponId.length > 0 && !!canSubmit) {
        this._apis.client.distributeCoupon(this.selectList).then((response) => {
          response.map((v) => {
            if(!!v.receiveDesc) {
              this.btnLoading = false;
              this.visible = false;
              let errMsg = v.couponName + "发放失败，原因：" + v.receiveDesc.substring(v.receiveDesc.indexOf('。') + 1,v.receiveDesc.length);
              this.$notify({
                title: '提示',
                message: errMsg,
                type: 'warning'
              });
            }else{
              this.btnLoading = false;
              this.visible = false;
              this.$notify({
                title: '成功',
                message: "发放成功",
                type: 'success'
              });
              this.$emit('refreshPage');
            }
          })
        }).catch((error) => {
          this.btnLoading = false;
          this.visible = false;
          console.log(error);
        })
      }else{
        this.btnLoading = false;
        this.$notify({
            title: '警告',
            message: '请正确选择优惠码',
            type: 'warning'
          });
      }
    },
    handleAdd() {
      if(this.selectList.length > 9) {
        this.$notify({
            title: '警告',
            message: '发放优惠码不能超过10种',
            type: 'warning'
          });
      }else{
        this.selectList.push({couponNum: 1,appCouponId:"",memberId:this.data.id,receiveType:"1",receiveActivityId:"1",weChartNickname: this.data.weChartNickname});
      }
    },
    handleDelete(index) {
      this.selectList.splice(index, 1);
    },
    handleChange(val) {
      let i = 0;
      if(this.selectList.length > 1) {
        this.selectList.map((v) => {
          if(v.appCouponId == val) {
            i++;
          }
        });
        if(i == 2) {
          this.$notify({
            title: '警告',
            message: '不能选择重复的优惠券',
            type: 'warning'
          });
        }
      }
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
    }
  },
  mounted() {
      
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-input-number--small .el-input-number__decrease, .el-input-number--small .el-input-number__increase{
  background-color: #655EFF;
  color: #fff;
}
/deep/ .el-input-number--small{
  width: 110px;
}
.c_container {
    text-align: left;
    .l_block{
      width: 86px;
      margin-top: 8px;
    }
    .r_block{
      position: relative;
      .add{
        position: absolute;
        right: -44px;
        top: 8px;
        color: #655EFF;
      }
    }
    .marB20{
      margin-bottom: 20px;
    }
}
.dialog-footer{
    margin-top: 20px;
}
</style>


