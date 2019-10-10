/* 页面管理-推广弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'推广'" :showFooter="false">
     <el-tabs v-model="currentType">
      <el-tab-pane label="H5" name="h5"></el-tab-pane>
      <el-tab-pane label="小程序" name="mini"></el-tab-pane>
      <div class="popularize_wrapper">

        <!-- 预览区 -->
        <div class="preview poster" v-if="shareStyle == 1">
          <div class="one">
            <img :src="ruleForm.picture" alt="分享店铺LOGO">
            <h3>{{ruleForm.title || '页面名称'}}</h3>
            <p>{{ruleForm.describe || '页面描述'}}</p>
          </div>
          <div class="two">
            <div class="left">
              <h3>{{shopInfo.shopName || '店铺名称'}}</h3>
              <p>扫码或长按二维码</p>
            </div>
            <div class="right">
              <img :src="qrCode" alt="页面二维码">
            </div>
          </div>
        </div>

        <div class="preview wechat_friends" v-if="shareStyle == 2">
          <div class="bubble">
              <div class="left">
                <h3>{{ruleForm.title || '页面名称'}}</h3>
                <p>{{ruleForm.describe || '页面描述'}}</p>
              </div>
              <div class="right">
                <img :src="ruleForm.picture" alt="分享店铺LOGO">
              </div>
          </div>
        </div>

        <div class="preview wechat_ommunity" v-if="shareStyle == 3">
           <div class="bubble">
              <img :src="ruleForm.picture" alt="分享店铺LOGO">
              <span>{{ruleForm.title || '页面名称'}}</span>
          </div>
        </div>

        <!-- 设置区 -->
        <div class="setting" v-loading="loading">
          <div style="display:flex;" v-if="currentType === 'h5'">
            <el-input v-model="pageLink" placeholder="右击右侧按钮复制链接" style="margin-right:20px;"></el-input>
            <el-button type="primary"  v-clipboard:copy="pageLink" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
          </div>
          <div>
            <el-button type="text" @click="openSetting = true">更多设置</el-button>
            <el-button type="text" @click="getPoster" :disabled="currentType=='h5'?!h5DownloadPosterAble:!miniDownloadPosterAble" :loading="downloadPosterLoading">下载海报图片</el-button>
            <el-button type="text" @click="openQrcode('h5')" v-if="currentType === 'h5'" :loading="openQrcodeLoading">下载二维码</el-button>
            <el-button type="text" @click="openQrcode('mini')" v-if="currentType === 'mini'" :loading="openQrcodeLoading">下载小程序码</el-button>
          </div>
           <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="70px" v-if="openSetting">
              <el-form-item label="分享样式" prop="shareStyle">
                <el-radio-group v-model="shareStyle">
                  <el-radio :label="1">海报</el-radio>
                  <el-radio :label="2">微信好友</el-radio>
                  <el-radio :label="3">微信朋友圈</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分享标题" prop="title">
                <el-input
                  :rows="5"
                  :max="10"
                  placeholder="请输入分享标题，最多10字"
                  v-model="ruleForm.title">
                </el-input>
              </el-form-item>
              <el-form-item label="分享描述" prop="describe">
                <el-input
                  :rows="5"
                  :max="18"
                  placeholder="请输入分享标题，最多10字"
                  v-model="ruleForm.describe">
                </el-input>
              </el-form-item>
              <el-form-item label="分享图片" prop="picture">
                <div class="img_preview" v-if="ruleForm.picture">
                  <img :src="ruleForm.picture" alt="">
                  <span @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
                </div>
                <div class="add_button" v-if="!ruleForm.picture" @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">
                  <i class="inner"></i>
                </div>
                建议尺寸：750*370，尺寸不匹配时，图片将被压缩或拉伸以铺满四周
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit" :loading="submitLoading">确定</el-button>
                <el-button @click="openSetting = false">取消</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
    </el-tabs>
    <!-- 动态弹窗 -->
    <component  v-if="dialogVisible2" :is="currentDialog" :dialogVisible.sync="dialogVisible2" @imageSelected="imageSelected"></component>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import dialogSelectImageMaterial from './dialogSelectImageMaterial';
import utils from "@/utils";
export default {
  name: "dialogPopularize",
  components: {DialogBase, dialogSelectImageMaterial},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      pageId: {
        type: String,
        default: ''
      },
      pageLink: {
        type: String,
        default: ''
      }
  },
  data() {
    return {
      currentType: 'h5',
      currentDialog: '',
      dialogVisible2: false,
      shareStyle: 1,
      loading: true,  //加载loading
      downloadPosterLoading: false,  //下载海报loading
      submitLoading: false,  //提交loading
      openQrcodeLoading: false,  //打开二维码loading
      ruleForm: {
        pageInfoId: this.pageId,
        type: '0',
        title: '',
        describe: '',
        picture: ''
      },
      rules: {
        title: [
          {
            min: 0,
            max: 10,
            message: "长度在 0 到 10 个字符",
            trigger: "blur"
          }
        ],
        describe: [
          {
            min: 0,
            max: 12,
            message: "长度在 0 到 12 个字符",
            trigger: "blur"
          }
        ],
      },
      qrCode: '',
      openSetting: false,  //是否开启设置
      h5DownloadPosterAble: false,  //h5是否可下载海报
      miniDownloadPosterAble: false //小程序是否可下载海报
    };
  },
  watch: {
    currentType(newValue) {
      this.fetch();
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
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    },
  },
  created() {
    this.fetch();
    this.$store.dispatch('getShopInfo');
    this.getQrcode();
  },
  methods: {

    fetch() {
      this.loading = true;
      this._apis.shop.getPageShare({
        type: this.currentType === 'h5' ? '0' : '1',
        pageInfoId: this.ruleForm.pageInfoId
      }).then((response)=>{
        if(response && response.pageInfoId) {
          if(response.title && response.describe) {
            if (this.currentType === 'h5') {
              this.h5DownloadPosterAble = true;
            } else {
              this.miniDownloadPosterAble = true;
            }
          }
          this.ruleForm = response;
        }else{
          this.ruleForm = {
            pageInfoId: this.pageId,
            type: '0',
            title: '',
            describe: '',
            picture: ''
          }
        }
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

    onSubmit() {
      this.submitLoading = true;
       this._apis.shop.updatePageShare({
        type: this.currentType === 'h5' ? '0' : '1',
        pageInfoId: this.ruleForm.pageInfoId,
        title: this.ruleForm.title,
        describe: this.ruleForm.describe,
        picture: this.ruleForm.picture
      }).then((response)=>{
         this.fetch();
         this.submitLoading = false;
         this.openSetting = false;
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.submitLoading = false;
        this.openSetting = false;
      });
    },

    /* 获取海报 */
    getPoster() {
      this.downloadPosterLoading = true;
      this._apis.shop.getPoster({
        type: this.currentType === 'h5' ? '0' : '1',
        pageInfoId: this.ruleForm.pageInfoId
      }).then((response)=>{
       this.download(response, '分享');
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.downloadPosterLoading = false;
      });
    },

    /* 新页签打开二维码 */
    openQrcode(codeType) {
      const _self = this;
      this.getQrcode(codeType, (url) =>{
        // _self.download(`data:image/png;base64,${url}`, '二维码');
        const img = new Image();
        img.style.cssText = 'margin:200px auto 0;display: block;';
        img.src = `data:image/png;base64,${url}`;
        const newWin = window.open("", "_blank");
        newWin.document.write(img.outerHTML);
        newWin.document.title = "二维码"
        newWin.document.close();
      });
    },

    /* 获取二维码 */
    getQrcode(codeType, callback) {
      this.openQrcodeLoading = true;
      this._apis.shop.getQrcode({
        url: this.pageLink.replace("&","[^]"),
        width: '225',
        height: '225',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        this.openQrcodeLoading = false;
        this.download(response, '二维码'); // 下载二维码
        // callback && callback(response); // 打开二维码
      }).catch((error)=>{
        this.openQrcodeLoading = false;
        this.$message({ message: error, type: 'error' });
      });
    },

    /* 下载图片实现 */
    download(url, name) {
        this.downloadPosterLoading = false;
        const aLink = document.createElement('a')
        aLink.download = name 
        aLink.href = `data:image/png;base64,${url}`; 
        aLink.dispatchEvent(new MouseEvent('click', {}))
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.picture = dialogData.filePath;
    },

     onCopy () {
      this.$message({
        message: `复制成功！`,
        type: 'success'
      });
    //   this.snackBar.info(this.$t('prompt.copySuccess'))
    },
    onError () {
      this.$message.error(this.$t('prompt.copyFail'))
    }
  }
};
</script>

