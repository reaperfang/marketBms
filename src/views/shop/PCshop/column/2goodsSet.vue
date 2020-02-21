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
        <el-form-item label="货品" prop="commodity">
          <div class="goods_list" v-loading="loading">
            <ul>
              <li v-for="(item, key) of selectedGoods" :key="key" :title="item.name">
                <template v-if="item.goodsInfo">
                  <img :src="item.goodsInfo.image" alt="">
                  <i class="delete_btn" @click.stop="deleteItem(item)"></i>
                </template>
              </li>
              <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectGoodsSKU'">
                <i class="inner"></i>
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存并生效</el-button>
        <el-button type="primary" @click="$router.go(-1)">取消</el-button>
      </div>

       <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :goodsEcho.sync="selectedGoods" @dialogDataSelected="itemSelected"></component>
    
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectGoodsSKU from "@/views/shop/dialogs/decorateDialogs/dialogSelectGoodsSKU";
export default {
  name: "3picText",
  components: {dialogSelectGoodsSKU},
  data() {

    var validateBlank = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入内容'));
      } else {
        callback();
      }
    }; 
    
    var validateCommodity = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('请输入选择货品'));
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

      //数据选中相关
      selectedGoods: [],  //选中的货品

      ruleForm: {
        title: '',//标题
        type: this.$route.query.type,  //橱窗类型 1.one,2.two,3.three,4.four,5.five,6.six
        details: '',  //详情
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
          { required: true, message: "请输入详情", trigger: "blur" }
        ],
        commodity: [
          { required: true, message: "请选择货品", trigger: "change" },
          {validator: validateCommodity, trigger: "blur"}
        ]
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
          return;
        }
        this._apis.goods.fetchGoodsList({ids: this.ruleForm.commodity, startIndex: 1, pageSize: 100}).then((response)=>{
          this.selectedGoods = response.list;
        }).catch((error)=>{
          console.error(error);
        });
    },
    
     /* 弹窗选中商品/分类 */
    itemSelected(dialogData) {
      this.selectedGoods = dialogData;
    },

      /* 删除数据项 */
    deleteItem(item) {
      if(item.fakeData) {  //如果是假数据
        this.$alert('示例数据不支持删除操作，请在右侧替换真实数据后重试!', '警告', {
          confirmButtonText: '确定'
        })
        return;
      }
      const tempItems = [...this.selectedGoods];
      for(let i=0;i<tempItems.length;i++) {
        if(item === tempItems[i]) {
          tempItems.splice(i, 1);
        }
      }
      this.selectedGoods = tempItems;
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

