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
              :row-key="getRowKeys"
              :class="{isIE: utils.isIE(), disabledCheckAll: orderInfo.deliveryWay != 4,'disabled-table': checkboxAllTableMark}"
              ref="table"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
              :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
             >
              <el-table-column 
                type="selection" 
                width="51"
                :selectable="selectable"
                :reserve-selection="true"
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
              <el-table-column prop="sendCount" label="本次发货数量">
                <template slot-scope="scope">
                  <el-input
                    :class="{'send-input': scope.row.errorMessage}"
                    :disabled="orderInfo.deliveryWay == 4 || scope.row.goodsCount - scope.row.cacheSendCount == 0"
                    type="number"
                    step="1"
                    :max="scope.row.goodsCount - scope.row.cacheSendCount"
                    min="1"
                    @input="inputHandler(scope.$index)"
                    v-model="scope.row.sendCount"
                    @change="deliverNumberChange(scope.row.id, scope.row.sendCount)"
                  ></el-input>
                  <p v-if="scope.row.showError" class="error-message">{{scope.row.errorMessage}}</p>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="container-item">
        <template v-if="orderInfo.deliveryWay != 4">
          <p>2.确认收发货信息</p>
          <div class="container-item-content deliver-goods-address">
            <div class="title">
              <div class="title-list">
                <i class="take-in-icon"></i>
                <span>收货信息</span>
              </div>
              <div class="blue pointer" @click="changeReceivedInfo">修改收货信息</div>
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
              <div class="blue pointer" @click="changeSendInfo">修改发货信息</div>
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
        </template>
        <template v-else>
          <p>2.确认自提信息</p>
          <div class="container-item-content deliver-goods-address self-reference">
            <div class="title">
              <div class="title-list">
                <span>提货信息</span>
              </div>
            </div>
            <div class="content">
              <div class="item">
                <div class="label">提货人</div>
                <div class="value">{{orderInfo.receivedName}} {{orderInfo.receivedPhone}}</div>
              </div>
              <div class="item">
                <div class="label">自提点信息</div>
                <div class="value">{{orderInfo.pickUpName}} {{orderInfo.sendAddress}} {{orderInfo.sendDetail}}</div>
              </div>
              <div class="item">
                <div class="label">预约提货时间</div>
                <div class="value">{{(orderInfo.deliveryDate ? orderInfo.deliveryDate.split(' ')[0] : '') + ' ' + orderInfo.deliveryTime}}</div>
              </div>
            </div>
          </div>
        </template>
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
            <el-form-item label="快递公司" prop="expressCompanyCode" :class="{'is-disabled': express != null}">
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
            <el-form-item label="快递单号" prop="expressNos" :class="{'is-disabled': express != null}">
              <el-input :disabled="express != null" :placeholder="express != null ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" v-model="ruleForm.expressNos" maxlength="20"></el-input>
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
              <div class="pointer" v-show="distributorSet" style="display: inline-block; margin-left: 20px; margin-right: 10px;vertical-align:middle;">
                  <span class="shuaxin-fenlei" @click="getDistributorList">刷新<i></i></span>
              </div>
              <div class="prompt" style="display:inline-block;" v-show="isDistributorShow && distributorSet">
                <span>您尚未创建配送员信息，去</span><span class="set-btn blue pointer font12" @click="gotoSubaccountManage">创建子账号</span><span>绑定配送员角色。</span>
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
        <!-- 配送方式 上门自提 -->
        <div class="logistics deliver-goods-logistics" v-if="orderInfo.deliveryWay == 4">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
           >
            <el-form-item label="配送方式">
              <span>上门自提</span>
            </el-form-item>
            <el-form-item label="备注" prop="desc">
              <el-input type="textarea" v-model="ruleForm.sendRemark" placeholder="非必填，请输入，不超过100个字符" maxlength="100"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="footer">
        <el-button v-if="orderInfo.deliveryWay == 1 || orderInfo.deliveryWay == 4" :loading="sending" type="primary" @click="sendGoodsHandler('ruleForm')">发 货</el-button>
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
      :ajax="ajax"
      @getDetail="getDetail"
      :_ids="_ids"
      :orderSendGoodsHander="orderSendGoodsHander"
      :params="params"
      :list="_list"
      @cancel="cancel"
      :express="express"
      :multipleSelection="JSON.parse(JSON.stringify(multipleSelection))"
    ></component>
  </div>
</template>
<script>
import ReceiveInformationDialog from "@/views/order/dialogs/receiveInformationDialog";
import SelectSizeDialog from "@/views/order/dialogs/selectSizeDialog";

