/* 页面管理-推广弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'推广'" :showFooter="false">
     <el-tabs v-model="currentType">
      <el-tab-pane label="公众号" name="h5"></el-tab-pane>
      <el-tab-pane label="小程序" name="mini"></el-tab-pane>
      <div class="popularize_wrapper">
        <!-- 预览区 -->
        <div class="preview poster" v-if="currentType === 'h5' && shareStyle == 0">
          <div class="one">
            <img :src="ruleFormH5.picture" alt="">
            <h3>{{ruleFormH5.title || '分享标题'}}</h3>
            <p>{{(ruleFormH5.describe) || '分享描述'}}</p>
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
          <div class="three">
            <!-- <el-button type="text" @click="getPoster" :disabled="!h5DownloadPosterAble" :loading="downloadPosterLoading" >下载完整海报图片</el-button> -->
            <el-button type="text" @click="getPoster" :loading="downloadPosterLoading" >下载完整海报图片</el-button>
            <el-button type="text">|</el-button>
            <el-button type="text" @click="openQrcode('h5')" :loading="openQrcodeLoading">仅下载二维码</el-button>
          </div>
        </div>

        <div class="preview wechat_friends" v-if="currentType === 'h5' && shareStyle == 1">
          <div class="bubble">
              <div class="left">
                <h3>{{ruleFormH5.title || '页面名称'}}</h3>
                <p>{{ruleFormH5.describe || '页面描述'}}</p>
              </div>
              <div class="right">
                <img :src="ruleFormH5.picture" alt="">
              </div>
          </div>
          <i class="icon"></i>
        </div>

        <div class="preview wechat_ommunity" v-if="currentType === 'h5' && shareStyle == 2">
           <div class="bubble">
              <img :src="ruleFormH5.picture" alt="">
              <span>{{ruleFormH5.describe || '页面描述'}}</span>
          </div>
        </div>
        
        <div class="preview wechat_friends_mini" v-if="currentType === 'mini' && shareStyle2 == 1">
          <div class="bubble">
              <div class="con">
                <div class="left">
                  <div class="top">
                    <img :src="shopInfo.logoCircle || shopInfo.logo || require('@/assets/images/logo.png')" alt=""> 
                    <p>{{shopInfo.name || '店铺名称'}}</p>
                  </div>
                  <div class="bottom">{{ruleFormMini.describe}}</div>
                  <div class="bottom2">
                    <img :src="ruleFormMini.picture"/>
                  </div>
                </div>
              </div>
              <div class="footer">
                <i class="bg"></i><span>小程序</span>
              </div>
          </div>
          <i class="icon"></i>
        </div>

        <!-- 设置区 -->
        <div class="setting" v-loading="loading" v-if="displaySetting">
          <div v-show="currentType === 'h5'">
            <div style="display:flex;margin-bottom: 15px;">
              <el-input v-model="pageLink" placeholder="右击右侧按钮复制链接" style="margin-right:20px;"></el-input>
              <el-button type="primary"  v-clipboard:copy="pageLink" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</el-button>
            </div>
            <el-form ref="ruleFormH5" :model="ruleFormH5" :rules="rulesH5" label-width="80px">
              <el-form-item label="分享样式" prop="shareStyle">
                <el-radio-group v-model="shareStyle">
                  <el-radio :label="0">海报</el-radio>
                  <el-radio :label="1">微信好友</el-radio>
                  <el-radio :label="2">微信朋友圈</el-radio>
                </el-radio-group>
                <br/>
                <el-button style="margin-left:-69px;" :style="{color: !openSetting ? 'rgba(101,94,255,1)' : 'rgba(58,64,72,1)'}" type="text" @click="openSetting = true">自定义分享内容</el-button>
              </el-form-item>
              <el-form-item label="分享标题" prop="title" v-if="openSetting && shareStyle != 2">
                <el-input
                  :rows="5"
                  :max="10"
                  :placeholder="'请输入分享标题，不超过' + titlePlaceholder +'个汉字'"
                  v-model="ruleFormH5.title">
                </el-input>
              </el-form-item>
              <el-form-item label="分享描述" prop="describe" v-if="openSetting">
                <el-input
                  :rows="5"
                  :max="18"
                  :placeholder="'请输入分享描述，不超过' + describePlaceholder +'个汉字'"
                  v-model="ruleFormH5.describe">
                </el-input>
              </el-form-item>
              <el-form-item label="分享图片" prop="picture" v-if="openSetting">
                <div class="img_preview" v-if="ruleFormH5.picture">
                  <img :src="ruleFormH5.picture" alt="">
                  <span @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
                </div>
                <div class="add_button" v-if="!ruleFormH5.picture" @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">
                  <i class="inner"></i>
                </div>
                <p style="color: rgb(211, 211, 211);;margin-top:10px;">1：图片大小不超过3MB<br/>2：建议上传长：宽=1:1的图片，否则图片将被压缩或拉伸以铺满整个画布。</p>
              </el-form-item>
              <el-form-item v-if="openSetting">
                <el-button type="primary" @click="onSubmitH5" :loading="submitLoading">确定</el-button>
                <el-button @click="openSetting = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div v-show="currentType === 'mini'">
            <div>
              <el-button type="text" @click="openSetting2 = true" :style="{color: !openSetting2 ? 'rgba(101,94,255,1)' : 'rgba(58,64,72,1)'}">自定义分享内容</el-button>
              <!-- <el-button type="text" @click="getPoster" :disabled="!miniDownloadPosterAble" :loading="downloadPosterLoading" v-if="currentType === 'h5' && shareStyle == 0">下载海报图片</el-button>
              <el-button type="text" @click="openQrcode('mini')" :loading="openQrcodeLoading">打开小程序码</el-button> -->
            </div>
            <el-form ref="ruleFormMini" :model="ruleFormMini" :rules="rulesMini" label-width="80px" v-if="openSetting2">
              <el-form-item label="分享样式" prop="shareStyle2">
                <el-radio-group v-model="shareStyle2">
                  <el-radio :label="1">微信好友</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分享描述" prop="describe">
                <el-input
                  :rows="5"
                  :max="18"
                  :placeholder="'请输入分享描述，不超过' + describePlaceholder +'个汉字'"
                  v-model="ruleFormMini.describe">
                </el-input>
              </el-form-item>
              <el-form-item label="分享图片" prop="picture">
                <div class="img_preview" v-if="ruleFormMini.picture">
                  <img :src="ruleFormMini.picture" alt="失败">
                  <span @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
                </div>
                <div class="add_button" v-if="!ruleFormMini.picture" @click="dialogVisible2=true; currentDialog='dialogSelectImageMaterial'">
                  <i class="inner"></i>
                </div>
                <p style="color: rgb(211, 211, 211);;margin-top:10px;">1：图片大小不超过3MB<br/>2：建议上传450*360的图片，当尺寸不匹配时，图片将被压缩或拉伸以铺满整个画布。</p>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmitMini" :loading="submitLoading">确定</el-button>
                <el-button @click="openSetting2 = false">取消</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-tabs>
    <!-- 动态弹窗 -->
    <component  v-if="dialogVisible2" :is="currentDialog" :dialogVisible.sync="dialogVisible2" @imageSelected="imageSelected"></component>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import dialogSelectImageMaterial from '../dialogSelectImageMaterial';
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
    const _self = this;
    return {
      currentType: 'h5',
      currentDialog: '',
      dialogVisible2: false,
      shareStyle: 0,
      shareStyle2: 1,
      loading: true,  //加载loading
      downloadPosterLoading: false,  //下载海报loading
      submitLoading: false,  //提交loading
      openQrcodeLoading: false,  //打开二维码loading
      ruleFormH5: {
        pageInfoId: this.pageId,
        title: '店铺名称',
        describe: '我发现了一个不错的店铺，快来看看吧。',
        picture: ''
      },
      ruleFormMini: {
        pageInfoId: this.pageId,
        describe: '我发现了一个不错的店铺，快来看看吧。',
        picture: ''
      },
      rulesH5: {
        title: [
          { required: true, message: "请输入分享标题", trigger: "blur" },
          {validator: (rule, value, callback)=> {
            let limit = 0;
            if(_self.currentType === 'h5') {
              if(_self.shareStyle === 0) {
                limit = 15;
              }else if(_self.shareStyle === 1){
                limit = 25;
              }
            }
            if(value.length >0 && value.length <= limit) {
              callback();
            }else {
              callback(new Error(`请输入分享标题，不超过${limit}个汉字`));
            }
          }, trigger: 'blur'}
        ],
        describe: [
          { required: true, message: "请输入分享描述", trigger: "blur" },
          {validator: (rule, value, callback)=> {
            let limit = 0;
            if(_self.currentType === 'h5') {
              if(_self.shareStyle === 0) {
                limit = 30;
              }else if(_self.shareStyle === 1){
                limit = 30;
              }else if(_self.shareStyle === 2){
                limit = 36;
              }
            }
            if(value.length >0 && value.length <= limit) {
              callback();
            }else {
              callback(new Error(`请输入分享描述，不超过${limit}个汉字`));
            }
          }, trigger: 'blur'}
        ],
        picture: [
          { required: false, message: "请选择logo", trigger: "change" }
        ]
      },
      rulesMini: {
        describe: [
          { required: true, message: "请输入分享描述", trigger: "blur" },
          {validator: (rule, value, callback)=> {
            let limit = 0;
            if(_self.shareStyle2 === 1) {
              limit = 30;
            }
            if(value.length >0 && value.length <= limit) {
              callback();
            }else {
              callback(new Error(`请输入分享描述，不超过${limit}个汉字`));
            }
          }, trigger: 'blur'}
        ],
        picture: [
          { required: false, message: "请选择logo", trigger: "change" }
        ]
      },
      qrCode: '',
      miniAppQrcode: '',
      openSetting: false,  //是否开启设置
      openSetting2: false,  //是否开启设置(小程序)
      h5DownloadPosterAble: false,  //h5是否可下载海报
      miniDownloadPosterAble: false, //小程序是否可下载海报
      displaySetting: true  //是否渲染设置区(用来切换)
    };
  },
  watch: {
    currentType(newValue) {
      if(this.currentType === 'h5') {
        this.getQrcode();
      }else if(this.currentType === 'mini') {
        this.getMiniAppQrcode();
      }
      this.fetch();
      this.displaySetting = false;
      this.$nextTick(()=>{
        this.displaySetting = true;
      })
    },
    shopInfo:{
      handler(newValue) {
        this.$set(this.ruleFormH5, 'picture', this.ruleFormH5.picture || this.shopInfo.logo || require('@/assets/images/logo.png'))
        this.$set(this.ruleFormMini, 'picture', this.ruleFormMini.picture || this.shopInfo.logo || require('@/assets/images/logo.png'))
        if(this.currentType === 'h5') {
          this.getQrcode();
        }else if(this.currentType === 'mini') {
          this.getMiniAppQrcode();
        }
      },
      deep: true
    },
    shareStyle() {
      this.fetch();
      this.displaySetting = false;
      this.$nextTick(()=>{
        this.displaySetting = true;
      })
    },
    shareStyle2() {
      this.fetch();
      this.displaySetting = false;
      this.$nextTick(()=>{
        this.displaySetting = true;
      })
    },
    ruleFormH5: {
      handler(newValue){
        console.log(newValue);
      },
      deep: true
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
    titlePlaceholder() {
      if(this.currentType === 'h5') {
        if(this.shareStyle === 0) {
          return 15;
        }else if(this.shareStyle === 1){
          return 25;
        }
      }
    },
    describePlaceholder() {
      if(this.currentType === 'h5') {
        if(this.shareStyle === 0) {
          return 30;
        }else if(this.shareStyle === 1){
          return 30;
        }else if(this.shareStyle === 2){
          return 36;
        }
      }else if(this.currentType === 'mini') {
        if(this.shareStyle2 === 1) {
          return 30;
        }
      }
    }
  },
  created() {
    this.fetch();
    this.$store.dispatch('getShopInfo');
    if(this.currentType === 'h5') {
      this.getQrcode();
    }else if(this.currentType === 'mini') {
      this.getMiniAppQrcode();
    }
  },
  methods: {

    fetch() {
      this.loading = true;
      let pageId   = this.currentType === 'h5' ?this.ruleFormH5.pageInfoId:this.ruleFormMini.pageInfoId;
      this._apis.shop.getPageShare({
        type: this.currentType === 'h5' ? '0' : '1',
        shareStyle: this.currentType === 'h5' ? this.shareStyle : this.shareStyle2,
        pageInfoId: pageId
      })
      .then((response)=>{
        if(response && response.pageInfoId) {
          if(!response.picture) {
            response['picture'] = this.shopInfo.logo || require('@/assets/images/logo.png')
          }
          if (this.currentType === 'h5') {
            this.ruleFormH5 = response;
            if(response.title && response.describe) {
              this.h5DownloadPosterAble = true;
            }
          } else {
            this.ruleFormMini = response;
            if(response.title && response.describe) {
              this.miniDownloadPosterAble = true;
            }
          }
        } else {
          if (this.currentType === 'h5') {
            this.ruleFormH5 = {
              pageInfoId: this.pageId,
              title: '店铺名称',
              describe: '我发现了一个不错的店铺，快来看看吧。',
              picture: this.shopInfo.logo || require('@/assets/images/logo.png')
            };
          } else {
            this.ruleFormMini = {
              pageInfoId: this.pageId,
              describe: '我发现了一个不错的店铺，快来看看吧。',
              picture: this.shopInfo.logo || require('@/assets/images/logo.png')
            };
          }
        }
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    // 提交h5 校验
    onSubmitH5() {
      this.$refs.ruleFormH5.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this._apis.shop.updatePageShare({
            type: '0',
            shareStyle: this.shareStyle,
            pageInfoId: this.ruleFormH5.pageInfoId,
            title: this.ruleFormH5.title,
            describe: this.ruleFormH5.describe,
            picture: this.ruleFormH5.picture
          })
          .then((response)=>{
            this.$message.success('提交成功！')
            this.fetch();
            this.submitLoading = false;
            this.openSetting = false;
          }).catch((error)=>{
            this.$message.error(error);
            this.submitLoading = false;
            this.openSetting = false;
          });
        } else {
          // this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      })
    },

    // 提交小程序 校验
    onSubmitMini() {
      this.$refs.ruleFormMini.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this._apis.shop.updatePageShare({
            type: '1',
            shareStyle: this.shareStyle2,
            pageInfoId: this.ruleFormMini.pageInfoId,
            describe: this.ruleFormMini.describe,
            picture: this.ruleFormMini.picture
          })
          .then((response)=>{
            this.fetch();
            this.submitLoading = false;
            this.openSetting2 = false;
          }).catch((error)=>{
            this.$message.error(error);
            this.submitLoading = false;
            this.openSetting2 = false;
          });
        } else {
          // this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      })
    },

    /* 获取海报 */
    getPoster() {
      this.downloadPosterLoading = true;
      let pageId = this.currentType === 'h5' ?this.ruleFormH5.pageInfoId:this.ruleFormMini.pageInfoId;
      this._apis.shop.getPoster({
        type: this.currentType === 'h5' ? '0' : '1',
        pageInfoId: pageId
      }).then((response)=>{
       this.download(response, '分享');
      }).catch((error)=>{
        console.error(error);
        this.downloadPosterLoading = false;
      });
    },

    /* 打开二维码 */
    openQrcode(codeType) {
      const _self = this;
      if(this.currentType === 'h5') {
        this.getQrcode(codeType, (url) =>{
          _self.download(url, '二维码'); // 下载二维码
          // _self.openQrCodeInNewWindow(url);
        });
      }else if(this.currentType === 'mini') {
        this.getMiniAppQrcode(codeType, (url) =>{

          // let image = new Image();
          // // image.crossOrigin = "anonymous";  // 支持跨域图片
          // image.setAttribute('crossOrigin','anonymous');
          // image.src = url; // 处理缓存
          // image.onload = function(){
          //   var base64 = _self.getBase64Image(image);
          //   _self.download(base64, '小程序码'); // 下载二维码
          // }
          _self.openQrCodeInNewWindow(url);
        });
      }
    },

    //新窗口打开二维码
    openQrCodeInNewWindow(url) {
      const img = new Image();
      img.style.cssText = 'margin:200px auto 0;display: block;';
      if(url.substr(0,4) === 'http') {
         img.src = url;
      }else{
         img.src = `data:image/png;base64,${url}`;
      };
      const newWin = window.open("", "_blank");
      newWin.document.write(img.outerHTML);
      newWin.document.title = "二维码"
      newWin.document.close();
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
        callback && callback(response); // 打开二维码
      }).catch((error)=>{
        this.openQrcodeLoading = false;
        this.$message({ message: error, type: 'error' });
      });
    },

    /* 获取小程序码 */
    getMiniAppQrcode(codeType, callback) {
      this.openQrcodeLoading = true;
      this._apis.shop.getMiniAppQrcode({id: '1'}).then((response)=>{
        this.qrCode = response;
        this.openQrcodeLoading = false;
        callback && callback(response); // 打开二维码
      }).catch((error)=>{
        this.openQrcodeLoading = false;
        this.$message({ message: error, type: 'error' });
      });
    },

    /* 下载图片实现 */
    download(url, name) {
        this.downloadPosterLoading = false;
        const aLink = document.createElement('a');
        aLink.download = name ;
        if(url.includes(location.protocol + '//')) {
          aLink.href = url; 
        }else{
          aLink.href = `data:image/png;base64,${url}`; 
        };
        aLink.dispatchEvent(new MouseEvent('click', {}));
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      if (this.currentType === 'h5') {
        this.ruleFormH5.picture = dialogData.filePath;
      } else {
        this.ruleFormMini.picture = dialogData.filePath;
      }      
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
    },

    //从canvas获取在线图片base64码
    getBase64Image(img) {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, img.width, img.height);
        var dataURL = canvas.toDataURL("image/png");  // 可选其他值 image/jpeg
        return dataURL;
    }
  }
};
</script>

