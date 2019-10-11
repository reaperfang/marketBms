<template>
  <div class="electronic-face-sheet">
    <section class="search">
      <p class="title">
        电子面单 
        <i class="el-icon-warning" v-popover:popover></i>
        <el-popover
              ref="popover"
              placement="right"
              width="400"
              v-model="popVisible"
              trigger="hover"
          >
              <p class="p_title">说明：</p>
              <p>电子面单服务和物流轨迹查询服务是与第三方快递鸟合作，开启服务需注册快递鸟会员，相关费用直接与快递鸟结算。</p>
              <p>目前快递鸟电子面单仅支持以下快递公司：顺丰速运、EMS、宅急送、圆通速递、百世快递、中通快递、韵达速递、申通快递、德邦快递、优速快递、京东快递、信丰物流、安能快递、国通快递、天天快递、跨越速运、邮政快递包裹、中铁快运、邮政国内标快、远成快运、全一快递、速尔快递、品骏快递。</p>
          </el-popover>
      </p>
      <el-form :inline="true" :model="formInline" class="form-inline">
        <div class="row justify-between">
          <div class="col">
            <el-form-item label="电子面单名称">
              <el-input v-model="listQuery.name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="创建时间">
              <el-date-picker
                v-model="listQuery.time"
                type="datetimerange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['00:00:00', '23:59:59']"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="col">
            <el-form-item>
              <span @click="resetForm('formInline')" class="orange resetting pointer">重置</span>
              <el-button type="primary" @click="onSubmit">搜 索</el-button>
            </el-form-item>
          </div>
        </div>
        <div>
          <el-button v-permission="['订单', '电子面单', '默认页', '新建']" @click="$router.push('/order/newElectronicFaceSheet')" class="border-button">新建</el-button>
        </div>
      </el-form>
    </section>
    <section class="table-box">
      <div class="table-title">
        全部
        <span>{{total}}</span>项
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        >
          <el-table-column prop="name" label="电子面单名称" width="180"></el-table-column>
          <el-table-column prop="expressCompany" label="快递公司" width="180"></el-table-column>
          <el-table-column prop="updateTime" sortable label="编辑时间"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <div class="operate-box">
                <span v-permission="['订单', '电子面单', '默认页', '查看']" @click="$router.push('/order/newElectronicFaceSheet?id=' + scope.row.id + '&expressCompanyCode=' + scope.row.expressCompanyCode + '&detail=' + true)">查看</span>
                <span v-permission="['订单', '电子面单', '默认页', '修改']" @click="$router.push('/order/newElectronicFaceSheet?id=' + scope.row.id + '&expressCompanyCode=' + scope.row.expressCompanyCode)">修改</span>
                <span v-permission="['订单', '电子面单', '默认页', '删除']" @click="deleteElectronicFaceSheet(scope.row)">删除</span>
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
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import utils from "@/utils";

export default {
  data() {
    return {
      formInline: {
        name: "",
        time: ""
      },
      total: 0,
      tableData: [],
      listQuery: {
        startIndex: 1,
        pageSize: 20,
        time: '',
        name: '',
        startTime: '',
        endTime: ''
      },
      loading: false,
      popVisible: false
    };
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
          this.listQuery = Object.assign({}, this.listQuery, {
            time: '',
            name: '',
            startTime: '',
            endTime: ''
          })
      },
    deleteElectronicFaceSheet(row) {
      this.confirm({title: '提示', text: '删除后无法撤销，确定删除吗？'}).then(() => {
          this._apis.order.deleteElectronicFaceSheet({id: row.id, expressCompanyCode: row.expressCompanyCode}).then((res) => {
              this.getList()
              this.$notify({
                  title: '成功',
                  message: '删除成功！',
                  type: 'success'
              });
          }).catch(error => {
              this.visible = false
              this.$notify.error({
                  title: '错误',
                  message: error
              });
          })
      })
    },
    onSubmit() {
      this.getList()
    },
    getList() {
      this.loading = true
      this._apis.order
        .fetchElectronicFaceSheetList(Object.assign({}, this.listQuery, {
          startTime: this.listQuery.time ? utils.formatDate(this.listQuery.time[0], "yyyy-MM-dd hh:mm:ss") : '',
          endTime: this.listQuery.time ? utils.formatDate(this.listQuery.time[1], "yyyy-MM-dd hh:mm:ss") : '',
        }))
        .then(res => {
          this.total = +res.total
          this.tableData = res.list
          this.loading = false
        })
        .catch(error => {
          this.visible = false;
          // this.$notify.error({
          //   title: "错误",
          //   message: error
          // });
          this.loading = false
        });
    }
  },
  components: {
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.electronic-face-sheet {
  section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    .title {
      font-size: 16px;
      margin-bottom: 10px;
    }
    &.search {
      .resetting {
        margin-right: 7px;
      }
    }
  }
}
/deep/ .el-icon-warning:before {
  color: $grayColor;
}
</style>


