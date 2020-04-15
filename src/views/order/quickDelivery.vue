<template>
  <div class="quick-delivery">
    <section class="operate">
      <div class="row justify-between operate-top">
        <div class="col">当前订单运费计费方式选择为</div>
        <div class="col">
          <span>您可以到交易设置中</span>
          <span class="change-mode pointer" @click="$router.push('/set/tradeSet')">更改订单运费计费方式</span>
        </div>
      </div>
      <div class="radio-box">
        <el-radio :disabled="mode == 1" v-model="mode" :label="0">组合运费（推荐）</el-radio>
        <el-radio :disabled="mode == 0" v-model="mode" :label="1">按商品累加运费</el-radio>
        <span
          @click="currentDialog = 'FreightRulesDialog'; dialogVisible = true"
          class="blue pointer"
        >计费规则说明</span>
      </div>
      <!-- <el-button
        v-permission="['订单', '快递发货', '默认页面', '新建模板']"
        @click="$router.push('/order/newTemplate?mode=new')"
        class="border-button new-template"
      >新建模板</el-button> -->
    </section>
    <section class="search">
      <el-form ref="inline" :inline="true" :model="listQuery" class="form-inline">
        <div class="row justify-between">
          <div class="col">
            <el-form-item label="模板名称">
              <el-input v-model="listQuery.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="编辑时间">
              <el-date-picker
                v-model="listQuery.time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="utils.globalTimePickerOption.call(this)"
              ></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
              <el-button class="border-button" @click="resetForm('inline')">重置</el-button>
            </el-form-item>
          </div>
          <!-- <div class="col">
            <el-form-item>
              <el-button type="primary" @click="getList">搜索</el-button>
              <el-button class="border-button" @click="resetForm('inline')">重置</el-button>
            </el-form-item>
          </div> -->
        </div>
      </el-form>
    </section>
    <section class="table-box">
      <div class="content-header">
          <div class="table-title">
            全部
            <span>{{total}}</span>项
          </div>
          <el-button
            v-permission="['订单', '快递发货', '默认页面', '新建模板']"
            @click="$router.push('/order/newTemplate?mode=new')"
            class="border-button new-template"
          >新建模板</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          empty-text="暂未设置运费模板"
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        >
          <el-table-column prop="name" label="模板名称" width="180"></el-table-column>
          <el-table-column prop="calculationWay" label="计费方式" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.calculationWay | calculationWayFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="productCount" label="应用商品数量"></el-table-column>
          <el-table-column prop="updateTime" sortable label="编辑时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operate-box">
                <span
                  v-permission="['订单', '快递发货', '默认页面', '查看']"
                  @click="$router.push('/order/newTemplate?mode=look&id=' + scope.row.id)"
                >查看</span>
                <span
                  v-permission="['订单', '快递发货', '默认页面', '复制']"
                  @click="$router.push('/order/newTemplate?mode=copy&id=' + scope.row.id)"
                >复制</span>
                <span
                  v-permission="['订单', '快递发货', '默认页面', '修改']"
                  @click="$router.push('/order/newTemplate?mode=change&id=' + scope.row.id)"
                >编辑</span>
                <span
                  v-if="!scope.row.productCount"
                  v-permission="['订单', '快递发货', '默认页面', '删除']"
                  @click="deletequickDelivery(scope.row.id)"
                >删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.startIndex"
          :limit.sync="listQuery.pageSize"
          @pagination="getList"
        />
      </div>
    </section>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible"></component>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import FreightRulesDialog from "@/views/order/dialogs/freightRulesDialog";
import utils from "@/utils";

export default {
  data() {
    return {
      mode: "1",
      formInline: {
        name: "",
        time: ""
      },
      total: 0,
      tableData: [],
      listQuery: {
        startIndex: 1,
        pageSize: 20,
        name: "",
        time: "",
        updateTimeStart: "",
        updateTimeEnd: ""
      },
      currentDialog: "",
      dialogVisible: false,
      loading: false
    };
  },
  created() {
    this.getList();
    this.getShopInfo();
  },
  filters: {
    calculationWayFilter(code) {
      switch (code) {
        case 1:
          return "按件计费";
        case 2:
          return "按重量计费";
        case 3:
          return "按体积计费";
      }
    }
  },
  methods: {
    search() {
        this.listQuery = Object.assign({}, this.listQuery, {
            startIndex: 1,
            pageSize: 20,
        })
        
        this.getList()
    },
    deletequickDelivery(id) {
      this.confirm({
        title: "提示",
        icon: true,
        text: '删除模板后无法撤销，确定删除吗？'
      }).then(() => {
        this._apis.order
          .editorFreightTemplate({
            id,
            deleteFlag: 0
          })
          .then(res => {
            this.$message.success('删除成功！');
            this.getList();
          })
          .catch(error => {
            this.$message.error(error);
          });
      });
    },
    getShopInfo() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));

      this._apis.set
        .getShopInfo({
          id: shopInfo.id
        })
        .then(res => {
          this.mode = res.transportationExpenseType;
        })
        .catch(error => {});
    },
    resetForm(formName) {
      this.listQuery = Object.assign({}, this.listQuery, {
        startIndex: 1,
        pageSize: 20,
        name: "",
        time: "",
        updateTimeStart: "",
        updateTimeEnd: ""
      });
      this.getList()
    },
    getList() {
      this.loading = true;
      this._apis.order
        .fetchTemplatePageList(
          Object.assign({}, this.listQuery, {
            updateTimeStart: this.listQuery.time ? utils.formatDate(this.listQuery.time[0], "yyyy-MM-dd hh:mm:ss") : "",
            updateTimeEnd: this.listQuery.time ? utils.formatDate(this.listQuery.time[1], "yyyy-MM-dd hh:mm:ss") : ""
          })
        )
        .then(res => {
          this.total = +res.total;
          this.tableData = res.list;
          this.loading = false;
        })
        .catch(error => {
          this.visible = false;
          // this.$message.error(error);
          this.loading = false;
        });
    }
  },
  components: {
    Pagination,
    FreightRulesDialog
  }
};
</script>
<style lang="scss" scoped>
.search {
    /deep/ .el-form-item__label {
        padding-right: 8px;
    }
    /deep/ .el-form--inline .el-form-item {
        margin-right: 26px;
        .el-button+.el-button {
            margin-left: 16px;
        }
    }
}
.quick-delivery {
  section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    &.operate {
      .change-mode {
        color: $globalMainColor;
        margin-left: 10px;
      }
      .operate-top {
        margin-bottom: 10px;
      }
      .new-template {
        margin-top: 20px;
      }
    }
    &.search {
      .resetting {
        margin-right: 7px;
      }
    }
  }
}
.table-box .table {
    margin-left: 0;
}
/deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #44434B;
}
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.table-box .table-title {
    margin-bottom: 0;
}
</style>


