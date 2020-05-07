<template>
    <DialogBase :visible.sync="visible" title="复制链接" width="520px" :showFooter="showFooter">
        <div>
            <div>
                <div class="url-box">
                    <ul>
                        <li v-for="item in data">{{item.url}}</li>
                    </ul>
                    <textarea style="position: absolute; left: -99999px; top: 0;" class="value-list" cols="20" rows="10" id="biao1">{{data.map(val => JSON.stringify(val)).join(',')}}</textarea>
                </div>
                <p class="url-message">复制小程序商品链接，仅限于视频电商助手功能使用。向视频电商助手APP添加链接时，商品链接间需以“，”分隔，一个“{}”内即为一个商品链接，最后一个商品链接后不需要加分隔，多条链接时，默认已分隔。</p>
            </div>
            <div class="footer">
                <el-button @click="submit" type="primary">复制链接</el-button>
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
            list: [
                
            ]
        }
    },
    methods: {
        submit() {
            this.$nextTick(() => {
                document.querySelector('.value-list').select()
                document.execCommand("Copy")
                this.$emit('clear')
                this.visible = false
                this.$message({
                    message: '复制成功',
                    type: 'success'
                });
            })
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
    .footer {
        text-align: center;
    }
    /deep/ .el-dialog__body {
        padding: 20px 40px 30px 40px;
    }
    .url-box {
        background:rgba(211,211,211,0.2);
        border-radius:4px;
        padding: 11px 16px;
        font-weight:400;
        font-size:14px;
        color:rgba(146,146,155,1);
        height:110px;
        overflow-y: auto;
        position: relative;
        ul {
            li {
                padding-bottom: 10px;
            }
        }
    }
    .url-message {
        font-size:12px;
        font-weight:400;
        color:rgba(146,146,155,1);
        line-height:17px;
        margin-top: 14px;
        margin-bottom: 30px;
    }
    .url-box::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .url-box::-webkit-scrollbar {
        width: 4px;
        height: 8px;
    }
</style>


