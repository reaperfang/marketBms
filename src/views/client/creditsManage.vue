<template>
    <div class="c_container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="积分通用规则" name="first" v-permission="['用户', '积分管理', '积分通用规则']">
                <p class="c_title">积分使用规则：</p>
                <div>
                    <el-form :model="ruleForm" ref="ruleForm">
                        <el-form-item label="是否开启积分抵现：" prop="scoreToCash">
                            <div class="marL20">
                                <br>
                                <el-radio v-model="ruleForm.scoreToCash" label="0" @change="closeScoreToCash">不开启</el-radio><span class="c_warn">&nbsp;&nbsp;&nbsp;&nbsp;说明：开启用用户可以使用积分抵现（但不支持积分商城订单）</span><br>
                                <el-radio v-model="ruleForm.scoreToCash" label="1" @change="openScoreToCash">开启</el-radio><br>
                                <div v-if="ruleForm.scoreToCash == '1'">
                                    <span>抵现比例：</span>
                                    <div style="width: 140px; display: inline-block">
                                        <el-input maxlength="9" placeholder="请输入整数" v-model="ruleForm.scorePercentage" @keyup.native="checkZero2($event,ruleForm.scorePercentage,'scorePercentage')"></el-input>
                                    </div>
                                    <span class="marL20">积分</span>
                                    <div style="width: 54px; display: inline-block" class="marL20">
                                        <el-input v-model="ruleForm.scorePercentageMoney" :disabled="true"></el-input>
                                    </div>
                                    <span class="marL20">元</span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="积分抵现条件：" v-if="ruleForm.scoreToCash == '1'">
                            <el-checkbox v-model="ruleForm.scoreEnableOrderAchieveCash" @change="handleCheck2"></el-checkbox>
                            <span class="marR50">订单满</span>
                            <div style="width: 222px; display: inline-block" class="marL20">
                                <el-input placeholder="请输入整数，不填则不生效" v-model="ruleForm.scoreToCashOrderMoney" @keyup.native="checkZero2($event,ruleForm.scoreToCashOrderMoney,'scoreToCashOrderMoney')"></el-input>
                            </div>
                            <span class="marL20">元</span>
                        </el-form-item>
                        <el-form-item v-if="ruleForm.scoreToCash == '1'">
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
                                <el-radio v-model="ruleForm.scoreCleanType" label="1">自然年清零上一年获得的积分</el-radio><span class="c_warn">&nbsp;&nbsp;&nbsp;&nbsp;每年12月31日清空上一年获得的积分</span>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn_cont">
                    <el-button type="primary" class="btn_primary" @click="save" v-permission="['用户', '积分管理', '积分通用规则', '保存']">保 存</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="获取积分规则" name="second" v-permission="['用户', '积分管理', '获取积分规则']">
                <div class="c_block">
                    <el-switch
                        v-model="isSwitch"
                        active-color="#13ce66" inactive-color="#CACACF"
                        @change="handleSwitch"
                    ></el-switch>
                    <span class="marR20">积分获取上限</span>
                    <span>每日最高获得：</span>
                    <div class="input_wrap">
                        <el-input placeholder="请输入整数" v-model="ruleForm.scoreUpperCount" :disabled="!isSwitch" @keyup.native="checkZero2($event,ruleForm.scoreUpperCount,'scoreUpperCount')"></el-input>
                    </div>
                    <span class="marL20">积分</span>
                    <el-button type="primary" class="marL20" v-if="isSwitch" @click="save2">保存</el-button>
                    <span style="margin-left: 10px">(积分上限只限制登录、购买、复购以及评价场景，其他场景获得的积分不在限制以内)</span>
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
        handleCheck2() {
            if(!this.ruleForm.scoreEnableOrderAchieveCash) {
                this.ruleForm.scoreToCashOrderMoney = "";
            }
        },
        checkZero(event,val,ele) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/^0/g,'');
            this.ruleForm[ele] = val;
        },
        checkZero2(event,val,ele) {
            val = val.replace(/[^\d]/g,'');
            val = val.replace(/^0/g,'');
            this.ruleForm[ele] = val;
        },
        checkPersent(event,val,ele) {
            val = val.replace(/[^\d]/g,'');
            val = val.replace(/^0/g,'');
            if(val > 100) {
                val = ""
            }
            this.ruleForm[ele] = val;
        },
        openScoreToCash(val) {
            if(val == '1') {
                this.ruleForm.scorePercentageMoney = 1
            }
        },
        closeScoreToCash(val) {
            if(val == '0') {
                this.ruleForm.scorePercentageMoney = "";
                this.ruleForm.scorePercentage = "";
            }
        },
        save() {
            let formObj = Object.assign({},this.ruleForm);
            if(formObj.scoreToCash == '1' && formObj.scorePercentage == "" && formObj.scorePercentage == "") {
                this.$message({
                    message: "开启积分抵现则抵现比例为必填",
                    type: 'warning'
                });
            }else if(formObj.scoreEnableOrderAchieveCash && formObj.scoreToCashOrderMoney == ""){
                this.$message({
                    message: "请输入订单满元值",
                    type: 'warning'
                });
            }else if(formObj.scoreEnableOrderHighCash && formObj.scoreToCashOrderRate == ""){
                this.$message({
                    message: "请输入最高可抵现订单金额百分比",
                    type: 'warning'
                });
            }else{
                formObj.scoreEnableOrderAchieveCash = formObj.scoreEnableOrderAchieveCash == true?'1':'0';
                formObj.scoreEnableOrderHighCash = formObj.scoreEnableOrderHighCash == true?'1':'0';
                // formObj.scoreToCashOrderMoney = formObj.scoreToCashOrderMoney == "" ? -1:formObj.scoreToCashOrderMoney;
                formObj.scoreToCashOrderMoney = formObj.scoreEnableOrderAchieveCash=="1" ? formObj.scoreToCashOrderMoney:-1;
                // formObj.scoreToCashOrderRate = formObj.scoreToCashOrderRate == "" ? -1:formObj.scoreToCashOrderRate;
                formObj.scoreToCashOrderRate = formObj.scoreEnableOrderHighCash == "1" ? formObj.scoreToCashOrderRate:-1;
                formObj.id = this.$store.getters.shopInfos.id;
                this._apis.shopInfo.updateShopInfo(formObj).then((response) => {
                    this.$message({
                        message: "保存积分规则成功",
                        type: 'success'
                    });
                    this.checkCreditRule();
                }).catch((error) => {
                   this.$message.error(error);
                })
            }
        },
        save2() {
            if(this.ruleForm.scoreUpperCount=='') {
                this.$message({
                    message: "每日最高获得积分数不能为空",
                    type: 'warning'
                });
            }else{
                this._apis.shopInfo.updateShopInfo({scoreUpper: this.isSwitch?'1':'0', scoreUpperCount: this.ruleForm.scoreUpperCount, id: this.$store.getters.shopInfos.id}).then((response) => {            
                    this.$store.dispatch('getShopInfo');     
                    this.$message({
                        message: "每日最高获得积分数保存成功",
                        type: 'success'
                    });
                }).catch((error) => {
                    console.error(error);
                })
            }
        },
        handleSwitch(val) {
            if(!val) {
                this.ruleForm.scoreUpperCount = "";
                this._apis.shopInfo.updateShopInfo({scoreUpper: this.isSwitch?'1':'0', id: this.$store.getters.shopInfos.id}).then((response) => {
                    this.$store.dispatch('getShopInfo');
                    this.$message({
                        message: "关闭成功",
                        type: 'success'
                    });
                }).catch((error) => {
                    console.error(error);
                })
            }
        },
        checkCreditRule() {
            this.$store.dispatch('getShopInfo').then((response) => {
                this.ruleForm.scoreToCash = response.scoreToCash.toString();
                this.ruleForm.scorePercentage = response.scoreToCash == 1 ? response.scorePercentage:'';
                this.ruleForm.scorePercentageMoney = response.scoreToCash == 1 ? response.scorePercentageMoney:'';
                this.ruleForm.scoreEnableOrderAchieveCash = response.scoreEnableOrderAchieveCash == 1?true:false;
                this.ruleForm.scoreEnableOrderHighCash = response.scoreEnableOrderHighCash == 1?true:false;
                this.ruleForm.scoreToCashOrderMoney = response.scoreToCashOrderMoney == -1?'':response.scoreToCashOrderMoney;
                this.ruleForm.scoreToCashOrderRate = response.scoreToCashOrderRate == -1?'':response.scoreToCashOrderRate;
                this.ruleForm.scoreCleanType = response.scoreCleanType.toString();
                this.ruleForm.scoreUpperCount = response.scoreUpperCount;
                this.isSwitch = response.scoreUpper == 1? true:false;
            }).catch((error) => {
                console.error(error);
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
    padding: 20px;
    padding-top:0;
    background-color: #fff;
    min-height:100%;
    border-radius: 4px;
    .marL20{
        margin-left: 20px;
    }
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
    .marR20{
        margin: 0 20px;
    }
}
</style>


