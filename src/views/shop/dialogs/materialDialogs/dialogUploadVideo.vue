<template>
  <DialogBase :visible.sync="visible" width="600px" title="上传视频" :showFooter="false">
    <el-form :model="form" :rules="rules" ref="form" class="demo-form-inline" label-width="90px">
        <el-form-item label="本地上传">
          <video v-if="this.videoData.url !=undefined && !videoFlag"  
            :src="this.videoData.url"
            class="avatar video-avatar"
            controls="controls">您的浏览器不支持视频播放</video> 
          <el-upload class="avatar-uploader el-upload--text"
            :action="uploadUrl" 
            :data="{json: JSON.stringify({cid: cid})}"
            :show-file-list="false"
            accept=".mp4"
            :on-success="handleVideoSuccess" 
            :before-upload="beforeUploadVideo" 
            :on-progress="uploadVideoProcess"> 
            <i class="el-icon-plus avatar-uploader-icon"></i> 
          <!-- <i v-else-if="this.videoData.url =='' && !videoFlag"
            class="el-icon-plus avatar-uploader-icon"></i>   -->
          <el-progress v-if="videoFlag == true"
              type="circle"
              :percentage="videoUploadPercent">
          </el-progress>
          <!-- <el-button class="video-btn"
                slot="trigger"
                size="small"
                v-if="isShowUploadVideo"
                type="primary">选取文件</el-button> -->
          </el-upload>
          <p>视频大小不超过10mb，支持mp4格式</p> 
          <!-- <p>视频大小不超过10mb，支持mp4,mov,m4v,flv,x-flv,mkv,wmv,avi,rmvb,3gp格式</p> -->
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请勿超过20字" style="width:195px"></el-input>
        </el-form-item>
        <el-form-item label="分组">
          <el-cascader
          v-model="form.groupValue"
          :props="props"
          class="w_300"
          >
          </el-cascader>
        </el-form-item>
       <el-form-item label="封面">
          <el-upload
            class="avatar-uploader"
            v-loading="loading1"
            :action="uploadUrl"
            :show-file-list="false"
            :data="{json: JSON.stringify({cid: cid})}"
            @on-error="loading = false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrls" :src="form.imageUrls" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="note">建议尺寸：800*800像素，支持jpg,jpeg,png格式，大小不超过3.0MB。</p>
          <!-- <p class="note">如果不添加封面，系统会默认截取视频的第一个画面作为封面</p> -->
        </el-form-item>
      </el-form>
      <p class="txt_center">
          <el-button type="primary" @click="submit('form')">确 认</el-button>
          <el-button  @click="visible = false">取 消</el-button>
      </p>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase"
import utils from "@/utils"
export default {
  name: "dialogUploadImage",
  components: {DialogBase},
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    let self = this
    return {
      uploadUrl:`${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
      form:{
        imageUrl:'',
        name:'',
        groupValue:['-1'],
        imageUrls:''
      },
      rules:{
        name:[
           { required: true, message: '请输入名称', trigger: 'blur' },
        ]
      },
      fileData:{},
      videoData:{},
      // groupList:[],
      videoFlag:false , //是否显示进度条
		  videoUploadPercent:"", //进度条的进度，
      isShowUploadVideo:false,
      loading:false,
      loading1:false,
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          setTimeout(() => {
            let id = node.level == 0 ? '0' : node.data.value
            let query ={
              type:'1',
              parentId:id
            }
            self._apis.file.getGroup(query).then((response)=>{
              if(response == null){
                return resolve([]);
              }else{
                const nodes = response.map(item => ({
                  value: item.id,
                  label: item.name,
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes)
              }
            }).catch((error)=>{
              self.$message.error(error);
            })
          }, 500);
        }
      },
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
    },
    cid(){
        let shopInfo = this.$store.getters.shopInfos
        return shopInfo.id
    }
  },
  created() {
  
  },
  methods: {
   //上传视频
    submit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid && this.videoData.url !=undefined) {
            let leg = this.form.groupValue.length
            let query ={
              fileGroupInfoId:this.form.groupValue[leg-1],
              fileName:this.form.name,
              filePath:this.videoData.url,
              fileSize:this.videoData.size,
              name:this.videoData.original,
              fileCover:this.form.imageUrls,
              sign:'',
            }
            this.$emit('submit',{uploadVideo:{query:query}})
            this.visible = false
          }else{
            this.$message.warning('请上传视频或等待视频上传完成后保存')
          }
      })
    },

    handleCoverSuccess(res, file){
      this.loading1 = false
      this.fileData = res.data
      this.form.imageUrls = res.data.url
    },

    beforeAvatarUpload(file){
      this.loading1 = true
      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!(isJPG || isJPEG || isPNG) || !/\.jpg|\.jpeg|\.png|\.JPG|\.JPEG|\.PNG$/.test(file.name)) {
        this.$message.error('上传图片支持jpg,jpeg,png格式!');
        this.loading1 = false;
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 3MB!');
        this.loading1 = false;
        return false;
      }
      return true;
    },

    //上传成功回调
	  handleVideoSuccess (res, file) {
        this.isShowUploadVideo = true;
        this.videoFlag = false;
        this.videoUploadPercent = 0;
        if (res.status == "success") {
            this.videoData = res.data;
        } else {
            this.$message.error('视频上传失败，请重新上传！');
        }
    },
    //进度条
	  uploadVideoProcess (event, file, fileList) {
        this.videoFlag = true;
        this.videoUploadPercent = file.percentage.toFixed(0) * 1;
    },
    //上传前回调
	  beforeUploadVideo (file) {
        const isLt20M = file.size / 1024 / 1024 < 10;
        if (['video/mp4'].indexOf(file.type) == -1) { //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
            this.$message.error('请上传正确的视频格式');
            return false;
        }
        if (!isLt20M) {
            this.$message.error('上传视频大小不能超过10MB哦!');
            return false;
        }
        this.isShowUploadVideo = false;
    },
  }
}
</script>

<style lang="scss" scoped>
.note{
  font-size: 14px;
  color: #D3D8DF;
}
/deep/ .avatar-uploader{
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
}
/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
/deep/ .avatar-uploader .el-upload:hover {
    border-color: #655EFF;
  }
/deep/ .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    position: absolute;
    top:10px;
    left:10px;
    z-index: 10;
  }
/deep/ .avatar {
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
/deep/ img{
      width: 80px;
      height: 80px;
      object-fit:fill;
      display: inline-block;
    }
  }
/deep/ .el-progress-circle{
  width: 80px !important;
  height: 80px !important;
}
.txt_center{
  width: 100%;
  text-align: center;
  margin-top:20px;
}
</style>