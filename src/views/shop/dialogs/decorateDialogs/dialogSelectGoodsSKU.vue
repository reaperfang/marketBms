/* 选择商品弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" title="选择货品" @submit="submit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
      <div class="inline-head">
        <el-form-item label prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入货品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label prop="name">
          <el-button type="primary" @click="fetch">搜 索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-table
      stripe
      :data="tableList"
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
            <img :src="scope.row.goodsInfo.image" alt="加载错误" />
            <p>{{scope.row.goodsInfo.name}}<span style="display:block;color: #92929B;">{{scope.row.goodsInfo.specs}}</span></p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100]"
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
import uuid from "uuid/v4";
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
      tableList: [],
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
      this._apis.goods.fetchGoodsList(this.ruleForm).then((response)=>{
        this.tableList = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
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
      return row.goodsInfo.id
    },

    /* 单选选中改变 */
    seletedChange(data, state) {

      /* 更改列表选中状态 */
      const tempList = [...this.tableList];
      for(let item of tempList) {
        if(item.id !== data.id) {
          item.active = false;
        }
      }
      this.tableList = tempList;

      this.multipleSelection = data;
    },
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