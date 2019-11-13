/*微信设置 */
<template>
    <div class="main">
        <h1>
          微信支付信息设置
          <span style="color:#FC3D42;font-size:12px;">
            如果开通支付，公众号和小程序的appid依据自己开通的售卖渠道必须填写一项
          </span>
        </h1>
        <el-form ref="form" :model="form" :rules="rules">
            <!-- <el-form-item label="微信商户名称:" prop="mchName">
                <el-input v-model="form.mchName" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item> -->
            <el-form-item prop="appId">
                <span class="require">公众号（AppId）:</span>
                <el-input v-model="form.appId" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item prop="mpAppId">
                <span class="require">小程序（AppId）:</span>
                <el-input v-model="form.mpAppId" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="支付商户号（Mch_Id）:" prop="channelMchId" label-width="180px">
                <el-input v-model="form.channelMchId" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="支付密钥（APIKEY）:" prop="key" label-width="180px">
                <el-input v-model="form.key" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="证书密码:" prop="certPassword" label-width="180px">
                <el-input v-model="form.certPassword" style="width:250px;" placeholder="请输入"></el-input>
            </el-form-item>

            <!-- <el-form-item label="CERT证书文件" prop="certLocalPath">
            <div class="upload_file">
                <span class="tip">{{form.certFileName}}</span>
                <el-upload
                :action="uploadUrl"
                :data="{json: JSON.stringify({cid: cid})}"
                :before-upload="handleCertFileUrlOk"
                :on-success="uploadCertFileUrl"
                :show-file-list="false"
                v-loading="loading3"
                v-model="form.certLocalPath">
                <span class="handle" v-if="certFileUrlOk || form.certFileName">选择文件</span>
                </el-upload>
            </div>
            <div class="tip" v-if="certFileUrlOk">
                <span class="status">未上传</span>下载证书cert.zip中的apiclient_cert.p12文件
            </div>
            </el-form-item> -->

            <el-form-item label="CERT证书文件:" prop="certBase64Content" label-width="180px">
              <input type="file"  @change="fileChange" style="width:75px;">
              <span>{{form.certFileName}}</span>
            </el-form-item>
            <!-- <el-form-item label="KEY秘钥文件" prop="keyLocalPath">
            <div class="upload_file">
                <span class="tip">{{form.keyFileName}}</span>
                <el-upload
                :action="uploadUrl"
                :data="{json: JSON.stringify({cid: 222})}"
                :before-upload="handlKeyFileUrlOk"
                :on-success="uploadKeyFileUrl"
                :show-file-list="false"
                v-loading="loading2"
                v-model="form.keyLocalPath">
                <span class="handle" v-if="keyFileUrlOk || form.keyFileName">选择文件</span>
                </el-upload>
            </div>
            <div class="tip" v-if="keyFileUrlOk">
              <span class="status">未上传</span>下载证书cert.zip中的apiclient_key.pem文件
            </div>
            </el-form-item>
             -->
            <el-form-item label-width="180px">
                <el-button type="primary" @click="onSubmit('form')">保存</el-button>
                <el-button  @click="_routeTo('payType')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>    
</template>

