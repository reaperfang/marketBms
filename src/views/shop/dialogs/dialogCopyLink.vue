<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'图片链接'" :showFooter="showFooter">
    <el-input v-model="link">
        <el-button 
        slot="append" 
        v-clipboard:copy="data"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError">
        复制
        </el-button>
    </el-input>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogCopyLink",
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
      link:this.data,
      showFooter:false
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
    onCopy () {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
    //   this.snackBar.info(this.$t('prompt.copySuccess'))
    },
    onError () {
      this.$message.error(this.$t('prompt.copyFail'))
    }
  }
};
</script>

<style>

</style>


<style lang="scss" scoped>

</style>