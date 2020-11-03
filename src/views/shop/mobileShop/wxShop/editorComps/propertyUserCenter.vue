/* 微信个人中心装修属性区 */
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-calcHeight="303">
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
          <div class="add-btn-wrap" ref="customAddWrap">
            <div class="add-btn" :style="customAddStyle">
              <span @click="customAdd">添加自定义</span>
            </div>
          </div>
          <!-- v-if=" item.name =='commission'?isOpenResell==1&&pathname=='/bp/shop/m_wxShopIndex':(item.name !== 'integralMarket' && item.name !== 'messageCenter')"/  h5隐藏分销入口 -->
          <ul class="custom-list">
            <template v-for="(item, index) in ruleForm.moduleList">
              <li :key="index" v-if="item.title.includes('分销中心') ? isOpenResell==1 : (item.title !== '积分商城' && item.title !== '消息中心')">
                <div class="clearfix">
                  <el-checkbox @change="disabledChange(item.disabled, index)" v-if="!item.title.includes('自定义')" v-model="item.disabled" :true-label="2" :false-label="1"></el-checkbox>
                  <i v-else class="el-icon-delete" @click="deleteCustom(item, index)"></i>
                  <el-form-item
                    :ref="'customFormItem'+index"
                    class="custom-form"
                    :key="index"
                    :label="item.title"
                    label-width="72px"
                    :prop="'moduleList['+ index +'].titleValue'"
                    :rules="item.disabled === 2 ? [{ required: true, message: '请输入内容', trigger: 'blur' },{ min: 1, max: 10, message: '请输入1~10个字符',trigger: 'blur' }] : []">
                    <div class="module_block color_block" style="position:relative;">
                        <div class="custom-disabled" v-show="item.disabled === 1"></div>
                        <el-input :disabled="item.disabled === 1" v-model="item.titleValue" placeholder="请输入"></el-input>
                        <div class="img_preview">
                          <img :src="item.icon" alt="" title="点击更换">
                          <span @click="currentModule=item;dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换</span>
                        </div>
                        <colorPicker  v-model="item.color" defaultColor="#000"></colorPicker >
                        <div class="custom-do">
                          <div class="custom-center">
                            <span class="icon top" v-if="index != 0" @click="sortTop(item, index)"></span>
                            <span class="icon bottom" v-if="index != ruleForm.moduleList.length - 1" @click="sortBottom(item, index)"></span>
                          </div>
                        </div>
                        <!-- <el-button type="text">重置</el-button> -->
                    </div>
                  </el-form-item>
                </div>
                <div class="custom-link" v-if="item.title.includes('自定义')">
                  <div v-show="item.linkTo === null" class="el-form-item__error" style="left: 158px;top: 15px;">
                    请选择跳转页面
                  </div>
                  <span class="title">跳转链接</span>
                  <el-button
                  v-if="!item.linkTo"
                  type="text"
                  style="padding-top: 0;"
                  @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">选择跳转到的页面</el-button>
                  <div class="link_overview clearFix arrow" v-if="item.linkTo && item.linkTo.typeName">
                    <div class="cont l">
                      <span class="l" :title="item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name)">{{item.linkTo.typeName + ' | ' + (item.linkTo.data.title || item.linkTo.data.name)}}</span>
                      <i @click="removeLink(item, index)"></i>
                    </div>
                    <span class="modify r" @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">修改</span>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>  

        <div class="block button">
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
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
      </el-form>
</template>

<script>
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
import vuedraggable from "vuedraggable";
import dataBase from '@/system/constant/dataBase64.js';

