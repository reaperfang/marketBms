<!-- 表格基础组件，所有分页表格都继承自此页面 -->

<script>
import utils from '@/utils';
export default {
  name: 'tableBase',
  data() {
    return {
      startIndex: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      loading:false,
      ruleForm: {
        startIndex: 1,
        pageSize: 10,
      },
      tableData: [],
      multipleSelection: [],
      currentPage: null,
      date: [utils.calcDate(new Date(), '-', 30), new Date()],
    }
  },

  created() {
    this.ruleForm.pageSize = this.pageSize;
    this.fetch();
  },

  mounted() {
  },

  methods: {
    fetch(){},

    //分页大小改变
    handleSizeChange(val) {
      this.pageSize = val || this.pageSize;
      this.ruleForm.pageSize = val || this.pageSize;
      this.fetch();
    },

    //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.startIndex = pIndex
      this.ruleForm.startIndex = pIndex
      this.fetch()
    },

    //切换选中状态
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    //选择改变
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //检查当前列是否可以多选
    checkSelection(row, index) {
      return true;
    }
  }
}
</script>
<style lang="scss">
</style>
