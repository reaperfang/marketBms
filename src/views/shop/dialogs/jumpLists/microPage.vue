<template>
  <div>
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
          <div class="inline-head">
            <el-form-item label="" prop="name">
              <el-select v-if="classifyList.length" v-model="ruleForm.pageCategoryInfoId" placeholder="请选择分类">
                <el-option label="全部分类" value=""></el-option>
                <el-option v-for="(item, key) of classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入页面名称" clearable></el-input>
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
            <el-table-column prop="name" label="页面名称" :width="200"></el-table-column>
            <el-table-column prop="title" label="页面标题" :width="200"></el-table-column>
            <el-table-column prop="pageCategoryName" label="所属分类" ></el-table-column>
            <el-table-column prop="vv" label="访客数"></el-table-column>
            <el-table-column prop="pv" label="浏览数"></el-table-column>
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
  name: "microPage",
  extends: tableBase,
  components: {},
  props: {
     
  },
  data() {
    return {
      pageSize: 5,
      ruleForm: {
        pageCategoryInfoId: '',
        name: '',
        status: '0',
      },
      rules: {},
      tableData: [],
      classifyList: [],
    };
  },
  created() {
  },
  methods: {
    fetch() {
      this.getClassifyList();
      this.loading = true;
      this._apis.shop.getPageList(this.ruleForm).then((response)=>{
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

    //获取分类下拉列表
    getClassifyList() {
      this._apis.shop.selectAllClassify({}).then((response)=>{
        this.classifyList = response;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
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
        pageType: 'microPage',
        typeName: '微页面',
        id: 2,
        data: {
          id: data.id,
          name: data.name,
          title: data.title
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