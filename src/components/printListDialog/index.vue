<template>
  <div>
    <el-dialog
      title="请选择您要打印配送单类型"
      :visible.sync="printDialogVisible"
      width="480px"
      :close-on-click-modal="false"
      >
      <div class="printBody">
        <el-radio v-model="printRadio" :label="1">小票配送单</el-radio>
        <el-radio v-model="printRadio" :label="2">配送单（A4纸）</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" :disabled="disabledSure" @click="handleSubmit">确 定</el-button>
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
        // console.log(this.printPath)
        // console.log(this.printQuery)
        //小票配送单
        if(this.printRadio==1){
          this.$router.push({path:'/order/printerSeting'})
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
/deep/ .el-dialog__title{
  font-size: 16px;
}
/deep/ .el-dialog__body{
   border-top: 1px solid #eee;
   border-bottom: 1px solid #eee;
   padding: 70px 20px;
}
.printBody{
  display: flex;
  justify-content: space-around;
}
</style>