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
            <div @click="showLogistics(item.expressNo, item.shipperName, item.id)" class="header-lefter-item blue pointer">查看物流</div>
          </div>
          <div class="header-righter">
            <div class="header-righter-item">{{item.expressNo | goodsStatus(orderDetail)}}</div>
            <div class="header-righter-item">发货人：{{item.sendName}}</div>
            <div class="header-righter-item">{{item.goodsList && item.goodsList[0] && item.goodsList[0].createTime && item.goodsList && item.goodsList[0] && item.goodsList[0].createTime}}</div>
            <div @click="showContent(index)">
              <i v-if="item.showContent" class="el-icon-caret-top pointer"></i>
              <i v-if="!item.showContent" class="el-icon-caret-bottom pointer"></i>
            </div>
          </div>
        </div>
        <div v-show="item.showContent" class="content">
          <div class="message">
            <p>收货信息：
              <span class="message-name">{{item.address && item.address.receivedName}}</span>
              <span class="message-phone">{{item.address && item.address.receivedPhone}}</span>
              <span class="message-address">{{item.address ? 
                item.address.receivedProvinceName + item.address.receivedCityName + item.address.receivedAreaName + item.address.receivedDetail : ''}}
              </span>
            </p>
            <p class="message-send">发货信息：
              <span class="message-name">{{item.address && item.address.sendName}}</span>
              <span class="message-phone">{{item.address && item.address.sendPhone}}</span>
              <span class="message-address">{{item.address ? 
                item.address.sendProvinceName + item.address.sendCityName + item.address.sendAreaName + item.address.sendDetail : ''}}
              </span>
            </p>
          </div>
          <el-table :data="item.goodsList" style="width: 100%" :header-cell-style="{color:'#655EFF', borderBottom: '1px solid #CACFCB', paddingTop: '30px', paddingBottom: '10px'}">
            <el-table-column label="商品" width="300">
              <template slot-scope="scope">
                <div class="goods-detail">
                  <div class="goods-detail-item">
                    <img width="66" :src="scope.row.goodsImage" alt />
                  </div>
                  <div class="goods-detail-item">
                    <p>{{scope.row.goodsName}}</p>
                    <p>{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="goodsUnit" label="单位" width="300"></el-table-column>
            <el-table-column prop="sendCount" label="本次发货数量"></el-table-column>
          </el-table>
          <div class="remark">备注: {{item.sendRemark}}</div>
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
        return '【用户签收】'
      } else if(status == 0 || status == 1 || status == 2 || status == 4) {
        return '【商户发货】'
      } else {
        return ''
      }
    },
    goodsSpecsFilter(value) {
        let _value
        if(!value) return ''
        if(typeof value == 'string') {
            _value = JSON.parse(value)
        }
        let str = ''
        for(let i in _value) {
            if(_value.hasOwnProperty(i)) {
                str += i + '：'
                str += _value[i] + '，'
            }
        }

        str = str.replace(/^(.*)\，$/, '$1')

        return str
    },
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
        return "【用户签收】";
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

      this.orderDetail.sendItemAndAddress.forEach((item, index) => {
        for (let i in item) {
          if (item.hasOwnProperty(i)) {
            let obj = Object.assign(
              {},
              {
                address: item[i].address ? JSON.parse(item[i].address) : '',
                goodsList: item[i].list,
                expressNo: i,
                shipperName: item[i] && item[i].list[0] && item[i].list[0].expressCompany || '',
                showContent: true,
                sendRemark: item[i] && item[i].list[0] && item[i].list[0].sendRemark || '',
                sendName: item[i] && item[i].list[0] && item[i].list[0].sendName || '',
                id: item[i] && item[i].list[0] && item[i].list[0].orderId || '',
              }
            );

            arr.push(obj);
          }
        }
      })

      this.orderSendItems = arr;
    },
    showLogistics(expressNo, expressCompanys, id) {
      if (this.isTrace == 0) {
        this.currentDialog = "LogisticsDialog";
        this.currentData = [];
        this.reject = true;
        this.expressNo = expressNo
        this.expressCompanys = expressCompanys
        this.dialogVisible = true;
      } else {
        this.reject = false;
        this.expressNo = expressNo
        this._apis.order
          .orderLogistics({ expressNo, id: id, isOrderAfter: 0 })
          .then(res => {
            this.currentDialog = "LogisticsDialog";
            this.currentData = res.traces || [];
            this.expressCompanys = res.shipperName
            this.dialogVisible = true;
          })
          .catch(error => {

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
        //line-height: 60px;
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
            flex-shrink: 0;
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
.message {
  font-size:14px;
  color:rgba(68,67,75,1);
  p {
    &:first-child {
      margin-bottom: 17px;
    }
    &.message-send {
      padding-bottom: 26px;
      border-bottom: 1px solid #CACFCB;
    }
  }
  span {
    margin-right: 45px;
    &.message-name {
      margin-left: 14px;
    }
  }
}
</style>

