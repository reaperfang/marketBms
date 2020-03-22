<template>
    <DialogBase :visible.sync="visible" width="520px" @submit="submit" title="推广" :showFooter="showFooter">
        <div class="content">
            <template v-if="data.h5 && data.miniCode">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="公众号" name="h5">
                        <H5 :spuid="data.id" v-if="activeName == 'h5'"></H5>
                    </el-tab-pane>
                    <el-tab-pane label="小程序" name="miniCode">
                        <MiniCode :spuid="data.id" v-if="activeName == 'miniCode'"></MiniCode>
                    </el-tab-pane>
                </el-tabs>
            </template>
            <template v-else-if="data.h5">
                <H5 :spuid="data.id"></H5>
            </template>
            <template v-else-if="data.miniCode">
                <MiniCode :spuid="data.id"></MiniCode>
            </template>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import H5 from '../components/h5'
import MiniCode from '../components/miniCode'

export default {
    data() {
        return {
            showFooter: false,
            activeName: 'h5',
        }
    },
    methods: {
        submit() {
            
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
        H5,
        MiniCode
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
    /deep/ .el-dialog__header {
        height: 54px;
    }
    /deep/ .el-tabs__nav {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    /deep/ .el-tabs__item {
        width: 50%;
        text-align: center;
        font-size:22px;
        font-weight:400;
    }
</style>


