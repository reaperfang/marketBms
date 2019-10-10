/* 获取积分规则列表 */
<template>
  <div>
    <el-table
      :data="creditList"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        label="获取积分场景">
        <template slot-scope="scope">
          <span>{{scope.row.sceneName}}</span>
          <span v-if="!!scope.row.redirectUrl" class="yy">应用</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="enable"
        label="状态">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
            <span class="edit_span" @click="editCredit(scope.row)" v-permission="['客户', '积分管理', '获取积分规则', '查看']">
                <i class="edit_i"></i>
                查看&编辑
            </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="page_styles">
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
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @refreshPage="refreshPage"></component>
  </div>
</template>

<script type='es6'>
import clientApi from '@/api/client';
import TableBase from "@/components/TableBase";
import loginRegularDialog from '../../dialogs/creditsManage/loginRegularDialog';
import buyRegularDialog from '../../dialogs/creditsManage/buyRegularDialog';
import repurchaseRegularDialog from '../../dialogs/creditsManage/repurchaseRegularDialog';
import praiseRegularDialog from '../../dialogs/creditsManage/praiseRegularDialog';
export default {
  name: "cmTable",
  extends: TableBase,
  components: { loginRegularDialog, buyRegularDialog, repurchaseRegularDialog, praiseRegularDialog },
  data() {
    return {
      currentDialog:"",
      dialogVisible: false,
      currentData:{},
      creditList: [],
      loading: false,
      pageSize: 10,
      startIndex: 1,
      total: 0
    };
  },
  computed: {
  },
  created() {

  },
  methods: {
    refreshPage() {
      this.getCreditList(this.startIndex, this.pageSize);
    },
    editCredit(row) {
      // if(!!row.redirectUrl) {
      //   window.location.href=row.redirectUrl;
      // }else{
        switch(row.sceneEn) {
          case 'Login': 
            this.dialogVisible = true;
            this.currentDialog = "loginRegularDialog";
            this.currentData.row = row;
            break;
          case 'Buy': 
            this.dialogVisible = true;
            this.currentDialog = "buyRegularDialog";
            this.currentData.row = row;
            break;
          case 'RepeatBuy': 
            this.dialogVisible = true;
            this.currentDialog = "repurchaseRegularDialog";
            this.currentData.row = row;
            break;
          case 'Comment': 
            this.dialogVisible = true;
            this.currentDialog = "praiseRegularDialog";
            this.currentData.row = row;
            break;
          case 'Sign':
            this.$router.push({name:'apply',params:{paths:'/application/customarket/checkin'}})
            break;
          default:
            break;
        // }
      }
      
    },
    handleCurrentChange(val) {
      this.getCreditList(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.getCreditList(1, val);
      this.pageSize = val;
    },
    getCreditList(startIndex, pageSize) {
      this.loading = true;
      this._apis.client.getCreditList({startIndex:startIndex, pageSize: pageSize}).then((response) => {
        this.loading = false;
        let list = response.list;
        let arr = []
        list.map((v,index) => {
          if(!!v.redirectUrl) {
            v.enable = '--';
          }else{
            v.enable = v.enable == 0?'禁用':'启用';
          }
        });
        this.creditList = [].concat(list);
        this.total = response.total;
      }).catch((error) => {
        this.loading = false;
        console.log(error);
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
      })
    }
  },
  mounted() {
    this.getCreditList();
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.edit_span{
    color: #655EFF;
    cursor: pointer;
    .edit_i{
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 8px;
        background: url("../../../../assets/images/client/icon_edit.png") 0 0 no-repeat;
    }
}
.page_styles{
  text-align: center;
}
.yy{
  display: inline-block;
  text-align: center;
  width: 52px;
  height: 25px;
  line-height: 25px;
  border-radius:4px;
  border:1px solid rgba(101,94,255,1);
  color: #655EFF;
  margin-left: 10px;
}

</style>
