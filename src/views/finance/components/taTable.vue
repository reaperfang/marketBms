/* 推客奖励列表 */
<template>
  <div>
    <div class="top_part">
      <el-form ref="ruleForm" :model="ruleForm" :inline="inline">
        <el-form-item label="客户ID">
          <el-input v-model="ruleForm.memberId" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="订单编号">
          <el-input v-model="ruleForm.value2" placeholder="请输入" style="width:226px;"></el-input>
        </el-form-item> -->
        <el-form-item label="奖励方式">
          <el-select v-model="ruleForm.presentType" style="width:200px;">
            <el-option
              v-for="item in rewards"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="时间">
          <el-date-picker
            v-model="times"
            type="datetimerange"
            align="right"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00', '08:00:00']"
            :picker-options="pickerNowDateBefore">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm">重置</el-button>
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="under_part">
      <div class="total">
        <span>全部 <em>{{total}}</em> 项</span>
        <el-button icon="document" @click='exportToExcel()' class="mb10">导出</el-button>
      </div>
      <el-table
      v-loading="loading"
        :data="dataList"
        style="width: 100%"
        :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        @sort-change="sortTable"
        >
        <!-- :default-sort = "{prop: 'createTime', order: 'descending'}" -->
        <el-table-column
          prop="memberId"
          label="客户ID"
          :render-header="renderMemberId">
        </el-table-column>
        <el-table-column
          prop="presentType"
          label="奖励方式">
        </el-table-column>
        <el-table-column
          prop="presentContent"
          label="奖励内容">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          sortable>
        </el-table-column>
      </el-table>
      <div class="page_styles">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.pageNum) || 1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize*1"
          layout="sizes, prev, pager, next"
          :total="total*1">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script type='es6'>
import utils from "@/utils";
import TableBase from "@/components/TableBase";
import financeCons from '@/system/constant/finance'
export default {
  name: "taTable",
  extends: TableBase,
  data() {
    return {
      pickerNowDateBefore: {
        disabledDate: (time) => {
          return time.getTime() > new Date();
        }
      },
      dataList:[],
      total:0,
      inline:true,
      times:[],
      ruleForm:{
        memberId:'',
        presentType:0,
        startTime:'',
        stopTime:'',
        sort:'desc',
        pageSize:10,
        pageNum:1
      },
      loading:true
    };
  },
  watch: {
    times(){
      if(this.times.length != 0){
        this.ruleForm.startTime = utils.formatDate(this.times[0], "yyyy-MM-dd hh:mm:ss")
        this.ruleForm.stopTime = utils.formatDate(this.times[1], "yyyy-MM-dd hh:mm:ss")
      }
    }
  },
  computed:{
    rewards(){
      return financeCons.rewards;
    }
  },
  created() {},
  methods: {
    renderMemberId(){
      return(
        <div style="height:49px;line-height:49px;">
          <span style="font-weight:bold;vertical-align:middle;">客户ID</span>
          <el-popover
            placement="top-start"
            title=""
            width="160"
            trigger="hover"
            content="所有参与超级海报获得奖励的客户ID">
            <i slot="reference" class="el-icon-warning-outline" style="vertical-align:middle;"></i>
          </el-popover>
        </div>
      )
    },
    fetch(){
      this._apis.finance.getListTa(this.ruleForm).then((response)=>{
        this.dataList = response.list
        this.total = response.total || 0
        this.loading = false
      }).catch((error)=>{
        this.loading = false
      })
    },
    onSubmit(){
      this.fetch();
    },
    //排序
    sortTable(column){
      let obj = column
      this.ruleForm.sort = obj.order == 'descending' ? 'desc' : 'asc'
      this.fetch()
    },

    //重置
    resetForm(){
      this.ruleForm = {
        memberId:'',
        presentType:0,
        startTime:'',
        stopTime:'',
        sort:'desc',
        pageNum:1,
        pageSize:10,
      }
      this.times= []
    },
     //当前页码改变
    handleCurrentChange(pIndex=1) {
      this.loading = true
      this.ruleForm.pageNum = pIndex
      this.fetch()
    },
//导出
    exportToExcel(){
      this._apis.finance.exportTa(this.ruleForm).then((response)=>{
        window.location.href = response.url
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.top_part{
  width: 100%;
  background: #fff;
  border-radius: 3px;
  margin-top: 20px;
  padding: 15px 20px;
}
.under_part{
  width: 100%;
  background: #fff;
  margin-top: 20px;
  padding: 15px 20px;
  .total{
    display: flex;
    justify-content: space-between;
    span{
      font-size: 16px;
      color: #B6B5C8;
      em{
        font-style: normal;
        color: #000;
      }
    }
  }
}
.mb10{
  margin-bottom: 10px;
}
</style>

