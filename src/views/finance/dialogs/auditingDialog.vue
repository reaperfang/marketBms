/* 审核 */
<template>
  <div>
  <DialogBase :visible.sync="visible" :showFooter="false" title="审核">
    <div class="c_container">
      <div class="clearfix">
        <span class="fl c_label">提现申请</span>
        <div class="fl">
          <div class="c_top">
            <p>客户ID：{{info.memberSn}}</p>
            <p>
              提现金额：
              <span>￥{{info.amount}}</span>
            </p>
            <p>提现编号：{{info.cashoutSn}}</p>
          </div>
          <div class="c_steps clearfix">
            <div class="c_step_l">
              <span class="c_green"></span>
              {{info.createTime}}
            </div>
            <div class="c_step_r">
              <p>提交申请</p>
              <p>账户可用余额冻结 ￥{{info.amount}}</p>
              <p>交易流水 {{info.tradeDetailSn}}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="clearfix marT30">
        <span class="fl c_label">提现申请</span>
        <div class="fl">
            <el-radio v-model="radio" label="0">同意申请</el-radio>
            <el-radio v-model="radio" label="1">拒绝申请</el-radio>
            <el-input
                type="textarea"
                :rows="3"
                class="marT20"
                placeholder="请输入拒绝原因，不超过20个字"
                v-model="remarks"
                v-if="radio == 1"
                @blur="checkNull">
            </el-input>
            <p style="color:#FD4C2B;font-size:12px;margin-top:10px;" v-if="note">请输入拒绝原因</p>
            <p style="text-align:center; margin-top:10px;">
               <el-button type="primary"  @click="submit">确定</el-button>
                <el-button @click="cancel">取消</el-button> 
            </p>
        </div>
      </div>
    </div>
  </DialogBase>
  <el-dialog
        title="提示"
        :visible.sync="otherVisible"
        width="30%"
    >
        <div class="other_cont">
            <img src="../../../assets/images/finance/icon_success.png" alt="" style="display:block; margin: 0 auto">
            <span>审核成功</span>
        </div>
        <span slot="footer" class="dialog-footer fcc">
            <el-button type="primary" @click="otherVisible = false">我知道了</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import clientApi from "@/api/client";
import DialogBase from "@/components/DialogBase";
export default {
  name: "auditingDialog",
  props: ["data"],
  data() {
    return {
      info:{},
      radio: "0",
      remarks:'',
      otherVisible: false,
      note:false
    };
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
  },
  computed: {
    visible: {
      get() {
        this.remarks = ''
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  watch:{
      data(){
          this.getInfo()
      },
      radio(){
        this.radio == 0 && (this.note = false)
      }
  },
  created() {
    this.getInfo()
  },
  methods: {
    submit() { 
      let datas = {
        ids:[this.data.id],
        auditStatus:this.radio,
        remarks:this.remarks.trim()
      }
      if(this.radio == 0){
        this.$emit("handleSubmit",datas);
        this.visible = false
      }else if(this.radio == 1 && this.remarks.trim()){
         this.$emit("handleSubmit",datas);
         this.visible = false
      }else{
        return false
      }      
    },
    cancel(){
      this.$emit("fetch");
      this.visible = false
    },
    checkNull(){
        if(this.radio == 1 && this.remarks.trim() == ''){
            this.note = true
        }
    },
    getInfo(){
      this._apis.finance.getInfoWd({cashoutDetailId:this.data.id}).then((response)=>{
          this.info = response[0]
      }).catch((error)=>{
          this.$notify.error({
          title: '错误',
          message: error
          });
      })
    },
  },  
};
</script>
<style lang="scss" scoped>
/deep/.el-step__icon.is-text {
  border-radius: 0;
  border: none;
  border-color: none;
}
.c_container {
  text-align: left;
  .c_label{
    font-size: 16px;
    display: block;
    width: 107px;
  }
  .c_top {
    border-bottom: 1px solid #cacfcb;
    padding-bottom: 20px;
    position: relative;
    p {
      font-size: 16px;
      margin-bottom: 10px;
      span {
        color: #fd4c2b;
      }
      &.gray {
        color: #9fa29f;
      }
      &.c_status {
        position: absolute;
        color: #44434b;
        font-size: 24px;
        top: 0;
        right: 56px;
      }
    }
  }
  .c_steps {
    padding-top: 23px;
    .c_step_l {
      float: left;
      width: 200px;
      height: 80px;
      border-right: 1px solid #dadadc;
      position: relative;
      .c_green {
        display: block;
        width: 5px;
        height: 5px;
        background-color: #3eb488;
        position: absolute;
        right: -3px;
        top: -3px;
        border-radius: 2.5px;
      }
    }
    .c_step_r {
      float: left;
      p {
        color: #9fa29f;
        margin: 0 0 5px 32px;
        &:first-child {
          color: #333;
        }
      }
    }
  }
}
.other_cont{
    text-align: center;
    img{
        display: block;
    }
    span{
        display: block;
        font-size: 18px;
        margin-top: 20px;
    }
}
</style>


