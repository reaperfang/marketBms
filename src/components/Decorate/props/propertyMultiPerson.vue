<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" v-calcHeight="height">
    <div class="block form">
      <el-form-item label="活动来源" prop="addType">
        <el-radio-group v-model="ruleForm.addType">
          <el-radio :label="1">手动添加</el-radio>
          <el-radio :label="2">自动获取</el-radio>
        </el-radio-group>
      </el-form-item>
     <el-form-item :label="ruleForm.addType === 1 ? '选择活动' : ''" prop="goods">
        <div class="goods_list" prop="goods" v-loading="loading">
          <ul>
            <template>
              <template v-for="(item, key) of ruleForm.displayList">
                <li :key="key" :title="item.activeName">
                  <img :src="item.mainImage" alt="">
                  <i class="delete_btn" @click.stop="deleteItem(item)" v-if="ruleForm.addType === 1"></i>
                </li>
              </template>
            </template>
            <!-- <template v-else-if="ruleForm.addType === 2">
              <li v-for="(item, key) of []" :key="key">
                <img :src="item.image" alt="">
                <i class="delete_btn" @click.stop="deleteItem(item)"></i>
              </li>
            </template> -->
            <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectMultiPerson'" v-if="ruleForm.addType === 1">
              <i class="inner"></i>
            </li>
          </ul>
        </div>
        <p style="color: rgb(211, 211, 211);;margin-top:10px;" v-if="ruleForm.addType === 1">建议最多添加30个活动</p>  
      </el-form-item>
      <el-form-item label="显示个数" v-if="ruleForm.addType === 2" prop="showNumber">
        <div class="row align-center">
          <el-input style="width: 101px;"  v-model="ruleForm.showNumber" placeholder="请输入个数"></el-input>
          <p style="color: rgb(211, 211, 211);margin-left:6px;font-size: 12px;">建议最大设置为30个</p> 
        </div>
      </el-form-item>
      <el-form-item label="" v-if="ruleForm.addType === 2" prop="showAllBtns">
        <div class="row align-center">
          <el-checkbox v-model="ruleForm.showAllBtns">查看全部按钮</el-checkbox>
          <el-button style="margin-left: 6px;" type="text" @click="dialogVisible=true; currentDialog='dialogMultiPersonDemo'">查看示例</el-button>
        </div>
      </el-form-item>
      <el-form-item label="排序规则" v-if="ruleForm.addType === 2" prop="sortRule">
        <el-select v-model="ruleForm.sortRule" placeholder="请选择排序规则">
          <el-option label="销量越高越靠前" :value="1"></el-option>
          <el-option label="浏览次数越多越靠前" :value="2"></el-option>
          <el-option label="开始时间越晚越靠前" :value="3"></el-option>
          <el-option label="结束时间越早越靠前" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="列表样式" prop="listStyle">
        <el-radio-group v-model="ruleForm.listStyle">
          <div><el-radio :label="1">大图模式</el-radio></div>
          <div><el-radio :label="2">一行两个</el-radio></div>
          <div><el-radio :label="3">一行三个</el-radio></div>
          <div><el-radio :label="4">详细列表</el-radio></div>
          <div><el-radio :label="5">一大两小</el-radio></div>
          <div><el-radio :label="6">横向滑动</el-radio></div>
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
        <el-radio-group v-model="ruleForm.goodsStyle">
          <div><el-radio :label="1">无边白底</el-radio></div>
          <div><el-radio :label="2">卡片投影</el-radio></div>
          <div><el-radio :label="3">描边白底</el-radio></div>
          <div><el-radio :label="4">无边透明底</el-radio></div>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品倒角" prop="goodsChamfer">
        <el-radio-group v-model="ruleForm.goodsChamfer">
          <el-radio :label="1">直角</el-radio>
          <el-radio :label="2">圆角</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片比例" prop="goodsRatio">
        <el-radio-group v-model="ruleForm.goodsRatio">
          <div><el-radio :label="1">3:2</el-radio></div>
          <div><el-radio :label="2">1:1</el-radio></div>
          <div><el-radio :label="3">3:4</el-radio></div>
          <div><el-radio :label="4">16:9</el-radio></div>
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
      <el-form-item label="显示内容" prop="showContents">
        <el-checkbox-group v-model="ruleForm.showContents">
          <el-checkbox label="1">商品名称</el-checkbox>
          <el-checkbox label="2" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 6">商品描述</el-checkbox>
          <el-checkbox label="3">拼团价</el-checkbox>
          <el-checkbox label="4">单买价</el-checkbox>
          <el-checkbox label="5" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">抢购倒计时</el-checkbox>
          <el-checkbox label="6">已团人数</el-checkbox>
          <el-checkbox label="7" :disabled="ruleForm.listStyle === 2 || ruleForm.listStyle === 3 || ruleForm.listStyle === 4 ||ruleForm.listStyle === 6">限制规则</el-checkbox>
          <el-checkbox label="8" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('8') && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonStyle">
          <el-radio :label="1" :disabled="true">样式1</el-radio>
          <el-radio :label="2" :disabled="true">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
          <el-radio :label="4">样式4</el-radio>
          <el-radio :label="5" :disabled="true">样式5</el-radio>
          <el-radio :label="6" :disabled="true">样式6</el-radio>
          <el-radio :label="7">样式7</el-radio>
          <el-radio :label="8">样式8</el-radio>
        </el-radio-group>
        <!-- <el-input v-if="ruleForm.showContents.includes('8') && [3,4,7,8].includes(ruleForm.buttonStyle)" v-model="ruleForm.buttonText"></el-input> -->
        <el-input v-if="ruleForm.showContents.includes('8') && [3,4,7,8].includes(ruleForm.buttonStyle) && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonTextPrimary"></el-input>
      </el-form-item>
      <el-form-item label="更多设置" prop="hideSaledGoods">
        <el-checkbox v-model="ruleForm.hideSaledGoods">隐藏已售罄/活动结束商品</el-checkbox>
        <p class="hide_tips">隐藏后，活动商品将不在微商城显示</p>
        <!-- <el-checkbox v-model="ruleForm.hideEndGoods">隐藏活动结束商品</el-checkbox> -->
        <el-radio-group v-model="ruleForm.hideType" v-if="ruleForm.hideSaledGoods">
          <el-radio :label="1">24小时后隐藏</el-radio>
          <el-radio :label="2">立即隐藏</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="echoList" @dialogDataSelected="dialogDataSelected" @dialogClosed="dialogClosed"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectMultiPerson from '@/views/shop/dialogs/decorateDialogs/dialogSelectMultiPerson';
