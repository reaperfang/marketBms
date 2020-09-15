<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="关闭订单提示" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>关闭订单后不可撤销，且系统将发起未发货商品的自动退款，您确定关闭订单吗？</p>
            <p>建议与用户沟通后再关闭订单，并选择关闭原因：</p>
            <div>
                <el-select v-model="value" @change="change" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-input
                    v-if="showTextarea"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="operationRemark"
                    maxlength="50"
                    >
                </el-input>
            </div>
        </div>
        <div class="footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            showTextarea: false,
            operationRemark: '',
            options: [{
                value: '1',
                label: '没有配送员接单'
            }, {
                value: '2',
                label: '配送员没来取货'
            }, {
                value: '3',
                label: '配送员态度太差'
            }, {
                value: '4',
                label: '顾客取消订单'
            }, {
                value: '5',
                label: '订单填写错误'
            }, {
                value: '6',
                label: '配送员让我取消此单'
            }, {
                value: '7',
                label: '配送员不愿上门取货'
            }, {
                value: '8',
                label: '我不需要配送了'
            }, {
                value: '9',
                label: '配送员以各种理由表示无法完成订单'
            }, {
                value: '10',
                label: '其他'
            }],
            value: ''
        }
    },
    methods: {
        change() {
            if(this.value == '10') {
                this.showTextarea = true
            }
        },
        submit() {
            

            this.visible = false
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
        font-size: 16px;
    }
   p {
       line-height: 21px;
       margin-bottom: 30px;
   }
   .other {
       margin-top: 14px;
   }
   .footer {
       text-align: center;
       padding-top: 10px;
   }
   /deep/ .el-radio__label {
       font-size: 16px;
   }
   /deep/ .el-select {
       width: 100%;
       margin-bottom: 30px;
   }
</style>
