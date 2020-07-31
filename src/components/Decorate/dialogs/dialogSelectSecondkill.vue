/* 选择限时秒杀弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择秒杀活动'" @submit="submit">
    <div class="select_dialog">
      <div class="head-wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="65px" :inline="true">
          <el-form-item label="活动状态" prop="status">
            <el-select label="活动状态" v-model="ruleForm.status" placeholder="请选择活动状态">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="未生效" :value="0"></el-option>
              <el-option label="生效中" :value="1"></el-option>
              <!-- <el-option label="已失效" :value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="活动名称" prop="activityName">
            <el-input v-model="ruleForm.activityName" placeholder="请输入活动名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button @click="refresh">刷 新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table
        stripe
        :data="tableData"
        :row-key="getRowKey"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        v-loading="loading">
          <el-table-column
            type="selection"  
            :selectable="itemSelectable"
            :reserve-selection="true"
            width="30">
          </el-table-column>
          <el-table-column prop="activityName" label="活动标题" :width="300">
            <template slot-scope="scope">
              <div class="name_wrapper">
                <img :src="scope.row.goodsImgUrl" alt="失败" />
                <p>{{scope.row.activityName}}</p>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="seckillPrice" label="秒杀价"></el-table-column>
          <el-table-column prop="discount" label="折扣"></el-table-column>
          <el-table-column prop="remainStock" label="剩余库存"></el-table-column> -->
          <el-table-column prop="status" label="状态">  <!-- 0是未生效  1是生效中 2是已失效-->
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">未生效</span>
              <span v-else-if="scope.row.status === 1">生效中</span>
              <span v-else-if="scope.row.status === 2">已失效</span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="活动时间" :width="400">
            <template slot-scope="scope">
              {{scope.row.startTime}} 至 {{scope.row.endTime}}
            </template>
          </el-table-column>
          <div slot="empty" class="table_empty">
            <img src="../../../assets/images/table_empty.png" alt="">
            <div class="tips">暂无数据<span @click="utils.addNewApply('/application/feature/addLimitTimeBuy', 3)">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
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
            >
          </el-pagination>
        </div>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import tableBase from '@/components/TableBase';
import dialogTableSelect from "@/mixins/dialogTableSelect";
import mixinSelectDialogs from '../mixins/mixinSelectDialogs';
import utils from "@/utils";
import { getToken } from '@/system/auth'
export default {
  name: "dialogSelectSecondkill",
  mixins: [mixinSelectDialogs],
  components: {DialogBase},
  data() {
    return {
      ruleForm: {
        pageNum: 1,
        activityName: '',
        status: ''
      },
      disableStatus: [2]  //不可选状态值
    };
  },
 
  methods: {
    fetch(ev, loadAll) {
      this.loading = true;
      this._apis.shop.getSecondkillList(this.ruleForm).then((response)=>{
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
      return row.activityId
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