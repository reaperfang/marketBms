<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品信息" name="goodsDetail">
                <component :is="current"></component>
            </el-tab-pane>
            <el-tab-pane label="分佣设置" name="subCommission">
                <component :is="current"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import goodsDetail from './goodsDetail'
import subCommission from './components/subCommission'

export default {
    data() {
      return {
        activeName: 'goodsDetail',
        current: 'goodsDetail'
      };
    },
    methods: {
        // handleClick(value) {
        //     if(value == 'goodsDetail') {
        //         this.current = 'goodsDetail'
        //     } else if(value == 'subCommission') {
        //         this.current = 'subCommission'
        //     }
        // }
        handleClick(tab, event) {
            console.log(tab, event);
        }
    },
    components: {
        goodsDetail,
        subCommission
    }
}
</script>
<style lang="scss" scoped>

</style>