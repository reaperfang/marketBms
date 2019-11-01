<template>
  <div class="group-wrapper">
    <div class="module view">
      <div class="phone-head">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>商品分类</span>
      </div>
      <div class="phone-body" :style="bodyHeight">
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
import componentGoodsGroupPageSetting from '@/components/Decorate/comps/componentGoodsGroupPageSetting';
import propertyGoodsGroupPageSetting from '@/components/Decorate/props/propertyGoodsGroupPageSetting';
import utils from "@/utils";
export default {
  name: "shopIndex",
  components: {componentGoodsGroupPageSetting, propertyGoodsGroupPageSetting},
  data() {
    return {
     ruleForm: null,
     bodyHeight: {}
    };
  },
  created() {
    this.fetch();
  },
  mounted() {
    this.bodyHeight = {
      height: document.body.clientHeight - 220 - 20 + 'px'
    }
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getGoodsGroup({}).then((response)=>{
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
          this.ruleForm['shareUrl'] = response.shareUrl;
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
        this.$notify({
          title: '成功',
          message: '重置成功！',
          type: 'success'
        });
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
          this.ruleForm['shareUrl'] = response.shareUrl;
        }
        this._globalEvent.$emit('goodsGroupPageSettingResetLoading', true);
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this._globalEvent.$emit('goodsGroupPageSettingResetLoading', false);
      });
    },

    submit(params, type) {
      this._apis.shop.editGoodsGroup(params).then((response)=>{
        this.$notify({
          title: '成功',
          message: '编辑成功！',
          type: 'success'
        });
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('goodsGroupPageSettingSaveAndApplyLoading', true);
        }else{
          this._globalEvent.$emit('goodsGroupPageSettingSaveLoading', true);
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
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
}
</style>
