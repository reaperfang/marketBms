<template>
  <div class="electronic-face-sheet">
    <section class="search">
      <!-- <p class="title">
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
      </p> -->
      <el-form :inline="true" :model="formInline" class="form-inline input_style">
        <div class="row justify-between">
          <div class="col">
            <el-form-item label="电子面单名称">
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
          </div>
          <!-- <div class="col">
            <el-form-item>
              <el-button type="primary" @click="onSubmit">搜索</el-button>
              <el-button class="border-button" @click="resetForm('formInline')">重置</el-button>
            </el-form-item>
          </div> -->
        </div>
        <div>
          <el-form-item>
            <el-button type="primary" @click="onSubmit" v-permission="['设置','普通快递','电子面单', '查询']">查询</el-button>
            <el-button class="border-button" @click="resetForm('formInline')">重置</el-button>
          </el-form-item>
        </div>
        <!-- <div>
          <el-button v-permission="['设置', '普通快递', '电子面单', '新建']" @click="$router.push('/order/newElectronicFaceSheet')" class="border-button">新建</el-button>
        </div> -->
      </el-form>
    </section>
    <section class="table-box">
      <div class="content-header">
          <div class="table-title">
            全部
            <span>{{total}}</span>项
          </div>
          <el-button  v-if="!authHide" v-permission="['设置', '普通快递','电子面单', '新建']" @click="$router.push('/set/newElectronicFaceSheet')" class="border-button">新建</el-button>
      </div>
      <div class="table">
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{background:'rgba(208, 214, 228, .2)', color:'#44434B', fontSize: '14px', fontWeight: '500'}"
        >
          <el-table-column prop="name" label="电子面单名称" min-width="180" fixed="left" class-name="table-padding"></el-table-column>
          <el-table-column prop="expressCompany" label="快递公司" min-width="160" align="center"></el-table-column>
          <el-table-column prop="updateTime" sortable label="编辑时间" min-width="160" align="center"></el-table-column>
          <el-table-column label="操作" :width="operationColumnW" fixed="right" header-align="center" class-name="table-padding">
            <template slot-scope="scope">
              <div class="operate-box table-operate">
                <span class="table-btn" v-permission="['设置', '普通快递', '电子面单', '查看']" @click="$router.push('/set/newElectronicFaceSheet?id=' + scope.row.id + '&expressCompanyCode=' + scope.row.expressCompanyCode + '&detail=' + true)">查看</span>
                <span class="table-btn"  v-if="!authHide" v-permission="['设置', '普通快递', '电子面单', '编辑']" @click="$router.push('/set/newElectronicFaceSheet?id=' + scope.row.id + '&expressCompanyCode=' + scope.row.expressCompanyCode)">编辑</span>
                <span class="table-btn table-warning" v-if="!authHide"  v-permission="['设置', '普通快递', '电子面单', '删除']" @click="deleteElectronicFaceSheet(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="margin-top: 10px;"
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
import anotherAuth from '@/mixins/anotherAuth'

export default {
  mixins: [anotherAuth],
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
      popVisible: false,
      operationColumnW: 72 //操作列宽度
    };
  },
  watch: {
    'tableData': {
        handler(newVal, oldVal) { //计算操作栏宽度
            this.$nextTick(() => {
                this.operationColumnW = this.utils.getOperationColumnW();
            })
        },
        deep: true
    }
  },
  created() {
    this.getList();
  },
  methods: {
    resetForm(formName) {
          this.listQuery = Object.assign({}, this.listQuery, {
            startIndex: 1,
            pageSize: 20,
            time: '',
            name: '',
            startTime: '',
            endTime: ''
          })
          this.getList()
      },
    deleteElectronicFaceSheet(row) {
      this.confirm({text: '删除后无法撤销，确定删除吗？'}).then(() => {
          this._apis.order.deleteElectronicFaceSheet({id: row.id, expressCompanyCode: row.expressCompanyCode}).then((res) => {
              this.getList()
              this.$message.success('删除成功！');
          }).catch(error => {
              this.visible = false
              this.$message.error(error);
          })
      })
    },
    onSubmit() {
      this.listQuery = Object.assign({}, this.listQuery, {
          startIndex: 1,
          pageSize: 20,
      })
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
          if(res == null) {
            res = {
              total: 0,
              list: []
            }
          }
          this.total = +res.total
          this.tableData = res.list
          this.loading = false
        })
        .catch(error => {
          console.error(error)
          this.visible = false;
          // this.$message.error(error);
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
.electronic-face-sheet {
  section {
    background-color: #fff;
    padding: 25px 20px 0 20px;
    .title {
      font-size: 16px;
      margin-bottom: 10px;
    }
    &.search {
      margin-bottom: 20px;
      .resetting {
        margin-right: 7px;
      }
    }
  }
}
/deep/ .el-icon-warning:before {
  color: $grayColor;
}
.table-box {
  padding-bottom: 20px !important;
}
.table-box .table {
    margin-left: 0;
    /deep/ th.is-leaf {
      border:0;
    }
}
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
/deep/ input:-ms-input-placeholder{
  color:#92929B;
}
</style>