import store from '@/store';
let shopInfo = store.getters.shopInfos
const cid = shopInfo && shopInfo.id || ''
export default {
  name: 'propertyUserCenter',
  components: {dialogSelectJumpPage, dialogSelectImageMaterial, vuedraggable},
  props: ['saveAndApply', 'save', 'resetData', 'data', 'isOpenResell'],
  data () {
    return {
      resetLoading: false,  //重置loading
      saveDataLoading: false,  //保存loading
      saveAndApplyDataLoading: false,  //保存并应用loading
      dialogVisible: false,
      currentDialog: '',
      currentModule: null,
      currentNav: null,  //当前操作的自定义菜单栏
      pathname:window.location.pathname,
      customAddStyle: null, //添加自定义固定样式
      ruleForm: {
        backgroundImage: '',  //背景图
        backgroundGradients: 1,  //背景渐变
        avatarPosition: 1,  //头像位置
        nickColor: '#000000',  //昵称颜色
        memberColumeStyle: 1,  //会员栏样式
        moduleList: [
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
          {
            id: uuidv4(),
            title: '会员等级',
            titleValue: '会员等级',
            icon: dataBase.memberRank,
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'memberRank',
              id: 8,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '赠品包',
            titleValue: '赠品包',
            icon: dataBase.gift,
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'gift',
              id: 10,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '我的拼团',
            titleValue: '我的拼团',
            icon: dataBase.myAssemble,
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'myAssemble',
              id: 11,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '地址管理',
            titleValue: '地址管理',
            icon: dataBase.address,
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'address',
              id: 12,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '分销中心',
            titleValue: '分销中心',
            icon: dataBase.commissionCenter,
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'commissionCenter',
              id: 13,
              cid: cid
            }
          }
        ]
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
    this.$refs.ruleForm.$el.addEventListener('scroll', this.scrollHandler, false)

    //如果没有分销中心，则先移除，避免向上向下移动时数量索引index不正确
    if(this.isOpenResell!=1){
      this.ruleForm.moduleList.pop();
    }
  },
  computed: {
      shopInfo() {
        return this.$store.getters.shopInfo || {};
      }
  },
  methods: {
    //监听form区域滚动
    scrollHandler() {
      const ruleForm = this.$refs.ruleForm.$el;
      const customAddTop = this.$refs.customAddWrap.offsetTop - ruleForm.offsetTop;
      const scrollTop = ruleForm.scrollTop;
      if(scrollTop >= customAddTop){
        this.customAddStyle = {
          'z-index': 10,
          'position': 'absolute',
          'top': (scrollTop-customAddTop)+'px'
        };
      }else{
        this.customAddStyle = null;
      }
    },

    disabledChange(disabled, index) {
      if(disabled === 2){ //选中时触发验证
        this.$nextTick(() => {
          this.$refs['ruleForm'].validate();
        })
      }else{ //不选中时清除当前的错误
        this.$refs['customFormItem'+index][0].clearValidate();
      }
    },

    //添加自定义栏
    customAdd() {
      const length = this.ruleForm.moduleList.filter((item) => item.title.includes('自定义')).length + 1;
      //自定义初始数据格式
      const obj = {
        id: uuidv4(),
        title: '自定义' + length,
        titleValue: '',
        icon: dataBase.custom,
        color: '#000',
        disabled: 2
      };
      this.ruleForm.moduleList.push(obj);
      this.$emit('scrollToBottom');
      this.$nextTick(() => {
        const container = this.$refs.ruleForm.$el;
        const top = container.scrollHeight;
         container.scrollTo({
          top: top,
          behavior: "smooth"
        });
      })
    },

    //删除自定义
    deleteCustom(val, index) {
      this.confirm({icon: true, text: '是否确认删除'}).then(() => {
          const delNum = parseInt(val.title.substring(3));
          this.ruleForm.moduleList.splice(index, 1);
          this.ruleForm.moduleList.forEach((item) => {
            const title = item.title;
            if(title.includes('自定义') && parseInt(title.substring(3)) > delNum) {
              const num = parseInt(title.substring(3)) - 1;
              item.title = '自定义' + num;
            }
          })
          //this.$message.success('删除成功！');
      }).catch(error => {
          
      })
    },

    //向上移动
    sortTop(item, index) {
      const prevItem = this.ruleForm.moduleList[index - 1];
      this.$set(this.ruleForm.moduleList, index - 1, item);
      this.$set(this.ruleForm.moduleList, index, prevItem);
      this.$nextTick(() => {
        this.$refs['customFormItem'+index][0].clearValidate();
        this.$refs['ruleForm'].validate();
      })
    },

    //向下移动
    sortBottom(item, index) {
      const nextItem = this.ruleForm.moduleList[index + 1];
      this.$set(this.ruleForm.moduleList, index + 1, item);
      this.$set(this.ruleForm.moduleList, index, nextItem);
      this.$nextTick(() => {
        this.$refs['customFormItem'+index][0].clearValidate();
        this.$refs['ruleForm'].validate();
      })
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(this.currentModule.icon !== undefined && this.currentModule.icon !== null) {
        this.currentModule.icon = dialogData.filePath;
      }
      if(this.currentModule.backgroundImage !== undefined && this.currentModule.backgroundImage !== null) {
        this.currentModule.backgroundImage = dialogData.filePath;
      }
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.currentNav.linkTo = linkTo;
    },

    /* 移除链接 */
    removeLink(item, index) {
      item.linkTo = null;
      this.$set(this.ruleForm.moduleList, index, item);
    },

    //验证自定义的跳转链接
    validLinkTo() {
      let linkToMark = false;
      this.ruleForm.moduleList.forEach((item, index) => {
        if(item.title.includes('自定义') && !item.linkTo){
          linkToMark = true;
          item.linkTo = null;
          this.$set(this.ruleForm.moduleList, index, item);
        }
      })
      return linkToMark;
    },

    // 保存
    userCenterSave() {
      let self = this;
      const linkToMark = this.validLinkTo();
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          if(linkToMark){ //如果存在自定义且其未选择跳转链接，则不可保存
            return;
          }
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
      const linkToMark = this.validLinkTo();
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          if(linkToMark){ //如果存在自定义且其未选择跳转链接，则不可保存
            return;
          }
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
    padding: 0 15px 20px 15px !important;
    .add-btn-wrap {
      position: relative;
      height: 40px;
      line-height: 40px;
    }
    .add-btn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #655EFF;
      background: #fff;
      cursor: pointer;
    }
    .custom-list {
      li {
        .el-checkbox {
          float: left;
        }
        .el-icon-delete{
          float: left;
          margin-top: 9px;
          color: #F55858;
          cursor: pointer;
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
            text-align: right !important;
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
            height: 34px;
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
          .custom-disabled {
            z-index: 10;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: not-allowed;
            filter: grayscale(90%);
          }
        }
      }
    }
  }
  .custom-link {
    position: relative;
    padding-left: 88px;
    padding-bottom: 15px;
    .title {
      margin-right: 10px;
      color: #44434B;
    }
    .link_overview {
      padding-top: 10px;
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
