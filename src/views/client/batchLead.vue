<template>
    <div class="c_container">
        <p class="c_title">客户标签：</p>
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
                        手动标签：无筛选条件给客户定义标签<br>
                        自动标签：按照筛选条件自动为客户打标签，条件不符合自动删除和添加
                    </p>
                </el-form-item>
                <div v-if="ruleForm.tagType == '1'">
                <el-form-item label="满足条件：" prop="anyOrAllCondition">
                    <el-radio v-model="ruleForm.anyOrAllCondition" label="0">满足任意一个被选中的条件即可</el-radio>
                    <el-radio v-model="ruleForm.anyOrAllCondition" label="1">必须满足所有条件</el-radio>
                </el-form-item>
                <el-form-item label="交易条件：">
                    <el-checkbox v-model="ruleForm.isLastConsumeTime">最后消费时间</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-radio v-model="ruleForm.consumeTimeType" label="0">最近</el-radio>
                    <div class="input_wrap3">
                        <el-input v-model="ruleForm.consumeTimeValue"></el-input>
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
                    <el-radio v-model="ruleForm.consumeTimeType" label="1">自定义</el-radio>
                    <div class="input_wrap">
                        <el-date-picker
                            v-model="consumeTime"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.isTotalConsumeTimes">累计消费次数</el-checkbox>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.consumeTimesMin"></el-input>
                    </div>
                    <span>次 — </span>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.consumeTimesMax"></el-input>
                    </div>
                    <span>次</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.isTotalConsumeMoney">累计消费金额</el-checkbox>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.consumeMoneyMin"></el-input>
                    </div>
                    <span>元 — </span>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.consumeMoneyMax"></el-input>
                    </div>
                    <span>元</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.isPreUnitPrice">客单价</el-checkbox>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.preUnitPriceMin"></el-input>
                    </div>
                    <span>元 — </span>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.preUnitPriceMax"></el-input>
                    </div>
                    <span>元</span>
                </el-form-item>
                <el-form-item label="资产条件：">
                    <el-checkbox v-model="ruleForm.isTotalScore">累计获得积分</el-checkbox>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.totalScoreMin"></el-input>
                    </div>
                    <span>分 — </span>
                    <div class="input_wrap2">
                        <el-input placeholder="请输入" v-model="ruleForm.totalScoreMax"></el-input>
                    </div>
                    <span>分</span>
                </el-form-item>
                <el-form-item label="资产条件：">
                    <el-checkbox v-model="ruleForm.isProduct">商品条件</el-checkbox>
                    <span>购买以下任意商品</span>
                    <span class="addMainColor marL20 pointer" @click="chooseProduct">选择商品</span>
                </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="btn_cont">
            <el-button type="primary" @click="saveLabel" v-permission="['客户', '客户标签', '默认页面', '保存']">保 存</el-button>
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
            ruleForm: {
                tagName: "",
                tagType: "0",
                anyOrAllCondition:"",
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
                enable: "1",
                selectedIds: ""
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
                { label: '天',value: 0 },
                { label: '月',value: 1 },
                { label: '年',value: 2 },
            ],
            currentDialog: "",
            dialogVisible: false,
            currentData:{}
        }
    },
    methods: {
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
            this.selectedIds = val;
        },
        saveLabel() {
            let formObj = Object.assign({}, this.ruleForm);
            formObj.consumeTimeStart = this.consumeTime ? utils.formatDate(new Date(this.consumeTime[0]).getTime(),"yyyy-MM-dd hh:mm:ss"):"";
            formObj.consumeTimeEnd = this.consumeTime ? utils.formatDate(new Date(this.consumeTime[1]).getTime() + 24 * 60 * 60 * 1000 - 1,"yyyy-MM-dd hh:mm:ss"):"";
            formObj.isLastConsumeTime = this.convertUnit(formObj.isLastConsumeTime) || '';
            formObj.isTotalConsumeTimes = this.convertUnit(formObj.isTotalConsumeTimes) || '';
            formObj.isTotalConsumeMoney = this.convertUnit(formObj.isTotalConsumeMoney) || '';
            formObj.isPreUnitPrice = this.convertUnit(formObj.isPreUnitPrice) || '';
            formObj.isTotalScore = this.convertUnit(formObj.isTotalScore) || '';
            formObj.isProduct = this.convertUnit(formObj.isProduct) || '';
            formObj.productInfoIds = this.selectedIds || "";
            if(this.$route.query.id) {
                if(formObj.tagType == '0') {
                    this._apis.client.updateTag({tagType: formObj.tagType, tagName: formObj.tagName, id: this.$route.query.id}).then((response) => {
                        this._routeTo('clientLabel');
                        this.$notify({
                            title: '成功',
                            message: "标签编辑成功",
                            type: 'success'
                        });                      
                    }).catch((error) => {
                        console.log(error);
                    })
                }else{
                    this._apis.client.updateTag(formObj).then((response) => {
                        this._routeTo('clientLabel');
                        this.$notify({
                            title: '成功',
                            message: "标签编辑成功",
                            type: 'success'
                        });
                    }).catch((error) => {
                        console.log(error);
                    })
                }
            }else{
                if(formObj.tagType == '0') {
                    this._apis.client.addTag({tagType: formObj.tagType, tagName: formObj.tagName}).then((response) => {
                        this._routeTo('clientLabel');
                        this.$notify({
                            title: '成功',
                            message: "添加标签成功",
                            type: 'success'
                        });
                    }).catch((error) => {
                        console.log(error);
                    })
                }else{
                    this._apis.client.addTag(formObj).then((response) => {
                        this._routeTo('clientLabel');
                        this.$notify({
                            title: '成功',
                            message: "添加标签成功",
                            type: 'success'
                        });
                        
                    }).catch((error) => {
                        console.log(error);
                    })
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
                    this.ruleForm.consumeTimeType = this.ruleForm.consumeTimeType ? this.ruleForm.consumeTimeType.toString():'';
                    this.ruleForm.isLastConsumeTime = Boolean(this.ruleForm.isLastConsumeTime);
                    this.ruleForm.isTotalConsumeTimes = Boolean(this.ruleForm.isTotalConsumeTimes);
                    this.ruleForm.isTotalConsumeMoney = Boolean(this.ruleForm.isTotalConsumeMoney);
                    this.ruleForm.isPreUnitPrice = Boolean(this.ruleForm.isPreUnitPrice);
                    this.ruleForm.isTotalScore = Boolean(this.ruleForm.isTotalScore);
                    this.ruleForm.isProduct = Boolean(this.ruleForm.isProduct);
                    if(this.ruleForm.consumeTimeStart && this.ruleForm.consumeTimeEnd) {
                        this.consumeTime = [this.ruleForm.consumeTimeStart,this.ruleForm.consumeTimeEnd];
                    }
                }
            }).catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.c_container{
    padding: 16px 0 30px 20px;
    background-color: #fff;
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
            width: 252px;
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
}
</style>


