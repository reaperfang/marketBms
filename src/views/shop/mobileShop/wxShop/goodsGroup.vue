<template>
  <div class="group-wrapper">
    <div class="module view" v-calcHeight="197">
      <div class="phone-head">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>商品分类</span>
      </div>
      <div class="phone-body" v-calcHeight="220+20">
        <componentGoodsGroupPageSetting 
        :data="ruleForm" 
        v-if="ruleForm"
        ></componentGoodsGroupPageSetting>
      </div>
    </div>
    <div class="module props">
      <propertyGoodsGroupPageSetting 
      :saveAndApply="saveAndApply" 
      :data="ruleForm" 
      :save="save" 
      :resetData="resetData"
      @goodsGroupPageDataChanged="emitChangeRuleForm"
      ></propertyGoodsGroupPageSetting>
    </div>
  </div>
</template>

<script>
import componentGoodsGroupPageSetting from './editorComps/componentGoodsGroupPageSetting';
import propertyGoodsGroupPageSetting from './editorComps/propertyGoodsGroupPageSetting';
import utils from "@/utils";
export default {
  name: "shopIndex",
  components: {componentGoodsGroupPageSetting, propertyGoodsGroupPageSetting},
  data() {
    return {
     ruleForm: null
    };
  },
  created() {
    this.fetch();
  },
  mounted() {
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getGoodsGroup({}).then((response)=>{
        if(!response || !response.pageData) {
          return;
        }
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('groupStyle') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.groupStyle) {
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
        pageData: utils.compileStr(JSON.stringify(this.ruleForm))
      }, 'saveAndApply');
    },

    /* 保存 */
    save() {
       this.submit({
        status: '1',
        pageKey: '',
        pageData: utils.compileStr(JSON.stringify(this.ruleForm))
      });
    },

    /* 重置 */
    resetData() {
      this._apis.shop.resetGoodsGroup({}).then((response)=>{
        this.$message.success('重置成功！')
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('groupStyle') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.groupStyle) {
          this.ruleForm = pageData;
          this.ruleForm['status'] = response.status;
          this.ruleForm['shareUrl'] = 'https:' + response.shareUrl.split(':')[1];
        }
        this._globalEvent.$emit('goodsGroupPageSettingResetLoading', true);
      }).catch((error)=>{
        console.error(error)
        this._globalEvent.$emit('goodsGroupPageSettingResetLoading', false);
      });
    },

    submit(params, type) {
      this._apis.shop.editGoodsGroup(params).then((response)=>{
        this.$message.success('编辑成功！')
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('goodsGroupPageSettingSaveAndApplyLoading', true);
        }else{
          this._globalEvent.$emit('goodsGroupPageSettingSaveLoading', true);
        }
      }).catch((error)=>{
        this.$message.error(error);
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('goodsGroupPageSettingSaveAndApplyLoading', false);
        }else{
          this._globalEvent.$emit('goodsGroupPageSettingSaveLoading', false);
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
