<template>
    <div class="bulk-delivery">
        <div class="title">批量发货</div>
        <div class="container">
            <section>
                <div class="title">1. 选择您要进行发货的商品并填写物流信息</div>
                <div class="goods-item" v-for="(item, index) in list" :key="index">
                    <div class="item-title">
                        <span>商品清单</span>
                        <span>订单编号 {{item.orderCode}}</span>
                    </div>
                    <div class="item-content">
                        <div class="row align-center table-title">
                            <div class="col" style="width: 660px;">
                                <div class="row align-center row-margin">
                                    <div class="col"><i class="checkbox"></i></div>
                                    <div class="col" style="width: 380px;">商品</div>
                                    <div class="col" style="width: 60px;">应发数量</div>
                                    <div class="col">本次发货数量</div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row align-center row-margin">
                                    <div class="col" style="width: 180px;">收货信息</div>
                                    <div class="col">查看物流</div>
                                </div>
                            </div>
                        </div>
                        <div class="row align-center table-container">
                            <div class="col" style="width: 660px; flex-shrink: 0;">
                                <div class="row align-center row-margin" v-for="(goods, index) in item.goodsList" :key="index">
                                    <div class="col"><i class="checkbox"></i></div>
                                    <div class="col" style="width: 380px;">
                                        <div class="row align-center">
                                            <div class="col">
                                                <img :src="goods.image" alt="">
                                            </div>
                                            <div class="col">
                                                <p>{{goods.goodsName}}</p>
                                                <p>{{goods.goodsSpecs}}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col" style="width: 60px;">{{goods.number}}</div>
                                    <div class="col">{{goods._number}}</div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="row row-margin">
                                    <div class="col" style="width: 180px;">{{item.info}}</div>
                                    <div class="col">
                                        <p>{{item.company}}</p>
                                        <p>{{item.expressCode}}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            list: [
                {
                    orderCode: 'PD20190606000001',
                    info: '张张/13800003828 北京市 大兴区 地盛西路一号 XXXXXXXXXXXXXXXXXXXXXXXXXX',
                    company: '顺丰公司',
                    expressCode: 'SF09009932432433E4',
                    goodsList: [
                        {
                            goodsName: '商品名称',
                            goodsSpecs: '商品规格',
                            image: require('../../assets/images/order/apple.png'),
                            number: 10,
                            _number: 2
                        },
                        {
                            goodsName: '商品名称',
                            goodsSpecs: '商品规格',
                            image: require('../../assets/images/order/apple.png'),
                            number: 10,
                            _number: 2
                        },
                    ]
                }
            ]
        }
    }
}
</script>
<style lang="scss" scoped>
    .bulk-delivery {
        background-color: #fff;
        padding: 20px;
        border-radius: 4px;
        >.title {
            font-size: 16px;
        }
        .container {
            padding-top: 20px;
            padding-left: 60px;
            section {
                .goods-item {
                    margin-top: 20px;
                    border-radius:10px;
                    border:1px solid rgba(211,211,211,1);
                    .item-title {
                        background-color: rgb(243, 244, 244);
                        padding: 20px;
                        border-radius: 10px 10px 0 0;
                    }
                    .item-content {
                        padding: 20px;
                        .checkbox {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            background: url(../../assets/images/order/checkbox.png) no-repeat;
                        }
                        .row-margin >.col {
                            margin-right: 25px;
                        }
                    }
                }
            }
        }
    }
</style>