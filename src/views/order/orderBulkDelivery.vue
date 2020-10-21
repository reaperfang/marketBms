<template>
  <div class="bulk-delivery mh">
    <div class="title">订单批量发货</div>
    <div class="container">
      <section>
        <div class="title">1. 选择您要进行发货的商品并填写物流信息</div>
        <div class="checkbox-box">
          <i @click="allcheckHandler" class="checkbox" :class="{checked: allchecked, disabledChecked: list[0] && (list[0].deliveryWay == 4 || list[0].deliveryWay == 3)}"></i>商品清单
        </div>
        <div class="goods-item" v-for="(item, index) in list" :key="index">
          <div class="item-title">
            <span v-if="list[0] && (list[0].deliveryWay != 4 && list[0].deliveryWay != 3)">商品清单</span>
            <span>订单编号 {{item.orderCode}}</span>
            <i v-if="list.length > 1" @click="deleteOrder(index)" class="el-icon-delete"></i>
          </div>
          <div class="item-content">
            <div class="row align-center table-title">
              <div class="col table-title-left" style="width: 590px; margin-right: 40px;">
                <div class="row align-center row-margin">
                  <div class="col">
                    <i @click="changeAll(item)" class="checkbox" :class="{checked: item.checked, disabledChecked: list[0] && (list[0].deliveryWay == 4 || list[0].deliveryWay == 3)}"></i>
                  </div>
                  <div class="col table-title-left-goods" style="width: 310px;">商品</div>
                  <div class="col table-title-left-yingfa" style="width: 60px;">应发数量</div>
                  <div class="col table-title-left-benci">本次发货数量</div>
                </div>
              </div>
              <div class="col">
                <div class="row align-center row-margin">
                  <div class="col" style="width: 220px;">{{list[0] && list[0].deliveryWay != 4 ? '收货信息' : '提货信息'}}</div>
                  <div class="col" style="width: 281px; text-align: center;">{{list[0] && list[0].deliveryWay != 4 ? '物流信息' : '提货时间'}}</div>
                </div>
              </div>
            </div>
            <div class="row align-center table-container">
              <div class="col table-container-left" style="width: 590px; flex-shrink: 0;">
                <div
                  class="row align-center row-margin goodsItem"
                  v-for="(goods, i) in item.orderItemList"
                  :key="i"
                >
                  <div class="col">
                    <i @click="select(index, i)" class="checkbox" :class="{checked: goods.checked, disabledChecked: list[0] && (list[0].deliveryWay == 4 || list[0].deliveryWay == 3) || goods.goodsCount - goods.cacheSendCount == 0}"></i>
                  </div>
                  <div class="col goodsItem-left" style="width: 310px;">
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
                  <div class="col send-count" style="width: 60px;">{{goods.goodsCount -goods.cacheSendCount}}</div>
                  <div class="col" style="width: 100px;">
                    <el-input
                      :disabled="item.deliveryWay == 4 || item.deliveryWay == 3 || goods.goodsCount - goods.cacheSendCount == 0"
                      type="number"
                      min="1"
                      @input="inputHandler(index, i)"
                      :max="goods.goodsCount - goods.cacheSendCount"
                      v-model="goods.sendCount"
                      placeholder="请输入"
                    ></el-input>
                    <p v-if="goods.showError" class="error-message">{{goods.errorMessage}}</p>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="row row-margin">
                  <div class="col message-box" style="width: 220px;">
                    <template v-if="list[0] && list[0].deliveryWay != 4">
                      <div>收货人: {{item.receivedName}}</div>
                      <div>联系电话: {{item.receivedPhone}}</div>
                      <div class="message-box-address">
                        <div class="label">收货地址: </div> 
                        <div>{{item.receiveAddress}} {{item.receivedDetail}}</div>
                      </div>
                    </template>
                    <template v-else>
                      <div>提货信息: {{item.receivedName}} {{item.receivedPhone}}</div>
                      <div>自提点名称: {{item.pickUpName}}</div>
                      <div class="message-box-address">
                        <div class="label">提货地址: </div> 
                        <div>{{item.sendAddress}} {{item.sendDetail}}</div>
                      </div>
                    </template>
                  </div>
                  <div class="col">
                    <template v-if="list[0] && (list[0].deliveryWay != 4 && list[0].deliveryWay != 3)">
                      <el-form :model="item" label-width="70px" class="demo-ruleForm" v-if="item.deliveryWay == 1">
                        <el-form-item label="快递公司" prop="expressCompanys" class="expressCompanys">
                          <el-select filterable @change="checkExpress(index)" v-model="item.expressCompanyCodes" placeholder="请选择">
                            <el-option
                              :label="item.expressCompany"
                              :value="item.expressCompanyCode"
                              v-for="(item, index) in expressCompanyList"
                              :key="index"
                            ></el-option>
                          </el-select>
                          <p v-if="item.showErrorExpressCompany" class="error-message">{{item.errorMessageExpressCompany}}</p>
                          <el-input
                            style="margin-top: 5px;"
                            v-if="item.expressCompanyCodes == 'other'"
                            @change="otherInputChange(index)"
                            @input="otherInput(index)"
                            v-model="item.other"
                            placeholder="请输入快递公司名称"
                          ></el-input>
                          <p v-if="item.expressCompanyCodes == 'other' && item.showErrorOther" class="error-message">{{item.errorMessageOther}}</p>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressNos" class="expressNos">
                          <el-input maxlength="20" :disabled="item.express != null" v-model="item.expressNos" :placeholder="item.express != null ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" :title="item.express != null ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" @input="ExpressNosInput(index)"></el-input>
                          <p v-if="item.express == null && item.showErrorExpressNos" class="error-message">{{item.errorMessageExpressNos}}</p>
                        </el-form-item>
                      </el-form>
                      <el-form :model="item" label-width="100px" class="demo-ruleForm" v-if="item.deliveryWay == 2">
                        <el-form-item label="配送时间">
                          <span>{{item.deliveryDate | formatDateRemoveZero}} {{item.deliveryTime}}</span>
                        </el-form-item>
                        <el-form-item class="is-required" label="配送员" prop="distributorValue">
                          <el-select v-model="item.distributorValue" no-data-text="无匹配数据" value-key="id" filterable placeholder="请输入或选择" :ref="'searchSelect'+index" :filter-method="(val)=>{dataFilter(val, index)}" @visible-change="(val)=>{visibleChange(val, index)}" @focus="(val)=>{selectFocus(val, index)}" @blur="(val)=>{selectBlur(val, index)}" @change="(val)=>{selectChange(val, index)}">
                            <el-option
                              v-for="items in distributorList[index]"
                              :key="items.id"
                              :label="items.name"
                              :value="items.name">
                            </el-option>
                          </el-select>
                          <p v-if="item.showErrorDistributorName" class="error-message">{{item.errorMessageDistributorName}}</p>
                        </el-form-item>
                        <el-form-item class="is-required" label="联系方式" prop="phone">
                          <el-input placeholder="请输入配送员手机号码" v-model="item.phone" @blur="(e)=>{distributorPhoneBlur(e, index)}"></el-input>
                          <p v-if="item.showErrorPhone" class="error-message">{{item.errorMessagePhone}}</p>
                        </el-form-item>
                      </el-form>
                    </template>
                    <template v-else>
                      <template v-if="list[0] && list[0].deliveryWay == 4">
                        <p style="width: 285px; text-align: center; margin-top: 29px;">{{(item.deliveryDate ? item.deliveryDate.split(' ')[0] : '') + ' ' + item.deliveryTime}}</p>
                      </template>
                      <template v-else-if="list[0] && list[0].deliveryWay == 3">
                        <p style="width: 285px; text-align: center; margin-top: 29px;">
                          <span style="margin-right: 20px;">配送方式</span>
                          <span>第三方配送</span>
                        </p>
                      </template>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section v-if="list && list[0] && (list[0].deliveryWay != 4)" class="send-goods">
        <div class="container-item">
          <p>2.确认发货信息</p>
          <div class="container-item-content">
            <div class="title">
              <div class="title-list">
                <i class="deliver-icon"></i>
                <span>发货信息</span>
              </div>
              <template v-if="list[0] && list[0].deliveryWay == 3">
                <div class="blue pointer" :class="{disabled: list[0] && list[0].deliveryWay == 3}">修改发货信息</div>
              </template>
              <template v-else>
                <div @click="changeSendInfo" class="blue pointer" :class="{disabled: list[0] && list[0].deliveryWay == 3}">修改发货信息</div>
              </template>
            </div>
            <div class="content">
              <div class="item">
                <div class="label">发货人</div>
                <div class="value">{{list[0] && list[0].sendName}}</div>
              </div>
              <div class="item">
                <div class="label">联系电话</div>
                <div class="value">{{list[0] && list[0].sendPhone}}</div>
              </div>
              <div class="item">
                <div class="label">发货信息</div>
                <div class="value" v-if="list[0]">
                  {{list[0].sendAddress}} {{list[0].sendDetail}}</div>
                <div class="value" v-else>--</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="footer">
        <el-button :loading="sending" @click="sendGoodsHandler" type="primary">批量发货</el-button>
      </div>
    </div>
    <component
      v-if="dialogVisible" 
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      :data="currentData"
      @submit="onSubmit"
      :sendGoods="sendGoods"
      :title="title"
      :ajax="ajax"
      @getDetail="getDetail"
      :orderSendGoodsHander="orderSendGoodsHander"
      :params="params"
      :list="list"
      @cancel="cancel"
    ></component>
  </div>
