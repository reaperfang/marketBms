<template>
    <div class="deliver-goods">
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
                <div class="container-item-content">
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
                            <div class="value">{{orderAfterSaleSendInfo.receivedName}}</div>
                        </div>
                        <div class="item">
                            <div class="label">联系电话</div>
                            <div class="value">{{orderAfterSaleSendInfo.receivedPhone}}</div>
                        </div>
                        <div class="item">
                            <div class="label">收货信息</div>
                            <div class="value">{{orderAfterSaleSendInfo.receivedProvinceName}} {{orderAfterSaleSendInfo.receivedCityName}} {{orderAfterSaleSendInfo.receivedAreaName}} {{orderAfterSaleSendInfo.receivedDetail}}</div>
                        </div>
                    </div>
                </div>
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
                            <div class="value">{{orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendName}}</div>
                        </div>
                        <div class="item">
                            <div class="label">联系电话</div>
                            <div class="value">{{orderAfterSaleSendInfo && orderAfterSaleSendInfo.sendPhone}}</div>
                        </div>
                        <div class="item">
                            <div class="label">发货信息</div>
                            <div class="value" v-if="orderAfterSaleSendInfo">{{orderAfterSaleSendInfo.sendProvinceName}} {{orderAfterSaleSendInfo.sendCityName}} {{orderAfterSaleSendInfo.sendAreaName}} {{orderAfterSaleSendInfo.sendDetail}}</div>
                            <div class="value" v-else>--</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-item">
                <p>3.填写物流信息</p>
                <div class="logistics">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="快递公司" prop="expressCompanyCode">
                            <el-select filterable @change="checkExpress" v-model="ruleForm.expressCompanyCode" placeholder="请选择">
                                <el-option :label="item.expressCompany" :value="item.expressCompanyCode" v-for="(item, index) in expressCompanyList" :key="index"></el-option>
                            </el-select>
                            <el-input v-if="ruleForm.expressCompanyCode == 'other'" v-model="ruleForm.other" placeholder="请输入快递公司名称"></el-input>
                        </el-form-item>
                        <el-form-item label="快递单号" prop="expressNos">
                            <el-input :disabled="!express" v-model="ruleForm.expressNos"></el-input>
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
            </div>
            <div class="footer">
                <el-button :loading="sending" type="primary" @click="sendGoodsHandler('ruleForm')">发 货</el-button>
            </div>
        </div>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @submit="onSubmit" :sendGoods="sendGoods" :title="title"></component>
    </div>
