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
            <div class="header-lefter-item fb">{{item.deliveryWay | deliveryWayFilter}}</div>
            <template v-if="item.deliveryWay == 1">
            <div class="header-lefter-item">快递公司：{{item.shipperName}}</div>
            <div class="header-lefter-item">快递单号：{{item.expressNo}}</div>
            <div @click="showLogistics(item.expressNo, item.shipperName, item.id)" class="header-lefter-item blue pointer">查看物流</div>
            </template>
            <template v-if="item.deliveryWay == 2">
            <div class="header-lefter-item">配送员：{{item.deliveryName}}</div>
            <div class="header-lefter-item">联系方式：{{item.phone}}</div>
            </template>
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
          <template v-if="item.address"> 
          <div class="message">
            <div class="message-item-list">
              <div class="message-item">收货信息：</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address && item.address.receivedName}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address && item.address.receivedPhone}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address ? 
                item.address.receivedProvinceName + item.address.receivedCityName + item.address.receivedAreaName + item.address.receivedDetail : ''}}</div>
            </div>
          </div>
          <div class="message message2">
            <div class="message-item-list">
              <div class="message-item">发货信息：</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address && item.address.sendName}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address && item.address.sendPhone}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.address ? 
                item.address.sendProvinceName + item.address.sendCityName + item.address.sendAreaName + item.address.sendDetail : ''}}</div>
            </div>
          </div>
          </template>
          <template v-if="!item.address"> 
          <div class="message">
            <div class="message-item-list">
              <div class="message-item">收货信息：</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.receivedName}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.receivedPhone}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.receiveAddress}} {{item.receivedDetail}}</div>
            </div>
          </div>
          <div class="message message2">
            <div class="message-item-list">
              <div class="message-item">发货信息：</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.sendName}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.sendPhone}}</div>
            </div>
            <div class="message-item-list">
              <div class="message-item">{{item.sendAddress}} {{item.sendDetail}}</div>
            </div>
          </div>
          </template> 
          <el-table :data="item.goodsList" style="width: 100%" :header-cell-style="{color:'#655EFF', borderBottom: '1px solid #CACFCB', paddingTop: '30px', paddingBottom: '10px'}">
            <el-table-column label="商品" width="400">
              <template slot-scope="scope">
                <div class="goods-detail">
                  <div class="goods-detail-item">
                    <img width="66" :src="scope.row.goodsImage" alt />
                  </div>
                  <div class="goods-detail-item" style="width:300px;text-align:left;">
                    <p class="ellipsis">{{scope.row.goodsName}}</p>
                    <p class="ellipsis">{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
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
                str += _value[i] + '；'
            }
        }

        str = str.replace(/^(.*)\，$/, '$1')

        return str
    },
    deliveryWayFilter(code) {
        switch(code) {
            case 1:
                return '普通快递'
            case 2:
                return '商家配送'
        }
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
      if(this.orderDetail.orderSendItemMap && Object.keys(this.orderDetail.orderSendItemMap).length){
        for (let i in this.orderDetail.orderSendItemMap) {
          if (this.orderDetail.orderSendItemMap.hasOwnProperty(i)) {
            let obj = Object.assign(
              {},
              {
                goodsList: this.orderDetail.orderSendItemMap[i],
                expressNo: i,
                shipperName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].expressCompany || '',
                showContent: true,
                sendRemark: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].sendRemark || '',
                sendName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendName || '',
                id: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].orderId || '',
                createTime: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].createTime || '',
                deliveryWay: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].deliveryWay || '',
                deliveryName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].distributorName || '',
                phone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].distributorPhone || '',
                receiveAddress: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receiveAddress || '',
                receivedDetail: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedDetail || '',
                sendAddress: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendAddress || '',
                sendDetail: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendDetail || '',
                receivedName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedName || '',
                receivedPhone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedPhone || '',
                sendPhone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendPhone || ''
              }
            );
            arr.push(obj);
          }
        }
      }else{
        for (let i in this.orderDetail.sendItemAndAddress) {
          if (this.orderDetail.sendItemAndAddress.hasOwnProperty(i)) {
            let obj = Object.assign(
              {},
              {
                address: this.orderDetail.sendItemAndAddress[i].address ? JSON.parse(this.orderDetail.sendItemAndAddress[i].address) : '',
                goodsList: this.orderDetail.sendItemAndAddress[i].list,
                expressNo: i,
                shipperName: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].expressCompany || '',
                showContent: true,
                sendRemark: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].sendRemark || '',
                sendName: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].sendName || '',
                id: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].orderId || '',
                createTime: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].createTime || '',
                deliveryWay: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].deliveryWay || '',
                deliveryName: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].distributorName || '',
                phone: this.orderDetail.sendItemAndAddress[i] && this.orderDetail.sendItemAndAddress[i].list[0] && this.orderDetail.sendItemAndAddress[i].list[0].distributorPhone || ''
              
              }
            );
            arr.push(obj);
          }
        }
      }
      
      arr.sort((a, b) => {
        const thisTimeA = a.createTime.replace(/-/g, '/')
        const thisTimeB = b.createTime.replace(/-/g, '/')
        let timeA = new Date(thisTimeA).getTime()
        let timeB = new Date(thisTimeB).getTime()

        if(timeA > timeB) {
          return 1
        } else if(timeA < timeB) {
          return -1
        } else if(timeA == timeB) {
          return 0
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
.fb{
  font-weight: 500;
  font-family:PingFangSC-Medium,PingFang SC;
}
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
        border-radius: 10px 10px 0 0;
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
          padding-top: 20px;
        }
      }
    }
  }
}
/deep/ .el-table::before{
  background-color: #cacfcb;
}
.message {
  font-size:14px;
  color:rgba(68,67,75,1);
  display: flex;
  .message-item-list {
    margin-right: 45px;
    &:first-child {
      margin-right: 14px;
      flex-shrink: 0;
    }
    &:nth-child(2) {
      flex-shrink: 0;
      width: 112px;
    }
    .message-item {
      margin-bottom: 17px;
    }

  }
  &.message2 {
    .message-item-list {
      .message-item {
        margin-bottom: 0;
      }

    }
  }
}
</style>

