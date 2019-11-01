<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="提示" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>修改价格成功，您可以</p>
            <p><a @click="visible = false" href="javascript:;">关闭本页面</a> 或 <a @click="$router.push('/order/query')" href="javascript:;">返回列表页</a></p>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            operationType: '6',
            operationRemark: '',
            showTextarea: false
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
    .container {
        p {
            text-align: center;
            a {
                color: rgb(101, 94, 255);
                text-decoration: underline;
            }
            &:last-child {
                margin-top: 5px;
            }
        }
    }
   
</style>


