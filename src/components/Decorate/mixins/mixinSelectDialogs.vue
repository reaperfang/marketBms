/* 选择弹框混入文件 */
<script>
import DialogBase from "@/components/DialogBase";
import tableBase from '@/components/TableBase';
import dialogTableSelect from "@/mixins/dialogTableSelect";
import utils from "@/utils";
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectNyuan",
  extends: tableBase,
  mixins: [dialogTableSelect],
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
      ruleForm: {},
      rules: {},
      disableStatus: []  //不可选状态值
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
    if(!this.goodsList){
      return;
    }
    this.goodsList.forEach((row, index) => {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      })
    })
  },
  mounted() {
  },
  methods: {

     //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.pageNum = pIndex
      this.ruleForm.startIndex = pIndex
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit('dialogDataSelected',  this.multipleSelection);
    },

    //选择商品或者活动弹出框中的 搜索按钮事件 分页回到第一页
    search() {
      this.ruleForm.pageNum = 1;
      this.ruleForm.startIndex = 1;
      this.fetch();
    },
    //选择商品或者活动弹出框中的 刷新按钮事件 清除所有筛选项和分页回到第一页
    refresh() {
      this.ruleForm.pageNum = 1;
      this.ruleForm.startIndex = 1;
      this.$refs.ruleForm.resetFields();
      this.fetch();
    }
  }
};
</script>