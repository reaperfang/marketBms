/*店铺信息 */
<template>
    <div class="shopInfo">
        <h1>基本信息</h1>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="商户名称:" prop="shopName">
                <el-input v-model="form.shopName" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="主营类目:">
              {{form.business}}
            </el-form-item>
            <el-form-item label="创建日期:">
              {{new Date(form.createTime*1) | formatDate('yyyy-MM-dd hh:mm:ss')}}
            </el-form-item>
            <el-form-item label="商户LOGO:">
                <span v-if="form.logo" class="avatar">
                  <img :src="form.logo">
                  <canvas ref="canvas1" width="80px" height="80px" v-show="false"></canvas>
                </span>
                <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :data="{json: JSON.stringify({cid: cid})}"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus avatar-uploader-icon"></i>
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                </el-upload>
                <p class="note">logo支持jpg、jpeg、png格式内容；建议大小300px*300px图片大小不得大于2M</p>
            </el-form-item>
            <el-form-item label="客服电话:" prop="phone">
                <!-- <el-input v-model="form.phone" placeholder="区号" style="width:70px;"></el-input>
                —— -->
                <el-input v-model="form.phone" placeholder="如输入手机号，不填区号" style="width:200px;"></el-input>
            </el-form-item>
            <el-form-item label="联系地址:" prop="address">
                <area-cascader :level="1" :data='$pcaa' v-model='form.addressCode' style="width:200px;"></area-cascader>
                <!-- <el-cascader :options="area" v-model="form.address" expand-trigger="hover"/> -->
                <el-input v-model="form.address" style="width:300px; margin-top:10px;" placeholder="详细地址"/>
            </el-form-item>
            <el-form-item label="店铺简介:" prop="shopIntroduce">
              <el-input
                type="textarea"
                :rows="5"
                placeholder="请输入内容"
                v-model="form.shopIntroduce"
                style="width:300px;">
              </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '店铺信息', '默认页面', '保存']">保存</el-button>
            </el-form-item>
        </el-form>
    </div>    
</template>
<script>

import axios from "axios";
export default {
  name: 'shopInfo',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value && (!(/^[1][34578]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11) || (!(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/).test(value))){
        callback(new Error('手机或电话号码不符合规范'))
      } else {
        callback();
      }
    };
    return {
      form: {
          shopName: '',
          logo:'',
          logoCircle:'',
          phone:'',
          addressCode:[],
          address:'',
          shopIntroduce:''
      },
      rules: {
        shopName: [
          { required: true, message: '请输入商户名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        phone:[
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        addressCode:[
          { required: true, message: '请输入联系地址', trigger: 'blur' },
        ],
        address:[
          { required: true, message: '请输入详细地址', trigger: 'blur' },
        ],
        shopIntroduce:[
          {min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur'}
        ]
      },
      imageUrl: '',
      area: [],
      shopInfo:{},
      uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      uploadUrlBase64: `${process.env.UPLOAD_SERVER}/web-file/file-server-base64/api_file_remote_upload.do`,
      //canvas:{}
    }
  },
  components: {},
  watch: {
    
  },
  computed: {
    canvas() {
      return this.$refs.canvas1
    },
    cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
    }
  },
  created() {
    this.getShopInfo()
  },
  mounted() {

  },
  methods: {
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.form = response
        if(response.provinceCode){
          let arr = []
          arr.push(response.provinceCode)
          arr.push(response.cityCode)
          arr.push(response.areaCode)
          this.form.addressCode = arr
        }
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.cid
            let data = {
              id:id,
              shopName:this.form.shopName,
              logo:this.form.logo,
              logoCircle:this.form.logoCircle,
              phone:this.form.phone,
              provinceCode:this.form.addressCode[0],
              cityCode:this.form.addressCode[1],
              areaCode:this.form.addressCode[2],
              address:this.form.address,
              shopIntroduce:this.form.shopIntroduce
            }
            this._apis.set.updateShopInfo(data).then(response =>{
              this.$notify.success({
                title: '成功',
                message: '保存成功！'
              });
            }).catch(error =>{
              this.$notify.error({
                title: '错误',
                message: error
              });
            })
          }
      })
    },

    handleAvatarSuccess(res, file) {
      this.form.logo = res.data.url;
      //圆形图片处理
      var ctx = this.canvas.getContext('2d'); 
      let _self = this
      var img = new Image();
      img.setAttribute("crossOrigin",'Anonymous')
      img.onload = function () {
          ctx.beginPath();
          // 绘制圆，参数（x坐标，y坐标，圆半径，起始角度，终止角度）
          ctx.arc(40, 40, 40, 0, 2*Math.PI);
          ctx.save();
          // 剪切形状
          ctx.clip();
          // 绘制头像，参数（图片资源，x坐标，y坐标，宽度，高度）
          ctx.drawImage(img, 0, 0, 80, 80);
          ctx.restore();
          ctx.closePath();
          let base64 = _self.canvas.toDataURL("image/png"); 
          let urlData = base64.substring(22, base64.length);          
          _self.uploadCircle(urlData)
      }
      img.src = res.data.url;
    },

    uploadCircle(urlData){
      axios.post(this.uploadUrlBase64,"json={\"cid\":\""+this.cid+"\", \"content\":\""+ encodeURI(urlData).replace(/\+/g,'%2B')+"\"}",{headers: {'Origin':'http'}}).then((response) => {
        this.form.logoCircle = response.data.data.url
      }).catch((error) => {
        console.log(error);
      })
    },

    beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpg';
        const isJPEG = file.type === 'image/jpeg';
        const isPNG = file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!(isJPG || isJPEG || isPNG)) {
            this.$message.error('上传头像图片只能是JPG、JPEG、PNG格式!');
        }
        if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG || isJPEG || isPNG && isLt2M;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar-uploader{
  width: 80px;
  height: 80px;
  display: inline-block;
  vertical-align: middle;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    display: inline-block;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
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
  .avatar {
    width: 80px;
    height: 80px;
    display: inline-block;
    vertical-align: middle;
    img{
      width: 80px;
      height: 80px;
      object-fit:fill;
      display: inline-block;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.shopInfo{
   width: 100%;
   height: 100%;
   background: #fff; 
   padding: 20px;
   h1{
       font-size:14px;
       color: #3D434A;
       font-weight:500;
       margin-bottom: 30px;
     }
}
/deep/ .area-select .area-selected-trigger{
  padding:0 0 0 10px;
}
.note{
  color: #92929B;
}
</style>
