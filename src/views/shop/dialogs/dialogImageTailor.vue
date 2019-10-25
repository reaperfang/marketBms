<template>
  <DialogBase :visible.sync="visible" width="600px" :title="'图片裁剪'" @submit="submit">
    <div class="cropper-content">
       <!-- <el-button @click="finish">裁剪</el-button> -->
      <div class="cropper" style="text-align:center;margin:10px 0;">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.outputSize"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :autoCropWidth="option.autoCropWidth"
          :autoCropHeight="option.autoCropHeight"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
        ></vueCropper>
      </div>
    </div>
    <img :src="imgUrl" alt="">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="裁剪尺寸：">
          <el-select v-model="sizeNum" placeholder="请选择">
          <el-option
            v-for="item in groupList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </DialogBase>
</template>

<script>
import { VueCropper }  from 'vue-cropper'
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
import axios from "axios";
export default {
  name: "dialogImageTailor",
  components: {DialogBase,VueCropper},
  props: {
      data:{},
      arrayData: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      imgUrl:"",
      form:{},
      sizeNum:'1',
      groupList:[
        {
          label:'800*800',
          value:'1'
        },
        {
          label:'800*640',
          value:'2'
        },
        {
          label:'640*800',
          value:'3'
        },
        {
          label:'582*166',
          value:'4'
        }
      ],


      // 裁剪组件的基础配置option
      option: {
        img: '', // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: 'jpeg', // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: false, // 是否开启截图框宽高固定比例
        fixedNumber: [7, 5], // 截图框的宽高比例
        full: true, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      },
      picsList: [],  //页面显示的数组
      // 防止重复提交
      loading: false,
      uploadData: null,
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server-base64/api_file_remote_upload.do`,
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
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  watch:{
    sizeNum(){
      this.groupList.map(item =>{
        if(item.value == this.sizeNum){
          let arr = item.label.split('*')
          this.option.autoCropWidth = parseInt(arr[0])
          this.option.autoCropHeight = parseInt(arr[1])
        }
      })
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      this.option.img = this.data;
    },

    submit() {
      this.$emit('submit',{imageTailor:{}})
      this.$refs.cropper.getCropData((data) => {
        let urlData = data.substring(23, data.length);
        axios.post(this.uploadUrl,"json={\"cid\":\""+ this.cid +"\", \"content\":\""+ encodeURI(urlData).replace(/\+/g,'%2B')+"\"}",{headers: {'Origin':'http'}}).then((response) => {
         let params = {
            id: this.arrayData[0],
            filePath: response.data.data.url,
            imgPixelWidth: response.data.data.width,
            imgPixelHeight: response.data.data.height
          }
          this._apis.file.editArticle(params).then((response) => {
            this.$notify({
              title: '成功',
              message: '图片裁剪成功',
              type: 'success'
            });
          }).catch((error) => {
            this.$notify.error({
              title: '错误',
              message: error
            });
          })
          // this.$emit('submit',{imageTailor:{}})
        }).catch((error) => {
          this.$notify.error({
            title: '错误',
            message: error
          });
        })
      })
    },    
  }
};
</script>

<style>

</style>


<style lang="scss" scoped>
.content{
  display: flex;
  justify-content: space-between;
}
.w250{
  width: 250px;
}
//圆形图片
.info {
    width: 720px;
    margin: 0 auto;
    .oper-dv {
      height:20px;
      text-align:right;
      margin-right:100px;
      a {
        font-weight: 500;
        &:last-child {
          margin-left: 30px;
        }
      }
    }
    .info-item {
      margin-top: 15px;
      label {
        display: inline-block;
        width: 100px;
        text-align: right;
      }
      .sel-img-dv {
        position: relative;
        .sel-file {
          position: absolute;
          width: 90px;
          height: 30px;
          opacity: 0;
          cursor: pointer;
          z-index: 2;
        }
        .sel-btn {
          position: absolute;
          cursor: pointer;
          z-index: 1;
        }
      }
    }
  }

 .cropper-content {
    .cropper {
        width: auto;
        height: 300px;
    }
}
  .upload{
    width: 80px;
    height: 35px;
    border-radius: 5px;
  }
</style>