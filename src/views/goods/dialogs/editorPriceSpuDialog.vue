<template>
    <DialogBase width="500px" :visible.sync="visible" title="编辑售卖价" :hasCancel="hasCancel" :showFooter="showFooter">
        <div class="content-box">
            <p class="title">商品名称：{{data.name}}</p>
            <div class="content">
                <div v-for="(item, index) in data.goodsInfos" class="item">
                    <div class="item-title">{{data.goodsInfos.length>1?`${index +1}：`:''}}规格属性：{{item.specs | productSpecsFilter}}</div>
                    <div class="input-box">
                        <span class="stock-lable">售卖价：</span>
                        <el-input @change="checkSaleprice(item, index)" max-length="11" type="number" :min="item.costPrice" :max="max" :disabled="item.activity" v-model="item.salePrice" placeholder="请输入价格" ></el-input>
                        <div class="costPriceMsg" v-if="!item.activity && item.isShowMsg">售卖价不得低于成本价{{item.costPrice}}</div>
                        <p v-if="item.activity" class="message">该商品正在参加营销活动，活动结束/失效才可编辑售卖价</p>
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
            max: 10000000,
            oldData: null,
            isShowMsg:false
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
        checkSaleprice(data, index){
            if(!data.activity) {
                if(+data.costPrice>+data.salePrice){
                    //this.isShowMsg=true;
                    this.data.goodsInfos.splice(index, 1, Object.assign({}, this.data.goodsInfos[index], {
                        isShowMsg: true
                    }))
                }else{
                    //this.isShowMsg=false;
                    this.data.goodsInfos.splice(index, 1, Object.assign({}, this.data.goodsInfos[index], {
                        isShowMsg: false
                    }))
                }
            }
        },
        submit() {
            this.data.goodsInfos.forEach((val, index) => {
                if(!val.activity) {
                    if(+val.salePrice < +val.costPrice) {
                        this.data.goodsInfos.splice(index, 1, Object.assign({}, this.data.goodsInfos[index], {
                            isShowMsg: true
                        }))
                    } else {
                        this.data.goodsInfos.splice(index, 1, Object.assign({}, this.data.goodsInfos[index], {
                            isShowMsg: false
                        }))
                    }
                }
            })
            if(this.data.goodsInfos.filter(item => !item.activity).some(val => +val.salePrice < +val.costPrice)) {
                //this.isShowMsg=true;
                return
            }else{
                //this.isShowMsg=false;
            }
            let newData = JSON.parse(JSON.stringify(this.data.goodsInfos))
            if(utils.equalsObj(this.oldData, newData)) {
                this.visible = false
                return
            }
            if(this.data.goodsInfos.every(val => val.activity)) {
                this.visible = false
                return
            }
            // if(this.data.goodsInfos.some(val => +val.salePrice < +val.costPrice)) {
            //     this.$message({
            //     message: '售卖价不得低于成本价！请重新输入',
            //     type: 'warning'
            //     });
            //     return
            // }
            if(this.data.goodsInfos.some(val => +val.salePrice > 10000000)) {
                this.$message({
                message: '当前售卖价最大限制为10000000，请您重新输入',
                type: 'warning'
                });
                return
            }
            if(this.data.goodsInfos.some(val => +val.salePrice < 0.01)) {
                this.$message({
                message: '售卖价不可以小于0.01',
                type: 'warning'
                });
                return
            }
            this._apis.goods.changePriceSpu({
                id: this.data.id,
                goodsInfos: this.data.goodsInfos.filter(val => !val.activity).map(val => ({id: val.id, salePrice: val.salePrice}))
            }).then((res) => {
                this.$emit('submit')
                this.visible = false
                this.$message({
                    message: '价格编辑成功',
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
        .costPriceMsg{
            margin-top:8px;
            margin-left:70px;
            font-size:12px;
            color:rgba(253,76,43,1);
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
    .message {
        font-size:12px;
        font-weight:400;
        color:rgba(245,88,88,1);
        margin-left: 14px;
        padding: 5px 0;
    }
    .footer {
        text-align: center;
    }
</style>


