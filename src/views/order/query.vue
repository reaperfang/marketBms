<template>
  <div class="query">
    <section class="search">
      <el-form :inline="true" :model="listQuery" ref="formInline" class="form-inline">
        <el-form-item label>
          <el-input placeholder="请输入内容" v-model="listQuery.searchValue" class="input-with-select">
            <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
              <el-option label="订单编号" value="code"></el-option>
              <el-option label="商品名称" value="goodsName"></el-option>
              <el-option label="用户昵称" value="memberName"></el-option>
              <el-option label="收货人联系电话" value="receivedPhone"></el-option>
              <el-option label="收货人" value="receivedName"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="订单来源">
          <el-select v-model="listQuery.channelInfoId" placeholder>
            <el-option label="全部" value></el-option>
            <el-option label="小程序" :value="1"></el-option>
            <el-option label="公众号" :value="2"></el-option>
            <el-option label="PC" :value="3"></el-option>
            <el-option label="WAP" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型">
          <el-select v-model="listQuery.orderType" placeholder>
            <el-option label="全部" value></el-option>
            <el-option label="普通订单" :value="0"></el-option>
            <el-option label="拼团订单" :value="1"></el-option>
            <el-option label="优惠套装订单" :value="2"></el-option>
            <el-option label="赠品订单" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="支付方式">
          <el-select v-model="listQuery.payWay" placeholder>
            <el-option label="全部" value></el-option>
            <el-option label="线上支付" :value="1"></el-option>
            <el-option label="货到付款" :value="2"></el-option>
            <el-option label="找人代付" :value="3"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="发货类型">
          <el-select v-model="listQuery.sendType" placeholder>
            <el-option label="全部" value></el-option>
            <el-option label="正常发货" :value="1"></el-option>
            <el-option label="自动发货" :value="2"></el-option>
            <el-option label="优先发货" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="listQuery.orderStatus" placeholder>
            <el-option label="全部" value></el-option>
            <el-option label="待付款" :value="0"></el-option>
            <el-option label="待成团" :value="1"></el-option>
            <el-option label="关闭" :value="2"></el-option>
            <el-option label="待发货" :value="3"></el-option>
            <el-option label="部分发货" :value="4"></el-option>
            <el-option label="待收货" :value="5"></el-option>
            <el-option label="完成" :value="6"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label  class="searchTimeType">
          <el-select class="date-picker-select" v-model="listQuery.searchTimeType" placeholder>
            <el-option label="下单时间" value="createTime"></el-option>
            <el-option label="完成时间" value="complateTime"></el-option>
            <el-option label="发货时间" value="sendTime"></el-option>
          </el-select>
          <el-date-picker
            v-model="listQuery.orderTimeValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="utils.globalTimePickerOption.call(this)"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button class="border-button" @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <!-- <el-button v-permission="['订单', '订单查询', '商城订单', '导出订单']" @click="exportOrders" class="border-button">导出订单</el-button> -->
        <!-- <el-button
           v-permission="['订单', '订单查询', '商城订单', '批量导入发货']"
          class="border-button"
          @click="$router.push('/order/batchImportAndDelivery')"
        >批量导入发货</el-button>
        <el-button v-permission="['订单', '订单查询', '商城订单', '批量发货']" class="border-button" @click="batchSendGoods">批量发货</el-button> -->
        <!-- <el-button v-permission="['订单', '订单查询', '商城订单', '批量补填物流']" class="border-button" @click="batchSupplementaryLogistics">批量补填物流</el-button> -->
        <!-- <p class="explain">当前最多只支持导出1000条数据</p> -->
      </div>
    </section>
    <section>
      <div class="export-header">
        <p class="statistics">
          已选择
          <span>{{checkedLength}}</span>项，全部
          <span>{{total}}</span>项
        </p>
        <el-tooltip class="item" effect="dark" content="当前最多支持导出1000条数据" placement="top">
          <el-button v-permission="['订单', '订单查询', '商城订单', '导出订单']" @click="exportOrders" class="border-button">导出数据</el-button>
        </el-tooltip>
      </div>
      <el-tabs class="tabs" v-model="activeName">
        <el-tab-pane v-permission="['订单', '订单查询', '商城订单']" label="商城订单" name="shop">
          <shop ref="shop" :params="listQuery" @batchSupplementaryLogistics="batchSupplementaryLogistics"></shop>
        </el-tab-pane>
        <!-- <el-tab-pane label="积分商城订单" name="integralShop">
          <integralShop></integralShop>
        </el-tab-pane> -->
      </el-tabs>
    </section>
  </div>
</template>
<script>
import Shop from "./components/shop";
import IntegralShop from "./components/integralShop";
import { fetchOrderList } from "@/api/order";
import appConfig from '@/system/appConfig';
import { search } from './mixins/orderMixin'
import utils from "@/utils";
import anotherAuth from '@/mixins/anotherAuth'

