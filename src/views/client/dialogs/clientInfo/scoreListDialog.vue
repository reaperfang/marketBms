<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="积分记录" :hasCancel="hasCancel">
    <div class="c_container">
        <div class="marB20"><span>总积分：{{ data.score + data.frozenScore }}</span><span class="marL20">可用积分：{{ data.score }}</span></div>
        <el-table
            :data="scoreList"
            style="width: 100%"
            :default-sort="{prop: 'date', order: 'descending'}"
          >
            <el-table-column prop="updateUserName" label="操作人" width="120" fixed="left" class-name="table-padding"></el-table-column>
            <el-table-column prop="createTime" label="操作时间" align="center" min-width="150"></el-table-column>
            <el-table-column prop="businessTypeName" label="交易类型" align="center" min-width="120"></el-table-column>
            <el-table-column prop="remarks" label="原因" align="center" min-width="120"></el-table-column>
            <el-table-column prop="changeScore" label="数量" min-width="125" align="right" fixed="right" class-name="table-padding"></el-table-column>
        </el-table>
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
    </div>
  </DialogBase>
</template>
<script>
import utils from "@/utils";
import clientApi from "@/api/client";
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "discountCouponDialog",
  data() {
    return {
      hasCancel: true,
      pageSize: 10,
      startIndex: 1,
      total: 0,
      scoreList: []
    };
  },
  methods: {
    submit() {
      
    },
    getPointList(startIndex, pageSize) {
        this._apis.client.getPointList({startIndex, pageSize, memberInfoId: this.data.id, sort:'desc'}).then((response) => {
          let list = response.list;
          list.map(v => {
            v.createTime = utils.formatDate(
              new Date(Number(v.createTime)),
              "yyyy-MM-dd hh:mm:ss"
            );
            if(v.changeScore !== 0) {
              if(v.changeType == 1 || v.changeType == 5 || v.changeType == 6) {
                v.changeScore = "-" + v.changeScore
              }else{
                v.changeScore = "+" + v.changeScore
              }
            }
          });
            this.scoreList = [].concat(list);
            this.total = response.total;
        }).catch((error) => {
          console.error(error);
        })
    },
    handleSizeChange(val) {
      this.getPointList(this.startIndex, val);
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.getPointList(val, this.pageSize);
    },
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
      this.getPointList(this.startIndex, this.pageSize);
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
  .marB20{
      margin: 20px 0;
  }
  .marL20{
      margin-left: 20px;
  }
}
</style>


