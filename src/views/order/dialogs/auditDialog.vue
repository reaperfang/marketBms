<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <el-radio v-model="auditStatus" label="1">通过</el-radio>
            <el-radio class="mgl_30" v-model="auditStatus" label="2">不通过</el-radio>
            <div class="footer">
                <el-button @click="submit" :loading="submitLoading" type="primary">确定</el-button>
                <el-button @click="visible = false">取消</el-button>
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
            auditStatus: '',
            submitLoading: false
        }
    },
    methods: {
        submit() {
            if(this.auditStatus == '') {
                this.$message({
                message: '请选择审核类型',
                type: 'warning'
                });
                return
            }
            this.submitLoading = true
            this.$emit('audit', this.auditStatus)
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


