/* 失败 */
<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="提现详情" :showFooter="false">
        <div class="c_container clearfix">
            <div class="c_top">
                <p>客户ID：{{info.memberSn}}</p>
                <p>提现金额：<span>￥{{info.amount}}</span></p>
                <p class="gray">提现编号：{{info.cashoutSn}}</p>
                <div class="c_status">
                    <p>失败</p>
                    <span>审核未通过</span>
                    <span>操作人：{{info.createUserName}}</span>
                    <span>操作时间：{{info.createTime}}</span>
                </div>
            </div>
            <div class="c_steps clearfix">
                <div class="c_step_l">
                    <span class="c_green"></span>
                    {{info.createTime}}
                </div>
                <div class="c_step_r">
                    <p>申请驳回</p>
                    <p>提现申请被商家驳回，账户可用余额返还￥{{info.amount}}</p>
                    <p>交易流水号 {{info.tradeDetailSn}}</p>
                </div>
            </div>
            <div class="c_steps clearfix">
                <div class="c_step_l">
                    <span class="c_green"></span>
                    {{info1.createTime}}
                </div>
                <div class="c_step_r">
                    <p>提交申请</p>
                    <p>账户可用余额冻结 ￥{{info1.amount}}</p>
                    <p>交易流水 {{info1.tradeDetailSn}}</p>
                </div>
            </div>
            <div class="c_bottom clearfix">
                <div class="fl">
                    审核未通过原因：
                </div>
                <div class="fl gray">
                    {{info.remarks}}
                </div>
            </div>
        </div> 
    </DialogBase>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    name: "failAuditDialog",
    props: ['data'],
    data() {
        return {
            info:{},
            info1:{}
        }
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
    },
    components: {
        DialogBase
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        }
    },
    watch:{
        data(){
            this.getInfo()
        }
    },
    created(){
        this.getInfo()
    },
    methods: {
        submit() {
            this.$emit('handleSubmit')
        },
        getInfo(){
            this._apis.finance.getInfoWd({cashoutDetailId:this.data.id}).then((response)=>{
               this.info = response[0]
               this.info1 = response[1]
            }).catch((error)=>{
                this.$notify.error({
                title: '错误',
                message: error
                });
            })
        },
    },
}
</script>
<style lang="scss" scoped>
/deep/.el-step__icon.is-text{
    border-radius: 0; 
    border: none;
    border-color: none;
}
.gray{
    color: #9FA29F;
}
.c_container{
    text-align: left;
    .c_top{
        border-bottom: 1px solid #CACFCB;
        padding-bottom: 20px;
        margin-bottom: 27px;
        position: relative;
        > p{
            font-size: 16px;
            margin-bottom: 10px;
            span{
                color: #FD4C2B;
            }
        }
        .c_status{
            position: absolute;
            color: #44434B;
            font-size: 24px;
            top: 0;
            right: 12px;
            span{
                display: block;
                color: #9FA29F;
                font-size: 12px;
                margin-top: 5px;
            }
        }
    }
    .c_steps{
        .c_step_l{
            float: left;
            width: 200px;
            height: 80px;
            border-right: 1px solid #dadadc;
            position: relative;
            .c_green{
                display: block;
                width: 5px;
                height: 5px;
                background-color: #3EB488;
                position: absolute;
                right: -3px;
                top: -3px;
                border-radius: 2.5px;
            }
        }
        .c_step_r{
            float: left;
            width: 336px;
            p{
                color: #9FA29F;
                margin: 0 0 5px 32px;
                overflow: hidden;
                &:first-child{
                    color: #333;
                }
            }
        }
    }
    .c_bottom{
        padding-top: 20px;
        border-top: 1px solid #dadadc;
        div:first-child{
            width: 120px;
        }
        div:last-child{
            width: 400px;
            line-height:19px;
        }
    }
}
</style>


