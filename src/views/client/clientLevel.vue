<template>
    <div class="c_container">
        <div>
            <span class="marR10">状态</span>
            <el-select v-model="status" placeholder="请选择" clearable>
                <el-option label="全部" value="2"></el-option>
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
            </el-select>
            <el-button type="primary" class="marL20" @click="checkLevel">查 询</el-button>
        </div>
        <cvTable style="margin-top: 36px" :params="params"></cvTable>
    </div>
</template>
<script>
import cvTable from './components/clientLevel/cvTable';
export default {
    name: 'clientLevel',
    components: { cvTable },
    data() {
        return {
            status: "",
            params: {
                startIndex:"",
                pageSize:"",
                status:""
            }
        }
    },
    methods: {
        checkLevel() {
            this.params = Object.assign({},{
                startIndex:"",
                pageSize:"",
                status:this.status == '2' ? '':this.status
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.c_container{
    padding: 20px;
    background-color: #fff;
    .marR10{
        margin-right: 10px;
    }
    .marL20{
        margin-left: 20px;
    }
}
</style>

