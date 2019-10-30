<template>
  <div>
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
          <div class="inline-head">
            <el-form-item label="" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入微页面分类名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-button type="primary" @click="fetch">搜  索</el-button>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
          :page-size="pageSize*1"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
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
      tableData: [],
    };
  },
  created() {
  },
  methods: {
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
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
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

      let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
      let cid = shopInfo && shopInfo.id || ''

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
    }

  }
};
</script>

<style lang="scss">
.inline-head{
  justify-content: flex-end;
}
</style>