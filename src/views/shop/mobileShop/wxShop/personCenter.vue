<template>
  <div class="group-wrapper">
    <div class="module view">
      <div class="phone-head">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>个人中心</span>
      </div>
      <div class="phone-body" :style="bodyHeight">
        <componentUserCenter 
        :data="ruleForm" 
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
      @userCenterDataChanged="emitChangeRuleForm"
      ></propertyUserCenter>
    </div>
  </div>
</template>

<script>
import componentUserCenter from '@/components/Decorate//comps/componentUserCenter';
import propertyUserCenter from '@/components/Decorate//props/propertyUserCenter';
import utils from "@/utils";
export default {
  name: "personCenter",
  components: {componentUserCenter, propertyUserCenter},
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
      this._apis.shop.getUserCenterPage({}).then((response)=>{
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('moduleList') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.avatarPosition) {
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
      this._apis.shop.resetPersonalInfo({}).then((response)=>{
        this.$notify({
          title: '成功',
          message: '重置成功！',
          type: 'success'
        });
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('moduleList') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.avatarPosition) {
          this.ruleForm = pageData;
          this.ruleForm['status'] = response.status;
          this.ruleForm['shareUrl'] = response.shareUrl;
        }
        this._globalEvent.$emit('userCenterResetLoading', true);
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this._globalEvent.$emit('userCenterResetLoading', false);
      });
    },

    submit(params, type) {
      this._apis.shop.editUserCenterPage(params).then((response)=>{
        this.$notify({
          title: '成功',
          message: '编辑成功！',
          type: 'success'
        });
        if(type === 'saveAndApply') {
          this._globalEvent.$emit('userCenterSaveAndApplyLoading', true);
        }else{
          this._globalEvent.$emit('userCenterSaveLoading', true);
        }
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
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
}
</style>