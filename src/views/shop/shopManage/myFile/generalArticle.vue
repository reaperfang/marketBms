<template>
  <div class="main">
    <p class="title">创建普通图文</p>
    <div class="content">
      <div>
        <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="this.ruleForm.sourceMaterial"></RichEditor>
      </div>
      <div class="c_right">
        <p class="head">图文信息</p>
        <div class="bodys">
          <el-input v-model="ruleForm.title" @blur="titleNum" placeholder="标题请勿超过64个字，必填"></el-input>
          <p style="color:#FD4C2B;font-size:12px;margin-top:10px;text-align:left;" v-if="isSave">标题请勿超过64个字</p>
          <p class="mt10">封面图片</p>
          <img :src="ruleForm.fileCover" class="coverImage" v-if="ruleForm.fileCover">
          <p class="uploadImage">
            <el-upload
              class="upload-demo"
              v-loading="loading"
              :action="uploadUrl"
              :data="{json: JSON.stringify({cid: cid})}"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :before-remove="beforeRemove"
              multiple
              :limit="1"
              :on-exceed="handleExceed"
              :before-upload="beforeAvatarUpload"
              :on-success="handleAvatarSuccess"
              :show-file-list="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb，建议尺寸900*500</div>
            </el-upload>
            <el-button type="primary" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'" class="imgSource">图片素材</el-button>
          </p>
          <el-checkbox v-model="ruleForm.isCover" class="mt10">正文中显示封面</el-checkbox>
        </div>
      </div>
    </div>
    <p class="btns">
      <!-- <el-button type="primary">预览</el-button> -->
      <el-button type="primary" plain @click="_routeTo('fileManageIndex',{active:'articleMaterial'})">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </p>
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
  </div>
</template>

<script>
import dialogSelectImageMaterial from '../../dialogs/dialogSelectImageMaterial';
import RichEditor from '@/components/RichEditor';
export default {
  name: 'generalArticle',
  components: {dialogSelectImageMaterial, RichEditor},
  data () {
    return {
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        title: '',
        fileCover: '',
        isCover: false,
        sourceMaterial:''
      },
      loading:false,
      rules: {},
      fileList:[],
      fileData:'',
      checked:false,
      input:'',
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: 700
      },
      isSave:false
    }
  },
  created() {
    this.$route.query.id && this.getArticle()
  },
  computed:{
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
  },
  methods: {
    titleNum(){
      let lg = this.ruleForm.title.length
      this.isSave = lg > 64 ? true : false 
    },
    getArticle(){
      let query ={
        id:this.$route.query.id,
        sourceMaterialType:'1'
      }
      this._apis.file.getArticle(query).then((response)=>{
        this.ruleForm = {
          title: response.title,
          fileCover: response.fileCover,
          isCover: response.isCover == 1 ? true : false,
          sourceMaterial:response.sourceMaterial
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //保存
    save(){
      if(!this.isSave){
        let id = this.$route.query.id
        if(id){
          let query = {
            id:id,
            title: this.ruleForm.title,
            fileCover: this.ruleForm.fileCover,
            isCover: this.ruleForm.isCover,
            sourceMaterial:this.ruleForm.sourceMaterial
          }
          this._apis.file.editArticle(query).then((response)=>{
            this.$notify.success({
              title: '成功',
              message: '修改图文成功！'
            });
            this.$router.push({
              name: 'fileManageIndex',
              query:{active:'articleMaterial'}
            })
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          })
        }else{
          this._apis.file.saveArticle(this.ruleForm).then((response)=>{
            this.$notify.success({
              title: '成功',
              message: '创建图文成功！'
            });
            this.$router.push({
              name: 'fileManageIndex',
              query:{active:'articleMaterial'}
            })
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
          })
        }
      }else{
        return false
      }
    },
    beforeAvatarUpload(){
      this.loading = true
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      this.loading = false
      this.fileData = res.data
      this.ruleForm.fileCover = res.data.url
    },
     /* 
     * 富文本数据更新
    */
    editorValueUpdate(value) {
      this.ruleForm.sourceMaterial = value;
    },
    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.fileCover= dialogData.filePath;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  background:#fff;
  padding:20px;
}
.title{
  height: 50px;
  line-height: 50px;
}
.content{
  display:flex;
  justify-content:center;
  .c_right{
    width: 250px;
    border:1px solid #e6e6e6;
    margin-left: 30px;
    .head{
      height: 25px;
      line-height: 25px;
      background: #EFEFEF;
      padding-left: 10px;
    }
    .bodys{
      padding: 10px;
      .uploadImage{
        position: relative;
        .imgSource{
          position: absolute;
          top:30px;
          right:10px;
        }
      }
    }
  }
}
.coverImage{
  width: 230px;
  height: 230px;
}
.btns{
  text-align: right;
  margin-top: 10px;
  margin-right: 100px;
}
.mt10{
  margin-top: 10px;
}
</style>
