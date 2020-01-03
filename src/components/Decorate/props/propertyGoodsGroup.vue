<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="商品分类" prop="goodsGroups">
        <el-button type="text"  @click="dialogVisible=true; currentDialog='dialogSelectGoodsGroup'">添加商品分类</el-button>
        <div class="goods_groups">
          <el-tag
            v-for="(tag, key) in list"
            :key="key"
            closable
            type="success" @close="deleteItem(tag)">
            {{tag.catagoryData.name}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="全部分类" prop="showAllGroup">
        全部分类为商品的集合分类，增加消费者逛的体验
        <el-radio-group v-model="ruleForm.showAllGroup">
          <el-radio :label="1">展示</el-radio>
          <el-radio :label="2">不展示</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="展示模板" prop="showTemplate">
        <el-radio-group v-model="ruleForm.showTemplate">
          <el-radio :label="1">顶部菜单</el-radio>
          <el-radio :label="2">左侧菜单</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="菜单样式" prop="menuStyle">
        <el-radio-group v-model="ruleForm.menuStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="菜单位置" prop="menuPosition">
        <el-radio-group v-model="ruleForm.menuPosition">
          <el-radio :label="1">正常模式</el-radio>
          <el-radio :label="2">滚动至顶部固定</el-radio>
        </el-radio-group>
      </el-form-item> -->
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
          <el-checkbox label="1">商品名称</el-checkbox>
          <el-checkbox label="2">商品价格</el-checkbox>
          <el-checkbox label="3">商品描述</el-checkbox>
          <el-checkbox label="4" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('4') && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3" :disabled="(ruleForm.showTemplate === 2 && (ruleForm.listStyle === 2 || ruleForm.listStyle === 4 || ruleForm.listStyle === 5))">样式3</el-radio>
          <el-radio :label="4" :disabled="(ruleForm.showTemplate === 2 && (ruleForm.listStyle === 2 || ruleForm.listStyle === 4 || ruleForm.listStyle === 5))">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
          <el-radio :label="6">样式6</el-radio>
          <el-radio :label="7" :disabled="(ruleForm.showTemplate === 2 && (ruleForm.listStyle === 2 || ruleForm.listStyle === 4 || ruleForm.listStyle === 5))">样式7</el-radio>
          <el-radio :label="8" :disabled="(ruleForm.showTemplate === 2 && (ruleForm.listStyle === 2 || ruleForm.listStyle === 4 || ruleForm.listStyle === 5))">样式8</el-radio>
          <el-radio :label="9">样式9</el-radio>
        </el-radio-group>
        <el-input v-if="ruleForm.showContents.includes('4') && [3,4,7,8].includes(ruleForm.buttonStyle) && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonText"></el-input>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @goodsGroupDataSelected="dialogDataSelected" :seletedGroupInfo="list"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectGoodsGroup from '@/views/shop/dialogs/decorateDialogs/dialogSelectGoodsGroup';
export default {
  name: 'propertyGoodsGroup',
  mixins: [propertyMixin],
  components: {dialogSelectGoodsGroup},
  data () {
    return {
      ruleForm: {
        showAllGroup: 1, //显示全部分类
        showTemplate: 1,//展示模板方式
        menuStyle: 1,//菜单样式
        menuPosition: 1,//菜单位置
        listStyle: 1,//列表样式
        pageMargin: 15,//页面边距
        goodsMargin: 10,//商品边距
        goodsStyle: 1,//商品样式
        goodsChamfer: 1,//商品倒角
        goodsRatio: 2,//图片比例
        goodsFill: 2,//图片填充
        textStyle: 1,//文本样式
        textAlign: 1,//文本对齐
        showContents: ['1', '2', '3', '4'],//显示内容
        buttonStyle: 1,//购买按钮样式
        ids: [],//商品分类列表 
        buttonText: '加入购物车'//按钮文字
      },
      rules: {

      },
      list: {},
      dialogVisible: false,
      currentDialog: '',

    }
  },
  created() {
    this.fetch();
  },
  watch: {
    'items': {
      handler(newValue) {
        const catagoryIds = {};
        for(let k in newValue) {
          catagoryIds[k] = [];
          for(let item of newValue[k].goods) {
            catagoryIds[k].push(item);
          }
        }
        this.ruleForm.ids = catagoryIds;
        this.fetch();
        this._globalEvent.$emit('fetchGoodsGroup', this.ruleForm, this.$parent.currentComponentId);
      },
      deep: true
    },

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([3,6].includes(newValue) && ![3,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      } 
      if(this.ruleForm.showTemplate == 2 && [2,4,5].includes(newValue) && ![2,4,5].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      }
    }
  },
  methods: {
     //根据ids拉取数据
    fetch(componentData = this.ruleForm) {
      if(componentData) {
          if(componentData.ids) {
            let ids = [];
            for(let item in componentData.ids) {
              ids.push(item);
            }
            if(!ids.length) {
              this.list = {};
              return;
            }
            this.loading = true;
            this._apis.goods.fetchCategoryList({ids}).then((response)=>{
              let data = {};
                for(let item of response) {
                  data[item.id] = {
                    catagoryData: item,
                    goods: this.ruleForm.ids[item.id]
                  };
                }
                this.list = data;
                this._globalEvent.$emit('fetchGoods', this.ruleForm, this.$parent.currentComponentId);
                this.loading = false;
            }).catch((error)=>{
                // this.$notify.error({
                //   title: '错误',
                //   message: error
                // });
                console.error(error);
                this.list = {};
                this.loading = false;
            });
      }
      }
    },

     /* 删除数据项 */
    deleteItem(item) {
      if(item.fakeData) {  //如果是假数据
        this.$alert('示例数据不支持删除操作，请在右侧替换真实数据后重试!', '警告', {
          confirmButtonText: '确定'
        })
        return;
      }
      const tempItems = {...this.list};
      delete tempItems[item.catagoryData.id];
      this.list = tempItems;
      this.items = tempItems;
    },

  }
}
</script>

<style lang="scss">
.goods_groups{
  .el-tag{
    margin-right:5px!important;
  }
}
</style>
