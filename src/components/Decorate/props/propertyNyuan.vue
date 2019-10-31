<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="选择活动" prop="promotions">
      </el-form-item>
      <div class="goods_list">
        <ul>
          <li v-for="(item, key) of list" :key="key" :title="item.name">
            <img :src="item.activityPic" alt="">
            <i class="delete_btn" @click.stop="deleteItem(item)"></i>
          </li>
          <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectNyuan'">
            <i class="inner"></i>
          </li>
        </ul>
      </div>
      最多添加30个商品
      <el-form-item label="列表样式" prop="listStyle">
        <el-radio-group v-model="ruleForm.listStyle">
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
        <el-radio-group v-model="ruleForm.goodsStyle">
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
        <el-radio-group v-model="ruleForm.goodsRatio">
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
      <el-form-item label="显示内容" prop="showContents">
        <el-checkbox-group v-model="ruleForm.showContents">
          <el-checkbox label="1">活动名称</el-checkbox>
          <el-checkbox label="2">活动价格</el-checkbox>
          <el-checkbox label="3">抢购倒计时</el-checkbox>
          <el-checkbox label="4">限制规则</el-checkbox>
          <el-checkbox label="5">活动内任选商品</el-checkbox>
          <el-checkbox label="6">已售件数</el-checkbox>
          <el-checkbox label="7">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('7')" v-model="ruleForm.buttonStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式3</el-radio>
          <el-radio :label="4" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
          <el-radio :label="6">样式6</el-radio>
          <el-radio :label="7" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式7</el-radio>
          <el-radio :label="8" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式8</el-radio>
        </el-radio-group>
        <el-input v-if="ruleForm.showContents.includes('7') && [3,4,7,8].includes(ruleForm.buttonStyle)" v-model="ruleForm.buttonText"></el-input>
      </el-form-item>
      <el-form-item label="更多设置">
        <el-checkbox v-model="ruleForm.hideSaledGoods">隐藏已售罄/活动结束商品</el-checkbox>
        <!-- <el-checkbox v-model="ruleForm.hideEndGoods">隐藏活动结束商品</el-checkbox>
        <el-radio-group v-model="ruleForm.hideType">
          <el-radio :label="1">24小时后隐藏</el-radio>
          <el-radio :label="2">立即隐藏</el-radio>
        </el-radio-group> -->
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="list" @dialogDataSelected="dialogDataSelected"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectNyuan from '@/views/shop/dialogs/dialogSelectNyuan';
import uuid from 'uuid/v4';
export default {
  name: 'propertyNyuan',
  mixins: [propertyMixin],
  components: {dialogSelectNyuan},
  data () {
    return {
      ruleForm: {
        listStyle: 1,//列表样式
        pageMargin: 15,//页面边距
        goodsMargin: 10,//商品边距
        goodsStyle: 1,//商品样式
        goodsChamfer: 1,//商品倒角
        goodsRatio: 2,//图片比例
        goodsFill: 2,//图片填充
        textStyle: 1,//文本样式
        textAlign: 1,//文本对齐
        showContents: ['1', '2', '3', '4', '5', '6', '7'],//显示内容
        buttonStyle: 1,//购买按钮样式
        hideSaledGoods: true,//隐藏已售罄活动
        hideEndGoods: false,//隐藏活动结束活动 
        hideType: 1,//隐藏类型
        ids: [],//活动id列表
        buttonText: '查看活动'//按钮文字
      },
      rules: {

      },
      list: [],
      dialogVisible: false,
      currentDialog: ''
    }
  },
  created() {
    this.fetch();
  },
  watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.id);
        }
        this.fetch();
        this._globalEvent.$emit('fetchNyuan', this.ruleForm, this.$parent.currentComponentId);
      },
      deep: true
    },

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([3,6].includes(newValue) && ![3,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      }
    }
  },
  methods: {
    //根据ids拉取数据
    fetch(componentData = this.ruleForm) {
        if(componentData) {
            const ids = componentData.ids;
            if(Array.isArray(ids) && ids.length){
                this.loading = true;
                this._apis.shop.getNyuanListByIds({
                    baleIds : ids.join(',')
                }).then((response)=>{
                    this.createList(response);
                    this.loading = false;
                }).catch((error)=>{
                    // this.$notify.error({
                    //     title: '错误',
                    //     message: error
                    // });
                    console.error(error);
                    this.list = [];
                    this.loading = false;
                });
            }else{
                this.list = [];
            }
        }
    },

      /* 创建数据 */
    createList(datas) {
        this.list = [];
        if(this.hideSaledGoods==true){
            for(var i in datas){
                if(datas[i].soldOut!=1){
                    this.list.push(datas[i]);
                }
            }
        }
        else{
            this.list = datas;
        }
        var list = this.list;
        this.list = [];
        if(this.hideEndGoods==true){
            for(var i in list){
                if(list[i].activityEnd!=1){
                    this.list.push(list[i]);
                }
            }
        }
        else{
            this.list = list;
        }
    },
  }
}
</script>

<style lang="scss" scoped>
/deep/.el-form-item__label{
  text-align: left;
}
/deep/.el-radio-group{
  margin-top: 9px;
  /deep/.el-radio {
    margin-right: 10px;
    margin-bottom: 5px;
  }
}
/deep/.el-checkbox-group{
  /deep/.el-checkbox{
    margin-right: 10px;
  }
}
</style>