<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="余额记录" :hasCancel="hasCancel">
    <div class="c_container">
      <div class="marB20">
        <span>总余额：{{ data.balance }}</span>
      </div>
      <el-table
        :data="balanceList"
        style="width: 100%"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        :default-sort="{prop: 'date', order: 'descending'}"
      >
        <el-table-column prop="updateUserName" label="操作人"></el-table-column>
        <el-table-column prop="tradeTime" label="操作时间"></el-table-column>
        <el-table-column prop="changeReason" label="交易类型"></el-table-column>
        <el-table-column prop="remark" label="原因"></el-table-column>
        <el-table-column prop="changeAmount" label="数量"></el-table-column>
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
    </div>
  </DialogBase>
</template>
<script>
import utils from "@/utils";
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "balanceListDialog",
  data() {
    return {
      hasCancel: true,
      pageSize: 10,
      startIndex: 1,
      total: 0,
      balanceList: []
    };
  },
  methods: {
    submit() {},
    getBalanceLists(startIndex, pageSize) {
      this._apis.client
        .getBalanceLists({
          startIndex,
          pageSize,
          memberInfoId: this.data.id,
          sort: "desc"
        })
        .then(response => {
          let list = response.list;
          list.map(v => {
            v.tradeTime = utils.formatDate(
              new Date(Number(v.tradeTime)),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.changeAmount = v.changeAmount > 0?"+" + v.changeAmount:v.changeAmount;
          });
          this.balanceList = [].concat(list);
          this.total = response.total;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.getBalanceLists(this.startIndex, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getBalanceLists(val, this.pageSize);
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  mounted() {
    this.getBalanceLists(this.startIndex, this.pageSize);
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
/deep/ .el-dialog__body {
  padding: 10px 20px 20px 20px;
}
.c_container {
  text-align: left;
  .marB20 {
    margin: 20px 0;
  }
  .marL20 {
    margin-left: 20px;
  }
}
</style>


