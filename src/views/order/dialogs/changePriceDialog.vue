<template>
    <DialogBase :visible.sync="visible" @submit="submit" @close="close" title="提示" width="500px" :showFooter="showFooter">
        <div class="container">
            <div class="icon-box">
                <i class="icon-success"></i>
            </div>
            <p class="message">修改价格成功！</p>
            <p>{{time}}S后自动跳转到订单列表页或 <a @click="$router.push('/order/query')" href="javascript:;">立即跳转</a>。</p>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            operationType: '6',
            operationRemark: '',
            showTextarea: false,
            time: 5,
            timer: null
        }
    },
    created() {
        let that = this
        
        function startTime() {
            that.timer = setTimeout(function(){ startTime() }, 1000);

            if(that.time == 0) {
                clearTimeout(that.timer)
                that.$router.push('/order/query')
                that.visible = false
            } else {
                that.time = that.time - 1
            }
        }

        startTime()
    },
    methods: {
        submit() {
            
        },
        close() {
            clearTimeout(this.timer)
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
    }
}
</script>
<style lang="scss" scoped>
    .container {
        font-size:18px;
        font-weight:400;
        color:rgba(68,61,74,1);
        p {
            text-align: center;
            font-weight:400;
            a {
                color: rgb(101, 94, 255);
                text-decoration: underline;
            }
            &:last-child {
                margin-top: 5px;
            }
        }
    }
   .icon-box {
       text-align: center;
       .icon-success {
           display: inline-block;
           width: 50px;
           height: 50px;
           background: url('../../../assets/images/order/success.png') no-repeat;
           background-size: 100% 100%;
       }
   }
   /deep/ .el-dialog__body {
       padding-top: 43px;
       padding-bottom: 43px;
   }
   .message {
       margin-top: 14px;
       margin-bottom: 29px;
   }
</style>


