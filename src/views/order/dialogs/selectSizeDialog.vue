<template>
    <DialogBase :visible.sync="visible" @submit="submit" :title="title" width="640px" :showFooter="showFooter" @close="close">
        <div>
            <div>
                <div class="header">
                    <i class="el-icon-warning"></i>
                    <p>您未设置电子面单打印纸尺寸，请选择电子面单打印纸规格尺寸，选定后可点击继续，完成发货。</p>
                </div>
                <div class="content-box">
                    <el-form ref="ruleForm" label-width="150px" class="demo-ruleForm">
                        <div v-for="(item, index) in data.list" :key="index">
                            <el-form-item label="已选快递公司：">
                                <el-select disabled v-model="item.expressCompanyCodes" placeholder="请选择">
                                    <el-option v-for="(item, index) in data.expressCompanyList" :key="index" :label="item.expressCompany" :value="item.expressCompanyCode"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="电子面单规格尺寸：" prop="specificationSize">
                                <el-select v-model="item.specificationSize" placeholder="请选择" @change="specificationSizeChange(item.specificationSize, index)">
                                    <el-option v-for="(item, index) in item.sizeList" :key="index" :label="item.sizeSpecs" :value="item.templateSize"></el-option>
                                </el-select>
                                <p v-if="item.showError">请选择</p>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="footer">
                <el-button @click="submit" type="primary">继续</el-button>
                <el-button @click="cancelHandler">取消</el-button>
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
        close() {
            this.$emit('cancel')
        },
        cancelHandler() {
            this.visible = false
            this.$emit('cancel')
        },
        specificationSizeChange(value, index) {
            if(!value) {
                this.$set(this.data.list, index, Object.assign({}, this.data.list[index], {
                    showError: true
                }))
            } else {
                this.$set(this.data.list, index, Object.assign({}, this.data.list[index], {
                    showError: false
                }))
            }
        },
        submit() {
            let _params = JSON.parse(JSON.stringify(this.params))

            _params.sendInfoDtoList.forEach((val, index) => {
                val.specificationSize = this.data.list[index].specificationSize
            })
            this.data.list.forEach((item, index) => {
                if(!item.specificationSize) {
                    this.$set(this.data.list, index, Object.assign({}, this.data.list[index], {
                        showError: true
                    }))
                } else {
                    this.$set(this.data.list, index, Object.assign({}, this.data.list[index], {
                        showError: false
                    }))
                }
            })
            if(this.data.list.find(item => !item.specificationSize)) {
                return
            }
            this.data.list.forEach((item, index) => {
                this._apis.order
                .editorExpressSize({
                    id: item.express ? item.express.id : '',
                    cid: item.express ? item.express.cid : '',
                    specificationSize: item.specificationSize,
                    expressCompanyCode: item.expressCompanyCode
                })
                .then(res => {
                    alert('res')
                })
                .catch(error => {
                    this.$message.error(error);
                });
            })
            this.orderSendGoodsHander(_params)
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
        cid() {
            let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
            return shopInfo.id;
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
            default: '提示'
        },
        orderSendGoodsHander: {

        },
        params: {

        },
        list: {

        },
        express: {

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
       margin-top: 52px;
   }
   /deep/ .el-icon-warning {
       margin-right: 16px;
       &:before {
           color: #fd932b;
           font-size: 30px;
       }
   }
   /deep/ .el-input {
       width: 360px;
   }
   /deep/ .el-dialog__body {
       padding: 40px 40px 35px 40px;
   }
   .content-box {
        max-height: 400px;
        overflow-y: auto;
    }
   .content-box::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .content-box::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
</style>


