/* 选择商品弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" title="选择货品" @submit="submit">
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
        <el-form-item label prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入货品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label prop="name">
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">搜 索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      stripe
      :data="tableData"
      :row-key="getRowKey"
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <el-table-column type="selection" :reserve-selection="true" width="55" v-if="multiple === true"></el-table-column>
      <el-table-column v-else label="选择" :width="50">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.active" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="货品名称" :width="500">
        <template slot-scope="scope">
          <div class="name_wrapper">
            <img :src="scope.row.goodsInfo.image" alt="失败" />
            <p>{{scope.row.goodsInfo.name}}<span style="display:block;color: #92929B;">{{scope.row.goodsInfo.specs}}</span></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
    <div class="multiple_selection" v-if="tableData.length&& multiple === true">
      <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
    </div>
    <div class="pagination" v-if="tableData.length">
      <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100]"
        :page-size="pageSize*1"
        :total="total*1"
        layout="prev, pager, next, sizes"
      ></el-pagination>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import tableBase from "@/components/TableBase";
import utils from "@/utils";
export default {
  name: "dialogSelectGoodsSKU",
  extends: tableBase,
  components: { DialogBase },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    },
    goodsEcho: {
      type: Array,
      required: true
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      pageSize: 5,
      tableData: [],
      multipleSelection: [],
      ruleForm: {
        name: "",
        status: '1'
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
        this.$refs.multipleTable.toggleRowSelection(row, true);
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
      this._apis.goods.fetchGoodsList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
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
    getRowKey(row) {
      return row.goodsInfo.id
    },

    /* 单选选中改变 */
    seletedChange(data, state) {

      /* 更改列表选中状态 */
      const tempList = [...this.tableData];
      for(let item of tempList) {
        if(item.id !== data.id) {
          item.active = false;
        }
      }
      this.tableData = tempList;

      this.multipleSelection = data;
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__body{
  min-height: 400px;
}
/deep/{
  table{
    width:auto!important;
  }
  .el-table__empty-block{
    width:100%!important;
  }
}
/deep/ thead th{
  background: rgba(230,228,255,1)!important;
  color:#837DFF!important;
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