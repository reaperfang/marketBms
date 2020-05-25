/* 审核 */
<template>
  <div>
  <DialogBase :visible.sync="visible" :showFooter="false" title="审核">
    <div class="c_container">
      <div class="clearfix">
        <span class="fl c_label">提现申请</span>
        <div class="fl">
          <div class="c_top">
            <p>用户昵称：{{data.nickName}}</p>
            <p>用户ID：{{data.memberSn}}</p>
            <p>
              提现金额：
              <span>￥{{data.amount}}</span>
            </p>
            <p>提现编号：{{data.cashoutSn}}</p>
          </div>
          <div class="c_steps clearfix" v-for="(info,key) in infos" :key="key">
              <div class="c_step_l">
                  <span class="c_green"></span>
                  {{info.m3}}
              </div>
              <div class="c_step_r">
                  <p>{{info.m0}}</p>
                  <p>{{info.m1}}</p>
                  <p>{{info.m2}}</p>
              </div>
          </div>
        </div>
      </div>
      <div class="clearfix marT30">
        <span class="fl c_label">提现申请</span>
        <div class="fl">
            <el-form ref="form" :model="form" :rules="rules">
              <el-form-item prop="radio">
                <el-radio-group v-model="form.radio">
                  <el-radio label="0">同意申请</el-radio>
                  <el-radio label="1">拒绝申请</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="remarks">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入拒绝原因，不超过20个字"
                  v-model="form.remarks"
                  v-if="form.radio == 1"
                  style="width:300px;">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('form')">确定</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
        </div>
      </div>
    </div>
  </DialogBase>
  <el-dialog
        title="提示"
        :visible.sync="otherVisible"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
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
      infos:[],
      form:{
        radio:'0',
        remarks:'',
      },
      rules: {
        remarks: [
          { required: true, message: '请输入拒绝原因', trigger: 'blur' },
          { min: 1, max: 20, message: '不超过20个字', trigger: 'blur' }
        ],
      },
      otherVisible: false,
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
  },
  created() {
    this.getInfo()
  },
  methods: {
    submit(formName) {
      let datas = {
        ids:[this.data.id],
        auditStatus:this.form.radio,
        remarks:this.form.remarks.trim()
      }
      if(this.form.radio == 0){
        this.$emit("handleSubmit",datas);
        this.visible = false
      }else if(this.form.radio == 1){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit("handleSubmit",datas);
            this.visible = false
          }
        })
      }   
    },
    cancel(){
      this.$emit("fetch");
      this.visible = false
    },
    
    getInfo(){
      this._apis.finance.getInfoWd({cashoutDetailId:this.data.id}).then((response)=>{
          this.infos = response.list
      }).catch((error)=>{
          this.$message.error(error);
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


