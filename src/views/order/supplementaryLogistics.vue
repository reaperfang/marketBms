<template>
    <div class="deliver-goods mh">
        <div class="deliver-goods-header">
            <div class="item">补填物流信息</div>
            <div class="item"><el-button @click="$router.go(-1)">返 回</el-button></div>
        </div>
        <div class="container">
            <div class="container-item">
                <p>1. 选择您要进行补填物流的商品及数量</p>
                <div class="container-item-content">
                    <div class="title">
                        <div>
                            <span>商品清单</span>
                            <span>订单编号 {{orderInfo.code}}</span>
                        </div>
                    </div>
                    <div class="content">
                        <el-table
                            ref="table"
                            :data="tableData"
                            style="width: 100%"
                            @selection-change="handleSelectionChange"
                            :header-cell-style="{background:'#F6F7FA', color:'#44434B'}">
                            <el-table-column
                                label="序号"
                                 width="100" fixed="left" class-name="table-padding">
                                <template slot-scope="scope">
                                    <span>{{scope.$index + 1}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="商品">
                                <template slot-scope="scope">
                                    <div class="goods-detail">
                                        <div class="goods-detail-item">
                                            <img width="66" :src="scope.row.goodsImage" alt="">
                                        </div>
                                        <div class="goods-detail-item">
                                            <p :title="scope.row.goodsName" class="ellipsis">{{scope.row.goodsName}}</p>
                                            <p>{{scope.row.goodsSpecs | goodsSpecsFilter}}</p>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="goodsCount"
                                label="应发数量"
                                width="120"
                                 align="right">
                            </el-table-column>
                            <!-- <el-table-column
                                prop="realityNumber"
                                label="可发货数量">
                            </el-table-column> -->
                            <el-table-column
                                prop="sendCount" fixed="right" align="center" class-name="table-padding"
                                label="本次发货数量">
                                <template slot-scope="scope">
                                    <el-input :disabled="true" v-model="scope.row.sendCount"></el-input>
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
                            <div class="value">{{orderInfo.receiveAddress}} {{orderInfo.receivedDetail}}
                            </div>
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
                            <div class="value">{{orderInfo.sendAddress}} {{orderInfo.sendDetail}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-item">
                <p>3.填写物流信息</p>
                <div class="logistics deliver-goods-logistics" v-if="orderInfo.deliveryWay == 1">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="配送方式">
                            <span>普通快递</span>
                        </el-form-item>
                        <el-form-item label="快递公司" prop="expressCompanyCode" :class="{'is-disabled': express != null}">
                            <el-select filterable @change="checkExpress" v-model="ruleForm.expressCompanyCode" placeholder="请选择">
                                <el-option :label="item.expressCompany" :value="item.expressCompanyCode" v-for="(item, index) in expressCompanyList" :key="index"></el-option>
                            </el-select>
                            <el-input v-if="ruleForm.expressCompanyCode == 'other'" v-model="ruleForm.other" placeholder="请输入快递公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressNos" :class="{'is-disabled': express != null}">
                            <el-input maxlength="20" :disabled="express != null" :placeholder="express != null ? '已开通电子面单，无需输入快递单号' : '请输入快递单号'" v-model="ruleForm.expressNos"></el-input>
                        </el-form-item>
                        <el-form-item label="物流备注" prop="remark">
                            <el-input
                                style="width: 623px;"
                                type="textarea"
                                :rows="2"
                                placeholder="非必填，请输入，不超过100个字符"
                                v-model="ruleForm.remark">
                            </el-input>
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
                <!-- <el-button class="border-button" @click="printingElectronicForm">打印电子面单</el-button>
                <el-button class="border-button" @click="printDistributionSheet">打印配送单</el-button> -->
                <el-button v-if="orderInfo.deliveryWay == 1" :loading="sending" type="primary" @click="sendGoodsHandler('ruleForm')">确定</el-button>
                <el-button v-if="orderInfo.deliveryWay == 2" :loading="sending" type="primary" @click="sendGoodsHandler('ruleFormStore')">确定</el-button>
            </div>
        </div>
        <component 
            v-if="dialogVisible" 
            :is="currentDialog" 
            :dialogVisible.sync="dialogVisible" 
            :data="currentData" 
            @submit="onSubmit" 
            :sendGoods="sendGoods" 
            :ajax="ajax" 
            @getDetail="getOrderDetail"
            :orderSendGoodsHander="orderSendGoodsHander"
            :params="params"
            :list="_list"
            :_ids="_ids"
            @cancel="cancel">
        </component>
    </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'

import { validatePhone } from "@/utils/validate.js"

import { asyncRouterMap } from '@/router'
import SelectSizeDialog from "@/views/order/dialogs/selectSizeDialog";
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
            orderInfo: {},
            orderSendInfo: {},
            title: '',
            express: null,
            _ids: [],
        }
    },
    created() {
        this.getOrderDetail()
        this.getExpressCompanyList()

        this.checkSet();
    },
    computed: {
        afterSale() {
            if(this.$route.query.afterSale) {
                return true
            } else {
                return false
            }
        }
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
            } else {
            this.distributorList = this.distributorListFilter;
            }
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
        fetchOrderAddress(address) {
            // this.$store.dispatch('getShopInfo').then((res) => {
            //     this.orderInfo.sendName = res.senderName
            //     this.orderInfo.sendPhone = res.senderPhone
            //     this.orderInfo.sendProvinceCode = res.provinceCode
            //     this.orderInfo.sendProvinceName = res.province
            //     this.orderInfo.sendCityCode = res.cityCode
            //     this.orderInfo.sendCityName = res.city
            //     this.orderInfo.sendAreaCode = res.areaCode
            //     this.orderInfo.sendAreaName = res.area
            //     this.orderInfo.sendAddress = res.sendAddress
            //     this.orderInfo.sendDetail = res.address
            // }).catch(error => {
            //     this.visible = false
            //     this.$message.error(error);
            // })
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
          this.orderInfo.sendLatitude = address.latitude;
          this.orderInfo.sendLongitude = address.longitude
        },
        printDistributionSheet() {
            this.$router.push('/order/printDistributionSheet?ids=' + this.orderInfo.id + '&type=supplementaryLogistics')
        },
        printingElectronicForm() {
            this.$router.push('/order/printingElectronicForm?ids=' + this.orderInfo.id + '&type=supplementaryLogistics')
        },
        sendGoodsHandler(formName) {
            // if(this.orderInfo.deliveryWay == 1) {
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
                    let params

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
                        orderId: this.$route.query.orderId || this.$route.query.ids || this.$route.query.id, // 订单id
                        memberInfoId: this.orderInfo.memberInfoId,
                        orderCode: this.orderInfo.orderCode,
                        orderItems: this.tableData.map(val => ({
                            id: val.id,
                            sendCount: val.goodsCount
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
                        sendDetail: this.orderInfo.sendDetail, // 发货人详细地址
                    };
                    //如果是普通快递
                    if(formName == 'ruleForm'){
                        obj.deliveryWay = 1;
                        obj.expressCompanys = this.ruleForm.expressCompany; // 快递公司名称
                        obj.expressNos = this.ruleForm.expressNos; // 快递单号
                        obj.expressCompanyCodes = this.ruleForm.expressCompanyCode; // 快递公司编码
                        obj.remark = this.ruleForm.remark; // 发货备注
                        if(this.orderInfo.deliveryWay == 1) {
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
                        sendInfoDtoList: [
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
            this._apis.order.orderSendGoods(params).then((res) => {
                this.$message.success('补填物流成功');
                this.sending = false
                this.$router.push('/order/query')
            }).catch(error => {
                this.$message.error(error);
                this.sending = false
            })
        },
        onSubmit(value) {
            //this.getOrderDetail()
            this.orderInfo = Object.assign({}, this.orderInfo, value)
        },
        _orderDetail() {
            let id = this.$route.query.ids

            this._apis.order.orderSendDetail({ids: [this.$route.query.ids || this.$route.query.id]}).then((res) => {
                let _address = res.shopAddressInfo

                this.shopAddressInfo = res.shopAddressInfo
                res = res.sendInfoListData
                res[0].orderItemList.forEach(val => {
                    val.sendCount =  val.goodsCount
                })
                this.orderDetail = res[0]
                this.orderSendInfo = res[0]
                this._list = res
                this.tableData = res[0].orderItemList
                this.orderInfo = res[0]
                this._ids = [this.orderInfo.id]
                if(!this.orderInfo.sendAddress) {
                    if(this.orderInfo.deliveryWay == 1 || this.orderInfo.deliveryWay == 2) {
                        this.fetchOrderAddress(_address)
                    }
                }
                // if(this.orderInfo.deliveryWay == 1) {
                //     this.fetchOrderAddress(_address)
                // }

                //如果是商家配送，则需要请求拿到配送员列表
                if(this.orderInfo.deliveryWay == 2){
                    this.getDistributorList();
                }
            }).catch(error => {
                console.error(error)
            })
        },
        afterSaleOrderDetail() {
            let id = this.$route.query.ids

            this._apis.order.getOrderAfterSaleDetail({id}).then((res) => {
                this.orderDetail = res
                this.tableData = this.orderDetail.orderItems
                this.orderInfo = res.orderInfo
                this.orderSendInfo = res.orderSendInfo
            }).catch(error => {
                console.error(error)
            })
        },
        getOrderDetail() {
            if(this.afterSale) {
                this.afterSaleOrderDetail()
            } else {
                this._orderDetail()
            }
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
                        height: 56px;
                        line-height: 56px;
                        background-color: #F6F7FA;
                        color: #44434B;
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
        .goods-detail-item {
            margin-right: 10px;
            p {
                margin-bottom: 6px!important;
                &:last-child {
                    color: #92929B;
                    font-size: 12px;
                }
            }
        }
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
// /deep/ .logistics .el-input {
//     // width: 226px;
// }
.ellipsis {
    width: 311px;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
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
/deep/ .el-table table thead th {
    font-weight: normal;
}
/deep/ .el-table table thead tr th {
    border-bottom: none;
}
</style>

