/*审核成功 */
<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="提现审核" :hasCancel="hasCancel" :width="widths">
        <div class="c_container">
            <div>
                <img src="../../../assets/images/finance/icon_success.png" alt="">
                <span>审核成功</span>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    name: "auditSuccessDialog",
    props: ['data'],
    data() {
        return {
            widths:'500px',
            hasCancel: false
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
        }
    },
    mounted() {
        
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
    span{
        display: block;
        font-size: 18px;
        margin-top: 20px;
    }
}
</style>