<style lang="scss">
.popularize_wrapper{
  display:flex;
  flex-direction: row;
  justify-content: flex-start;
  .img_preview img {
    object-fit: initial!important;
 }
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
        text-align: left;
        img{
          width: 200px;
          display: block;
          height: 200px;
          border: 1px solid #ddd;
          // border-radius: 100px;
          // object-fit: contain;
        }
        h3{
          margin-top:20px;
          font-size:16px;
          color:rgba(68,67,75,1);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        p{
          margin-top:5px;
          font-size:12px;
          color:rgba(146,146,155,1);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .two{
        margin-top:20px;
        background:rgba(248,248,248,1);
        border-radius:2px;
        border:1px solid rgba(211,211,211,1);
        padding:15px 20px;
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
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p{
            margin-top:5px;
            font-size:12px;
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
            // border: 1px solid #ddd;
          }
        }
      }
      .three{
        /deep/.el-button{
          font-size: 14px;
        }
        /deep/.el-button--text:focus, .el-button--text:hover{
          color: #655EFF!important;
        }
      }
    }
    &.wechat_friends{
      background:url('../../../../assets/images/shop/tuiguang-bj2.png') no-repeat 0 0;
      background-size: contain;
      position:relative;
      width:260px;
      height:442px;
      .bubble{
        background:#fff;
        width:166px;
        min-height:60px;
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
            width:100px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p{
            margin-top:5px;
            font-size:12px;
            color:rgba(146,146,155,1);
            width:100px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
        .right{
          img{
            width: 40px;
            height: 40px;
            object-fit: cover;
            display: block;
            // border: 1px solid #ddd;
          }
        }
      }
      .icon{
        background: url('../../../../assets/images/shop/touxiang1.png') no-repeat 0 0;
        width:30px;
        height:30px;
        top: 61px;
        right: 8px;
        display:block;
        position:absolute;
      }
    }
    &.wechat_ommunity{
      background:url('../../../../assets/images/shop/wechat_community.png') no-repeat 0 0;
      background-size: contain;
      position:relative;
      height: 378px;
       .bubble{
          background: #f3f3f5;
          width: 182px;
          height: 35px;
          padding: 5px;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          position: absolute;
          bottom: 60px;
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
            // border: 1px solid #ddd;
          }
          span{
            color:rgba(68,67,75,1);
            font-size:12px;
            margin-left:10px;
            width:100%;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
      }
    }
    &.wechat_friends_mini{
      background:url('../../../../assets/images/shop/tuiguang-bj2.png') no-repeat 0 0;
      position:relative;
      background-size: contain;
      width: 260px;
      height:442px;
      .bubble{
        width:175px;
        padding-top:2px;
        box-sizing: border-box;
        position: absolute;
        top: 61px;
        right: 45px;
        border-radius: 6px;
        background:#fff;
        .con{
        padding:10px;
          .top{
            display: flex;
            width: 100%;
            height: 20px;
            img{
              width: 20px;
              height:20px;
              margin-right:3px;
              border-radius: 50%;
            }
          }
          .bottom{
            color:rgba(68,67,75,1);
            margin: 8px 0 5px 0;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .bottom2{
            width:100%;
            height:116px;
            overflow: hidden;
            justify-content: center;
            align-items: center;
            display: flex;
            img{
              width:100%;
              height:100%;
            }
          }
        }
        .footer{
          border-top: 1px solid #ddd;
          display:flex;
          justify-content: flex-start;
          width: calc(100% - 20px);
          padding:3px;
          margin: 0 auto;
          .bg{
            background:url('../../../../assets/images/shop/mini-bg2.png') no-repeat 0px -1px;
            background-size: contain;
            width:15px;
            height: 15px;
            display: block;
          }
          span{
            color:rgba(146,146,155,1);
            font-size:12px;
            margin-left:3px;
          }
        }
      }
      .icon{
        background: url('../../../../assets/images/shop/touxiang1.png') no-repeat 0 0;
        width:30px;
        height:30px;
        top: 61px;
        right: 8px;
        display:block;
        position:absolute;
      }
    }
  }
  .setting{
    width: calc(100% - 275px);
  }
}
</style>