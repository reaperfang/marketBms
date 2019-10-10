<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入回复内容，不超过200个字符"
                v-model="replyContent"
                maxlength="200">
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
            replyContent: ''
        }
    },
    methods: {
        submit() {
            this.$emit('submit', this.replyContent)
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
        contentText() {
            return '是否确认删除？'
        }
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
        }
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
   /deep/ .el-textarea__inner {
       min-height: 200px!important;
   }
   .footer {
       text-align: center;
       margin-top: 40px;
   }
</style>


