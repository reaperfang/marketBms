<template>
    <zdialog :visible.sync="visible" title="选择关联商品" width="659px" :showFooter="showFooter">
        <div class="search">
            <el-cascader
                class="classify"
                v-model="categoryValue"
                :options="categoryOptions"
                @change="handleChange"
                :props="{ multiple: false, checkStrictly: true }"
                    clearable
                    filterable>
            </el-cascader>
            <div class="search-box">
                <el-input v-model="listQuery.name" placeholder="请输入商品关键字"></el-input>
                <el-button @click="getList"><i class="el-icon-search"></i></el-button>
            </div>
        </div>
        <el-table
            v-loading="loading"
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="name"
                label="商品名称"
                width="380">
                <template slot-scope="scope">
                    <div class="ellipsis" style="width: 350px;">{{scope.row.name}}</div>
                </template>
            </el-table-column>
            <el-table-column
                prop="productUnit"
                label="单位"
                width="50">
            </el-table-column>
            <el-table-column
                prop="salePrice"
                label="价格（元）"
                width="90">
            </el-table-column>
            <el-table-column label="操作"
                width="70">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleAdd(scope.$index, scope.row)">添 加</el-button>
                </template>
                </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </zdialog>
</template>
<script>
import zdialog from '@/components/DialogBase'
import Pagination from '@/components/Pagination'

export default {
    data() {
        return {
            categoryValue: [],
            categoryOptions: [],
            tableData: [
                
            ],
            total: 1,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
                productCatalogInfoId: '',
                name: ''
            },
            showFooter: false,
            loading: false
        }
    },
    created() {
        this.getCategoryList()
        this.getList()
    },
    methods: {
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
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        submit() {
            
        },
        handleChange(value) {
            let arr = [...value]
            this.listQuery.productCatalogInfoId = arr.pop()
        },
        handleAdd(index, row) {
            this.$emit('submit', row)
        },
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param)

            this._apis.goods.getSPUGoodsList(_param).then((res) => {
                this.total = +res.total
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
                this.loading = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
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
        zdialog,
        Pagination
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
    .search {
        display: flex;
        justify-content: center;
        align-items: center;
        .classify {
            margin-right: 37px;
        }
    }
    .search-box {
        display: flex;
        /deep/ .el-button {
            border-left: none;
            margin-left: -3px;
        }
    }
</style>


