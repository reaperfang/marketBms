<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="选择活动" prop="goods">
        <p class="prop-message" style="margin: 9px 0 8px 0;">建议最多添加30个活动</p>
        <div class="goods_list" v-loading="loading">
          <ul ref="listScroll">
            <li v-for="(item, key) of displayList" :key="key" :title="item.activityName">
              <el-image :src="item.goodsImgUrl" alt="" lazy>
                <div slot="placeholder" class="el-image__lazyloading">
                    加载中...
                </div>
              </el-image>
              <i class="delete_btn" @click.stop="deleteItem(item)" v-show="deleteShow"></i>
            </li>
            <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectSecondkill'">
              <i class="inner"></i>
              <p>添加活动</p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item label="列表样式" prop="listStyle">
        <el-radio-group class="radio-block" v-model="ruleForm.listStyle">
          <el-radio :label="1">大图模式</el-radio>
          <el-radio :label="2">一行两个</el-radio>
          <el-radio :label="3">一行三个</el-radio>
          <el-radio :label="4">详细列表</el-radio>
          <el-radio :label="5">一大两小</el-radio>
          <el-radio :label="6">横向滑动</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

    <div class="block form">
        <el-form-item label="页面边距" prop="pageMargin">
          <div class="slider-wrapper">
            <el-slider v-model="ruleForm.pageMargin" :min="0" :max="30"></el-slider>
            <span>{{ruleForm.pageMargin}}像素</span>
          </div>
        </el-form-item>
        <el-form-item label="商品间距" prop="goodsMargin">
            <div class="slider-wrapper">
            <el-slider v-model="ruleForm.goodsMargin" :min="0" :max="30"></el-slider>
            <span>{{ruleForm.goodsMargin}}像素</span>
            </div>
        </el-form-item>
    </div>


    <div class="block form">
      <el-form-item label="商品样式" prop="goodsStyle">
        <el-radio-group class="radio-block" v-model="ruleForm.goodsStyle">
          <el-radio :label="1">无边白底</el-radio>
          <el-radio :label="2">卡片投影</el-radio>
          <el-radio :label="3">描边白底</el-radio>
          <el-radio :label="4">无边透明底</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品倒角" prop="goodsChamfer">
        <el-radio-group v-model="ruleForm.goodsChamfer">
          <el-radio :label="1">直角</el-radio>
          <el-radio :label="2">圆角</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片比例" prop="goodsRatio">
        <el-radio-group class="radio-block" v-model="ruleForm.goodsRatio">
          <el-radio :label="1">3:2</el-radio>
          <el-radio :label="2">1:1</el-radio>
          <el-radio :label="3">3:4</el-radio>
          <el-radio :label="4">16:9</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片填充" prop="goodsFill">
        <el-radio-group v-model="ruleForm.goodsFill">
          <el-radio :label="1">填充</el-radio>
          <el-radio :label="2">周边留白</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文本样式" prop="textStyle">
        <el-radio-group v-model="ruleForm.textStyle">
          <el-radio :label="1">常规体</el-radio>
          <el-radio :label="2">加粗体</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文本对齐" prop="textAlign">
        <el-radio-group v-model="ruleForm.textAlign">
          <el-radio :label="1">左对齐</el-radio>
          <el-radio :label="2">居中对齐</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

    
    <div class="block form">
      <el-form-item label="显示内容" prop="buttonText" ref="itemShowContents">
        <el-checkbox-group v-model="ruleForm.showContents">
          <el-checkbox label="1">商品名称</el-checkbox>
          <el-checkbox label="2" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 6">商品描述</el-checkbox>
          <el-checkbox label="3">商品价格</el-checkbox>
          <el-checkbox label="4">商品原价</el-checkbox>
          <el-checkbox label="5" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">抢购倒计时</el-checkbox>
          <el-checkbox label="6" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 4 || ruleForm.listStyle === 6">剩余库存</el-checkbox>
          <el-checkbox label="7" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 4 || ruleForm.listStyle === 6">限制规则</el-checkbox>
          <el-checkbox label="8" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('8') && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 5 || ruleForm.listStyle === 6">样式3</el-radio>
          <el-radio :label="4" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 5 || ruleForm.listStyle === 6">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
          <el-radio :label="6">样式6</el-radio>
          <el-radio :label="7" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 5 || ruleForm.listStyle === 6">样式7</el-radio>
          <el-radio :label="8" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 5 || ruleForm.listStyle === 6">样式8</el-radio>
        </el-radio-group>
        <el-input ref="buyInput" v-if="ruleForm.showContents.includes('8') && [3,4,7,8].includes(ruleForm.buttonStyle) && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonText" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="更多设置">
        <el-checkbox v-model="ruleForm.hideSaledGoods">隐藏已售罄/活动结束商品</el-checkbox>
        <p class="hide_tips prop-message" style="margin-top: -5px;">隐藏后，活动商品将不在微商城显示</p>
        <!-- <el-checkbox v-model="ruleForm.hideEndGoods">隐藏活动结束商品</el-checkbox> -->
        <el-radio-group v-model="ruleForm.hideType" v-if="ruleForm.hideSaledGoods">
          <el-radio :label="1">24小时后隐藏</el-radio>
          <el-radio :label="2">立即隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="echoList" @dialogDataSelected="dialogDataSelected"></component>
  </el-form>
