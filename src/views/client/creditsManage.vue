<template>
    <div class="c_container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="积分通用规则" name="first" v-permission="['客户', '积分管理', '积分通用规则']">
                <p class="c_title">积分使用规则：</p>
                <div>
                    <el-form :model="ruleForm" ref="ruleForm">
                        <el-form-item label="是否开启积分抵现：" prop="scoreToCash">
                            <div class="marL20">
                                <br>
                                <el-radio v-model="ruleForm.scoreToCash" label="0">不开启</el-radio><span class="c_warn">说明：开启用用户可以使用积分抵现（但不支持积分商城订单）</span><br>
                                <el-radio v-model="ruleForm.scoreToCash" label="1" @change="openScoreToCash">开启</el-radio><br>
                                <span>抵现比例：</span>
                                <div style="width: 140px; display: inline-block">
                                    <el-input placeholder="请输入整数" v-model="ruleForm.scorePercentage" @keyup.native="checkZero($event,ruleForm.scorePercentage,'scorePercentage')"></el-input>
                                </div>
                                <span>积分</span>
                                <div style="width: 54px; display: inline-block">
                                    <el-input v-model="ruleForm.scorePercentageMoney" :disabled="true"></el-input>
                                </div>
                                <span>元</span>
                            </div>
                        </el-form-item>
                        <el-form-item label="积分抵现条件：">
                            <el-checkbox v-model="ruleForm.scoreEnableOrderAchieveCash"></el-checkbox>
                            <span class="marR50">订单满</span>
                            <div style="width: 222px; display: inline-block">
                                <el-input placeholder="请输入整数，不填则不生效" v-model="ruleForm.scoreToCashOrderMoney" @keyup.native="checkZero($event,ruleForm.scoreToCashOrderMoney,'scoreToCashOrderMoney')"></el-input>
                            </div>
                            <span>元</span>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="ruleForm.scoreEnableOrderHighCash" style="margin-left: 110px" @change="handleCheck"></el-checkbox>
                            <span class="marL105">最高可抵现订单金额的</span>
                            <div style="width: 222px; display: inline-block; margin-left: 20px">
                                <el-input placeholder="请输入整数，不填则不生效" v-model="ruleForm.scoreToCashOrderRate" @keyup.native="checkPersent($event,ruleForm.scoreToCashOrderRate,'scoreToCashOrderRate')"></el-input>
                            </div>
                            <span>%</span>
                        </el-form-item>
                        <div class="c_line"></div>
                        <p class="c_title">积分清零规则：</p>
                        <el-form-item label="积分清零规则：" prop="scoreCleanType">
                            <div class="marL20">
                                <br>
                                <el-radio v-model="ruleForm.scoreCleanType" label="0">不清零</el-radio><br>
                                <el-radio v-model="ruleForm.scoreCleanType" label="1">自然年清零上一年获得的积分</el-radio><span class="c_warn">每年12月31日清空上一年获得的积分</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn_cont">
                    <el-button type="primary" class="btn_primary" @click="save" v-permission="['客户', '积分管理', '积分通用规则', '保存']">保 存</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="获取积分规则" name="second" v-permission="['客户', '积分管理', '获取积分规则']">
                <div class="c_block">
                    <el-switch
                        v-model="isSwitch"
                        active-color="#66CCAC"
                        @change="handleSwitch"
                    ></el-switch>
                    <span class="marR20">积分获取上限</span>
                    <span>每日最高获得：</span>
                    <div class="input_wrap">
                        <el-input placeholder="请输入整数" v-model="ruleForm.scoreUpperCount" :disabled="!isSwitch" @keyup.native="checkZero($event,ruleForm.scoreUpperCount,'scoreUpperCount')"></el-input>
                    </div>
                    <span>积分</span>
                    <el-button type="primary" class="marL20" v-if="isSwitch" @click="save2">保存</el-button>
                </div>
                <cmTable></cmTable>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script type="es6">