</template>
<script>
import ReceiveInformationDialog from '@/views/order/dialogs/receiveInformationDialog'

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
            orderDetail: {},
            nameList: [],
            itemList: [],
            orderAfterSaleSendInfo: {},
            currentDialog: '',
            dialogVisible: false,
            currentData: {},
            expressCompanyList: [],
            isReceived: true,
            title: '',
            sendGoods: '',
            express: true,
            sending: false
        }
    },
    created() {
        this.getOrderDetail()
        this.getExpressCompanyList()
    },
    computed: {
        afterSale() {
            if(this.$route.query.afterSale) {
                return true
            } else {
                return false
            }
        },
        cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    }
    },
    methods: {
        fetchOrderAddress() {
      this._apis.order
        .fetchOrderAddress({ id: this.cid, cid: this.cid })
        .then(res => {
          this.orderAfterSaleSendInfo.sendName = res.senderName;
          this.orderAfterSaleSendInfo.sendPhone = res.senderPhone;
          this.orderAfterSaleSendInfo.sendProvinceCode = res.provinceCode;
          this.orderAfterSaleSendInfo.sendProvinceName = res.province;
          this.orderAfterSaleSendInfo.sendCityCode = res.cityCode;
          this.orderAfterSaleSendInfo.sendCityName = res.city;
          this.orderAfterSaleSendInfo.sendAreaCode = res.areaCode;
          this.orderAfterSaleSendInfo.sendAreaName = res.area;
          this.orderAfterSaleSendInfo.sendDetail = res.address;
        })
        .catch(error => {
          this.visible = false;
          this.$notify.error({
            title: "错误",
            message: error
          });
        });
    },
        checkExpress() {
        let expressName

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
            this.$notify.error({
                title: "错误",
                message: error
            });
            });
        },
        getExpressCompanyList() {
            this._apis.order.getElectronicFaceSheetExpressCompanyList().then((res) => {
                res.forEach(val => {
                    val.expressCompanyCode = val.expressCode
                    val.expressCompany = val.expressName
                })
                res.push({
                    expressCompanyCode: 'other',
                    expressCompany: '其他'
                })
                this.expressCompanyList = res
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        sendGoodsHandler(formName) {
            let params

            if(!this.ruleForm.expressCompanyCode) {
                this.confirm({title: '提示', icon: true, text: '请选择快递公司'})
                return
            }

            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择需要发货的商品'})
                return
            }

            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.ruleForm.expressCompanyCode == 'other') {
                        this.ruleForm.expressCompany = this.ruleForm.other
                    } else {
                        this.ruleForm.expressCompany = this.expressCompanyList.find(val => val.expressCompanyCode == this.ruleForm.expressCompanyCode).expressCompany
                    }

                    this.sending = true

                    params = {
                        orderAfterSaleSendInfoDtoList: [
                            {
                                orderAfterSaleId: this.$route.query.id,
                                memberInfoId: this.orderAfterSaleSendInfo.memberInfoId,
                                orderAfterSaleCode: this.orderAfterSaleSendInfo.orderAfterSaleCode,
                                expressCompanys: this.ruleForm.expressCompany,
                                expressCompanyCodes: this.ruleForm.expressCompanyCode,
                                expressNos: this.ruleForm.expressNos,
                                receivedName: this.orderAfterSaleSendInfo.receivedName,
                                receivedPhone: this.orderAfterSaleSendInfo.receivedPhone,
                                receivedProvinceCode: this.orderAfterSaleSendInfo.receivedProvinceCode,
                                receivedProvinceName: this.orderAfterSaleSendInfo.receivedProvinceName,
                                receivedCityCode: this.orderAfterSaleSendInfo.receivedCityCode,
                                receivedCityName: this.orderAfterSaleSendInfo.receivedCityName,
                                receivedAreaCode: this.orderAfterSaleSendInfo.receivedAreaCode,
                                receivedAreaName: this.orderAfterSaleSendInfo.receivedAreaName,
                                receivedDetail: this.orderAfterSaleSendInfo.receivedDetail,
                                sendName: this.orderAfterSaleSendInfo.sendName,
                                sendPhone: this.orderAfterSaleSendInfo.sendPhone,
                                sendProvinceCode: this.orderAfterSaleSendInfo.sendProvinceCode,
                                sendProvinceName: this.orderAfterSaleSendInfo.sendProvinceName,
                                sendCityCode: this.orderAfterSaleSendInfo.sendCityCode,
                                sendCityName: this.orderAfterSaleSendInfo.sendCityName,
                                sendAreaCode: this.orderAfterSaleSendInfo.sendAreaCode,
                                sendAreaName: this.orderAfterSaleSendInfo.sendAreaName,
                                sendDetail: this.orderAfterSaleSendInfo.sendDetail,
                                remark: this.ruleForm.remark 
                            }
                        ],
                    }
                    this._apis.order.orderAfterSaleSend(params).then((res) => {
                        this.$notify({
                            title: '成功',
                            message: '发货成功',
                            type: 'success'
                        });
                        this.sending = false
                        this.$router.push({
                            path: '/order/deliverGoodsSuccess',
                            query: {
                                id: this.$route.query.id,
                                type: 'orderAfterDeliverGoods',
                                print: this.express
                            }
                        })
                    }).catch(error => {
                        this.$notify.error({
                            title: '错误',
                            message: error
                        });
                        this.sending = false
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
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
        },
        getOrderDetail() {
            this._apis.order.orderAfterSaleDetail({orderAfterSaleIds: [this.$route.query.id]}).then((res) => {
                this.itemList = res[0].itemList
                this.orderAfterSaleSendInfo = res[0].orderAfterSaleSendInfo
                this.fetchOrderAddress();
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        }
    },
    components: {
        ReceiveInformationDialog
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
</style>

