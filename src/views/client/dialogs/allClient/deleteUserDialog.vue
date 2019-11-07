<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="删除客户" :hasCancel="hasCancel">
        <div class="c_container">
            <img src="../../../../assets/images/client/icon_cuowu.png" alt="" class="warn_img">
            <p>确定删除客户ID: {{data.userId}} 吗？</p>
            <p>删除后将彻底清除该客户所有信息，且无法恢复。</p>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
export default {
    name: 'deleteUserDialog',
    props: ['data'],
    data() {
        return {
            hasCancel: true
        }
    },
    methods: {
        submit() {
            this._apis.client.deleteMember({id: this.data.userId}).then((response) => {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
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
    text-align: center;
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


