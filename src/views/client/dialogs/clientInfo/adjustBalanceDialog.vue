<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="手动调整余额" :hasCancel="hasCancel">
    <div class="c_container">
      <p class="marB20">客户ID: {{ data.memberSn }}</p>
      <p class="marB20">当前余额: {{ data.balance }}</p>
      <div class="marB20">
          <span>增加余额：</span>
          <div class="input_wrap">
              <el-input placeholder="请输入增加余额" v-model="adjustmentBalance" @blur="handleBlur"></el-input>
          </div>
      </div>
      <p class="marB20">调整后余额: {{adjustmentAfterBalance}}</p>
      <div class="marB20 clearfix">
          <span class="fl">变更原因：</span>
          <div class="input_wrap2 fl">
              <el-input placeholder="请输入变更原因" v-model="remark" type="textarea" :row="3" :maxlength="50"></el-input>
          </div>
      </div>
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
      remark: ""
    };
  },
  methods: {
    submit() {
      if(Number(this.adjustmentBalance) <= 0 || this.adjustmentBalance == "") {
        this.$notify({
          title: '警告',
          message: '请输入增加余额, 且不能为0或负数',
          type: 'warning'
        });
      }else if(this.remark == "") {
        this.$notify({
          title: '警告',
          message: '请输入变更原因',
          type: 'warning'
        });
      }else{
        let params = {
          id: this.data.id,
          currentBalance: this.data.balance,
          adjustmentBalance: this.adjustmentBalance,
          adjustmentAfterBalance: this.adjustmentAfterBalance,
          remark: this.remark
        }
        this._apis.client.manualChangeBalance(params).then((response) => {
          this.$notify({
            title: '成功',
            message: "调整余额成功",
            type: 'success'
          });
          this.$emit('refreshPage');
        }).catch((error) => {
          console.log(error);
        })
      }
    },
    handleBlur() {
      if(Number(this.adjustmentBalance) < 0) {
        this.$notify({
          title: '警告',
          message: '增加余额不能为负数',
          type: 'warning'
        });
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
      return Number(this.data.balance) + Number(this.adjustmentBalance);
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
.c_container {
    text-align: left;
    .marB20{
      margin-bottom: 20px;
    }
  .input_wrap{
      width: 188px;
      display: inline-block;
  }
  .input_wrap2{
      width: 500px;
      display: inline-block;
  }
}
</style>


