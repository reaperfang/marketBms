<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="70px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="视频" prop="source">
        <el-radio-group v-model="source">
          <el-radio :label="1">选择视频</el-radio>
          <el-radio :label="2">粘贴视频地址(小程序v2.15<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;及以上版本支持)</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-if="source === 1" prop="videoUrl">
        <div class="img_preview" v-if="ruleForm.videoUrl">
          <video
            :src="ruleForm.videoUrl"
            controls="controls"
            class="video"
            :poster="ruleForm.videoUrl"
          >您的浏览器不支持 video 标签。</video>
          <span @click="dialogVisible=true; currentDialog='dialogSelectVideo'">选择视频</span>
        </div>
        <div class="add_button" v-else @click="dialogVisible=true; currentDialog='dialogSelectVideo'">
          <i class="inner"></i>
        </div>
        建议视频宽高比16：9
      </el-form-item>
      <el-form-item label="" v-if="source === 2" prop="videoUrl">
        <el-input  v-model="ruleForm.videoUrl" placeholder="此处粘贴视频播放地址"></el-input>
        仅支持.mp4格式的播放地址
      </el-form-item>
      <el-form-item label="封面图">
        <el-radio-group v-model="coverType">
          <el-radio :label="1" :disabled="!originAble">原视频封面</el-radio>
          <el-radio :label="2">自定义封面</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="coverUrl">
        <div v-if="ruleForm.coverUrl" class="img_preview">
          <img :src="ruleForm.coverUrl" alt="">
          <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'" v-if="coverType === 2">更换图片</span>
        </div>
        <div v-else-if="coverType === 2" class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
          <i class="inner"></i>
        </div>
        建议图片宽高比16:9
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @videoSelected="videoSelected"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectVideo from '@/views/shop/dialogs/dialogSelectVideo';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
export default {
  name: 'propertyVideo',
  mixins: [propertyMixin],
  components: {dialogSelectVideo, dialogSelectImageMaterial},
  data () {
    return {
      source: 1,
      coverType: 1,
      originCoverUrl: '',
      customCoverUrl: '',
      ruleForm: {
        videoUrl: '',//视频地址
        coverUrl: ''//封面图地址
      },
      rules: {

      },
      dialogVisible: false,
      currentDialog: '',
      originAble: true
    }
  },
  watch: {
    coverType(newValue) {
      if(newValue == 1) {
        this.$set(this.ruleForm, 'coverUrl', this.originCoverUrl);
      }else if(newValue == 2) {
        this.$set(this.ruleForm, 'coverUrl', this.customCoverUrl);
      }
    },
    source(newValue) {
      if(newValue == 1) {
        this.originAble = true;
      }else if(newValue == 2) {
        this.originAble = false;
        this.coverType = 2;
        this.$set(this.ruleForm, 'coverUrl', this.customCoverUrl);
      }
    }
  },
  methods: {
    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.customCoverUrl= dialogData.filePath;
      this.$set(this.ruleForm, 'coverUrl', dialogData.filePath);
    },


    /* 弹框选中视频 */
    videoSelected(dialogData) {
      this.ruleForm.videoUrl= dialogData.filePath;
      this.originCoverUrl= dialogData.fileCover;
       this.$set(this.ruleForm, 'coverUrl', dialogData.fileCover);
    }
  }
}
</script>

<style lang="scss">
.img_preview{
  video{
    width: 80px;
    height: 80px;
  }
}
</style>
