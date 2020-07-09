<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="商品来源" prop="source">
        <el-radio-group v-model="ruleForm.source">
          <el-radio :label="1">商品</el-radio>
          <el-radio :label="2">商品分类</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择商品" v-if="ruleForm.source === 1" prop="goods">
        <div class="goods_list" v-if="ruleForm.source === 1" prop="goods" v-loading="loading">
          <ul>
            <li v-for="(item, key) of displayList" :key="key" :title="item.name">
              <img :src="item.mainImage" alt="">
              <i class="delete_btn" @click.stop="deleteItem(item)"></i>
            </li>
            <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectGoods'">
              <i class="inner"></i>
              <p>上传商品</p>
            </li>
          </ul>
        </div>
      </el-form-item>
      <el-form-item label="商品分类" v-if="ruleForm.source === 2" prop="goodsGroup">
        <div class="add-button-x select-goods-button" @click="pageDialogVisible=true; currentPageDialog='goodsGroup'">
          <i class="el-icon-plus"></i>
          {{seletedGroup && seletedGroup.data.name || '从商品分类中选择'}}
        </div>
      </el-form-item>
      <!-- <el-form-item label="显示个数" v-if="ruleForm.source === 2" prop="showNumber">
        <el-input  v-model="ruleForm.showNumber" placeholder="请输入个数"></el-input>
        最多显示50个
      </el-form-item> -->
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
      <el-form-item label="商品倒角"  prop="goodsChamfer">
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
          <el-checkbox label="2">商品价格</el-checkbox>
          <el-checkbox label="3">商品描述</el-checkbox>
          <el-checkbox label="4" :disabled="ruleForm.listStyle === 3 || ruleForm.listStyle === 6">购买按钮</el-checkbox>
        </el-checkbox-group>
        <el-radio-group v-if="ruleForm.showContents.includes('4') && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
          <el-radio :label="4">样式4</el-radio>
          <el-radio :label="5">样式5</el-radio>
          <el-radio :label="6">样式6</el-radio>
          <el-radio :label="7">样式7</el-radio>
          <el-radio :label="8">样式8</el-radio>
          <el-radio :label="9">样式9</el-radio>
        </el-radio-group>
        <el-input v-if="ruleForm.showContents.includes('4') && [3,4,7,8].includes(ruleForm.buttonStyle) && (ruleForm.listStyle !== 3 && ruleForm.listStyle !== 6)" v-model="ruleForm.buttonText" placeholder="请输入标题"></el-input>
      </el-form-item>
    </div>
    
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="echoList" @dialogDataSelected="dialogDataSelected"></component>

    <!-- 商品分类选择弹框 -->
    <DialogBase :visible.sync="pageDialogVisible" width="816px" title="选择商品分类" @submit="seletePage">
      <component v-if="pageDialogVisible" :is="currentPageDialog" @seletedRow="rowSeleted"></component>
    </DialogBase>
  </el-form>
</template>

<script>
import mixinPropsData from '../mixins/mixinPropsData';
import DialogBase from "@/components/DialogBase";
import dialogSelectGoods from '@/components/Decorate/dialogs/dialogSelectGoods';
import goodsGroup from '@/views/shop/dialogs/jumpLists/goodsGroup';
export default {
  name: 'propertyGoods',
  mixins: [mixinPropsData],
  components: {DialogBase, dialogSelectGoods, goodsGroup},
  data () {
    return {
      ruleForm: {
        source: 1,//商品来源
        showNumber: 30,//商品分类显示个数 
        listStyle: 1,//列表样式
        pageMargin: 10,//页面边距
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
        buttonText: '加入购物车',
        showFakeData: false
      },
      displayList: [],
      rules: {

      },
      echoList: [],
      dialogVisible: false,
      currentDialog: '',
      tempGroup: null,   //临时选中的商品分类
      seletedGroup: null,   //选中的商品分类
      pageDialogVisible: false,
      loading: false
    }
  },
  created() {
    this.fetchCatagoryDetail();
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

     //如果新值是一行3个或横向滑动且老值不是这个就把按钮样式改为第一个
    'ruleForm.listStyle'(newValue, oldValue) {
      if([3,6].includes(newValue) && ![3,6].includes(oldValue)) { 
        this.ruleForm.buttonStyle = 1;
      }
    },

    currentCatagoryId(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetch();
    },
    'ruleForm.currentCatagoryId'(newValue, oldValue) {
        if(newValue === oldValue) {
            return;
        }
        this.fetchCatagoryDetail();
        this.fetch();
    },
    'ruleForm.source'(newValue, oldValue) {
      if(newValue === oldValue) {
          return;
      }
      this.fetchCatagoryDetail();
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
    },

    displayList: {
      handler(newValue, oldValue) {
        this.ruleForm.showFakeData = !newValue.length;
      },
      deep: true
    }
  },
  methods: {

    rowSeleted(row) {
      this.tempGroup = row;
    },

     /* 弹窗选中了跳转链接 */
    seletePage() {
      this.ruleForm.currentCatagoryId = this.tempGroup.data.id;
      this.seletedGroup = this.tempGroup;
    },

    //根据ids拉取数据
    fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
        if(componentData) {
          bNeedUpdateMiddle && this.syncToMiddle();
            let params = {};
            if(!componentData.source || (componentData.source === 1)) {
                const ids = componentData.ids;
                if(ids) {
                   if(Object.prototype.toString.call(ids) === '[object Object]') {
                        params = this.setGroupGoodsParams(ids);
                        if(!params.ids || !params.ids.length) {
                            this.displayList = [];
                            return;
                        }
                    }else if(Array.isArray(ids) && ids.length){
                        params = this.setNormalGoodsParams(ids);
                        if(!params.ids || !params.ids.length) {
                            this.displayList = [];
                            return;
                        }
                    }else{
                      this.displayList = [];
                        return;
                    }
                }else{
                      this.displayList = [];
                    return;
                }
            }else if(componentData.source === 2){
              if(!this.ruleForm.currentCatagoryId) {
                this.displayList = [];
                return;
              }
              params = {
                  // status: '1',
                  productCatalogInfoId: this.ruleForm.currentCatagoryId
              };
            }

            this.loading = true;
            this._apis.goods.fetchAllSpuGoodsList(params).then((response)=>{
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
      if(this.currentComponentData.data.source === 2) {
          this.syncToMiddle('goodsListOfGroupChange', datas);
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
                // status: '1',
                ids: allIds
            }
        }else{
            params = {
                // status: '1',
                ids: ids[this.currentCatagoryId],
                productCatalogInfoId: this.currentCatagoryId
            }
        }
        return params;
    },

    /* 设置普通商品参数 */
    setNormalGoodsParams(ids) {
        return {
            // status: '1',
            ids: ids,
        }
    },

    /* 获取分类详情 */
    fetchCatagoryDetail() {
      if(!this.ruleForm.currentCatagoryId) {
        return;
      }
      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let cid = shopInfo && shopInfo.id || ''
      this._apis.goods.getCategoryDetail({
        id: this.ruleForm.currentCatagoryId
      }).then((response)=>{
        this.seletedGroup = {
          pageType: 'goodsGroup',
          typeName: '商品分类',
          id: 4,
          data: {
            id: response.id,
            name: response.name
          },
          cid
        }
      }).catch((error)=>{
          console.error(error);
      });
    }
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
.select-goods-button {
  width: 154px;
}
</style>
