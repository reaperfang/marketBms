<template>
  <div class="bulk-delivery">
    <div class="title">订单批量发货</div>
    <div class="container">
      <section>
        <div class="title">1. 选择您要进行发货的商品并填写物流信息</div>
        <div class="goods-item" v-for="(item, index) in list" :key="index">
          <div class="item-title">
            <span>商品清单</span>
            <span>订单编号 {{item.orderCode}}</span>
            <i v-if="list.length > 1" @click="deleteOrder(index)" class="el-icon-delete"></i>
          </div>
          <div class="item-content">
            <div class="row align-center table-title">
              <div class="col table-title-left" style="width: 590px; margin-right: 40px;">
                <div class="row align-center row-margin">
                  <div class="col">
                    <i @click="changeAll(item)" class="checkbox" :class="{checked: item.checked}"></i>
                  </div>
                  <div class="col table-title-left-goods" style="width: 310px;">商品</div>
                  <div class="col table-title-left-yingfa" style="width: 60px;">应发数量</div>
                  <div class="col table-title-left-benci">本次发货数量</div>
                </div>
              </div>
              <div class="col">
                <div class="row align-center row-margin">
                  <div class="col" style="width: 180px;">收货信息</div>
                  <div class="col">物流信息</div>
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
                    <i @click="select(index, i)" class="checkbox" :class="{checked: goods.checked}"></i>
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
                  <div class="col" style="width: 60px;">{{goods.goodsCount -goods.cacheSendCount}}</div>
                  <div class="col" style="width: 100px;">
                    <el-input
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
                  <div class="col" style="width: 180px;">
                    <p>收货人: {{item.receivedName}}</p>
                    <p>联系电话: {{item.receivedPhone}}</p>
                    <p>收货地址: {{item.receivedProvinceName}} {{item.receivedCityName}} {{item.receivedAreaName}} {{item.receivedDetail}}
                    </p>
                  </div>
                  <div class="col">
                    <el-form :model="item" label-width="100px" class="demo-ruleForm" v-if="item.deliveryWay == 1">
                      <el-form-item label="快递公司" prop="expressCompanys">
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
                      <el-form-item label="快递单号" prop="expressNos">
                        <el-input :disabled="!item.express" v-model="item.expressNos" :placeholder="!item.express ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" :title="!item.express ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" @input="ExpressNosInput(index)"></el-input>
                        <p v-if="item.express && item.showErrorExpressNos" class="error-message">{{item.errorMessageExpressNos}}</p>
                      </el-form-item>
                    </el-form>
                    <el-form :model="item" label-width="100px" class="demo-ruleForm" v-if="item.deliveryWay == 2">
                      <el-form-item label="配送时间">
                        <span>{{item.deliveryDate | formatDateRemoveZero}} {{item.deliveryTime}}</span>
                      </el-form-item>
                      <el-form-item label="配送员" prop="distributorValue">
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
                      <el-form-item label="联系方式" prop="phone">
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
                <div class="value">{{list[0] && list[0].sendName}}</div>
              </div>
              <div class="item">
                <div class="label">联系电话</div>
                <div class="value">{{list[0] && list[0].sendPhone}}</div>
              </div>
              <div class="item">
                <div class="label">发货信息</div>
                <div class="value">{{list[0] && list[0].sendDetail}}</div>
                <div class="value" v-if="list[0]">
                  {{list[0].sendProvinceName}} {{list[0].sendCityName}} {{list[0].sendAreaName}} {{list[0].sendDetail}}</div>
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
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      :data="currentData"
      @submit="onSubmit"
      :sendGoods="sendGoods"
      :title="title"
    ></component>
  </div>
</template>
<script>
import ReceiveInformationDialog from "@/views/order/dialogs/receiveInformationDialog";
import $ from 'jquery';

import { validatePhone } from "@/utils/validate.js"

