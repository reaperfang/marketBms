<template>
    <div class="c_container">
        <p class="c_title">用户标签：</p>
        <div class="form_container">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="标签名称：" prop="tagName">
                    <div class="input_wrap">
                        <el-input v-model="ruleForm.tagName" placeholder="请输入标签名称" :maxLength="6"></el-input>
                    </div>
                </el-form-item>
                <el-form-item label="标签类型：" prop="tagType">
                    <div class="input_wrap">
                        <el-radio v-model="ruleForm.tagType" label="0">手动</el-radio>
                        <el-radio v-model="ruleForm.tagType" label="1">自动</el-radio>
                    </div>
                    <p class="label_warn">
                        手动标签：无筛选条件给用户定义标签<br>
                        自动标签：按照筛选条件自动为用户打标签
                    </p>
                </el-form-item>
                <div v-if="ruleForm.tagType == '1'">
                <el-form-item label="满足条件：" prop="anyOrAllCondition">
                    <el-radio v-model="ruleForm.anyOrAllCondition" label="0">满足任意一个被选中的条件即可</el-radio>
                    <el-radio v-model="ruleForm.anyOrAllCondition" label="1">必须满足所有条件</el-radio>
                </el-form-item>
                <div style="margin-left: 32px">
                    <el-form-item label="交易条件：">
                        <el-checkbox v-model="ruleForm.isLastConsumeTime" @change="handleCheck8">最后消费时间</el-checkbox>
                    </el-form-item>
                    <el-form-item>
                        <el-radio v-model="ruleForm.consumeTimeType" label="0" @change="handleCheck5">最近</el-radio>
                        <div class="input_wrap3">
                            <el-input v-model="ruleForm.consumeTimeValue" @keyup.native="checkZero2($event,ruleForm.consumeTimeValue,'consumeTimeValue')"></el-input>
                        </div>
                        <div class="input_wrap2">
                            <el-select v-model="ruleForm.consumeTimeUnit" placeholder="请选择">
                                <el-option
                                    v-for="item in unitOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-radio v-model="ruleForm.consumeTimeType" label="1" @change="handleCheck6">自定义</el-radio>
                        <div class="input_wrap">
                            <el-date-picker
                                v-model="consumeTime"
                                type="datetimerange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                :picker-options="utils.globalTimePickerOption.call(this)"
                                >
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="ruleForm.isTotalConsumeTimes" @change="handleCheck1">累计消费次数</el-checkbox>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.consumeTimesMin" @keyup.native="checkZero2($event,ruleForm.consumeTimesMin,'consumeTimesMin')"></el-input>
                        </div>
                        <span>次 — </span>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.consumeTimesMax" @keyup.native="checkZero2($event,ruleForm.consumeTimesMax,'consumeTimesMax')"></el-input>
                        </div>
                        <span>次</span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="ruleForm.isTotalConsumeMoney" @change="handleCheck2">累计消费金额</el-checkbox>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.consumeMoneyMin" @keyup.native="checkZero($event,ruleForm.consumeMoneyMin,'consumeMoneyMin')"></el-input>
                        </div>
                        <span>元 — </span>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.consumeMoneyMax" @keyup.native="checkZero($event,ruleForm.consumeMoneyMax,'consumeMoneyMax')"></el-input>
                        </div>
                        <span>元</span>
                    </el-form-item>
                    <el-form-item>
                        <el-checkbox v-model="ruleForm.isPreUnitPrice" @change="handleCheck3">客单价</el-checkbox>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.preUnitPriceMin" @keyup.native="checkZero($event,ruleForm.preUnitPriceMin,'preUnitPriceMin')"></el-input>
                        </div>
                        <span>元 — </span>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.preUnitPriceMax" @keyup.native="checkZero($event,ruleForm.preUnitPriceMax,'preUnitPriceMax')"></el-input>
                        </div>
                        <span>元</span>
                    </el-form-item>
                    <el-form-item label="资产条件：">
                        <el-checkbox v-model="ruleForm.isTotalScore" @change="handleCheck4">累计获得积分</el-checkbox>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.totalScoreMin" @keyup.native="checkZero2($event,ruleForm.totalScoreMin,'totalScoreMin')"></el-input>
                        </div>
                        <span>分 — </span>
                        <div class="input_wrap2">
                            <el-input placeholder="请输入" v-model="ruleForm.totalScoreMax" @keyup.native="checkZero2($event,ruleForm.totalScoreMax,'totalScoreMax')"></el-input>
                        </div>
                        <span>分</span>
                    </el-form-item>
                    <el-form-item label="商品条件：">
                        <el-checkbox v-model="ruleForm.isProduct" @change="handleCheck7">购买以下任意商品</el-checkbox>
                        <span class="addMainColor marL20 pointer" @click="chooseProduct">选择商品</span>
                        <ul v-if="selectedList.length !== 0">
                            <li v-for="item in selectedList" :key="item.goodsInfo.id" class="proList">
                                <span>{{item.goodsInfo.name}}</span>
                                <span>{{item.goodsInfo.specs}}</span>
                                <span>{{item.goodsInfo.stock}}</span>
                                <span class="pointer" style="color: #FD4C2B;" @click="handleClick(item)">删除</span>
                            </li>
                        </ul>
                    </el-form-item>
                </div>
                </div>
            </el-form>
        </div>
        <div class="btn_cont">
            <el-button type="primary" @click="doubleCheck" :loading="btnloading" v-permission="['用户', '用户标签', '默认页面', '保存']">保 存</el-button>
            <el-button @click="_routeTo('clientLabel')">取 消</el-button>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @getSelected="getSelected"></component>
    </div>
