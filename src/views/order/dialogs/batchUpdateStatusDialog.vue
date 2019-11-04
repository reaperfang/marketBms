<template>
    <DialogBase :visible.sync="visible" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <el-radio v-model="auditStatus" label="1">通过</el-radio>
            <el-radio v-model="auditStatus" label="2">不通过</el-radio>
            <div class="footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button @click="submit" type="primary">确定</el-button>
            </div>
            <el-dialog
                title="提示"
                :visible.sync="showReject"
                width="500px">
                <div>
                    <p style="margin-bottom: 10px;">拒绝申请可能会受到客户差评，如果确定拒绝售后，请选择拒绝原因：</p>
                    <el-radio v-model="refuseReasonLabel" :label="1">人为破坏拒绝售后</el-radio>
                    <el-radio v-model="refuseReasonLabel" :label="2">其他</el-radio>
                    <el-input
                        style="margin-top: 10px;"
                        v-if="refuseReasonLabel == 2"
                        type="textarea"
                        :rows="2"
                        maxlength="20"
                        placeholder="请输入原因"
                        v-model="refuseReason">
                    </el-input>
                </div>
                <span slot="footer" class="dialog-footer" style="text-align: center; display: block;">
                    <el-button @click="showReject = false">取 消</el-button>
                    <el-button type="primary" @click="rejectHandler">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import RejectDialog from '@/views/order/dialogs/rejectDialog'

export default {
    data() {
        return {
            showFooter: false,
            auditStatus: '',
            currentDialog: '',
            showReject: false,
            refuseReason: '',
            refuseReasonLabel: 1
        }
    },
    methods: {
        rejectHandler() {
            if(this.refuseReasonLabel == 2) {
                if(!this.refuseReason) {
                    this.$message({
                    message: '请输入拒绝原因',
                    type: 'warning'
                    });
                    return
                }
                if(/^\s+$/.test(this.refuseReason)) {
                    this.$message({
                    message: '拒绝原因不能为空',
                    type: 'warning'
                    });
                    return
                }
            }
            this.$emit('submit', {status: 2, refuseReason: this.refuseReasonLabel == 1 ? '人为破坏拒绝售后' : this.refuseReason})
            this.showReject = false
            this.visible = false
        },
        submit() {
            //this.$emit('audit', this.auditStatus)
            if(this.auditStatus == 2) {
                this.showReject = true
                this.$nextTick(() => {
                    setTimeout(() => {
                        document.querySelector('.v-modal').style.display = 'none'
                    }, 0)
                })
            } else {
                this.$emit('submit', {status: 1})
                this.visible = false
            }
            
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
        title: {
            type: String,
            required: true
        },
    },
    components: {
        DialogBase,
        RejectDialog
    }
}
</script>
<style lang="scss" scoped>
   .footer {
       text-align: center;
       margin-top: 140px;
   }
   /deep/ .v-modal {
       display: none!important;
       z-index: 0!important;
   }
   /deep/ .el-dialog__wrapper {
       background: rgba(0, 0, 0, 0.5);
   }
</style>

