<template>
    <div class="deliver-goods mh">
        <div class="deliver-goods-header">
            <div class="item">售后发货</div>
            <div class="item"><el-button @click="$router.go(-1)">返 回</el-button></div>
        </div>
        <div class="container">
            <div class="container-item">
                <p>1. 选择您要进行发货的商品及数量</p>
                <div class="container-item-content">
                    <div class="title">
                        <div>
                            <span>商品清单</span>
                            <span>售后单编号 {{orderAfterSaleSendInfo.orderAfterSaleCode}}</span>
                        </div>
                    </div>
                    <div class="content">
                        <el-table
                            ref="table"
                            :data="itemList"
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                label="序号"
                                width="180">
                                <template slot-scope="scope">
                                    <span>{{scope.$index + 1}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="商品"
                                width="380">
                                <template slot-scope="scope">
                                    <div class="goods-detail">
                                        <div class="goods-detail-item">
                                            <img width="66" :src="scope.row.goodsImage" alt="">
                                        </div>
                                        <div class="goods-detail-item">
                                            <p class="ellipsis" style="width: 300px;" :title="scope.row.goodsName">{{scope.row.goodsName}}</p>
                                            <p>{{scope.row.goodsSpces | goodsSpecsFilter}}</p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="afterSaleCount"
                                label="应发数量">
                            </el-table-column>
                            <el-table-column
                                prop="afterSaleCount"
                                label="本次发货数量">
                                <template slot-scope="scope">
                                    <el-input :disabled="true"  v-model="scope.row.afterSaleCount"></el-input>
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
                            <div class="value">{{orderAfterSaleSendInfo.receivedName}}</div>
                        </div>
                        <div class="item">
                            <div class="label">联系电话</div>
                            <div class="value">{{orderAfterSaleSendInfo.receivedPhone}}</div>
                        </div>
                        <div class="item">
                            <div class="label">收货信息</div>
                            <div class="value">{{orderAfterSaleSendInfo.receiveAddress}} {{orderAfterSaleSendInfo.receivedDetail}}</div>
                        </div>
                    </div>
                </div>
                <div class="container-item-content deliver-goods-address">
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
                            <div class="value">{{orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendName}}</div>
                        </div>
                        <div class="item">
                            <div class="label">联系电话</div>
                            <div class="value">{{orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendPhone}}</div>
                        </div>
                        <div class="item">
                            <div class="label">发货信息</div>
                            <div class="value" v-if="orderAfterSaleSendInfo">{{orderAfterSaleSendInfo.sendAddress}} {{orderAfterSaleSendInfo.sendDetail}}</div>
                            <div class="value" v-else>--</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-item">
                <p>3.填写物流信息</p>
                <div class="logistics deliver-goods-logistics" v-if="orderAfterSaleSendInfo.deliveryWay == 1 || orderAfterSaleSendInfo.deliveryWay == 3 || orderAfterSaleSendInfo.deliveryWay == 4">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="配送方式">
                            <span>普通快递</span>
                        </el-form-item>
                        <el-form-item label="快递公司" prop="expressCompanyCode">
                            <el-select filterable @change="checkExpress" v-model="ruleForm.expressCompanyCode" placeholder="请选择">
                                <el-option :label="item.expressCompany" :value="item.expressCompanyCode" v-for="(item, index) in expressCompanyList" :key="index"></el-option>
                            </el-select>
                            <el-input v-if="ruleForm.expressCompanyCode == 'other'" v-model="ruleForm.other" placeholder="请输入快递公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressNos" :class="{'is-disabled': express != null}">
                            <el-input :disabled="express != null" v-model="ruleForm.expressNos" :placeholder="express != null ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="物流备注" prop="remark">
                            <el-input
                                style="width: 623px;"
                                type="textarea"
                                :rows="2"
                                maxlength="100"
                                placeholder="非必填，请输入，不超过100个字符"
                                v-model="ruleForm.remark">
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <!-- 配送方式为商家配送 -->
                <div class="logistics deliver-goods-logistics" v-if="orderAfterSaleSendInfo.deliveryWay == 2">
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
                    <span>{{orderAfterSaleSendInfo.deliveryDate | formatDateRemoveZero}} {{orderAfterSaleSendInfo.deliveryTime}}</span>
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
                        <span class="shuaxin-fenlei" @click="getDistributorList">刷新<i></i></span>
                    </div>
                    <div class="prompt" style="display:inline-block;" v-show="isDistributorShow && distributorSet">
                        <span>您尚未创建配送员信息，去</span><span class="set-btn blue pointer font12" @click="gotoSubaccountManage">创建子账号</span><span>绑定配送员角色。</span>
                    </div>
                    </el-form-item>
                    <el-form-item label="联系方式" prop="phone">
                    <el-input placeholder="请输入配送员手机号码" v-model="ruleFormStore.phone"></el-input>
                    </el-form-item>
                    <el-form-item label="物流备注" prop="remark">
                    <el-input
                        style="width: 623px;"
                        type="textarea"
                        :rows="2"
                        maxlength="100"
                        placeholder="非必填，请输入，不超过100个字符"
                        v-model="ruleFormStore.remark"
                    ></el-input>
                    </el-form-item>
                </el-form>
                </div>
            </div>
            <div class="footer">
                <el-button v-if="orderAfterSaleSendInfo.deliveryWay == 1 || orderAfterSaleSendInfo.deliveryWay == 3 || orderAfterSaleSendInfo.deliveryWay == 4" :loading="sending" type="primary" @click="sendGoodsHandler('ruleForm')">发 货</el-button>
                <el-button v-if="orderAfterSaleSendInfo.deliveryWay == 2" :loading="sending" type="primary" @click="sendGoodsHandler('ruleFormStore')">发 货</el-button>
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
            :orderSendGoodsHander="orderSendGoodsHander"
            :params="params"
            :list="_list"
            @cancel="cancel"
            :express="express"
            @getDetail="getOrderDetail"
            :multipleSelection="JSON.parse(JSON.stringify(multipleSelection))">
        </component>
    </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'
import SelectSizeDialog from "@/views/order/dialogs/selectSizeDialog";

import { validatePhone } from "@/utils/validate.js"

import { asyncRouterMap } from '@/router'
import { common, deliveryWay1, deliveryWay2 } from '@/views/order/mixins/sendGoodsMixin'

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
            tableData: [
                
            ],
            multipleSelection: [],
            ruleForm: {
                name: '',
                number: '',
                remark: '',
                expressCompanyCode: '',
                expressCompany: '',
                expressNos: '',
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
                remark: ""
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
            itemList: [],
            orderAfterSaleSendInfo: {},
            isReceived: true,
        }
    },
    created() {
        this.getOrderDetail()
        this.getExpressCompanyList()
        this.checkSet()
    },
    computed: {
        afterSale() {
            if(this.$route.query.afterSale) {
                return true
            } else {
                return false
            }
        },
    },
    methods: {
        fetchOrderAddress() {
    //   this.$store.dispatch('getShopInfo').then(res => {
    //       this.orderAfterSaleSendInfo.sendName = res.senderName;
    //       this.orderAfterSaleSendInfo.sendPhone = res.senderPhone;
    //       this.orderAfterSaleSendInfo.sendProvinceCode = res.provinceCode;
    //       this.orderAfterSaleSendInfo.sendProvinceName = res.province;
    //       this.orderAfterSaleSendInfo.sendCityCode = res.cityCode;
    //       this.orderAfterSaleSendInfo.sendCityName = res.city;
    //       this.orderAfterSaleSendInfo.sendAreaCode = res.areaCode;
    //       this.orderAfterSaleSendInfo.sendAreaName = res.area;
    //       this.orderAfterSaleSendInfo.sendAddress = res.sendAddress;
    //       this.orderAfterSaleSendInfo.sendDetail = res.address;
    //     })
    //     .catch(error => {
    //       this.visible = false;
    //       this.$message.error(error);
    //     });
        this._apis.order
        .getShopSendAddress({ cid: this.cid })
        .then(res => {
          this.shopAddressInfo = res
          if(res) {
              this.orderAfterSaleSendInfo.sendName = res.name;
                this.orderAfterSaleSendInfo.sendPhone = res.mobile;
                this.orderAfterSaleSendInfo.sendProvinceCode = res.provinceCode;
                this.orderAfterSaleSendInfo.sendProvinceName = res.provinceName;
                this.orderAfterSaleSendInfo.sendCityCode = res.cityCode;
                this.orderAfterSaleSendInfo.sendCityName = res.cityName;
                this.orderAfterSaleSendInfo.sendAreaCode = res.areaCode;
                this.orderAfterSaleSendInfo.sendAreaName = res.areaName;
                this.orderAfterSaleSendInfo.sendAddress = res.address;
                this.orderAfterSaleSendInfo.sendDetail = res.addressDetail;
                this.orderAfterSaleSendInfo.sendLatitude = res.latitude;
                this.orderAfterSaleSendInfo.sendLongitude = res.longitude;
          } else {
              this.orderAfterSaleSendInfo.sendName = '';
                this.orderAfterSaleSendInfo.sendPhone = '';
                this.orderAfterSaleSendInfo.sendProvinceCode = '';
                this.orderAfterSaleSendInfo.sendProvinceName = '';
                this.orderAfterSaleSendInfo.sendCityCode = '';
                this.orderAfterSaleSendInfo.sendCityName = '';
                this.orderAfterSaleSendInfo.sendAreaCode = '';
                this.orderAfterSaleSendInfo.sendAreaName = '';
                this.orderAfterSaleSendInfo.sendAddress = '';
                this.orderAfterSaleSendInfo.sendDetail = '';
                this.orderAfterSaleSendInfo.sendLatitude = ''
                this.orderAfterSaleSendInfo.sendLongitude = ''
          }
        })
        .catch(error => {
          this.visible = false;
          this.$message.error(error);
        });
    },
        sendGoodsHandler(formName) {
            let params
            //如果是普通快递
            if(formName == 'ruleForm'){
                if(!this.ruleForm.expressCompanyCode) {
                    this.confirm({icon: true, text: '请选择快递公司'})
                    return
                }
            }

            if(!this.multipleSelection.length) {
                this.confirm({icon: true, text: '请选择需要发货的商品'})
                return
            }

            // if(this.orderAfterSaleSendInfo.deliveryWay == 1) {
            //     if(!this.shopAddressInfo) {
            //     this.confirm({
            //         title: "提示",
            //         icon: true,
            //         text: "发货信息不能为空"
            //     });
            //     return;
            //     }
            // }

            this.$refs[formName].validate(async (valid) => {
                if (valid) {

                    //如果是普通快递
                    if(formName == 'ruleForm'){
                        if(this.ruleForm.expressCompanyCode == 'other') {
                            this.ruleForm.expressCompany = this.ruleForm.other
                        } else {
                            this.ruleForm.expressCompany = this.expressCompanyList.find(val => val.expressCompanyCode == this.ruleForm.expressCompanyCode).expressCompany
                        }
                    }

                    this.sending = true
                    let obj = {
                                orderAfterSaleId: this.$route.query.ids || this.$route.query.id,
                                memberInfoId: this.orderAfterSaleSendInfo.memberInfoId,
                                orderAfterSaleCode: this.orderAfterSaleSendInfo.orderAfterSaleCode,
                                receivedName: this.orderAfterSaleSendInfo.receivedName,
                                receivedPhone: this.orderAfterSaleSendInfo.receivedPhone,
                                receivedProvinceCode: this.orderAfterSaleSendInfo.receivedProvinceCode,
                                receivedProvinceName: this.orderAfterSaleSendInfo.receivedProvinceName,
                                receivedCityCode: this.orderAfterSaleSendInfo.receivedCityCode,
                                receivedCityName: this.orderAfterSaleSendInfo.receivedCityName,
                                receivedAreaCode: this.orderAfterSaleSendInfo.receivedAreaCode,
                                receivedAreaName: this.orderAfterSaleSendInfo.receivedAreaName,
                                receiveAddress: this.orderAfterSaleSendInfo.receiveAddress,
                                sendAddress: this.orderAfterSaleSendInfo.sendAddress,
                                receivedDetail: this.orderAfterSaleSendInfo.receivedDetail,
                                sendName: this.orderAfterSaleSendInfo.sendName,
                                sendPhone: this.orderAfterSaleSendInfo.sendPhone,
                                sendProvinceCode: this.orderAfterSaleSendInfo.sendProvinceCode,
                                sendProvinceName: this.orderAfterSaleSendInfo.sendProvinceName,
                                sendCityCode: this.orderAfterSaleSendInfo.sendCityCode,
                                sendCityName: this.orderAfterSaleSendInfo.sendCityName,
                                sendAreaCode: this.orderAfterSaleSendInfo.sendAreaCode,
                                sendAreaName: this.orderAfterSaleSendInfo.sendAreaName,
                                sendDetail: this.orderAfterSaleSendInfo.sendDetail
                            };
                    //如果是普通快递
                    if(formName == 'ruleForm'){
                        if(this.orderAfterSaleSendInfo.deliveryWay != 4) {
                            if(this.orderAfterSaleSendInfo.deliveryWay == 1 || this.orderAfterSaleSendInfo.deliveryWay == 3) {
                                obj.deliveryWay = 1;
                                obj.expressCompanys = this.ruleForm.expressCompany; // 快递公司名称
                                obj.expressNos = this.ruleForm.expressNos; // 快递单号
                                obj.expressCompanyCodes = this.ruleForm.expressCompanyCode; // 快递公司编码
                                obj.remark = this.ruleForm.remark; // 发货备注
                                if(this.express && this.express.specificationSize) {
                                    obj.specificationSize = this.express.specificationSize
                                }
                            }
                        } else {
                            obj.deliveryWay = 1;
                            obj.expressCompanys = this.ruleForm.expressCompany; // 快递公司名称
                            obj.expressNos = this.ruleForm.expressNos; // 快递单号
                            obj.expressCompanyCodes = this.ruleForm.expressCompanyCode; // 快递公司编码
                            obj.remark = this.ruleForm.remark; // 发货备注
                            if(this.express && this.express.specificationSize) {
                                obj.specificationSize = this.express.specificationSize
                            }
                        }
                      }else if(formName == 'ruleFormStore'){ //如果是商家配送
                        obj.deliveryWay = 2;
                        obj.distributorName = this.distributorName; //配送员名字
                        //obj.distributorId = this.distributorId; //配送员id，自己输入的新的名字没有id
                        obj.distributorPhone = this.ruleFormStore.phone; //配送员手机号
                        obj.remark = this.ruleFormStore.remark; // 物流备注
                    }
                    params = {
                        orderAfterSaleSendInfoDtoList: [
                            obj
                        ],
                    }
                    this.params = params
                    if(this.express != null && !this.express.sizeSpecs) {
                        try {
                        let res = await this._apis.order.getExpressSpec({ companyCode: this.ruleForm.expressCompanyCode, cid: this.cid })

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
                    console.error('error submit!!');
                    return false;
                }
            });
        },
        orderSendGoodsHander(params) {
            this._apis.order.orderAfterSaleSend(params).then((res) => {
                this.$message.success('发货成功');
                this.sending = false
                this.$router.push({
                    path: '/order/deliverGoodsSuccess',
                    query: {
                        id: this.$route.query.ids || this.$route.query.id,
                        type: 'orderAfterDeliverGoods',
                        print: this.express + ''
                    }
                })
            }).catch(error => {
                this.$message.error(error);
                this.sending = false
            })
        },
        changeReceivedInfo() {
            this.currentDialog = 'ReceiveInformationDialog'
            this.currentData = this.orderAfterSaleSendInfo
            this.isReceived = true
            this.title = '修改收货信息'
            this.sendGoods = 'received'
            this.dialogVisible = true
        },
        changeSendInfo() {
            this.currentDialog = 'ReceiveInformationDialog'
            this.currentData = this.orderAfterSaleSendInfo
            this.isReceived = false
            this.title = '修改发货信息'
            this.sendGoods = 'send'
            this.dialogVisible = true
        },
        onSubmit(value) {
            this.orderAfterSaleSendInfo = Object.assign({}, this.orderAfterSaleSendInfo, value)
            // if(this.sendGoods == 'send') {
            //     this.orderAfterSaleSendInfo = Object.assign({}, this.orderAfterSaleSendInfo, {
            //         sendName: value.sendName,
            //         sendPhone: value.sendPhone,
            //         sendAddress: value.sendAddress,
            //         sendDetail: value.sendDetail,
            //         sendAreaCode: value.tencentCode,
            //         sendLatitude: value.sendLatitude,
            //         sendLongitude: value.sendLongitude
            //     })
            //     this.shopAddressInfo = true
            // } else {
                
            // }
        },
        getOrderDetail(selectArr) {
            this._apis.order.orderAfterSaleDetail({orderAfterSaleIds: [this.$route.query.ids || this.$route.query.id]}).then((res) => {
                this._list = JSON.parse(JSON.stringify(res))
                this.itemList = res[0].itemList
                this.$nextTick(() => {
                    this.itemList.forEach((row, index) => {
                        this.$refs.table.toggleRowSelection(this.itemList[index]);
                    })
                })
                setTimeout(() => {
                    if(selectArr) {
                        this.$refs.table.clearSelection();
                        selectArr.forEach((row, index) => {
                            this.$refs.table.toggleRowSelection(this.itemList[index]);
                        });
                    }
                }, 0)
                this.orderAfterSaleSendInfo = res[0].orderAfterSaleSendInfo
                if(!this.orderAfterSaleSendInfo.sendAddress) {
                    if(this.orderAfterSaleSendInfo.deliveryWay == 1 || this.orderAfterSaleSendInfo.deliveryWay == 2 || this.orderAfterSaleSendInfo.deliveryWay == 3 || this.orderAfterSaleSendInfo.deliveryWay == 4) {
                        this.fetchOrderAddress();
                    }
                }
                // if(this.orderAfterSaleSendInfo.deliveryWay == 1) {
                //     this.fetchOrderAddress();
                // }

                this.orderDetail = res[0];
                //如果是商家配送，则需要请求拿到配送员列表
                if(this.orderAfterSaleSendInfo.deliveryWay == 2){
                    this.getDistributorList();
                }
            }).catch(error => {
                this.$message.error(error);
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    },
    components: {
        ReceiveInformationDialog,
        SelectSizeDialog
    }
}
</script>
<style lang="scss" scoped>
    .deliver-goods {
        color: #333;
        .blue {
            color: $globalMainColor;
        }
        background-color: #fff;
        padding: 20px;
        border-radius: 4px;
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
                                color: #9FA29F;
                            }
                        }
                    }
                }
            }
        }
    }
    /deep/ .el-input  {
        width: auto;
    }
    /deep/ .el-textarea {
        width: auto;
    }
    .footer {
        text-align: center;
        margin-top: 40px;
    }
    .goods-detail {
        display: flex;
        .goods-detail-item:last-child {
            p {
                margin-bottom: 6px;
            }
        }
    }
    /deep/ label[for="expressCompanyCode"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
.goods-detail-item {
    margin-right: 10px;
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
/deep/ .el-form-item.is-disabled {
  .el-form-item__error {
    display: none;
  }
  .el-input__inner {
    border: 1px solid #DCDFE6;
  }
}
</style>

