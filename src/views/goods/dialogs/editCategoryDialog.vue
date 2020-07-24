<template>
  <DialogBase
    :visible.sync="visible"
    width="785px"
    :showFooter="showFooter"
    title="编辑分类">
    <span class="msgInfo">您要进行</span>
    <el-radio-group v-model="radio">
      <el-tooltip class="item" effect="dark" content="转移分类后，原有商品分类将被清空" placement="top">
        <el-radio :label="1">转移分类</el-radio>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="原商品分类不变，商品将增加新的分类" placement="top">
        <el-radio :label="2">新增分类</el-radio>
      </el-tooltip>
    </el-radio-group>
    <div>
   
    <template v-if="radio===1">
      <span class="msgInfo">商品分类</span>
      <el-cascader
        v-model="categoryValue"
        :options="categoryOptions"
        @change="handleChange"
        :props="{ multiple: true, checkStrictly: true }"
        placeholder="请选择商品分类"
        clearable
        filterable
      ></el-cascader>
    </template>
    <template v-if="radio===2">
      <span class="msgInfo">商品分类</span>
      <el-cascader
        v-model="categoryValue"
        :options="categoryOptions"
        @change="handleChange"
        :disabled="isHasCategory"
        :props="{ multiple: true, checkStrictly: true }"
        placeholder="请选择商品分类"
        clearable
        filterable
      ></el-cascader>
    </template>
    </div>
    <div class="footer">
      <el-button @click="submit" type="primary">确定</el-button>
      <el-button @click="visible = false">取消</el-button>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import Zform from "@/components/Form";

export default {
  data() {
    return {
      radio: 0,
      categoryValue: [],
      values: [],
      categoryOptions: [],
      ruleForm: {
        name: "",
        stock: ""
      },
      rules: {
        stock: [{ required: true, message: "请输入库存", trigger: "blur" }]
      },
      showFooter: false
    };
  },
  created() {
    this.getCategoryList();
  },
  watch: {},
  methods: {
    getCategoryList() {
      this._apis.goods
        .fetchCategoryList()
        .then(res => {
          let arr = this.transTreeData(res, 0);
          this.categoryOptions = arr;
        })
        .catch(error => {
          console.log("调取接口失败");
        });
    },
    transTreeData(data, pid) {
      var result = [],
        temp,
        categoryInfo;
      for (var i = 0; i < data.length; i++) {
        if (data[i].parentId == pid) {
          this.data.forEach(item => {
            categoryInfo = item.productCatalogInfoIds.find(
              d => d === data[i].id
            );
          });
          var obj = {
            categoryName: data[i].name,
            id: data[i].id,
            parentId: data[i].parentId,
            level: data[i].level,
            sort: data[i].sort,
            image: data[i].image,
            enable: data[i].enable,
            label: data[i].name,
            value: data[i].id,
            disabled: categoryInfo ? true : false
          };
          temp = this.transTreeData(data, data[i].id);
          if (temp.length > 0) {
            obj.children = temp;
          }
          result.push(obj);
        }
      }
      return result;
    },
    handleChange(value) {
      this.values.push(value);
      console.log("arr");
      console.log(this.values);
      debugger;
    },
    submit() {
      alert("是否会调用");
      this.$emit("changeGoodCategory", this.values);
      this.visible = false;
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase,
    Zform
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
  height: 500px;
  .el-dialog__title {
    font-size: 22px;
    color: rgba(68, 67, 75, 1);
  }
}
.msgInfo {
  display: inline-block;
  margin:20px 37px 0 24px;
  color:rgba(68,67,75,1);
}

.item{
  margin-right:40px;
  font-size:16px;
  color:rgba(68,67,75,1);
}
.footer {
  text-align: center;
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
</style>


