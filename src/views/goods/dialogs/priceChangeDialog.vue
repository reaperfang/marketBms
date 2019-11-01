<template>
    <DialogBase class="price-change" :visible.sync="visible" title="一键改价" width="523px" :showFooter="showFooter">
        <el-form :model="ruleForm" ref="ruleForm" label-width="130px" class="demo-ruleForm">
            <el-form-item label="" prop="">
                <el-radio v-model="ruleForm.changeType" label="1">价格</el-radio>
                <el-radio v-model="ruleForm.changeType" label="2">折扣</el-radio>
            </el-form-item>
            <el-form-item style="margin-left: 45px;" v-if="ruleForm.changeType == '1'" label="批量修改价格：" prop="price">
                <el-input type="number" v-model="ruleForm.price"></el-input> 元
                <p class="first">支持正/负数值输入</p>
                <p>正数代表在原价基础上相加，负数代表相减</p>
            </el-form-item>
            <el-form-item style="margin-left: 45px;" v-if="ruleForm.changeType == '2'" label="批量修改价格：" prop="price">
                <el-input type="number" v-model="ruleForm.price"></el-input> %
                <p class="first">当输入80，那么就按照原始价格的80%（8折）计算</p>
                <p>输入百分比就是折扣 直接乘以那个折扣数字</p>
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
                this.$emit('submit', this.ruleForm)
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
        width: auto;
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
</style>



