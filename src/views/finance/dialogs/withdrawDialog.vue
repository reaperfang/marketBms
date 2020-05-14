/*批量审核 */
<template>
<div>
    <DialogBase :visible.sync="visible" :showFooter="false" title="提现审核" :hasCancel="hasCancel">
        <div class="c_container">
             <el-form ref="form" :model="form" :rules="rules">
              <el-form-item prop="radio">
                <el-radio-group v-model="form.radio">
                  <el-radio label="0">同意申请</el-radio>
                  <el-radio label="1">拒绝申请</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item prop="remarks">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="请输入拒绝原因，不超过20个字"
                  v-model="form.remarks"
                  v-if="form.radio == 1"
                  style="width:300px;">
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submit('form')">确定</el-button>
                <el-button @click="cancel">取消</el-button>
              </el-form-item>
            </el-form>
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
            otherVisible: false,
            currentDialog: "",
            currentData:{},
            form:{
                radio:'0',
                remarks:'',
            },
            rules: {
                remarks: [
                    { required: true, message: '请输入拒绝原因', trigger: 'blur' },
                    { min: 1, max: 20, message: '不超过20个字', trigger: 'blur' }
                ],
            },
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
    watch:{},
    created() { 

     },
    methods: {
        submit(formName) {
            let datas = {
                ids:this.data,
                auditStatus:this.form.radio,
                remarks:this.form.remarks.trim()
            }
            if(this.form.radio == 0){
                this.$emit("handleSubmit",datas);
                this.visible = false
            }else if(this.form.radio == 1){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$emit("handleSubmit",datas);
                    this.visible = false
                }
                })
            }   
        },
        cancel(){
            this.$emit("fetch");
            this.visible = false
        },
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


