<template>
    <div style="min-height: 100vh;" v-loading="loading">
        <div v-if="list.length" class="goods-list">
            <header class="header">
                <div v-if="!authHide" v-permission="['商品', '商品列表', '默认页面', '新建商品']" class="item pointer" @click="$router.push('/goods/addGoods')">
                    <el-button type="primary">新建商品</el-button>
                </div>
                <!-- <div v-permission="['商品', '商品列表', '默认页面', '批量改价']" class="item pointer" @click="$router.push('/goods/batchPriceChange')">批量改价</div>
                <div v-permission="['商品', '商品列表', '默认页面', '商品导入']" class="item pointer" @click="$router.push('/goods/import')">商品导入</div> -->
            </header>
            <div class="search">
                <el-form :inline="true" :model="listQuery" ref="form" class="demo-form-inline">
                    <el-form-item label="商品状态" prop="status">
                        <el-select v-model="listQuery.status" placeholder="请选择商品状态">
                            <el-option label="全部" value=""></el-option>
                        <el-option label="上架" :value="1"></el-option>
                        <el-option label="下架" :value="0"></el-option>
                        <el-option label="已售罄" :value="-1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品分类" prop="productCatalogInfoId">
                        <el-cascader
                            v-model="categoryValue"
                            :options="categoryOptions"
                            @change="handleChange"
                            :props="{ multiple: false, checkStrictly: true }"
                        clearable
                        filterable>
                        </el-cascader>
                        <!-- <el-cascader
                            v-model="categoryValue"
                            :props="optionProps"
                            :options="categoryData"
                            @change="handleChange"
                        clearable
                        filterable>
                        </el-cascader> -->
                    </el-form-item>
                    <el-form-item label class="search-code">
                        <el-input :placeholder="listQuery.searchType == 'code' ? '请输入SPU编码' : '请输入SKU编码'" v-model="listQuery.searchValue" class="input-with-select">
                            <el-select v-model="listQuery.searchType" slot="prepend" placeholder="请输入">
                                <el-option label="商品SKU编码" value="goodsInfoCode"></el-option>
                                <el-option label="商品SPU编码" value="code"></el-option>
                            </el-select>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="商品名称" prop="name">
                        <el-input v-model="listQuery.name" placeholder="请输入商品名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getList" type="primary">查询</el-button>
                        <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                    </el-form-item>
                    </el-form>
            </div>
            <div>
                <!-- <div class="table-header">
                    <div :class="{active: listQuery.status === 1}" @click="stateHandler(1)" class="item">出售中</div>
                    <div :class="{active: listQuery.status === 0}" @click="stateHandler(0)" class="item">仓库中</div>
                    <div :class="{active: listQuery.status === -1}" @click="stateHandler(-1)" class="item">已售罄</div>
                </div> -->
                <el-table
                    :data="list"
                    ref="table"
                    style="width: 100%"
                    :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                    @selection-change="handleSelectionChange">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <!-- <el-table-column
                    prop="code"
                    label="SPU编码"
                    width="124">
                    </el-table-column> -->
                    <el-table-column
                    prop="name"
                    label="商品名称">
                        <template slot-scope="scope">
                            <div class="ellipsis2" style="width: 196px;" :title="scope.row.name">{{scope.row.name}}<i v-if="scope.row.activity" class="sale-bg"></i></div>
                            <!-- <div class="gray">{{scope.row.goodsInfo.specs | specsFilter}}</div> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        width="100">
                        <template slot-scope="scope">
                            <span class="goods-state">
                                <span :class="{red: scope.row.status == -1}">{{scope.row.goodsInfos | statusFilter}}</span>
                                <i v-permission="['商品', '商品列表', '默认页面', '修改上下架']" @click="upperAndLowerRacksSpu(scope.row)" :class="{grounding: scope.row.status == 1, undercarriage: scope.row.status == 0}" class="i-bg pointer"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="商品分类">
                        <template slot-scope="scope">
                            <span>{{scope.row.productCatalogInfoName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="price"
                        label="售卖价（元）"
                        width="120"
                        class-name="salePrice">
                        <template slot-scope="scope">
                            <span class="price">
                                {{Math.min.apply(null, scope.row.goodsInfos.map(val => +val.salePrice))}}
                                <i v-permission="['商品', '商品列表', '默认页面', '修改售卖价']" @click="currentData = JSON.parse(JSON.stringify(scope.row)); currentDialog = 'EditorPriceSpu'; dialogVisible = true" class="i-bg pointer"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="总库存">
                        <template slot-scope="scope">
                            <span :class="{'salePrice-red': scope.row.goodsInfos.some(val => val.stock < val.warningStock)}" class="store">{{scope.row.stock}}<i v-permission="['商品', '商品列表', '默认页面', '修改库存']" @click="(currentDialog = 'EditorStockSpu') && (dialogVisible = true) && (currentData = JSON.parse(JSON.stringify(scope.row)))" class="i-bg pointer"></i></span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="总销量">
                        <template slot-scope="scope">
                            <span class="store">{{scope.row.saleCount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="140">
                        <template slot-scope="scope">
                            <el-tooltip :visible-arrow="visibleArrow" popper-class="operate-popper" class="item" effect="dark" content="编辑" placement="bottom">
                                <span v-permission="['商品', '商品列表', '默认页面', '修改商品信息']" @click="$router.push('/goods/addGoods?id=' + scope.row.id + '&goodsInfoId=' + scope.row.id)" class="operate-editor pointer"><i class="i-bg"></i></span>
                            </el-tooltip>
                            <el-tooltip :visible-arrow="visibleArrow" popper-class="operate-popper" class="item" effect="dark" content="分享" placement="bottom">
                                <span @click="shareHandler(scope.row)" class="operate-share pointer"><i class="i-bg"></i></span>
                            </el-tooltip>
                            <el-tooltip :visible-arrow="visibleArrow" popper-class="operate-popper" class="item" effect="dark" content="删除" placement="bottom">
                                <span v-permission="['商品', '商品列表', '默认页面', '删除商品']" @click="deleleHandler(scope.row)" class="operate-delete pointer"><i class="i-bg"></i></span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="!loading" class="table-footer">
                    <!-- <el-button @click="moreManageHandler" type="primary">批量管理</el-button> -->
                    <!-- <el-button v-if="showTableCheck" @click="checkAllHandler">全选</el-button> -->
                    <!-- <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                    <div v-if="showTableCheck" class="image-box">
                        <div v-permission="['商品', '商品列表', '默认页面', '批量上/下架']" @click="allUpper" class="item">
                            <i class="i-bg up"></i>
                            <p>上架</p>
                        </div>
                        <div v-permission="['商品', '商品列表', '默认页面', '批量上/下架']" @click="allLower" class="item">
                            <i class="i-bg down"></i>
                            <p>下架</p>
                        </div>
                        <div v-permission="['商品', '商品列表', '默认页面', '批量删除']" @click="allDelete" class="item">
                            <i class="i-bg delete"></i>
                            <p>删除</p>
                        </div>
                    </div>
                    <el-button v-if="showTableCheck" @click="cancelHandler">取消</el-button> -->
                    <el-checkbox :indeterminate="isIndeterminate" @change="checkedAllChange" v-model="checkedAll">全选</el-checkbox>
                    <el-button v-permission="['商品', '商品列表', '默认页面', '批量上/下架']" @click="allUpper" class="border-button">批量上架</el-button>
                    <el-button v-permission="['商品', '商品列表', '默认页面', '批量上/下架']" @click="allLower" class="border-button">批量下架</el-button>
                    <el-button @click="changePriceMore" v-permission="['商品', '商品列表', '默认页面', '批量改价']" class="border-button">批量改价</el-button>
                    <el-button @click="shareMore" class="border-button">批量推广</el-button>
                    <el-button v-permission="['商品', '商品列表', '默认页面', '批量删除']" @click="allDelete" class="border-button">批量删除</el-button>
                </div>
            </div>
            <div class="footer">
                <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
            </div>
            <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @submit="onSubmit" @changePriceSubmit="changePriceSubmit"></component>
        </div>
        <div v-if="!list.length && !allTotal && !loading" class="goods-list-empty">
            <div class="goods-list-empty-content">
                <div class="image"></div>
                <p>当前店铺没有商品，点击“新建商品”快去发布您的商品吧！</p>
                <el-button @click="$router.push('/goods/addGoods')" class="add-goods" type="primary">新建商品</el-button>
            </div>
        </div>
        <!-- <div v-else class="goods-list-empty">
            <div v-if="!loading" class="goods-list-empty-content">
                <div class="image"></div>
                <p>没有找到相关商品，换个搜索词试试吧</p>
                <el-button @click="$router.push('/goods/goodsList')" class="add-goods" type="primary">返回列表页</el-button>
            </div>
        </div> -->
    </div>
</template>
<style lang="scss" scoped>
.table-footer {
    display: flex;
    align-items: center;
    padding: 20px;
    padding-left: 15px;
    button {
        margin-left: 0;
        // margin-right: 28px;
    }
    .image-box {
        display: flex;
        align-items: center;
        margin-right: 18px;
        .item {
            margin-right: 22px;
            cursor: pointer;
            .i-bg {
                position: relative;
                display: inline-block;
                width: 13px;
                height: 13px;
                left: 7px;
            }
            .up {
                background:url('../../assets/images/goods/undercarriage.png') no-repeat;
            }
            .down {
                background:url('../../assets/images/goods/grounding.png') no-repeat;
            }
            .delete {
                background:url('../../assets/images/goods/delete.png') no-repeat;
                background-size: 13px;
            }
        }
    }
}
.goods-list {
    background-color: #fff;
    padding: 20px;
    color: $contentColor;
    .header {
        display: flex;
        align-items: center;
        border-bottom: 2px solid #CACFCB;
        padding-bottom: 18px;
        .item {
            margin-right: 40px;
            &:hover {
                color: #7f79ff;
            }
        }
    }
    .search {
        margin-top: 26px;
        margin-bottom: 10px;
        /deep/ .el-form-item__label {
            padding-right: 8px;
        }
        /deep/ .el-form--inline .el-form-item {
            margin-right: 26px;
            .el-button+.el-button {
                margin-left: 16px;
            }
        }
    }
    .i-bg {
        position: relative;
        display: inline-block;
        width: 14px;
        height: 13px;
        top: 1px;
    }
    .up {
        .i-bg {
            background:url('../../assets/images/goods/grounding.png') no-repeat;
        }
    }
    .goods-state {
        span {
            &.red {
                color: #F65A5A;
            }
        }
        .i-bg {
            &.grounding {
                background:url('../../assets/images/goods/grounding.png') no-repeat;
            }
            &.undercarriage {
                background:url('../../assets/images/goods/undercarriage.png') no-repeat;
            }
        }
    }
    .store, .price {
        .i-bg {
            background:url('../../assets/images/goods/editor.png') no-repeat;
            margin-left: 6px;
        }
    }
    .operate-editor {
        .i-bg {
            background:url('../../assets/images/goods/editor.png') no-repeat;
            margin-right: 12px;
        }
    }
    .operate-share {
        .i-bg {
            background:url('../../assets/images/goods/share.png') no-repeat;
            margin-right: 12px;
        }
    }
    .operate-delete {
        color: #F55858;
        .i-bg {
            background:url('../../assets/images/goods/delete.png') no-repeat;
            background-size: 13px;
            margin-right: 12px;
        }
    } 
}
/deep/ .el-form-item__label {
    font-weight: normal;
}
.footer {
    margin-top: 10px;
}
.gray {
    color: #92929B;
}
.red {
    color: #FD4C2B;
}

.goods-list-empty {
    background-color: #fff;
    display: flex;
    justify-content: center;
    text-align: center;
    .goods-list-empty-content {
        padding-top: 155px;
        padding-bottom: 20px;
        .image {
            width: 210px;
            height: 178px;
            background: url('../../assets/images/goods/goodsListEmpty.png') no-repeat;
            margin: 0 auto;
        }
        p {
            font-size:14px;
            font-weight:400;
            color:rgba(61,67,74,1);
            margin-top: 40px;
        }
    }
    .add-goods {
        margin-top: 30px;
    }
}
/deep/ .search-code .el-form-item__content {
    display: flex;
}
/deep/ .input-with-select .el-input__inner {
  width: 128px;
}
.table-header {
    margin-bottom: 10px;
}
/deep/ .salePrice-red {
    color: #F66060;
}
.sale-bg {
    display: inline-block;
    width: 38px;
    height: 10px;
    background:url('../../assets/images/goods/sale.png') no-repeat;
    margin-left: 5px;
}
/deep/ .el-checkbox__label {
    padding-left: 6px;
    padding-right: 6px;
}
.el-button+.el-button {
    margin-left: 12px;
}
.ellipsis2 {
    width: 196px;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}
</style>
<style lang="scss">
    .operate-popper {
        background: #D8D8D8!important;
        color: #44434B!important;
        .popper__arrow {
            background: #D8D8D8!important;
        }
    }
</style>

<script>
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/views/goods/dialogs/deleteDialog'
import EditorPrice from '@/views/goods/dialogs/editorPrice'
import EditorStock from '@/views/goods/dialogs/editorStock'
import EditorStockSpu from '@/views/goods/dialogs/editorStockSpuDialog'
import EditorPriceSpu from '@/views/goods/dialogs/editorPriceSpuDialog'
import EditorUpperAndLowerRacksSpu from '@/views/goods/dialogs/editorUpperAndLowerRacksSpuDialog'
import ShareSelect from '@/views/goods/dialogs/shareSelectDialog'
import PriceChangeDialog from "@/views/goods/dialogs/priceChangeDialog";
import anotherAuth from '@/mixins/anotherAuth'

export default {
    mixins: [anotherAuth],
    data() {
        return {
            checkedAll: false,
            isIndeterminate: false,
            visibleArrow: false,
            categoryValue: [],
            categoryOptions: [],
            multipleSelection: [],
            goodsClassifyList: [
                {
                    label: '服饰',
                    value: '服饰'
                }
            ],
            list: [],
            total: 0,
            allTotal: 0,
            loading: false,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                name: '',  // 商品名称
                status: '', // 商品状态 0下架,1上架,2售罄
                productCatalogInfoId: '', // 商品分类ID
                searchType: 'code',
                searchValue: ''
            },
            currentDialog: '',
            dialogVisible: false,
            currentData: '',
            state: '',
            showTableCheck: true,
            operateType: "",
            currentStatus: '',
            categoryData: [],
            optionProps: {
                value: 'id',
                label: 'name',
                children: 'childrenCatalogs',
                multiple: false, 
                checkStrictly: true
            }
        }
    },
    created() {
        if(typeof this.$route.query.status != 'undefined') {
            this.listQuery = Object.assign({}, this.listQuery, {status: +this.$route.query.status})
        }
        this.getAllList()
        this.getList()
        this.getCategoryList()
        this.getMiniappInfo()
        this.getProductCatalogTreeList()
    },
    filters: {
        statusFilter(goodsInfos) {
            let item = goodsInfos[0]

            if(goodsInfos.reduce((total, current) => total + current.stock, 0) == 0) {
                return '已售馨'
            } else {
                if(item.status == 1) {
                    return '上架'
                } else if(item.status == 0) {
                    return '下架'
                } else if(item.status == -1) {
                    let goodsInfosList = goodsInfos.filter(val => val.stock != -1)
                    
                    if(goodsInfosList.length) {
                        let item = goodsInfosList[0]

                        if(item.stock == 1) {
                            return '上架'
                        } else if(item.stock == 0) {
                            return '下架'
                        }
                    }
                }
            }
        },
        async productCatalogFilter(id) {
            return 'sfsf'
            // try {
            //     let res = await this._apis.goods.getCategoryDetail({id})

            //     if(res) {
            //         return 'sfsf'
            //     }
            // } catch(error) {
            //     return ''
            // }

        },
        specsFilter(value) {
            let str = ''

            if(typeof value == 'string') {
                value = JSON.parse(value)
            }
            for(let i in value) {
                str += i + ':' + value[i] + ','
            }

            str = str.replace(/(^.*?)\,$/, '$1')

            return str
        }
    },
    methods: {
        changePriceMore() {
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择想要批量改价的商品。', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            if(this.multipleSelection.some(val => val.activity)) {
                let name = this.multipleSelection.filter(val => val.activity)[0].name

                this.confirm({title: '批量改价', icon: true, text: `所选商品“${name}”正在参加营销活动，活动结束/失效才可修改价格。`, showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            this.currentDialog = 'PriceChangeDialog'
            this.dialogVisible = true
        },
        changePriceSubmit(value) {
            this.allUpdatePrice(value);
        },
        allUpdatePrice(params) {
            let _param = {
                operateType: 1,
                changeType: params.changeType,
                markupPrice: params.price
            };

            _param.ids = this.multipleSelection.map(val => val.id);
            this._apis.goods
                .allUpdatePriceSpu(_param)
                .then(res => {
                this.getList();
                this.checkedAll = false
                this.visible = false;
                
                this.$message({
                            message: '改价成功！',
                            type: 'success'
                        });
                })
                .catch(error => {
                this.visible = false;
                this.$message.error({
                    message: error,
                    type: 'error'
                });
                });
            },
        getMiniappInfo() {
            this._apis.goods.getMiniappInfo().then(res => {
                this.currentStatus = res.data.current_status
            }).catch(error => {
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        shareMore() {
            let obj = {}
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择想要批量推广的商品。', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            this.confirm({title: '提示', icon: true, text: '当前只支持批量下载微信公众号商品详情页二维码图片！', confirmText: '一键下载'}).then(() => {
                let ids = this.multipleSelection.map(val => val.id)

                this._apis.goods.shareMore({ids, channelInfoId: 2}).then((res) => {
                    window.location.href = res
                    this.$refs.table.clearSelection();
                    this.checkedAll = false
                }).catch(error => {
                    this.$message.error({
                    message: error,
                    type: 'error'
                });
                })
            })
            // this.currentDialog = 'ShareSelect'
            // this.dialogVisible = true
            // obj.shareMore = [...this.multipleSelection]
            // this.currentData = obj
        },
        getMarketActivity(list) {
            // var that = this
            // let getActivityList = function(spuId, obj) {
            //     return new Promise((resolve, reject) => {
            //         that._apis.goods.getMarketActivity({ids: [spuId]}).then((res) => {
            //             obj.activityList = res
            //             resolve()
            //         }).catch(error => {
            //             that.$notify.error({
            //                 title: '错误',
            //                 message: error
            //             });
            //             reject(error)
            //         })
            //     })
            // }

            // let arr = []

            // list.forEach(val => {
            //     let id = val.id

            //     arr.push(getActivityList(id, val))
            // })

            // return Promise.all(arr).then(val => {
                
            // })
             return new Promise((resolve, reject) => {
                this._apis.goods.getMarketActivity({ids: list.map(val => val.id)}).then((res) => {
                    //obj.activityList = res
                    console.log(res)
                    resolve(res)
                }).catch(error => {
                    this.$message.error({
                    message: error,
                    type: 'error'
                });
                    reject(error)
                })
            })
        },
        shareHandler(row) {
            let _row

            _row = Object.assign({}, row, {
                currentStatus: this.currentStatus
            })
            this.currentDialog = 'ShareSelect'
            this.dialogVisible = true
            this.currentData = _row
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.categoryValue = ''
            this.getList()
        },
        allDelete() {
            let ids = this.multipleSelection.map(val => val.id)

            if(this.multipleSelection.some(val => val.activity)) {
                let name = this.multipleSelection.filter(val => val.activity)[0].name

                this.confirm({title: '批量删除', icon: true, text: `当前商品中“${name}”参与的营销活动未结束，无法进行批量删除操作！`, showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }

            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择想要批量删除的商品', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }

            this.confirm({title: '批量删除', icon: true, text: '是否确认批量删除？'}).then(() => {
                let isLast = false

                if(this.listQuery.startIndex == 1) {
                    isLast = true
                } else {
                    if((this.listQuery.startIndex - 1)*this.listQuery.pageSize + this.list.length == this.total) {
                        isLast = true
                    }
                }
                this._apis.goods.allDeleteSpu({ids}).then((res) => {
                    if(isLast) {
                        this.listQuery.startIndex = 1
                        this.getList()
                    } else {
                        this.getList()
                    }
                    this.getAllList()
                    this.checkedAll = false
                    this.visible = false
                    this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                }).catch(error => {
                    this.visible = false
                    this.$message.error({
                    message: error,
                    type: 'error'
                });
                })
            })
        },
        upperOrLower(status) {
            let ids = this.multipleSelection.map(val => val.id)

            let statusStr = status == 1 ? '上架' : '下架'

            this.confirm({title: `批量${statusStr}`, icon: true, text: `是否确认批量${statusStr}？`}).then(() => {
                this._apis.goods.upperOrLowerSpu({ids, status}).then((res) => {
                    this.getList()
                    this.checkedAll = false
                    this.visible = false
                    this.$message({
                        message: '修改成功！',
                        type: 'success'
                    });
                }).catch(error => {
                    this.visible = false
                    this.$message.error({
                        message: error,
                        type: 'error'
                    });
                })
            })
        },
        allUpper() {
            if(this.multipleSelection.some(val => val.stock == 0)) {
                let name = this.multipleSelection.filter(val => val.stock == 0)[0].name

                this.confirm({title: '批量上架', icon: true, text: `当前商品中”${name}“的库存为“0”，无法进行批量上架操作！`, showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择想要批量上架的商品', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            this.upperOrLower(1)
        },
        allLower() {
            if(this.multipleSelection.some(val => val.activity)) {
                let name = this.multipleSelection.filter(val => val.activity)[0].name

                this.confirm({title: '批量下架', icon: true, text: `当前商品中“${name}”参与的营销活动未结束， 无法进行批量下架操作！`, showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            if(!this.multipleSelection.length) {
                this.confirm({title: '提示', icon: true, text: '请选择想要批量下架的商品', showCancelButton: false, confirmText: '我知道了'}).then(() => {
                    
                })
                return
            }
            this.upperOrLower(0)
        },
        transTreeData(data, pid) {
            var result = [], temp;
            for (var i = 0; i < data.length; i++) {
                if (data[i].parentId == pid) {
                    var obj = {"categoryName": data[i].name,"id": data[i].id, 
                        parentId: data[i].parentId, level: data[i].level, sort: data[i].sort, 
                        image: data[i].image, enable: data[i].enable, label: data[i].name, value: data[i].id};
                    temp = this.transTreeData(data, data[i].id);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    result.push(obj);
                }
            }
            return result;
        },
        getCategoryList() {
            this._apis.goods.fetchCategoryList().then((res) => {
                let arr = this.transTreeData(res, 0)
                
                this.categoryOptions = arr
            }).catch(error => {

            })
        },
        getProductCatalogTreeList() {
            this._apis.goods.fetchTreeCategoryList().then((res) => {
                this.categoryData = res
            }).catch(error => {
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        handleChange(value) {
            let arr = [...value]
            this.listQuery.productCatalogInfoId = arr.pop()
        },
        upperAndLowerRacks(row) {
            let _title = ''
            let _status

            if(row.goodsInfo.status == 1) {
                _title = '下架'
                _status = 0
            } else if(row.goodsInfo.status == 0) {
                _title = '上架'
                _status = 1
            }

            this.confirm({title: '立即' + _title, icon: true, text: `是否确认${_title}？`}).then(() => {
                this._apis.goods.upperOrLowerSpu({ids: [row.goodsInfo.id], status: _status}).then((res) => {
                    this.getList()
                    this.visible = false
                    this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                }).catch(error => {
                    this.visible = false
                    this.$message.error({
                    message: error,
                    type: 'error'
                });
                })
            })
        },
        upperAndLowerRacksSpu(row) {
            let _title = ''
            let _status
            let _row

            if(row.status == 1) {
                _title = '下架'
                _status = 0
            } else if(row.status == 0) {
                _title = '上架'
                _status = 1
            }

            _row = JSON.parse(JSON.stringify(row))
            _row.goodsInfos.forEach(val => {
                val.status = val.status == 1 ? true : false
            })
            this.currentData = _row
            this.currentDialog = 'EditorUpperAndLowerRacksSpu'
            this.dialogVisible = true
        },
        moreManageHandler() {
            this.showTableCheck = true
        },
        cancelHandler() {
           this.showTableCheck = false
        },
        checkAllHandler() {
            this.$refs.table.clearSelection();
            this.list.forEach(row => {
                this.$refs.table.toggleRowSelection(row);
            })
        },
        checkedAllChange() {
            if(this.checkedAll) {
                this.$refs.table.clearSelection();
                this.$refs.table.toggleAllSelection();
            } else {
                this.$refs.table.clearSelection();
            }
            this.isIndeterminate = false;
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;

            if(this.list.length == this.multipleSelection.length) {
                this.checkedAll = true
            }
        },
        stateHandler(val) {
            if(this.listQuery.status === val) {
                this.listQuery.status = ''
            } else {
                this.listQuery.status = val
            }

            let param = {status: this.listQuery.status}

            this.getList(param)
        },
        getAllList() {
            this._apis.goods.fetchSpuGoodsList().then((res) => {
                this.allTotal = +res.total
            }).catch(error => {
                //this.loading = false
            })
        },
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param)
            _param = Object.assign({}, _param, {
                [this.listQuery.searchType]: this.listQuery.searchValue,
            })

            this._apis.goods.fetchSpuGoodsList(_param).then((res) => {
                this.getMarketActivity(res.list).then((activityRes) => {
                    activityRes.forEach((val, index) => {
                        let id = val.id
                        let goods = res.list.find(val => val.id == id)

                        goods.activity = true
                        if(val.goodsInfos) {
                            val.goodsInfos.forEach(skuVal => {
                                let skuid = skuVal.id
                                let item = goods.goodsInfos.find(val => val.id == skuid)
                                
                                if(item) {
                                    item.activity = true
                                }
                            })
                        }
                    })
                    this.total = +res.total
                    //this.getCategoryName(res.list)
                    this.list = res.list
                    this.loading = false
                    if(this.allTotal && !this.total) {
                        this.$router.push('/goods/goodsListEmpty')
                    }
                })
            }).catch(error => {
                //this.loading = false
            })
        },
        getCategoryName(goodsList) {
            let arr = []

            goodsList.forEach(val => {
                let id = val.productCatalogInfoId
                let promise = this._apis.goods.getCategoryDetail({id}).then((res) => {
                    val.categoryName = res.name
                }).catch(error => {
                    
                })

                arr.push(promise)
            })

            Promise.all(arr).then(values => {
                this.list = goodsList
            })
        },
        editorStore(row) {

        },
        deleleHandler(row) {
            if(row.activity) {
                this.confirm({title: '立即删除', customClass: 'goods-custom', icon: true, text: `当前商品”${row.name}“正在参与营销活动，活动有效期内商品不得“删除”。`}).then(() => {
                    
                })
            } else {
                this.confirm({title: '立即删除', customClass: 'goods-custom', icon: true, text: '是否确认删除？'}).then(() => {
                    this._apis.goods.allDeleteSpu({ids: [row.id]}).then((res) => {
                        this.getList()
                        this.getAllList()
                        this.visible = false
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                    }).catch(error => {
                        this.visible = false
                        this.$message.error({
                            message: error,
                            type: 'error'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                })
            }
        },
        onSubmit() {
            this.getList()
            this.checkedAll = false
        }
    },
    components: {
        Pagination,
        DeleteDialog,
        EditorPrice,
        EditorStock,
        EditorStockSpu,
        EditorPriceSpu,
        EditorUpperAndLowerRacksSpu,
        ShareSelect,
        PriceChangeDialog
    }
}
</script>



