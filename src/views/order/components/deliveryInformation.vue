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
            <div class="header-lefter-item fb">{{item | deliveryWayFilter}}</div>
            <template v-if="item.deliveryWay == 1">
            <div class="header-lefter-item">快递公司：{{item.shipperName}}</div>
            <div class="header-lefter-item">快递单号：{{item.expressNo}}</div>
            <div @click="showLogistics(item.expressNo, item.shipperName, item.id)" class="header-lefter-item blue pointer">查看物流</div>
            </template>
            <template v-if="item.deliveryWay == 2">
            <div class="header-lefter-item">配送员：{{item.deliveryName}}</div>
            <div class="header-lefter-item">联系方式：{{item.phone}}</div>
            </template>
            <template v-if="item.deliveryWay == 3">
              <!-- 骑手正常接单 -->
              <div v-if="!item.isAbnormal"  :class="textColorObject(item.distributionInfoView)" class="header-lefter-item" >{{item.distributionInfoView | distributionOrderInfoFilter}}</div>
              <!-- 异常订单 -->
              <div v-if="item.isAbnormal" :class="textColorObject(item.distributionInfoView)" class="header-lefter-item" >{{item.distributionInfoView | distributionOrderInfoFilter}}</div>
              <div @click="showDistributorLogistics(item.id)" class="header-lefter-item blue pointer">查看物流</div>
            </template>
           
          </div>
          <div class="header-righter">
            <div class="header-righter-item">{{item.expressNo | goodsStatus(orderDetail)}}</div>
            <div class="header-righter-item">发货人：{{item.sendProductName}}</div>
            <div class="header-righter-item">{{item.goodsList && item.goodsList[0] && item.goodsList[0].createTime && item.goodsList && item.goodsList[0] && item.goodsList[0].createTime}}</div>
            <div @click="showContent(index)">
              <i v-if="item.showContent" class="el-icon-caret-top pointer"></i>
              <i v-if="!item.showContent" class="el-icon-caret-bottom pointer"></i>
            </div>
          </div>
        </div>
        <div v-show="item.showContent" class="content">
          <template v-if="item.deliveryWay == 4">
                  <div class="message">
                    <div class="message-item-list selfLift-message">
                    <div class="message-item">提货信息</div>
                  </div>
                  <div class="message-item-list">
                    <div class="message-item">{{item.receivedName}}</div>
                  </div>
                  <div class="message-item-list">
                      <div class="message-item">{{item.receivedPhone}}</div>
                  </div>
                  </div>
                  <div class="message">
                    <div class="message-item-list selfLift-message">
                    <div class="message-item">自提点信息</div>
                    </div>
                    <div class="message-item-list">
                      <div class="message-item">{{orderDetail.pickUpInfoDto?orderDetail.pickUpInfoDto.pickUpName:''}}</div>
                    </div>
                    <div class="message-item-list">
                      <div class="message-item">{{orderDetail.pickUpInfoDto?orderDetail.pickUpInfoDto.address +' '+ orderDetail.pickUpInfoDto.addressDetail:''}}</div>
                    </div>
                  </div>
                  <div class="message">
                      <div class="message-item-list selfLift-message">
                        <div v-if="item.orderStatus==5" class="message-item">预约提货时间</div>
                        <div v-if="item.orderStatus==6" class="message-item">提货时间</div>
                      </div>
                      <div class="message-item-list pickup-time">
                         <div v-if="item.orderStatus==5" class="message-item">{{item.deliveryDate | formatDateRemoveZero}} {{item.deliveryTime}}</div>
                         <div v-if="item.orderStatus==6" class="message-item">{{item.complateTime}}</div>
                      </div>
                  </div>
          </template>
          <template v-else>
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
          </template>
          <el-table :data="item.goodsList" style="width: 100%" :header-cell-style="{color:'#655EFF', background: 'none', borderBottom: '1px solid #CACFCB', paddingTop: '30px', paddingBottom: '10px'}">
            <el-table-column label="商品" min-width="380">
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
            <el-table-column prop="goodsUnit" align="center" label="单位" min-width="150"></el-table-column>
            <el-table-column prop="sendCount" align="right" min-width="120" label="本次发货数量"></el-table-column>
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
import { sortCreateTime } from "@/utils/base.js";

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
      if(orderDetail.orderInfo.deliveryWay==1){
          let  status= orderDetail.expressNoStatusMap[value]
          if(status == 3) {
            return '【用户签收】'
          } else if(status == 0 || status == 1 || status == 2 || status == 4) {
            return '【商户发货】'
          } else {
            return ''
        }
      }else{
        let orderStatus = orderDetail.orderInfo.orderStatus;
          if(orderStatus ==6){
            return '【用户签收】'
          }else if(orderStatus == 3|| orderStatus ==4 || orderStatus ==5){
            return '【商户发货】'
          }else{
            return ''
          }
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
    deliveryWayFilter(order) {
        switch(order.deliveryWay) {
            case 1:
                return '普通快递'
            case 2:
                return '商家配送'
            case 3:
              if(order.orderStatus==5||order.orderStatus==6){
                  if(order.thirdType==1){
                     return '第三方配送-达达'
                  }else if(!order.thirdType){
                     return "第三方配送"
                  }
                }else{
                    return "第三方配送" 
                }
                break;
            case 4:
                return '上门自提'
        }
    },
    //订单当先状态展示
    distributionOrderInfoFilter(item){
      switch(item.status){
          case 1:
              return '发单中，等待骑手接单'
          case 2://待取货
          case 3://配送中
          case 4://已完成
          case 100://骑士到店
              return `配送员：${item.distributorName} 联系方式：${item.distributorPhone}`
          case 5://取消
              if(item.cancelFrom==1){ //cancelFrom:1达达骑手取消，2商家取消，3系统或者客服取消，0默认值
                  return '异常订单：骑手取消接单，重新发单中'
              }else if(item.cancelFrom ==2){
                  return '异常订单：商家取消订单'
              }else if(item.cancelFrom ==3){
                  return '异常订单：系统或客服取消订单'
              }
          case 7://
              return "异常订单：订单超时"
          case 8://指派单
              return '异常订单：系统重新指派订单'
          case 9:
            return '妥投异常之物品返回中'
          case 10:
            return '异常订单：妥投异常之物品返回完成'
          case 1000:
            return '异常订单：创建达达运单失败'
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
        return "【用户签收】";
      } else if (value.sendTime) {
        return "【商户发货】";
      } else {
        return "";
      }
    },
    cid() {
      let shopInfo = this.$store.getters.shopInfos;
      return shopInfo.id;
    },
    
  },
  methods: {
   
  textColorObject(item){
      return {
        'text-normal':item.status==2||item.status==3||item.status==4||item.status==8||item.status==100,
        'text-warning':item.status==1||item.status==9,
        'text-danger':item.status==5||item.status==7||item.status==10||item.status==1000
      }
    },
    getIsTrace() {
      this._apis.order
        .getIsTrace({ cid: this.cid })
        .then(res => {
          // console.log(res);
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
      let distributionInfoViews= []
      if(this.orderDetail.distributionInfoViews){
           distributionInfoViews= this.orderDetail.distributionInfoViews.map(item=>{
            return{
              createTime:item.createTime,
              distributorName: item.distributorName,
              distributorPhone:item.distributorPhone,
              status:item.status,
              thirdType:item.thirdType,
              cancelFrom:item.cancelFrom
            }
        })
     }
      let arr = [];
      let sendProductsArr = [];
      let objTemp={}
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
                sendProductName:this.orderDetail.orderOperationRecordList.find(item=>item.operationType==5) && this.orderDetail.orderOperationRecordList.find(item=>item.operationType==5).createUserName||'',
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
                sendPhone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendPhone || '',
                orderStatus: this.orderDetail.orderInfo.orderStatus,
                deliveryDate:this.orderDetail.orderInfo.deliveryDate,
                deliveryTime:this.orderDetail.orderInfo.deliveryTime,
                complateTime:this.orderDetail.orderInfo.complateTime,
                isAbnormal:!!this.orderDetail.orderInfo.isAbnormal,
                distributionInfoView:distributionInfoViews.length>0?sortCreateTime(distributionInfoViews).reverse()[0]:{},
                thirdType:this.orderDetail.orderInfo.thirdType

              }
            );
            arr.push(obj);
            Array.from(this.orderDetail.orderSendItemMap[i]).forEach(item=>{
              if(item.sendReceivedAddressId){
                  if(!objTemp[item.sendReceivedAddressId]){
                      objTemp[item.sendReceivedAddressId]={sendReceivedAddressId:item.sendReceivedAddressId,datas:[]}
                      sendProductsArr.push(objTemp[item.sendReceivedAddressId])
                   }
                objTemp[item.sendReceivedAddressId].datas.push(item)
              }
            }) 
            
            // let obj = Object.assign(
            //   {},
            //   {
            //     goodsList: this.orderDetail.orderSendItemMap[i],
            //     expressNo: i,
            //     shipperName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].expressCompany || '',
            //     showContent: true,
            //     sendRemark: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].sendRemark || '',
            //     sendName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendName || '',
            //     sendProductName:this.orderDetail.orderOperationRecordList.find(item=>item.operationType==5) && this.orderDetail.orderOperationRecordList.find(item=>item.operationType==5).createUserName||'',
            //     id: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].orderId || '',
            //     createTime: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].createTime || '',
            //     deliveryWay: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].deliveryWay || '',
            //     deliveryName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].distributorName || '',
            //     phone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].distributorPhone || '',
            //     receiveAddress: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receiveAddress || '',
            //     receivedDetail: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedDetail || '',
            //     sendAddress: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendAddress || '',
            //     sendDetail: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendDetail || '',
            //     receivedName: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedName || '',
            //     receivedPhone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).receivedPhone || '',
            //     sendPhone: this.orderDetail.orderSendItemMap[i] && this.orderDetail.orderSendItemMap[i][0] && this.orderDetail.orderSendItemMap[i][0].address && JSON.parse(this.orderDetail.orderSendItemMap[i][0].address).sendPhone || '',
            //     orderStatus: this.orderDetail.orderInfo.orderStatus,
            //     deliveryDate:this.orderDetail.orderInfo.deliveryDate,
            //     deliveryTime:this.orderDetail.orderInfo.deliveryTime,
            //     complateTime:this.orderDetail.orderInfo.complateTime
            //   }
            // );
            // arr.push(obj);
          }
        }
      }
    if(sendProductsArr.length>0){
      arr = [];
    
    // let arr = sortCreateTime(distributionInfoViews)
      sendProductsArr.forEach((item,index)=>{
        let obj = Object.assign(
              {},
              {
                goodsList:item.datas||[],
                expressNo:JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).expressNo,
                shipperName:item.datas[0]&&item.datas[0].expressCompany || '',
                showContent: true,
                sendRemark:item.datas[0]&&item.datas[0].sendRemark||'',
                sendName:JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).sendName || '',
                sendProductName:this.orderDetail.orderInfo.sendType==2
                    ?(this.orderDetail.orderOperationRecordList.find(item=>item.operationType==4) && this.orderDetail.orderOperationRecordList.find(item=>item.operationType==4).createUserName||'')
                    :(this.orderDetail.orderOperationRecordList.find(item=>(item.operationType==5||item.operationType==14))&& this.orderDetail.orderOperationRecordList.find(item=>(item.operationType==5||item.operationType==14)).createUserName||''),
                id:item.datas[0]&&item.datas[0].orderId || '',
                createTime: item.datas[0]&&item.datas[0]&&item.datas[0].createTime || '',
                deliveryWay: item.datas[0]&&item.datas[0].deliveryWay || '',
                deliveryName:item.datas[0]&&item.datas[0].distributorName || '',
                phone: item.datas[0]&&item.datas[0].distributorPhone || '',
                receiveAddress:JSON.parse(item.datas[0].address)&& JSON.parse(item.datas[0].address).receiveAddress || '',
                receivedDetail: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).receivedDetail || '',
                sendAddress: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).sendAddress || '',
                sendDetail: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).sendDetail || '',
                receivedName: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).receivedName || '',
                receivedPhone: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).receivedPhone || '',
                sendPhone: JSON.parse(item.datas[0].address)&&JSON.parse(item.datas[0].address).sendPhone || '',
                orderStatus: this.orderDetail.orderInfo.orderStatus,
                deliveryDate:this.orderDetail.orderInfo.deliveryDate,
                deliveryTime:this.orderDetail.orderInfo.deliveryTime,
                complateTime:this.orderDetail.orderInfo.complateTime,
                isAbnormal:!!this.orderDetail.orderInfo.isAbnormal,//isAbnormal:是否是异常单：0否1是
                distributionInfoView:distributionInfoViews.length>0?sortCreateTime(distributionInfoViews).reverse()[0]:{},
                thirdType:this.orderDetail.orderInfo.thirdType
              }
              );
            arr.push(obj)
      })
    }
    // arr.sort((a, b) => {
    //     const thisTimeA = a.createTime.replace(/-/g, '/')
    //     const thisTimeB = b.createTime.replace(/-/g, '/')
    //     let timeA = new Date(thisTimeA).getTime()
    //     let timeB = new Date(thisTimeB).getTime()

    //     if(timeA > timeB) {
    //       return 1
    //     } else if(timeA < timeB) {
    //       return -1
    //     } else if(timeA == timeB) {
    //       return 0
    //     } 
    //   })
    //   this.orderSendItems = arr;

      this.orderSendItems = sortCreateTime(arr);
    },
    showLogistics(expressNo, expressCompanys, id) {
      if (this.isTrace == 0) {// 未开启物流轨迹
        this.currentDialog = "LogisticsDialog";
        this.currentData = {
            traces: [],
            deliveryWay:this.orderDetail.orderInfo.deliveryWay,
            thirdType:this.orderDetail.orderInfo.thirdType
                    }
        this.reject = true;
        this.expressNo = expressNo
        this.expressCompanys = expressCompanys
        this.dialogVisible = true;
      } else {  //开启
        this.reject = false;
        this.expressNo = expressNo
        this._apis.order
          .orderLogistics({ expressNo, id: id, isOrderAfter: 0 })
          .then(res => {
            this.currentDialog = "LogisticsDialog";
            this.currentData = {
                    traces:res.traces || [],
                    deliveryWay:this.orderDetail.orderInfo.deliveryWay ,
                    thirdType:this.orderDetail.orderInfo.thirdType
                    };
            this.expressCompanys = res.shipperName
            this.dialogVisible = true;
          })
          .catch(error => {

          });
      }
    },
    showDistributorLogistics(id){
        this._apis.order
          .getDistributorTrack({cid: this.cid,orderInfoId: id})
          .then(res => {
            let newDatas= {
               traces:res ||[],
               deliveryWay:this.orderDetail.orderInfo.deliveryWay,
               thirdType:this.orderDetail.orderInfo.thirdType
            }
            this.currentDialog = "LogisticsDialog";
            this.currentData = newDatas || {}
            this.dialogVisible = true;
          })
          .catch(error => {
            // debugger
           this.$message.error(error);
          });
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
<style lang="scss">
  
</style>
<style lang="scss" scoped>
.fb{
  font-weight: 500;
  font-family:PingFangSC-Medium,PingFang SC;
}
.delivery-information {
    .text-normal{
      color:#44434B;
    }
    .text-warning{
      color:#FD932B;
    }
    .text-danger{
      color:#FD4C2B;
    }
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
  .selfLift-message{
    width:90px !important;
  }
  .pickup-time{
    width:auto !important;
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