<style lang="scss">
.popularize_wrapper{
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
  .preview{
    width:260px;
    margin-right:15px;
    &.poster{
      .one{
        background:rgba(248,248,248,1);
        border-radius:2px;
        border:1px solid rgba(211,211,211,1);
        padding:20px;
        box-sizing: border-box;
        text-align: center;
        img{
          width: 220px;
          display: block;
          height: 200px;
          border: 1px solid #ddd;
          // object-fit: contain;
        }
        h3{
          margin-top:20px;
          font-size:16px;
          color:rgba(68,67,75,1);
        }
        p{
          margin-top:5px;
          font-size:5px;
          color:rgba(146,146,155,1);
        }
      }
      .two{
        margin-top:20px;
        background:rgba(248,248,248,1);
        border-radius:2px;
        border:1px solid rgba(211,211,211,1);
        padding:25px;
        box-sizing: border-box;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        .left{
          width:calc(100% - 20px -20px);
          margin-right:20px;
          display:flex;
          flex-direction: column;
          justify-content: center;
          h3{
            font-size:14px;
            color:rgba(68,67,75,1);
          }
          p{
            margin-top:5px;
            font-size:5px;
            color:rgba(146,146,155,1);
          }
        }
        .right{
          padding:5px;
          background:#fff;
          img{
            width: 60px;
            height: 60px;
            // object-fit: cover;
            display: block;
            border: 1px solid #ddd;
          }
        }
      }
    }
    &.wechat_friends{
      background:url('../../../assets/images/shop/wechat_friends.png') no-repeat 0 0;
      background-size: contain;
      position:relative;
      .bubble{
        background:#fff;
        width:166px;
        height:60px;
        padding:10px;
        box-sizing: border-box;
        position: absolute;
        top: 61px;
        right: 45px;
        border-radius: 6px;
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        .left{
          display:flex;
          flex-direction: column;
          justify-content: center;
          h3{
            font-size:14px;
            color:rgba(68,67,75,1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width:100px;
          }
          p{
            margin-top:5px;
            font-size:5px;
            color:rgba(146,146,155,1);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width:100px;
          }
        }
        .right{
          img{
            width: 40px;
            height: 40px;
            object-fit: cover;
            display: block;
            border: 1px solid #ddd;
          }
        }
      }
    }
    &.wechat_ommunity{
      background:url('../../../assets/images/shop/wechat_community.png') no-repeat 0 0;
      background-size: contain;
      position:relative;
      height: 378px;
       .bubble{
          background: #f3f3f5;
          width: 208px;
          height: 35px;
          padding: 5px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          position: absolute;
          bottom: 63px;
          left: 43px;
          border-radius: 6px;
          display: -webkit-box;
          display: -ms-flexbox;
          display: flex;
          -webkit-box-orient: horizontal;
          -webkit-box-direction: normal;
          -ms-flex-direction: row;
          flex-direction: row;
          -webkit-box-pack: justify;
          -ms-flex-pack: justify;
          /* justify-content: space-between; */
          align-items: center;
          img{
            width:28px;
            height:28px;
            object-fit: cover;
            border-radius:5px;
            display: block;
            border: 1px solid #ddd;
          }
          span{
            color:rgba(68,67,75,1);
            font-size:12px;
            margin-left:10px;
            width:100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
      }
    }
  }
  .setting{

  }
}
</style>