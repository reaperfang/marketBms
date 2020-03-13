<template>
    <div>
        <DialogBase :visible.sync="visible" width="443px" @submit="submit" title="推广渠道" :hasCancel="hasCancel">
            <div class="content">
                <el-checkbox v-model="h5Checked">公众号</el-checkbox>
                <el-checkbox v-model="miniCodeChecked">小程序</el-checkbox>
            </div>
        </DialogBase>
        <component :is="currentDialog" :dialogVisible.sync="shareDialogVisible" :data="currentData"></component>
    </div>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import Share from '@/views/goods/dialogs/shareDialog'

export default {
    data() {
        return {
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
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        submit() {
            let obj = {}
            
            if(this.data.shareMore) {
                this.shareMore(this.data.shareMore.map(val => val.id))
                return
            } else {
                this.currentDialog = 'Share'
                this.shareDialogVisible = true
                obj.id = this.data.id
            }
            if(this.h5Checked) obj.h5 = true
            if(this.miniCodeChecked) obj.miniCode = true
            this.currentData = obj
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