import { validatePhone } from "@/utils/validate.js"
import utils from "@/utils"

import { asyncRouterMap } from '@/router'
import { common, deliveryWay1, deliveryWay2 } from '@/views/order/mixins/orderMixin'

export default {
  mixins: [common, deliveryWay1, deliveryWay2],
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
      errorMessage: '',
      showError: false,
      _ids: [],
      checkboxAllTableMark:false
    };
  },
  created() {
    this.getDetail();
    this.getExpressCompanyList();
    this.checkSet()
  },
  computed: {
    afterSale() {
      if (this.$route.query.afterSale) {
        return true;
      } else {
        return false;
      }
    },
    // orderInfo: {
    //   get() {
    //     if(this.data.list && this.data.list.length) {
    //       return this.data.list[0]
    //     }
    //     return {}
    //   },
    //   set(val) {
    //     return val
    //   }
    // },
    // tableData: {
    //   get() {
    //     if(this.data.list && this.data.list[0] && this.data.list[0].orderItems) {
    //       return this.data.list[0].orderItems.map(item => ({
    //         ...item,
    //         showError: false,
    //         errorMessage: ''
    //       }))
    //     }
    //     return []
    //   },
    //   set(val) {
    //     return val
    //   }
    // }
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
    //新页面打开角色管理
    gotoRoleManage() {
        let routeData = this.$router.resolve({ path: '/set/roleManage' });
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
      if(this.orderInfo.deliveryWay == 4 || (row.goodsCount - row.cacheSendCount == 0)) {
        this.checkboxAllTableMark = true
        return false
      }
       this.checkboxAllTableMark = false
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
          if(this.express == null) {
              this.$set(this.rules, "expressNos", [
                { required: true, message: "请输入快递单号", trigger: "blur" }
              ]);
          } else {
            this.$set(this.rules, "expressNos", [
                { required: false, message: "请输入快递单号", trigger: "blur" }
              ]);
          }

          this._list.splice(0, 1, Object.assign({}, this._list[0], {
            expressCompanyCodes: this.ruleForm.expressCompanyCode,
            express: res
          }))
          console.log(this._list)
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
    fetchOrderAddress(address) {
      this.orderInfo.sendName = address.name;
      this.orderInfo.sendPhone = address.mobile;
      this.orderInfo.sendProvinceCode = address.provinceCode;
      this.orderInfo.sendProvinceName = address.provinceName;
      this.orderInfo.sendCityCode = address.cityCode;
      this.orderInfo.sendCityName = address.cityName;
      this.orderInfo.sendAreaCode = address.areaCode;
      this.orderInfo.sendAreaName = address.areaName;
      this.orderInfo.sendAddress = address.address;
      this.orderInfo.sendDetail = address.addressDetail;
      this.orderInfo.sendLatitude = address.latitude
      this.orderInfo.sendLongitude = address.longitude
    },
    fetchPickInfo(id) {
      this._apis.order
        .getPickInfo({ id })
        .then(res => {
          this.orderInfo.sendName = res.name;
          this.orderInfo.sendPhone = res.mobile;
          this.orderInfo.sendProvinceCode = res.provinceCode;
          this.orderInfo.sendProvinceName = res.provinceName;
          this.orderInfo.sendCityCode = res.cityCode;
          this.orderInfo.sendCityName = res.cityName;
          this.orderInfo.sendAreaCode = res.areaCode;
          this.orderInfo.sendAreaName = res.areaName;
          this.orderInfo.sendAddress = res.address;
          this.orderInfo.sendDetail = res.addressDetail;
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    // 订单详情 orderId
    // 电子面单 orderId
    // 配送单 id
    sendGoodsHandler(formName) {
      let reg = /^[1-9]\d*$/
      // 已选的商品数据
      var curItem=[]
      this.tableData.forEach(item => {
       if( this.multipleSelection.some(val => val.id== item.id))
        curItem.push(item)
      })
      curItem = this.multipleSelection.filter(val => Number(val.sendCount))
      if (!curItem.length) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "请选择需要发货的商品"
        });
        return;
      }
      if(this.multipleSelection.every(val => Number(val.sendCount) == 0)) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "请选择需要发货的商品"
        });
        return;
      }

      if (curItem.some(val => !Number(val.sendCount))) {        
        try {
          document.querySelector('.send-input').scrollIntoView()
          let scrollTop = document.querySelector('.content-main').scrollTop

          document.querySelector('.content-main').scrollTop = scrollTop - 8
        }catch(e) {
          console.error(e)
        }
        return;
      }

      if (curItem.some(val => +Number(val.sendCount) > Number(val.goodsCount))) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "本次发货数量不能大于应发数量"
        });
        return;
      }
      if (curItem.some(val => +Number(val.sendCount) <= 0 || !reg.test(Number(val.sendCount)))) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "仅支持输入非负的正整数"
        });
        return;
      }
     
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params;

          //如果是普通快递
          if(formName == 'ruleForm'){
            if(this.orderInfo.deliveryWay != 4) {
              if(this.ruleForm.expressCompanyCode == 'other') {
                this.ruleForm.expressCompany = this.ruleForm.other
              } else {
                this.ruleForm.expressCompany = this.expressCompanyList.find(
                  val => val.expressCompanyCode == this.ruleForm.expressCompanyCode
                ).expressCompany;
              }
            }
          }
          

          this.sending = true
          let obj = {
                orderId: this.$route.query.orderId || this.$route.query.id || this.$route.query.ids, // 订单id
                memberInfoId: this.orderInfo.memberInfoId,
                orderCode: this.orderInfo.orderCode,
                orderItems: curItem.map(val => ({
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

          
          if(formName == 'ruleForm'){
            //如果是普通快递
            if(this.orderInfo.deliveryWay != 4) {
              obj.deliveryWay = 1;
              obj.expressCompanys = this.ruleForm.expressCompany; // 快递公司名称
              obj.expressNos = this.ruleForm.expressNos; // 快递单号
              obj.expressCompanyCodes = this.ruleForm.expressCompanyCode; // 快递公司编码
              obj.remark = this.ruleForm.remark; // 发货备注
              obj.sendRemark = this.ruleForm.sendRemark; // 发货备注
              if(this.orderInfo.deliveryWay == 1) {
                if(this.express && this.express.specificationSize) {
                  obj.specificationSize = this.express.specificationSize
                }
              }
            } else {
              //上门自提
              obj.deliveryWay = 4;
              obj.sendRemark = this.ruleForm.sendRemark; // 发货备注
              obj.verifyCode = this.orderInfo.verifyCode
              obj.pickId = this.orderInfo.pickId
            }
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
          this.params = params
          if(this.orderInfo.deliveryWay == 1 && this.express != null && !this.express.sizeSpecs) {
            try {
              let res = await this._apis.order.getExpressSpec({ companyCode: this.ruleForm.expressCompanyCode, cid: this.cid })

              console.log(res)
              if(res && res.length) {
                this._list[0].sizeList = res.map(item => ({
                  ...item,
                  sizeSpecs: item.sizeSpecs + ' ' + item.templateSize,
                  templateSize: `${item.sizeSpecs} ${item.templateSize}`
                }))
                this.currentData = {
                  list: this._list,
                  expressCompanyList: this.expressCompanyList
                }
                this.currentDialog = 'SelectSizeDialog'
                this.title = '提示'
                this.dialogVisible = true
              } else {
                this.orderSendGoodsHander(params)
              }
            } catch(e) {
              this.$message.error(error);
            }
          } else {
            this.orderSendGoodsHander(params)
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    orderSendGoodsHander(params) {
      this._apis.order
        .orderSendGoods(params)
        .then(res => {
          this.$message.success('发货成功');
          this.sending = false
          this.$router.push({
            path: '/order/deliverGoodsSuccess',
            query: {
              id: res.success[0].expressParameter.orderSendInfo.id,
              orderId: res.success[0].expressParameter.orderSendInfo.orderId,
              type: 'deliverGoods',
              print: this.express + ''
            }
          })
        })
        .catch(error => {
          this.$message.error(error);
          this.sending = false
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
    _orderDetail(selectArr) {
      let id = this.$route.query.id || this.$route.query.ids;

      this._apis.order
        .orderSendDetail({ ids: [+this.$route.query.id || +this.$route.query.ids] })
        .then(res => {
          if(res instanceof Array) {
            res[0].orderItemList.forEach(val => {
              val.cacheSendCount = val.sendCount;
              val.sendCount = val.goodsCount - val.sendCount;
            });
            res[0].orderItemList.forEach(val => {
              val.showError = false
              val.errorMessage = ''
            })
            this.tableData = res[0].orderItemList;
            this.tableData.forEach(row => {
              this.$refs.table.toggleRowSelection(row);
            })
            this.orderInfo = res[0];
            this._ids = [this.orderInfo.id]
            if(this.orderInfo.deliveryWay == 1) {
              this.fetchOrderAddress();
            }

            //如果是商家配送，则需要请求拿到配送员列表
            if(this.orderInfo.deliveryWay == 2){
              this.getDistributorList();
            }
          } else {
            let _address = res.shopAddressInfo

            this.shopAddressInfo = res.shopAddressInfo
            res = res.sendInfoListData
            res[0].orderItemList.forEach(val => {
              val.cacheSendCount = val.sendCount;
              val.sendCount = val.goodsCount - val.sendCount;
            });
            res[0].orderItemList.forEach(val => {
              val.showError = false
              val.errorMessage = ''
            })
            res[0].pickUpName = ''
            this._list = JSON.parse(JSON.stringify(res))
            this.tableData = res[0].orderItemList;
            this.tableData.forEach(row => {
              this.$refs.table.toggleRowSelection(row);
            })
            setTimeout(() => {
              if(selectArr) {
                this.$refs.table.clearSelection();
                selectArr.forEach((row, index) => {
                  this.$refs.table.toggleRowSelection(this.tableData[index]);
                });
              }
            }, 0)
            this.orderInfo = res[0];
            if(this.orderInfo.deliveryWay == 4) {
              let pickId = this.orderInfo.pickId

              this._apis.order
              .getPickInfo({id: pickId})
              .then(res => {
                this.orderInfo.pickUpName = res.pickUpName
              })
              .catch(error => {
                this.$message.error(error);
              });
            }
            this._ids = [this.orderInfo.id]
            if(!this.orderInfo.sendAddress) {
              if(this.orderInfo.deliveryWay == 1 || this.orderInfo.deliveryWay == 2) {
                this.fetchOrderAddress(_address);
              } else if(this.orderInfo.deliveryWay == 4) {
                this.fetchPickInfo(this.orderInfo.pickId)
              }
            }

            //如果是商家配送，则需要请求拿到配送员列表
            if(this.orderInfo.deliveryWay == 2){
              this.getDistributorList();
            }
          }

          if(this.orderInfo.deliveryWay == 4) {
            this.$nextTick(() => {
              document.querySelector('.disabledCheckAll thead .el-checkbox').setAttribute('class', 'el-checkbox is-disabled')
              document.querySelector('.disabledCheckAll thead .el-checkbox__input').setAttribute('class', 'el-checkbox__input is-disabled')
              document.querySelector('.disabledCheckAll thead .el-checkbox__original').setAttribute('disabled', 'disabled')
              document.querySelector('.disabledCheckAll thead').addEventListener('click', function () {
                event.stopImmediatePropagation()
              }, true)
            })
          }
        })
        .catch(error => {});
    },
    getDetail(selectArr) {
      this._orderDetail(selectArr);
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
              item.latitude = res.latitude;
              item.longitude = res.longitude
            })

            this.list = list
          }
        } catch(error) {

        }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    getRowKeys(row){
  		return row.id;
    },
    
    //本次发货数量发生变更
    deliverNumberChange(id, value) {
      const temp = [...this.multipleSelection];
      for(let item of this.multipleSelection) {
        if(item.id === id) {
          item['sendCount'] = value;
        }
      }
      this.multipleSelection = temp;
    }
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {
          deliveryWay: 1,
          list: [],
        }
      }
    }
  },
  components: {
    ReceiveInformationDialog,
    SelectSizeDialog
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
          height: 50px;
          line-height: 50px;
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
            background: url(../../../assets/images/order/deliver.png);
          }
          .take-in-icon {
            background: url(../../../assets/images/order/take-in-icon.png);
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
/deep/ .el-table td, /deep/ .el-table th {
    text-align: center;
    &:nth-child(2) {
        text-align: left;
    }
    &:nth-child(3) {
        text-align: left;
    }
}
.el-table-column--selection .cell {
    padding-left: 20px;
    padding-right: 15px;
}
/deep/ .el-table table .cell {
  padding-left: 0;
  padding-right: 0;
}
/deep/ .el-table table tbody tr td:nth-child(2) {
  padding-left: 10px;
}
/deep/ .el-table thead tr th {
  border-bottom: none;
}
/deep/ .deliver-goods-logistics .el-textarea {
  width: 623px;
  height: 99px;
}
.deliver-goods .deliver-goods-address.self-reference .content .item .label {
    width: 84px;
}
.disabled-table {
  /deep/ thead {
    /deep/ .el-checkbox__inner {
      background-color: #F2F6FC;
      border-color: #DCDFE6;
    }
    /deep/ th:first-child /deep/.cell::after {
      z-index: 1;
      position: absolute;
      width: 100%;
      height: 100%;
      content: "";
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0);
      cursor: not-allowed;
    }
    /deep/.el-checkbox__inner::after{
      border-color: #B6B5C9;
    }
  }
}
</style>

