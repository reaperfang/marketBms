<template>
    <DialogBase width="500px" :visible.sync="visible" title="编辑库存" :hasCancel="hasCancel" :showFooter="showFooter">
        <div class="content-box">
            <p class="title">商品名称：{{data.name}}</p>
            <div class="content">
                <div v-for="(item, index) in data.goodsInfos" class="item">
                    <div class="item-title">{{data.goodsInfos.length>1?`${index + 1}：`:''}}规格属性：{{item.specs | productSpecsFilter}}</div>
                    <div class="input-box">
                        <span class="stock-lable">库存：</span>
                        <el-input type="number" min="0" max="10000000" v-model="item.stock" placeholder="请输入库存"></el-input>
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
import utils from '@/utils';

export default {
    data() {
        return {
            hasCancel: true,
            list: [{spec: '银色', stock: 1}, {spec: '银色', stock: 1}, {spec: '银色', stock: 1}],
            showFooter: false,
            oldData: null
        }
    },
    filters: {
        productSpecsFilter(val) {
            if(val){
                let arr = Object.values(JSON.parse(val))
                let str = arr.join('/')
                return str
            }else{
                return '默认规格'
            }
        }
    },
    created() {
        this.oldData = JSON.parse(JSON.stringify(this.data.goodsInfos))
    },
    methods: {
        submit() {
            let newData = JSON.parse(JSON.stringify(this.data.goodsInfos))

            if(utils.equalsObj(this.oldData, newData)) {
                this.visible = false
                return
            }
            if(this.data.goodsInfos.some(val => val.stock < 0)) {
                this.$message({
                message: '库存不能小于0',
                type: 'warning'
                });
                return
            }
            if(this.data.goodsInfos.some(val => +val.stock > 10000000)) {
                this.$message({
                message: '库存不得高于10000000',
                type: 'warning'
                });
                return
            }
            if(this.data.goodsInfos.some(val => /\./.test(val.stock))) {
                this.$message({
                message: '请输入正确的数字',
                type: 'warning'
                });
                return
            }
            this._apis.goods.productUpdateStockSpu({
                id: this.data.id,
                goodsInfos: this.data.goodsInfos.map(val => ({id: val.id, stock: val.stock}))
            }).then((res) => {
                this.$emit('submit')
                this.visible = false
                this.$message({
                    message: '库存编辑成功',
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
        max-height: 400px;
        overflow-y: auto;
        .title {
            padding-bottom: 20px;
        }
    }
    .content-box::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .content-box::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    .content {
        .item {
            padding-bottom: 22px;
            .item-title {
                padding-bottom: 14px;
            }
            .input-box {
                .stock-lable {
                    &::before {
                        content: '*';
                        color: #FD4C2B;
                        font-size:14px;
                        font-weight:400;
                        padding-right: 5px;
                    }
                }
            }
        }
    }
    /deep/ .el-input {
        width: auto;
    }
    .footer {
        text-align: center;
    }
</style>


