<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <el-radio v-model="refuseReasonLabel" :label="1">人为破坏拒绝售后</el-radio>
            <el-radio v-model="refuseReasonLabel" :label="2">其他</el-radio>
            <el-input
            style="margin-top: 10px;"
            v-if="refuseReasonLabel == 2"
            type="textarea"
            :rows="2"
            placeholder="请输入原因"
            v-model="refuseReason">
            </el-input>
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
            refuseReason: '',
            refuseReasonLabel: 1
        }
    },
    methods: {
        submit() {
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
            this.$emit('reject', this.refuseReasonLabel == 1 ? '人为破坏拒绝售后' : this.refuseReason)
            this.visible = false
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
   .footer {
       text-align: center;
       margin-top: 140px;
   }
</style>


