<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量删除客户" :hasCancel="hasCancel">
        <div class="c_container">
            <img src="../../../../assets/images/client/icon_cuowu.png" alt="" class="warn_img">
            <p>确认确认批量删除选中的共{{data.checkedItem.length}}个客户吗？</p>
            <p>删除后将彻底清除以上客户所有信息，且无法恢复</p>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
export default {
    name: 'batchDeleteUserDialog',
    props: ['data'],
    data() {
        return {
            hasCancel: true
        }
    },
    methods: {
        submit() {
            let arr = [];
            this.data.checkedItem.map((v) => {
                arr.push(v.id);
            });
            arr = arr.join(',');
            this._apis.client.batchDeleteMember({ids:arr}).then((response) => {
                this.$notify({
                    title: '成功',
                    message: '批量删除成功',
                    type: 'success'
                });
                this.$emit('freshTable');
            }).catch((error) => {
                console.log(error);
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
            })
        }
    },
    mounted() {
        
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


