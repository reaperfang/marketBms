<template>
    <div style="min-height: 100vh;">
        <!-- <div class="goods-list-empty">
            <div class="goods-list-empty-content">
                <div class="image"></div>
                <p>当前店铺没有商品，点击“新建商品”快去发布您的商品吧！</p>
                <el-button @click="$router.push('/goods/addGoods')" class="add-goods" type="primary">新建商品</el-button>
            </div>
        </div> -->
        <div class="goods-list-empty">
            <div v-if="!loading" class="goods-list-empty-content">
                <div class="image"></div>
                <p>当前店铺没有商品，点击“新建商品”快去发布您的商品吧！</p>
                <el-button @click="$router.push('/goods/addGoods')" class="add-goods" type="primary">新建商品</el-button>
            </div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.goods-list-empty {
    background-color: #fff;
    display: flex;
    justify-content: center;
    text-align: center;
    .goods-list-empty-content {
        padding-top: 155px;
        padding-bottom: 20px;
        .image {
            width: 210px;
            height: 178px;
            background: url('../../assets/images/goods/goodsListEmpty.png') no-repeat;
            margin: 0 auto;
        }
        p {
            font-size:14px;
            font-weight:400;
            color:rgba(61,67,74,1);
            margin-top: 40px;
        }
    }
    .add-goods {
        margin-top: 30px;
    }
}

</style>

<script>

export default {
    data() {
        return {
            
        }
    }
}
</script>



