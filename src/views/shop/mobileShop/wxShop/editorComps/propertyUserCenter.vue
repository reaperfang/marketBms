/* 微信个人中心装修属性区 */
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-calcHeight="154+102">
        <div class="block header">
          <p class="title">个人信息页设置</p>
          <p class="state" :class="{'normal': ruleForm.status === 0}">{{ruleForm.status === 0 ? '生效中' : '未生效'}}</p>
        </div>
        <div class="block form">
          <el-form-item label="背景图片" prop="backgroundImage" style="margin-bottom: 0;">
            <div class="img_preview" v-if="ruleForm.backgroundImage">
              <img :src="ruleForm.backgroundImage" alt="">
              <span @click="changeBackground">更换图片</span>
            </div>
            <div class="add_button" v-if="!ruleForm.backgroundImage" @click="changeBackground">
              <i class="inner"></i>
            </div>
            <span style="color:rgba(182,181,200,1);">建议尺寸 750*400 像素</span>
          </el-form-item>
          <el-form-item label="背景渐变" prop="backgroundGradients">
            <el-radio-group v-model="ruleForm.backgroundGradients">
              <el-radio :label="1">无渐变</el-radio>
              <el-radio :label="2">白色渐变</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="block form">
          <el-form-item label="头像位置" prop="avatarPosition">
             <el-radio-group v-model="ruleForm.avatarPosition">
              <el-radio :label="1">居左</el-radio>
              <el-radio :label="2">居中</el-radio>
              <el-radio :label="3">居右</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个人昵称颜色" prop="nickColor">
            <div class="color_block">
              <el-input v-model="ruleForm.nickColor" :disabled="true"></el-input>
              <colorPicker  v-model="ruleForm.nickColor" defaultColor="#000000"></colorPicker >
              <!-- <el-button type="text">重置</el-button> -->
            </div>
          </el-form-item>
          <el-form-item label="会员栏样式" prop="memberColumeStyle">
             <el-radio-group v-model="ruleForm.memberColumeStyle">
              <el-radio :label="1">样式一</el-radio>
              <el-radio :label="2">样式二</el-radio>
              <el-radio :label="3">样式三</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="block form custom">
          <div>
            <span class="add-btn">添加自定义</span>
          </div>
          <!-- v-if=" item.name =='commission'?isOpenResell==1&&pathname=='/bp/shop/m_wxShopIndex':(item.name !== 'integralMarket' && item.name !== 'messageCenter')"/  h5隐藏分销入口 -->
          <ul class="custom-list">
            <li v-for="(item, key) in ruleForm.moduleList" :key="key">
              <div class="clearfix">
                <el-checkbox v-model="item.disabled"></el-checkbox>
                <el-form-item
                  class="custom-form"
                   v-if=" item.name =='commission'?isOpenResell==1:(item.name !== 'integralMarket' && item.name !== 'messageCenter')"
                  :key="key"
                  :label="item.title"
                  label-width="72px"
                  :prop="'moduleList.'+ key +'.titleValue'"
                  :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },{ min: 1, max: 10, message: '要求1~10个字符',trigger: 'blur' }]">
                  <div class="module_block color_block">
                      <el-input v-model="item.titleValue"></el-input>
                      <div class="img_preview">
                        <img :src="item.icon" alt="" title="点击更换">
                        <span @click="currentModule=item;dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换</span>
                      </div>
                      <colorPicker  v-model="item.color" defaultColor="#000"></colorPicker >
                      <div class="custom-do">
                        <div class="custom-center">
                          <span class="icon top"></span>
                          <span class="icon bottom"></span>
                        </div>
                      </div>
                      <!-- <el-button type="text">重置</el-button> -->
                  </div>
                </el-form-item>
              </div>
              <div></div>
            </li>
          </ul>
        </div>  

        <div class="block button">
          <div class="help_blank"></div>
          <div class="buttons">
            <el-button @click="resetLoading = true; resetData()" :loading="resetLoading">重    置</el-button>
            <el-button @click="userCenterSave()" :loading="saveDataLoading">保    存</el-button>
            <el-button type="primary" @click="userCenterSaveAndApply()" :loading="saveAndApplyDataLoading">保存并生效</el-button>
            <el-popover
              v-if="showPreviewCode"
              ref="popover2"
              placement="bottom"
              title=""
              style="margin-left:10px;"
              width="170"
              trigger="click"
              content="">
              <img v-if="showCode" :src="qrCode" alt="">
              <span v-else>无分享地址</span>
              <el-button slot="reference" @click="getQrcode();showCode=true">预    览</el-button>
            </el-popover>
          </div>
        </div>

        <!-- 动态弹窗 -->
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
      </el-form>
