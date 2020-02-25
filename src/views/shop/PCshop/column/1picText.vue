<template>
    <div class="gbc_container">
      <h2>图文广告编辑</h2>
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
          建议尺寸：583*748像素
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
        <el-form-item label="数据来源" prop="sourceType">
          <el-radio-group v-model="ruleForm.sourceType">
            <el-radio :label="1">商品</el-radio>
            <el-radio :label="2">商品分类</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="商品" v-if="ruleForm.sourceType === 1" prop="source">
          <div class="img_preview" v-if="ruleForm.sourceType === 1" v-loading="loading">
            <ul>
              <li v-if="selectedGoods" :title="selectedGoods.name">
                <img :src="selectedGoods.mainImage" alt="">
                <span @click="pageDialogVisible=true; currentPageDialog='goods'">更换商品</span>
                <i class="delete_btn" @click.stop="deleteItem()"></i>
              </li>
              <li v-else class="add_button" @click="pageDialogVisible=true; currentPageDialog='goods'">
                <i class="inner"></i>
              </li>
            </ul>
          </div>
        </el-form-item>
        <el-form-item label="商品分类" v-if="ruleForm.sourceType === 2" prop="source">
          <el-button type="text"  @click="pageDialogVisible=true; currentPageDialog='goodsGroup'">{{selectedGroup && selectedGroup.name || '从商品分类中选择'}}</el-button>
          <span v-if="selectedGroup && selectedGroup.name" @click="deleteItem()" style="cursor:pointer;">删除</span>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存并生效</el-button>
        <el-button type="primary" @click="$router.go(-1)">取消</el-button>
      </div>
    
       <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>

      <!-- 商品分类选择弹框 -->
      <DialogBase :visible.sync="pageDialogVisible" width="816px" :title="ruleForm.sourceType === 2 ? '选择商品': '选择商品分类'" @submit="itemSelected">
        <component v-if="pageDialogVisible" :is="currentPageDialog" @seletedRow="tempSelected"></component>
      </DialogBase>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import goods from "@/views/shop/dialogs/jumpLists/goods";
import goodsGroup from '@/views/shop/dialogs/jumpLists/goodsGroup';
import DialogBase from '@/components/DialogBase';
export default {
  name: "1picText",
  components: {DialogBase, dialogSelectImageMaterial, goods, goodsGroup},
  data() {

    var validateBlank = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入内容'));
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
      selectedGoods: null,  //选中的商品
      selectedGroup: null,  //选中的分类
      tempItem: null,   //临时选中的项

      ruleForm: {
        title: '',//标题
        type: this.$route.query.type,  //橱窗类型 1.one,2.two,3.three,4.four,5.five,6.six
        details: '',  //详情
        photo: '',//图片
        buttonType: 1, //按钮类型 1:显示 2:隐藏
        buttonName: '立即购买', //按钮名称
        sourceType: 1, //跳转类型：1商品，2商品分类
        source: ''  //跳转目的地，商品id or 商品分类id
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
        photo: [
          { required: true, message: "请添加图片", trigger: "change" }
        ],
        buttonType: [
          { required: true, message: "请选择按钮使用", trigger: "change" }
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
        sourceType: [
          { required: true, message: "请选择数据来源", trigger: "change" }
        ],
        source: [
          { required: true, message: "请选择商品或商品分类", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    'ruleForm.sourceType': {
      handler(newValue) {
        this.deleteItem();
      }
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
         if(response.sourceType == 1) {
          this.fetchGoodsData();
         }else if(response.sourceType == 2) {
          this.fetchGoodsGroupData();
         }
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

    //根据id拉取商品详情
    fetchGoodsData() {
        this._apis.goods.getGoodsDetail({id: this.ruleForm.source}).then((response)=>{
          this.selectedGoods = response;
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

    /* 商品分类弹窗临时选中 */
    tempSelected(row) {
      this.tempItem = row;
    },

     /* 弹窗选中商品/分类 */
    itemSelected() {
      this.ruleForm.source = this.tempItem.data.id;
      if(this.ruleForm.sourceType == 1) {
        this.selectedGoods = this.tempItem.data;
      }else if(this.ruleForm.sourceType == 2){
        this.selectedGroup = this.tempItem.data;
      }
    },

    /* 删除 */
    deleteItem() {
      this.ruleForm.source = '';
       if(this.ruleForm.sourceType == 1) {
        this.selectedGoods = null;
      }else if(this.ruleForm.sourceType == 2){
        this.selectedGroup = null;
      }
    }

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
/deep/textarea{
  resize: none;
}
</style>

