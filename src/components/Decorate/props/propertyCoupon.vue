<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" v-calcHeight="height">
    <div class="block form">
      <el-form-item label="添加方式" prop="addType">
        <el-radio-group v-model="ruleForm.addType">
          <el-radio :label="1">手动添加</el-radio>
          <el-radio :label="2">自动获取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="addType">
        <el-button type="primary" plain @click="dialogVisible=true; currentDialog='dialogSelectCoupon'" v-if="ruleForm.addType === 1">添加优惠券</el-button>
        <div class="tag_wrapper" v-loading="loading">
          <el-tag
            v-for="tag in list"
            :key="tag.title"
            :closable="ruleForm.addType === 1"
            style="margin-right:5px;"
            type="success" @close="deleteItem(tag)" :title="getTitleTips(tag)">
            {{tag.title}}
          </el-tag>
        </div>
        <p style="color: rgb(211, 211, 211);;margin-top:10px;" v-if="ruleForm.addType === 1">建议最多添加10张优惠券</p>  
      </el-form-item>
      <el-form-item label="券活动数" prop="couponNumberType" v-if="ruleForm.addType === 2">
        <el-radio-group v-model="ruleForm.couponNumberType">
          <el-radio :label="1">全部</el-radio>
          <el-radio :label="2">
            <el-input
              style="width:200px;"
              placeholder="请输入显示的券活动数"
              v-model="ruleForm.showNumber" :disabled="ruleForm.couponNumberType === 1">
            </el-input>
          </el-radio>
        </el-radio-group>
        <p style="color: rgb(211, 211, 211);;margin-top:10px;" v-if="ruleForm.addType === 2">建议最大设置为10个</p>  
      </el-form-item>
      <el-form-item label="样式" prop="couponStyle">
        <el-radio-group v-model="ruleForm.couponStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
          <el-radio :label="4">样式4</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="颜色" prop="couponColor">
        <!-- <el-radio-group v-model="ruleForm.couponColor">
          <el-radio :label="1">颜色1</el-radio>
          <el-radio :label="2">颜色2</el-radio>
          <el-radio :label="3">颜色3</el-radio>
          <el-radio :label="4">颜色4</el-radio>
          <el-radio :label="5">颜色5</el-radio>
        </el-radio-group> -->
        <wxColor v-model="ruleForm.couponColor" @input="yuan"></wxColor>
      </el-form-item>
      <el-form-item label="更多设置" prop="hideScrambled">
        <el-checkbox v-model="ruleForm.hideScrambled">隐藏已抢完劵</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <p>当页面无可显示的优惠券时，优惠券区块将隐藏</p>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="echoList"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectCoupon from '@/views/shop/dialogs/decorateDialogs/dialogSelectCoupon';
import wxColor from '@/components/Wxcolor';
export default {
  name: 'propertyCoupon',
  mixins: [propertyMixin],
  components: {dialogSelectCoupon, wxColor},
  data () {
    return {
      ruleForm: {
        addType: 2,//添加方式
        showNumber: 5,   //显示个数限制
        couponNumberType: 1,  //券活动数类型
        couponStyle: 1,//优惠券样式
        couponColor: 1,//优惠券颜色类型
        hideScrambled: false,//隐藏已抢完券
        ids: []//优惠券id列表
      },
      rules: {

      },
      list: [],
      echoList: [],
      dialogVisible: false,
      currentDialog: '',
      loading: false
    }
  },
  created() {
    this.fetch(false);
  },
   watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.id);
        }
        this.fetch();
      },
      deep: true
    },
    /* 监听添加类型，自动获取状态则拉取一下数据 */
    'ruleForm.addType'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      if(newValue == 2) {
        this.fetch();
      }else{
        this.list = [];
        this.fetch();
      }
    },

    /* 监听显示个数类型 */
    'ruleForm.couponNumberType'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      this.fetch();
    },

    /* 监听显示个数 */
    'ruleForm.showNumber'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      this.fetch();
    },
    
    /* 监听隐藏已抢完券 */
    'ruleForm.hideScrambled'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      this.fetch();
    },

    'ruleForm.ids': {
      handler(newValue, oldValue) {
        const _self = this;
        if(!this.utils.isIdsUpdate(newValue, oldValue)) {
          this.echoList = [];
          newValue.forEach((item)=>{
            _self.echoList.push({id: item});
          })
        }
      },
      deep: true
    }
  },
  methods: {
    //根据ids拉取数据
    fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
        if(componentData) {
          bNeedUpdateMiddle && this._globalEvent.$emit('fetchCoupon', this.ruleForm, this.$parent.currentComponentId);
          let params = {};
            if(componentData.addType == 2) {
              if(componentData.couponNumberType === 1) {
                params = {
                  couponType: 0
                };
              }else {
                params = {
                  couponType: 0,
                  limitedQuantity: componentData.showNumber
                };
              }
            }else{
              if(componentData.ids.length) {
                params = {
                  couponType: 0,
                  ids: componentData.ids
                };
              }else{
                this.list = [];
                return;
              }
            }
            if (componentData.hideScrambled) {
              params.remainStockFlag = true
            }else {
              params.remainStockFlag =false
            }

            this.loading = true;
            this.list = [];
            this._apis.shop.getCouponListByIds(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.list = [];
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
       this.list = datas;
    },

    yuan(value) {
      this.ruleForm.couponColor = value.wxhex || '';
    },

    getTitleTips(item) {
      if(item.useCondition > -1) {
        return `满${item.useCondition},减${item.useTypeFullcut}`;
      }else{
        return `减${item.useTypeFullcut}`;
      }
    }
  }
}
</script>

<style lang="scss">
.tag_wrapper{
  max-height:300px;
  overflow-y: auto;
  &::-webkit-scrollbar {
      width: 2px;
      height: 8px;
  }
  &::-webkit-scrollbar-thumb {
      border-radius: 10px!important;
      background: rgba(101,94,255,.4)!important;
  }
  &::-webkit-scrollbar-track {
      border-radius: 0!important;
      background: rgba(101,94,255,.1)!important;
  }
}
</style>
