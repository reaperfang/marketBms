<template>
  <div class="delivery-information">
    <!-- <div class="header">
            <ul>
                <li>· 共计{{typeNumber}}种商品，还有{{typeNumber}}种商品未发货完成 <span @click="currentDialog = 'StatisticsDialog'; dialogVisible = true" class="blue">统计详情</span></li>
                <li>· 已发货{{orderDetail.orderSendItems && orderDetail.orderSendItems.length}}单，还有{{typeNumber}}单未进行收货确认</li>
            </ul>
    </div>-->
    <div class="container">
      <div
        v-show="orderSendItems && orderSendItems.length"
        class="item"
        v-for="(item, index) in orderSendItems"
        :key="index"
      >
        <div class="header">
          <div class="header-lefter">
            <div class="header-lefter-item number">{{index + 1}}</div>
            <div class="header-lefter-item">快递单号：{{item.expressNo}}</div>
            <div @click="showLogistics(item.expressNo, item.shipperName)" class="header-lefter-item blue pointer">查看物流</div>
          </div>
          <div class="header-righter">
            <div class="header-righter-item">{{item.expressNo | goodsStatus(orderDetail)}}</div>
            <div class="header-righter-item">发货人：{{orderDetail.orderSendInfo.sendName}}</div>
            <div class="header-righter-item">{{item.goodsList && item.goodsList[0] && item.goodsList[0].createTime && item.goodsList && item.goodsList[0] && item.goodsList[0].createTime}}</div>
            <div @click="showContent(index)">
              <i v-if="item.showContent" class="el-icon-caret-top pointer"></i>
              <i v-if="!item.showContent" class="el-icon-caret-bottom pointer"></i>
            </div>
          </div>
        </div>
        <div v-show="item.showContent" class="content">
          <el-table :data="item.goodsList" style="width: 100%">
            <el-table-column label="商品" width="300">
              <template slot-scope="scope">
                <div class="goods-detail">
                  <div class="goods-detail-item">
                    <img width="66" :src="scope.row.goodsImage" alt />
                  </div>
                  <div class="goods-detail-item">
                    <p>{{scope.row.goodsName}}</p>
                    <p>{{scope.row.goodsSpces}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="goodsUnit" label="单位" width="300"></el-table-column>
            <el-table-column prop="sendCount" label="本次发货数量"></el-table-column>
          </el-table>
          <div class="remark">备注: {{orderDetail.orderSendInfo.sendRemark}}</div>
        </div>
      </div>
      <Empty v-show="!orderSendItems || (orderSendItems && !orderSendItems.length)"></Empty>
    </div>
    <component
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      v-if="dialogVisible"
      :data="currentData"
      :reject="reject"
      :expressNo="expressNo"
      :expressCompanys="expressCompanys"
    ></component>
  </div>
</template>
<script>
import StatisticsDialog from "@/views/order/dialogs/statisticsDialog";
import LogisticsDialog from "@/views/order/dialogs/logisticsDialog";
import Empty from "@/components/Empty";

export default {
  data() {
    return {
      typeNumber: 3,
      failNumber: 2,
      deliveryNumber: 2,
      unconfirmedNumber: 1,
      items: [],
      currentDialog: "",
      dialogVisible: false,
      currentData: {},
      orderSendItems: [],
      isTrace: 0,
      reject: false,
      expressNo: '',
      expressCompanys: ''
    };
  },
  created() {
    //this.orderSendItems = this.orderDetail.orderSendItems && this.orderDetail.orderSendItems.map(val => ({...val, showContent: true})) || []
    this.getOrderSendItems();
    this.getIsTrace();
  },
  filters: {
    goodsStatus(value, orderDetail) {
      let status = orderDetail.expressNoStatusMap[value]

      if(status == 3) {
        return '【客户签收】'
      } else if(status == 0 || status == 1 || status == 2 || status == 4) {
        return '【商户发货】'
      } else {
        return ''
      }
    }
  },
  watch: {
    orderDetail: {
      deep: true,
      handler() {
        //this.orderSendItems = this.orderDetail.orderSendItems && this.orderDetail.orderSendItems.map(val => ({...val, showContent: true})) || []
        this.getOrderSendItems();
      }
    }
  },
  computed: {
    businessFilter(value) {
      if (value.memberTeceiveGoodsTime) {
        return "【客户签收】";
      } else if (value.sendTime) {
        return "【商户发货】";
      } else {
        return "";
      }
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  methods: {
    getIsTrace() {
      this._apis.order
        .getIsTrace({ cid: this.cid })
        .then(res => {
          console.log(res);
          this.isTrace = res.isTrace;
        })
        .catch(error => {
          // this.$notify.error({
          //   title: "错误",
          //   message: error
          // });
        });
    },
    getOrderSendItems() {
      let arr = [];

      for (let i in this.orderDetail.orderSendItemMap) {
        if (this.orderDetail.orderSendItemMap.hasOwnProperty(i)) {
          let obj = Object.assign(
            {},
            {
              goodsList: this.orderDetail.orderSendItemMap[i],
              expressNo: i,
              showContent: true
            }
          );

          arr.push(obj);
        }
      }

      this.orderSendItems = arr;
    },
    showLogistics(expressNo, expressCompanys) {
      if (this.isTrace == 0) {
        this.currentDialog = "LogisticsDialog";
        this.currentData = [];
        this.reject = true;
        this.expressNo = expressNo
        this.expressCompanys = ''
        this.dialogVisible = true;
      } else {
        this.reject = false;
        this.expressNo = expressNo
        this._apis.order
          .orderLogistics({ expressNo })
          .then(res => {
            this.currentDialog = "LogisticsDialog";
            this.currentData = res.traces;
            this.expressCompanys = res.shipperName
            this.dialogVisible = true;
          })
          .catch(error => {
            // this.$notify.error({
            //   title: "错误",
            //   message: error
            // });
          });
      }
    },
    showContent(index) {
      let _orderSendItems = [...this.orderSendItems];

      _orderSendItems.forEach((val, i) => {
        if (i == index) {
          val.showContent = !val.showContent;
        }
      });

      this.orderSendItems = _orderSendItems;
    }
  },
  props: {
    orderDetail: {
      type: Object,
      default: {
        orderInfo: {},
        orderItems: [],
        orderSendItems: []
      }
    }
  },
  components: {
    StatisticsDialog,
    LogisticsDialog,
    Empty
  }
};
</script>
<style lang="scss" scoped>
.delivery-information {
  .blue {
    color: $globalMainColor;
  }
  .header {
    ul {
      margin-bottom: 10px;
    }
    ul li {
      margin-top: 10px;
    }
  }
  .container {
    .item {
      border-radius: 10px;
      border: 1px solid #cacfcb;
      margin-bottom: 10px;
      .header {
        height: 60px;
        background-color: rgb(243, 244, 244);
        border-radius: 10px;
        padding: 0 20px;
        line-height: 60px;
        display: flex;
        justify-content: space-between;
        .header-lefter {
          display: flex;
          align-items: center;
          .header-lefter-item {
            margin-right: 20px;
          }
          .number {
            width: 20px;
            height: 20px;
            background-color: $globalMainColor;
            line-height: 21px;
            color: #fff;
            text-align: center;
            border-radius: 50%;
          }
        }
        .header-righter {
          display: flex;
          align-items: center;
          .header-righter-item {
            margin-right: 20px;
          }
        }
      }
      .content {
        padding: 20px;
        .goods-detail {
          display: flex;
          align-items: center;
          .goods-detail-item {
            margin-right: 5px;
            p:last-child {
              color: #9fa29f;
            }
          }
        }
        .remark {
          border-top: 1px solid #cacfcb;
          padding-top: 20px;
        }
      }
    }
  }
}
</style>

