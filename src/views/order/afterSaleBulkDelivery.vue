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
              <div class="col table-title-left" style="width: 660px;margin-right: 40px;">
                <div class="row align-center row-margin">
                  <div class="col">
                    <i @click="changeAll(item)" class="checkbox" :class="{checked: item.checked}"></i>
                  </div>
                  <div class="col table-title-left-goods" style="width: 380px;">商品</div>
                  <div class="col table-title-left-yingfa" style="width: 60px;">应发数量</div>
                  <div class="col table-title-left-benci">本次发货数量</div>
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
              <div class="col table-container-left" style="width: 660px; flex-shrink: 0;">
                <div
                  class="row align-center row-margin goodsItem"
                  v-for="(goods, i) in item.itemList"
                  :key="i"
                >
                  <div class="col">
                    <i @click="select(index, i)" class="checkbox" :class="{checked: goods.checked}"></i>
                  </div>
                  <div class="col goodsItem-left" style="width: 380px;">
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
                    <p>收货地址: {{item.orderAfterSaleSendInfo.receiveAddress}} {{item.orderAfterSaleSendInfo.receivedDetail}}</p>
                  </div>
                  <div class="col">
                    <el-form :model="item.orderAfterSaleSendInfo" label-width="100px" class="demo-ruleForm" v-if="item.orderAfterSaleSendInfo.deliveryWay == 1">
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
                    <el-form :model="item" label-width="100px" class="demo-ruleForm" v-if="item.orderAfterSaleSendInfo.deliveryWay == 2">
                      <el-form-item label="配送时间">
                        <span>{{item.orderAfterSaleSendInfo.deliveryDate | formatDateRemoveZero}} {{item.orderAfterSaleSendInfo.deliveryTime}}</span>
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
                <div class="value" v-if="list[0] && list[0].orderAfterSaleSendInfo">
                  {{list[0].orderAfterSaleSendInfo.sendAddress}} {{list[0].orderAfterSaleSendInfo.sendDetail}}</div>
                <div class="value" v-else>--</div>
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

import { validatePhone } from "@/utils/validate.js"

