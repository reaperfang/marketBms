/*导出弹窗提示 */
<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="提示" :hasCancel="hasCancel">
        <div class="c_container">
            <div>
                <img src="../../../assets/images/finance/icon_error.png" alt="">
                <span>导出数据量超过1000条，建议分时间段导出。<br/>点击确定导出当前筛选下的前1000条数据，点击取消请重新筛选。</span>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    name: "exportTipDialog",
    props: ['data'],
    data() {
        return {
            hasCancel: true
        }
    },
    methods: {
        submit() {
        let exportApi = this.data.api;
        let query = this.data.query;
        this._apis.finance[exportApi](query).then((response)=>{
            if(exportApi == 'smsExport' || exportApi == 'exportTa'){
                window.location.href = response.url
            }else{
                window.location.href = response
            }
          
        }).catch((error)=>{
          this.$message.error(error);
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


