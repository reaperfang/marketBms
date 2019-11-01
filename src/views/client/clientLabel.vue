<template>
    <div class="c_container">
        <div class="c_line">
            <span>标签名称：</span>
            <div class="input_wrap">
                <el-input v-model="tagName" placeholder="请输入标签名称"></el-input>
            </div>
            <span class="marL20">标签类型：</span>
            <div class="input_wrap marR100">
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
        <el-button type="primary" @click="_routeTo('batchImport')" v-permission="['客户', '客户标签', '默认页面', '添加标签']">添加标签</el-button>
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
                startIndex: 1,
                pageSize: 10,
                tagName: this.tagName,
                tagType: this.tagType
            }
        },
        reset() {
            this.tagName = "";
            this.tagType = "";
            this.params = {
                startIndex: 1,
                pageSize: 10,
                tagName: "",
                tagType: ""
            }
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.c_container{
    padding: 32px 36px;
    background-color: #fff;
    .marL20{
        margin-left: 20px;
    }
    .marR100{
        margin-right: 100px;
    }
    .c_line{
        margin-bottom: 30px;
        span{
            color: #3D434A;
        }
        .input_wrap{
            width: 160px;
            display: inline-block;
        }
    }
}
</style>
