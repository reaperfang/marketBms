/* 选择满减满折弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择满减满折活动'" @submit="submit">
    <div class="select_dialog">
      <div class="head-wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="65px" :inline="true">
          <el-form-item label="活动名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="活动状态" prop="status">
            <el-select label="活动状态" v-model="ruleForm.status" placeholder="请选择活动状态">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="未生效" :value="0"></el-option>
              <el-option label="生效中" :value="1"></el-option>
              <!-- <el-option label="已失效" :value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label prop="name">
            <el-button type="primary" @click="search">搜 索</el-button>
            <el-button @click="refresh">刷 新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="tableData"
        stripe
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading"
        :row-key="getRowKey"
      >
        <el-table-column type="selection" width="55" :selectable="itemSelectable" :reserve-selection="true"></el-table-column>
        <el-table-column prop="name" label="活动标题" :width="250"></el-table-column>
        <el-table-column prop="status" label="状态" :width="70">  <!-- 0是未生效  1是生效中 2是已失效-->
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">未生效</span>
              <span v-else-if="scope.row.status === 1">生效中</span>
              <span v-else-if="scope.row.status === 2">已失效</span>
            </template>
          </el-table-column>
        <el-table-column prop="activityRule" label="规则" :width="200">
          <template slot-scope="scope">
            <el-popover
              v-if="scope.row.activityRule && scope.row.activityRule.length >=10"
              placement="top-start"
              title="满减满折规则"
              width="400"
              trigger="hover"
              :content="scope.row.activityRule">
              <span slot="reference">{{scope.row.activityRule.substring(0, 10)}}...</span>
            </el-popover>
            <span v-else>
              {{scope.row.activityRule}}
            </span> 
          </template>
        </el-table-column>
        <!-- <el-table-column prop="remainStock" label="剩余库存"></el-table-column> -->
        <!-- 0是未生效  1是生效中 2是已失效-->
        <!-- <el-table-column prop="status" label="活动状态">  
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">未开始</span>
            <span v-else-if="scope.row.status === 1">开始中</span>
            <span v-else-if="scope.row.status === 2">已开始</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="startTime" label="创建时间"></el-table-column>
        <div slot="empty" class="table_empty">
          <img src="../../../assets/images/table_empty.png" alt="">
          <div class="tips">暂无数据<span @click="utils.addNewApply('/application/promotion/addFullreduce', 3)">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
        </div>
      </el-table>
      <div class="multiple_selection" v-if="tableData.length">
        <el-checkbox class="selectAll" @change="selectAll" v-model="selectStatus" :disabled="selectDisabled">全选</el-checkbox>
        <el-button size="mini" @click="clearInvalidData">删除已选失效数据</el-button>
        <el-popover popper-class="icon-info-popover" placement="top" trigger="hover">
          <div>删除已选失效数据的作用：<br/>将已选中，但因商品售罄、活动结束等原因变<br/>为“失效”状态的全部数据取消勾选</div>
          <span class="icon-info" slot="reference"></span>
        </el-popover>
      </div>
      <div class="pagination" v-if="tableData.length">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(ruleForm.pageNum) || 1"
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
import mixinSelectDialogs from '../mixins/mixinSelectDialogs';
import utils from "@/utils";
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectFullReduction",
  mixins: [mixinSelectDialogs],
  data() {
    return {
      ruleForm: {
        pageNum: 1,
        name: '',
        status: ''
        // selectStatus: '0,1'
      },
      disableStatus: [2]  //不可选状态值
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getFullReductionList(this.ruleForm).then((response)=>{
        this.tableData = response.list;
        this.total = response.total;
        this.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    itemSelectable(row, index) {
      if(row.status !== 2) {
        return true;
      }
      row.disabled = true;
    },

    getRowKey(row) {
      return row.id
    },

     /* 删除已选失效数据 */
    clearInvalidData() {
      this.tableData.forEach((row, index) => {
        if(row.status === 2) {  //假数据不允许添加选中状态
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      })
      this.$message.success('清除成功！');
    }

  }
};
</script>

<style lang="scss" scoped>
</style>