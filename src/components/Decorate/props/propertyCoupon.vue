<template>
  <el-form class="property-coupon" ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="添加方式" prop="addType">
        <el-radio-group v-model="ruleForm.addType">
          <el-radio :label="1">手动添加</el-radio>
          <el-radio :label="2">自动获取</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="" prop="addType">
        <div class="row align-center">
          <div class="add-button-x add-coupon" @click="dialogVisible=true; currentDialog='dialogSelectCoupon'" v-if="ruleForm.addType === 1">
            <i class="el-icon-plus"></i>
            <span>添加优惠券</span>
          </div>
          <p class="prop-message" v-if="ruleForm.addType === 1">最多添加20张优惠券</p>  
        </div>
        <div class="tag_wrapper" v-loading="loading">
          <el-tag
            v-for="tag in displayList"
            :key="tag.id"
            :closable="ruleForm.addType === 1"
            style="margin-right:5px;"
            type="success" @close="deleteItem(tag)" :title="getTitleTips(tag)">
            {{tag.title.length >= 5 ? tag.title.substring(0, 3) + '...' : tag.title}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="券活动数" prop="couponNumberType" v-if="ruleForm.addType === 2">
        <el-radio-group v-model="ruleForm.couponNumberType">
          <el-radio :label="1">全部</el-radio>
          <el-radio :label="2" style="margin-bottom:4px;">
            <numberInput
              style="width: 200px;"
              placeholder="请输入显示的券活动数"
              v-model="ruleForm.showNumber"
              :disabled="ruleForm.couponNumberType === 1"
              :max="maxShowNumber"
              type="integer"
            ></numberInput>
          </el-radio>
        </el-radio-group>
        <p class="prop-message" v-if="ruleForm.addType === 2">最多添加20张优惠券</p>  
      </el-form-item>
      <el-form-item label="排列样式" prop="listStyle">
        <el-radio-group class="radio-block" v-model="ruleForm.listStyle">
          <el-radio :label="1">横向滑动</el-radio>
          <el-radio :label="2">一行三个</el-radio>
          <el-radio :label="3">大图模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡片样式" prop="couponStyle">
        <el-radio-group class="radio-block" v-model="ruleForm.couponStyle">
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
      <el-form-item label="更多设置" prop="hideScrambled" style="margin-bottom: -5px;">
        <el-checkbox v-model="ruleForm.hideScrambled">隐藏已抢完劵</el-checkbox>
      </el-form-item>
      <el-form-item label="">
        <p class="prop-message">当页面无可显示的优惠券时，优惠券区块将隐藏</p>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="echoList"></component>
  </el-form>
</template>

<script>
import utils from '@/utils';
import mixinPropsData from '../mixins/mixinPropsData';
import dialogSelectCoupon from '@/components/Decorate/dialogs/dialogSelectCoupon';
import wxColor from '@/components/Wxcolor';
import numberInput from "@/components/NumberInput";
export default {
  name: 'propertyCoupon',
  mixins: [mixinPropsData],
  components: {dialogSelectCoupon, wxColor, numberInput},
  data () {
    return {
      ruleForm: {
        addType: 2,//添加方式
        showNumber: 5,   //显示个数限制
        couponNumberType: 1,  //券活动数类型
        listStyle: 1,  //排列样式
        couponStyle: 1,//卡片样式
        couponColor: 1,//优惠券颜色类型
        hideScrambled: false,//隐藏已抢完券
        ids: []//优惠券id列表
      },
      maxShowNumber: 20, //优惠券最大显示数量
      displayList: [],
      initRules: {
        showNumber: [
          { required: true, message: "请输入显示的券活动数", trigger: "change", validator: this.utils.ruleValidator.validateRequired },
        ]
      },
      rules: {

      },
      echoList: [],
      dialogVisible: false,
      currentDialog: '',
      loading: false
    }
  },
   watch: {
     ruleForm: {
      handler(newValue) {
        if(newValue.addType == 2 && newValue.couponNumberType == 2 && newValue.showNumber == ''){
          this.rules = this.initRules;
        }else {
          this.rules = {};
        }
      },
      deep: true
    },

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
        this.displayList = [];
        this.fetch(false);
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
      if(parseFloat(newValue) == parseFloat(oldValue)) {
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
          bNeedUpdateMiddle && this.syncToMiddle();
          let params = {};
            if(componentData.addType == 2) {
              if(componentData.couponNumberType === 1) {
                params = {
                  couponType: 0,
                  limitedQuantity: this.maxShowNumber
                };
              }else {
                params = {
                  couponType: 0,
                  limitedQuantity: componentData.showNumber === '' ? this.maxShowNumber : componentData.showNumber
                };
              }
            }else{
              if(componentData.ids.length) {
                params = {
                  couponType: 0,
                  ids: componentData.ids
                };
              }else{
                this.displayList = [];
                return;
              }
            }
            if (componentData.hideScrambled) {
              params.remainStockFlag = true
            }else {
              params.remainStockFlag =false
            }

            this.loading = true;
            this.displayList = [];
            this._apis.shop.getCouponListByIds(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.displayList = [];
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
       this.displayList = datas;
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

<style lang="scss" scoped>
/deep/ .el-tag.el-tag--success{
  position: relative;
  color: #fff;
  width: 56px;
  height: 26px;
  background: url('../../../assets/images/shop/coupon/coupon_rightbg.png') 0 0 no-repeat;
  background-size: 100% 100%;
  text-align: center;
  line-height: 26px;
  border: none;
  padding: 0px 5px;
  .el-icon-close {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #92929B;
    color: #fff;
  }
}
.property-coupon {
  .add-coupon {
    flex-shrink: 0;
    margin-right: 6px;
  }
  .wx-compact-color-item {
    width: 34px;
    height: 34px;
    margin-right: 6px;
  }
}
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
