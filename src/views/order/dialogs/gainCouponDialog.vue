<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="data.title" width="346px" :showFooter="showFooter">
        <div class="content-box">
            <div class="coupon-box">
                <template v-if="data.coupon">
                    <div class="coupon" :class="{last: index == data.couponList.length - 1}" v-for="(item, index) in data.couponList" :key="index">
                        <div class="item lefter">
                            <template v-if="item.appCoupon.useType == 0">
                                <p>{{item.appCoupon.useTypeFullcut}}</p>
                                <p>元</p>
                            </template>
                            <template v-else>
                                <p>{{item.appCoupon.useTypeDiscount*10}}</p>
                                <p>折</p>
                            </template>
                        </div>
                        <div class="item righter">
                            <p>{{item.appCoupon.name}}</p>
                            <p class="limit">使用时限:{{item.startTime | timeFilter}}-{{item.endTime | timeFilter}}</p>
                        </div>
                    </div>
                    <Empty v-show="!data.couponList.length"></Empty>
                </template>
                <template v-else>
                    <div class="coupon-code" :class="{last: index == data.couponCodeList.length - 1}" v-for="(item, index) in data.couponCodeList" :key="index">
                        <div class="coupon-code-header">优惠码 {{item.couponCode}}</div>
                        <div class="coupon">
                            <div class="item lefter">
                                <template v-if="item.appCoupon.useType == 0">
                                    <p>{{item.appCoupon.useTypeFullcut}}</p>
                                    <p>元</p>
                                </template>
                                <template v-else>
                                    <p>{{item.appCoupon.useTypeDiscount*10}}</p>
                                    <p>折</p>
                                </template>
                            </div>
                            <div class="item righter">
                                <p>{{item.appCoupon.name}}</p>
                                <p class="limit">使用时限:{{item.startTime | timeFilter}}-{{item.endTime | timeFilter}}</p>
                            </div>
                        </div>
                    </div>
                    <Empty v-show="!data.couponCodeList.length"></Empty>
                </template>
            </div>
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

            return value || ''
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
    .coupon-box .coupon, .coupon-box .coupon-code {
        margin-bottom: 20px;
        &.last {
            margin-bottom: 0;
        }
    }
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
   /deep/ .el-dialog__body {
       padding: 20px 15px;
   }
   .content-box {
       padding: 0 5px;
        max-height: 400px;
        overflow-y: auto;
    }
    .content-box::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .content-box::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
</style>


