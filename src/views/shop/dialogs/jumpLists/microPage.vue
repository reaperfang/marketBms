<template>
  <div class="head-wrapper">
     <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :inline="true">
          <div class="inline-head">
            <el-form-item label="所属分类" prop="name">
              <el-select v-if="classifyList.length" v-model="ruleForm.pageCategoryInfoId" placeholder="请选择分类">
                <el-option label="全部分类" value=""></el-option>
                <el-option v-for="(item, key) of classifyList" :key="key" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="页面名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="请输入页面名称" clearable></el-input>
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
            <el-table-column prop="name" label="页面名称" :width="200"></el-table-column>
            <el-table-column prop="title" label="页面标题" :width="200"></el-table-column>
            <el-table-column prop="pageCategoryName" label="所属分类" >
              <template slot-scope="scope">
                <span v-if="scope.row.pageCategoryInfoId == '-1'">未分类</span>
                <span v-else>{{scope.row.pageCategoryName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="vv" label="访客数"></el-table-column>
            <el-table-column prop="pv" label="浏览数"></el-table-column>
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
      invalid: true,  //数据是否无效
      tableData: [],
      classifyList: [],
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
        console.error(error);
        this.loading = false;
      });
    },

    //获取分类下拉列表
    getClassifyList() {
      this._apis.shop.selectAllClassify({}).then((response)=>{
        this.classifyList = response;
      }).catch((error)=>{
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

      let shopInfo = this.$store.getters.shopInfos
      let cid = shopInfo && shopInfo.id || ''

      if(state) {
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