</template>
<script>
import ReceiveInformationDialog from "@/views/order/dialogs/receiveInformationDialog";
import $ from 'jquery';

import { validatePhone } from "@/utils/validate.js"

import { asyncRouterMap } from '@/router'
import SelectSizeDialog from "@/views/order/dialogs/selectSizeDialog";
import { commonMore, deliveryWay1More, deliveryWay2More } from '@/views/order/mixins/sendGoodsMixin'

export default {
  mixins: [commonMore, deliveryWay1More, deliveryWay2More],
  data() {
    return {
      list: [],
      allchecked: true,
    };
  },
  created() {
    this.getExpressCompanyList();
    this.getDetail();
    this.checkSet()
  },
  methods: {
    allcheckHandler() {
      if(this.list[0].deliveryWay == 4) {
        return
      }
      this.allchecked = !this.allchecked

      let _list = JSON.parse(JSON.stringify(this.list))

      _list.forEach(val => {
        val.checked = this.allchecked;
        val.orderItemList.forEach(goods => {
          if(goods.goodsCount - goods.cacheSendCount != 0) {
            goods.checked = this.allchecked;
          }
        });
      });

      this.list = _list
    },
    //检测是否有配置子帐号的权限
    checkSet(){
        const setConfig = asyncRouterMap.filter(item => item.name === 'set');
        if(setConfig.length == 0){
            this.distributorSet = false;
            return;
        }
        const subaccountManage = setConfig[0].children.filter(item => item.name === 'subaccountManage');
        if(subaccountManage.length == 0){
            this.distributorSet = false;
            return;
        }
        this.distributorSet = true;
    },
    dataFilter(value, index) {
      //这里需要使用input本身的value，且过滤前后空格
      const input = this.$refs['searchSelect'+index][0].$children[0].$refs.input;
      const val = input.value.trim();
      this.list[index].distributorValue = val;
      if (val) {
      this.distributorList[index] = this.distributorListFilter.filter((item) => {
          if (item.name.includes(val) || item.name.toUpperCase().includes(val.toUpperCase())) {
            return true
          }
      })
      } else {
        this.distributorList[index] = this.distributorListFilter;
      }
    },
    otherInput(index) {
      let item = this.list[index]

      if(!item.other) {
        this.list.splice(index, 1, Object.assign({}, this.list[index], {
          showErrorOther: true,
          errorMessageOther: '请输入快递公司名称'
        }))
      } else {
        this.list.splice(index, 1, Object.assign({}, this.list[index], {
          showErrorOther: false,
          errorMessageOther: ''
        }))
      }
    },
    ExpressNosInput(index) {
      let item = this.list[index]

      if(!item.expressCompanyCodes) {
        this.list.splice(index, 1, Object.assign({}, this.list[index], {
          showErrorExpressCompany: true,
          errorMessageExpressCompany: '请选择快递公司'
        }))

        setTimeout(() => {
          this.list.splice(index, 1, Object.assign({}, this.list[index], {
              expressNos: ''
            }))
        }, 500)
      } else {
        if(!this.list[index].expressNos) {
          this.list.splice(index, 1, Object.assign({}, this.list[index], {
            showErrorExpressNos: true,
            errorMessageExpressNos: '请输入快递单号'
          }))
        }else{
          this.list.splice(index, 1, Object.assign({}, this.list[index], {
            showErrorExpressNos: false
          }))
        }
      }
    },
    inputHandler(index, i) {
      let reg = /^[1-9]\d*$/

      if(!this.list[index].orderItemList[i].checked) {
        return
      }

      if(this.list[index].orderItemList[i] == '') {
        this.list[index].orderItemList.splice(i, 1, Object.assign({}, this.list[index].orderItemList[i], {
          errorMessage:  '请输入本次发货数量',
          showError: true
        }))
        return
      }

      setTimeout(() => {
        if(+this.list[index].orderItemList[i].sendCount <= 0 || !reg.test(this.list[index].orderItemList[i].sendCount)) {
          this.list[index].orderItemList.splice(i, 1, Object.assign({}, this.list[index].orderItemList[i], {
            sendCount: '',
          }))
        }

        this.list[index].orderItemList.splice(i, 1, Object.assign({}, this.list[index].orderItemList[i], {
          errorMessage: +this.list[index].orderItemList[i].sendCount <= 0 || !reg.test(this.list[index].orderItemList[i].sendCount) ? '仅支持输入非负的正整数' : '',
          showError: +this.list[index].orderItemList[i].sendCount <= 0 || !reg.test(this.list[index].orderItemList[i].sendCount) ? true : false
        }))
      }, 500)
    },
    otherInputChange(index) {
      if(index != 0) return

      let list = JSON.parse(JSON.stringify(this.list))
      let other = list[0].other

      list.forEach((val, index) => {
        if(index != 0) {
          val.other = other
        }
      })
    },
    deleteOrder(index) {
      this.list.splice(index, 1);
    },
    changeAll(item) {
      if(this.list[0].deliveryWay == 4) {
        return
      }
      item.checked = !item.checked;

      if (item.checked) {
        item.orderItemList.forEach(val => {
          if(val.goodsCount - val.cacheSendCount != 0) {
            val.checked = true;
          }
        });
      } else {
        item.orderItemList.forEach(val => {
          if(val.goodsCount - val.cacheSendCount != 0) {
            val.checked = false;
          }
        });
      }

      let _arr = this.list.reduce((pre, cur) => pre.concat(cur.orderItemList), [])
      
      if(_arr.every(val => val.checked)) {
        this.allchecked = true
      } else {
        this.allchecked = false
      }
    },
    // 订单详情 orderId
    // 电子面单 orderId
    // 配送单 id
    sendGoodsHandler() {
      let reg = /^[1-9]\d*$/

      try {
        let params;
        // console.log(this.list
        //     .reduce((total, val) => {
        //       return total.concat(val.orderItemList);
        //     }, []).filter(val => val.checked))
        if (
          !this.list
            .reduce((total, val) => {
              return total.concat(val.orderItemList);
            }, [])
            .filter(val => val.checked).length
        ) {
          this.confirm({
            title: "提示",
            icon: true,
            text: "请选择您要进行发货的商品"
          });
          return;
        }


        // if (
        //   this.list
        //     .reduce((total, val) => {
        //       return total.concat(val.orderItemList);
        //     }, [])
        //     .filter(val => val.checked)
        //     .some(val => !val.sendCount)
        // ) {
        //   this.confirm({
        //     title: "提示",
        //     icon: true,
        //     text: "本次发货数量不能为空"
        //   });
        //   return;
        // }

        // if (
        //   this.list
        //     .reduce((total, val) => {
        //       return total.concat(val.orderItemList);
        //     }, [])
        //     .filter(val => val.checked)
        //     .some(val => +val.sendCount > val.goodsCount)
        // ) {
        //   this.confirm({
        //     title: "提示",
        //     icon: true,
        //     text: "本次发货数量不能大于应发数量"
        //   });
        //   return;
        // }

        // if (
        //   this.list
        //     .filter(val => val.expressCompanyCodes == "other")
        //     .some(val => !val.other || /^\s+$/.test(val.other))
        // ) {
        //   this.confirm({
        //     title: "提示",
        //     icon: true,
        //     text: "请输入快递公司名称"
        //   });
        //   return;
        // }

        // if (
        //   this.list
        //     .reduce((total, val) => {
        //       return total.concat(val.orderItemList);
        //     }, [])
        //     .filter(val => val.checked)
        //     .some(val => {
        //       if(val.express) {
        //         return !val.expressNos || /^\s+$/.test(val.expressNos)
        //       }
        //       return false
        //     })
        // ) {
        //   this.confirm({ title: "提示", icon: true, text: "快递单号不能为空" });
        //   return;
        // }
        for(let i=0; i<this.list.length; i++) {
          let orderItem = this.list[i].orderItemList

          for(let j=0; j<orderItem.length; j++) {
            if(orderItem[j].checked) {
              if(orderItem[j].goodsCount - orderItem[j].cacheSendCount == 0) {
                continue
              }
              if(orderItem[j].sendCount == '') {
                this.list[i].orderItemList.splice(j, 1, Object.assign({}, this.list[i].orderItemList[j], {
                  errorMessage:  '请输入本次发货数量',
                  showError: true
                }))
                return
              }
              if(orderItem[j].sendCount > (orderItem[j].goodsCount - orderItem[j].cacheSendCount)) {
                this.list[i].orderItemList.splice(j, 1, Object.assign({}, this.list[i].orderItemList[j], {
                  errorMessage:  '本次发货数量不能大于应发数量',
                  showError: true
                }))
                return
              }
              if(!reg.test(orderItem[j].sendCount)) {
                this.list[i].orderItemList.splice(j, 1, Object.assign({}, this.list[i].orderItemList[j], {
                  errorMessage:  '请输入正确的格式',
                  showError: true
                }))
                return
              }
            } else {
              this.list[i].orderItemList.splice(j, 1, Object.assign({}, this.list[i].orderItemList[j], {
                errorMessage:  '',
                showError: false
              }))
            }
          }
        }
         let isWrong = false
        //let _list = JSON.parse(JSON.stringify(this.list.filter(val => val.checked)))
        let _list = [];
        this.list.forEach((item, index) => {
          let orderItemList = item.orderItemList
          //如果当前子级中没有选中的
          let itemChecked = orderItemList.filter(val => val.checked)
          if(itemChecked.length == 0){
            return;
          }
          _list.push(item);
          orderItemList.forEach(goods => {
            //如果不是选中的，则不用验证
            if(!goods.checked){
              return;
            }
            if((goods.goodsCount -goods.cacheSendCount) == 0) {
              //如果应发数量是0则不用验证
              return
            }
            if(!goods.sendCount) {
              isWrong = true
              goods.showError = true
              goods.errorMessage = '请输入本次发货数量'
            }
            if(+goods.sendCount > +goods.goodsCount) {
              isWrong = true
              goods.showError = true
              goods.errorMessage = '本次发货数量不能大于应发数量'
            }
          })
          

          //如果是普通快递，则验证快递公司与快递单号
          if(item.deliveryWay == 1){
            if(item.expressCompanyCodes == 'other') {
              if(!item.other) {
                isWrong = true
                item.showErrorOther = true
                item.errorMessageOther = '请输入快递公司名称'
              } else {
                if(!item.expressNos) {
                  isWrong = true
                  item.showErrorExpressNos = true
                  item.errorMessageExpressNos = '请输入快递单号'
                }
              }
            } else {
              if(!item.expressCompanyCodes) {
                isWrong = true
                item.showErrorExpressCompany = true
                item.errorMessageExpressCompany = '请选择快递公司'
              } else {
                if((item.express == null) && !item.expressNos) {
                  isWrong = true
                  item.showErrorExpressNos = true
                  item.errorMessageExpressNos = '请输入快递单号'
                }
              }
            }
          }

          //如果是商家配送，则验证配送员信息
          if(item.deliveryWay == 2){
            if(item.distributorName == ''){
              isWrong = true;
              item.showErrorDistributorName = true;
            }
            if(item.phone == ''){
              isWrong = true;
              item.showErrorPhone = true;
              item.errorMessagePhone = '请输入手机号码'
            }else if(!validatePhone(item.phone)){
              isWrong = true;
              item.showErrorPhone = true;
              item.errorMessagePhone = '请输入正确的手机号码'
            }
          }

          
        })
        this.list = _list
        console.log(_list)
        if(isWrong) {
          this.$nextTick(() => {
            document.querySelector('.error-message').scrollIntoView()
            let scrollTop = document.querySelector('.content-main').scrollTop

            document.querySelector('.content-main').scrollTop = scrollTop - 40
          })
          return
        }

        // if(true) {
        //   this.confirm({title: '提示', text: '达达账户余额不足，请充值后再发货', confirmText: '去充值'}).then(() => {
              //this.$router.push('/set/recharge')
        //   })
        //   return
        // }

        // if(this.list && this.list[0] && this.list[0].deliveryWay == 1) {
        //   if(!this.shopAddressInfo) {
        //     this.confirm({
        //       title: "提示",
        //       icon: true,
        //       text: "发货信息不能为空"
        //     });
        //     return;
        //   }
        // }

        this.sending = true

        params = {
          sendInfoDtoList: _list.map(item => {
            let expressCompanys = "";
            console.log(this.expressCompanyList);
            if(item.deliveryWay == 1){ //如果为普通快递在对快递单号等进行处理
              if (item.expressCompanyCodes == "other") {
                expressCompanys = item.other;
              } else {
                if (
                  this.expressCompanyList.find(
                    val => val.expressCompanyCode == item.expressCompanyCodes
                  )
                ) {
                  expressCompanys = this.expressCompanyList.find(
                    val => val.expressCompanyCode == item.expressCompanyCodes
                  ).expressCompany;
                }
              }
            }
            
            let obj = {
              orderId: item.orderId,
              memberInfoId: item.memberInfoId,
              orderCode: item.orderCode,
              orderItems: JSON.parse(JSON.stringify(item.orderItemList)).filter(val => val.checked).filter(val => (val.goodsCount - val.cacheSendCount) != 0),
              id: item.id,
              memberSn: item.memberSn,
              receivedName: item.receivedName,
              receivedPhone: item.receivedPhone,
              receivedProvinceCode: item.receivedProvinceCode,
              receivedProvinceName: item.receivedProvinceName,
              receivedCityCode: item.receivedCityCode,
              receivedCityName: item.receivedCityName,
              receivedAreaCode: item.receivedAreaCode,
              receivedAreaName: item.receivedAreaName,
              receiveAddress: item.receiveAddress,
              sendAddress: item.sendAddress,
              receivedDetail: item.receivedDetail,
              sendName: item.sendName,
              sendPhone: item.sendPhone,
              sendProvinceCode: item.sendProvinceCode,
              sendProvinceName: item.sendProvinceName,
              sendCityCode: item.sendCityCode,
              sendCityName: item.sendCityName,
              sendAreaCode: item.sendAreaCode,
              sendAreaName: item.sendAreaName,
              sendDetail: item.sendDetail,
              remark: item.remark
            };
            //如果是普通快递，则添加快递公司与快递单号
            if(item.deliveryWay == 1){
              obj.deliveryWay = 1;
              obj.expressCompanys = expressCompanys;
              obj.expressNos = item.expressNos;
              obj.expressCompanyCodes = item.expressCompanyCodes;
              if(item.express && item.express.specificationSize) {
                obj.specificationSize = item.express.specificationSize
              }
            }
            //如果是商家配送，则添加配送员信息
            if(item.deliveryWay == 2){
              obj.deliveryWay = 2;
              obj.distributorName = item.distributorName;
              //obj.distributorId = item.distributorId;
              obj.distributorPhone = item.phone;
            }
            if(item.deliveryWay == 3) {
              obj.deliveryWay = 3;
              obj.receivedLongitude = item.receivedLongitude || item.receivedLng
              obj.receivedLatitude = item.receivedLatitude || item.receivedLat
            }
            if(item.deliveryWay == 4) {
              obj.deliveryWay = 4;
              obj.verifyCode = item.verifyCode
              obj.pickId = item.pickId
            }
            return obj;
          })
        };
        if(this.list[0] && this.list[0].deliveryWay == 3) {
          params.thirdPartType = 1
        }
        this.params = params
        let _arr = []

        this.list.forEach(item => {
          let pro = this._apis.order.getExpressSpec({ companyCode: item.expressCompanyCodes, cid: this.cid })

          _arr.push(pro)
        })
        this._list = JSON.parse(JSON.stringify(this.list)) 

        Promise.all(_arr).then((values) => {
          // values.forEach((item, index) => {
          //   this._list[index].sizeList = item
          //   if(item && item.length) {
          //     this._list.splice(index, 1)
          //   }
          // })

          for(let index=values.length-1; index>=0; index--) {
            let item = values[index]

            this._list[index].sizeList = item.map(_item => ({
              ..._item,
              sizeSpecs: _item.sizeSpecs + ' ' + _item.templateSize,
              templateSize: `${_item.sizeSpecs} ${_item.templateSize}`
            }))
            // if(item && item.length) {
            //   this._list.splice(index, 1)
            // }
          }
          console.log(this._list)
          this._list = this._list.filter(val => val.express != null && !val.express.sizeSpecs && val.sizeList && val.sizeList.length)

          var __result = [];
          var __obj = {};
            for(var i =0; i<this._list.length; i++){
               if(!__obj[this._list[i].expressCompanyCodes]){
                  __result.push(this._list[i]);
                  __obj[this._list[i].expressCompanyCodes] = true;
              }
            }

          this._list = __result

          if(this.list[0].deliveryWay == 1 && this._list.length) {
            this.currentData = {
              list: this._list,
              expressCompanyList: this.expressCompanyList,
            }
            this.currentDialog = 'SelectSizeDialog'
            this.title = '提示'
            this.dialogVisible = true
          } else {
            this.orderSendGoodsHander(params, _list.length)
          }
        });

        
      } catch (e) {
        console.error(e);
      }
    },
    orderSendGoodsHander(params, _length) {
      if(this.list[0] && this.list[0].deliveryWay == 3) {
        this._apis.order
        .sendGoods3(params)
        .then(res => {
          let successNumber = res.success && +res.success || 0
          let errorNumber = res.error && +res.error || 0

          //this.$message.success(`本次批量发货${successNumber + errorNumber}单，成功${successNumber}单，失败${errorNumber}单`);
          this.$message({
            message: `本次批量发货${successNumber + errorNumber}单，成功${successNumber}单，失败${errorNumber}单`,
            type: 'success',
            duration: 3000
          });
          this.sending = false
          
          let printIds = this.list.filter(val => !val.express).map(val => val.orderId).join(',')

          this.$router.push({
            path: "/order/deliverGoodsSuccess",
            query: {
              ids: this.$route.query._ids,
              orderId: this.$route.query.ids,
              type: "orderBulkDelivery",
              printIds,
              deliveryWay: 3,
              length: _length,
              successNumber: res.success
            }
          });
        })
        .catch(error => {
          if(error && (error.code == 2155)) {
            let successNumber = error.data && error.data.success && +error.data.success || 0
            let errorNumber = error.data && error.data.error && +error.data.error || 0

            //this.$message.success(`本次批量发货${successNumber + errorNumber}单，成功${successNumber}单，失败${errorNumber}单`);
            this.$message({
              message: `本次批量发货${successNumber + errorNumber}单，成功${successNumber}单，失败${errorNumber}单`,
              type: 'success',
              duration: 3000
            });
            this.confirm({text: '达达账户余额不足，请充值后再发货。', confirmText: '去充值'}).then(() => {
                this.$router.push('/set/recharge')
            })
          } else {
            this.$message.error(error);
          }
          this.sending = false
        });
      } else {
        this._apis.order
        .orderSendGoods(params)
        .then(res => {
          this.sending = false
          
          let printIds = this.list.filter(val => !val.express).map(val => val.orderId).join(',')

          this.$router.push({
            path: "/order/deliverGoodsSuccess",
            query: {
              ids: res.success
                .map(val => val.expressParameter.orderSendInfo.id)
                .join(","),
              orderId: res.success
                .map(val => val.expressParameter.orderSendInfo.orderId)
                .join(","),
              type: "orderBulkDelivery",
              printIds
            }
          });
        })
        .catch(error => {
          this.$message.error(error);
          this.sending = false
        });
      }
    },
    select(index, i) {
      if(this.list[0].deliveryWay == 4 || this.list[index].orderItemList[i].goodsCount - this.list[index].orderItemList[i].cacheSendCount == 0) {
        return
      }
      try {
        let _list = JSON.parse(JSON.stringify(this.list));

        _list[index].orderItemList[i].checked = !_list[index].orderItemList[i]
          .checked;

        this.list = _list;

        if (
          this.list[index].orderItemList.filter(val => val.checked).length ==
          this.list[index].orderItemList.length
        ) {
          this.list[index].checked = true;
        } else {
          this.list[index].checked = false;
        }

        let _arr = _list.reduce((pre, cur) => pre.concat(cur.orderItemList), [])
        
        if(_arr.filter(val => val.deliveryWay !=4 && (val.goodsCount - val.cacheSendCount != 0)).every(val => val.checked)) {
          this.allchecked = true
        } else {
          this.allchecked = false
        }
      } catch (e) {}
    },
    onSubmit(value) {
      let _list = JSON.parse(JSON.stringify(this.list));

      _list.forEach((val, index) => {
        _list[index] = Object.assign({}, val, value);
      });

      this.list = _list;
    },
    getDetail(selection, list) {
      this._apis.order
        .orderSendDetail({
          ids: this.$route.query.ids.split(",").map(val => +val)
        })
        .then(res => {
          let _address = res.shopAddressInfo
          
          this.shopAddressInfo = res.shopAddressInfo
          res = res.sendInfoListData

          res.forEach((val, index) => {
            val.express = null
            val.other = "";
            val.checked = true;
            val.expressNos = "";
            val.expressCompanyCodes = "";
            val.orderItemList.forEach(goods => {
              goods.checked = true;
              goods.cacheSendCount = +goods.sendCount
              goods.sendCount = goods.goodsCount - goods.cacheSendCount;
              goods.showError = false
              goods.errorMessage = ''
            });
            val.showErrorExpressCompany = false
            val.errorMessageExpressCompany = ''
            val.showErrorExpressNos = false
            val.errorMessageExpressNos = ''
            val.showErrorOther = false
            val.errorMessageOther = ''
            
            val.distributorValue = '';
            val.distributorName = '';
            val.distributorId = '';
            val.phone = '';
            val.showErrorDistributorName = false;
            val.errorMessageDistributorName = '请输入或选择配送员';
            val.showErrorPhone = false;
            val.errorMessagePhone = '';
            val.pickUpName = '';

            // 回显选中的快递公司
            if(list && list.length) {
              if(list[index].expressCompanyCodes) {
                val.expressCompanyCodes = list[index].expressCompanyCodes

                let expressName = this.expressCompanyList.find(item => item.expressCompanyCode == val.expressCompanyCodes).expressCompany

                this._apis.order
                  .checkExpress({expressName})
                  .then(res => {
                    val.express = res
                  })
              }
              
              // 回显快递单号
              if(list[index].expressNos) {
                val.expressNos = list[index].expressNos
              }
            }

            if(val.deliveryWay == 4) {
              this._apis.order
              .getPickInfo({id: val.pickId})
              .then(res => {
                val.pickUpName = res.pickUpName
              })
              .catch(error => {
                this.visible = false;
                this.$message.error(error);
              });
            }
          });
          // res.forEach(val => {
          //   val.orderItemList.forEach(item => {
          //     item.cacheSendCount = item.sendCount;
          //   });
          // });


          //如果是商家配送，则需要请求拿到配送员列表
          if(res[0].deliveryWay == 2){
            //获取配送员列表
            this.getDistributorList(res.length);
          }
          // this.$store.dispatch('getShopInfo').then(response => {
          //     this.list.forEach(res => {
          //       if(!res.sendAddress) {
          //         res.sendName = response.senderName;
          //         res.sendPhone = response.senderPhone;
          //         res.sendProvinceCode = response.provinceCode;
          //         res.sendProvinceName = response.province;
          //         res.sendCityCode = response.cityCode;
          //         res.sendCityName = response.city;
          //         res.sendAreaCode = response.areaCode;
          //         res.sendAreaName = response.area;
          //         res.sendAddress = response.sendAddress;
          //         res.sendDetail = response.address;
          //       }
          //     });
          //   })
          //   .catch(error => {
          //     this.visible = false;
          //     this.$message.error(error);
          //   });

          // 如果一个订单与发货数据，就付给其他没有的订单
          let _orderItem = res.find(val => val.sendAddress)
          
          res.forEach(item => {
            if(!item.sendAddress) {
              if(item.deliveryWay == 1 || item.deliveryWay == 2 || item.deliveryWay == 3) {
                if(_orderItem) {
                  item.sendName = _orderItem.sendName;
                  item.sendPhone = _orderItem.sendPhone;
                  item.sendProvinceCode = _orderItem.sendProvinceCode;
                  item.sendProvinceName = _orderItem.sendProvinceName;
                  item.sendCityCode = _orderItem.sendCityCode;
                  item.sendCityName = _orderItem.sendCityName;
                  item.sendAreaCode = _orderItem.sendAreaCode;
                  item.sendAreaName = _orderItem.sendAreaName;
                  item.sendAddress = _orderItem.sendAddress;
                  item.sendDetail = _orderItem.sendDetail;
                  item.sendLatitude = _orderItem.sendLatitude;
                  item.sendLongitude = _orderItem.sendLongitude
                }

                if(!_address) {
                  return
                }
                item.sendName = _address.name;
                item.sendPhone = _address.mobile;
                item.sendProvinceCode = _address.provinceCode;
                item.sendProvinceName = _address.provinceName;
                item.sendCityCode = _address.cityCode;
                item.sendCityName = _address.cityName;
                item.sendAreaCode = _address.areaCode;
                item.sendAreaName = _address.areaName;
                item.sendAddress = _address.address;
                item.sendDetail = _address.addressDetail;
                item.sendLatitude = _address.latitude
                item.sendLongitude = _address.longitude
              } else if(item.deliveryWay == 4) {
                this._apis.order
                  .getPickInfo({ id: item.pickId })
                  .then(_res => {
                    item.sendName = _res.name;
                    item.sendPhone = _res.mobile;
                    item.sendProvinceCode = _res.provinceCode;
                    item.sendProvinceName = _res.provinceName;
                    item.sendCityCode = _res.cityCode;
                    item.sendCityName = _res.cityName;
                    item.sendAreaCode = _res.areaCode;
                    item.sendAreaName = _res.areaName;
                    item.sendAddress = _res.address;
                    item.sendDetail = _res.addressDetail;
                  })
                  .catch(error => {
                    this.$message.error(error);
                  });
              }
            }
          });

          this.list = res;
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    }
  },
  components: {
    ReceiveInformationDialog,
    SelectSizeDialog
  }
};
</script>
<style lang="scss" scoped>
.bulk-delivery {
  min-width: 1306px;
  background-color: #fff;
  padding: 20px;
  color: #333333;
  font-size: 14px;
  border-radius: 4px;
  > .title {
    font-size: 16px;
  }
  .container {
    padding-top: 20px;
    padding-left: 20px;
    section {
      padding-right: 30px;
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
        margin-top: 15px;
        border-radius: 10px;
        border: 1px solid rgba(211, 211, 211, 1);
        .item-title {
          background-color: rgb(243, 244, 244);
          padding: 20px;
          border-radius: 10px 10px 0 0;
        }
        .item-content {
          padding: 20px;
          .row-margin > .col {
            margin-right: 15px;
            p {
              line-height: 21px;
            }
          }
        }
      }
    }
  }

  .table-title {
    background: #F6F7FA;
    color: #44434B;
    height: 46px;
    padding-left: 20px;
  }
  .table-container {
    padding-left: 20px;
    padding-top: 20px;
    .col:first-child {
      margin-right: 40px;
    }
  }
  .goodsItem {
    padding-bottom: 44px;
    padding-top: 20px;
    border-bottom: 1px solid #d3d7d4;
    &:last-child {
      border: none;
      padding-bottom: 0;
    }
  }
  .goods-specs {
    color: #9fa29f;
    margin-top: 10px;
    font-size: 12px;
  }
  .footer {
    text-align: center;
    margin-top: 20px;
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
      .disabled {
        color: #9fa29f;
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
.el-icon-delete {
  float: right;
  cursor: pointer;
}
@media (max-width: 1440px) {
  .table-title-left {
    width: 443px!important;
    .table-title-left-goods {
        width: 290px!important;
    }
    .table-title-left-yingfa {
        width: 91px!important;
    }
    .table-title-left-benci {
      width: 134px!important;
    }
  }
  .table-container-left {
    width: 443px!important;
  }
  .goodsItem-left {
      width: 215px!important;
  }
  .table-title-left-goods {
      width: 290px!important;
  }
} 
.error-message {
  color: #FD4C2B;
  font-size: 12px;
  line-height: 1;
  padding-top: 2px;
  margin-bottom: 0;
}
.container-item-content {
  .content {
    .item {
      .label {
        flex-shrink: 0;
      }
    }
  }
}
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
  background: url(../../assets/images/order/checkbox-checked.png)
    no-repeat;
  &.disabledChecked {
    background: url(../../assets/images/order/checkbox-checked-disabled.png)
    no-repeat;
    width: 18px;
    height: 18px;
    background-size: 100% 100%;
  }
}
.checkbox-box {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .checkbox {
    margin-right: 15px;
  }
}
.send-count {
  text-align: center;
}
.message-box {
  display: flex;
    flex-direction: column;
    justify-content: center;
  >div {
    margin-bottom: 10px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .message-box-address {
    display: flex;
    line-height: 21px;
    .label {
      flex-shrink: 0;
      padding-right: 2px;
    }
  }
}
/deep/ .expressCompanys .el-input, /deep/ .expressNos .el-input {
  width: 236px;
}
/deep/ .el-form-item.expressNos {
  margin-bottom: 0;
}
 @media (max-width: 1440px) {
      .goods-specs{
        width:150px !important;
    }
    .bulk-delivery .table-container .col[data-v-291bba69]:first-child {
      margin-right: 10px;
    }
}
</style>