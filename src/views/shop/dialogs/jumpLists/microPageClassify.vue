<template>
  <div class="head-wrapper">
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true">
          <div class="inline-head">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入微页面分类名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" @click="search">搜  索</el-button>
            </el-form-item>
          </div>
        </el-form>
        <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading">
          <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="分类名称"></el-table-column>
          <el-table-column prop="pageNum" label="页面数量"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column prop="updateUserName" label="操作账户"></el-table-column>
        </el-table>
      <div class="pagination">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="prev, pager, next, sizes"
          >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: "microPageClassify",
  extends: tableBase,
  components: {},
  props: {
     
  },
  data() {
    return {
      pageSize: 5,
      ruleForm: {
        name: ''
      },
      rules: {},
      invalid: true,  //数据是否无效
      tableData: [],
    };
  },
  created() {
  },
  methods: {
    search() {
      this.startIndex = 1;
      this.ruleForm.startIndex = 1;
      this.fetch();
    },
    fetch() {
      this.loading = true;
      this._apis.shop.getClassifyList(this.ruleForm).then((response)=>{
        const tempList = [...response.list];
        for(let item of tempList) {
          item.active = false;
        }
        this.tableData = tempList;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

      /* 选中改变 */
    seletedChange(data, state) {

      /* 更改列表选中状态 */
      const tempList = [...this.tableData];
      for(let item of tempList) {
        if(item.id !== data.id) {
          item.active = false;
        }
      }
      this.tableData = tempList;

      let shopInfo = this.$store.getters.shopInfos
      let cid = shopInfo && shopInfo.id || ''

      if(state) {
        /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  {
          pageType: 'microPageClassify',
          typeName: '微页面分类',
          id: 3,
          data: {
            id: data.id,
            name: data.name
          },
          cid
        });
        this.$emit('invalidChange', false)
      }else {
           /* 向父组件发送选中的数据 */
        this.$emit('seletedRow',  null);
        this.$emit('invalidChange', true)
      }

    }

  }
};
</script>

<style lang="scss">
/deep/ thead th{
  background: rgba(230,228,255,1)!important;
  color:#837DFF!important;
}
.inline-head{
  justify-content: flex-start!important;
}
</style>