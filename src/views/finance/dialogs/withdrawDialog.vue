/*批量审核 */
<template>
<div>
    <DialogBase :visible.sync="visible" :showFooter="false" title="提现审核" :hasCancel="hasCancel">
        <div class="c_container">
            <div class="marB20">
                <el-radio v-model="radio" label="0">同意申请</el-radio>
                <el-radio v-model="radio" label="1">拒绝申请</el-radio>
            </div>
            <el-input
                type="textarea"
                :rows="4"
                placeholder="请输入拒绝原因，不超过20个字"
                v-model="remarks"
                v-if="radio == 1"
                @blur="checkNull">
            </el-input>
            <p style="color:#FD4C2B;font-size:12px;margin-top:10px;text-align:left;" v-if="note">请输入拒绝原因</p>
            <p style="text-align:center; margin-top:10px;">
               <el-button type="primary"  @click="submit">确定</el-button>
                <el-button @click="cancel">取消</el-button> 
            </p>
        </div>
    </DialogBase>
    <el-dialog
        title="提示"
        :visible.sync="otherVisible"
        width="30%"
    >
        <div class="other_cont">
            <img src="../../../assets/images/finance/icon_success.png" alt="" style="display:block; margin: 0 auto">
            <span>审核成功</span>
        </div>
        <span slot="footer" class="dialog-footer fcc">
            <el-button type="primary" @click="otherVisible = false">我知道了</el-button>
        </span>
    </el-dialog>
</div>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
import auditSuccessDialog from './auditSuccessDialog'
export default {
    name: "withdrawDialog",
    components: { auditSuccessDialog },
    props: ['data'],
    data() {
        return {
            hasCancel: true,
            radio: '1',
            remarks:"",
            otherVisible: false,
            currentDialog: "",
            currentData:{},
            note:false
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
    },
    computed: {
        visible: {
            get() {
                this.remarks = ''
                return this.dialogVisible
            },
            set(val) {
                this.$emit('update:dialogVisible', val)
            }
        }
    },
    watch:{
        radio(){
            this.init()
        }
    },
    created() { 
        this.init()
     },
    methods: {
        init(){
            if(this.radio == 1 && this.remarks.trim() == ''){
                this.note = true
            }else{
                this.note = false
            }
        },
        submit() {
            let datas = {
                ids:this.data,
                auditStatus:this.radio,
                remarks:this.remarks.trim()
            }
            if(this.radio == 0){
                this.$emit("handleSubmit",datas);
                this.visible = false
            }else if(this.radio == 1 && this.remarks.trim()){
                this.$emit("handleSubmit",datas);
                this.visible = false
            }else{
                return false
            }
        },
        cancel(){
            this.$emit("fetch");
            this.visible = false
        },
        checkNull(){
            this.init()
        }
    },    
}
</script>
<style lang="scss" scoped>
/deep/ .el-dialog {
        border-radius: 10px;
    }
/deep/ .el-dialog__header {
    background: #f1f0ff;
    border-radius: 10px 10px 0 0;
}
/deep/ .el-dialog__title {
    color: #44434B;
}
/deep/ .el-dialog__body{
    text-align: center;
}
.c_container{
    div{
        text-align: left;
    }
}
.other_cont{
    text-align: center;
    img{
        display: block;
    }
    span{
        display: block;
        font-size: 18px;
        margin-top: 20px;
    }
}
</style>


