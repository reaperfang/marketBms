<template>
  <DialogBase
    :visible.sync="visible"
    @submit="submit"
    title="核销验证"
    width="420px"
    :showFooter="showFooter"
     @close="close"
  >
    <template v-if="!isSuccess">
      <div class="container">
        <el-select v-model="code">
          <el-option label="自提码核销" :value="1"></el-option>
        </el-select>
        <div>
          <el-input :class="{error: isShowError}" type="text" placeholder="请输入自提码" v-model="selfCode"></el-input>
          <span v-if="isShowError" class="msgInfo">{{errorMsg}}</span>
        </div>
      </div>
      <div class="footer">
        <el-button @click="submit" type="primary">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </div>
    </template>
    <template v-else>
      <div class="saveBox">
        <span class="save-icon"></span>
        <span>核销成功</span>
        <p class="autoClose">{{countdown}}秒后自动关闭</p>
      </div>
    </template>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";

export default {
  data() {
    return {
      code: 1,
      selfCode: "",
      showFooter: false,
      isSuccess: false,
      countdown: 5,
      isShowError:false,
      errorMsg:''
    };
  },
  created() {},
  methods: {
    close() {
      this.isShowError = false
    },
    cancelHandler() {
      this.isShowError = false
      this.visible = false
    },
    submit() {
      let self = this;
      if(self.selfCode===''){
        this.isShowError = true
        self.errorMsg='验证码不可为空！'
        return
      }else if(this.selfCode.length!=6){
        this.isShowError = true
         self.errorMsg='自提码为6位数字，请核对后重新输入！'
         return
      }
      //调取核销验证码接口
      this._apis.order.confirmVerifySelfLiftCode({
        verifyCode:this.selfCode,
        relationId:this.data,
        businessId:1
        })
      .then(res=>{
          if(res&&res.isSuccess){//自提码验证成功
            self.isShowError = false;
            self.isSuccess = true;
          let timer = setInterval(() => {
              self.countdown = self.countdown - 1;
              if (self.countdown == 0) {
              clearInterval(timer);
                this.visible = false;
              }
            }, 1000);
        //刷新订单页面
        if(this.$route.name == 'query') {
          this.$parent.$parent.getList()
        } else if(this.$route.name == 'orderDetail') {
          this.$parent.$parent.getDetail()
        } else if(this.$route.name == 'deliveryManagement') {
          this.$parent.getList()
        }
        }else{//自提码验证失败
           self.isShowError = true;
           self.errorMsg = res.msg
        }
      }).catch(err=>{
        this.$message({
            message: err,
            type: "error"
           });
      })
      
    },
    verifyCode() {},
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    DialogBase,
  },
};
</script>
<style lang="scss" scoped>
.container {
  width: 330px;
  margin: 0 auto;
  font-size: 16px;
  /deep/ .el-select {
    width: 330px;
  }
  /deep/ .el-dialog__body {
    padding-top: 20px;
  }
  .msgInfo {
    display: block;
    color: rgba(253, 76, 43, 1);
    font-size: 12px;
    margin-top: 5px;
  }
}
/deep/ .el-input {
  width: 330px;
  margin-top: 20px;
}
.footer {
  text-align: center;
  padding-top: 10px;
  margin-top: 30px;
}
.saveBox {
  width: 140px;
  margin: 0 auto;
}
.save-icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  background: url("../../../assets/images/order/success_save.png") no-repeat 0 0;
}
.save-icon + span {
  display: inline-block;
  margin-left: 16px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(68, 67, 75, 1);
  height: 32px;
  line-height: 32px;
  vertical-align: top;
}
.autoClose {
  color: rgba(146, 146, 155, 1);
  font-size: 12px;
  margin-left: 51px;
}
/deep/ .el-input.error .el-input__inner {
    border: 1px solid #FD4C2B;
    border-radius: 4px;
}
</style>


