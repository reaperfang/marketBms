<template>
  <div>
      <el-table  :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column prop="" label="选择" :width="50">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.active" @change="seletedChange(scope.row, scope.row.active)"></el-checkbox>
            </template>
          </el-table-column>
        <el-table-column prop="title" label="页面名称"></el-table-column>
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
  name: "systemPage",
  extends: tableBase,
  components: {},
  props: {
     
  },
  data() {
    return {
      ruleForm: {
        name: ''
      },
      rules: {},
      tableData: [
        {
          id: 'index',
          name: 'index',
          title: '首页'
        },
        {
          id: 'userCenter',
          name: 'userCenter',
          title: '个人中心'
        },
        {
          id: 'shoppingCart',
          name: 'shoppingCart',
          title: '购物车'
        }
        // {
        //   id: 'customLink',
        //   name: 'customLink',
        //   title: '自定义链接'
        // },
      ],
    };
  },
  created() {
  },
  methods: {

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
        pageType: 'systemPage',
        typeName: '系统页面',
        id: 7,
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