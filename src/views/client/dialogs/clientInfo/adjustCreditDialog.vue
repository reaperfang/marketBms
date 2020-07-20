<template>
  <DialogBase
    :visible.sync="visible"
    v-if="visible"
    @submit="submit"
    title="手动调整积分"
    :hasCancel="hasCancel"
    :showFooter="false"
    width="640px"
  >
    <div class="c_container">
      <p class="marB20" style="margin-left: 21px">用户ID：{{ data.memberSn }}</p>
      <p class="marB20" style="margin-left: 9px">当前积分：{{ data.score }}</p>
      <div class="marB20">
        <div>
          <span class="star">*</span><span>调整数值：</span>
          <el-radio-group v-model="adjustScore" @change="handleAdjust">
            <el-radio label="1">增加积分</el-radio>
            <el-radio label="2" style="margin-left: 26px">减少积分</el-radio>
          </el-radio-group>
        </div>
        <div class="input_wrap">
          <el-input
            placeholder="请输入调整数值"
            v-model.trim="adjustmentScore"
            @blur="handleBlur"
            @keyup.native="number($event,adjustmentScore,'adjustmentScore')"
          ></el-input>
        </div>
        <p class="errMsg" v-if="showError">减少数值不得大于当前积分</p>
      </div>
      <p class="marB20" style="margin-left: -4px">调整后积分：{{adjustmentAfterScore}}</p>
      <div class="marB20 clearfix">
        <span class="fl">
          <span class="star">*</span>变更原因：
        </span>
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
  name: "adjustCreditDialog",
  data() {
    return {
      hasCancel: true,
      adjustmentScore: null,
      remark: "",
      btnLoading: false,
      adjustScore: "1",
      showError: false
    };
  },
  methods: {
    number(event, val, ele) {
      val = val.replace(/[^\d]/g, "");
      this[ele] = val;
    },
    submit() {
      this.btnLoading = true;
      if (this.adjustmentScore == null) {
        this.btnLoading = false;
        this.$message({
          message: '请输入调整数值',
          type: 'warning'
        });
        return;
      }
      if (this.remark == "") {
        this.btnLoading = false;
        this.$message({
          message: '请输入变更原因',
          type: 'warning'
        });
        return;
      }
      if(this.adjustScore == '2' && Number(this.data.score) < Number(this.adjustmentScore)) {
        this.btnLoading = false;
        this.$message({
          message: '减少数值不得大于当前积分',
          type: 'warning'
        });
        return;
      }
        let params = {
          id: this.data.id,
          currentScore: this.data.score,
          adjustmentScore: this.adjustmentScore,
          adjustmentAfterScore: this.adjustmentAfterScore,
          remark: this.remark
        };
        this._apis.client
          .manualChangeCredit(params)
          .then(response => {
            this.btnLoading = false;
            this.visible = false;
            this.$message({
              message: '调整积分成功',
              type: 'success'
            });
            this.$emit("refreshPage");
          })
          .catch(error => {
            this.btnLoading = false;
            this.visible = false;
            console.log(error);
          });
      
    },
    handleBlur() {
      if (this.adjustScore == '2' && Number(this.data.score) < Number(this.adjustmentScore)) {
        this.showError = true;
      }else{
        this.showError = false;
      }
      if(Number(this.adjustmentScore) > 100000000) {
        this.$message({
          message: '增加积分不能超过1亿',
          type: 'warning'
        });
        this.adjustmentScore = "";
      }
    },
    handleAdjust(val) {
      if(val == "1") {
        this.showError = false;
      }else{
        if(Number(this.adjustmentScore) > Number(this.data.score)) {
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
    adjustmentAfterScore() {
      if(this.adjustScore == "1") {
        return Number(this.data.score) + Number(this.adjustmentScore);
      }else{
        return Number(this.data.score) - Number(this.adjustmentScore);
      }
    }
  },
  watch: {},
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
  margin-right: 5px
}
.c_container {
  text-align: left;
  padding-left: 10px;
  .marB20 {
    margin-bottom: 20px;
  }
  .input_wrap {
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
  .dialog-footer {
    margin-top: 20px;
  }
  .errMsg{
    font-size: 12px;
    color: #FD4C2B;
    margin: 5px 0 0 84px;
  }
}
</style>


