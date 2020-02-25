<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-calcHeight="190+20">
        <div class="block header">
          <p class="title">商品分类页设置</p>
          <p class="state" :class="{'normal': ruleForm.status === 0}">{{ruleForm.status === 0 ? '生效中' : '未生效'}}</p>
        </div>
        <div class="block form">
          <el-form-item label="分类样式" prop="groupStyle">
            <el-radio-group v-model="ruleForm.groupStyle">
              <el-radio :label="1">左侧样式</el-radio>
              <el-radio :label="2">顶部样式</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类字体" prop="groupFont">
             <el-radio-group v-model="ruleForm.groupFont">
              <el-radio :label="1">常规体</el-radio>
              <el-radio :label="2">加粗体</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="分类图片" prop="groupImg">
             <el-radio-group v-model="ruleForm.groupImg">
              <el-radio :label="1">直角</el-radio>
              <el-radio :label="2">圆角</el-radio>
            </el-radio-group>
          </el-form-item> 
          <el-form-item label="搜索样式" prop="searchStyle">
             <el-radio-group v-model="ruleForm.searchStyle">
              <el-radio :label="1">方形</el-radio>
              <el-radio :label="2">圆形</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="block form">
          <el-form-item label="页面边距" prop="groupStyle">
            <div class="slider-wrapper">
             <el-slider v-model="ruleForm.pageMargin" :min="0" :max="30"></el-slider>
             <span>{{ruleForm.pageMargin}}像素</span>
            </div>
          </el-form-item>
          <el-form-item label="分类间距" prop="groupFont">
             <div class="slider-wrapper">
              <el-slider v-model="ruleForm.groupMargin" :min="0" :max="30"></el-slider>
              <span>{{ruleForm.groupMargin}}像素</span>
             </div>
          </el-form-item>
        </div>

        <div class="block button">
          <el-button @click="resetLoading = true; resetData()" :loading="resetLoading">重    置</el-button>
          <el-button @click="saveDataLoading = true; save()" :loading="saveDataLoading">保    存</el-button>
          <el-button type="primary" @click="saveAndApplyDataLoading = true; saveAndApply()" :loading="saveAndApplyDataLoading">保存并生效</el-button>
          <el-popover
            ref="popover2"
            placement="bottom"
            title=""
            style="margin-left:10px;"
            width="170"
            trigger="click"
            content="">
            <img v-if="showCode" :src="qrCode" alt="">
            <span v-else>无分享地址</span>
            <el-button slot="reference" @click="showCode=true">预    览</el-button>
          </el-popover>
        </div>

      </el-form>
</template>

<script>
export default {
  name: 'propertyGoodsGroupPageSetting',
  components: {},
  props: ['saveAndApply', 'save', 'resetData', 'data'],
  data () {
    return {
      resetLoading: false,  //重置loading
      saveDataLoading: false,  //保存loading
      saveAndApplyDataLoading: false,  //保存并应用loading
      ruleForm: {
        groupStyle: 1,  //分类样式
        groupFont: 1,  //分类字体
        groupImg: 1,  //图片圆角
        pageMargin: 15,  //页面边距
        groupMargin: 20,  //分类间距
        searchStyle: 2  //搜索框样式  1方形  2圆形
      },
      rules: {},
      showCode: false,   //是否显示二维码
      qrCode: ''
    }
  },
  watch:{
    data:{
      handler(newValue) {
        this.ruleForm = newValue;
        // if(!this.ruleForm['searchStyle']) {
        //   this.ruleForm['searchStyle'] = 2;
        // }
        this.getQrcode();
      },
      deep: true
    },
    ruleForm: {
      handler(newValue) {
        this.$emit('goodsGroupPageDataChanged', newValue);
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
    this._globalEvent.$on('goodsGroupPageSettingSaveLoading', (status) => {
      _self.saveDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  保存并应用按钮*/
    this._globalEvent.$on('goodsGroupPageSettingSaveAndApplyLoading', (status) => {
      _self.saveAndApplyDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  重置按钮*/
    this._globalEvent.$on('goodsGroupPageSettingResetLoading', (status) => {
      _self.resetLoading = false;
    });

    this.$store.dispatch('getShopInfo');
    this.$emit('goodsGroupPageDataChanged', this.ruleForm);
  },
  mounted() {
  },
  computed: {
      shopInfo() {
        return this.$store.getters.shopInfo || {};
      }
  },
  methods: {
      /* 获取二维码 */
    getQrcode(codeType, callback) {
      if(!this.ruleForm.shareUrl) {
        return;
      }
      this._apis.shop.getQrcode({
        url: this.ruleForm.shareUrl.replace("&","[^]"),
        width: '150',
        height: '150',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.block{
  &.button{
    padding: 30px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}

.el-radio-group{
  margin-top: 9px;
  .el-radio {
      margin-bottom: 10px;
      margin-right: 10px;
  }
}
.el-checkbox-group{
  .el-checkbox{
    margin-right: 10px;
  }
}
</style>
