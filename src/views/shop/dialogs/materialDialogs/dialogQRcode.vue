<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'预览二维码'" :showFooter="false">
      <div class="content">
        <div id="qrcode" ref="qrcode" style="margin-left:155px;"></div>
        <p>请用微信扫描上方二维码预览</p>
        <el-button type="primary" plain @click="lookArticle">预览文章</el-button>
      </div>
  </DialogBase>
</template>

<script>
import QRCode from 'qrcodejs2'
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSync",
  components: {DialogBase},
  data() {
    return {
      qrCode:'',
    }
  },
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
      data:{
        type: Object,
        required: true
      }
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
  created(){
    this.$nextTick(() => {
    this.qrcode()
    })
  },
  methods: {
    qrcode () {
      let qrcode = new QRCode('qrcode',{
        width: 150, // 设置宽度，单位像素
        height: 150, // 设置高度，单位像素
        text: this.data.url // 设置二维码内容或跳转地址
      })
    },

    lookArticle(){
      window.location.href = this.data.url
    }
  },

}
</script>

<style lang="scss" scoped>
.content{
  margin: 0 auto;
  text-align: center;
  p{
    line-height: 40px;
  }
}
</style>
