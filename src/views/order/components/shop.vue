<template>
    <div class="order">
        <order ref="order" :list="list" @getList="getList" v-bind="$attrs" class="order-list"></order>
        <el-checkbox @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
</template>
<script>
import Order from './order'
import Pagination from '@/components/Pagination'
import utils from "@/utils";

export default {
    data() {
        return {
            total: 0,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
            },
            list: [],
            memberLevelImg: '',
            checkedAll: false
        }
    },
    created() {
        //this.getList()
    },
    mounted() {
        this.getList()
    },
    watch: {
        
    },
    methods: {
        checkedAllChange() {
            let arr = [...this.list]

            if(this.checkedAll) {
                arr.forEach(val => {
                    if(val.orderStatus != 2) {
                        val.checked = true
                    }
                })

                this.list = arr
            } else {
                arr.forEach(val => {
                    if(val.orderStatus != 2) {
                        val.checked = false
                    }
                })

                this.list = arr
            }
        },
        getList() {
            let _params

            // const loading = this.$loading({
            //     lock: true,
            //     spinner: 'el-icon-loading',
            //     target: '.order-container'
            // });
            this.$refs['order'].loading = true
            this.checkedAll = false
            if(this.params.orderTimeValue && this.params.orderTimeValue.length) {
                if(this.params.orderTimeValue[0]) {
                    var searchTimeTypeStart = utils.formatDate(this.params.orderTimeValue[0], "yyyy-MM-dd hh:mm:ss")
                }
                if(this.params.orderTimeValue[1]) {
                    var searchTimeTypeEnd = utils.formatDate(this.params.orderTimeValue[1], "yyyy-MM-dd hh:mm:ss")
                }
            }
            _params = Object.assign({}, this.params, {
                [this.params.searchType]: this.params.searchValue,
                [`${this.params.searchTimeType}Start`]: this.params.orderTimeValue ? searchTimeTypeStart : '',
                [`${this.params.searchTimeType}End`]: this.params.orderTimeValue ? searchTimeTypeEnd : '',
                memberInfoId: this.$route.query.id
            }, this.listQuery)
            this._apis.order.fetchOrderList(_params).then((res) => {
                console.log(res)
                res.list.forEach((val, index) => {
                    let _val = Object.assign({}, val, val.orderInfo)
                    _val.checked = false
                    res.list.splice(index, 1, _val)
                })
                this.list = res.list
                this.total = +res.total
                this._globalEvent.$emit('total', this.total)
                this.$refs['order'].loading = false
                //loading.close();
            }).catch(error => {
                //loading.close();
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
                this.$refs['order'].loading = false
            })
        }
    },
    props: {
        params: {
            type: Object
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
    }
</style>


