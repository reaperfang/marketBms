<template>
  <div class="bulk-delivery">
    <div class="title">售后单批量发货</div>
    <div class="container">
      <section>
        <div class="title">1. 选择您要进行发货的商品并填写物流信息</div>
        <div class="goods-item" v-for="(item, index) in list" :key="index">
          <div class="item-title">
            <span>商品清单</span>
            <span>售后单编号 {{item.orderAfterSaleSendInfo.orderAfterSaleCode}}</span>
          </div>
          <div class="item-content">
            <div class="row align-center table-title">
              <div class="col" style="width: 660px;">
                <div class="row align-center row-margin">
                  <div class="col">
                    <i @click="changeAll(item)" class="checkbox" :class="{checked: item.checked}"></i>
                  </div>
                  <div class="col" style="width: 380px;">商品</div>
                  <div class="col" style="width: 60px;">应发数量</div>
                  <div class="col">本次发货数量</div>
                </div>
              </div>
              <div class="col">
                <div class="row align-center row-margin">
                  <div class="col" style="width: 180px;">收货信息</div>
                  <div class="col">查看物流</div>
                </div>
              </div>
            </div>
            <div class="row align-center table-container">
              <div class="col" style="width: 660px; flex-shrink: 0;">
                <div
                  class="row align-center row-margin"
                  v-for="(goods, i) in item.itemList"
                  :key="i"
                >
                  <div class="col">
                    <i @click="select(index, i)" class="checkbox" :class="{checked: goods.checked}"></i>
                  </div>
                  <div class="col" style="width: 380px;">
                    <div class="row align-center">
                      <div class="col">
                        <img width="66" :src="goods.goodsImage" alt />
                      </div>
                      <div class="col">
                        <p class="ellipsis" style="width: 200px;">{{goods.goodsName}}</p>
                        <p class="goods-specs">{{goods.goodsSpecs | goodsSpecsFilter}}</p>
                      </div>
                    </div>
                  </div>
                  <div class="col" style="width: 60px;">{{goods.afterSaleCount}}</div>
                  <div class="col">{{goods.afterSaleCount}}</div>
                </div>
              </div>
              <div class="col">
                <div class="row row-margin">
                  <div class="col" style="width: 180px;">
                    <p>收货人: {{item.orderAfterSaleSendInfo.receivedName}}</p>
                    <p>联系电话: {{item.orderAfterSaleSendInfo.receivedPhone}}</p>
                    <p>收货地址: {{item.orderAfterSaleSendInfo.receivedDetail}}</p>
                  </div>
                  <div class="col">
                    <el-form :model="item.orderAfterSaleSendInfo" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="快递公司" prop="expressCompanyCodes">
                            <el-select @change="checkExpress(index)" v-model="item.orderAfterSaleSendInfo.expressCompanyCodes" placeholder="请选择">
                                <el-option :label="item.expressCompany" :value="item.expressCompanyCode" v-for="(item, index) in expressCompanyList" :key="index"></el-option>
                            </el-select>
                            <el-input
                          style="margin-top: 5px;"
                          v-if="item.orderAfterSaleSendInfo.expressCompanyCodes == 'other'"
                          v-model="item.other"
                          placeholder="请输入快递公司名称"
                        ></el-input>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressNos">
                            <el-input :disabled="!item.express" v-model="item.orderAfterSaleSendInfo.expressNos"></el-input>
                        </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="send-goods">
        <div class="container-item">
          <p>2.确认发货信息</p>
          <div class="container-item-content">
            <div class="title">
              <div class="title-list">
                <i class="deliver-icon"></i>
                <span>发货信息</span>
              </div>
              <div @click="changeSendInfo" class="blue pointer">修改发货信息</div>
            </div>
            <div class="content">
              <div class="item">
                <div class="label">发货人</div>
                <div class="value">{{list[0] && list[0].orderAfterSaleSendInfo.sendName}}</div>
              </div>
              <div class="item">
                <div class="label">联系电话</div>
                <div class="value">{{list[0] && list[0].orderAfterSaleSendInfo.sendPhone}}</div>
              </div>
              <div class="item">
                <div class="label">发货信息</div>
                <div class="value">{{list[0] && list[0].orderAfterSaleSendInfo.sendDetail}}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="footer tc">
          <el-button @click="sendGoodsHandler" type="primary">批量发货</el-button>
      </div>
    </div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @submit="onSubmit" :sendGoods="sendGoods" :title="title"></component>
  </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'

