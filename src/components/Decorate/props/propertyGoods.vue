<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="商品来源" prop="source">
        <el-radio-group v-model="ruleForm.source">
          <el-radio :label="1">商品</el-radio>
          <el-radio :label="2">商品分类</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品" v-if="ruleForm.source === 1" prop="goods">
      </el-form-item>
      <div class="goods_list" v-if="ruleForm.source === 1" prop="goods">
        <ul>
          <li v-for="(item, key) of list" :key="key">
            <img :src="item.mainImage" alt="">
            <i class="delete_btn" @click.stop="deleteItem(item)"></i>
          </li>
          <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectGoods'">
            <i class="inner"></i>
          </li>
        </ul>
      </div>
      <el-form-item label="商品分类" v-if="ruleForm.source === 2" prop="goodsGroup">
        <el-button type="text"  @click="pageDialogVisible=true; currentPageDialog='goodsGroup'">{{seletedGroup && seletedGroup.data.name || '从商品分类中选择'}}</el-button>
      </el-form-item>
      <!-- <el-form-item label="显示个数" v-if="ruleForm.source === 2" prop="showNumber">
        <el-input  v-model="ruleForm.showNumber" placeholder="请输入个数"></el-input>
        最多显示50个
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
      <el-form-item label="商品倒角"  prop="goodsChamfer">
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
          <el-checkbox label="4">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('4')" v-model="ruleForm.buttonStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式3</el-radio>
          <el-radio :label="4" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
          <el-radio :label="6">样式6</el-radio>
          <el-radio :label="7" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式7</el-radio>
          <el-radio :label="8" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">样式8</el-radio>
        </el-radio-group>
        <el-input v-if="ruleForm.showContents.includes('4') && [3,4,7,8].includes(ruleForm.buttonStyle)" v-model="ruleForm.buttonText"></el-input>
      </el-form-item>
    </div>
    
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="list" @dialogDataSelected="dialogDataSelected"></component>

    <!-- 商品分类选择弹框 -->
    <DialogBase :visible.sync="pageDialogVisible" width="816px" title="选择商品分类" @submit="seletePage">
      <component v-if="pageDialogVisible" :is="currentPageDialog" @seletedRow="rowSeleted"></component>
    </DialogBase>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import DialogBase from "@/components/DialogBase";
import dialogSelectGoods from '@/views/shop/dialogs/dialogSelectGoods';
import goodsGroup from '@/views/shop/dialogs/jumpLists/goodsGroup';
import GOODS_LIST from '@/assets/json/goodsList.json'; 
export default {
  name: 'propertyGoods',
  mixins: [propertyMixin],
  components: {DialogBase, dialogSelectGoods, goodsGroup},
  data () {
    return {
      ruleForm: {
        source: 1,//商品来源
        showNumber: 30,//商品分类显示个数 
        listStyle: 1,//列表样式
        pageMargin: 15,//页面边距
        goodsMargin: 10,//商品边距
        goodsStyle: 1,//商品样式
        goodsChamfer: 1,//商品倒角
        goodsRatio: 2,//图片比例
        goodsFill: 2,//图片填充
        textStyle: 1,//文本样式
        textAlign: 1,// 文本对齐
        showContents: ['1', '2', '3', '4'],//显示内容
        buttonStyle: 1,// 购买按钮样式
        ids: [],//商品id列表
        currentCatagoryId: '',  //选中的商品分类id
        buttonText: '加入购物车'
      },
      rules: {

      },
      list: this.$route.path.indexOf('templateEdit') > -1 ? GOODS_LIST: [],
      dialogVisible: false,
      currentDialog: '',
      seletedGroup: null,   //临时选中的商品分类
      pageDialogVisible: false
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
        this._globalEvent.$emit('fetchGoods', this.ruleForm, this.$parent.currentComponentId);
      },
      deep: true
    },

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([3,6].includes(newValue) && ![3,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      }
    },

    currentCatagoryId(newValue) {
        this.fetch();
        this._globalEvent.$emit('fetchGoods', this.ruleForm, this.$parent.currentComponentId);
    },
    'ruleForm.currentCatagoryId'() {
        this.fetch();
        this._globalEvent.$emit('fetchGoods', this.ruleForm, this.$parent.currentComponentId);
    },
  },
  methods: {

    rowSeleted(row) {
      this.seletedGroup = row;
    },

     /* 弹窗选中了跳转链接 */
    seletePage() {
      this.ruleForm.currentCatagoryId = this.seletedGroup.data.id;
    },

    //根据ids拉取数据
    fetch(componentData = this.ruleForm) {
        if(componentData) {
            let params = {};
            if(!componentData.source || (componentData.source === 1)) {
                const ids = componentData.ids;
                if(ids) {
                   if(Object.prototype.toString.call(ids) === '[object Object]') {
                        params = this.setGroupGoodsParams(ids);
                        if(!params.ids || !params.ids.length) {
                            this.list = [];
                            return;
                        }
                    }else if(Array.isArray(ids) && ids.length){
                        params = this.setNormalGoodsParams(ids);
                        if(!params.ids || !params.ids.length) {
                            this.list = [];
                            return;
                        }
                    }else{
                      if(this.$route.path.indexOf('templateEdit') < 0) {
                        this.list = [];
                      }
                        return;
                    }
                }else{
                     if(this.$route.path.indexOf('templateEdit') < 0) {
                        this.list = [];
                      }
                    return;
                }
            }else if(componentData.source === 2){
                params = {
                    status: '1',
                    productCatalogInfoId: this.ruleForm.currentCatagoryId
                };
            }

            this.loading = true;
            this._apis.goods.fetchAllSpuGoodsList(params).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
                console.error(error);
                 if(this.$route.path.indexOf('templateEdit') < 0) {
                        this.list = [];
                      }
                this.loading = false;
            });
        }
    },

      /* 创建数据 */
    createList(datas) {
      this.list = datas;
      if(this.currentComponentData.data.source === 2) {
          this._globalEvent.$emit('goodsListOfGroupChange', datas, this.$parent.currentComponentId);  //告知中央组件list数据更改
      }
    },

     /* 设置分类商品参数 */
    setGroupGoodsParams(ids) {
        let params = {};
        if(this.currentCatagoryId === 'all') {
            const allIds = [];
            for(let k in ids) {
                for(let item of ids[k]) {
                    allIds.push(item);
                }
            }
            params = {
                status: '1',
                ids: allIds
            }
        }else{
            params = {
                status: '1',
                ids: ids[this.currentCatagoryId],
                productCatalogInfoId: this.currentCatagoryId
            }
        }
        return params;
    },

    /* 设置普通商品参数 */
    setNormalGoodsParams(ids) {
        return {
            status: '1',
            ids: ids,
        }
    }
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
