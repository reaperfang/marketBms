/* 选择优惠券弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择优惠券'" @submit="submit">
    <div class="select_dialog">
      <div class="head-wrapper">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :inline="true">
          <el-form-item label="优惠券状态" prop="status">
            <el-select label="优惠券状态" v-model="ruleForm.status" placeholder="请选择优惠券状态">
              <el-option label="全部" :value="''"></el-option>
              <el-option label="未生效" :value="0"></el-option>
              <el-option label="生效中" :value="1"></el-option>
              <!-- <el-option label="已失效" :value="2"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券名称" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入优惠券名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button @click="refresh">刷 新</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData" stripe ref="multipleTable" @selection-change="handleSelectionChange" v-loading="loading" :row-key="getRowKey">
          <el-table-column
            type="selection"
            :selectable="itemSelectable"
            :reserve-selection="true"
            width="55">
          </el-table-column>
          <el-table-column prop="name" label="优惠券名称"></el-table-column>
          <el-table-column prop="goodsType" label="适用商品">
            <template slot-scope="scope">
              {{scope.row.goodsType === 0 ? '全部' : '指定商品'}} 
            </template>
          </el-table-column>  <!-- 0是全部  1是指定商品 -->
          <el-table-column prop="" label="优惠内容">
            <template slot-scope="scope">
              <span v-if="scope.row.useCondition > -1">满{{scope.row.useCondition}},减{{scope.row.useTypeFullcut}}</span>
              <span v-else>减{{scope.row.useTypeFullcut}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="receiveLimitCount" label="领取人限制"></el-table-column> -->
          <el-table-column prop="receiveLimitCount" label="限领次数">
            <template slot-scope="scope">
              {{scope.row.receiveLimitCount >-1 ? scope.row.receiveLimitCount : '无限制'}}
            </template>
          </el-table-column>
          <el-table-column prop="remainStock" label="剩余库存"></el-table-column>
          <el-table-column prop="status" label="状态">  <!-- 0是未生效  1是生效中 2是已失效-->
            <template slot-scope="scope">
              <span v-if="scope.row.status === 0">未生效</span>
              <span v-else-if="scope.row.status === 1">生效中</span>
              <span v-else-if="scope.row.status === 2">已失效</span>
            </template>
          </el-table-column>
          <div slot="empty" class="table_empty">
            <img src="../../../assets/images/table_empty.png" alt="">
            <div class="tips">暂无数据<span @click="utils.addNewApply('/application/promotion/addCoupon', 3)">去创建？</span><i>创建后，请回到此页面选择数据</i></div>
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
import mixinSelectDialogs from '../mixins/mixinSelectDialogs';
import utils from "@/utils";
export default {
  name: "dialogSelectCoupon",
  mixins: [mixinSelectDialogs],
  data() {
    return {
      ruleForm: {
        pageNum: 1,
        name: '',
        couponType: 0,
        status: ''
      },
      disableStatus: [2]  //不可选状态值
    };
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getCouponList(this.ruleForm).then((response)=>{
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