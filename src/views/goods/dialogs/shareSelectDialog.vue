<template>
    <div>
        <DialogBase :visible.sync="visible" width="443px" title="推广渠道" :hasCancel="hasCancel" :showFooter="showFooter">
            <div class="content">
                <el-checkbox v-model="h5Checked">公众号</el-checkbox>
                <el-checkbox :disabled="data.currentStatus != 'published'" v-model="miniCodeChecked">小程序</el-checkbox>
            </div>
        </DialogBase>
        <div class="footer">
            <el-button @click="submit" type="primary">确 认</el-button>
            <el-button @click="visible = false">取 消</el-button>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="shareDialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import Share from '@/views/goods/dialogs/shareDialog'

export default {
    data() {
        return {
            showFooter: true,
            hasCancel: true,
            h5Checked: false,
            miniCodeChecked: false,
            currentDialog: '',
            shareDialogVisible: false,
            currentData: '',
        }
    },
    methods: {
        shareMore(ids) {
            this._apis.goods.shareMore({ids, channelInfoId: 2}).then((res) => {
                window.location.href = res
                this.visible = false
            }).catch(error => {
                this.visible = false
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        submit() {
            let obj = {}
            
            if(this.data.shareMore) {
                this.shareMore(this.data.shareMore.map(val => val.id))
                this.visible = false
                return
            } else {
                if(this.h5Checked) obj.h5 = true
                if(this.miniCodeChecked) obj.miniCode = true
                obj.id = this.data.id
                this.currentDialog = 'Share'
                this.shareDialogVisible = true
                this.currentData = obj
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
    },
    components: {
        DialogBase,
        Share
    }
}
</script>
<style lang="scss" scoped>
    .el-icon-warning {
        font-size: 60px;
        color: rgb(245, 88, 88);
    }
    .content-text {
        font-size: 18px;
        margin-top: 20px;
    }
    .content {
        padding: 62px 100px;
        display: flex;
        justify-content: space-between;
    }
    /deep/ .el-checkbox__label {
        font-size:18px;
        font-weight:400;
        color:rgba(68,61,74,1);
    }
</style>


