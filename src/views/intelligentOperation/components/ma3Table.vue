/* 会员分析列表 */
<template>
  <div>
    <el-table
      :data="listObj.members"
      style="width: 100%"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      :default-sort = "{prop: 'date', order: 'descending'}"
      >
      <el-table-column
        type="index"
        label="排序">
      </el-table-column>
      <el-table-column
        prop="id"
        label="客户ID">
      </el-table-column>
      <el-table-column
        prop="phone"
        label="手机号码">
        <template slot-scope="scope">
          {{scope.row.phone ? scope.row.phone : '-'}}
        </template>
      </el-table-column>
      <el-table-column
        label="客户类型"
      >
      <template slot-scope="scope">
             <span style="line-height:60px;display:inline-block">{{{1:'非会员',2:'老会员',3:'新会员'}[scope.row.memberType]}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="会员昵称"
      >
      </el-table-column>
      <el-table-column
        prop="score"
        label="积分(余额)"
      >
        <template slot-scope="scope">
          <span>{{scope.row.score || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="入会时间"
      >
        <template slot-scope="scope">
          <span>{{Number(scope.row.joinTime) | time}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="scoreTradeCount"
        label="积分消耗次数（总）"
      >
      </el-table-column>
    </el-table>
    <div class="page_styles">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="sizes, prev, pager, next"
        :total="listObj.totalSize">
      </el-pagination>
    </div>
  </div>
</template>

<script type='es6'>
import TableBase from "@/components/TableBase";
export default {
  name: "mcTable",
  extends: TableBase,
  props:['listObj','totalCount'],
  data() {
    return {
      pageSize:10,
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
  methods: {
    //更改每页条数
    handleSizeChange(val){
      this.pageSize = val;
      this.$emit('sizeChange',val)
    },
    //选择页数
    handleCurrentChange(val){
      console.log(val)
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
/deep/ .cell{
            .btns{
                span{
                    color: #655EFF;
                    margin-right: 5px;
                }
            }
        }

</style>
