/* 选择商品弹框 */
<template>
  <DialogBase :visible.sync="visible" width="1000px" :title="categoryName ? '选择 ['+categoryName+'] 分类下的商品' : '选择商品'" @submit="submit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules"  :inline="true">
      <div class="inline-head">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item> 
        <el-form-item label="商品状态" prop="status">
          <el-select label="商品状态" v-model="ruleForm.status" placeholder="请选择商品状态">
            <el-option label="全部" :value="null"></el-option>
            <el-option label="售罄" :value="-1"></el-option>
            <el-option label="上架" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label prop="name">
          <el-button type="primary" @click="fetch">搜 索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      stripe
      :data="tableData"
      :row-key="getRowKey"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>
      <el-table-column prop="title" label="商品名称" :width="300">
        <template slot-scope="scope">
          <div class="name_wrapper">
            <img :src="scope.row.mainImage" alt="加载错误" />
            <p>{{scope.row.name}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="productCatalogInfoName" label="商品分类">
        <template slot-scope="scope">
          <span>{{scope.row.productCatalogInfoName || '--'}}</span>
        </template>
      </el-table-column> 
      <el-table-column prop="productSpecs" label="商品规格">
        <template slot-scope="scope">
          <span>{{scope.row.productSpecs || '--'}}</span>
        </template>
      </el-table-column> 
      <el-table-column prop="status" label="商品状态">
         <template slot-scope="scope">
            <span v-if="scope.row.status == -1">售罄</span>
            <span v-else-if="scope.row.status === 0">下架</span>
            <span v-else-if="scope.row.status === 1">上架</span>
          </template>
      </el-table-column> 
      <el-table-column prop="stock" label="库存数量">
         <template slot-scope="scope">
           <span>{{scope.row.stock || '--'}}</span>
         </template>
      </el-table-column>
      <!-- <el-table-column prop="createTime" label="创建时间"></el-table-column> -->
    </el-table>
    <div class="multiple_selection">
      <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
        :page-size="pageSize*1"
        :total="total*1"
        layout="total, sizes, prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import tableBase from "@/components/TableBase";
import utils from "@/utils";
export default {
  name: "dialogSelectGoods",
  extends: tableBase,
  components: { DialogBase },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    },
    categoryName: {
      type: String
    },
    categoryId: {
      type: String
    },
    goodsEcho: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      pageSize: 5,
      tableData: [],
      multipleSelection: [],
      ruleForm: {
        name: "",
        status: null,
        productCatalogInfoId: this.categoryId || ''
      },
      rules: {}
    };
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    goodsList: {
      get() {
          return this.goodsEcho
      },
      set(val) {
          this.$emit('update:goodsEcho', val)
      }
    }
  },
  created() {
    this.goodsList.forEach((row, index) => {
      this.$nextTick(() => {
        if(!row.fakeData) {  //假数据不允许添加选中状态
          this.$refs.multipleTable.toggleRowSelection(row, true);
        }
      })
    })
  },
  mounted() {
    this.$nextTick(() => {
      if(this.$parent.$refs.dialog) {
        let zIndex = this.$el.style.zIndex;
        zIndex = Number(zIndex) + 2;
        this.$parent.$el.style.zIndex = zIndex + '';
      }
    })
  },
  methods: {

    fetch() {
      this.loading = true;
      this._apis.goods.fetchSpuGoodsList(this.ruleForm).then((response)=>{
        if(response.list && Array.isArray(response.list) && response.list.length) {
          this.tableData = response.list.filter((item)=>{
            return item.status == -1 || item.status == 1;
          });
        }
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit("dialogDataSelected", this.multipleSelection);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKey(row) {
      return row.id
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  min-height: 400px;
}
.name_wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    display: block;
    margin-right: 10px;
    border: 1px solid #ddd;
    object-fit: contain;
  }
  p{
    width: calc(100% - 50px);
  }
}
</style>