import { asyncRouterMap } from '@/router'

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
      expressCompanyList: [],
      distributorList: [], //每个订单对应的筛选后的配送员列表
      distributorListFilter: [], //配送员列表
      distributorNameFirst: true, //配送员名字第一次输入标记
      distributorPhoneFirst: true, //配送员联系方式第一次输入标记
      distributorSet: false
    };
  },
  created() {
    this.getDetail();
    this.getExpressCompanyList()
    this.checkSet()
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  methods: {
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
    selectFocus(e, index){
      const value = e.target.value;
      const input = this.$refs['searchSelect'+index][0].$children[0].$refs.input;
      this.$nextTick(() => {
        input.setAttribute('placeholder', '请输入或选择');
        input.value = value;
        input.setAttribute('maxlength', 20);
        input.selectionStart=input.selectionEnd=input.value.length
      })
    },
    selectBlur(val, index){
      //失去焦点时如果input中有值，且发生了变化，则需要根据name查询出对应的数据
      if(this.list[index].distributorValue != '' && this.list[index].distributorValue != this.list[index].distributorName){
        let arr = this.distributorListFilter.filter((item) => {
          if (item.name === this.list[index].distributorValue) {
            return true
          }
        })
        //如果未查询到，则把没有id，只记录配送员名字
        if(arr.length == 0){
          this.list[index].distributorName = this.list[index].distributorValue;
          this.list[index].distributorId = '';
        }else{
          this.list[index].distributorName = arr[0].name;
          this.list[index].distributorId = arr[0].id;
          this.list[index].phone = arr[0].phone;
          this.list[index].showErrorPhone = false;
        }
        //第一次，检测其他订单中配送员相关信息是否有为空的，如果有，则直接按当前的给自动填充上
        if(this.distributorNameFirst){
          this.distributorNameFirst = false;
          this.list.forEach((items, indexs) => {
            if(indexs != index){
              items.distributorValue = this.list[index].distributorName;
              items.distributorName = this.list[index].distributorName;
              items.distributorId = this.list[index].distributorId;
              items.showErrorDistributorName = false;
              this.distributorList[indexs] = this.distributorListFilter.filter((item) => {
                  if (item.name.includes(items.distributorValue) || item.name.toUpperCase().includes(items.distributorValue.toUpperCase())) {
                    return true
                  }
              })
              if(arr.length != 0){
                this.distributorPhoneFirst = false;
                items.phone = this.list[index].phone;
                items.showErrorPhone = false;
              }
            }
          })
        }
      }
      if(this.list[index].distributorValue != ''){
        this.list[index].showErrorDistributorName = false;
      }else{
        this.list[index].showErrorDistributorName = true;
      }
    },
    selectChange(val, index){
      this.list[index].showErrorDistributorName = false;
      this.list[index].showErrorPhone = false;
      //选择后，把筛选列表重置
      this.distributorList[index] = this.distributorListFilter.filter((item) => {
          if (item.name.includes(val) || item.name.toUpperCase().includes(val.toUpperCase())) {
            return true
          }
      })
      //根据name查询出对应数据，把选择的name和id给到相关字段
      let arr = this.distributorListFilter.filter((item) => {
          if (item.name === val) {
            return true
          }
        })
      this.list[index].distributorName = arr[0].name;
      this.list[index].distributorId = arr[0].id;
      this.list[index].phone = arr[0].phone;

      //第一次检测其他订单中配送员相关信息是否有为空的，如果有，则直接按当前的给自动填充上
      if(this.distributorNameFirst){
        this.distributorNameFirst = false;
        this.distributorPhoneFirst = false;
        this.list.forEach((items, indexs) => {
          if(indexs != index){
            items.distributorValue = this.list[index].distributorName;
            items.distributorName = this.list[index].distributorName;
            items.distributorId = this.list[index].distributorId;
            this.distributorList[indexs] = this.distributorListFilter.filter((item) => {
                  if (item.name.includes(items.distributorValue) || item.name.toUpperCase().includes(items.distributorValue.toUpperCase())) {
                    return true
                  }
              })
            items.phone = this.list[index].phone;
            items.showErrorDistributorName = false;
            items.showErrorPhone = false;
          }
        })
      }
    },
    visibleChange(val, index){
      if(!val){
        let input = this.$refs['searchSelect'+index][0].$children[0].$refs.input;
        input.blur();
      }else{
          let input = this.$refs['searchSelect'+index][0].$children[0].$refs.input;
          let value = input.value;
          this.$nextTick(() => {
                input.value = value;
          })
      }
    },
    distributorPhoneBlur(e, index){
      let value = e.target.value;
      if(value == ''){
        this.list[index].showErrorPhone = true;
        this.list[index].errorMessagePhone = '请输入手机号码';
      }else if(!validatePhone(value)){
        this.list[index].showErrorPhone = true;
        this.list[index].errorMessagePhone = '请输入正确的手机号码';
      }else{
        this.list[index].showErrorPhone = false;
        //第一次，检测其他订单中配送员手机号是否有为空的，如果有，则直接按当前的给自动填充上
        if(this.distributorPhoneFirst){
          this.distributorPhoneFirst = false;
          this.list.forEach((items, indexs) => {
            if(indexs != index){
              items.phone = value;
              items.showErrorPhone = false;
            }
          })
        }
      }
    },
    //获取配送员列表
    getDistributorList(length){
        this._apis.order
            .getDistributorList({
                "shopInfoId": this.cid,
                "roleName": "配送员",
                "startIndex": 1,
                "pageSize": 1000
            })
            .then(res => {
            res.list.forEach((item) => {
                item.name = item.userName;
                item.phone = item.mobile;
            })
            //如果没有子帐号配置权限，则默认自己是配送员
            if(!this.distributorSet){
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                res.list = [
                    {
                        "id": 1,
                        "name": userInfo.userName,
                        "phone": userInfo.mobile
                    }
                ];
            }
            this.distributorListFilter = res.list;
            for(let i = 0; i < length; i++){
              this.distributorList.push(res.list);
            }
            
            })
            .catch(error => {});
    },
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
          this.$message.error(error);
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
          //配送方式
          const deliveryWay = this.list[0].orderAfterSaleSendInfo.deliveryWay; 
          
          try {
              let params

              if(deliveryWay == 1){ //如果为普通快递
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
              }

              let isWrong = false;

              this.list.forEach((item, index) => {
                //如果是商家配送，则验证配送员信息
                  if(item.orderAfterSaleSendInfo.deliveryWay == 2){
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
            if(isWrong) {
              this.$nextTick(() => {
                document.querySelector('.error-message').scrollIntoView()
                let scrollTop = document.querySelector('.content-main').scrollTop

                document.querySelector('.content-main').scrollTop = scrollTop - 40
              })
              return
            }
              

            params = {
                orderAfterSaleSendInfoDtoList: this.list.map(item => {
                    let expressCompanys = ''
                    
                    if(item.orderAfterSaleSendInfo.deliveryWay == 1){ //如果为普通快递在对快递单号等进行处理
                      if (item.expressCompanyCodes == "other") {
                        expressCompanys = item.other;
                      } else {
                        if(this.expressCompanyList.find(val => val.expressCompanyCode == item.orderAfterSaleSendInfo.expressCompanyCodes)) {
                          expressCompanys = this.expressCompanyList.find(val => val.expressCompanyCode == item.orderAfterSaleSendInfo.expressCompanyCodes).expressCompany
                      }
                      }
                    }
                    let obj = {
                        orderAfterSaleId: item.orderAfterSaleSendInfo.orderAfterSaleId,
                        memberInfoId: item.orderAfterSaleSendInfo.memberInfoId,
                        orderAfterSaleCode: item.orderAfterSaleSendInfo.code,
                        receivedName: item.orderAfterSaleSendInfo.receivedName,
                        receivedPhone: item.orderAfterSaleSendInfo.receivedPhone,
                        receivedProvinceCode: item.orderAfterSaleSendInfo.receivedProvinceCode,
                        receivedProvinceName: item.orderAfterSaleSendInfo.receivedProvinceName,
                        receivedCityCode: item.orderAfterSaleSendInfo.receivedCityCode,
                        receivedCityName: item.orderAfterSaleSendInfo.receivedCityName,
                        receivedAreaCode: item.orderAfterSaleSendInfo.receivedAreaCode,
                        receivedAreaName: item.orderAfterSaleSendInfo.receivedAreaName,
                        receiveAddress: item.orderAfterSaleSendInfo.receiveAddress,
                        sendAddress: item.orderAfterSaleSendInfo.sendAddress,
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
                    };
                    //如果是普通快递，则添加快递公司与快递单号
                    if(item.orderAfterSaleSendInfo.deliveryWay == 1){
                      obj.deliveryWay = 1;
                      obj.expressCompanys = expressCompanys;
                      obj.expressNos = item.orderAfterSaleSendInfo.expressNos;
                      obj.expressCompanyCodes = item.orderAfterSaleSendInfo.expressCompanyCodes;
                    }
                    //如果是商家配送，则添加配送员信息
                    if(item.orderAfterSaleSendInfo.deliveryWay == 2){
                      obj.deliveryWay = 2;
                      obj.distributorName = item.distributorName;
                      //obj.distributorId = item.distributorId;
                      obj.distributorPhone = item.phone;
                    }
                    return obj
                })
            }

            this._apis.order.orderAfterSaleSend(params).then((res) => {
                this.$message.success('发货成功');
                this.$router.push('/order/deliverGoodsSuccess?ids=' + this.$route.query.ids + '&type=afterSaleBulkDelivery')
            }).catch(error => {
                this.$message.error(error);
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
            this.$message.error(error);
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

            val.distributorValue = '';
            val.distributorName = '';
            val.distributorId = '';
            val.phone = '';
            val.showErrorDistributorName = false;
            val.errorMessageDistributorName = '请输入或选择配送员';
            val.showErrorPhone = false;
            val.errorMessagePhone = '';

          })



          //如果是商家配送，则需要请求拿到配送员列表
          if(res[0].orderAfterSaleSendInfo.deliveryWay == 2){
            //获取配送员列表
            this.getDistributorList(res.length);
          }

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
                res.orderAfterSaleSendInfo.sendAddress = response.sendAddress;
                res.orderAfterSaleSendInfo.sendDetail = response.address;
              });
            })
            .catch(error => {
              this.visible = false;
              this.$message.error(error);
            });
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
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
  min-width: 1000px;
  background-color: #fff;
  padding: 20px;
  color: #333;
  > .title {
    font-size: 16px;
  }
  .container {
    padding-top: 20px;
    padding-left: 20px;
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
  .table-title {
    background: #ebeafa;
    color: #655eff;
    height: 46px;
    padding-left: 15px;
  }
  .table-container {
    padding-left: 15px;
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
.goodsItem-left .row .col:first-child {
  margin-right: 10px;
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
  line-height: 21px;
  padding-top: 2px;
  margin-bottom: 0;
}
</style>