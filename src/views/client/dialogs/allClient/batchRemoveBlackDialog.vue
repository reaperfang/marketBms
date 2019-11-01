<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量解除黑名单" :hasCancel="hasCancel">
        <div class="c_container">
            <img src="../../../../assets/images/client/icon_cuowu.png" alt="" class="warn_img">
            <p>满足以上搜索条件共{{ data.checkedItem.length }}个客户</p>
            <p>确定将以上客户冻结权限全部解冻吗？</p>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
export default {
    name: 'batchRemoveBlackDialog',
    props: ['data'],
    data() {
        return {
            hasCancel: true
        }
    },
    methods: {
        submit() {
            let memberInfoIds = [];
            this.data.checkedItem.map((v) => {
                memberInfoIds.push(v.id);
            });
            //优惠券解除
            this._apis.client.batchFrozenCoupons({memberIdList: memberInfoIds, frozenType: 0}).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error)
            });
            let params = {memberInfoIds: memberInfoIds.join(',')}
            this._apis.client.batchRemoveFromBlack(params).then((response) => {
                this.$notify({
                    title: '成功',
                    message: "批量解除黑名单成功",
                    type: 'success'
                });
                this.$emit('freshTable');
            }).catch((error) => {
                console.log(error);
            })
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
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
.c_container{
    .warn_img{
        display: block;
        margin: 0 auto 24px auto;
    }
    p{
        font-size: 18px; 
        margin-bottom: 5px;
    }
}

</style>


