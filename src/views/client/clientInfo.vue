<template>
    <div class="c_container">
        <div class="c_top clearfix">
            <span class="addBlack" @click="showAddBlack" v-if="clientInfoById.status == 0">加入黑名单</span>
            <span class="removeBlack" @click="showRemoveBlack" v-else>移除黑名单</span>
            <div class="c_top_l fl">
                <p>基本信息：</p>
            </div>
            <div class="c_top_m fl">
                <p style="margin-top: 57px">用户ID: <span>{{clientInfoById.memberSn}}</span></p>
                <!-- <p>微信公众号关注状态: <span>已关注</span></p> -->
                <!-- <p>微信昵称: <span>{{clientInfoById.nickName}}</span></p>
                <p>手机号: <span>{{clientInfoById.phone}}</span></p> -->
                <p>用户渠道: <span>{{clientInfoById.channelName}}</span></p>
                <p>成为用户时间: <span>{{clientInfoById.becameCustomerTime}}</span></p>
                <p>成为会员时间: <span>{{clientInfoById.becameMemberTime}}</span></p>
                <p>用户身份: {{clientInfoById.levelName}}<span class="addMainColor pointer marR20" @click="changeIdentity">&nbsp;&nbsp;&nbsp;&nbsp;变更</span></p>
            </div>
            <div class="c_top_r fl">
                <img :src="clientInfoById.headIcon" alt="">
                <div class="c_title">
                    个人资料
                </div>
                <div class="form_container">
                    <p>昵称：<span>{{clientInfoById.nickName}}</span></p>
                    <p>姓名：<span>{{clientInfoById.memberName}}</span></p>
                    <p>性别：<span>{{sexText}}</span></p>
                    <p>生日：<span>{{clientInfoById.birthday}}</span></p>
                    <p>爱好：<span>{{clientInfoById.hobby}}</span></p>
                    <p>手机号：<span>{{clientInfoById.phone}}</span></p>
                    <p>邮箱：<span>{{clientInfoById.email}}</span></p>
                </div>  
            </div>
        </div>
        <div class="c_mid">
            <p style="font-weight: bold">标签信息：</p>
            <div class="labels">
                <div class="label_list">
                    <p v-for="item in clientInfoById.labelRecordViews" :key="item.id" v-if="item.memberLabelInfoName">
                        <span>{{item.memberLabelInfoName}}
                            <img src="../../assets/images/client/icon_manual.png" alt="" v-if="item.memberLabelInfoType == 0">
                            <img src="../../assets/images/client/icon_auto.png" alt="" v-if="item.memberLabelInfoType == 1">
                        </span>
                        <img src="../../assets/images/client/icon_remove.png" alt="" v-if="item.memberLabelInfoType == 0" @click="deleteTag(item.id)">
                    </p>
                    <img src="../../assets/images/client/icon_add.png" alt="" @click="addTag" class="add_tag">
                </div>
                
            </div>
        </div>
        <div class="c_mid">
            <p style="font-weight: bold">资产信息：</p>
            <div class="assets">
                <div class="assets_item">
                    <img src="../../assets/images/client/icon_vip.png" alt="">
                    <p>会员卡：
                        <span v-if="!!clientInfoById.cardLevelInfoId">{{clientInfoById.cardLevelName}}</span>
                        <span v-if="!clientInfoById.cardLevelInfoId">无</span>
                    </p>
                    <span v-if="!!clientInfoById.cardLevelInfoId" @click="showChangeCard">变更</span>
                    <span v-if="!clientInfoById.cardLevelInfoId" @click="showSendCard">发放</span>
                </div>
                <div class="assets_item">
                    <img src="../../assets/images/client/icon_money.png" alt="" @click="showAdjustBalance" class="pointer">
                    <p @click="showBalanceList">余额：<span class="p_style">{{clientInfoById.balance || 0}}</span>元</p>
                    <span @click="showAdjustBalance">变更</span>
                </div>
                <div class="assets_item">
                    <img src="../../assets/images/client/icon_coupon.png" alt="" @click="sendCoupon" class="pointer">
                    <p>可用优惠券：<span @click="showDiscountCoupon('0')" class="p_style">{{couponNum || 0}}</span>张</p>
                    <span @click="sendCoupon">发放</span>
                </div>
                <div class="assets_item">
                    <img src="../../assets/images/client/icon_code.png" alt="" @click="sendCode" class="pointer">
                    <p>可用优惠码：<span @click="showDiscountCoupon('1')" class="p_style">{{codeNum || 0}}</span>个</p>
                    <span @click="sendCode">发放</span>
                </div>
                <div class="assets_item rb">
                    <img src="../../assets/images/client/icon_money.png" alt="" @click="showScoreList" class="pointer">
                    <p>积分：<span @click="showScoreList" class="p_style">{{clientInfoById.score}}</span></p>
                    <span @click="showAdjustScore">变更</span>
                </div>
            </div>
        </div>
        <div class="c_mid" style="border-bottom: none">
            <p style="font-weight: bold">交易统计：<span style="color: #b9b9b9">（系统自动确认收货的货到付款订单不在统计范围内）</span></p>
            <div class="assets">
                <div class="assets_item">
                    <p>最近下单时间</p>
                    <p>{{clientInfoById.lastPayTime || "还未下单"}}</p>
                </div>
                <div class="assets_item">
                    <p>客单价</p>
                    <p>¥ {{clientInfoById.perUnitPrice || 0}}</p>
                </div>
                <div class="assets_item">
                    <p>累计消费金额</p>
                    <p>¥ {{clientInfoById.totalDealMoney || 0}}</p>
                </div>
                <div class="assets_item rb">
                    <p>累计消费订单数</p>
                    <p class="pointer p_style" @click="_routeTo('query',{id: userId, isPay: 1})" style="color: #655EFF; text-decoration: none">{{clientInfoById.dealTimes || 0}}</p>
                </div>
            </div>
        </div>
        <component 
            :is="currentDialog" 
            :dialogVisible.sync="dialogVisible" 
            :data="currentData"
            @sendDiscount="sendDiscount"
            @refreshPage="refreshPage" 
            v-if="dialogVisible">
        </component>
    </div>
