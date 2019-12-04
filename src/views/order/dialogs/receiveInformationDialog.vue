<template>
    <DialogBase class="receive-information-dialog" :visible.sync="visible" @submit="submit" :title="title" width="600px" :showFooter="showFooter">
        <template v-if="sendGoods == 'send'">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="发货人姓名" prop="sendName">
                    <el-input v-model="ruleForm.sendName" placeholder="请选择"></el-input>
                </el-form-item>
                <el-form-item label="发货人电话" prop="sendPhone">
                    <el-input v-model="ruleForm.sendPhone" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="发货地址" prop="deliveryAddress">
                    <area-cascader type="code" :level="1" :data='$pcaa' v-model='ruleForm.deliveryAddress'></area-cascader>
                    <!-- <div class="gray">{{ruleForm.deliveryAddress.map(val => Object.values(val)[0]).join(',')}}</div> -->
                </el-form-item>
                <el-form-item label="详细地址" prop="sendDetail">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="街道、楼牌号等"
                        maxlength="100"
                        v-model="ruleForm.sendDetail">
                    </el-input>
                </el-form-item>
                <div class="footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button @click="submit('ruleForm')" type="primary">确定</el-button>
                </div>
            </el-form>
        </template>
        <template v-else>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="收货人姓名" prop="receivedName">
                    <el-input v-model="ruleForm.receivedName" placeholder="请选择"></el-input>
                </el-form-item>
                <el-form-item label="收货人电话" prop="receivedPhone">
                    <el-input v-model="ruleForm.receivedPhone" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="收货地址" prop="deliveryAddress">
                    <area-cascader type="code" :level="1" :data='$pcaa' v-model='ruleForm.deliveryAddress'></area-cascader>
                    <!-- <div class="gray">{{ruleForm.deliveryAddress.map(val => Object.values(val)[0]).join(',')}}</div> -->
                </el-form-item>
                <el-form-item label="详细地址" prop="receivedDetail">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="街道、楼牌号等"
                        maxlength="100"
                        v-model="ruleForm.receivedDetail">
                    </el-input>
                </el-form-item>
                <div class="footer">
                    <el-button @click="visible = false">取消</el-button>
                    <el-button @click="submit('ruleForm')" type="primary">确定</el-button>
                </div>
            </el-form>
        </template>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        var sendNameValidator = (rule, value, callback) => {
            if(!this.ruleForm.sendName) {
                callback(new Error('发货人姓名不能为空'));
            } else {
                if(/^\s+$/.test(this.ruleForm.sendName)) {
                    callback(new Error('发货人姓名不能为空白字符'));
                } else {
                    callback();
                }
            }
        };
        var receivedNameValidator = (rule, value, callback) => {
            if(!this.ruleForm.receivedName) {
                callback(new Error('收货人姓名不能为空'));
            } else {
                if(/^\s+$/.test(this.ruleForm.receivedName)) {
                    callback(new Error('收货人姓名不能为空白字符'));
                } else {
                    callback();
                }
            }
        };
        var sendPhoneValidator = (rule, value, callback) => {
            if(!this.ruleForm.sendPhone) {
                callback(new Error('发货人电话不能为空'));
            } else {
                if(!/^\d{11}$/.test(this.ruleForm.sendPhone)) {
                    callback(new Error('电话格式错误'));
                } else {
                    callback();
                }
            }
        };
        var receivedPhoneValidator = (rule, value, callback) => {
            if(!this.ruleForm.receivedPhone) {
                callback(new Error('收货人电话不能为空'));
            } else {
                if(!/^\d{11}$/.test(this.ruleForm.receivedPhone)) {
                    callback(new Error('电话格式错误'));
                } else {
                    callback();
                }
            }
        };
        var sendDetailValidator = (rule, value, callback) => {
            if(!this.ruleForm.sendDetail) {
                callback(new Error('详细地址不能为空'));
            } else {
                if(/^\s+$/.test(this.ruleForm.sendDetail)) {
                    callback(new Error('详细地址不能为空白字符'));
                } else {
                    callback();
                }
            }
        };
        var receivedDetailValidator = (rule, value, callback) => {
            if(!this.ruleForm.receivedDetail) {
                callback(new Error('详细地址不能为空'));
            } else {
                if(/^\s+$/.test(this.ruleForm.receivedDetail)) {
                    callback(new Error('详细地址不能为空白字符'));
                } else {
                    callback();
                }
            }
        };
        return {
            ruleForm: {
                receivedName: '',
                receivedPhone: '',
                deliveryAddress: '',
                receivedDetail: '',
                receivedProvinceCode: '',
                receivedProvinceName: '',
                receivedCityCode: '',
                receivedCityName: '',
                receivedAreaCode: '',
                receivedAreaName: '',

                sendName: '',
                sendPhone: '',
                sendDetail: '',
                sendProvinceCode: '',
                sendProvinceName: '',
                sendCityCode: '',
                sendCityName: '',
                sendAreaCode: '',
                sendAreaName: '',
            },
            rules: {
                receivedName: [
                    { validator: receivedNameValidator, trigger: 'blur' },
                ],
                receivedPhone: [
                    { validator: receivedPhoneValidator, trigger: 'blur' },
                ],
                receivedDetail: [
                    { validator: receivedDetailValidator, trigger: 'blur' },
                ],
                deliveryAddress: [
                    { required: true, message: '请选择收货地址', trigger: 'blur' },
                ],

                sendName: [
                    { validator: sendNameValidator, trigger: 'blur' },
                ],
                sendPhone: [
                    { validator: sendPhoneValidator, trigger: 'blur' },
                ],
                sendDetail: [
                    { validator: sendDetailValidator, trigger: 'blur' },
                ],
            },
            showFooter: false
        }
    },
    created() {
        this.getDetail()
    },
    watch: {
        data: {
            deep: true,
            handler() {
                this.getDetail()
            }
        }
    },
    methods: {
        getDetail() {
            let arr = []
            let obj1 = {}
            let obj2 = {}
            let obj3 = {}

            if(this.sendGoods == 'received') {
                if(this.data.receivedProvinceCode && this.data.receivedCityCode && this.data.receivedAreaCode) {
                    // obj1[this.data.receivedProvinceCode] = this.data.receivedProvinceName
                    // obj2[this.data.receivedCityCode] = this.data.receivedCityName
                    // obj3[this.data.receivedAreaCode] = this.data.receivedAreaName
                    arr.push(this.data.receivedProvinceCode)
                    arr.push(this.data.receivedCityCode)
                    arr.push(this.data.receivedAreaCode)
                }
            } else {
                if(this.data.sendProvinceCode && this.data.sendCityCode && this.data.sendAreaCode) {
                    // obj1[this.data.sendProvinceCode] = this.data.sendProvinceName
                    // obj2[this.data.sendCityCode] = this.data.sendCityName
                    // obj3[this.data.sendAreaCode] = this.data.sendAreaName
                    arr.push(this.data.sendProvinceCode)
                    arr.push(this.data.sendCityCode)
                    arr.push(this.data.sendAreaCode)
                }
            }
            // arr.push(obj1)
            // arr.push(obj2)
            // arr.push(obj3)
            this.ruleForm = Object.assign({}, this.ruleForm, this.data, {deliveryAddress: arr})
        },
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log(this.ruleForm.deliveryAddress)
                    // let codes = Object.values(this.ruleForm.deliveryAddress)
                    // let codes0 = Object.keys(codes[0])[0]
                    // let codes1 = Object.keys(codes[1])[0]
                    // let codes2 = Object.keys(codes[2])[0]
                    // let name0 = codes[0][codes0]
                    // let name1 = codes[1][codes1]
                    // let name2 = codes[2][codes2]
                    
                    let codes0 = this.ruleForm.deliveryAddress[0]
                    let codes1 = this.ruleForm.deliveryAddress[1]
                    let codes2 = this.ruleForm.deliveryAddress[2]
                    let name0 = this.$pcaa[86][this.ruleForm.deliveryAddress[0]]
                    let name1 = this.$pcaa[this.ruleForm.deliveryAddress[0]][this.ruleForm.deliveryAddress[1]]
                    let name2 = this.$pcaa[this.ruleForm.deliveryAddress[1]][this.ruleForm.deliveryAddress[2]]

                    if(this.sendGoods && !this.ajax) {
                        let obj = {}
                        // console.log(this.ruleForm.deliveryAddress)
                        // console.log(this.$pcaa[86][this.ruleForm.deliveryAddress[0]])
                        // console.log(this.$pcaa[this.ruleForm.deliveryAddress[0]][this.ruleForm.deliveryAddress[1]])
                        // console.log(this.$pcaa[this.ruleForm.deliveryAddress[1]][this.ruleForm.deliveryAddress[2]])

                        if(this.sendGoods == 'received') {
                            obj = {
                                receivedProvinceCode: codes0,
                                receivedProvinceName: name0,
                                receivedCityCode: codes1,
                                receivedCityName: name1,
                                receivedAreaCode: codes2,
                                receivedAreaName: name2,
                                receivedDetail: this.sendGoods == 'send' ? this.ruleForm.sendDetail : this.ruleForm.receivedDetail,
                                receivedPhone: this.sendGoods == 'send' ? this.ruleForm.sendPhone : this.ruleForm.receivedPhone,
                                receivedName: this.sendGoods == 'send' ? this.ruleForm.sendName : this.ruleForm.receivedName
                            }
                        } else if(this.sendGoods == 'send') {
                            obj = {
                                sendProvinceCode: codes0,
                                sendProvinceName: name0,
                                sendCityCode: codes1,
                                sendCityName: name1,
                                sendAreaCode: codes2,
                                sendAreaName: name2,
                                sendDetail: this.sendGoods == 'send' ? this.ruleForm.sendDetail : this.ruleForm.receivedDetail,
                                sendPhone: this.sendGoods == 'send' ? this.ruleForm.sendPhone : this.ruleForm.receivedPhone,
                                sendName: this.sendGoods == 'send' ? this.ruleForm.sendName : this.ruleForm.receivedName
                            }

                            this._apis.order.orderUpdateAddress({
                                id: this.cid, // 和cid相同
                                cid: this.cid,
                                // receivedProvinceCode: codes0,
                                // receivedProvinceName: name0,
                                // receivedCityCode: codes1,
                                // receivedCityName: name1,
                                // receivedAreaCode: codes2,
                                // receivedAreaName: name2,
                                // receivedDetail: this.ruleForm.receivedDetail,
                                // receivedPhone: this.ruleForm.receivedPhone,
                                // receivedName: this.ruleForm.receivedName,

                                province: name0,
                                provinceCode: codes0,
                                city: name1,
                                cityCode: codes1,
                                area: name2,
                                areaCode: codes2,
                                address: this.ruleForm.sendDetail,
                                senderPhone: this.ruleForm.sendPhone,
                                senderName: this.ruleForm.sendName

                            }).then(res => {
                                this.$emit('submit', obj)
                                this.visible = false
                                this.$notify({
                                    title: '成功',
                                    message: '修改成功！',
                                    type: 'success'
                                });
                            }).catch(error => {
                                this.visible = false
                                this.$notify.error({
                                    title: '错误',
                                    message: error
                                });
                            }) 

                            return
                        }
                        this.$emit('submit', obj)
                        this.visible = false
                        return
                    }

                    this._apis.order.orderUpdateReceive({
                        id: (typeof this.data) == 'string' ?  this.data : (this.$route.query.orderId || this.$route.query.id),
                        //code: this.$route.query.orderId ? this.$route.query.orderId : '',
                        receivedProvinceCode: codes0,
                        receivedProvinceName: name0,
                        receivedCityCode: codes1,
                        receivedCityName: name1,
                        receivedAreaCode: codes2,
                        receivedAreaName: name2,
                        receivedDetail: this.ruleForm.receivedDetail,
                        receivedPhone: this.ruleForm.receivedPhone,
                        receivedName: this.ruleForm.receivedName
                    }).then(res => {
                        this.$emit('submit')
                        this.visible = false
                        this.$notify({
                            title: '成功',
                            message: '修改成功！',
                            type: 'success'
                        });
                    }).catch(error => {
                        this.visible = false
                        this.$notify.error({
                            title: '错误',
                            message: error
                        });
                    }) 
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        },
        contentText() {
            return '是否确认删除？'
        },
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
        sendGoods: {
            type: String
        },
        title: {
            type: String,
            default: '修改收货信息'
        },
        ajax: {
            type: Boolean,
            default: false
        }
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
    /deep/.el-input {
        width: 100%!important;
    }
    /deep/ .receive-information-dialog .area-select.large {
        width: 100%!important;
    }
    /deep/ .el-textarea {
        width: 100%!important;
        height: 96px!important;
        textarea {
            height: 96px!important;
        }
    }
    .demo-ruleForm {
        padding-right: 70px;
    }
    /deep/ label[for="sendPhone"]::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
    /deep/ label[for="receivedPhone"]::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
    /deep/ label[for="sendName"]::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
    /deep/ label[for="receivedName"]::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
    }
</style>
<style lang="scss">
    .receive-information-dialog {
        .dialog-container {
            text-align: left;
        }
        /deep/ .area-select .area-selected-trigger {
            padding: 0;
            padding-left: 5px;
        }
        /deep/ .area-select.large {
            width: 100%;
        }
        .footer {
            text-align: center;
        }
    }
    .gray {
        color: #666;
        font-size: 12px;
    }
</style>


