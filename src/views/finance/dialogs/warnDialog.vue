/*提示 */
<template>
    <DialogBase :visible.sync="visible" @submit="submit" :width="widthPx" title="提示" :hasCancel="hasCancel">
        <div class="c_container">
            <div style="text-align:center">
                {{data.text}}
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
            hasCancel: false,
            widthPx:'450px'
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
    span{
        display: block;
        font-size: 18px;
        margin-top: 20px;
    }
}
</style>


