<template>
  <div class="group-wrapper">
    <div class="module view">
      <div class="phone-head">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>个人中心</span>
      </div>
      <div ref="body" class="phone-body" v-calcHeight="220+20">
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
      @scrollToBottom="scrollToBottom"
      ></propertyUserCenter>
    </div>
  </div>
</template>

<script>
import componentUserCenter from './editorComps/componentUserCenter';
import propertyUserCenter from './editorComps/propertyUserCenter';
import utils from "@/utils";
export default {
  name: "personCenter",
  components: {componentUserCenter, propertyUserCenter},
  data() {
    return {
     ruleForm: null,
     initRuleForm: null, //兼容老数据时、分销中心、重置时使用
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
    /* 滚动到底部 */
    scrollToBottom () {
        this.$nextTick(() => {
            const container = this.$refs.body;
            const top = container.scrollHeight;
            container.scrollTo({
              top: top,
              behavior: "smooth"
            });
        })
    },

    fetch() {
      this.loading = true;
      //pageTag: 0 微店店铺
      this._apis.shop.getUserCenterPage({pageTag: 0}).then((response)=>{
        //response.pageData = null;
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
          //如果不是数组，则是老数据，moduleList需要兼容最新数据格式
          if(!Array.isArray(pageData.moduleList)){
            pageData.moduleList = this.comparePageData(pageData.moduleList);
          }
          //如果之前保存的数据中没有分销中心，并且开启了分销中心，则注入分销中心初始化数据
          if(pageData.moduleList.filter(item => item.title === '分销中心').length == 0 && this.shopInfo.isOpenResell===1){
            const obj = utils.deepClone(this.initRuleForm.moduleList[this.initRuleForm.moduleList.length - 1]);
            pageData.moduleList.push(obj);
          }
          //如果之前保存的数据中有分销中心，但是分销中心已失效，则需要清除分销中心
          if(pageData.moduleList.filter(item => item.title === '分销中心').length == 1 && this.shopInfo.isOpenResell!==1){
            pageData.moduleList = pageData.moduleList.filter(item => item.title !== '分销中心');
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

    comparePageData(moduleList) {
      let arr = [];
      Object.keys(moduleList).forEach((key) => {
        if(key !== 'coupon' && key !== 'couponCode'){
          const item = moduleList[key];
          const defaultItem = this.initRuleForm.moduleList.filter((val) => val.title === item.title)[0];
          delete item.name;
          delete item.defaultIcon;
          if(!item.icon){
            item.icon = defaultItem.icon;
          }
          item.id = defaultItem.id;
          item.linkTo = defaultItem.linkTo;
          item.disabled = defaultItem.disabled;
          arr.push(item);
        }
      })
      return arr;
    },

    /* 表单数据发生改变 */
    emitChangeRuleForm(value) {
      this.ruleForm = value
      if(!this.initRuleForm) {
        this.initRuleForm = utils.deepClone(this.ruleForm);
      }
    },

    //处理未勾选的固定菜单数据moduleList恢复初始化状态
    initDisabledData() {
      const data = utils.deepClone(this.ruleForm);
      data.moduleList.forEach((item, index) => {
        //如果是分销中心且已失效，则删除(只有在新店铺从未保存过时初始数据中有分销中心，但没开启分销中心，这里判断去除)
        if(item.title === '分销中心' && this.shopInfo.isOpenResell!==1){
          data.moduleList.splice(index, 1);
          return;
        }
        
        if(item.disabled === 1){
          const defaultItem = this.initRuleForm.moduleList.filter((val) => val.title === item.title)[0];
          item.titleValue = defaultItem.titleValue;
          item.icon = defaultItem.icon;
          item.color = defaultItem.color;
        }
      })
      return data;
    },

    /* 保存并生效 */
    saveAndApply() {
      const data = this.initDisabledData();
      this.submit({
        status: '0',
        pageKey: '',
        pageTag: 0,
        pageData: utils.compileStr(JSON.stringify(data))
      }, 'saveAndApply');
    },

    /* 保存 */
    save() {
      const data = this.initDisabledData();
      this.submit({
        status: '1',
        pageKey: '',
        pageTag: 0,
        pageData: utils.compileStr(JSON.stringify(data))
      });
    },

    /* 重置 */
    resetData() {
      this._apis.shop.resetPersonalInfo({pageTag: 0}).then((response)=>{
        this.$message.success('重置成功！')
        //如果还未保存过，则重置后应变为初始化
        if(!response.pageData) {
          this.ruleForm = utils.deepClone(this.initRuleForm);
        }
        const string = utils.uncompileStr(response.pageData);
        if(string.indexOf('moduleList') < 0) {
          return;
        }
        let pageData = JSON.parse(string);
        if(Object.prototype.toString.call(pageData) !== '[object Object]') {
          return;
        }
        if(pageData && pageData.avatarPosition) {
          //如果不是数组，则是老数据，moduleList需要兼容最新数据格式
          if(!Array.isArray(pageData.moduleList)){
            pageData.moduleList = this.comparePageData(pageData.moduleList);
          }
          //如果之前保存的数据中没有分销中心，并且开启了分销中心，则注入分销中心初始化数据
          if(pageData.moduleList.filter(item => item.title === '分销中心').length == 0 && this.shopInfo.isOpenResell===1){
            const obj = utils.deepClone(this.initRuleForm.moduleList[this.initRuleForm.moduleList.length - 1]);
            pageData.moduleList.push(obj);
          }
          //如果之前保存的数据中有分销中心，但是分销中心已失效，则需要清除分销中心
          if(pageData.moduleList.filter(item => item.title === '分销中心').length == 1 && this.shopInfo.isOpenResell!==1){
            pageData.moduleList = pageData.moduleList.filter(item => item.title !== '分销中心');
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
  margin-top:10px;
}
</style>