<script>
// import { listArea } from '@/api/area'
export default {
  name: 'wxSet',
  data() {
    return {
      form: {
          appId: '',
          mpAppId:'',
          key:'',
          // mchName: '',
          channelMchId: '',
          certPassword: '',
          certFileName:'',
          // certLocalPath: '',
          keyFileName:'',
          certBase64Content:''
          // keyLocalPath: ''
      },
      rules: {
        // mchName: [
        //   { required: true, message: '请输入微信商户名称', trigger: 'blur' },
        //   { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        // ],
        channelMchId:[
          { required: true, message: '请输入微信商户号', trigger: 'blur' },
        ],
        // appId:[
        //   { required: true, message: '请输入公众号AppId', trigger: 'blur' },
        // ],
        // mpAppId:[
        //   { required: true, message: '请输入小程序AppId', trigger: 'blur' },
        // ],
        key:[
          { required: true, message: '请输入密钥', trigger: 'blur' },
        ],
        // certLocalPath:[
        //   { required: true, message: '请输入CERT证书文件', trigger: 'blur' },
        // ],
        certBase64Content:[
          { required: true, message: '请输入CERT证书文件', trigger: 'blur' },
        ],
        // keyLocalPath:[
        //   { required: true, message: '请输入KEY秘钥文件', trigger: 'blur' },
        // ]
      },
      id:'',
      imageUrl: '',
      area: [],
      uploadUrl:`${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
      loading2:false,
      loading3:false,
      keyFileUrlOk:true,
      certFileUrlOk:true,
    }
  },
  components: {},
  watch: {
    
  },
  computed:{
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        },
        shopName(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.shopName
        }
    },
  created() {
    this.getShopPayInfo()
  },
  methods: {
    //上传文件转化为base64格式
    fileChange(e) {
        let file = e.target.files[0]
        console.log('file',file)
        this.form.certFileName = file.name
        let _self = this
        var reader = new FileReader();
        reader.onload = (function (file) {
          return function (e) {
              _self.form.certBase64Content = this.result.replace(' ','+')
              // console.info('result',this.result); //这个就是base64的数据了
            };
        })(e.target.files[0]);
        reader.readAsDataURL(e.target.files[0]);
    },

    getShopPayInfo(){
      let query = {
        mchId:this.cid,
        channelId:'WX_JSAPI',
      }
      this._apis.set.getShopPayInfo(query).then(response =>{
        this.id = response.id
        let param = JSON.parse(response.param)
        this.form.channelMchId = response.channelMchId
        this.form.appId = param.appId
        this.form.key = param.key
        // this.form.certLocalPath = param.certLocalPath
        this.form.certPassword = param.certPassword
        this.form.mpAppId = param.mpAppId
        // this.form.keyLocalPath = param.keyLocalPath
        this.form.certFileName = param.certFileName
        this.form.keyFileName = param.keyFileName
        this.form.certBase64Content = param.certBase64Content
        // this.form.certLocalPath && (this.certFileUrlOk = false)
        // this.form.keyLocalPath && (this.keyFileUrlOk = false)
      }).catch(error =>{
        this.$notify.info({
          title: '提示',
          message: '商户未设置支付信息'
        });
      })
    },

    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid && this.form.appId || this.form.mpAppId) {
          this.id ? this.updateShopPayInfo() : this.addShopPayInfo()
        }else{
          this.$notify.error({
          title: '提示',
          message: '如果开通支付，公众号和小程序的appid依据自己开通的售卖渠道必须填写一项'
        });
        }
      })   
    },
    //修改商户支付信息
    updateShopPayInfo(){
      let param = {
        mchId:this.form.channelMchId,
        appId:this.form.appId,
        key:this.form.key,
        // certLocalPath:this.form.certLocalPath,
        certPassword:this.form.certPassword,
        mpAppId:this.form.mpAppId,
        // keyLocalPath:this.form.keyLocalPath,
        certFileName:this.form.certFileName,
        keyFileName:this.form.keyFileName,
        certBase64Content:this.form.certBase64Content
      }
      let query = {
        id:this.id,
        mchId:this.cid,
        channelId:'WX_JSAPI',
        // mchName:this.$store.user.userInfo.shopName,
        mchName:this.shopName,
        channelName:'WX',
        channelMchId:this.form.channelMchId,
        param:JSON.stringify(param)
      }
      this._apis.set.updateShopPayInfo(query).then(response =>{
        this.updateWechatBinding()
        this.$notify.success({
          title: '成功',
          message: '保存成功！'
        });
        this.getShopPayInfo()
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },



    //添加商户支付信息
    addShopPayInfo(){
      let param = {
        mchId:this.form.channelMchId,
        appId:this.form.appId,
        key:this.form.key,
        // certLocalPath:this.form.certLocalPath,
        certPassword:this.form.certPassword,
        mpAppId:this.form.mpAppId,
        // keyLocalPath:this.form.keyLocalPath,
        certFileName:this.form.certFileName,
        keyFileName:this.form.keyFileName,
        certBase64Content:this.form.certBase64Content
      }
      let query = {
        mchId:this.cid,
        channelId:'WX_JSAPI',
        // mchName:this.$store.user.userInfo.shopName,
        mchName:this.shopName,
        channelName:'WX',
        channelMchId:this.form.channelMchId,
        param:JSON.stringify(param)
      }
      this._apis.set.addShopPayInfo(query).then(response =>{
        this.updateWechatBinding()
        this.$notify.success({
          title: '成功',
          message: '保存成功！'
        });
        this.getShopPayInfo()
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    updateWechatBinding(){
      let id = this.cid
      let query = {
        id:id,
        wechatBinding:1
      }
      this._apis.set.updateShopInfo(query).then(response =>{
        
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
.main{
    width: 100%;
    background: #fff;
    padding:20px;
    h1{
        font-size: 16px;
        margin-bottom: 30px;
    }
}
 .upload_file{
    width: 637px;
    border: rgb(220, 223, 230) solid 1px;
    border-radius: 4px;
    padding-left: 8px;
    margin-bottom: 8px;
  }
  .handle{
    font-size:14px;
    color:rgba(61,67,74,1);
    background:rgba(181,189,202,1);
    border:1px solid rgba(181,189,202,1);
    padding: 2px 6px;
    cursor: pointer;
  }
  .tip{
    font-size:14px;
    font-weight:400;
    color:rgba(181,189,202,1);
    line-height:20px;
  }
  .status{
    font-size:14px;
    background-color: #FF4246;
    padding: 2px 6px;
    margin-right: 18px;
    color:rgba(255,255,255,1);
  }
  .require{
    margin: 0px 10px 0px 50px;
    &:before{
      content:'*';
      color: #ff4246;
    }
  }
</style>