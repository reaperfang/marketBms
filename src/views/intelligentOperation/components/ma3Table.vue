/* 会员分析列表 */
<template>
  <div>
    <el-table
      :data="listObj.members"
      style="width: 100%"
      :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      v-loading="loading1"
      >
      <el-table-column
        type="index"
        label="排序"
        width="100"
        fixed="left" class-name="table-padding"
        align="left">
      </el-table-column>
      <el-table-column
        prop="id"
        align="center"
        label="用户ID">
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        width="150"
        label="手机号码">
        <template slot-scope="scope">
          {{scope.row.phone ? scope.row.phone : '-'}}
        </template>
      </el-table-column>
      <el-table-column
      align="center"
        label="用户类型"
      >
      <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block">{{{0:'非会员',1:'新会员',2:'老会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        min-width="140"
        label="会员昵称"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        align="right"
        width="140"
        label="积分(余额)"
      >
        <template slot-scope="scope">
          <span>{{scope.row.score || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
      align="center"
      width="160"
        label="入会时间"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.joinTime">{{Number(scope.row.joinTime) | time}}</span>
          <span v-else> - </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="scoreTradeCount"
        label="积分消耗次数（总）"
        align="right"
        fixed="right" class-name="table-padding"
        width="180px"
      >
      </el-table-column>
    </el-table>
    <div class="page_styles" v-show="listObj.totalSize>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="Number(startIndex) || 1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="prev, pager, next, sizes"
        :total="listObj.totalSize"
        :background="true">
      </el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "mcTable",
  extends: TableBase,
  props:['listObj','totalCount','background','nowPage', 'loading'],
  data() {
    return {
      pageSize:10,
      loading1: true,
      startIndex: 1
      // dataList:[
      //   {
      //       choose: true,
      //       importTime:"",
      //       channel:"",
      //       importNum:"",
      //       successNum:"",
      //       failNum:"",
      //       buyTime:"",
      //       operator:""
      //   },
      // ],
    };
  },
  computed:{

  },
  created() {

  },
  watch: {
    loading(newValue) {
      this.loading1 = newValue;
    },
    nowPage(val) {
      if(val) {
        this.startIndex = val;
      }
    }
  },
  methods: {
    //更改每页条数
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('sizeChange',val)
    },
    //选择页数
    handleCurrentChange(val){
      this.startIndex = val;
      this.$emit('currentChange',val)
    }
    
  },
  filters:{
    //时间戳过滤
      time:function(value) {
      let date = new Date(value)
      let Y = date.getFullYear() + '-'
      let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':'
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + '' : date.getMinutes()
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m
    }
  },
  components: {}
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.page_styles {
    margin: 40px 0 30px 0;
}

</style>