export default {
  mixins: [anotherAuth],
  data() {
    return {
      list: [
        
      ],
      checkedLength: 0,
      checkedList: [],
      total: 0,
      listQuery: {
        searchType: "code",
        searchValue: "",
        code: "", // 订单编号
        goodsName: "", // 商品名称
        memberName: "", // 用户昵称
        receivedPhone: "", // 收货人手机号
        receivedName: "", // 收货人姓名
        channelInfoId: "", // 订单来源
        orderType: "", // 订单类型 1普通订单,2拼团订单,3优惠套装订单,4赠品订单
        payWay: "", // 付款方式:1线上支付,2货到付款,3找人代付
        sendType: "", // 发货类型:1正常发货,2自动发货,3优先发货
        orderStatus: "", // 订单流程状态：0待付款 1待成团 2关闭 3待发货 4部分发货 5待收货 6完成
        searchTimeType: "createTime", // 下单时间: createTime 完成时间: complateTime 发货时间: sendTime
        orderTimeValue: "",
      },
      activeName: "shop"
    };
  },
  created() {
    console.log(this.$route.query.id);
    this._globalEvent.$on("checkedLength", number => {
      this.checkedLength = number;
    });
    this._globalEvent.$on("checkedList", list => {
      this.checkedList = list;
    });
    this._globalEvent.$on("total", number => {
      this.total = number;
    });

    if(this.$route.query.orderStatus) {
          let orderStatus = +this.$route.query.orderStatus

          this.listQuery = Object.assign({}, this.listQuery, {
              orderStatus
          })
      }
  },
  methods: {
    batchSendGoods() {
      if(!this.$refs['shop'].list.filter(val => val.checked).length) {
            this.confirm({title: '提示', icon: true, text: '请选择需要发货的订单'})
            return
        }
        if(this.$refs['shop'].list.filter(val => val.checked).some(val => val.orderStatus != 3 && val.orderStatus != 4)) {
          this.confirm({title: '提示', icon: true, text: '请选择待发货或者部分发货的订单'})
            return
        }
        this.$router.push('/order/orderBulkDelivery?ids=' + this.$refs['shop'].list.filter(val => val.checked).map(val => val.id).join(','))
    },
    batchSupplementaryLogistics() {
      if(!this.$refs['shop'].list.filter(val => val.checked).length) {
          this.confirm({title: '提示', icon: true, text: '请先勾选当前页需要补填物流信息的订单。'})
          return
      }
      if(this.$refs['shop'].list.filter(val => val.checked).filter(val => val.isFillUp != 1).length) {
        this.confirm({title: '提示', icon: true, text: '您勾选的订单包括不能补填物流信息的订单，请重新选择。'})
        return
      }
      this.$router.push('/order/batchSupplementaryLogistics?ids=' + this.$refs['shop'].list.filter(val => val.checked).map(val => val.id).join(','))
    },
    exportOrders() {
        let _params

        if(this.listQuery.orderTimeValue && this.listQuery.orderTimeValue.length) {
                if(this.listQuery.orderTimeValue[0]) {
                    var searchTimeTypeStart = utils.formatDate(this.listQuery.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss")
                }
                if(this.listQuery.orderTimeValue[1]) {
                    var searchTimeTypeEnd = utils.formatDate(this.listQuery.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss")
                }
            }
            _params = Object.assign({}, this.listQuery, {
                [this.listQuery.searchType]: this.listQuery.searchValue,
                [`${this.listQuery.searchTimeType}Start`]: this.listQuery.orderTimeValue ? searchTimeTypeStart : '',
                [`${this.listQuery.searchTimeType}End`]: this.listQuery.orderTimeValue ? searchTimeTypeEnd : '',
                isExport: 0
            })

            if(this.checkedList.length) {
              _params = Object.assign({}, _params, {
                orderIds: this.checkedList.map(val => val.id)
              })
            }

      this._apis.order
        .exportOrders(_params)
        .then(res => {
          let message

          if(res > 1000) {
            this.confirm({title: '提示', icon: true, text: '导出数据量超出1000条，建议分时间段导出。<br />点击确定导出当前筛选下的前1000条数据<br />点击取消请重新筛选'}).then(() => {
                _params = Object.assign({}, _params, {
                  isExport: 1
                })
                this._apis.order
                  .exportOrders(_params)
                  .then(res => {
                    message = this.$message({
                        showClose: true,
                        message: '导出中...'
                      });
                      window.location.href = res
                      message.close()
                  })
                  .catch(error => {
                    this.$message.error(error);
                    message && message.close()
                  });
            })
          } else {
            message = this.$message({
              showClose: true,
              message: '导出中...'
            });
            window.location.href = res
            message && message.close()
          }
        })
        .catch(error => {
          this.$message.error(error);
          message.close()
        });
    },
    onSubmit() {
      this.listQuery = Object.assign({}, this.listQuery, {
        startIndex: 0,
        pageSize: 20
      })
      this.$refs["shop"].getList({
        startIndex: 1,
        pageSize: 20
      });
    },
    resetForm(formName) {
        this.listQuery = {
        searchType: "code",
        searchValue: "",
        code: "",
        goodsName: "",
        memberSn: "",
        receivedPhone: "",
        receivedName: "",
        channelInfoId: "",
        orderType: "",
        payWay: "",
        sendType: "",
        orderStatus: "",
        searchTimeType: "createTime",
        orderTimeValue: "",
        startIndex: 1,
        pageSize: 20,
      }

      this.$refs["shop"].getList(Object.assign({}, this.listQuery, {
        type: 'resetForm'
      }));
    },
  },
  components: {
    Shop,
    IntegralShop
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
.query {
  section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    .statistics {
      color: #e0dee8;
      span {
        color: #45444c;
      }
    }
  }
}
/deep/ .el-input {
  width: auto;
}
.resetting {
  color: #fd932b;
  margin-right: 7px;
}
/deep/ .input-with-select .el-input__inner {
  width: 139px;
}
/deep/ .el-date-editor {
  margin-left: -6px;
  border-radius: 0 0 4px 4px;
}
/deep/ .date-picker-select {
  width: 100px;
}
/deep/ .date-picker-select .el-input__inner {
  border-radius: 4px 0 0 4px;
}
/deep/ .date-picker-select .el-input__inner:focus {
  border-color: #dcdfe6;
}
/deep/ .searchTimeType .el-form-item__content {
        display: flex;
    }
    .explain {
      margin-top: 5px;
      color: #F55858;
      font-size: 12px;
    }
.export-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>

