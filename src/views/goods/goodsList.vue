<template>
    <div class="goods-list">
        <header class="header">
            <div v-permission="['商品', '商品列表', '默认页面', '新建商品']" class="item pointer" @click="$router.push('/goods/addGoods')">新建商品</div>
            <!-- <div v-permission="['商品', '商品列表', '默认页面', '批量改价']" class="item pointer" @click="$router.push('/goods/batchPriceChange')">批量改价</div>
            <div v-permission="['商品', '商品列表', '默认页面', '商品导入']" class="item pointer" @click="$router.push('/goods/import')">商品导入</div> -->
        </header>
        <div class="search">
            <el-form :inline="true" :model="listQuery" ref="form" class="demo-form-inline">
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="listQuery.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品状态" prop="status">
                    <el-select v-model="listQuery.status" placeholder="请选择商品状态">
                        <el-option label="全部" value=""></el-option>
                    <el-option label="上架" :value="1"></el-option>
                    <el-option label="下架" :value="0"></el-option>
                    <el-option label="售罄" :value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商品分类" prop="productCatalogInfoId">
                    <el-cascader
                        v-model="categoryValue"
                        :options="categoryOptions"
                        @change="handleChange":props="{ multiple: false, checkStrictly: true }"
                    clearable
                    filterable>
                    </el-cascader>
                </el-form-item>
                <el-form-item>
                    <el-button @click="getList" type="primary">查询</el-button>
                    <el-button class="fr marL20" @click="resetForm('form')">重置</el-button>
                </el-form-item>
                </el-form>
        </div>
        <div>
            <div class="table-header">
                <div :class="{active: listQuery.status === 1}" @click="stateHandler(1)" class="item">出售中</div>
                <div :class="{active: listQuery.status === 0}" @click="stateHandler(0)" class="item">仓库中</div>
                <div :class="{active: listQuery.status === -1}" @click="stateHandler(-1)" class="item">已售罄</div>
            </div>
            <el-table
                v-loading="loading"
                :data="list"
                ref="table"
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                    v-if="showTableCheck"
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                prop="name"
                label="商品名称"
                width="380">
                    <template slot-scope="scope">
                        <div class="ellipsis" style="width: 350px;" :title="scope.row.goodsInfo.name">{{scope.row.name}}</div>
                        <div class="gray">{{scope.row.goodsInfo.specs | specsFilter}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label="状态"
                    width="180">
                    <template slot-scope="scope">
                        <span class="goods-state">
                            {{scope.row.goodsInfo.status | statusFilter}}
                            <i v-permission="['商品', '商品列表', '默认页面', '修改上下架']" @click="upperAndLowerRacks(scope.row)" :class="{grounding: scope.row.goodsInfo.status == 1, undercarriage: scope.row.goodsInfo.status == 0}" class="i-bg pointer"></i>
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
                    label="库存">
                    <template slot-scope="scope">
                        <span :class="{red: scope.row.goodsInfo.warningStock && (scope.row.goodsInfo.stock <= scope.row.goodsInfo.warningStock)}" class="store">{{scope.row.goodsInfo.stock}}<i v-permission="['商品', '商品列表', '默认页面', '修改库存']" @click="(currentDialog = 'EditorStock') && (dialogVisible = true) && (currentData = scope.row)" class="i-bg pointer"></i></span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="price"
                    label="售卖价（元）">
                    <template slot-scope="scope">
                        <span class="price">{{scope.row.goodsInfo.salePrice}}<i v-permission="['商品', '商品列表', '默认页面', '修改售卖价']" @click="currentData = scope.row; currentDialog = 'EditorPrice'; dialogVisible = true" class="i-bg pointer"></i></span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template slot-scope="scope">
                        <span v-permission="['商品', '商品列表', '默认页面', '修改商品信息']" @click="$router.push('/goods/addGoods?id=' + scope.row.id + '&goodsInfoId=' + scope.row.goodsInfo.id)" class="operate-editor pointer"><i class="i-bg"></i>编辑</span>
                        <span v-permission="['商品', '商品列表', '默认页面', '删除商品']" @click="deleleHandler(scope.row)" class="operate-delete pointer"><i class="i-bg"></i>删除</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="table-footer">
                <el-button @click="moreManageHandler" type="primary">批量管理</el-button>
                <el-button v-if="showTableCheck" @click="checkAllHandler">全选</el-button>
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
                <el-button v-if="showTableCheck" @click="cancelHandler">取消</el-button>
            </div>
        </div>
        <div class="footer">
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @submit="onSubmit"></component>
    </div>
</template>
<style lang="scss" scoped>
.table-footer {
    display: flex;
    align-items: center;
    margin-top: 35px;
    button {
        margin-left: 0;
        margin-right: 28px;
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
        margin-right: 20px;
        .i-bg {
            background:url('../../assets/images/goods/editor.png') no-repeat;
            margin-right: 6px;
        }
    }
    .operate-delete {
        color: #F55858;
        .i-bg {
            background:url('../../assets/images/goods/delete.png') no-repeat;
            background-size: 13px;
            margin-right: 6px;
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
</style>

<script>
import Pagination from '@/components/Pagination'
import DeleteDialog from '@/views/goods/dialogs/deleteDialog'
import EditorPrice from '@/views/goods/dialogs/editorPrice'
import EditorStock from '@/views/goods/dialogs/editorStock'

export default {
    data() {
        return {
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
            loading: false,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                name: '',  // 商品名称
                status: '', // 商品状态 0下架,1上架,2售罄
                productCatalogInfoId: '', // 商品分类ID
            },
            currentDialog: '',
            dialogVisible: false,
            currentData: '',
            state: '',
            showTableCheck: false
        }
    },
    created() {
        if(typeof this.$route.query.status != 'undefined') {
            this.listQuery = Object.assign({}, this.listQuery, {status: +this.$route.query.status})
        }
        this.getList()
        this.getCategoryList()
    },
    filters: {
        statusFilter(val) {
            if(val == 1) {
                return '上架'
            } else if(val == 0) {
                return '下架'
            } else if(val == -1) {
                return '已售馨'
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
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.categoryValue = ''
            this.getList()
        },
        allDelete() {
            let ids = this.multipleSelection.map(val => val.goodsInfo.id)

            this._apis.goods.allDelete({ids}).then((res) => {
                this.getList()
                this.visible = false
                this.$notify({
                    title: '成功',
                    message: '删除成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        upperOrLower(status) {
            let ids = this.multipleSelection.map(val => val.goodsInfo.id)

            this._apis.goods.upperOrLower({ids, status}).then((res) => {
                this.getList()
                this.visible = false
                this.$notify({
                    title: '成功',
                    message: '修改成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        allUpper() {
            this.upperOrLower(1)
        },
        allLower() {
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
                this._apis.goods.upperOrLower({ids: [row.goodsInfo.id], status: _status}).then((res) => {
                    this.getList()
                    this.visible = false
                    this.$notify({
                        title: '成功',
                        message: '修改成功！',
                        type: 'success'
                    });
                }).catch(error => {
                    this.visible = false
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                })
            })
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
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param)

            this._apis.goods.fetchGoodsList(_param).then((res) => {
                this.total = +res.total
                //this.getCategoryName(res.list)
                this.list = res.list
                this.loading = false
            }).catch(error => {
                this.loading = false
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
                this.confirm({title: '立即删除', customClass: 'goods-custom', icon: true, text: '当前商品正在参与营销活动，活动有效期内商品不得“删除”。'}).then(() => {
                    
                })
            } else {
                this.confirm({title: '立即删除', customClass: 'goods-custom', icon: true, text: '是否确认删除？'}).then(() => {
                    this._apis.goods.allDelete({ids: [row.goodsInfo.id]}).then((res) => {
                        this.getList()
                        this.visible = false
                        this.$notify({
                            title: '成功',
                            message: '删除成功！',
                            type: 'success'
                        });
                    }).catch(error => {
                        this.visible = false
                        this.$notify.error({
                            title: '错误',
                            message: error
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
        }
    },
    components: {
        Pagination,
        DeleteDialog,
        EditorPrice,
        EditorStock
    }
}
</script>