export default {
  data() {
    return {
      list: [],
      currentDialog: "",
      dialogVisible: false,
      currentData: "",
      sendGoods: "",
      title: "",
      expressCompanyList: [],
      sending: false,
      distributorList: [], //每个订单对应的筛选后的配送员列表
      distributorListFilter: [], //配送员列表
      distributorNameFirst: true, //配送员名字第一次输入标记
      distributorPhoneFirst: true, //配送员联系方式第一次输入标记
    };
  },
  created() {
    
    this.getDetail();
    this.getExpressCompanyList();
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
  },
  filters: {
    goodsSpecsFilter(value) {
      let _value;
      if (!value) return "";
      if (typeof value == "string") {
        _value = JSON.parse(value);
      }
      let str = "";
      for (let i in _value) {
        if (_value.hasOwnProperty(i)) {
          str += i + ":";
          str += _value[i] + ",";
        }
      }

      return str;
    }
  },
  methods: {
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
            this.distributorListFilter = res.list;
            for(let i = 0; i < length; i++){
              this.distributorList.push(res.list);
            }
            
            })
            .catch(error => {});
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
    checkExpress(index) {
      let expressCompanyCodes
      let expressName

      expressCompanyCodes = this.list[index].expressCompanyCodes

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

          // 批量填充
          if(index == 0) {
            let list = JSON.parse(JSON.stringify(this.list))
            let expressCompanyCodes = list[0].expressCompanyCodes
            let express = list[0].express

            list.forEach((val, index) => {
              if(index != 0) {
                val.expressCompanyCodes = expressCompanyCodes
                val.express = express
              }
            })

            this.list = list
          }
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });

        this.list.splice(index, 1, Object.assign({}, this.list[index], {
          showErrorExpressCompany: false,
          errorMessageExpressCompany: ''
        }))
    },
    deleteOrder(index) {
      this.list.splice(index, 1);
    },
    changeAll(item) {
      item.checked = !item.checked;

      if (item.checked) {
        item.orderItemList.forEach(val => {
          val.checked = true;
        });
      } else {
        item.orderItemList.forEach(val => {
          val.checked = false;
        });
      }
    },
    // 订单详情 orderId
    // 电子面单 orderId
    // 配送单 id
    sendGoodsHandler() {
      try {
        let params;
        console.log(this.list
            .reduce((total, val) => {
              return total.concat(val.orderItemList);
            }, []).filter(val => val.checked))
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
                if(item.express && !item.expressNos) {
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
              orderItems: item.orderItemList.filter(val => val.checked),
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
            }
            //如果是商家配送，则添加配送员信息
            if(item.deliveryWay == 2){
              obj.deliveryWay = 2;
              obj.distributorName = item.distributorName;
              //obj.distributorId = item.distributorId;
              obj.distributorPhone = item.phone;
            }
            return obj;
          })
        };

        this._apis.order
          .orderSendGoods(params)
          .then(res => {
            this.$message.success('发货成功');
            this.sending = false
            // this.$router.push(
            //   "/order/deliverGoodsSuccess?ids=" +
            //     this.list.map(val => val.id).join(",") +
            //     "&type=orderBulkDelivery"
            // );

            // this.$router.push(
            //   "/order/deliverGoodsSuccess?ids=" +
            //     res.success.map(val => val.orderInfoId).join(",") +
            //     "&type=orderBulkDelivery"
            // );
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
      } catch (e) {
        console.error(e);
      }
    },
    select(index, i) {
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
      } catch (e) {}
    },
    getExpressCompanyList() {
      this._apis.order
        .getElectronicFaceSheetExpressCompanyList()
        .then(res => {
          res.forEach(val => {
            val.expressCompanyCode = val.expressCode
            val.expressCompany = val.expressName
          })
          res.push({
            expressCompanyCode: "other",
            expressCompany: "其他"
          });
          this.expressCompanyList = res;
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
    onSubmit(value) {
      let _list = JSON.parse(JSON.stringify(this.list));

      _list.forEach((val, index) => {
        _list[index] = Object.assign({}, val, value);
      });

      this.list = _list;
    },
    changeSendInfo() {
      this.currentDialog = "ReceiveInformationDialog";
      this.currentData = this.list[0];
      this.isReceived = false;
      this.title = "修改发货信息";
      this.sendGoods = "send";
      this.dialogVisible = true;
    },
    getDetail() {
      this._apis.order
        .orderSendDetail({
          ids: this.$route.query.ids.split(",").map(val => +val)
        })
        .then(res => {
          console.log(res);
          res.forEach(val => {
            val.express = true
            val.other = "";
            val.checked = false;
            val.expressNos = "";
            val.expressCompanyCodes = "";
            val.orderItemList.forEach(goods => {
              goods.checked = false;
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
          this.list = res;
          this._apis.order
            .fetchOrderAddress({ id: this.cid, cid: this.cid })
            .then(response => {
              this.list.forEach(res => {
                res.sendName = response.senderName;
                res.sendPhone = response.senderPhone;
                res.sendProvinceCode = response.provinceCode;
                res.sendProvinceName = response.province;
                res.sendCityCode = response.cityCode;
                res.sendCityName = response.city;
                res.sendAreaCode = response.areaCode;
                res.sendAreaName = response.area;
                res.sendDetail = response.address;
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
  background-color: #fff;
  padding: 20px;
  color: #333333;
  font-size: 14px;
  > .title {
    font-size: 16px;
  }
  .container {
    padding-top: 20px;
    padding-left: 60px;
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
            background: url(../../assets/images/order/checkbox-checked.png)
              no-repeat;
          }
          .row-margin > .col {
            margin-right: 25px;
            p {
              line-height: 21px;
            }
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
</style>