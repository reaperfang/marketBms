<template>
    <div class="app-content classify">
        <div class="search">
            <el-button v-permission="['商品', '商品分类', '默认页面', '新建分类']" @click="addLevel1Category" type="primary">新建一级分类</el-button>
            <el-form ref="form" :inline="true" :model="formInline" class="form-inline input_style">
                <el-form-item label="搜索分类">
                    <el-input v-model="formInline.name" placeholder="请输入分类名称..."></el-input>
                </el-form-item>
                <!-- <el-form-item label="分类状态：">
                    <el-select v-model="formInline.enable">
                        <el-option label="所有状态" value=""></el-option>
                        <el-option label="启用" :value="1"></el-option>
                        <el-option label="禁用" :value="0"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="getTreeList">查询</el-button>
                    <el-button class="border-button" @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="categoryTh" style="background:'#ebeafa'; color:'#655EFF';">
			<div class="treeRow th" :style="{background:'#F6F7FA', color:'#44434B'}">
			<span class="td">分类名称</span>
			<span class="td">状态</span>
			<span class="td">操作</span>
		</div>
		</div>
        <el-tree
			v-loading="loading"
			class="goodsCategory"
			:data="categoryData"
			:props="defaultProps"
			node-key="id"
			ref="category"
            default-expand-all
			:expand-on-click-node="false"
			:render-content="renderContent"
            :indent="indent">
		</el-tree>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit" :add="add" :data="currentData" :onSubmit="getTreeList"></component>
    </div>
</template>
<script>
import AddCategoryDialog from '@/views/goods/dialogs/addCategoryDialog'
import TransferGoodsDialog from '@/views/goods/dialogs/transferGoodsDialog'

