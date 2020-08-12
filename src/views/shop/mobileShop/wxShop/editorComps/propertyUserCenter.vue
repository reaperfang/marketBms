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

        <div class="block form">
          <template v-for="(item, key) in ruleForm.moduleList">
            <!-- v-if=" item.name =='commission'?isOpenResell==1&&pathname=='/bp/shop/m_wxShopIndex':(item.name !== 'integralMarket' && item.name !== 'messageCenter')"/  h5隐藏分销入口 -->
            <el-form-item
               v-if=" item.name =='commission'?isOpenResell==1:(item.name !== 'integralMarket' && item.name !== 'messageCenter')"
              :key="key"
              :label="item.title"
              :prop="'moduleList.'+ key +'.titleValue'"
              :rules="[{ required: true, message: '请输入内容', trigger: 'blur' },{ min: 1, max: 10, message: '要求1~10个字符',trigger: 'blur' }]">
              <div class="module_block color_block">
                  <el-input v-model="item.titleValue"></el-input>
                  <div class="img_preview">
                    <img :src="item.icon || require('@/assets/images/shop/userCenter/' + item.defaultIcon + '.png')" alt="" title="点击更换">
                    <span @click="currentModule=item;dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换</span>
                  </div>
                  <colorPicker  v-model="item.color" defaultColor="#000"></colorPicker >
                  <!-- <el-button type="text">重置</el-button> -->
              </div>
            </el-form-item>
          </template>
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
            name: 'memberRank',
            title: '会员等级',
            titleValue: '会员等级',
            icon: '',
            defaultIcon: 'userCenter13',
            color: '#000'
          },
          coupon: {
            name: 'coupon',
            title: '优惠券',
            titleValue: '优惠券',
            icon: '',
            defaultIcon: 'userCenter14',
            color: '#000'
          },
          couponCode: {
            name: 'couponCode',
            title: '优惠码',
            titleValue: '优惠码',
            icon: '',
            defaultIcon: 'userCenter15',
            color: '#000'
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
