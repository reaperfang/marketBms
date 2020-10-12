/* 全部客户列表 */
<template>
  <div class="acTable_container">
    <el-button @click="exportToLocal" class="export_btn" v-permission="['用户', '全部用户', '默认页面', '用户导出']">导出</el-button>
    <el-table
      :data="memberList"
      :row-key="getRowKeys"
      ref="allClientTable"
      style="width: 100%"
      :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
      v-loading="loading"
      @sort-change="changeSort"
      @select-all="handleSelectAll"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" :reserve-selection="true" fixed="left" width="34"></el-table-column>
      <el-table-column prop="memberSn" label="用户ID" fixed="left" width="110" class-name="table-padding"></el-table-column>
      <el-table-column label="用户信息" :width="163">
        <template slot-scope="scope">
          <div class="clearfix icon_cont">
            <img v-if="scope.row.headIcon" :src="scope.row.headIcon" alt="" class="headIcon fl">
            <img v-else src="../../../../assets/images/client/head_default.png" alt="" class="headIcon fl">
            <span class="fr">{{scope.row?scope.row.nickName:""}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" :width="150" align="center"></el-table-column>
      <el-table-column label="身份">
        <template slot-scope="scope">
          <div class="clearfix iden_cont">
            <span class="fl">{{scope.row?scope.row.memberTypeText:""}}</span>
            <div class="fl" style="margin-left: 5px">
              <span>{{scope.row?scope.row.levelName:""}}</span>
              <span>{{scope.row?scope.row.cardLevelName:""}}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="余额" sortable="custom" prop="balance" :width="150" align="right">
        <template slot-scope="scope">
          ¥{{scope.row.balance || '0.00'}}
        </template>
      </el-table-column>
      <el-table-column prop="score" label="积分" sortable="custom" :width="150" align="right"></el-table-column>
      <el-table-column label="累计消费金额" sortable="custom" prop="totalDealMoney" :width="150" align="right">
        <template slot-scope="scope">
          ¥{{scope.row.totalDealMoney || 0.00}}
        </template>
      </el-table-column>
      <el-table-column prop="dealTimes" label="购买次数" min-width="150" sortable="custom" align="right"></el-table-column>
      <el-table-column label="客单价（元）" prop="perUnitPrice" sortable="custom" min-width="150" align="right">
        <template slot-scope="scope">
          ¥{{scope.row.perUnitPrice || 0.00}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="198" fixed="right" header-align="center" class-name="table-padding">
        <template slot-scope="scope">
          <div class="btns clearfix table-operate">
            <span class="s1 table-btn" @click="_routeTo('clientInfo',{id: scope.row.id})" v-permission="['用户', '全部用户', '默认页面', '查看详情']">详情</span>
            <!-- <span class="s2" @click="handelDelete(scope.row.id)" v-permission="['用户', '全部客户', '默认页面', '删除']">删除</span> -->
            <span class="s2 table-btn" @click="addTag(scope.row)">标签</span>
            <span class="s3 table-btn table-warning" @click="addBlackList(scope.row)" v-if="scope.row.status == 0" v-permission="['用户', '全部用户', '默认页面', '加入/取消黑名单']">加入黑名单</span>
            <span class="s3 table-btn table-warning" @click="removeBlack(scope.row)" v-if="scope.row.status == 1" v-permission="['用户', '全部用户', '默认页面', '加入/取消黑名单']">解除黑名单</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="a_line table-select">
      <el-checkbox v-model="checkAll" @change="handleChange">全选</el-checkbox>
      <!-- <el-button type="primary" @click="batchDelete">批量删除</el-button> -->
      <el-button class="border_btn border-button" @click="batchAddTag" v-permission="['用户', '全部用户', '默认页面', '打标签']">打标签</el-button>
      <el-button class="border_btn border-button" @click="batchAddBlack" v-permission="['用户', '全部用户', '默认页面', '加入/取消黑名单']">加入黑名单</el-button>
      <el-button class="border_btn border-button" @click="batchRemoveBlack" v-permission="['用户', '全部用户', '默认页面', '加入/取消黑名单']">取消黑名单</el-button>
    </div>
    <div class="page_styles">
      <el-pagination
        :background="true"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
        :page-size="pageSize*1"
        :total="total*1"
        layout="prev, pager, next, sizes"
      ></el-pagination>
    </div>
    <component
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      :data="currentData"
      @freshTable="freshTable"
    ></component>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
import deleteUserDialog from "../../dialogs/allClient/deleteUserDialog";
import addTagDialog from "../../dialogs/allClient/addTagDialog";
import addBlackDialog from "../../dialogs/allClient/addBlackDialog";
import removeBlackDialog from "../../dialogs/allClient/removeBlackDialog";
import batchDeleteUserDialog from "../../dialogs/allClient/batchDeleteUserDialog";
import batchAddBlackDialog from "../../dialogs/allClient/batchAddBlackDialog";
import batchAddTagDialog from "../../dialogs/allClient/batchAddTagDialog";
import batchRemoveBlackDialog from "../../dialogs/allClient/batchRemoveBlackDialog";
export default {
  name: "acTable",
  extends: TableBase,
  props: ["newForm"],
  components: {
    deleteUserDialog,
    addTagDialog,
    addBlackDialog,
    removeBlackDialog,
    batchDeleteUserDialog,
    batchAddBlackDialog,
    batchAddTagDialog,
    batchRemoveBlackDialog
  },
  data() {
    return {
      checkAll: false,
      memberList: [],
      currentDialog: "",
      dialogVisible: false,
      currentData: {},
      loading: false,
      couponList:[],
      codeList:[]
    };
  },
  computed: {
    allUserList() {
      return clientApi.allUserList;
    }
  },
  mounted() {
    //this.getMembers(1, this.pageSize);
  },
  methods: {
    handleSelectChange(val) {
      if(val.length == this.memberList.length) {
        this.checkAll = true;
      }else{
        this.checkAll = false;
      }
    },
    handleSelectAll(val) {
      if(!val.length) {
        this.checkAll = false
      }else{
        this.checkAll = true;
      }
    },
    changeSort(val) {
      let tOrder = null;
      switch(val.prop) {
        case "balance":
          tOrder = val.order == "ascending" ? 0:1
          break;
        case "score":
          tOrder = val.order == "ascending" ? 2:3
          break;
        case "totalDealMoney":
          tOrder = val.order == "ascending" ? 4:5
          break;
        case "dealTimes":
          tOrder = val.order == "ascending" ? 6:7
          break;
        case "perUnitPrice":
          tOrder = val.order == "ascending" ? 8:9
          break;
        default:
          break;
      }
      this.$set(this.newForm,'orderByCondition', tOrder);
      this.getMembers(1, this.pageSize);
      this.startIndex = 1;
    },
    getRowKeys(row) {
      return row.id
    },
    exportToLocal() {
      let selection = this.$refs.allClientTable.selection;
      let idList = []
      if (selection.length > 0) {
        selection.map((v) => {
          idList.push(v.id)
        });
        this._apis.client.exportToLocal({idList: idList}).then((response) => {
          window.location.href = response
        }).catch((error) => {
          console.log(error);
        })
      }else{
        this.$message({
          message: '请选择要导出的数据',
          type: 'warning'
        });
      }
    },
    handleCurrentChange(val) {
      this.getMembers(val, this.pageSize);
      this.startIndex = val;
      this.checkAll = false;
      this.$refs.allClientTable.clearSelection();
    },
    handleSizeChange(val) {
      this.getMembers(1, val);
      this.pageSize = val;
      this.checkAll = false;
      this.$refs.allClientTable.clearSelection();
    },
    handelDelete(id) {
      this.dialogVisible = true;
      this.currentDialog = "deleteUserDialog";
      this.currentData.userId = id;
    },
    batchDelete() {
      if (this.$refs.allClientTable.selection.length > 0) {
        this.dialogVisible = true;
        this.currentDialog = "batchDeleteUserDialog";
        this.currentData.checkedItem = this.$refs.allClientTable.selection;
      } else {
        this.$message('请选择用户');
      }
    },
    batchAddTag() {
      if (this.$refs.allClientTable.selection.length > 0) {
        this.dialogVisible = true;
        this.currentDialog = "batchAddTagDialog";
        this.currentData.checkedItem = this.$refs.allClientTable.selection;
      } else {
        this.$message('请选择用户');
      }
    },
    addTag(row) {
      this.dialogVisible = true;
      this.currentDialog = "addTagDialog";
      this.currentData.id = row.id;
      this.currentData.labelRecordViews = row.labelRecordViews;
    },
    addBlackList(row) {
      this.dialogVisible = true;
      this.currentDialog = "addBlackDialog";
      this.currentData = {memberSn: row.memberSn, id: row.id};
    },
    removeBlack(row) {
      this.dialogVisible = true;
      this.currentDialog = "removeBlackDialog";
      this.currentData.id = row.id;
      this.currentData.memberSn = row.memberSn;
    },
    batchAddBlack() {
      if (this.$refs.allClientTable.selection.length > 0) {
        this.dialogVisible = true;
        this.currentDialog = "batchAddBlackDialog";
        this.currentData.checkedItem = this.$refs.allClientTable.selection;
      } else {
        this.$message('请选择用户');
      }
    },
    batchRemoveBlack() {
      if (this.$refs.allClientTable.selection.length > 0) {
        this.dialogVisible = true;
        this.currentDialog = "batchRemoveBlackDialog";
        this.currentData.checkedItem = this.$refs.allClientTable.selection;
      } else {
        this.$message('请选择用户');
      }
    },
    handleChange(val) {
      this.memberList.forEach(row => {
        this.$refs.allClientTable.toggleRowSelection(row,val);
      });
    },
    getMembers(startIndex, pageSize) {
      this.memberList = [];
      this.loading = true;
      this._apis.client
        .getMemberList(Object.assign(this.newForm,{startIndex, pageSize}))
        .then(response => {
          this.loading = false;
          let list = response.list;
          if(list.length > 0) {
            list.map((v) => {
              v.memberTypeText = v.memberType === 0 ? '用户':'会员'
            })
          }
          this.memberList = [].concat(list);
          this.total = response.total;
          this.$emit('stopLoading');
        })
        .catch(error => {
          this.loading = false;
          console.log(error);
        });
    },
    freshTable() {
      this.checkAll = false;
      this.getMembers(this.startIndex, this.pageSize);
    }
  },
  watch: {
    newForm(val) {
      this.getMembers(1, this.pageSize);
      this.startIndex = 1;
    }
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-button+.el-button{
  margin-left: 8px;
}
/deep/ .el-form-item__label{
  width: 86px;
  text-align: right;
  overflow: hidden;
  height: 38px;
}
/deep/ .el-range-editor--small .el-range-separator{
  width: 20px;
}
/deep/ .el-date-editor--daterange.el-input, .el-date-editor--daterange.el-input__inner, .el-date-editor--timerange.el-input, .el-date-editor--timerange.el-input__inner{
  width: 230px;
}
/deep/.el-date-editor .el-range-input{
  width: 41%;
}
/deep/ .el-table .cell{
  line-height: none;
}
.acTable_container{
  position: relative;
  margin-top: 60px;
  .export_btn{
    position: absolute;
    top: -52px;
    right: 40px;
  }
}
.a_line {
  margin: 20px 0 40px 22px;
}
.page_styles{
  text-align: center;
  margin-bottom: 30px;
}
.icon_cont{
  width: 163px;
  span{
    width: 130px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 36px;
    text-align: left;
    padding-left: 20px;
  }
  .headIcon{
    display: block;
    width: 32px;
    height: 32px;
  }
}
.iden_cont{
  width: 140px;
  > span{
    line-height: 46px;
  }
  div{
    width: 100px;
    span{
      display: block;
      font-size: 12px;
      height: 20px;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
      &:first-child{
        color: #F55858;
      }
      &:last-child{
        color: #FD932B
      }
    }
  }
}
// @media screen and (max-width: 1600px) {
//   .icon_cont{
//     width: 117px;
//   }
// }
</style>
