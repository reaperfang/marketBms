<template>
  <div class="deliver-goods">
    <div class="deliver-goods-header">
      <div class="item">发货</div>
      <div class="item">
        <el-button @click="$router.go(-1)">返 回</el-button>
      </div>
    </div>
    <div class="container">
      <div class="container-item">
        <p class="deliver-goods-number">1. 选择您要进行发货的商品及数量</p>
        <div class="container-item-content deliver-goods-list">
          <div class="title">
            <div>
              <span>商品清单</span>
              <span>订单编号 {{orderInfo.orderCode}}</span>
            </div>
          </div>
          <div class="content">
            <el-table
              :class="{isIE: isIE}"
              ref="table"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
             >
              <el-table-column 
                type="selection" 
                width="55"
                :selectable="selectable"
              ></el-table-column>
              <el-table-column label="序号" width="180">
                <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column label="商品" width="380">
                <template slot-scope="scope">
                  <div class="goods-detail">
                    <div class="goods-detail-item">
                      <img width="70" :src="scope.row.goodsImage" alt />
                    </div>
                    <div class="goods-detail-item">
                      <p class="ellipsis">{{scope.row.goodsName}}</p>
                      <p>{{scope.row.goodsSpecs | goodsSpecsFilter}}</p>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="goodsCount" label="应发数量">
                <template slot-scope="scope">{{scope.row.goodsCount - scope.row.cacheSendCount}}</template>
              </el-table-column>
              <!-- <el-table-column
                                prop="realityNumber"
                                label="可发货数量">
              </el-table-column>-->
              <el-table-column prop="sendCount" label="本次发货数量">
                <template slot-scope="scope">
                  <el-input
                    :class="{'send-input': scope.row.errorMessage}"
                    :disabled="scope.row.goodsCount - scope.row.cacheSendCount == 0"
                    type="number"
                    step="1"
                    :max="scope.row.goodsCount - scope.row.cacheSendCount"
                    min="1"
                    @input="inputHandler(scope.$index)"
                    v-model="scope.row.sendCount"
                  ></el-input>
                  <p v-if="scope.row.showError" class="error-message">{{scope.row.errorMessage}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="container-item">
        <p>2.确认收发货信息</p>
        <div class="container-item-content deliver-goods-address">
          <div class="title">
            <div class="title-list">
              <i class="take-in-icon"></i>
              <span>收货信息</span>
            </div>
            <!-- <div class="blue pointer" @click="changeReceivedInfo">修改收货信息</div> -->
          </div>
          <div class="content">
            <div class="item">
              <div class="label">收货人</div>
              <div class="value">{{orderInfo.receivedName}}</div>
            </div>
            <div class="item">
              <div class="label">联系电话</div>
              <div class="value">{{orderInfo.receivedPhone}}</div>
            </div>
            <div class="item">
              <div class="label">收货信息</div>
              <div class="value">{{orderInfo.receiveAddress}} {{orderInfo.receivedDetail}}</div>
            </div>
          </div>
        </div>
        <div class="container-item-content deliver-goods-address">
          <div class="title">
            <div class="title-list">
              <i class="deliver-icon"></i>
              <span>发货信息</span>
            </div>
            <!-- <div class="blue pointer" @click="changeSendInfo">修改发货信息</div> -->
          </div>
          <div class="content">
            <div class="item">
              <div class="label">发货人</div>
              <div class="value">{{orderInfo.sendName}}</div>
            </div>
            <div class="item">
              <div class="label">联系电话</div>
              <div class="value">{{orderInfo.sendPhone}}</div>
            </div>
            <div class="item">
              <div class="label">发货信息</div>
              <div class="value">{{orderInfo.sendAddress}} {{orderInfo.sendDetail}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container-item">
        <p>3.填写物流信息</p>
        <!-- 配送方式为普通快递 -->
        <div class="logistics deliver-goods-logistics" v-if="orderInfo.deliveryWay == 1">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="配送方式">
              <span>普通快递</span>
            </el-form-item>
            <el-form-item label="快递公司" prop="expressCompanyCode" :class="{'is-disabled': !express}">
              <el-select filterable @change="checkExpress" v-model="ruleForm.expressCompanyCode" placeholder="请选择">
                <el-option
                  :label="item.expressCompany"
                  :value="item.expressCompanyCode"
                  v-for="(item, index) in expressCompanyList"
                  :key="index"
                ></el-option>
              </el-select>
              <el-input v-if="ruleForm.expressCompanyCode == 'other'" v-model="ruleForm.other" placeholder="请输入快递公司名称"></el-input>
            </el-form-item>
            <el-form-item label="快递单号" prop="expressNos" :class="{'is-disabled': !express}">
              <el-input :disabled="!express" :placeholder="!express ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" v-model="ruleForm.expressNos" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="物流备注" prop="sendRemark">
              <el-input
                style="width: 623px;"
                type="textarea"
                :rows="2"
                maxlength="100"
                placeholder="非必填，请输入，不超过100个字符"
                v-model="ruleForm.sendRemark"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <!-- 配送方式为商家配送 -->
        <div class="logistics deliver-goods-logistics" v-if="orderInfo.deliveryWay == 2">
          <el-form
            :model="ruleFormStore"
            :rules="rulesStore"
            ref="ruleFormStore"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="配送方式">
              <span>商家配送</span>
            </el-form-item>
            <el-form-item label="配送时间">
              <span>{{orderInfo.deliveryDate | formatDateRemoveZero}} {{orderInfo.deliveryTime}}</span>
            </el-form-item>
            <el-form-item label="配送员" prop="distributorValue">
              <el-select v-model="ruleFormStore.distributorValue" no-data-text="无匹配数据" value-key="id" filterable placeholder="请输入或选择" ref="searchSelect" :filter-method="dataFilter" @visible-change="visibleChange" @focus="selectFocus" @blur="selectBlur" @change="selectChange">
                <el-option
                  v-for="item in distributorList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
              <div class="pointer" style="display: inline-block; margin-left: 20px; margin-right: 10px;vertical-align:middle;">
                  <span class="shuaxin-fenlei" @click="getDistributorList">刷新<i></i></span>
              </div>
              <div class="prompt" style="display:inline-block;" v-show="isDistributorShow">
                <span>您尚未创建配送员信息，去</span><span class="set-btn blue pointer font12" @click="gotoRoleManage">创建配送员角色</span><span>并</span><span class="set-btn blue pointer font12" @click="gotoSubaccountManage">创建子账号</span><span>绑定配送员角色。</span>
              </div>
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input placeholder="请输入配送员手机号码" v-model="ruleFormStore.phone"></el-input>
            </el-form-item>
            <el-form-item label="物流备注" prop="sendRemark">
              <el-input
                style="width: 623px;"
                type="textarea"
                :rows="2"
                maxlength="100"
                placeholder="非必填，请输入，不超过100个字符"
                v-model="ruleFormStore.sendRemark"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <el-button v-if="orderInfo.deliveryWay == 1" :loading="sending" type="primary" @click="sendGoodsHandler('ruleForm')">发 货</el-button>
        <el-button v-if="orderInfo.deliveryWay == 2" :loading="sending" type="primary" @click="sendGoodsHandler('ruleFormStore')">发 货</el-button>
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
    ></component>
  </div>
</template>
<script>
import ReceiveInformationDialog from "@/views/order/dialogs/receiveInformationDialog";

import { validatePhone } from "@/utils/validate.js"

export default {
  data() {
    var expressCompanyCodeValidator = (rule, value, callback) => {
          if(this.ruleForm.expressCompanyCode != 'other') {
              if(!this.ruleForm.expressCompanyCode) {
                  callback(new Error('请选择快递公司'));
              } else {
                  callback();
              }
          } else {
              if(!this.ruleForm.other || /^\s+$/.test(this.ruleForm.other)) {
                callback(new Error('请输入快递公司名称'));
              } else {
                callback();
              }
          }
      };
      //手机号验证
      var phoneValidator = (rule, value, callback) => {
          if(value == ''){
            callback(new Error('请输入手机号码'));
          }else if(!validatePhone(value)){
            callback(new Error('请输入正确的手机号码'));
          }else{
            callback();
          }
      };
    return {
      list: [],
      tableData: [],
      multipleSelection: [],
      ruleForm: {
        name: "",
        number: "",
        remark: "",
        sendRemark: '',
        expressCompanyCode: "",
        expressCompany: "",
        other: ''
      },
      rules: {
        expressCompanyCode: [
          { validator: expressCompanyCodeValidator, trigger: "blur" }
        ]
      },
      ruleFormStore: { //商家配送form
        distributorValue: '', //选择的配送员值
        phone: "", //联系方式
        sendRemark: ""
      },
      rulesStore: { //商家配送form验证规则
        distributorValue: [
          { required: true, message: '请输入或选择配送员', trigger: "change" }
        ],
        phone: [
          { required: true, validator: phoneValidator, trigger: "blur" }
        ]
      },
      orderDetail: {},
      nameList: [],
      orderInfo: {},
      orderSendInfo: {},
      currentDialog: "",
      dialogVisible: false,
      currentData: {},
      expressCompanyList: [],
      sendGoods: "",
      title: "",
      express: true,
      sending: false,
      errorMessage: '',
      showError: false,
      distributorList: [], //配送员筛选后的数据
      distributorListFilter: [], //所有配送员数据
      distributorName: '', //配送员名字
      distributorId: '', //配送员id
      isDistributorShow: false //尚未创建配送员信息提示控制
    };
  },
  created() {
    this.getDetail();
    this.getExpressCompanyList();
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
      str = str.replace(/(^.*)\,$/, '$1')
      return str;
    }
  },
  computed: {
    afterSale() {
      if (this.$route.query.afterSale) {
        return true;
      } else {
        return false;
      }
    },
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    isIE() {
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; 
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;  
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if(isIE) {
            return true;   
        } else if(isEdge) {
            return true; 
        } else if(isIE11) {
            return true; 
        }else{
            return false
        }
    },
  },
  methods: {
    dataFilter() {
      //这里需要使用input本身的value，且过滤前后空格
      const input = this.$refs.searchSelect.$children[0].$refs.input;
      const val = input.value.trim();
      this.ruleFormStore.distributorValue = val;
      if (val) {
        this.distributorList = this.distributorListFilter.filter((item) => {
            if (item.name.includes(val) || item.name.toUpperCase().includes(val.toUpperCase())) {
              return true
            }
        })
      } else{
        this.distributorList = this.distributorListFilter;
      }
    },
    selectFocus(e){
      const value = e.target.value;
      const input = this.$refs.searchSelect.$children[0].$refs.input;
      this.$nextTick(() => {
        input.setAttribute('placeholder', '请输入或选择');
        input.value = value;
        input.setAttribute('maxlength', 20);
        input.selectionStart=input.selectionEnd=input.value.length
      })
    },
    selectBlur(){
      //失去焦点时如果input中有值，且发生了变化，则需要根据name查询出对应的数据
      if(this.ruleFormStore.distributorValue != '' && this.ruleFormStore.distributorValue != this.distributorName){
        let arr = this.distributorListFilter.filter((item) => {
          if (item.name === this.ruleFormStore.distributorValue) {
            return true
          }
        })
        //如果未查询到，则把没有id，只记录配送员名字
        if(arr.length == 0){
          this.distributorName = this.ruleFormStore.distributorValue;
          this.distributorId = '';
        }else{
          this.distributorName = arr[0].name;
          this.distributorId = arr[0].id;
          this.ruleFormStore.phone = arr[0].phone;
          this.$refs.ruleFormStore.validateField('phone');
        }
      }
    },
    selectChange(val){
      //选择后，把筛选列表重置
      this.distributorList = this.distributorListFilter.filter((item) => {
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
      this.distributorName = arr[0].name;
      this.distributorId = arr[0].id;
      this.ruleFormStore.phone = arr[0].phone;
      this.$refs.ruleFormStore.validateField('phone');
    },
    visibleChange(val){
      if(!val){
        let input = this.$refs.searchSelect.$children[0].$refs.input;
        input.blur();
      }else{
          let input = this.$refs.searchSelect.$children[0].$refs.input;
          let value = input.value;
          this.$nextTick(() => {np
            input.value = value;
          })
      }
    },
    //获取配送员列表
    getDistributorList(){
            this._apis.order
                .getDistributorList({
                    "shopInfoId": this.cid,
                    "roleName": "配送员",
                    "startIndex": 1,
                    "pageSize": 1000
                })
                .then(res => {
                  //如果没有配送员，则提示去创建
                if(res.list.length == 0){
                    this.isDistributorShow = true;
                }else{
                    this.isDistributorShow = false;
                }
                res.list.forEach((item) => {
                    item.name = item.userName;
                    item.phone = item.mobile;
                })
                this.distributorListFilter = res.list;
                //如果是刷新按钮触发 ，且已经有配送员名字，则重新过滤一下。
                if(this.distributorName){
                    this.distributorList = this.distributorListFilter.filter((item) => {
                        if (item.name.includes(this.distributorName) || item.name.toUpperCase().includes(this.distributorName.toUpperCase())) {
                        return true
                        }
                    })
                }else{ //否则直接赋值全部配送员
                    this.distributorList = res.list;
                }
                })
                .catch(error => {});
        },
    //新页面打开角色管理
    gotoRoleManage() {
        let routeData = this.$router.resolve({ path: '/set/roleManage' });
        window.open(routeData.href, '_blank');
    },
    //新页面打开子帐号管理
    gotoSubaccountManage() {
        let routeData = this.$router.resolve({ path: '/set/subaccountManage' });
        window.open(routeData.href, '_blank');
    },
    inputHandler(index) {
      let reg = /^[1-9]\d*$/

      if(this.tableData[index].sendCount == '') {
        this.tableData.splice(index, 1, Object.assign({}, this.tableData[index], {
          errorMessage:  '请输入本次发货数量',
          showError: true
        }))
        return
      }

      setTimeout(() => {
        if(+this.tableData[index].sendCount <= 0 || !reg.test(this.tableData[index].sendCount)) {
          this.tableData.splice(index, 1, Object.assign({}, this.tableData[index], {
            sendCount: '',
          }))
        }

        this.tableData.splice(index, 1, Object.assign({}, this.tableData[index], {
          errorMessage: +this.tableData[index].sendCount <= 0 || !reg.test(this.tableData[index].sendCount) ? '仅支持输入非负的正整数' : '',
          showError: +this.tableData[index].sendCount <= 0 || !reg.test(this.tableData[index].sendCount) ? true : false
        }))
      }, 500)
    },
    selectable(row, index) {
      if(row.goodsCount - row.cacheSendCount == 0) {
        return false
      }
      return true
    },
    checkExpress() {
      let expressName

      if(this.ruleForm.expressNos) {
        this.ruleForm.expressNos = ''
      }
      if(this.ruleForm.other) {
        this.ruleForm.other = ''
      }
      if(this.ruleForm.expressCompanyCode == 'other') {
            expressName = 'other'
          } else {
            expressName = this.expressCompanyList.find(
              val => val.expressCompanyCode == this.ruleForm.expressCompanyCode
            ).expressCompany;
          }
      this._apis.order
        .checkExpress({expressName})
        .then(res => {
          this.express = res;
          if(this.express) {
              this.$set(this.rules, "expressNos", [
                { required: true, message: "请输入快递单号", trigger: "blur" }
              ]);
          } else {
            this.$set(this.rules, "expressNos", [
                { required: false, message: "请输入快递单号", trigger: "blur" }
              ]);

          }
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
    fetchOrderAddress() {
      this._apis.order
        .fetchOrderAddress({ id: this.cid, cid: this.cid })
        .then(res => {
          this.orderInfo.sendName = res.senderName;
          this.orderInfo.sendPhone = res.senderPhone;
          this.orderInfo.sendProvinceCode = res.provinceCode;
          this.orderInfo.sendProvinceName = res.province;
          this.orderInfo.sendCityCode = res.cityCode;
          this.orderInfo.sendCityName = res.city;
          this.orderInfo.sendAreaCode = res.areaCode;
          this.orderInfo.sendAreaName = res.area;
          this.orderInfo.sendDetail = res.address;
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
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
            expressCompanyCode: 'other',
            expressCompany: '其他'
          })
          this.expressCompanyList = res;
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
    // 订单详情 orderId
    // 电子面单 orderId
    // 配送单 id
    sendGoodsHandler(formName) {
      let reg = /^[1-9]\d*$/

      if (!this.multipleSelection.length) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "请选择需要发货的商品"
        });
        return;
      }

      if (this.multipleSelection.some(val => !val.sendCount)) {        
        // this.confirm({
        //   title: "提示",
        //   icon: true,
        //   text: "请填写发货商品数量"
        // });
        document.querySelector('.send-input').scrollIntoView()
        let scrollTop = document.querySelector('.content-main').scrollTop

        document.querySelector('.content-main').scrollTop = scrollTop - 8
        return;
      }

      if (this.multipleSelection.some(val => +val.sendCount > val.goodsCount)) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "本次发货数量不能大于应发数量"
        });
        return;
      }
      if (this.multipleSelection.some(val => +val.sendCount <= 0 || !reg.test(val.sendCount))) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "仅支持输入非负的正整数"
        });
        return;
      }
     
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params;

          // if(!this.ruleForm.expressCompanyCode) {
          //     this.confirm({title: '提示', icon: true, text: '请选择快递公司'})
          //     return
          // }

          //如果是普通快递
          if(formName == 'ruleForm'){
            if(this.ruleForm.expressCompanyCode == 'other') {
              this.ruleForm.expressCompany = this.ruleForm.other
            } else {
              this.ruleForm.expressCompany = this.expressCompanyList.find(
                val => val.expressCompanyCode == this.ruleForm.expressCompanyCode
              ).expressCompany;
            }
          }
          

          this.sending = true
          let obj = {
                orderId: this.$route.query.orderId || this.$route.query.id || this.$route.query.ids, // 订单id
                memberInfoId: this.orderInfo.memberInfoId,
                orderCode: this.orderInfo.orderCode,
                orderItems: this.multipleSelection.map(val => ({
                  id: val.id,
                  sendCount: val.sendCount
                })), // 发货的商品列表
                id: this.orderInfo.id,
                memberSn: this.orderInfo.memberSn,
                receivedName: this.orderInfo.receivedName,
                receivedPhone: this.orderInfo.receivedPhone,
                receivedProvinceCode: this.orderInfo.receivedProvinceCode,
                receivedProvinceName: this.orderInfo.receivedProvinceName,
                receivedCityCode: this.orderInfo.receivedCityCode,
                receivedCityName: this.orderInfo.receivedCityName,
                receivedAreaCode: this.orderInfo.receivedAreaCode,
                receivedAreaName: this.orderInfo.receivedAreaName,
                receiveAddress: this.orderInfo.receiveAddress,
                sendAddress: this.orderInfo.sendAddress,
                receivedDetail: this.orderInfo.receivedDetail,
                sendName: this.orderInfo.sendName, // 发货人名称
                sendPhone: this.orderInfo.sendPhone, // 发货人手机号
                sendProvinceCode: this.orderInfo.sendProvinceCode, // 发货省cdoe
                sendProvinceName: this.orderInfo.sendProvinceName, // 发货省名称
                sendCityCode: this.orderInfo.sendCityCode, // 发货城市code
                sendCityName: this.orderInfo.sendCityName, // 发货城市名称
                sendAreaCode: this.orderInfo.sendAreaCode, // 发货区县code
                sendAreaName: this.orderInfo.sendAreaName, // 发货区县名称
                sendDetail: this.orderInfo.sendDetail // 发货人详细地址
              };

          //如果是普通快递
          if(formName == 'ruleForm'){
            obj.deliveryWay = 1;
            obj.expressCompanys = this.ruleForm.expressCompany; // 快递公司名称
            obj.expressNos = this.ruleForm.expressNos; // 快递单号
            obj.expressCompanyCodes = this.ruleForm.expressCompanyCode; // 快递公司编码
            obj.remark = this.ruleForm.remark; // 发货备注
            obj.sendRemark = this.ruleForm.sendRemark; // 发货备注
          }else if(formName == 'ruleFormStore'){ //如果是商家配送
            obj.deliveryWay = 2;
            obj.distributorName = this.distributorName; //配送员名字
            //obj.distributorId = this.distributorId; //配送员id，自己输入的新的名字没有id
            obj.distributorPhone = this.ruleFormStore.phone; //配送员手机号
            obj.sendRemark = this.ruleFormStore.sendRemark; // 物流备注
          }
          params = {
            sendInfoDtoList: [
              obj
            ]
          };
           this._apis.order
            .orderSendGoods(params)
            .then(res => {
              this.$message.success('发货成功');
              this.sending = false
              // this.$router.push(
              //   "/order/deliverGoodsSuccess?id=" +
              //     res.success[0].expressParameter.orderSendInfo.id +
              //     "&type=deliverGoods"
              // );
              this.$router.push({
                path: '/order/deliverGoodsSuccess',
                query: {
                  id: res.success[0].expressParameter.orderSendInfo.id,
                  orderId: res.success[0].expressParameter.orderSendInfo.orderId,
                  type: 'deliverGoods',
                  print: this.express
                }
              })
            })
            .catch(error => {
              this.$message.error(error);
              this.sending = false
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeReceivedInfo() {
      this.currentDialog = "ReceiveInformationDialog";
      this.currentData = this.orderInfo;
      this.sendGoods = "received";
      this.title = "修改收货信息";
      this.dialogVisible = true;
    },
    changeSendInfo() {
      this.currentDialog = "ReceiveInformationDialog";
      this.currentData = this.orderInfo;
      this.sendGoods = "send";
      this.title = "修改发货信息";
      this.dialogVisible = true;
    },
    onSubmit(value) {
      this.orderInfo = Object.assign({}, this.orderInfo, value);
    },
    _orderDetail() {
      let id = this.$route.query.id || this.$route.query.ids;

      this._apis.order
        .orderSendDetail({ ids: [+this.$route.query.id || +this.$route.query.ids] })
        .then(res => {
          res[0].orderItemList.forEach(val => {
            val.cacheSendCount = val.sendCount;
            val.sendCount = val.goodsCount - val.sendCount;
          });
          res[0].orderItemList.forEach(val => {
            val.showError = false
            val.errorMessage = ''
          })
          this.tableData = res[0].orderItemList;
          this.orderInfo = res[0];

          this.fetchOrderAddress();

          //如果是商家配送，则需要请求拿到配送员列表
          if(this.orderInfo.deliveryWay == 2){
            this.getDistributorList();
          }
        })
        .catch(error => {});
    },
    getDetail() {
      this._orderDetail();
        // try {
        //   let ids = this.$route.query.ids || this.$route.query.id;
        //   let orderType = this.$route.query.orderType
        //   let sendType = this.$route.query.sendType

        //   let res = await this._apis.order.orderSendDetail({ ids: ids.split(',').map(val => +val) })

        //   if(res) {
        //     res.forEach(item => {
        //       if(sendType == 'more') {
        //         item.express = true
        //         item.other = "";
        //         item.checked = false;
        //         item.expressNos = "";
        //         item.expressCompanyCodes = "";
        //       }
        //       item.orderItemList.forEach(orderItem => {
        //         orderItem.cacheSendCount = orderItem.sendCount;
        //         orderItem.sendCount = orderItem.goodsCount - orderItem.sendCount;
        //         orderItem.showError = false
        //         orderItem.errorMessage = ''
        //         if(sendType == 'more') {
        //           orderItem.checked = false;
        //           orderItem.cacheSendCount = +orderItem.sendCount
        //           orderItem.sendCount = orderItem.goodsCount - orderItem.cacheSendCount;
        //         }
        //       });
        //     })

        //     this.fetchAddress(res)
        //   }
        // } catch(error) {

        // }
    },
    async fetchAddress(list) {
        try {
          let res = await this._apis.order.fetchOrderAddress({ id: this.cid, cid: this.cid })

          if(res) {
            list.forEach(item => {
              item.sendName = res.senderName;
              item.sendPhone = res.senderPhone;
              item.sendProvinceCode = res.provinceCode;
              item.sendProvinceName = res.province;
              item.sendCityCode = res.cityCode;
              item.sendCityName = res.city;
              item.sendAreaCode = res.areaCode;
              item.sendAreaName = res.area;
              item.sendDetail = res.address;
            })

            this.list = list
          }
        } catch(error) {

        }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  },
  components: {
    ReceiveInformationDialog
  }
};
</script>
<style lang="scss" scoped>
.deliver-goods {
  .blue {
    color: $globalMainColor;
  }
  background-color: #fff;
  padding: 20px;
  .deliver-goods-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
  }
  .container {
    padding-left: 60px;
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
  }
}
/deep/ .el-input {
  width: auto;
}
/deep/ .el-textarea {
  width: auto;
}
.footer {
  text-align: center;
  margin-top: 40px;
}
/deep/ label[for="expressCompanyCode"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
/deep/ .el-form-item.is-disabled {
  .el-form-item__error {
    display: none;
  }
  .el-input__inner {
    border: 1px solid #DCDFE6;
  }
}
.error-message {
  color: #FD4C2B;
  font-size: 12px;
  line-height: 1;
  padding-top: 2px;
  margin-bottom: 0;
}
/deep/ .el-form-item__label {
  font-weight: normal;
}
/deep/ .isIE.el-table {
  .el-checkbox {
    
  }
}
/deep/ .el-checkbox {
  display: inline-block;
  position: static;
  .el-checkbox__input {
    display: inline-block;
    position: static;
    .el-checkbox__inner {
      display: inline-block;
    }
  }
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
.shuaxin-fenlei {
    display: inline-flex;
    align-items: center;
    padding: 12px;
    width: 80px;
    height: 34px;
    color: #6ACEA8;
    background-color: #e6fbf3;
    i {
        margin-left: 12px;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('~@/assets/images/goods/renovate.png');
    }
}
.set-btn:hover {
    color: #444a51;
    text-decoration: underline;
}
</style>