</template>
<script type="es6">
import clientCont from '@/system/constant/client';
import clientApi from '@/api/client';
import changeIdentityDialog from './dialogs/clientInfo/changeIdentityDialog';
import addTagDialog from './dialogs/clientInfo/addTagDialog';
import balanceListDialog from './dialogs/clientInfo/balanceListDialog';
import adjustBalanceDialog from './dialogs/clientInfo/adjustBalanceDialog';
import adjustCreditDialog from './dialogs/clientInfo/adjustCreditDialog';
import discountCouponDialog from './dialogs/clientInfo/discountCouponDialog';
import issueCouponDialog from './dialogs/clientInfo/issueCouponDialog';
import issueCodeDialog from './dialogs/clientInfo/issueCodeDialog';
import addBlackDialog from './dialogs/clientInfo/addBlackDialog';
import removeBlackDialog from './dialogs/clientInfo/removeBlackDialog';
import sendCardDialog from './dialogs/clientInfo/sendCardDialog';
import changeCardDialog from './dialogs/clientInfo/changeCardDialog';
import scoreListDialog from './dialogs/clientInfo/scoreListDialog';
export default {
    name: 'clientInfo',
    components: { 
        changeIdentityDialog, 
        addTagDialog, 
        balanceListDialog, 
        adjustBalanceDialog, 
        discountCouponDialog, 
        issueCouponDialog, 
        addBlackDialog,
        removeBlackDialog,
        sendCardDialog,
        changeCardDialog,
        adjustCreditDialog,
        issueCodeDialog,
        scoreListDialog
    },
    data() {
        return {
            currentDialog:"",
            dialogVisible: false,
            currentData:{},
            userId: this.$route.query.id,
            clientInfoById: {
                selected:[]
            },
            allCoupons: [],
            allCodes: [],
            couponList: [],
            codeList: [],
            level: "",
            sexText: "",
            topLevel: 0,
            topCard: 0,
            couponNum: 0,
            codeNum: 0
        }
    },
    methods: {
        getCouponNum() {
            this._apis.client.getCouponNum({memberId: this.userId, t: Date.parse(new Date()) / 1000}).then(response => {
                this.couponNum = response.couponNum;
                this.codeNum = response.couponCodeNum;
            }).catch(error => {
                console.error(error);
            })
        }, 
        getLevelMax() {
            this._apis.client.getLevelMax({}).then(response => {
                this.topLevel = response;
            }).catch(error => {
                console.error(error)
            })
        },
        getCardMax() {
            this._apis.client.getCardMax({}).then(response => {
                this.topCard = response;
            }).catch(error => {
                console.error(error)
            })
        },
        refreshPage(num) {
            if(num == 1) {
                this.getAllCoupons();
                this.getCouponNum();
            }else if(num == 2) {
                this.getAllCodes();
                this.getCouponNum();
            }else{
                this.getMemberInfo();
            }
        },
        changeIdentity() {
            let tl = this.topLevel == 9 ? 9:this.topLevel;
            if(this.clientInfoById.level !== tl) {
                this.dialogVisible = true;
                this.currentDialog = "changeIdentityDialog";
                this.currentData.id = this.userId;
                this.currentData.oldLevelId = this.clientInfoById.levelInfoId;
                this.currentData.identity = this.clientInfoById.levelName;
                this.currentData.memberSn = this.clientInfoById.memberSn;
                this.currentData.oldLevel = this.clientInfoById.level;
                this.currentData.memberType = this.clientInfoById.memberType;
                this.currentData.level = this.clientInfoById.level;
            }else{
                this.$message({
                    message: '已是最高等级无法变更',
                    type: 'warning'
                });
            }
        },
        deleteTag(id) {
            this._apis.client.removeLabel({id:id}).then((response) => {
                this.$message({
                    message: '移除标签成功',
                    type: 'success'
                });
                this.getMemberInfo();
            }).catch((error) => {
                console.error(error);
            })
        },
        addTag() {
            let arr = [];
            this.clientInfoById.labelRecordViews.map((v) => {
                arr.push(v.memberLabelInfoName);
            });
            this.dialogVisible = true;
            this.currentData.id = this.userId;
            this.currentData.selectedNames = [].concat(arr);
            this.currentDialog = "addTagDialog";
        },
        showBalanceList() {
            this.dialogVisible = true;
            this.currentDialog = "balanceListDialog";
            this.currentData.balance = this.clientInfoById.balance;
            this.currentData.id = this.userId;
        },
        showAdjustBalance() {
            this.dialogVisible = true;
            this.currentDialog = "adjustBalanceDialog";
            this.currentData.balance = this.clientInfoById.balance;
            this.currentData.id = this.clientInfoById.id;
            this.currentData.memberSn = this.clientInfoById.memberSn;
        },
        showAdjustScore() {
            this.dialogVisible = true;
            this.currentDialog = "adjustCreditDialog";
            this.currentData.score = this.clientInfoById.score;
            this.currentData.id = this.clientInfoById.id;
            this.currentData.memberSn = this.clientInfoById.memberSn;
        },
        showDiscountCoupon(type) {
            this.dialogVisible = true;
            this.currentDialog = "discountCouponDialog";
            this.currentData.type = type;
            this.currentData.id = this.userId;
            this.currentData.couponList = [].concat(this.couponList);
            this.currentData.codeList = [].concat(this.codeList);
        },
        sendDiscount(val) {
            if(val == 'first') {
                this.dialogVisible = true;
                this.currentDialog = "issueCouponDialog";
                this.currentData.allCoupons = [].concat(this.allCoupons);
                this.currentData.memberSn = this.clientInfoById.memberSn;
                this.currentData.weChartNickname = this.clientInfoById.nickName;
            }else{
                this.dialogVisible = true;
                this.currentDialog = "issueCodeDialog";
                this.currentData.allCodes = [].concat(this.allCodes);
                this.currentData.memberSn = this.clientInfoById.memberSn;
                this.currentData.weChartNickname = this.clientInfoById.nickName;
            }
        },
        showAddBlack() {
            this.dialogVisible = true;
            this.currentDialog = "addBlackDialog";
            this.currentData.memberSn = this.clientInfoById.memberSn;
            this.currentData.id = this.clientInfoById.id;
        },
        showRemoveBlack() {
            this.dialogVisible = true;
            this.currentDialog = "removeBlackDialog";
            this.currentData.memberSn = this.clientInfoById.memberSn;
            this.currentData.id = this.clientInfoById.id;
        },
        showSendCard() {
            this.dialogVisible = true;
            this.currentDialog = "sendCardDialog";
            this.currentData.id = this.userId;
            this.currentData.memberSn = this.clientInfoById.memberSn;
        },
        showChangeCard() {
            let tl = this.topCard == 5?5:this.topCard;
            if(this.clientInfoById.cardLevel !== tl) {
                this.dialogVisible = true;
                this.currentDialog = "changeCardDialog";
                this.currentData.id = this.userId;
                this.currentData.memberSn = this.clientInfoById.memberSn;
                this.currentData.level = this.clientInfoById.cardLevelName;
                this.currentData.oldLevel = this.clientInfoById.cardLevel;
            }else{
                this.$message({
                    message: '已是最高等级无法变更',
                    type: 'warning'
                })
            }
            
        },
        showScoreList() {
            this.dialogVisible = true;
            this.currentDialog = "scoreListDialog";
            this.currentData.score = this.clientInfoById.score;
            this.currentData.frozenScore = this.clientInfoById.frozenScore;
            this.currentData.id = this.userId;
        },
        getAllCoupons() {
            this._apis.client.getDistributeCouponList({memberId:this.userId, couponType: 0}).then((response) => {
                this.allCoupons = [].concat(response);
                this.allCoupons.map((item) => {
                    this.$set(item, 'frozenNum',1);
                })
            }).catch((error) => {
                console.error(error);
            })
        },
        getAllCodes() {
            this._apis.client.getDistributeCouponList({memberId:this.userId, couponType: 1}).then((response) => {
                this.allCodes = [].concat(response);
                this.allCodes.map((item) => {
                    this.$set(item, 'frozenNum',1);
                })
            }).catch((error) => {
                console.error(error);
            })
        },
        getMemberInfo() {
            this._apis.client.getMemberInfo({id: this.userId}).then((response) => {
                this.clientInfoById = Object.assign({},response);
                if(this.clientInfoById.sex == 1) {
                    this.sexText = "男";
                }else if(this.clientInfoById.sex == 2) {
                    this.sexText = "女";
                }else{
                    this.sexText = "未知";
                }
                let selected = [];
                selected[0] = this.clientInfoById.provinceCode;
                selected[1] = this.clientInfoById.cityCode;
                selected[2] = this.clientInfoById.areaCode;
                this.$set(this.clientInfoById, 'selected',selected);
            }).catch((error) => {
                console.error(error);
            })
        },
        sendCoupon() {
            this.dialogVisible = true;
            this.currentDialog = "issueCouponDialog";
            this.currentData.id = this.userId;
            this.currentData.memberSn = this.clientInfoById.memberSn;
            this.currentData.weChartNickname = this.clientInfoById.nickName;
            this.currentData.allCoupons = [].concat(this.allCoupons);
        },
        sendCode() {
            this.dialogVisible = true;
            this.currentDialog = "issueCodeDialog";
            this.currentData.id = this.userId;
            this.currentData.memberSn = this.clientInfoById.memberSn;
            this.currentData.weChartNickname = this.clientInfoById.nickName;
            this.currentData.allCodes = [].concat(this.allCodes);
        }
    },
    computed: {
    },
    created() {
        this.$nextTick(function() {
            if(this.$route.query.id) {
                this.getMemberInfo();
            }
        });
        this.getCouponNum();
        this.getLevelMax();
        this.getCardMax();
        this.getAllCoupons();
        this.getAllCodes();
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.el-button--mini{
    border-color: #655EFF;
    color: #655EFF;
}
/deep/.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 10px;
}
/deep/.area-select-wrap .area-select{
    margin-left: 0;
    margin-bottom: 10px;
}
/deep/.area-select .area-selected-trigger{
    padding: 0px 20px 7px 12px;
}
/deep/.area-select.large{
    width: 206px;
}
.c_container{
    background-color: #fff;
    padding: 20px;
    height:100%;
    .c_top{
        padding-bottom: 15px;
        border-bottom: 1px dashed #D3D3D3;
        color: #3D434A;
        position: relative;
        .addBlack{
            display: block;
            position: absolute;
            width: 70px;
            height: 70px;
            padding-top: 39px;
            color: #655EFF;
            background: url('../../assets/images/client/icon_addblack2.png') 11px 0 no-repeat;
            left: 980px;
            top: -3px;
            cursor: pointer;
        }
        .removeBlack{
            display: block;
            position: absolute;
            width: 70px;
            height: 70px;
            padding-top: 39px;
            color: #FD4C2B;
            background: url('../../assets/images/client/icon_remove2.png') 11px 0 no-repeat;
            left: 980px;
            top: -3px;
            cursor: pointer;
        }
        .c_top_l{
            p{
                font-weight: bold;
            }
        }
        .c_top_m{
            width: 240px;
            margin-left: 26px;
            p{
                margin-top: 33px;
            }
        }
        .c_top_r{
            width:415px;
            box-shadow:0px 0px 14px 0px rgba(208,214,228,1);
            border-radius:10px;
            border:1px solid rgba(204,204,204,1);
            margin-left: 102px;
            position: relative;
            img{
                position: absolute;
                display: block;
                width: 52px;
                height: 52px;
                border-radius: 26px;
                margin-top: 17px;
                background-color: #eee;
                top: 36px;
                right: 16px;
            }
            .c_title{
                height: 48px;
                line-height: 48px;
                padding-left: 20px;
                font-size: 18px;
                background:#F6F7FA;
                border-radius:10px 10px 0px 0px;
                .btn{
                    float: right;
                    margin: 10px 10px 0 0;
                }
            }
            .form_container{
                padding: 11px 0 0 20px;
                .input_wrap{
                    float: right;
                    display: inline-block;
                    width: 205px;
                    margin-right: 120px;
                }
                p{
                    margin-bottom: 20px;
                }
            }
        }
    }
    .c_mid{
        border-bottom: 1px dashed #D3D3D3;
        padding: 20px 0 38px 0;
        .labels{
            display: flex;
            margin: 12px 0 0 30px;
            .label_list{
                max-width: 680px;
                display: flex;
                flex-wrap: wrap;
                position: relative;
                p{
                    margin: 0 15px 10px 0;
                    display: flex;
                    span{
                        display: block;
                        padding: 0 20px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        border-radius:4px;
                        border:1px solid rgba(101,94,255,1);
                        color: #655EFF;
                        position: relative;
                        img{
                            position: absolute; 
                            bottom: 0;
                            right: 0;
                            width: 14px;
                            height: 14px;
                        }
                    }
                    img{
                        width: 25px;
                        height: 25px;
                        margin-top: 3px;
                        cursor: pointer;
                    }
                }
                .add_tag{
                    cursor: pointer;
                    position: absolute;
                    right: -17px;
                    top: 0;
                }
            }
            img{
                width: 26px;
                height: 26px;
            }
        }
    }
    .assets{
        display: flex;
        margin: 16px 0 0 15px;
        .assets_item{
            text-align: center;
            border-left: 1px dashed #DFDFDF;
            padding: 0 30px;
            > span{
                display: block;
                color: #655EFF;
                margin-top: 5px;
                cursor: pointer;
            }
            &.rb{
                border-right: 1px dashed #DFDFDF;
            }
            p{
                margin-bottom: 5px;
            }
            .p_style{
                font-size: 18px;
                color: #FD4C2B;
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
}
.marR20{
    margin-right: 20px
}
</style>
