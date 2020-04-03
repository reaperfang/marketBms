<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div class="batch-reply-dialog">
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入回复内容，不超过200个字符"
                v-model="replyContent"
                maxlength="200">
            </el-input>
            <!-- <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig"></RichEditor> -->
            <div class="footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button @click="submit" type="primary">确定</el-button>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import RichEditor from "@/components/RichEditor";

export default {
    data() {
        return {
            showFooter: false,
            replyContent: '',
            myConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 400,
                // 初始容器宽度
                initialFrameWidth: 460,
                toolbars: [
                    ['emotion']
                ],
                maximumWords: 200
            },
        }
    },
    methods: {
        submit() {
            if(/^\s*$/.test(this.replyContent)) {
                this.$message({
                message: '请输入批量回复内容',
                type: 'warning'
                });
                return
            }
            this.$emit('submit', this.replyContent)
            this.visible = false
        },
        editorValueUpdate(value) {
            this.replyContent = value;
        },
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
        DialogBase,
        RichEditor
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
<style lang="scss">
    #edui_fixedlayer {
        z-index: 2008!important;
   }
   .batch-reply-dialog {
       .edui-for-xiumi-connect, .edui-for-seletedImage, .edui-for-seletedVideo {
           display: none!important;
       }
   }
</style>


