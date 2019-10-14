<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="手动调整积分" :hasCancel="hasCancel">
    <div class="c_container">
      <p class="marB20">客户ID: {{ data.memberSn }}</p>
      <p class="marB20">当前积分: {{ data.score }}</p>
      <div class="marB20">
          <span>调整积分数值：</span>
          <div class="input_wrap">
              <el-input placeholder="请输入调整数值" v-model="adjustmentScore" @blur="handleBlur"></el-input>
          </div>
      </div>
      <p class="marB20">调整后积分: {{adjustmentAfterScore}}</p>
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
  name: "adjustCreditDialog",
  data() {
    return {
      hasCancel: true,
      adjustmentScore: null,
      remark: ""
    };
  },
  methods: {
    submit() {
      if(this.adjustmentScore == null) {
        this.$notify({
          title: '警告',
          message: '请输入调整数值',
          type: 'warning'
        });
      }else if(Number(this.data.score) == 0 && Number(this.adjustmentScore) < 0) {
        this.$notify({
          title: '警告',
          message: '当前积分为0时不能输入负数',
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
          currentScore: this.data.score,
          adjustmentScore: this.adjustmentScore,
          adjustmentAfterScore: this.adjustmentAfterScore,
          remark: this.remark
        }
        this._apis.client.manualChangeCredit(params).then((response) => {
          this.$notify({
            title: '成功',
            message: "调整积分成功",
            type: 'success'
          });
          this.$emit('refreshPage');
        }).catch((error) => {
          console.log(error);
        })
      }
    },
    handleBlur() {
      if(Number(this.data.score) == 0 && Number(this.adjustmentScore) < 0) {
        this.$notify({
          title: '警告',
          message: '当前积分为0时不能输入负数',
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
    adjustmentAfterScore() {
      return Number(this.data.score) + Number(this.adjustmentScore);
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


