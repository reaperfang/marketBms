/* cardManage 领卡记录列表 */
<template>
  <div>
    <el-table
      :data="lklist"
      style="width: 100%"
      :header-cell-style="{background:'#f6f7fa', color:'#44434B', height: '46px'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading"
      >
      <el-table-column
        prop="name"
        fixed="left"
        width="110"
        class-name="table-padding"
        label="会员卡名称">
      </el-table-column>
      <el-table-column
        prop="enable"
        align="center"
        label="状态">
      </el-table-column>
      <el-table-column
        min-width="160"
        prop="cardSn"
        align="center"
        label="卡号">
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="memberSn"
        align="center"
        label="用户ID"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        align="center"
        min-width="160"
        label="领取时间"
      >
      </el-table-column>
      <el-table-column
        min-width="100"
        prop="receiveWay"
        align="center"
        label="获取方式"
      >
      </el-table-column>
      <el-table-column
        prop="createUserName"
        align="center"
        label="发放人"
      >
      </el-table-column>
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
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "lkTable",
  extends: TableBase,
  props: ['lkParams'],
  data() {
    return {
      lklist:[],
      loading: false
    };
  },
  created() {

  },
  methods: {
    handleCurrentChange(val) {
      this.getLkList(val, this.pageSize);
    },
    handleSizeChange(val) {
      this.getLkList(1, val);
      this.pageSize = val;
    },
    getLkList(startIndex, pageSize) {
      this.loading = true;
      let params = {};
      this._apis.client.getLkList(Object.assign(this.lkParams, {startIndex, pageSize})).then((response) => {
        this.loading = false;
        this.lklist = [].concat(response.list);
        this.lklist.map((v) => {
          v.enable = v.enable == 0?'禁用':'启用';
         // v.receiveWay = v.receiveWay == 0?'手动发放':'无门槛领取';
          if(v.receiveWay == 0) {
            v.receiveWay = "手动发放";
          }else if(v.receiveWay == 1) {
            v.receiveWay = "无门槛领取";
          }else if(v.receiveWay == 2) {
            v.receiveWay = "满足特定条件";
          }
        })
        this.total = response.total;
      }).catch((error) => {
        this.loading = false;
        console.error(error);
      })
    }
  },
  mounted() {
    this.getLkList(1,this.pageSize);
  },
  components: {},
  watch: {
    lkParams() {
      this.getLkList(1,this.pageSize);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.page_styles {
  margin: 40px 0 30px 0;
}

</style>
