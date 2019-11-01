<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="关闭订单提示" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>关闭订单后不可撤销，且系统将发起未发货商品的自动退款，您确定关闭订单吗？</p>
            <p>建议与客户沟通后再关闭订单，并选择关闭原因：</p>
            <div>
                <span @click="showTextarea = false">
                    <el-radio v-model="operationType" label="6">客户申请关闭</el-radio>
                </span>
                <span @click="showTextarea = false">
                    <el-radio v-model="operationType" label="7">库存不足</el-radio>
                </span>
                
                <p @click="showTextarea = true" class="other">
                    <el-radio v-model="operationType" label="9">其它</el-radio>
                </p>
                <el-input
                    v-if="showTextarea"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="operationRemark">
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
            operationType: '6',
            operationRemark: '',
            showTextarea: false
        }
    },
    methods: {
        submit() {
            let operationRemark = ''

            if(this.operationType == 6) {
                operationRemark = '客户申请关闭'
            } else if(this.operationType == 7) {
                operationRemark = '库存不足'
            } else if(this.operationType == 9) {
                operationRemark = this.operationRemark
                if(!this.operationRemark) {
                    this.$message({
                    message: '请输入关闭原因',
                    type: 'warning'
                    });
                    return
                }
                if(/^\s+$/.test(this.operationRemark)) {
                    this.$message({
                    message: '关闭原因不能为空',
                    type: 'warning'
                    });
                    return
                }
            }
            this.$emit('submit', {
                operationType: 6,
                operationRemark
            })

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
</style>


