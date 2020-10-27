<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="关闭订单提示" width="500px" :showFooter="showFooter">
        <div class="container">
            <p>关闭订单后不可撤销，且系统将发起未发货商品的自动退款，您确定关闭订单吗？</p>
            <p>建议与用户沟通后再关闭订单，并选择关闭原因：</p>
            <div>
                <span @click="showTextarea = false">
                    <el-radio v-model="operationType" label="7" @change="thirdAbnormalDelivery">用户申请关闭</el-radio>
                </span>
                <span @click="showTextarea = false" class="mgl_30">
                    <el-radio v-model="operationType" label="6" @change="thirdAbnormalDelivery">库存不足</el-radio>
                </span>
                <template v-if="deliveryWay!=3">
                <p @click="showTextarea = true" class="other">
                    <el-radio v-model="operationType" label="8">其它</el-radio>
                </p>
                <el-input
                    v-if="showTextarea"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="operationRemark"
                    maxlength="50"
                    >
                </el-input>
                </template>
                <template v-else>
                    <div class="thirdOrder">
                    <el-radio v-model="operationType" label="8" @change="thirdAbnormalDelivery">第三方配送异常</el-radio>
                    <el-select :disabled="thirdDisabled" v-model="value" :class="{error: showError}"  @change="change" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                     <p class="chooseThirdReason"  v-if="showError">请选择配送异常原因，必选项</p>
                    </div>
                <el-input
                    v-if="showTextarea"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="operationRemark"
                    maxlength="50"
                    >
                </el-input>
                </template>
            </div>
        </div>
        <div class="footer">
            <el-button @click="visible = false">取消</el-button>
            <el-button @click="submit" type="primary">确定</el-button>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
            operationType: '',
            operationRemark: '',
            showTextarea: false,
            deliveryWay:'',
            thirdDisabled:true,
            showError:false,
            options: [{
                value: '1',
                label: '没有配送员接单'
            }, {
                value: '2',
                label: '配送员没来取货'
            }, {
                value: '3',
                label: '配送员态度太差'
            }, {
                value: '4',
                label: '顾客取消订单'
            }, {
                value: '5',
                label: '订单填写错误'
            }, {
                value: '6',
                label: '配送员让我取消此单'
            }, {
                value: '7',
                label: '配送员不愿上门取货'
            }, {
                value: '8',
                label: '我不需要配送了'
            }, {
                value: '9',
                label: '配送员以各种理由表示无法完成订单'
            }, {
                value: '10',
                label: '其他'
            }],
            value: ''
        }
    },
    created(){
        this.deliveryWay = this.data.deliveryWay
    },
    methods: {
        thirdAbnormalDelivery(){
            this.showError = false
           if(this.operationType==8) {
              this.thirdDisabled = false
           }else{
               this.thirdDisabled = true
               this.value=''
           }
        },
        submit() {
            let operationRemark = ''

            if(this.operationType == '') {
                this.$message({
                    message: '请选择关闭原因',
                    type: 'warning'
                });
                return
            }
            if(this.operationType == 7) {
                operationRemark = '用户申请关闭'
            } else if(this.operationType == 6) {
                operationRemark = '库存不足'
            } else if(this.deliveryWay!=3 && this.operationType == 8) {
                    operationRemark = this.operationRemark
                        if(!this.operationRemark) {
                             this.$message({
                                message: '请输入关闭原因',
                                type: 'warning'
                                });
                                return
                        }
                        if(/^\s+$/.test(this.operationRemark)) {
                            this.$message({
                            message: '关闭原因不能为空',
                            type: 'warning'
                            });
                            return
                        }
                 }else if(this.deliveryWay==3 && this.operationType == 8){
                     if(this.value){
                         this.showError= false;
                         if(this.value == 10 && !this.operationRemark){ 
                            this.$message({
                                message: '请输入关闭原因',
                                type: 'warning'
                                });
                                return
                         }
                         operationRemark = "第三方配送异常"
                         
                     }else{
                         this.showError= true;
                         return
                     }
                 }
            this.$emit('submit', {
                operationType: +this.operationType,
                operationRemark
            })

            this.visible = false
        },
        change() {
            // operationRemark
            if(this.value){
                this.showError=false
                if(this.value == '10'){
                    this.showTextarea=true
                }else{
                    this.showTextarea=false
                }
            }else{
                this.showError=true
            }
            
        },
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
        font-size: 16px;
    }
   p {
       line-height: 21px;
       margin-bottom: 30px;
   }
   .other {
       margin-top: 14px;
   }
   .footer {
       text-align: center;
       padding-top: 10px;
   }
   .thirdOrder{
       margin-top:10px;
       margin-bottom:10px;
   }
   /deep/ .el-radio__label {
       font-size: 16px;
   }
   .chooseThirdReason{
       font-size:12px;
       color:#FD4C2B;
       margin-left:143px;
       margin-top:5px;
   }
   .error{
       /deep/ .el-input--small .el-input__inner {
          border-color:  #FD4C2B
       }
   }
</style>
