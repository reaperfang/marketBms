<template>
    <DialogBase width="500px" :visible.sync="visible" title="编辑上下架" :hasCancel="hasCancel" :showFooter="showFooter">
        <div class="content-box">
            <p class="title">商品名称：{{data.name}}</p>
            <div class="content">
                <div v-for="(item, index) in data.goodsInfos" class="item">
                    <div class="item-title">{{index + 1}}：规格属性：{{item.specs | productSpecsFilter}}</div>
                    <div class="input-box">
                        <span class="stock-lable">{{item.status | statusFilter}}</span>
                        <el-switch
                            :disabled="item.activity"
                            v-model="item.status"
                            active-color="#0cd4af"
                            inactive-color="#c8c8ca">
                        </el-switch>
                        <span v-if="item.activity" class="message">该商品正在参加营销活动，活动结束/失效才可下架</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <el-button @click="submit" type="primary">确定</el-button>
            <el-button @click="visible = false">取消</el-button>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            hasCancel: true,
            list: [{spec: '银色', upper: 1}, {spec: '银色', upper: 1}, {spec: '银色', upper: 1}],
            showFooter: false
        }
    },
    filters: {
        statusFilter(val) {
            if(val == 1) {
                return '上架'
            } else {
                return '下架'
            }
        },
        productSpecsFilter(val) {
            let arr = Object.values(JSON.parse(val))
            let str = arr.join('/')
            
            return str
        }
    },
    methods: {
        submit() {
            this._apis.goods.productUpperOrLowerSpu({
                id: this.data.id,
                goodsInfos: this.data.goodsInfos.map(val => ({id: val.id, status: val.status ? 1 : 0}))
            }).then((res) => {
                this.$emit('submit')
                this.visible = false
                this.$message({
                    message: '编辑成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$message.error({
                    message: error,
                    type: 'error'
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
        DialogBase
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
    p.title {
        font-size:14px;
        font-weight:400;
        color:rgba(68,61,74,1);
    }
    .content-box {
        padding-left: 62px;
        padding-top: 20px;
        .title {
            padding-bottom: 20px;
        }
    }
    .content {
        .item {
            padding-bottom: 22px;
            .item-title {
                padding-bottom: 14px;
            }
        }
    }
    /deep/ .el-input {
        width: auto;
    }
    .message {
        font-size:12px;
        font-weight:400;
        color:rgba(245,88,88,1);
        margin-left: 14px;
    }
    .footer {
        text-align: center;
    }
</style>


