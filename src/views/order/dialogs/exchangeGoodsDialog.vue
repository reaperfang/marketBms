<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="换货确认" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>是否需要用户退回商品：</p>
            <el-radio v-model="exchangeConfirmation" :label="1">需要退货</el-radio>
            <el-radio v-model="exchangeConfirmation" :label="0">无需退货</el-radio>
            <div class="footer">
                <!-- <el-button @click="visible = false">取消</el-button> -->
                <el-button @click="submit" type="primary">确定</el-button>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    props: ['data'],
    data() {
        return {
            showFooter: false,
            exchangeConfirmation: 1
        }
    },
    methods: {
        submit() {
            // this._apis.order.orderAfterSaleConfirmExchange({id: this.data.id, exchangeConfirmation: this.exchangeConfirmation }).then((res) => {
            //     this.$message.success('换货确认成功');
            //     this.visible = false
            // }).catch(error => {
            //     this.$message.error(error);
            //     this.visible = false
            // })
            
            this._apis.order.orderAfterSaleConfirmExchange({id: this.data.id, orderAfterSaleStatus: this.exchangeConfirmation == "0"?2:1, exchangeConfirmation: this.exchangeConfirmation}).then((res) => {
                console.log(res)
                this.$parent.getList && this.$parent.getList();
                this.$parent.getDetail && this.$parent.getDetail();
                // this.confirm({title: '换货确认', icon: true, text: `是否确认${_title}？`}).then(() => {
                    
                // })
                this.$message.success('审核成功！');
                this.visible = false;
            }).catch(error => {
                this.$message.error(error);
            })
        }
    },
    mounted() {
        
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
        title: {
            type: String,
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
        font-size: 16px;
        p {
            margin-bottom: 20px;
        }
    }
   .footer {
       text-align: center;
       margin-top: 140px;
   }
</style>


