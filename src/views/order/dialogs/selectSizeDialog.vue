<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <div>
                <div class="header">
                    <i class="el-icon-warning"></i>
                    <p>您未设置电子面单打印纸尺寸，请选择电子面单打印纸规格尺寸，选定后可点击继续，完成发货。</p>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="已选快递公司：" prop="region">
                        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电子面单规格尺寸：" prop="region">
                        <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div class="footer">
                <el-button @click="visible = false">取消</el-button>
                <el-button @click="submit" type="primary">确定</el-button>
            </div>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                region: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                date1: [
                    { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
                ],
                date2: [
                    { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
                ],
                type: [
                    { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                ],
                resource: [
                    { required: true, message: '请选择活动资源', trigger: 'change' }
                ],
                desc: [
                    { required: true, message: '请填写活动形式', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        submit() {
            if(this.refuseReasonLabel == 2) {
                if(!this.refuseReason) {
                    this.$message({
                    message: '请输入拒绝原因',
                    type: 'warning'
                    });
                    return
                }
                if(/^\s+$/.test(this.refuseReason)) {
                    this.$message({
                    message: '拒绝原因不能为空',
                    type: 'warning'
                    });
                    return
                }
            }
            this.$emit('reject', this.refuseReasonLabel == 1 ? '人为破坏拒绝售后' : this.refuseReason)
            this.visible = false
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
        },
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            required: true
        },
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
    .header {
        display: flex;
        p {
            font-size:16px;
            font-weight:500;
            color:rgba(68,67,75,1);
            line-height:22px;
        }
    }
   .footer {
       text-align: center;
       margin-top: 140px;
   }
   /deep/ .el-icon-warning {
       margin-right: 16px;
       &:before {
           color: #fd932b;
           font-size: 30px;
       }
   }
</style>


