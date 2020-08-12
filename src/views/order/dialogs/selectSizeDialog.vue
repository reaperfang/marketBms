<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="500px" :showFooter="showFooter">
        <div>
            <div>
                <div class="header">
                    <i class="el-icon-warning"></i>
                    <p>您未设置电子面单打印纸尺寸，请选择电子面单打印纸规格尺寸，选定后可点击继续，完成发货。</p>
                </div>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm">
                    <el-form-item label="已选快递公司：">
                        <el-select disabled v-model="data.expressCompanyCode" placeholder="请选择">
                            <el-option v-for="(item, index) in data.expressCompanyList" :key="index" :label="item.expressCompany" :value="item.expressCompanyCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="电子面单规格尺寸：" prop="specificationSize">
                        <el-select v-model="ruleForm.specificationSize" placeholder="请选择">
                            <el-option v-for="(item, index) in data.list" :key="index" :label="item.sizeSpecs" :value="item.id"></el-option>
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
                specificationSize: ''
            },
            rules: {
                specificationSize: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ]
            }
        }
    },
    methods: {
        submit() {
            this.orderSendGoodsHander(this.params)
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
        orderSendGoodsHander: {

        },
        params: {

        }
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss" scoped>
    .header {
        display: flex;
        margin-bottom: 40px;
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


