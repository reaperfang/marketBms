<template>
    <div class="c_container">
        <div>
            <span class="marR10">状态</span>
            <el-select v-model="status" placeholder="请选择" clearable class="w_184">
                <el-option label="全部" value="2"></el-option>
                <el-option label="禁用" value="0"></el-option>
                <el-option label="启用" value="1"></el-option>
            </el-select>
            <el-button type="primary" class="marL20" @click="checkLevel">查 询</el-button>
        </div>
        <div style="color: #FD4C2B; font-size: 12px; margin: 30px 0 10px 0">请注意：会员等级被启用后，随意变更升级条件容易导致升级条件混乱，影响用户体验，请谨慎操作。</div>
        <cvTable :params="params"></cvTable>
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
    border-radius: 4px;
    .marR10{
        margin-right: 10px;
    }
    .marL20{
        margin-left: 20px;
    }
}
</style>

