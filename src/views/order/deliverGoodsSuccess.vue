<template>
    <div class="deliver-goods-success">
        <div class="success-icon">
            <i></i>
            <div class="link-box">
                <template v-if="$route.query.type == 'deliverGoods'">
                    发货成功，您可以到订单详情页 
                    <router-link :to="{ path: '/order/orderDetail?id=' + this.$route.query.orderId + '&tab=2' }">查看发货信息</router-link> 或 
                    <router-link v-if="!$route.query.print" :to="{ path: '/order/printingElectronicForm', query: {ids: this.$route.query.orderId} }">打印电子面单</router-link> 或 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.id} }">打印配送单</router-link>
                </template>
                <template v-else-if="$route.query.type == 'orderBulkDelivery'">
                    批量发货成功，您可以到订单详情页 
                    <router-link v-if="orderBulkDeliveryPrintIds && orderBulkDeliveryPrintIds.split(',') && orderBulkDeliveryPrintIds.split(',').length" :to="{ path: '/order/printingElectronicForm', query: {ids: orderBulkDeliveryPrintIds} }">打印电子面单</router-link> 
                    <span v-if="orderBulkDeliveryPrintIds && orderBulkDeliveryPrintIds.split(',') && orderBulkDeliveryPrintIds.split(',').length">或</span> 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.ids} }">打印配送单</router-link>
                </template>
                <template v-else-if="$route.query.type == 'orderAfterDeliverGoods'">
                    发货成功，您可以到订单详情页 
                    <router-link :to="{ path: '/order/afterSalesDetails?id=' + this.$route.query.id + '&tab=2' }">查看发货信息</router-link> 或 
                    <router-link :to="{ path: '/order/printingElectronicForm', query: {ids: this.$route.query.id, afterSale: true} }">打印电子面单</router-link> 或 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.id, afterSale: true} }">打印配送单</router-link>
                </template>
                <template v-else-if="$route.query.type == 'afterSaleBulkDelivery'">
                     批量发货成功，您可以到订单详情页 
                    <router-link :to="{ path: '/order/printingElectronicForm', query: {ids: this.$route.query.ids, afterSale: true} }">打印电子面单</router-link> 或 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.ids, afterSale: true} }">打印配送单</router-link>
                </template>
                <template v-else-if="$route.query.type == 'supplementaryLogistics'">
                    补填物流成功，您可以到订单详情页 
                    <router-link :to="{ path: '/order/orderDetail?id=' + this.$route.query.id + '&tab=2' }">查看发货信息</router-link> 或 
                    <router-link :to="{ path: '/order/printingElectronicForm', query: {ids: this.$route.query.id} }">打印电子面单</router-link> 或 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.id} }">打印配送单</router-link>
                </template>
                <template v-else-if="$route.query.type == 'batchSupplementaryLogistics'">
                    批量补填物流成功，您可以到订单详情页 
                    <router-link :to="{ path: '/order/orderDetail?id=' + this.$route.query.id + '&tab=2' }">查看发货信息</router-link> 或 
                    <router-link :to="{ path: '/order/printingElectronicForm', query: {ids: this.$route.query.ids} }">打印电子面单</router-link> 或 
                    <router-link :to="{ path: '/order/printDistributionSheet', query: {ids: this.$route.query.ids} }">打印配送单</router-link>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    computed: {
        orderBulkDeliveryPrintIds() {
            let returnIds = this.$route.query.orderId
            let printIds = this.$route.query.printIds
            let returnIdsArr = returnIds.split(',')
            let printIdsArr = printIds.split(',')

            let _printIds = ''

            for(let i=0; i<returnIdsArr.length; i++) {
                let returnId = returnIdsArr[i]

                if(!printIdsArr.find(printId => printId == returnId)) {
                    returnIdsArr.splice(i, 1)
                    i--
                }
            }

            return returnIdsArr.join(',')
        }
    }
}
</script>
<style lang="scss" scoped>
.deliver-goods-success {
    padding: 20px;
    background-color: #fff;
    font-size: 18px;
    color: #443D4A;
    .success-icon {
        text-align: center;
        margin-top: 60px;
        i {
            width: 60px;
            height: 60px;
            display: inline-block;
            background: url(../../assets/images/order/success.png) no-repeat;
        }
    }
    .link-box {
        margin-top: 20px;
    }
}
/deep/ .link-box {
    a {
        color: #655EFF;
    }
}
</style>