import dialogMultiPersonDemo from '@/views/shop/dialogs/decorateDialogs/dialogMultiPersonDemo';
export default {
  name: 'propertyMultiPerson',
  mixins: [propertyMixin],
  components: {dialogSelectMultiPerson, dialogMultiPersonDemo},
  data () {
    return {
      ruleForm: {
        addType: 2,//	添加方式 
        showNumber: 5,//显示个数
        showAllBtns: true,//查看全部按钮
        sortRule: 1,//排序规则
        listStyle: 1,//列表样式
        pageMargin: 10,//	页面边距
        goodsMargin: 10,//	商品边距
        goodsStyle: 1,//	商品样式
        goodsChamfer: 1,// 商品倒角
        goodsRatio: 2,//图片比例
        goodsFill: 2,//图片填充
        textStyle: 1,//文本样式
        textAlign: 1,//文本对齐
        showContents: ['1', '2', '3', '4', '5', '6', '7', '8'],//显示内容
        hideSaledGoods: false,//隐藏已售罄拼团商品
        hideEndGoods: false,
        hideType: 2,
        buttonStyle: 3,// 购买按钮样式
        ids: [],//商品id列表 
        buttonText: '拼团',// 次要按钮文字
        buttonTextPrimary: '开团',//主要按钮文字
        displayList: []
      },
      rules: {

      },
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
          this.ruleForm.ids.push({
            spuId: item.spuId,
            activityId: item.activityId || item.activeId
          });
        }
        this.fetch();
      },
      deep: true
    },

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([3,6].includes(newValue) && ![3,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 3;
      }
    },
    'ruleForm.addType'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        if(newValue == 2) {
          this.fetch();
        }else{
          this.ruleForm.displayList = [];
          this.fetch();
        }
    },
    'ruleForm.showNumber'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetch();
    },
    'ruleForm.sortRule'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetch();
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
            _self.echoList.push({activityId: item.activityId, spuId: item.spuId});
          })
        }
      },
      deep: true
    }
  },
  methods: {

    /* 关闭案例弹窗 */
    dialogClosed() {
      this.currentDialog = '';
    },

    //根据ids拉取数据
    fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
        if(componentData) {
            bNeedUpdateMiddle && this.syncToMiddle();
            let params = {};

            //兼容老数据
            let newParams = [];
            if(typeof componentData.ids[0] === 'string') {
              for(let item of componentData.ids){
                newParams.push({spuId: item, activityId: ''})
              }
            }else{
              newParams = componentData.ids;
            }

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


            if(componentData.addType == 2) {
                params = {
                    num: componentData.showNumber,
                    order: componentData.sortRule,
                    hideStatus: hideStatus
                };
            }else{
                const ids = componentData.ids;
                if(Array.isArray(ids) && ids.length){
                    params = {
                        order: componentData.sortRule,
                        activityList: newParams,
                        hideStatus: hideStatus
                    };
                }else{
                    this.ruleForm.displayList = [];
                    return;
                }
            }

            this.loading = true;
            this._apis.shop.getMultiPersonListByIds(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.ruleForm.displayList = [];
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
        this.ruleForm.displayList = datas;
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
