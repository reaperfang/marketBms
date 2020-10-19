<template>
  <DialogBase :visible.sync="visible" width="500px" :title="dialogTitle" :showFooter="false">
    <div class="content">
    <img src="../../../../assets/images/tips.png" alt="">
    <p class="dialog_cont">确定删除该分组吗？</p>
    </div>
    <div  class="dialog-footer">
      <el-button type="primary" @click="submit()">确 认</el-button>
      <el-button  @click="visible = false">取 消</el-button>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
export default {
  name: "dialogGroupsDel",
  components: {DialogBase},
  props: {
      typeData:{},
      dialogTitle:{},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
     
    };
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
  created() {
  },
  methods: {
    submit() {
      this.visible = false
      this.$emit('submit',{delete:{node:this.typeData.node,currentData:this.typeData.currentData}})
    }
  }
};
</script>

<style>

</style>


<style lang="scss" scoped>
.w250{
  width: 250px;
}
.content{
  height: 30px;
  line-height: 30px;
  text-align: center;
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
.dialog-footer{
  margin-top:30px;
  text-align: center;
}
</style>