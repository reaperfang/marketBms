/* 商品搜索示例弹框 */
<template>
  <DialogBase :visible.sync="visible" width="415px" :title="'查看示例'">
    <img src="../../../../assets/images/shop/searchDemo.png" alt="">
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogGoodsSearchDemo",
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
  }
};
</script>

<style lang="scss">
</style>