<template>
    <DialogBase :visible.sync="visible" title="选择商品分类" :showFooter="showFooter">
        <el-cascader
            :options="categoryOptions"
            v-model="categoryValue"
            @change="handleChange"
            :props="{ multiple: false, checkStrictly: true }"
            clearable>
        </el-cascader>

        <div class="footer">
            <el-button>取消</el-button>
            <el-button @click="submit" type="primary">确认</el-button>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            categoryOptions: [],
            categoryValue: [],
            productCatalogInfoId: '',
            showFooter: false
        }
    },
    created() {
        this.getCategoryList()
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

            })
        },
        submit() {
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))

            this._apis.goods.transferGoods({
                cid: shopInfo.id,
                id: this.data,
                transferCatalogId: this.productCatalogInfoId
            }).then((res) => {
                this.$notify({
                        title: '成功',
                        message: '转移成功！',
                        type: 'success'
                    });
                this._apis.goods.deleteCategory({id: this.data}).then((res) => {
                    this.$notify({
                        title: '成功',
                        message: '删除成功！',
                        type: 'success'
                    });
                    this.onSubmit()
                    this.dialogVisible = false
                }).catch(error => {
                    this.dialogVisible = false
                })
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
                this.dialogVisible = false
            })
        },
        handleChange(value) {
            let _value = [...value]
            this.productCatalogInfoId = _value.pop()
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
        onSubmit: {

        }
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
    .footer {
        text-align: center;
        margin-top: 30px;
    }
</style>


