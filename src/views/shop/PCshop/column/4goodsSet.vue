<template>
    <div class="gbc_container">
      <h2>商品橱窗编辑</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入标题" type="textarea" clearable autosize></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <el-input v-model="ruleForm.details" placeholder="请输入详情" type="textarea" clearable autosize></el-input>
        </el-form-item>
        <el-form-item label="图片(一张)" prop="photo">
          <div class="img_preview" v-if="ruleForm.photo">
            <img :src="ruleForm.photo" alt="">
            <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
          </div>
          <div class="add_button" v-if="!ruleForm.photo" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
            <i class="inner"></i>
          </div>
          建议尺寸：633*908像素
        </el-form-item>
        <el-form-item label="按钮使用" prop="buttonType">
          <el-radio-group v-model="ruleForm.buttonType">
            <el-radio :label="1">显示按钮</el-radio>
            <el-radio :label="2">隐藏按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="按钮名称" prop="buttonName" v-if="ruleForm.buttonType == 1">
          <el-input v-model="ruleForm.buttonName" placeholder="请输入按钮名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="source">
          <el-button type="text"  @click="pageDialogVisible=true; currentPageDialog='goodsGroup'">{{selectedGroup && selectedGroup.name || '从商品分类中选择'}}</el-button>
        </el-form-item>
        <el-form-item label="选择货品(2个)" prop="commodity">
          <div class="goods_list" v-loading="loading">
            <ul>
              <template>
                <li v-if="selectedGoods[0] && selectedGoods[0].goodsInfo" class="img_preview">
                  <img :src="selectedGoods[0].goodsInfo.image" alt="">
                  <span @click="currentSelectedGoods = 0;dialogVisible=true; currentDialog='dialogSelectGoodsSKU'">更换货品</span>
                </li>
                <li v-else class="add_button" @click="currentSelectedGoods = 0;dialogVisible=true; currentDialog='dialogSelectGoodsSKU'">
                  <i class="inner"></i>
                </li>
              </template>
              
              <template>
                <li v-if="selectedGoods[1] && selectedGoods[1].goodsInfo" class="img_preview">
                  <img :src="selectedGoods[1].goodsInfo.image" alt="">
                  <span @click="currentSelectedGoods = 1;dialogVisible=true; currentDialog='dialogSelectGoodsSKU'">更换货品</span>
                </li>
                <li v-else class="add_button" @click="currentSelectedGoods = 1;dialogVisible=true; currentDialog='dialogSelectGoodsSKU'">
                  <i class="inner"></i>
                </li>
              </template>
            </ul>
          </div>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存并生效</el-button>
        <el-button type="primary" @click="$router.go(-1)">取消</el-button>
      </div>
    
       <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" :goodsEcho.sync="selectedGoods" @dialogDataSelected="goodsSKUSelected" :multiple="false"></component>

      <!-- 商品分类选择弹框 -->
      <DialogBase :visible.sync="pageDialogVisible" width="816px" :title="ruleForm.sourceType === 2 ? '选择商品': '选择商品分类'" @submit="itemSelected">
        <component v-if="pageDialogVisible" :is="currentPageDialog" @seletedRow="tempSelected"></component>
      </DialogBase>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import goodsGroup from '@/views/shop/dialogs/jumpLists/goodsGroup';
