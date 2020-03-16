<template>
    <DialogBase width="500px" :visible.sync="visible" @submit="submit" title="编辑售卖价" :hasCancel="hasCancel">
        <div class="content-box">
            <p class="title">商品名称：{{data.name}}</p>
            <div class="content">
                <div v-for="(item, index) in data.goodsInfos" class="item">
                    <div class="item-title">{{index + 1}}：规格属性：{{item.specs | productSpecsFilter}}</div>
                    <div class="input-box">
                        <span class="stock-lable">售卖价：</span>
                        <el-input v-model="item.salePrice" placeholder="请输入价格"></el-input>
                    </div>
                </div>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            hasCancel: true,
            list: [{spec: '银色', stock: 1}, {spec: '银色', stock: 1}, {spec: '银色', stock: 1}]
        }
    },
    filters: {
        productSpecsFilter(val) {
            let arr = Object.values(JSON.parse(val))
            let str = arr.join('/')
            
            return str
        }
    },
    methods: {
        submit() {
            this._apis.goods.changePriceSpu({
                id: this.data.id,
                goodsInfos: this.data.goodsInfos.map(val => ({id: val.id, salePrice: val.salePrice}))
            }).then((res) => {
                this.$emit('submit')
                this.visible = false
                this.$notify({
                    title: '成功',
                    message: '编辑成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
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
</style>