import cmTable from './components/creditsManage/cmTable'
export default {
    name: 'creditsManage',
    components: { cmTable },
    data() {
        return {
            ruleForm: {
                //是否开启积分抵现
                scoreToCash: "0",
                //积分清零规则
                scoreCleanType: "0",
                //抵现比例 积分
                scorePercentage:"",
                //抵现比例 元
                scorePercentageMoney:"1",
                //积分抵现条件：是否选择积分满
                scoreEnableOrderAchieveCash:"",
                //积分抵现条件：是否选择最高可抵现
                scoreEnableOrderHighCash:"",
                //积分抵现条件 元
                scoreToCashOrderMoney:"",
                //积分抵现条件 百分比
                scoreToCashOrderRate:"",
                //每日最高获得积分数
                scoreUpperCount:""
            },
            activeName: 'first',
            isSwitch: true
        }
    },
    methods: {
        handleCheck() {
            if(!this.ruleForm.scoreEnableOrderHighCash) {
                this.ruleForm.scoreToCashOrderRate = "";
            }
        },
        checkZero(event,val,ele) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/^0/g,'');
            this.ruleForm[ele] = val;
        },
        checkPersent(event,val,ele) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/^0/g,'');
            val = val.replace(/^100/g,'');
            this.ruleForm[ele] = val;
        },
        openScoreToCash(val) {
            if(val == '1') {
                this.ruleForm.scorePercentageMoney = 1
            }
        },
        save() {
            let formObj = this.ruleForm;
            if(formObj.scoreToCash == '1' && formObj.scorePercentage == "" && formObj.scorePercentage == "") {
                this.$notify({
                    title: '警告',
                    message: '开启积分抵现则抵现比例为必填',
                    type: 'warning'
                });
            }else{
                formObj.scoreEnableOrderAchieveCash = formObj.scoreEnableOrderAchieveCash == true?'1':'0';
                formObj.scoreEnableOrderHighCash = formObj.scoreEnableOrderHighCash == true?'1':'0';
                formObj.id = JSON.parse(localStorage.getItem('shopInfos')).id;
                this._apis.client.saveCreditRule(formObj).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '保存积分规则成功',
                        type: 'success'
                    });
                    this.checkCreditRule();
                }).catch((error) => {
                    console.log(error);
                })
            }
        },
        save2() {
            if(this.ruleForm.scoreUpperCount=='') {
                this.$notify({
                    title: '警告',
                    message: '每日最高获得积分数不能为空',
                    type: 'warning'
                });
            }else{
                this._apis.client.saveCreditRule({scoreUpper: this.isSwitch?'1':'0', scoreUpperCount: this.ruleForm.scoreUpperCount, id: JSON.parse(localStorage.getItem('shopInfos')).id}).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '每日最高获得积分数保存成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    console.log(error);
                })
            }
        },
        handleSwitch(val) {
            if(!val) {
                this.ruleForm.scoreUpperCount = "";
                this._apis.client.saveCreditRule({scoreUpper: this.isSwitch?'1':'0', id: JSON.parse(localStorage.getItem('shopInfos')).id}).then((response) => {
                    console.log('关闭成功');
                }).catch((error) => {
                    console.log(error);
                })
            }
        },
        checkCreditRule() {
            this._apis.client.checkCreditRule({id: JSON.parse(localStorage.getItem('shopInfos')).id}).then((response) => {
                this.ruleForm.scoreToCash = response.scoreToCash.toString();
                this.ruleForm.scorePercentage = response.scorePercentage;
                this.ruleForm.scorePercentageMoney = response.scorePercentageMoney;
                this.ruleForm.scoreEnableOrderAchieveCash = response.scoreEnableOrderAchieveCash == 1?true:false;
                this.ruleForm.scoreEnableOrderHighCash = response.scoreEnableOrderHighCash == 1?true:false;
                this.ruleForm.scoreToCashOrderMoney = response.scoreToCashOrderMoney;
                this.ruleForm.scoreToCashOrderRate = response.scoreToCashOrderRate;
                this.ruleForm.scoreCleanType = response.scoreCleanType.toString();
                this.ruleForm.scoreUpperCount = response.scoreUpperCount;
                this.isSwitch = response.scoreUpper == 1? true:false;
            }).catch((error) => {
                console.log(error);
            })
        }
    },
    mounted() {
        this.checkCreditRule();
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.c_container{
    padding: 19px 20px 100px 20px;
    background-color: #fff;
    span{
        color: #3D434A;
    }
    .c_title{
        color: #3D434A;
        margin: 16px 0;
        font-weight: bold;
    }
    .c_warn{
        font-size: 12px;
        color:#92929B;
    }
    .c_line{
        width: 100%;
        height:1px;
        border-bottom: 1px dashed #D3D3D3;
    }
    .btn_cont{
        text-align: center;
        margin: 20px 0;
    }
    .primary_btn{
        background:rgba(101,94,255,0.1);
        color: #655EFF;
        border: none;
    }
    .c_block{
        margin: 16px 0;
        .input_wrap{
            width: 140px;
            display: inline-block;
        }
    }
}
</style>


