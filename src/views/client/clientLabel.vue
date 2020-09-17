<template>
    <div class="c_container clearfix">
        <div class="c_top" v-permission="['用户', '用户标签', '默认页面', '添加标签']">
            <el-button type="primary" @click="_routeTo('batchImport')" v-permission="['用户', '用户标签', '默认页面', '添加标签']">添加标签</el-button>
        </div>
        <div class="c_line">
            <span>标签名称：</span>
            <div class="input_wrap w_210">
                <el-input v-model="tagName" placeholder="请输入标签名称"></el-input>
            </div>
            <span class="marL20">标签类型：</span>
            <div class="input_wrap marR20">
                <el-select v-model="tagType" clearable>
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <el-button type="primary" @click="getLabelList" :loading="btnloading">查 询</el-button>
            <el-button @click="reset">重 置</el-button>
        </div>
        <clTable style="margin-top: 30px" :params="params" @stopLoading="stopLoading"></clTable>
    </div>
</template>
<script type="es6">
import clTable from './components/clientLabel/clTable';
export default {
    name:'clientLabel',
    components: { clTable },
    data() {
        return {
            tagName:"",
            tagType:"",
            options: [
                {label: '手工',value: 0},
                {label: '自动',value: 1}
            ],
            params: {},
            btnloading: false
        }
    },
    computed: {
        
    },
    methods: {
        stopLoading() {
            this.btnloading = false;
        },
        getLabelList() {
            this.btnloading = true;
            this.params = {
                tagName: this.tagName,
                tagType: this.tagType
            }
        },
        reset() {
            this.tagName = "";
            this.tagType = "";
            this.params = {
                tagName: "",
                tagType: ""
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/ .el-button+.el-button{
    margin-left: 8px;
}
.c_container{
    padding: 20px;
    background-color: #fff;
    .c_top{
        padding-bottom: 20px;
        border-bottom: 1px solid #D0D6E4;
        margin-bottom: 20px;
    }
    .marL20{
        margin-left: 20px;
    }
    .marR100{
        margin-right: 100px;
    }
    .marR20{
        margin-right: 20px;
    }
    .c_line{
        margin-bottom: 30px;
        span{
            color: #3D434A;
        }
        .input_wrap{
            display: inline-block;
        }
    }
}
</style>