</template>

<script>
import mixinPropsData from '../mixins/mixinPropsData';
import dialogSelectSecondkill from '@/components/Decorate/dialogs/dialogSelectSecondkill';
export default {
  name: 'propertySecondkill',
  mixins: [mixinPropsData],
  components: {dialogSelectSecondkill},
  data () {
    return {
      ruleForm: {
        listStyle: 1,//列表样式
        pageMargin: 10,//页面边距
        goodsMargin: 10,//商品边距
        goodsStyle: 1,//商品样式
        goodsChamfer: 1,// 商品倒角
        goodsRatio: 2,//图片比例
        goodsFill: 2,//图片填充
        textStyle: 1,//文本样式
        textAlign: 1,//文本对齐
        showContents: ['1', '2', '3', '4', '5', '6', '7', '8'],//显示内容
        buttonStyle: 1,//购买按钮样式
        hideSaledGoods: false,//隐藏已售罄活动
        hideEndGoods: false,//隐藏活动结束活动
        hideType: 2,//隐藏类型
        ids: [],//商品id列表
        buttonText: '立即抢购'//按钮文字
      },
      displayList: [],
      initRules: {
        buttonText: [
          { required: true, message: "请输入标题", trigger: "change", validator: this.utils.ruleValidator.validateRequired },
          {
            min: 1,
            max: 5,
            message: "最多支持5个字符",
            trigger: "change",
            validator: this.utils.ruleValidator.validateMax
          }
        ]
      },
      rules: {},
      echoList: [],
      dialogVisible: false,
      currentDialog: '',
      loading: false
    }
  },
  watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.activityId);
        }
        this.fetch();
      },
      deep: true
    },

    ruleForm: {
      handler(newValue) {
        this.$nextTick(() => {
          //如果存在购买文本输入框，则恢复rules，否则不需要验证规则
          if(this.$refs.buyInput){
            this.rules = this.initRules;
          }else{
            this.rules = {};
          }
        })
      },
      deep: true
    },

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([2,3,5,6].includes(newValue) && ![2,3,5,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      }
    },

    'ruleForm.buttonStyle'(newValue, oldValue) {
      //购买按钮样式不为3、4、7、8时清除错误提示
      if(![3,4,7,8].includes(newValue)){
        this.$nextTick(() => {
          this.$refs['itemShowContents'].clearValidate();
        })
      }
    },

    'ruleForm.showContents'(newValue, oldValue) {
      //如果包含购买按钮
      if(newValue.includes('8')){
        //购买按钮样式不为3、4、7、8时清除错误提示
        if(![3,4,7,8].includes(this.ruleForm.buttonStyle)){
          this.$nextTick(() => {
            this.$refs['itemShowContents'].clearValidate();
          })
        }
      }else{ //不包含购买按钮则直接清除错误提示
        this.$nextTick(() => {
          this.$refs['itemShowContents'].clearValidate();
        })
      }
    },

    'ruleForm.hideSaledGoods'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetch();
    },
    'ruleForm.hideEndGoods'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetch();
    },
    'ruleForm.hideType'(newValue, oldValue) {
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
            _self.echoList.push({activityId: item});
          })
        }
      },
      deep: true
    }
  },
  methods: {
     //根据ids拉取数据
    async fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
        if(componentData) {
            bNeedUpdateMiddle && this.syncToMiddle();
            const ids = componentData.ids;
            if(Array.isArray(ids) && ids.length){
                this.loading = true;

                let hideStatus = 0;
                if(!componentData.hideSaledGoods) {
                    hideStatus = 0;
                }else {
                    if(componentData.hideType==1){
                        hideStatus=2;
                    }
                    else{
                        hideStatus=1;
                    }
                }

                //优先加载
                if(ids.length > this.preloadLength) {
                    const paramsLoad = this.utils.deepClone(ids);
                    paramsLoad.splice(this.preloadLength);
                    await this._apis.shop.getSecondkillListByIds({
                        rightsDiscount: 1, 
                        activityIds: paramsLoad.join(','),
                        hideStatus: hideStatus
                    }).then((response)=>{
                        this.createList(response);
                        this.loading = false;
                        this.deleteShow = false;
                    }).catch((error)=>{
                      console.error(error)
                        this.displayList = [];
                    });
                }

                this._apis.shop.getSecondkillListByIds({
                    rightsDiscount: 1, 
                    activityIds: ids.join(','),
                    hideStatus: hideStatus
                }).then((response)=>{
                    this.createList(response);
                    this.loading = false;
                    this.deleteShow = true;
                    //如果有记录的列表滚动位置，预加载功能全部数据完成后回到该位置
                    this.$nextTick(() => {
                      if(this.listScrollTop) {
                        this.$refs.listScroll.scrollTo({
                          top: this.listScrollTop
                        });
                        this.listScrollTop = null;
                      }
                    })
                }).catch((error)=>{
                    console.error(error);
                    this.displayList = [];
                    this.loading = false;
                    this.deleteShow = true;
                });
            }else{
                this.displayList = [];
            }
        }
    },

      /* 创建数据 */
    createList(datas) {
        this.displayList = datas;
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label{
  text-align: left;
}
/deep/.el-checkbox-group{
  .el-checkbox{
    margin-right: 10px;
  }
}
</style>