export default {
    data() {
        return {
            formInline: {
                name: '',
                enable: ''
            },
            items: [],
            loading:false,
            defaultProps: {
                children: 'childrenCatalogs',
                label: 'name'
            },
            categoryData: [],
            currentDialog: '',
            dialogVisible: false,
            add: true,
            flatArr: [],
            currentData: '',
            onoff: 0,
            indent: 53
        }
    },
    created() {
        //this.getList()
        this.getTreeList()
        this.getApplyInfo()
    },
    computed: {
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        },
    },
    methods: {
        getApplyInfo() {
            this._apis.goods.getApplyInfo({
                cid: this.cid,
            }).then((res) => {
                this.onoff = res.onoff
            }).catch(error => {
                console.error(error);
            })
        },
        resetForm(formName) {
            this.formInline.name = ''
            this.getTreeList()
        },
        getTreeList() {
            this.loading = true
            this._apis.goods.fetchTreeCategoryList({
                name: this.formInline.name,
            }).then((res) => {
                this.categoryData = res
                this.loading = false
            }).catch(error => {
                console.error(error);
                this.loading = false
            })
        },
        onSubmit() {

        },
        addLevel1Category() {
            this.currentDialog = 'AddCategoryDialog'
            this.currentData = {level: 0, add: true}
            this.dialogVisible = true
        },
        transTreeData(data, pid) {
            var result = [], temp;
            for (var i = 0; i < data.length; i++) {
                if (data[i].parentId == pid) {
                    var obj = {"categoryName": data[i].name,"id": data[i].id, parentId: data[i].parentId, level: data[i].level, sort: data[i].sort, image: data[i].image, enable: data[i].enable};
                    temp = this.transTreeData(data, data[i].id);
                    if (temp.length > 0) {
                        obj.childrenList = temp;
                    }
                    result.push(obj);
                }
            }
            return result;
        },
        flatTreeArray(array = [], childrenKey = 'childrenList') {
            var result = [];
            let flat = (array = {}, childrenKey, floor) => {
                array.forEach(item => {
                let dataItem = {
                    floor: floor,
                    name: item.categoryName,
                    id: item.id,
                    parentId: item.parentId,
                }
                result.push(dataItem);

                let childrenArr;
                if (item.hasOwnProperty(childrenKey)) {
                    childrenArr = item[childrenKey];
                    delete item[childrenKey];
                }
                if (childrenArr && childrenArr.length > 0) {
                    flat(childrenArr, childrenKey, floor + 1)
                }
                });
            }
            flat(array, childrenKey, 1);
            return result;
        },
        renderContent(h, { node, data, store }) {
            if(node.level < 3) {
                return (
                    <div class="treeRow">
                        <span class="td first">
                            { h('span', {
                                style: {
                                    backgroundImage: `url(${data.image})`,
                                    height: '32px',
                                    width: '32px',
                                    display: 'inline-block'
                                }
                            })}
                            <span>{data.name}</span>
                        </span>
                        <span class="td state">{data.enable === 1 ? '启用' : '禁用' }</span>
                        <span class="td operate">
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        {node.level == 2 ? '新建三级分类' : (node.level == 1 ? '新建二级分类' : '新建一级分类')}
                                    </div>
                                    <i v-permission="['商品', '商品分类', '默认页面', '新建分类']" class="fenleiIcon" on-click={() => this.addCategory(node, data)}></i>
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        {node.data.isRecommend != 1 ? '一键推荐' : '取消推荐'}
                                    </div>
                                    { h('i', {
                                        class: node.data.isRecommend != 1 ? 'share' : 'shareCancel',
                                        on: {
                                            click: () => this.recommend(node, data)
                                        },
                                        style: {
                                            display: this.onoff ? 'block' : 'none'
                                        }
                                    })}
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        {node.data.enable === 1 ? '禁用' : '启用'}
                                    </div>
                                    { h('i', {
                                        'v-permission': "['商品', '商品分类', '默认页面', '隐藏']",
                                        class: node.data.enable === 1 ? 'jinyong' : 'qiyong',
                                        on: {
                                            click: () => this.forbidden(node, data)
                                        }
                                    })}
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">修改</div>
                                    <i class="editor" on-click={() => this.change(node, data)}></i>
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">删除</div>
                                    <i v-permission="['商品', '商品分类', '默认页面', '删除']" class="delete" on-click={() => this.delete(node, data)}></i>
                                </el-tooltip>
                            }
                        </span>
                    </div>
                )
            } else {
                return (
                    <div class="treeRow">
                        <span class="td first">
                            { h('span', {
                                style: {
                                    backgroundImage: `url(${data.image})`,
                                    height: '32px',
                                    width: '32px',
                                    display: 'inline-block'
                                }
                            })}
                            <span>{data.name}</span>
                        </span>
                        <span class="td state">{data.enable === 1 ? '启用' : '禁用' }</span>
                        <span class="td operate">
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        {node.data.isRecommend != 1 ? '一键推荐' : '取消推荐'}
                                    </div>
                                    { h('i', {
                                        class: node.data.isRecommend != 1 ? 'share' : 'shareCancel',
                                        on: {
                                            click: () => this.recommend(node, data)
                                        },
                                        style: {
                                            display: this.onoff ? 'block' : 'none'
                                        }
                                    })}
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">
                                        {node.data.enable === 1 ? '禁用' : '启用'}
                                    </div>
                                    { h('i', {
                                        'v-permission': "['商品', '商品分类', '默认页面', '隐藏']",
                                        class: node.data.enable === 1 ? 'jinyong' : 'qiyong',
                                        on: {
                                            click: () => this.forbidden(node, data)
                                        }
                                    })}
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">修改</div>
                                    <i class="editor" on-click={() => this.change(node, data)}></i>
                                </el-tooltip>
                            }
                            {
                                <el-tooltip class="item" effect="dark" placement="bottom">
                                    <div slot="content">删除</div>
                                    <i v-permission="['商品', '商品分类', '默认页面', '删除']" class="delete" on-click={() => this.delete(node, data)}></i>
                                </el-tooltip>
                            }
                        </span>
                    </div>
                )
            }
        },
        change(node, data) {
            // console.log(data)
            this.currentDialog = 'AddCategoryDialog'
            this.currentData = {
                id: data.id,
                parentId: data.parentId,
                editor: true
            }
            this.dialogVisible = true
        },
        addCategory(node, data) {
            // console.log(node)
            this.currentDialog = 'AddCategoryDialog'
            this.currentData = Object.assign({}, node.data, {add: true})
            this.dialogVisible = true
        },
        forbidden(node, data) {
            let _enable

            if(node.data.enable === 1) {
                _enable = 0
                if(data.isRecommend == 1) {
                    this.confirm({icon: true, text: '当前分类正在首页推荐位置，不可禁用。', customClass: 'alert'}).then(() => {

                    })
                    return
                }
            } else {
                _enable = 1
            }
            this._apis.goods.enableCategory({id: node.data.id, enable: _enable}).then((res) => {
                this.getTreeList()
            }).catch(error => {
                console.error(error);
            })
        },
        recommend(node, data) {
            let isRecommend

            if(node.data.isRecommend === 1) {
                isRecommend = 0
            } else {
                isRecommend = 1
            }
            this._apis.goods.recommend({cid: this.cid, id: node.data.id, isRecommend}).then((res) => {
                this.getTreeList()
            }).catch(error => {
                console.error(error);
            })
        },
        delete(node, data) {
            if(data.isRecommend == 1) {
                this.confirm({icon: true, text: '当前分类正在首页推荐位置，不可删除。', customClass: 'alert'}).then(() => {

                })
                return
            }
            this.confirm({icon: true, text: '删除后此分类无法展示，确认删除吗？'}).then(() => {
                this._apis.goods.deleteCategory({id: node.data.id}).then((res) => {
                    if(res && res.msg == 'existProduct') {
                        // this.confirm({title: '转移商品', icon: false, text: '是否将此分类其下的全部商品转移到其他分类中？'}).then(() => {
                        //     this.currentData = node.data.id
                        //     this.currentDialog = 'TransferGoodsDialog'
                        //     this.dialogVisible = true
                        // })
                        this.confirm({icon: true, showCancelButton: false, text: '当前商品分类无法删除，请您去商品列表转移该分类下的所有商品，再尝试删除。'}).then(() => {
                            
                        })
                    } else {
                        this.$message({
                            message: '删除成功！',
                            type: 'success'
                        });
                        this.getTreeList()
                    }
                }).catch(error => {
                    this.$message.error({
                        message: error,
                        type: 'error'
                    });
                })
            })
        },
        submit() {
            this.getTreeList()
        },
        getList() {
            this.loading = true
            let params = {}

            params = Object.assign({}, this.formInline)
            if(this.formInline.name == '') {
                delete params.name
            }
            if(this.formInline.enable == '') {
                delete params.enable
            }
            this._apis.goods.fetchCategoryList(params).then((res) => {
                let arr = this.transTreeData(res, 0)

                this.categoryData = arr
                this.flatArr = this.flatTreeArray(JSON.parse(JSON.stringify(arr)))
                this.loading = false
            }).catch(error => {
                console.error(error);
                this.loading = false
            })
        }
    },
    components: {
        AddCategoryDialog,
        TransferGoodsDialog,
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .el-tree-node__content {
        padding: 16px 0;
    }
    .search {
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
    /deep/ .el-tree-node__content>.el-tree-node__expand-icon {
        padding: 3px!important;
    }
    /deep/ .el-tooltip.delete {
      outline: none;
    }
</style>
<style lang="scss">
.content-main-classify {
    overflow-x: hidden!important;
}
.blue {
    color: $globalMainColor;
}
.deleteColor {
    color: #F55858;
}
.classify {
    background: #fff;
    padding: 20px;
    border-radius: 4px;
    .dialog-container {
        text-align: left;
    }
    .form-inline {
        margin-top: 23px;
    }
    .goodsCategory .el-tree-node,.categoryTh{
	position:relative;
}
.goodsCategory .el-tree-node__content{
	border-bottom:1px solid #eee;
	height:auto;
}
.th .td:first-child{padding-left:20px;}
.treeRow{
	overflow:hidden;
	width:100%
}
.treeRow .td{
	line-height:36px;
	height: 36px;
	display:inline-block;
	width:33%;
	float:left;
	overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.treeRow .td .thumbImg{width:30px; height:30px; border:1px solid #efefef; display: block; overflow: hidden; margin-top: 2px}
.treeRow .td .thumbImg img{width: 100%}
.treeRow .td.short{width: 10%}
.treeRow .td:nth-child(2){position:absolute; left:50%}
.treeRow .td:nth-child(3){position:absolute; left:85%; min-width:200px}
/deep/ .el-tree-node__expand-icon:before {
    content: "\e7a0";
    color: #655EFF;
    font-size: 14px;
    padding-left:20px;
}
/deep/ .expanded.el-tree-node__expand-icon:before {
    content: "\e7a2";
    color: #655EFF;
    font-size: 14px;
}
/deep/ .is-leaf.el-tree-node__expand-icon:before {
    content: "";

}
/deep/ .el-tree-node__expand-icon.expanded {
    transform: rotate(0deg);
}
}
.operate {
    span {
        margin-right: 6px;
    }
    i {
        display: inline-block;
        width: 13px;
        height: 13px;
        margin-right: 14px;
        &.fenleiIcon {
            background: url('../../assets/images/goods/fenleiIcon.png') no-repeat;
            background-size: 100% 100%;
        }
        &.editor {
            background: url('../../assets/images/goods/editor.png') no-repeat;
            background-size: 100% 100%;
        }
        &.jinyong {
            background: url('../../assets/images/goods/jinyong.png') no-repeat;
            background-size: 100% 100%;
        }
        &.qiyong {
            background: url('../../assets/images/goods/qiyong.png') no-repeat;
            background-size: 100% 100%;
        }
        &.delete {
            background: url('../../assets/images/goods/delete.png') no-repeat;
            background-size: 100% 100%;
        }
        &.share {
            background: url('../../assets/images/goods/share.png') no-repeat;
            background-size: 100% 100%;
        }
        &.shareCancel {
            background: url('../../assets/images/goods/shareCancel.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
.treeRow {
    .td.first {
        display: flex;
        align-items: center;
        span:first-child {
            background-size: 100%;
            margin-right: 5px;
        }
    }
}
</style>



