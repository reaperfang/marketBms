<template>
  <DialogBase v-if="visible" :visible.sync="visible" @submit="submit" title="手动调整余额" :hasCancel="hasCancel" :showFooter="false" width="640px">
    <div class="c_container">
      <p class="marB20" style="margin-left: 21px">用户ID：{{ data.memberSn }}</p>
      <p class="marB20" style="margin-left: 9px">当前余额：{{ data.balance }}</p>
      <div class="marB20">
          <div>
            <span class="star">*</span><span>调整类型：</span>
            <el-radio-group v-model="adjustBalance" @change="handleAdjust">
              <el-radio label="1">增加余额</el-radio>
              <el-radio label="2" style="margin-left: 26px">减少余额</el-radio>
            </el-radio-group>
          </div>
          <div class="input_wrap">
              <el-input placeholder="请输入调整数值" v-model.trim="adjustmentBalance" @blur="handleBlur" @keyup.native="number($event,adjustmentBalance,'adjustmentBalance')"></el-input>
          </div>
          <p class="errMsg" v-if="showError">减少数值不得大于当前余额</p>
      </div>
      <p class="marB20" style="margin-left: -4px">调整后余额：{{adjustmentAfterBalance}}</p>
      <div class="marB20 clearfix">
          <span class="fl"><span class="star">*</span>变更原因：</span>
          <div class="input_wrap2 fl">
              <el-input placeholder="请输入变更原因" v-model.trim="remark" type="textarea" :row="3" :maxlength="50" resize="none"></el-input>
              <span class="font_num">{{remark.length}}/50</span>
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
  name: "adjustBalanceDialog",
  data() {
    return {
      hasCancel: true,
      adjustmentBalance: null,
      remark: "",
      btnLoading: false,
      adjustBalance: "1",
      showError: false
    };
  },
  methods: {
    number(event,val,ele) {
      // val = val.replace(/[^\.\d]/g,'');
		val = val.replace(/[^\d.]/g,'').replace(/\./g, '');
      this[ele] = val;
    },
    submit() {
		if(!this.adjustmentBalance) {
			this.btnLoading = false;
			this.$message({
				message: '请输入调整数值',
				type: 'warning'
			});
			return false;
		}
		if(Number(this.adjustmentAfterBalance) > 100000000) {
			this.$message({
				message: '调整后余额不可超过1亿',
				type: 'warning'
			});
			return false
		}
      this.btnLoading = true;
      if(this.remark == "") {
        this.btnLoading = false;
        this.$message({
          message: '请输入变更原因',
          type: 'warning'
        });
        return false;
      }
      if(this.adjustBalance == '2' && Number(this.data.balance) < Number(this.adjustmentBalance)) {
        this.btnLoading = false;
        this.$message({
          message: '减少数值不得大于当前余额',
          type: 'warning'
        });
        return;
      }
      if(Number(this.adjustmentBalance) > 100000000) {
        this.btnLoading = false;
        this.$message({
          message: '调整余额不能超过1亿',
          type: 'warning'
        });
        return;
      }
      let params = {
        id: this.data.id,
        currentBalance: Number(this.data.balance),
        adjustmentBalance: this.adjustBalance == "1" ? Number(this.adjustmentBalance):Number(-this.adjustmentBalance),
        adjustmentAfterBalance: Number(this.adjustmentAfterBalance),
        remark: this.remark
      }
      this._apis.client.manualChangeBalance(params).then((response) => {
        this.btnLoading = false;
        this.visible = false;
        this.$message({
          message: '调整余额成功',
          type: 'success'
        });
        this.$emit('refreshPage');
      }).catch((error) => {
        this.btnLoading = false;
        this.visible = false;
        console.log(error);
      })
    },
    handleBlur() {
      if(this.adjustBalance == "2" && Number(this.data.balance) < Number(this.adjustmentBalance)) {
        this.showError = true;
      }else{
        this.showError = false;
      }
      if(Number(this.adjustmentAfterBalance) > 100000000) {
        this.$message({
          message: '金额不可超过100,000,000(1亿)',
          type: 'warning'
        });
        // this.adjustmentBalance = ""
		  this.btnLoading = true;
		  setTimeout(() => {
			  this.btnLoading = false;
		  }, 1000)
      }
    },
    handleAdjust(val) {
      if(val == "1") {
        this.showError = false;
        //this.placeholder = "请输入调整数值";
      }else{
        //this.placeholder = "请输入调整数值";
        if(Number(this.adjustmentBalance) > Number(this.data.balance)) {
          this.showError = true;
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
    },
    adjustmentAfterBalance() {
      if(this.adjustBalance == "1") {
        return (Number(this.data.balance) + Number(this.adjustmentBalance)).toFixed(2);
      }else{
        return (Number(this.data.balance) - Number(this.adjustmentBalance)).toFixed(2);
      }
    }
  },
  watch: {
  },
  mounted() {},
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
.star{
  color:#FD4C2B;
  margin-right: 5px;
}
.c_container {
    text-align: left;
    padding-left: 10px;
    .marB20{
      margin-bottom: 20px;
    }
  .input_wrap{
      width: 360px;
      margin: 15px 0 0 83px;
  }
  .input_wrap2{
      position: relative;
      width: 360px;
      display: inline-block;
      margin-left: 5px;
      .font_num{
        position: absolute;
        display: block;
        width: 38px;
        color: #B5BDCA;
        right: 0;
        top: 33px;
      }
  }
  .errMsg{
    font-size: 12px;
    color: #FD4C2B;
    margin: 5px 0 0 84px;
  }
}
</style>


