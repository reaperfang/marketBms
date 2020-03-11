<template>
  <DialogBase :visible.sync="visible" width="600px" title="上传图片" :showFooter="false">
    <el-form :model="form" class="demo-form-inline" label-width="90px">
        <el-form-item label="本地上传">
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
          <el-upload
            class="avatar-uploader"
            v-loading="loading"
            :action="uploadUrl"
            :show-file-list="false"
            :data="{json: JSON.stringify({cid: cid})}"
            :on-success="handleAvatarSuccess"
            @on-error="loading = false"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="note">仅支持jpg,jpeg,png格式，大小不超过3.0MB</p>
        </el-form-item>
        <el-form-item label="分组名称：">
          <el-cascader
          v-model="form.groupValue"
          :props="props"
          class="w_300"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <p class="txt_center">
          <el-button type="primary" @click="submit()">确 认</el-button>
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
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      form:{
        imageUrl:'',
        name:'',
        groupValue:["-1"],
        imageUrls:''
      },
      fileData:{},
      videoData:{},
      groupList:[],
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
              type:'0',
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
              self.$notify.error({
                title: '错误',
                message: error
              });
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
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  created() {

  },
  methods: {
   //上传图片
    submit(){
        let leg = this.form.groupValue.length
        let query ={
          fileGroupInfoId:this.form.groupValue[leg-1],
          data:[
            {
              fileName:this.fileData.original,
              filePath:this.fileData.url,
              imgPixelWidth:this.fileData.width,
              imgPixelHeight:this.fileData.height,
              fileSize:this.fileData.size,
              sign:this.fileData.sign
            }
          ]
        }
        this.$emit('submit',{uploadImage:{query:query}})
        this.visible = false
    },

    handleAvatarSuccess(res, file) {
      this.loading = false
      this.fileData = res.data
      this.form.imageUrl = res.data.url
    },

    beforeAvatarUpload(file) {
      this.loading = true
      const isJPG = file.type === 'image/jpg';
      const isJPEG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!(isJPG || isJPEG || isPNG)) {
        this.$message.error('上传图片支持jpg,jpeg,png格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 3MB!');
      }
      return isJPG || isJPEG || isPNG && isLt2M;
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
    border-color: #409EFF;
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
.txt_center{
  width: 100%;
  text-align: center;
  margin-top:20px;
}
.w_300{
  width: 300px;
}
</style>