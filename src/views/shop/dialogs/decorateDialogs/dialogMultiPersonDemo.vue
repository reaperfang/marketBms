/* 多人拼团示例弹框 */
<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'查看示例'" :showFooter="false">
    <div class="multi_wrapper">
      <p>当拼团商品总数多于所设置显示数量时，可勾选在商品列表底部显示“查看全部”，点击进入全部拼团商品列表页</p>
      <img src="../../../../assets/images/shop/multiPersonDemo.png" alt="">
    </div>
    <span class="dialog-footer fcc">
        <el-button type="primary" @click="submit">我知道啦</el-button>
    </span>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogMultiPersonDemo",
  components: {DialogBase},
  props: {
      data: {},
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
      this.$emit('dialogClosed');
    }
  }
};
</script>

<style lang="scss">
.multi_wrapper{
  text-align: center;
  p{
    font-size:22px;
    text-align:left;
    margin-bottom:20px;
  }
}
.dialog-footer{
  margin-top:40px;
}
</style>