</template>

<script>
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import vuedraggable from "vuedraggable";
export default {
  name: 'propertyUserCenter',
  components: {dialogSelectImageMaterial, vuedraggable},
  props: ['saveAndApply', 'save', 'resetData', 'data', 'isOpenResell'],
  data () {
    return {
      resetLoading: false,  //重置loading
      saveDataLoading: false,  //保存loading
      saveAndApplyDataLoading: false,  //保存并应用loading
      dialogVisible: false,
      currentDialog: '',
      currentModule: null,
      pathname:window.location.pathname,
      ruleForm: {
        backgroundImage: '',  //背景图
        backgroundGradients: 1,  //背景渐变
        avatarPosition: 1,  //头像位置
        nickColor: '#000000',  //昵称颜色
        memberColumeStyle: 1,  //会员栏样式
        moduleList: {
          // integralMarket: {
          //   name: 'integralMarket',
          //   title: '积分商城',
          //   titleValue: '积分商城',
          //   icon: '',
          //   defaultIcon: 'userCenter11',
          //   color: '#000'
          // },
          // messageCenter: {
          //   name: 'messageCenter',
          //   title: '消息中心',
          //   titleValue: '消息中心',
          //   icon: '',
          //   defaultIcon: 'userCenter12',
          //   color: '#000'
          // },
          memberRank: {
            title: '会员等级',
            titleValue: '会员等级',
            icon: 'data:image/png;base64,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',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'memberRank',
              id: 8
            }
          },
          gift: {
            name: 'gift',
            title: '赠品包',
            titleValue: '赠品包',
            icon: '',
            defaultIcon: 'userCenter16',
            color: '#000'
          },
          myAssemble: {
            name: 'myAssemble',
            title: '我的拼团',
            titleValue: '我的拼团',
            icon: '',
            defaultIcon: 'userCenter17',
            color: '#000'
          },
          address: {
            name: 'address',
            title: '地址管理',
            titleValue: '地址管理',
            icon: '',
            defaultIcon: 'userCenter18',
            color: '#000'
          },
          commission: {
            name: 'commission',
            title: '分销中心',
            titleValue: '分销中心',
            icon: '',
            defaultIcon: 'userCenter21',
            color: '#000'
          },
        }
      },
      rules: {},
      showCode: false,   //是否显示二维码
      qrCode: '',
      showPreviewCode: true  //预览二维码按钮是否可见
    }
  },
  watch:{
    data:{
      handler(newValue) {
        this.ruleForm = newValue;
        this.getQrcode();
      },
      deep: true
    },
    ruleForm: {
      handler(newValue) {
        this.$emit('userCenterDataChanged', newValue);
      },
      deep: true
    },
    shopInfo: {
      handler(newValue) {
        this.getQrcode();
      },
      deep: true
    }
    
  },
  created() {
    const _self = this;

    /* 监听接口操作结束事件，用来响应loading  保存按钮*/
    this._globalEvent.$on('userCenterSaveLoading', (status) => {
      _self.saveDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  保存并应用按钮*/
    this._globalEvent.$on('userCenterSaveAndApplyLoading', (status) => {
      _self.saveAndApplyDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  重置按钮*/
    this._globalEvent.$on('userCenterResetLoading', (status) => {
      _self.resetLoading = false;
    });

    this.ruleForm.backgroundImage= '';
    this.$store.dispatch('getShopInfo');
    this.$emit('userCenterDataChanged', this.ruleForm);
  },
  mounted() {
  },
  computed: {
      shopInfo() {
        return this.$store.getters.shopInfo || {};
      }
  },
  methods: {

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(this.currentModule.icon !== undefined && this.currentModule.icon !== null) {
        this.currentModule.icon = dialogData.filePath;
      }
      if(this.currentModule.backgroundImage !== undefined && this.currentModule.backgroundImage !== null) {
        this.currentModule.backgroundImage = dialogData.filePath;
      }
    },

    // 保存
    userCenterSave() {
      let self = this;
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          self.saveDataLoading = true;
          self.save();
        } else {
          // this.$message({ message: '请填写正确信息', type: 'warning' });
          return;
        }
      })
    },

    // 保存并生效
    userCenterSaveAndApply() {
      let self = this;
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          self.saveAndApplyDataLoading = true;
          self.saveAndApply();
        } else {
          // this.$message({ message: '请填写正确信息', type: 'warning' });
          return;
        }
      })
    },

      /* 获取二维码 */
    getQrcode(codeType, callback) {
      if(!this.ruleForm.shareUrl) {
        return;
      }
      this._apis.shop.getQrcode({
        url: 'https:' + this.ruleForm.shareUrl.split(':')[1].replace("&","[^]"),
        width: '150',
        height: '150',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        this.$message({ message: error, type: 'error' });
      });
    },

    /* 改变背景图片 */
    changeBackground() {
      this.currentModule=this.ruleForm; 
      this.dialogVisible=true; 
      this.currentDialog='dialogSelectImageMaterial';
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom {
    padding: 10px 15px 20px 15px !important;
    .add-btn {
      line-height: 20px;
      color: #655EFF;
      cursor: pointer;
    }
    .custom-list {
      li {
        .el-checkbox {
          float: left;
        }
        /deep/ .el-checkbox__input {
          padding-top: 9px;
        }
        .custom-form{
          float: left;
          margin-bottom: 18px !important;
          .module_block {
            margin-bottom: 0;
          }
          /deep/ .el-form-item__label {
            padding: 0 10px 0 0;
          }
          /deep/ .el-form-item__label::before {
            display: none;
          }
          .el-input {
            width: 100px !important;
          }
          /deep/ .el-input__inner {
            height: 34px;
            line-height: 34px;
          }
          .img_preview {
            width: 34px !important;
            height: 34px !important;
          }
          .m-colorPicker {
            padding: 4px;
            margin-right: 5px;
            border:1px solid rgba(204,204,204,1);
            border-radius: 1px;
          }
          /deep/ .colorBtn{
            width: 24px !important;
            height: 24px !important;
            margin: 0;
          }
          .custom-do {
            display: flex;
            width: 34px;
            justify-content: center;
            align-items: center;
            .custom-center {
              display: inline-block;
              width: 20px;
            }
            .icon {
              display: block;
              width: 20px;
              height: 13px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 14px 9px;
              cursor: pointer;
            }
            .top {
              background-image: url(~@/assets/images/common/icon-caret-top.png);
            }
            .bottom {
              background-image: url(~@/assets/images/common/icon-caret-bottom.png);
            }
            .top:hover {
              background-image: url(~@/assets/images/common/icon-caret-top-press.png);
            }
            .bottom:hover {
              background-image: url(~@/assets/images/common/icon-caret-bottom-press.png);
            }
          }
        }
      }
    }
  }
  .module_block{
    display:flex;
    flex-direction: row;
    margin-bottom:10px;
    .el-input{
      margin-right:10px;
    }
    .img_preview{
      width: 64px!important;
      height: 31px!important;
      display: block;
      margin-right: 10px;
      &:hover span{
        opacity: 1;
        transition: all 0.3s;
      }
      span{
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        opacity: 0;
        transition: all 0.3s;
        cursor: pointer;
      }
    }
    .colorBtn{
      width:31px!important;
      height:31px!important;
      margin-right:10px;
      border:1px solid #ddd;
    }
  }

.el-checkbox-group{
  .el-checkbox{
    margin-right: 10px;
  }
}
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
