<template>
  <div>
    <el-dialog
      title="请选择您要打印配送单类型"
      :visible.sync="printDialogVisible"
      width="500px"
      top="calc((100vh - 300px) / 2)"
      center
      :close-on-click-modal="false"
      >
      <div class="printBody">
        <el-radio v-model="printRadio" :label="1">小票配送单</el-radio>
        <el-radio v-model="printRadio" :label="2">配送单（A4纸）</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" :disabled="disabledSure" :loading="false" @click="handleSubmit">确 定</el-button>
        <el-button size="medium" @click="handleCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "dialogPrintList",
    props: ["printDialogVisible","printPath","printQuery"],
    // props: {
    //   printDialogVisible: {
    //     type: Boolean,
    //     default: false
    //   },
    //   printPath:{
    //     type:String,
    //     default:''
    //   },
    //   printQuery:{
    //     type:Object,
    //     default:{}
    //   }
    // },
    computed: {
      disabledSure() {
        if(this.printRadio == null){return true}
      }
    },
    data() {
      return {
        printRadio:null,
      };
    },
    methods: {
      handleSubmit() {
        // console.log(this.printType);
        // console.log(this.printPath)
        // console.log(this.printQuery)

        //小票配送单
        if(this.printRadio==1){
          this._apis.order.getPrinterSetDetail().then(res => {
            console.log(res)
            if(!!res){
              //printType 0：最后一次发货(入口:从发货后打印配送单)；1：所有发货(入口:批量打印配送单)
              this.$router.push({path:'/order/printPreview',query:this.printQuery})
            }else{
              this.$router.push({path:'/order/printerSeting',query:this.printQuery})
            }
          })
          .catch(error => {});
          // 
        }
        //A4纸配送单
        if(this.printRadio==2){
          this.$router.push({
            path: this.printPath,
            query: this.printQuery
          })
        }
        this.$emit("closeDialogVisible")
        setTimeout(()=>{this.printRadio=null},1000)
      },
      handleCancel(){
        this.printRadio = null;
        this.$emit("closeDialogVisible")
      }
    }
  };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-dialog{
  height: 300px;
  box-shadow:0px 5px 20px 0px rgba(0,0,0,0.1);
  border-radius:10px;
  border:1px solid #CCCCCC;
}
/deep/ .el-dialog__header{
  height: 60px;
  padding: 0 24px 0 20px;
  background: #F1F0FF;
  border-radius:10px 10px 0px 0px;
  text-align: left;
}
/deep/ .el-dialog__title{
  line-height: 60px;
  font-size: 22px;
  color: #44434B;
  font-weight: 400;
}
/deep/ .el-icon-close:before{
  content:'';
  background: url('~@/assets/images/icon_delete_@2x.png') no-repeat center center;
  background-size: cover;
  width: 18px;
  height: 18px;
  display: block;
}
/deep/ .el-dialog__body{
   padding: 70px 0px 86px;
}
.printBody{
  display: flex;
  justify-content: space-around;
}
/deep/ .el-dialog__footer {
    padding: 1px 0px 30px;
}
</style>