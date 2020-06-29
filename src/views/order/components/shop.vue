<template>
    <div class="order" v-loading="loading">
        <order ref="order" :list="list" @getList="getList" v-bind="$attrs" class="order-list"></order>
        <el-checkbox v-if="!authHide" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
        <!--<el-button v-if="!authHide" v-permission="['订单', '订单查询', '商城订单', '批量补填物流']" class="border-button" @click="wad">批量补填物流</el-button>-->
        <pagination v-show="total>0" :total="total" :page.sync="params.startIndex" :limit.sync="params.pageSize" @pagination="search" />
    </div>
</template>
<script>
import Order from './order'
import Pagination from '@/components/Pagination'
import utils from "@/utils";
import anotherAuth from '@/mixins/anotherAuth'

export default {
    mixins: [anotherAuth],
    data() {
        return {
            total: 0,
            // listQuery: {
            //     startIndex: 1,
            //     pageSize: 20,
            // },
            list: [],
            memberLevelImg: '',
            checkedAll: false,
            loading: false
        }
    },
    created() {
        //this.getList()
    },
    mounted() {
        this.getList()
    },
    watch: {
        params: {
            deep: true,
            handler() {
                //this.getList()
            }
        }
    },
    methods: {
        search() {
            this.$emit('update:checkedLength', 0)
            this.getList()
        },
        wad() {
            this.$emit('batchSupplementaryLogistics')
        },
        checkedAllChange() {
            let arr = [...this.list]

            if(this.checkedAll) {
                arr.forEach(val => {
                    if(val.orderStatus != 2 && val.orderStatus != 6) {
                        val.checked = true
                    }
                })

                this.list = arr
            } else {
                arr.forEach(val => {
                    if(val.orderStatus != 2 && val.orderStatus != 6) {
                        val.checked = false
                    }
                })

                this.list = arr
            }

            let number = this.list.filter(val => val.checked).length
            let list = this.list.filter(val => val.checked)

            this._globalEvent.$emit('checkedLength', number)
            this._globalEvent.$emit('checkedList', list)
        },
        getList(obj) {
            this.$nextTick(() => {
                document.querySelector('.content-main').scrollTop = 0
            })
            let _params

            // const loading = this.$loading({
            //     lock: true,
            //     spinner: 'el-icon-loading',
            //     target: '.order-container'
            // });
            //this.$refs['order'].loading = true
            this.checkedAll = false
            if(obj) {
                if(obj.orderTimeValue && obj.orderTimeValue.length) {
                    if(obj.orderTimeValue[0]) {
                        var searchTimeTypeStart = utils.formatDate(obj.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss")
                    }
                    if(obj.orderTimeValue[1]) {
                        var searchTimeTypeEnd = utils.formatDate(obj.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss")
                    }
                } else {
                    if(this.params.orderTimeValue && this.params.orderTimeValue.length) {
                        if(this.params.orderTimeValue[0]) {
                            var searchTimeTypeStart = utils.formatDate(this.params.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss")
                        }
                        if(this.params.orderTimeValue[1]) {
                            var searchTimeTypeEnd = utils.formatDate(this.params.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss")
                        }
                    }
                }
            } else {
                if(this.params.orderTimeValue && this.params.orderTimeValue.length) {
                    if(this.params.orderTimeValue[0]) {
                        var searchTimeTypeStart = utils.formatDate(this.params.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss")
                    }
                    if(this.params.orderTimeValue[1]) {
                        var searchTimeTypeEnd = utils.formatDate(this.params.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss")
                    }
                }
            }
            _params = Object.assign({}, this.params, {
                [this.params.searchType]: this.params.searchValue,
                [this.params.searchType2]: this.params.searchValue2,
                [`${this.params.searchTimeType}Start`]: this.params.orderTimeValue ? searchTimeTypeStart : '',
                [`${this.params.searchTimeType}End`]: this.params.orderTimeValue ? searchTimeTypeEnd : '',
                memberInfoId: this.$route.query.id
            }, this.listQuery)
            if(obj && (obj.startIndex != undefined)) {
                _params.startIndex = obj.startIndex
            }
            if(obj && (obj.pageSize != undefined)) {
                _params.pageSize = obj.pageSize
            }
            if(obj && obj.type == 'resetForm') {
               _params = Object.assign({}, _params, {
                   [this.params.searchType]: obj.searchValue,
                   [this.params.searchType2]: obj.searchValue2,
                   [`${this.params.searchTimeType}Start`]: '',
                [`${this.params.searchTimeType}End`]: '',
                searchType: "code",
                searchValue: "",
                code: "",
                goodsName: "",
                memberSn: "",
                receivedPhone: "",
                receivedName: "",
                channelInfoId: "",
                orderType: this.$route.query.orderType ? this.$route.query.orderType : '',
                payWay: "",
                sendType: "",
                orderStatus: "",
                searchTimeType: "createTime",
                orderTimeValue: "",
                startIndex: 1,
                pageSize: 20,
                deliveryWay: "", // 配送方式:1普通快递,2商家配送
                deliveryDate: "", //商家配送-日期
                deliveryTime: "", //商家配送-时间段
               }) 
            }
            this.loading = true
            this._apis.order.fetchOrderList(_params).then((res) => {
                this.loading = false
                console.log(res)
                if(res.list === null) res.list = []
                res.list.forEach((val, index) => {
                    let _val = Object.assign({}, val, val.orderInfo)
                    _val.checked = false
                    res.list.splice(index, 1, _val)
                })
                this.list = res.list
                this.total = +res.total
                this._globalEvent.$emit('total', this.total)
                this.$emit('update:page', res.pageNum)
                this.$emit('update:limit', res.pageSize)
                //this.$refs['order'].loading = false
                //loading.close();
            }).catch(error => {
                //loading.close();
                // this.$message.error(error);
                this.loading = false
                //this.$refs['order'].loading = false
            })
        }
    },
    props: {
        params: {
            type: Object,
            default: {
                startIndex: 1,
                pageSize: 20,
            }
        },
        checkedLength: {

        }
    },
    components: {
        Order,
        Pagination
    }
}
</script>
<style lang="scss" scoped>
    .order-list {
        padding-bottom: 10px;
        overflow-x: auto;
    }
    /deep/ .el-checkbox {
        margin-right: 8px;
    }
</style>


