<template>
  <DialogBase :visible.sync="visible" width="500px" :title="''" @submit="submit">
      <div class="content">
        <img src="../../../../assets/images/tips.png" alt="">
        <div class="dialog_cont">
          <span>删除将不能恢复，确定要删除吗？</span>
        </div>
      </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogDelete",
  components: {DialogBase},
  data() {
    return {}
  },
  props: {
      data:{
        type: Object,
        required: true
      },
      arrayData:{
        type:Array,
        required: true
      },
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    }
  },
  methods: {
    submit() {
      if(this.data.type == 'groupId'){
        this.$emit('submit',{deleteGroup:{groupId:this.data.id}})
      }else if(this.data.type == 'articleId'){
        this.$emit('submit',{deleteActicle:{articleId:this.data.id}})
      }else{
        this.$emit('submit',{deleteImage:{imageId:this.arrayData}})
      }
    }
  },

}
</script>

<style lang="scss" scoped>
.content{
  line-height: 30px;
  font-size: 14px;
  color: #443D4A;
  display: flex;
  img{
    display: inline-block;
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
  }
  .dialog_cont{
    padding-left: 16px;
    font-size: 16px;
    font-weight: 500;
    color: #44434b;
    font-family: PingFangSC-Medium, PingFang SC;
  }
}
/deep/ .el-dialog__header{
  background: #fff;
}
/deep/ .el-dialog__body{
  padding: 10px 40px 0px;
}
/deep/ .el-dialog__footer{
  padding: 60px 40px 35px 0px;
  /deep/ .dialog-footer{
    justify-content: flex-end;
  }
}

</style>
