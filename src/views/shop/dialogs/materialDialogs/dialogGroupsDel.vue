<template>
  <DialogBase :visible.sync="visible" width="500px" :title="dialogTitle" :showFooter="false">
    <p class="content">确定删除该分组吗？</p>
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
      this.$emit('submit',{delete:{}})
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
}
.dialog-footer{
  margin-top:30px;
  text-align: center;
}
</style>