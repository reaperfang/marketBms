/*待审核 */
<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="提现详情" :showFooter="false">
        <div class="c_container clearfix">
            <div class="c_top">
                <p>客户ID：{{info.memberSn}}</p>
                <p>提现金额：<span>￥{{info.amount}}</span></p>
                <p>提现编号：{{info.cashoutSn}}</p>
                <p class="c_status">待审核</p>
            </div>
            <div class="c_steps clearfix">
                <div class="c_step_l">
                    <span class="c_green"></span>
                    {{info.createTime}}
                </div>
                <div class="c_step_r">
                    <p>提交申请</p>
                    <p>账户可用余额冻结 ￥{{info.amount}}</p>
                    <p>交易流水 {{info.tradeDetailSn}}</p>
                </div>
            </div>
        </div> 
    </DialogBase>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    name: "waitAuditDialog",
    data() {
        return { 
            info:{}
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
    components: {DialogBase},
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
.c_container{
    text-align: left;
    .c_top{
        border-bottom: 1px solid #CACFCB;
        padding-bottom: 20px;
        position: relative;
        p{
            font-size: 16px;
            margin-bottom: 10px;
            span{
                color: #FD4C2B;
            }
            &.gray{
                color: #9FA29F;
            }
            &.c_status{
                position: absolute;
                color: #44434B;
                font-size: 24px;
                top: 0;
                right: 56px;
            }
        }
    }
    .c_steps{
        padding-top: 23px;
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
            p{
                color: #9FA29F;
                margin: 0 0 5px 32px;
                &:first-child{
                    color: #333;
                }
            }
        }
    }
}
</style>


