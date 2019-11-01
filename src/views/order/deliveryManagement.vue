<template>
    <div class="delivery-management">
        <section>
            <el-tabs v-model="activeName">
                <el-tab-pane v-permission="['订单', '发货管理', '订单发货']" label="订单发货" name="order">
                    <!-- <orderDelivery></orderDelivery> -->
                    <component :is="current"></component>
                </el-tab-pane>
                <el-tab-pane v-permission="['订单', '发货管理', '售后发货']" label="售后发货" name="service">
                    <!-- <afterSales></afterSales> -->
                    <component :is="current"></component>
                </el-tab-pane>
            </el-tabs>
            <!-- <component :is="current"></component> -->
        </section>
    </div>
</template>
<script>
import OrderDelivery from './components/orderDelivery'
import AfterSales from './components/afterSales'

export default {
    data() {
        return {
            activeName: 'order',
            current: 'OrderDelivery'
        }
    },
    watch: {
        activeName(value) {
            if(value == 'order') {
                this.current = 'OrderDelivery'
            } else if(value == 'service') {
                this.current = 'AfterSales'
            }
        }
    },
    components: {
        OrderDelivery,
        AfterSales
    }
}
</script>
<style lang="scss" scoped>
    .delivery-management {
        background-color: #fff;
        section {
          padding: 0 0 20px 0;
        }
    }
    /deep/ .el-tabs__nav-scroll {
        background-color: #fff;
    }
    /deep/ #tab-order {
        padding-left: 20px;
    }
    /deep/ .el-tabs__header {
        margin-bottom: 0;
    }
    /deep/ #tab-order {
        padding-left: 0;
    }
    /deep/ .el-tabs__header {
        margin: 0 20px;
    }
</style>


