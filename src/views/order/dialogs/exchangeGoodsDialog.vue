<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="换货确认" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>是否需要{{data.memberSn}}发货：</p>
            <el-radio v-model="exchangeConfirmation" :label="1">是</el-radio>
            <el-radio v-model="exchangeConfirmation" :label="0">否</el-radio>
            <div class="footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button @click="submit" type="primary">确定</el-button>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            exchangeConfirmation: 1
        }
    },
    methods: {
        submit() {
            this._apis.order.orderAfterSaleConfirmExchange({id: this.data.id, exchangeConfirmation: this.exchangeConfirmation }).then((res) => {
                this.$notify({
                    title: '成功',
                    message: '换货确认成功',
                    type: 'success'
                });
                this.visible = false
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
                this.visible = false
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