</template>
<script type="es6">
import utils from "@/utils";
import chooseProductDialog from './dialogs/batchLead/chooseProductDialog';
export default {
    name: 'batchLead',
    components: { chooseProductDialog },
    data() {
        return {
            consumeTime:"",
            selectedList: [],
            ruleForm: {
                tagName: "",
                tagType: "0",
                anyOrAllCondition:"0",
                isLastConsumeTime: null,
                consumeTimeType: "",
                consumeTimeValue:"",
                consumeTimeUnit: "",
                isTotalConsumeTimes: false,
                consumeTimesMin:"",
                consumeTimesMax:"",
                isTotalConsumeMoney: false,
                consumeMoneyMin:"",
                consumeMoneyMax:"",
                isPreUnitPrice: false,
                preUnitPriceMin:"",
                preUnitPriceMax:"",
                isTotalScore: false,
                totalScoreMin:"",
                totalScoreMax:"",
                productInfoIds:"",
                isProduct: false,
                labelConditon:"",
                enable: "1"
            },
            rules: {
                tagName: [
                    { required: true, message: '请输入标签名称', trigger: 'blur'}
                ],
                tagType: [
                    { required: true, message: '请选择标签类型', trigger: 'blur'}
                ],
                anyOrAllCondition: [
                    { required: true, message: '请选择满足条件', trigger: 'blur'}
                ],
            },
            unitOptions: [
                { label: '天',value: '0' },
                { label: '月',value: '1' },
                { label: '年',value: '2' },
            ],
            currentDialog: "",
            dialogVisible: false,
            currentData:{},
            selectedIds: "",
            canSubmit: true,
            isRepeat: "",
            btnloading: false
        }
    },
    methods: {
        handleClick(item) {
            let productInfoIds = this.currentData.productInfoIds;
            this.currentData = {delItem:item, productInfoIds: productInfoIds};
            this.selectedList.splice(item, 1);
        },
        checkZero(event,val,ele) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/\.{2,}/g,'.');
            val = val.replace(/^0/g,'');
            this.ruleForm[ele] = val;
        },
        checkZero2(event,val,ele) {
            val = val.replace(/[^\d]/g,'');
            val = val.replace(/^0/g,'');
            this.ruleForm[ele] = val;
        },
        handleCheck1(val) {
            if(!val) {
                this.ruleForm.consumeTimesMin = "";
                this.ruleForm.consumeTimesMax = "";
            }
        },
        handleCheck2(val) {
            if(!val) {
                this.ruleForm.consumeMoneyMin = "";
                this.ruleForm.consumeMoneyMax = "";
            }
        },
        handleCheck3(val) {
            if(!val) {
                this.ruleForm.preUnitPriceMin = "";
                this.ruleForm.preUnitPriceMax = "";
            }
        },
        handleCheck4(val) {
            if(!val) {
                this.ruleForm.totalScoreMin = "";
                this.ruleForm.totalScoreMax = "";
            }
        },
        handleCheck5() {
            if(this.ruleForm.consumeTimeType == "0") {
                this.consumeTime = "";
            }
        },
        handleCheck6() {
            if(this.ruleForm.consumeTimeType == "1") {
                this.ruleForm.consumeTimeValue = "";
                this.ruleForm.consumeTimeUnit = "";
            }
        },
        handleCheck7(val) {
            if(!val) {
                this.selectedIds = "";
            }
        },
        handleCheck8(val) {
            if(val) {
                this.ruleForm.consumeTimeType = "0";
            }else{
                this.ruleForm.consumeTimeType = "";
                this.ruleForm.consumeTimeValue = "";
                this.ruleForm.consumeTimeUnit = "";
                this.consumeTime = "";
            }
        },
        doubleCheck() {
            if(this.ruleForm.tagName !== "") {
                this.btnloading = true;
                this._apis.client.labelDoubleCheck({tagName: this.ruleForm.tagName}).then((response) => {
                    this.btnloading = false;
                    this.saveLabel(response);
                }).catch((error) => {
                    console.error(error);
                    this.btnloading = false;
                })
            }else{
                this.$message({
                    message: '标签名称不能为空',
                    type: 'warning'
                });
            }
        },
        chooseProduct() {
            this.dialogVisible = true;
            this.currentDialog = "chooseProductDialog";
            this.currentData.productInfoIds = this.ruleForm.productInfoIds;
        },
        convertUnit(val) {
            if(val) {
                return 1;
            }else{
                return 0;
            }
        },
        getSelected(val) {
            this.selectedList = this.selectedList.concat(val);
            //this.selectedIds = val;
        },
        isInteger(val) {
            if(val) {
                let v = Number(val);
                return Math.floor(v) === v;
            }else{
                return false;
            }
        },
        saveLabel(isRepeat) {
            if(!isRepeat && !this.$route.query.id) {
                this.$message({
                    message: '标签名不能重复',
                    type: 'warning'
                });
            }else{
                this.canSubmit = true;
                let selectedIds = [];
                this.selectedList.map((v) => {
                    selectedIds.push(v.goodsInfo.id);
                });
                this.selectedIds = selectedIds.join(',');
                if(this.ruleForm.consumeTimeType == "0") {
                    if(!this.isInteger(this.ruleForm.consumeTimeValue)) {
                        this.$message({
                            message: '请输入日期数',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }else if(this.ruleForm.consumeTimeUnit == "") {
                        this.$message({
                            message: '请输入日期单位',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.consumeTimeType == "1") {
                    if(this.consumeTime == "") {
                        this.$message({
                            message: '请选择自定义日期',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.isTotalConsumeTimes == true) {
                    if(!this.isInteger(this.ruleForm.consumeTimesMin) || !this.isInteger(this.ruleForm.consumeTimesMax) || Number(this.ruleForm.consumeTimesMin) > Number(this.ruleForm.consumeTimesMax)) {
                        // console.log(Number(this.ruleForm.consumeTimesMin) < Number(this.ruleForm.consumeTimesMax))
                        this.$message({
                            message: '请正确输入累计消费次数区间',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.isTotalConsumeMoney == true) {
                    if(!this.isInteger(this.ruleForm.consumeMoneyMin) || !this.isInteger(this.ruleForm.consumeMoneyMax) || Number(this.ruleForm.consumeMoneyMin) > Number(this.ruleForm.consumeMoneyMax)) {
                        this.$message({
                            message: '请正确输入累计消费金额区间',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.isPreUnitPrice == true) {
                    if(!this.isInteger(this.ruleForm.preUnitPriceMin)|| !this.isInteger(this.ruleForm.preUnitPriceMax) || Number(this.ruleForm.preUnitPriceMin) > Number(this.ruleForm.preUnitPriceMax)) {
                        this.$message({
                            message: '请正确输入客单价区间',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.isTotalScore == true) {
                    if(!this.isInteger(this.ruleForm.totalScoreMin)|| !this.isInteger(this.ruleForm.totalScoreMax) || Number(this.ruleForm.totalScoreMin) > Number(this.ruleForm.totalScoreMax)) {
                        this.$message({
                            message: '请正确输入累计获得积分区间',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.isProduct == true) {
                    if(this.selectedIds.length == 0) {
                        this.$message({
                            message: '请选择商品',
                            type: 'warning'
                        });
                        this.canSubmit = false;
                    }
                }
                if(this.ruleForm.tagType == '1') {
                    if(this.ruleForm.anyOrAllCondition == "0") {
                        let arr = [this.ruleForm.isLastConsumeTime, this.ruleForm.isTotalConsumeTimes, this.ruleForm.isTotalConsumeMoney,this.ruleForm.isPreUnitPrice,this.ruleForm.isTotalScore,this.ruleForm.isProduct];
                        let isSelect = arr.some(ele => ele == true)
                        if(!isSelect) {
                            this.$message({
                                message: '请选择任意一个交易条件',
                                type: 'warning'
                            });
                            this.canSubmit = false;
                        }
                    }
                }
                if(this.ruleForm.tagType == '1') {
                    if(this.ruleForm.anyOrAllCondition == "1") {
                        let arr = [this.ruleForm.isLastConsumeTime, this.ruleForm.isTotalConsumeTimes, this.ruleForm.isTotalConsumeMoney,this.ruleForm.isPreUnitPrice,this.ruleForm.isTotalScore,this.ruleForm.isProduct];
                        let isSelect = arr.every(ele => ele == true)
                        if(!isSelect) {
                            this.$message({
                                message: '请选择所有交易条件',
                                type: 'warning'
                            });
                            this.canSubmit = false;
                        }
                    }
                }
                if(!!this.canSubmit) {
                    let formObj = Object.assign({}, this.ruleForm);
                    formObj.consumeTimeStart = this.consumeTime ? this.consumeTime[0]:"";
                    formObj.consumeTimeEnd = this.consumeTime ? this.consumeTime[1]:"";
                    formObj.isLastConsumeTime = this.convertUnit(formObj.isLastConsumeTime) || 0;
                    formObj.isTotalConsumeTimes = this.convertUnit(formObj.isTotalConsumeTimes) || 0;
                    formObj.isTotalConsumeMoney = this.convertUnit(formObj.isTotalConsumeMoney) || 0;
                    formObj.isPreUnitPrice = this.convertUnit(formObj.isPreUnitPrice) || 0;
                    formObj.isTotalScore = this.convertUnit(formObj.isTotalScore) || 0;
                    formObj.isProduct = this.convertUnit(formObj.isProduct) || 0;
                    formObj.productInfoIds = this.selectedIds || 0;
                    formObj.consumeTimesMin = formObj.consumeTimesMin == "" ? 0:formObj.consumeTimesMin;
                    formObj.consumeTimesMax = formObj.consumeTimesMax == "" ? 0:formObj.consumeTimesMax;
                    formObj.consumeMoneyMin = formObj.consumeMoneyMin == "" ? 0:formObj.consumeMoneyMin;
                    formObj.consumeMoneyMax = formObj.consumeMoneyMax == "" ? 0:formObj.consumeMoneyMax;
                    formObj.preUnitPriceMin = formObj.preUnitPriceMin == "" ? 0:formObj.preUnitPriceMin;
                    formObj.preUnitPriceMax = formObj.preUnitPriceMax == "" ? 0:formObj.preUnitPriceMax;
                    formObj.totalScoreMin = formObj.totalScoreMin == "" ? 0:formObj.totalScoreMin;
                    formObj.totalScoreMax = formObj.totalScoreMax == "" ? 0:formObj.totalScoreMax;
                    if(this.$route.query.id) {
                        if(formObj.tagType == '0') {
                            this._apis.client.updateTag({tagType: formObj.tagType, tagName: formObj.tagName, id: this.$route.query.id}).then((response) => {
                                this._routeTo('clientLabel');
                                this.$message({
                                    message: '标签编辑成功',
                                    type: 'success'
                                });                     
                            }).catch((error) => {
                                console.error(error);
                            })
                        }else{
                            this._apis.client.updateTag(formObj).then((response) => {
                                this._routeTo('clientLabel');
                                this.$message({
                                    message: '标签编辑成功',
                                    type: 'success'
                                }); 
                            }).catch((error) => {
                                console.error(error);
                            })
                        }
                    }else{
                        if(formObj.tagType == '0') {
                            this._apis.client.addTag({tagType: formObj.tagType, tagName: formObj.tagName}).then((response) => {
                                this._routeTo('clientLabel');
                                this.$message({
                                    message: '添加标签成功',
                                    type: 'success'
                                });
                            }).catch((error) => {
                                console.error(error);
                            })
                        }else{
                            this._apis.client.addTag(formObj).then((response) => {
                                this._routeTo('clientLabel');
                                this.$message({
                                    message: '添加标签成功',
                                    type: 'success'
                                });
                            }).catch((error) => {
                                console.error(error);
                            })
                        }
                    }
                }
            }
        }
    },
    mounted() {
        if(this.$route.query.id) {
            this._apis.client.getLabelInfo({id:this.$route.query.id}).then((response) => {
                if(response.tagType == 0) {
                    this.ruleForm.tagType = response.tagType.toString();
                    this.ruleForm.tagName = response.tagName;
                    this.ruleForm.id = response.id;
                }else{
                    this.ruleForm = Object.assign({}, response);
                    this.ruleForm.tagType = this.ruleForm.tagType.toString();
                    this.ruleForm.anyOrAllCondition = typeof(this.ruleForm.anyOrAllCondition) == 'number' ? this.ruleForm.anyOrAllCondition.toString():"";
                    this.ruleForm.consumeTimeType = typeof(this.ruleForm.consumeTimeType) == 'number' ? this.ruleForm.consumeTimeType.toString():'';
                    this.ruleForm.isLastConsumeTime = Boolean(this.ruleForm.isLastConsumeTime);
                    this.ruleForm.isTotalConsumeTimes = Boolean(this.ruleForm.isTotalConsumeTimes);
                    this.ruleForm.isTotalConsumeMoney = Boolean(this.ruleForm.isTotalConsumeMoney);
                    this.ruleForm.isPreUnitPrice = Boolean(this.ruleForm.isPreUnitPrice);
                    this.ruleForm.isTotalScore = Boolean(this.ruleForm.isTotalScore);
                    this.ruleForm.isProduct = Boolean(this.ruleForm.isProduct);
                    this.ruleForm.consumeTimeUnit = this.ruleForm.consumeTimeUnit.toString();
                    this.selectedIds = this.ruleForm.productInfoIds;
                    //根据selectedIds查询商品
                    this._apis.client.getSkuList({ids: this.selectedIds.split(','), startIndex: 1,pageSize: 99}).then((response) => {
                        this.selectedList = [].concat(response.list);
                        this.currentData.selectedList = [].concat(response.list);
                        this.selectedList.map((item) => {
                            item.goodsInfo.specs = item.goodsInfo.specs.replace(/"|{|}/g, "");
                        })
                    }).catch((error) => {
                        console.error(error);
                    }) 
                    if(this.ruleForm.consumeTimeStart && this.ruleForm.consumeTimeEnd) {
                        this.consumeTime = [this.ruleForm.consumeTimeStart,this.ruleForm.consumeTimeEnd];
                    }
                    if(this.ruleForm.consumeTimeType == "0") {
                        this.consumeTime = "";
                    }else{
                        this.ruleForm.consumeTimeValue = "";
                        this.ruleForm.consumeTimeUnit = "";
                    }
                }
            }).catch((error) => {
                console.error(error);
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.el-date-editor .el-range-separator{
    width: 6%;
}
.c_container{
    padding: 20px;
    background-color: #fff;
    height:100%;
    .marL20{
        margin-left: 20px;
    }
    .c_title{
        color:#3D434A;
        margin-bottom: 17px;
    }
    .form_container{
        .input_wrap{
            width: 182px;
            display: inline-block;
        }
        .label_warn{
            width: 255px;
            font-size: 12px;
            color: #92929B;
            line-height: 20px;
        }
        .input_wrap2{
            width: 100px;
            display: inline-block;
        }
        .input_wrap3{
            width: 60px;
            display: inline-block;
        }
    }
    .btn_cont{
        text-align: center;
        margin: 20px 0 30px 0;
    }
    .proList{
        margin-top: 10px;
        span{
            margin-right: 20px;
        }
    }
}
</style>


