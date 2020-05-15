<template>
  <DialogBase :visible.sync="visible" width="800px" title="上传图片" :showFooter="false">
    <div class="img_list">
    <div class="title">
      本地上传
      <span>一次最多上传100张图片，仅支持jpg,jpeg,png格式，大小不超过3.0MB</span>
    </div>
    <el-form :model="form" class="demo-form-inline mt20">
      <el-form-item label="分组">
        <el-cascader v-model="form.groupValue" :props="props" class="w_300"></el-cascader>
      </el-form-item>
      <el-form-item>
        <!-- <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar"> -->
        <!-- <el-upload
            class="avatar-uploader"
            v-loading="loading"
            :action="uploadUrl"
            list-type="picture-card"
            :show-file-list="true"
            :data="{json: JSON.stringify({cid: cid})}"
            :on-success="handleAvatarSuccess"
            @on-error="loading = false"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>-->
        <!--multiple：上传多张图片  -->
        <el-upload
          class="upload-demo"
          :action="uploadUrl"
          :data="{json: JSON.stringify({cid: cid})}"
          :limit="100"
          :multiple="true"
          list-type="picture-card"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :on-exceed="handleDelet"
          v-model="form.images"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    </div>
    <p class="txt_center">
      <el-button type="primary" @click="submit()">确 认</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </p>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogUploadImage",
  components: { DialogBase },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    let self = this;
    return {
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      form: {
        imageUrl: "",
        name: "",
        groupValue: ["-1"],
        images: []
      },
      fileData: {},
      videoData: {},
      groupList: [],
      videoFlag: false, //是否显示进度条
      videoUploadPercent: "", //进度条的进度，
      isShowUploadVideo: false,
      loading: false,
      loading1: false,
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          setTimeout(() => {
            let id = node.level == 0 ? "0" : node.data.value;
            let query = {
              type: "0",
              parentId: id
            };
            self._apis.file
              .getGroup(query)
              .then(response => {
                if (response == null) {
                  return resolve([]);
                } else {
                  const nodes = response.map(item => ({
                    value: item.id,
                    label: item.name
                  }));
                  // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                  resolve(nodes);
                }
              })
              .catch(error => {
                self.$message.error(error);
              });
          }, 500);
        }
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  created() {},
  methods: {
    //上传图片
    submit() {
      let leg = this.form.groupValue.length;
      let query = {
        fileGroupInfoId: this.form.groupValue[leg - 1],
        data: this.form.images
      };
      this.$emit("submit", { uploadImage: { query: query } });
      this.visible = false;
    },

    handleAvatarSuccess(res, file) {
      if (res.status == "success") {
        this.loading = false;
        this.fileData = res.data;
        let imgObj = {
            fileName: this.fileData.original,
            filePath: this.fileData.url,
            imgPixelWidth: this.fileData.width,
            imgPixelHeight: this.fileData.height,
            fileSize: this.fileData.size,
            sign: this.fileData.sign
          }
        this.form.images.push(imgObj);
      } else {
        this.$message.error(res.msg);
      }
    },

    beforeAvatarUpload(file) {
      this.loading = true;
      const isJPG = file.type === "image/jpg";
      const isJPEG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 3;
      if (!(isJPG || isJPEG || isPNG)) {
        this.$message.error("上传图片支持jpg,jpeg,png格式!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过3MB!");
        return false
      }
      return true
    },
    /* 上传文件超出个数限制时的钩子 */
    handleDelet(files, fileList) {
      this.$message.error("最多支持上传100张！");
    },

    handleRemove(file, fileList) {
      this.form.images.map((item, index) => {
        if (item.fileName == file.name) {
          this.form.images.splice(index,1);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.title{
  color: #443D4A;
  font-size: 14px;
  span{
    font-size: 14px;
    color:#D3D3D3;
    margin-left:30px;
  }
}
.mt20{
  margin-top:20px;
}
.img_list{
  height: 300px;
  overflow-y: scroll;
}
/deep/ .el-upload {
  display: inline-block;
}
/deep/ .avatar-uploader {
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
  top: 10px;
  left: 10px;
  z-index: 10;
}
/deep/ .avatar {
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
  /deep/ img {
    width: 80px;
    height: 80px;
    object-fit: fill;
    display: inline-block;
  }
}
/deep/ .el-upload--picture {
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  float: left;
  margin-right: 8px;
}
/deep/ .el-upload--picture > i {
  font-size: 28px;
  color: #8c939d;
}
// /deep/ .el-upload-list--picture{
//   float: left;
// }
/deep/ .el-upload-list--picture .el-upload-list__item {
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  width: 80px;
  height: 80px;
  margin: 0 8px 8px 0;
  display: inline-block;
  padding: 0px;
  float: left;
}
/deep/ .el-upload-list--picture .el-upload-list__item-thumbnail {
  width: 100%;
  height: 100%;
  margin-left: 0px;
}
/deep/ .el-upload-list--picture .el-upload-list__item-status-label {
  z-index: 999;
}
/deep/ .el-upload-list__item .el-icon-close {
  z-index: 999;
}
/deep/.el-dialog__body{
  padding: 15px 20px;
}
.txt_center {
  width: 100%;
  text-align: center;
  margin-top: 20px;
}
.w_300 {
  width: 300px;
}
</style>