import dialogSelectGoodsSKU from "@/views/shop/dialogs/decorateDialogs/dialogSelectGoodsSKU";
import DialogBase from '@/components/DialogBase';
export default {
  name: "1picText",
  components: {DialogBase, dialogSelectImageMaterial, goodsGroup, dialogSelectGoodsSKU},
  data() {

    var validateBlank = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入内容'));
      } else {
        callback();
      }
    };

     var validateCommodity = (rule, value, callback) => {
      let result = true;
      if(value.length !== 2) {
        result = false;
      }else{
        if(Array.isArray(value)) {
          for(let item of value) {
            if(item == '') {
              result = false;
              break;
            }
          }
        }
      }
      if (!result) {
        callback(new Error('请选择2个货品'));
      } else {
        callback();
      }
    };

    return {
      id: this.$route.query.id,
      loading: false,
      submitLoadinig: false,

      //弹窗相关
      currentDialog: '',
      dialogVisible: false,
      currentPageDialog: '',
      pageDialogVisible: false,

      //数据选中相关
      selectedGoods: [{}, {}],  //选中的货品
      selectedGroup: null,  //选中的分类
      tempItem: null,   //临时选中的项

      ruleForm: {
        title: '',//标题
        type: this.$route.query.type,  //橱窗类型 1.one,2.two,3.three,4.four,5.five,6.six
        details: '',  //详情
        photo: '',//图片
        buttonType: 1, //按钮类型 1:显示 2:隐藏
        buttonName: '立即购买', //按钮名称
        source: '',  //跳转目的地，商品分类id
        commodity: [] //货品集合
      },
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          },
          {validator: validateBlank, trigger: "blur"}
        ], 
        details: [
          { required: true, message: "请输入详情", trigger: "blur" },
          {validator: validateBlank, trigger: "blur"}
        ], 
        commodity: [
          { required: true, message: "请选择2个货品", trigger: "blur" },
          {validator: validateCommodity, trigger: "blur"}
        ],
        photo: [
          { required: true, message: "请添加图片", trigger: "change" }
        ],
        buttonType: [
          { required: true, message: "请选择按钮使用", trigger: "change" }
        ],  
        source: [
          { required: true, message: "请选择商品分类", trigger: "change" }
        ], 
        buttonName: [
          { required: true, message: "请输入按钮名称", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur"
          },
          {validator: validateBlank, trigger: "blur"}
        ],
      }
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    selectedGoods: {
      handler(newValue) {
        this.ruleForm.commodity = newValue.map(item => item.goodsInfo.id);
      },
      deep: true
    }
  },
  methods: {

    /* 获取装修数据 */
    fetch() {
      if(!this.ruleForm.type) {
        return;
      }
      this.loading = true;
      this._apis.shop.getWindow({type: this.ruleForm.type}).then((response)=>{
        this.loading = false;
        this.ruleForm = response;
        this.getSkuList();
        this.fetchGoodsGroupData();
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 保存数据 */
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoadinig = true;
          this._apis.shop.modifyWindow(this.ruleForm).then((response)=>{
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success'
            });
            this.submitLoadinig = false;
            this._routeTo('p_columnIndex');
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
            this.submitLoadinig = false;
          });
        } else {
          this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      });
    },

    //根据id拉取货品列表
    getSkuList() {
        if(!this.ruleForm.commodity || !this.ruleForm.commodity.length) {
          this.selectedGoods = [{}, {}]
          return;
        }
        this._apis.goods.fetchGoodsList({ids: this.ruleForm.commodity, startIndex: 1, pageSize: 100}).then((response)=>{
          this.selectedGoods = response.list;
        }).catch((error)=>{
          console.error(error);
        });
    },
    
    //根据id拉取商品分类详情
    fetchGoodsGroupData() {
        this._apis.goods.getCategoryDetail({id: this.ruleForm.source}).then((response)=>{
          this.selectedGroup = response;
        }).catch((error)=>{
          console.error(error);
        });
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.photo = dialogData.filePath;
    },

     /* 弹窗选中货品 */
    goodsSKUSelected(dialogData) {
      this.selectedGoods[this.currentSelectedGoods] = dialogData;
      this.ruleForm.commodity = this.selectedGoods.map(item => item.goodsInfo.id);
    },

    /* 商品分类弹窗临时选中 */
    tempSelected(row) {
      this.tempItem = row;
    },

     /* 弹窗选中商品分类 */
    itemSelected() {
      this.ruleForm.source = this.tempItem.data.id;
      this.selectedGroup = this.tempItem.data;
    },

  },

};
</script>
<style lang="scss" scoped>
.confirm_btn{
  display:flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
}
</style>

