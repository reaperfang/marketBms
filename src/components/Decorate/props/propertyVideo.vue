<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="60px">
    <div class="block form">
      <el-form-item label="视频" prop="source">
        <el-radio-group v-model="source">
          <el-radio :label="1">选择视频</el-radio>
          <el-radio :label="2">粘贴视频地址 <span class="prop-message">小程序v2.15及以上版本支持</span></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" v-if="source === 1" prop="videoUrl">
        <div class="img_preview" v-if="ruleForm.videoUrl">
          <video
            :src="ruleForm.videoUrl"
            controls="controls"
            class="video"
            :autoplay="true"
            :poster="ruleForm.coverUrl"
          >您的浏览器不支持 video 标签。</video>
          <i class="delete_btn" @click.stop="deleteVideoUrl()"></i>
          <span @click="dialogVisible=true; currentDialog='dialogSelectVideo'">选择视频</span>
        </div>
        <div class="add_button" v-else @click="dialogVisible=true; currentDialog='dialogSelectVideo'">
          <i class="inner"></i>
          <p>添加视频</p>
        </div>
        <p class="prop-message" style="margin-top:5px;">视频大小不超过10mb；仅支持.mp4格式的播放地址</p>
      </el-form-item>
      <el-form-item label="" v-if="source === 2" prop="videoUrl">
        <el-input  v-model="ruleForm.videoUrl" placeholder="此处粘贴视频播放地址"></el-input>
        <p v-show="videoUrlError" style="color:#fd4c2b;margin-top:5px;font-size:12px;line-height:1;">您输入的视频格式有误，请您重新输入</p>
        <p class="prop-message" style="margin-top:5px;">视频大小不超过10mb；仅支持.mp4格式的播放地址</p>
      </el-form-item>
      <el-form-item label="封面图" v-if="ruleForm.videoUrl">
        <el-radio-group v-model="coverType">
          <el-radio :label="1" :disabled="!originAble">原视频封面</el-radio>
          <el-radio :label="2">自定义封面</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="coverUrl" v-if="ruleForm.videoUrl">
        <div v-if="ruleForm.coverUrl" class="img_preview">
          <img :src="ruleForm.coverUrl" alt="">
          <i class="delete_btn" @click.stop="deleteCoverUrl()" v-if="coverType === 2"></i>
          <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'" v-if="coverType === 2">更换图片</span>
        </div>
        <div v-else-if="coverType === 2" class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
          <i class="inner"></i>
          <p>添加图片</p>
        </div>
        <p class="prop-message">建议图片宽高比16:9</p>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @videoSelected="videoSelected"></component>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
import dialogSelectVideo from '@/components/dialogs/selectVideo/index';
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
export default {
  name: 'propertyVideo',
  mixins: [mixinPropsBase],
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
      originAble: true,
      videoUrlError: false
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
    },
    'ruleForm.videoUrl'(newValue) {
      if(!newValue) {
        this.$set(this.ruleForm, 'coverUrl', '');
        this.customCoverUrl = '';
        this.originCoverUrl = '';
      }else{
        if(this.utils.validate.validateMP4(newValue)){
          this.videoUrlError = false;
          this.$set(this.ruleForm, 'videoUrl', newValue);
        }else{
          this.videoUrlError = true;
          //this.$set(this.ruleForm, 'videoUrl', '');
        }
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
      this.coverType = 1;
      this.ruleForm.videoUrl= dialogData.filePath;
      this.originCoverUrl= dialogData.fileCover;
      this.$set(this.ruleForm, 'coverUrl', dialogData.fileCover);
    },

    /* 清除视频链接 */
    deleteVideoUrl() {
      this.$set(this.ruleForm, 'videoUrl', '');
    },
    
    /* 清除视频封面 */
    deleteCoverUrl() {
      this.customCoverUrl = '';
      this.$set(this.ruleForm, 'coverUrl', '');
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
