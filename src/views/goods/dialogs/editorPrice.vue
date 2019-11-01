<template>
    <DialogBase :visible.sync="visible" width="500px" :showFooter="showFooter" title="编辑售卖价">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="商品标题:" prop="name">
                <span>{{ruleForm.name}}</span>
            </el-form-item>
            <el-form-item label="售卖价:" prop="salePrice">
                <el-input type="number" v-model="ruleForm.salePrice"></el-input>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button @click="submit('ruleForm')" type="primary">确定</el-button>
            <el-button @click="visible = false">取消</el-button>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import Zform from '@/components/Form'

export default {
    data() {
        return {
            ruleForm: {
                name: '',
                salePrice: ''
            },
            rules: {
                salePrice: [
                    { required: true, message: '请输入售卖价', trigger: 'blur' },
                ],
            },
            showFooter: false
        }
    },
    created() {
        this.getCurrent()
    },
    watch: {
        data: {
            deep: true,
            handler(val, oldVal) {
                this.getCurrent()
            }
        }
    },
    methods: {
        submit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this._apis.goods.changePrice({id: this.data.goodsInfo.id, salePrice: this.ruleForm.salePrice}).then((res) => {
                    this.$emit('submit')
                    this.visible = false
                    this.$notify({
                        title: '成功',
                        message: '编辑成功！',
                        type: 'success'
                    });
                }).catch(error => {
                    this.visible = false
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                })
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        getCurrent() {
            this.ruleForm = Object.assign({}, {
                name: this.data.name,
                salePrice: this.data.goodsInfo.salePrice
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
        },
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        }
    },
    components: {
        DialogBase,
        Zform
    }
}
</script>
<style lang="scss" scoped>
    .footer {
        text-align: center;
    }
</style>


