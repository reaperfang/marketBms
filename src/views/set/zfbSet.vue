/*支付宝设置 */
<template>
    <div class="main mh bor-radius">
        <h1>支付宝支付信息设置</h1>
        <el-form ref="form" :model="form" :rules="rules">
            <el-form-item label="应用ID(AppID):" prop="appid" label-width="300px">
                <el-input v-model="form.appid" style="width:300px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="应用私钥（App_PRIVATE_KEY）:" prop="private_key" label-width="300px">
                <el-input v-model="form.private_key" style="width:300px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="支付宝公钥（App_PUBLIC_KEY）:" prop="alipay_public_key" label-width="300px">
                <el-input v-model="form.alipay_public_key" style="width:300px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label-width="180px" class="mt100">
                <el-button type="primary" @click="onSubmit('form')" v-loading="loading">保存</el-button>
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
      loading:false,
      form:{
        appid:'',
        private_key:'',
        alipay_public_key:'',
      },
      rules: {
        appid:[
          { required: true, message: '请输入应用ID', trigger: 'blur' },
        ],
        private_key:[
          { required: true, message: '请输入应用私钥', trigger: 'blur' },
        ],
        alipay_public_key:[
          { required: true, message: '请输入支付宝公钥', trigger: 'blur' },
        ]
      },
      id:'',
      imageUrl: '',
      area: [],
      uploadUrl:`${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
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
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        },
        shopName(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.shopName
        }
    },
  created() {
    this.getShopPayInfo()
  },
  methods: {
    getShopPayInfo(){
      let query = {
        mchId:this.cid,
        channelId:'ALIPAY_ALL',
      }
      this._apis.set.getShopPayInfo(query).then(response =>{
        this.id = response.id
        let param = JSON.parse(response.param)
        this.form.appid = param.appid
        this.form.private_key = param.private_key
        this.form.alipay_public_key = param.alipay_public_key
      }).catch(error =>{
        console.error(error)
        // this.$message.warning('商户未设置支付信息');
      })
    },

    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.id ? this.updateShopPayInfo() : this.addShopPayInfo()
        }
      })   
    },
    //修改商户支付信息
    updateShopPayInfo(){
      let param = {
        appid:this.form.appid,
        isSandbox:'0',
        private_key:this.form.private_key,
        alipay_public_key:this.form.alipay_public_key
      }
      let query = {
        id:this.id,
        mchId:this.cid,
        channelId:'ALIPAY_ALL',
        mchName:this.shopName,
        channelName:'ALIPAY',
        channelMchId:this.form.appid,
        param:JSON.stringify(param)
      }
      this._apis.set.updateShopPayInfo(query).then(response =>{
        this.loading = false
        this.updateWechatBinding()
        this.$message.success('保存成功！');
        this.getShopPayInfo()
      }).catch(error =>{
        this.loading = false
        this.$message.error(error);
      })
    },



    //添加商户支付信息
    addShopPayInfo(){
      let param = {
        appid:this.form.appid,
        isSandbox:'0',
        private_key:this.form.private_key,
        alipay_public_key:this.form.alipay_public_key
      }
      let query = {
        mchId:this.cid,
        channelId:'ALIPAY_ALL',
        mchName:this.shopName,
        channelName:'ALIPAY',
        channelMchId:this.form.appid,
        param:JSON.stringify(param)
      }
      this._apis.set.addShopPayInfo(query).then(response =>{
        this.loading = false
        this.updateWechatBinding()
        this.$message.success('保存成功！');
        this.getShopPayInfo()
      }).catch(error =>{
        this.loading = false
        this.$message.error(error);
      })
    },

    updateWechatBinding(){
      let id = this.cid
      let query = {
        id:id,
        alipayBinding:1
      }
      this._apis.shopInfo.updateShopInfo(query).then(response =>{
        this.$store.dispatch('getShopInfo');
      }).catch(error =>{
        this.$message.error(error);
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
  .mt100{
    margin-top: 100px;
  }
</style>