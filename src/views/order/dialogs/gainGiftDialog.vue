<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="288px" :showFooter="showFooter">
        <div class="content-box">
            <ul>
                <li v-for="(item, index) in data" :class="{last : index == data.length - 1}">
                    <span>{{item.appGift.goodsName}}</span>
                    <span>×{{item.goodsQuantity}}</span>
                </li>
            </ul>
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
            title: '赠品'
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
    ul li {
        height: 50px;
        line-height: 50px;
        border-bottom: 1px solid rgba(241,241,241,1);
        &.last {
            border-bottom: 0;
        }
    }
    // /deep/ .el-dialog__body {
    //     padding: 0 20px;
    // }
</style>


