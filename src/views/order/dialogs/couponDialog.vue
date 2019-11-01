<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="346px" :showFooter="showFooter">
        <div class="coupon-box">
            <template v-if="data.coupon">
                <div class="coupon" v-for="(item, index) in data.usedCouponList" :key="index">
                    <div class="item lefter">
                        <p>{{item.couponMoney}}</p>
                        <p>元</p>
                    </div>
                    <div class="item righter">
                        <p>{{item.couponName}}</p>
                        <p class="limit">使用时限:{{item.startTime | timeFilter}}-{{item.endTime | timeFilter}}</p>
                    </div>
                </div>
                <Empty v-show="!data.usedCouponList.length"></Empty>
            </template>
            <template v-else>
                <div class="coupon-code" v-for="(item, index) in data.usedPromotionList" :key="index">
                    <div class="coupon-code-header">优惠码 {{item.promotionCodeId}}</div>
                    <div class="coupon">
                        <div class="item lefter">
                            <p>{{item.promotionCodeMoney}}</p>
                            <p>元</p>
                        </div>
                        <div class="item righter">
                            <p>{{item.promotionCodeName}}</p>
                            <p class="limit">使用时限:{{item.startTime | timeFilter}}-{{item.endTime | timeFilter}}</p>
                        </div>
                    </div>
                </div>
                <Empty v-show="!data.usedPromotionList.length"></Empty>
            </template>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import Empty from '@/components/Empty'

export default {
    data() {
        return {
            showFooter: false,

        }
    },
    filters: {
        timeFilter(value) {
            if(value && value.split(/\s+/).length) {
                return value.split(/\s+/)[0]
            }

            return value
        }
    },
    methods: {
        submit() {
            
        }
    },
    computed: {
        visible: {
            get() {
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        },
        contentText() {
            return '是否确认删除？'
        },
        title() {
            if(this.coupon) {
                return '使用的优惠券'
            } else {
                return '使用的优惠码'
            }
        }
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
    },
    components: {
        DialogBase,
        Empty
    }
}
</script>
<style lang="scss" scoped>
   .coupon-box .coupon .item  {
       .lefter {
           flex-shrink: 0;
            width: 76px;
       }
       .righter {
           flex: 1;
       }
       p {
           margin-bottom: 5px;
       }
   }
   .coupon-box .coupon-code .item  {
       .lefter {
           flex-shrink: 0;
            width: 76px;
       }
       .righter {
           flex: 1;
       }
       p {
           margin-bottom: 5px;
       }
   }
   .limit {
       font-size: 12px;
   }
</style>


