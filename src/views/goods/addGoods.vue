<template>
    <div class="add-goods">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="商品信息" name="goodsDetails">
                <component :is="current"></component>
            </el-tab-pane>
            <el-tab-pane label="分佣设置" name="subCommission">
                <component v-if="resellConfigInfo && editor" :is="current" :resellConfigInfo="resellConfigInfo" :detail="goodsDetail"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import goodsDetails from './goodsDetail'
import subCommission from './components/commisionSet'

export default {
    data() {
      return {
        activeName: 'goodsDetails',
        current: 'goodsDetails',
        resellConfigInfo: null, // 分销设置
        goodsDetail: {},
      };
    },
    computed: {
        editor() {
            if(this.$route.query.id) {
                return true
            }
            return false
        }
    },
    created() {
        // 商品详情
        this.getGoodsDetail();
         // 来自分佣
        if(this.$route.query.commissionEdit) {
            this.activeName = 'subCommission';
            this.current = 'subCommission';
        }    
        // 获取分销商设置
        this._apis.client.checkCreditRule({id: JSON.parse(localStorage.getItem('shopInfos')).id}).then( data => {
            if(data.isOpenResell == 1) this.resellConfigInfo = data.resellConfigInfo ? JSON.parse(data.resellConfigInfo) : null;
        }).catch((error) => {
            console.error(error);
        });
    },
    methods: {
        handleClick(tab, event) {
            if(tab.name == 'goodsDetails') {
                this.current = 'goodsDetails'
            } else if(tab.name == 'subCommission') {
                this.current = 'subCommission'
            }
        },
        getGoodsDetail() {
            let {id} = this.$route.query

            this._apis.goods.getGoodsDetail({id}).then(res => {
                this.goodsDetail = res;
            }).catch(error => {
                console.error(error)
            }) 
        }
    },
    components: {
        goodsDetails,
        subCommission
    }
}
</script>
<style lang="scss" scoped>
    .add-goods {
        background-color: #fff;
        padding: 18px 21px;
    }
</style>