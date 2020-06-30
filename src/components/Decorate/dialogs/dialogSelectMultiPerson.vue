/* 选择多人拼团弹框 */
<template>
   <DialogBase :visible.sync="visible" width="816px" :title="'选择拼团活动'" @submit="submit">
    <div class="head-wrapper">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
        <el-form-item label prop="activeName">
          <el-input v-model="ruleForm.activeName" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="startIndex = 1;ruleForm.startIndex = 1;fetch()">搜 索</el-button>
          <el-button type="text" style="width:34px;" @click="fetch($event, true)">刷 新</el-button>
          <el-button type="text" style="width:34px;" @click="clearInvalidData">清除失效数据</el-button>
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
      <el-table-column type="selection" :reserve-selection="true" :selectable="itemSelectable" width="55"></el-table-column>
      <el-table-column prop="activeName" label="活动标题">
        <template slot-scope="scope">
          <div class="name_wrapper">
            <img :src="scope.row.goodImg" alt="失败" />
            <p>{{scope.row.activeName}}</p>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="reductionUnitPrice" label="优惠单价"></el-table-column>
      <el-table-column prop="remainStock" label="剩余库存"></el-table-column>
      <el-table-column prop="activeName" label="活动名称"></el-table-column>
      <el-table-column prop="buyLimit" label="商品限购件/人"></el-table-column> -->
      <el-table-column prop="status" label="状态">  <!-- 0是未生效  1是生效中 2是已失效-->
          <template slot-scope="scope">
          <span v-if="scope.row.status === 0">未生效</span>
          <span v-else-if="scope.row.status === 1">生效中</span>
          <span v-else-if="scope.row.status === 2">已失效</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="活动时间">
          <template slot-scope="scope">
            {{scope.row.startTime}} - {{scope.row.endTime}}
          </template>
        </el-table-column>
      <div slot="empty" class="table_empty">
        <img src="../../../assets/images/table_empty.png" alt="">
        <div class="tips">暂无数据<span @click="utils.addNewApply('/application/feature/addGroup', 3)">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
      </div>
    </el-table>
    <div class="multiple_selection" v-if="tableData.length">
      <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus">全选</el-checkbox>
    </div>
    <div class="pagination" v-if="tableData.length">
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
import tableBase from '@/components/TableBase';
import utils from "@/utils";
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectMultiPerson",
  extends: tableBase,
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
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
      pageNum: 1,
      ruleForm: {
        pageNum: 1,
        activeName: '',
      },
      rules: {},
      disableStatus: [2]  //不可选状态值
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
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
  methods: {
    fetch(ev, loadAll) {
      this.loading = true;
      let tempForm = {};
      if(loadAll) {
        tempForm = {...this.ruleForm};
        tempForm.activeName = '';
        this.ruleForm.activeName = '';
      }
      this._apis.shop.getMultiPersonList(loadAll? tempForm: this.ruleForm).then((response)=>{
        this.tableData = response && response.list ? response.list: [];
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

     //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.pageNum = pIndex
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit('dialogDataSelected',  this.multipleSelection);
    },
    itemSelectable(row, index) {
      if(row.status !== 2) {
        return true;
      }
    },
    getRowKey(row) {
      return row.spuId
    },

    /* 清除失效数据 */
    clearInvalidData() {
      this.tableData.forEach((row, index) => {
        if(row.status === 2) {  //假数据不允许添加选中状态
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      })
      this.$message.success('清除成功！');
    }
  }
};
</script>

<style lang="scss" scoped>
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