export default {
  data() {
    return {
      list: [

      ],
      currentDialog: '',
      dialogVisible: false,
      currentData: '',
      sendGoods: '',
      title: '',
      expressCompanyList: []
    };
  },
  created() {
    this.getDetail();
    this.getExpressCompanyList()
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  methods: {
    checkExpress(index) {
      let expressCompanyCodes
      let expressName

      expressCompanyCodes = this.list[index].orderAfterSaleSendInfo.expressCompanyCodes
      
      if(expressCompanyCodes == 'other') {
        expressName = 'other'
      } else {
        expressName = this.expressCompanyList.find(val => val.expressCompanyCode == expressCompanyCodes).expressCompany
      }

      this._apis.order
        .checkExpress({expressName})
        .then(res => {
          this.list.splice(index, 1, Object.assign({}, this.list[index], {
            express: res
          }))
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    },
    changeAll(item) {
      item.checked = !item.checked;

      if (item.checked) {
        item.itemList.forEach(val => {
          val.checked = true;
        });
      } else {
        item.itemList.forEach(val => {
          val.checked = false;
        });
      }
    },
      sendGoodsHandler() {
          try {
              let params

              if (
                this.list
                  .reduce((total, val) => {
                    return total.concat(val.itemList);
                  }, [])
                  .filter(val => val.checked)
                  .some(val => {
                    if(val.express) {
                      return !val.orderAfterSaleSendInfo.expressNos || /^\s+$/.test(val.orderAfterSaleSendInfo.expressNos)
                    }
                    return false
                  })
              ) {
                this.confirm({ title: "提示", icon: true, text: "快递单号不能为空" });
                return;
              }

            params = {
                orderAfterSaleSendInfoDtoList: this.list.map(item => {
                    let expressCompanys = ''
                    
                    if (item.expressCompanyCodes == "other") {
                      expressCompanys = item.other;
                    } else {
                      if(this.expressCompanyList.find(val => val.expressCompanyCode == item.orderAfterSaleSendInfo.expressCompanyCodes)) {
                        expressCompanys = this.expressCompanyList.find(val => val.expressCompanyCode == item.orderAfterSaleSendInfo.expressCompanyCodes).expressCompany
                    }
                    }

                    return {
                        orderAfterSaleId: item.orderAfterSaleSendInfo.orderAfterSaleId,
                        memberInfoId: item.orderAfterSaleSendInfo.memberInfoId,
                        orderAfterSaleCode: item.orderAfterSaleSendInfo.code,
                        expressCompanys: expressCompanys,
                        expressCompanyCodes: item.orderAfterSaleSendInfo.expressCompanyCodes,
                        expressNos: item.orderAfterSaleSendInfo.expressNos,
                        receivedName: item.orderAfterSaleSendInfo.receivedName,
                        receivedPhone: item.orderAfterSaleSendInfo.receivedPhone,
                        receivedProvinceCode: item.orderAfterSaleSendInfo.receivedProvinceCode,
                        receivedProvinceName: item.orderAfterSaleSendInfo.receivedProvinceName,
                        receivedCityCode: item.orderAfterSaleSendInfo.receivedCityCode,
                        receivedCityName: item.orderAfterSaleSendInfo.receivedCityName,
                        receivedAreaCode: item.orderAfterSaleSendInfo.receivedAreaCode,
                        receivedAreaName: item.orderAfterSaleSendInfo.receivedAreaName,
                        receivedDetail: item.orderAfterSaleSendInfo.receivedDetail,
                        sendName: item.orderAfterSaleSendInfo.sendName,
                        sendPhone: item.orderAfterSaleSendInfo.sendPhone,
                        sendProvinceCode: item.orderAfterSaleSendInfo.sendProvinceCode,
                        sendProvinceName: item.orderAfterSaleSendInfo.sendProvinceName,
                        sendCityCode: item.orderAfterSaleSendInfo.sendCityCode,
                        sendCityName: item.orderAfterSaleSendInfo.sendCityName,
                        sendAreaCode: item.orderAfterSaleSendInfo.sendAreaCode,
                        sendAreaName: item.orderAfterSaleSendInfo.sendAreaName,
                        sendDetail: item.orderAfterSaleSendInfo.sendDetail,
                        remark: item.orderAfterSaleSendInfo.remark 
                    }
                })
            }
            this._apis.order.orderAfterSaleSend(params).then((res) => {
                this.$notify({
                    title: '成功',
                    message: '发货成功',
                    type: 'success'
                });
                this.$router.push('/order/deliverGoodsSuccess?ids=' + this.$route.query.ids + '&type=afterSaleBulkDelivery')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
          }catch(e) {
              console.error(e)
          }
        },
      select(index, i) {
          try {
              let _list = JSON.parse(JSON.stringify(this.list));

              _list[index].itemList[i].checked = !_list[index].itemList[i]
                .checked;

              this.list = _list;

              if (
                this.list[index].itemList.filter(val => val.checked).length ==
                this.list[index].itemList.length
              ) {
                this.list[index].checked = true;
              } else {
                this.list[index].checked = false;
              }
          }catch(e) {

          }
      },
      getExpressCompanyList() {
        this._apis.order.fetchExpressCompanyList().then((res) => {
          res.push({
            expressCompanyCode: "other",
            expressCompany: "其他"
          });
            this.expressCompanyList = res
        }).catch(error => {
            this.visible = false
            this.$notify.error({
                title: '错误',
                message: error
            });
        })
    },
      onSubmit(value) {
          // if(this.isReceived) {
          //       let obj = {}
          //       for(let i in value) {
          //           obj['received' + i] = value[i]
          //       }

          //       this.list.map((val, index) => {
          //           this.list.splice(index, 1, Object.assign({}, this.list[index], obj))
          //       })
          //   } else {
          //        let obj = {}
          //       for(let i in value) {
          //           obj['send' + i] = value[i]
          //       }

          //       this.list.map((val, index) => {
          //           console.log(obj)
          //           let listi = JSON.parse(JSON.stringify(this.list[index]))

          //           listi.orderAfterSaleSendInfo = Object.assign({}, listi.orderAfterSaleSendInfo, obj)
          //           this.list.splice(index, 1, listi)
          //       })
          //   }
          let _list = JSON.parse(JSON.stringify(this.list))

          _list.forEach((val, index) => {
            _list[index].orderAfterSaleSendInfo = Object.assign({}, val.orderAfterSaleSendInfo, value)
          })

          this.list = _list
      },
      changeSendInfo() {
            this.currentDialog = 'ReceiveInformationDialog'
            this.currentData = this.list[0].orderAfterSaleSendInfo
            this.isReceived = false
            this.title = '修改发货信息'
            this.sendGoods = 'send'
            this.dialogVisible = true
        },
    getDetail() {
      this._apis.order
        .orderAfterSaleDetail({
          orderAfterSaleIds: this.$route.query.ids.split(",").map(val => val)
        })
        .then(res => {
          res.forEach(val => {
            val.express = true
            val.other = "";
            val.checked = false;
            val.expressNos = "";
            val.orderAfterSaleSendInfo.expressCompanyCodes = ''
            val.orderAfterSaleSendInfo.expressNos = ''
            val.expressCompanyCodes = "";
              val.itemList.forEach(goods => {
                  goods.checked = false
                  goods.sendCount = "";
              })
          })
          this.list = res;

          this._apis.order
            .fetchOrderAddress({ id: this.cid, cid: this.cid })
            .then(response => {
              this.list.forEach(res => {
                res.orderAfterSaleSendInfo.sendName = response.senderName;
                res.orderAfterSaleSendInfo.sendPhone = response.senderPhone;
                res.orderAfterSaleSendInfo.sendProvinceCode = response.provinceCode;
                res.orderAfterSaleSendInfo.sendProvinceName = response.province;
                res.orderAfterSaleSendInfo.sendCityCode = response.cityCode;
                res.orderAfterSaleSendInfo.sendCityName = response.city;
                res.orderAfterSaleSendInfo.sendAreaCode = response.areaCode;
                res.orderAfterSaleSendInfo.sendAreaName = response.area;
                res.orderAfterSaleSendInfo.sendDetail = response.address;
              });
            })
            .catch(error => {
              this.visible = false;
              this.$notify.error({
                title: "错误",
                message: error
              });
            });
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    }
  },
  components: {
      ReceiveInformationDialog
  }
};
</script>
<style lang="scss" scoped>
.bulk-delivery {
  background-color: #fff;
  padding: 20px;
  color: #333;
  > .title {
    font-size: 16px;
  }
  .container {
    padding-top: 20px;
    padding-left: 60px;
    section {
      &.send-goods {
        .item {
          margin-bottom: 10px;
        }
        .label {
          width: 80px;
          text-align: right;
        }
      }
      .goods-item {
        margin-top: 20px;
        border-radius: 10px;
        border: 1px solid rgba(211, 211, 211, 1);
        .item-title {
          background-color: rgb(243, 244, 244);
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .item-content {
          padding: 20px;
          .checkbox {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(../../assets/images/order/checkbox.png) no-repeat;
          }
          .checkbox.checked {
            display: inline-block;
            width: 20px;
            height: 20px;
            background: url(../../assets/images/order/checkbox-checked.png) no-repeat;
          }
          .row-margin > .col {
            margin-right: 25px;
          }
        }
      }
    }
  }
}
.container-item {
  margin-top: 20px;
  p {
    margin-bottom: 20px;
  }
  .container-item-content {
    border: 1px solid rgb(202, 207, 203);
    border-radius: 5px;
    margin-bottom: 20px;
    .title {
      display: flex;
      justify-content: space-between;
      height: 60px;
      line-height: 60px;
      background-color: rgb(243, 244, 244);
      border-radius: 5px 5px 0 0;
      padding: 0 20px;
      .title-list {
        display: flex;
        align-items: center;
        i {
          width: 22px;
          height: 22px;
          display: inline-block;
          margin-right: 9px;
        }
      }
      .deliver-icon {
        background: url(../../assets/images/order/deliver.png);
      }
      .take-in-icon {
        background: url(../../assets/images/order/take-in-icon.png);
      }
    }
    .content {
      padding: 20px;
      .item {
        display: flex;
        .label {
          margin-right: 20px;
        }
        .value {
          color: #9fa29f;
        }
      }
    }
  }
}
</style>