<template>
  <p>微信图文
    <el-button type="text" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">图片素材</el-button>
    {{ruleForm.coverUrl}}
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
  </p>
</template>

<script>
import dialogSelectImageMaterial from '../../dialogs/dialogSelectImageMaterial';
export default {
  name: 'wechatArticle',
  components: {dialogSelectImageMaterial},
  data () {
    return {
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        articleTitle: '',
        articleAnthor: '',
        articleSummary: '',
        originLink: '',
        coverUrl: '',
        showCover: true,
        syncToWechat: true 
      },
      rules: {}
    }
  },
  created() {

  },
  methods: {
    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.coverUrl= dialogData.filePath;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
