<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :width="width"
        :title="title"
        v-bind="$attrs"
        v-on="$listeners">
        <div class="dialog-container">
            <slot></slot>
        </div>
        <span v-if="showFooter" slot="footer" class="dialog-footer fcc">
            <el-button type="primary" @click="submit">确 认</el-button>
            <el-button v-if="hasCancel" @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        dialogVisible: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val)
            }
        }
    },
    created() {
        
    },
    methods: {
        submit() {
            this.$emit('submit')
            this.dialogVisible = false
        }
    },
    props: {
        visible: {
            type: Boolean,
            required: true
        },
        width: {
            type: String,
            default: '45%'
        },
        title: {
            type: String,
            default: '提示'
        },
        showFooter: {
            type: Boolean,
            default: true
        },
        hasCancel: {
            type: Boolean,
            default: true
        },
        isHing: {
            type: Boolean
        }
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .el-dialog {
        border-radius: 10px;
    }
    /deep/ .el-dialog__header {
        background: #f1f0ff;
        border-radius: 10px 10px 0 0;
    }
    /deep/ .el-dialog__title {
        color: #44434B;
    }
</style>




