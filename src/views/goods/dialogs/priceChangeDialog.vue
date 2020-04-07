<template>
    <DialogBase class="price-change" :visible.sync="visible" title="批量改价" width="523px" :showFooter="showFooter">
        <el-form :model="ruleForm" ref="ruleForm" label-width="112px" class="demo-ruleForm">
            <el-form-item label="" prop="">
                <el-radio v-model="ruleForm.changeType" label="1">价格</el-radio>
                <el-radio v-model="ruleForm.changeType" label="2">折扣</el-radio>
            </el-form-item>
            <el-form-item style="margin-left: 45px;" v-if="ruleForm.changeType == '1'" label="批量修改价格：" prop="price">
                <el-input type="number" v-model="ruleForm.price" placeholder="请输入"></el-input> 元
                <p class="first gray">输入正数代表在原价基础上相加，负数代表原价基础上相减。</p>
                <p class="gray">输入百分比代表原价基础上直接乘以折扣率。</p>
            </el-form-item>
            <el-form-item style="margin-left: 45px;" v-if="ruleForm.changeType == '2'" label="批量修改价格：" prop="price">
                <el-input type="number" min="0" max="100" v-model="ruleForm.price" placeholder="请输入"></el-input> %
                <p class="first gray">输入正数代表在原价基础上相加，负数代表原价基础上相减。</p>
                <p class="gray">输入百分比代表原价基础上直接乘以折扣率。</p>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button @click="submit('ruleForm')" type="primary">确 认</el-button>
            <el-button @click="visible = false">取 消</el-button>
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
                changeType: '1',
                price: '',
            },
        }
    },
    methods: {
        submit(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                if(this.ruleForm.changeType == 2) {
                    if(this.ruleForm.price < 0) {
                        this.$message({
                        message: '折扣不能为负值',
                        type: 'warning'
                        });
                        return
                    }
                    if(+this.ruleForm.price > 100) {
                        this.$message({
                        message: '当前折扣最大限制为100，请您重新输入',
                        type: 'warning'
                        });
                        return
                    }
                } else {
                    if(+this.ruleForm.price < 0) {
                        this.$message({
                        message: '价格不能为负值',
                        type: 'warning'
                        });
                        return
                    }
                    if(+this.ruleForm.price > 10000000) {
                        this.$message({
                        message: '当前价格最大限制为10000000，请您重新输入',
                        type: 'warning'
                        });
                        return
                    }
                }
                if(/^\s*$/.test(this.ruleForm.price)) {
                    let name

                    if(this.ruleForm.changeType == 2) {
                        name = '折扣'
                    } else {
                        name = '价格'
                    }
                    this.$message({
                    message: `${name}不能为空`,
                    type: 'warning'
                    });
                    return
                }
                this.$emit('changePriceSubmit', this.ruleForm)
                this.visible = false
            } else {
                this.visible = false
                console.log('error submit!!');
                return false;
            }
            });
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
    watch: {
        'ruleForm.changeType'() {
            this.ruleForm.price = ''
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
    /deep/ .el-input {
        width: 126px;
        margin-right: 10px;
    }
    .footer {
        text-align: center;
        margin-top: 28px;
    }
    p {
        color: $grayColor;
        font-size: 12px;
        line-height: 21px;
    }
    .first {
        margin-top: 10px;
    }
    /deep/ .el-form .el-form-item:nth-child(2) {
        margin-left: 93px!important;
    }
    /deep/ .el-form-item__content p {
        margin-left: -109px;
    }
    .gray {
        font-size:12px;
        font-weight:400;
        color:rgba(181,189,202,1);
    }
    /deep/ .el-radio {
        &:first-child {
            margin-right: 44px;
        }
    }
    /deep/ .el-form-item {
        &:first-child {
            .el-form-item__content {
                margin-left: 93px!important;
            }
        }
    }
    /deep/ .el-form-item__label {
        color: #44434B;
    }
</style>



