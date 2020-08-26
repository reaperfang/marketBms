/* 移动H5个人中心装修 -- 继承自 微信个人中心装修 */
<!--
<script>
import personCenter from '../wxShop/personCenter'
import componentUserCenter from './editorComps/h5ComponentUserCenter';
import propertyUserCenter from './editorComps/h5PropertyUserCenter';
export default {
  name: "h5PersonCenter",
  extends: personCenter,
  components: {componentUserCenter, propertyUserCenter},
}
</script>
-->

/* 移动H5个人中心装修 -- 独立存在，不在继承微信个人中心装修 */
<template>
  <div class="group-wrapper">
    <div class="module view" v-calcHeight="197">
      <div class="phone-head">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>个人中心</span>
      </div>
      <div class="phone-body">
        <componentUserCenter 
        :data="ruleForm" 
        :isOpenResell="shopInfo.isOpenResell"
        v-if="ruleForm"
        ></componentUserCenter>
      </div>
    </div>
    <div class="module props">
      <propertyUserCenter 
      :saveAndApply="saveAndApply" 
      :data="ruleForm" 
      :save="save" 
      :resetData="resetData"
      :isOpenResell="shopInfo.isOpenResell"
      @userCenterDataChanged="emitChangeRuleForm"
      ></propertyUserCenter>
    </div>
  </div>
</template>

<script>
import componentUserCenter from './editorComps/h5ComponentUserCenter';
import propertyUserCenter from './editorComps/h5PropertyUserCenter';
import utils from "@/utils";
export default {
  name: "personCenter",
  components: {componentUserCenter, propertyUserCenter},
  data() {
    return {
     ruleForm: null
    };
  },
  created() {
    this.fetch();
    this.$store.dispatch('getShopInfo');
  },
  mounted() {
  },
  computed:{
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getUserCenterPage({pageTag: 1}).then((response)=>{
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('moduleList') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.avatarPosition) {
          // h5隐藏分销入口 pageData.moduleList.commission==undefined&&this.shopInfo.isOpenResell===1&&window.location.pathname=='/bp/shop/m_wxShopIndex'
          if(pageData.moduleList.commission==undefined&&this.shopInfo.isOpenResell===1){
            pageData.moduleList['commission'] = {
              name: 'commission',
              title: '分销中心',
              titleValue: '分销中心',
              icon: '',
              defaultIcon: 'userCenter21',
              color: '#000'
            }
          }
          this.ruleForm = pageData;
          this.ruleForm['status'] = response.status;
          this.ruleForm['shareUrl'] = 'https:' + response.shareUrl.split(':')[1];
        }
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 表单数据发生改变 */
    emitChangeRuleForm(value) {
      this.ruleForm = value
    },

    /* 保存并生效 */
    saveAndApply() {
      this.submit({
        status: '0',
        pageKey: '',
        pageTag: 1,
        pageData: utils.compileStr(JSON.stringify(this.ruleForm))
      }, 'saveAndApply');
    },

    /* 保存 */
    save() {
       this.submit({
        status: '1',
        pageKey: '',
        pageTag: 1,
        pageData: utils.compileStr(JSON.stringify(this.ruleForm))
      });
    },

    /* 重置 */
    resetData() {
      this._apis.shop.resetPersonalInfo({pageTag: 1}).then((response)=>{
        this.$message.success('重置成功！')
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('moduleList') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.avatarPosition) {
          if(pageData.moduleList.commission==undefined&&this.shopInfo.isOpenResell===1){
            pageData.moduleList['commission'] = {
              name: 'commission',
              title: '分销中心',
              titleValue: '分销中心',
              icon: '',
              defaultIcon: 'userCenter21',
              color: '#000'
            }
          }
          this.ruleForm = pageData;
          this.ruleForm['status'] = response.status;
          this.ruleForm['shareUrl'] = 'https:' + response.shareUrl.split(':')[1];
        }
        this._globalEvent.$emit('userCenterResetLoading', true);
      }).catch((error)=>{
        this.$message.error(error);
        this._globalEvent.$emit('userCenterResetLoading', false);
      });
    },

    submit(params, type) {
      this._apis.shop.editUserCenterPage(params).then((response)=>{
        this.$message.success('编辑成功！')
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('userCenterSaveAndApplyLoading', true);
        }else{
          this._globalEvent.$emit('userCenterSaveLoading', true);
        }
      }).catch((error)=>{
        this.$message.error(error);
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('userCenterSaveAndApplyLoading', false);
        }else{
          this._globalEvent.$emit('userCenterSaveLoading', false);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.group-wrapper{
  display:flex;
  flex-direction: row;
  margin-top:20px;
  .module {
    &.view {
      width: 377px;
      border: 1px #D0D6E4 solid;
      box-shadow: none !important;
      .phone-body {
        height: calc(100% - 64px) !important;
      }
    }
  }
}
</style>