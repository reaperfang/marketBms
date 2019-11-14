<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="设置领取条件" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <div class="c_line" v-if="getIndex(data.conditionList,'消费金额满') !== -1">
                <el-radio v-model="condition1" label="消费金额满">消费金额满：</el-radio>
                <div class="input_wrap">
                    <el-input placeholder="请输入数字" v-model="xfjem" @keyup.native="checkZero($event,xfjem,'xfjem')"></el-input>
                </div>
                <span>元</span>
            </div>
            <div class="c_line" v-if="getIndex(data.conditionList,'消费次数满') !== -1">
                <el-radio v-model="condition1" label="消费次数满">消费次数满：</el-radio>
                <div class="input_wrap">
                    <el-input placeholder="请输入数字" v-model="xfcsm" @keyup.native="checkZen($event,xfcsm,'xfcsm')"></el-input>
                </div>
                <span>次</span>
            </div>
            <div class="c_line" v-if="getIndex(data.conditionList,'积分获得满') !== -1">
                <el-radio v-model="condition1" label="积分获得满">积分获得满：</el-radio>
                <div class="input_wrap">
                    <el-input placeholder="请输入数字" v-model="jfhdm" @keyup.native="checkZero($event,jfhdm,'jfhdm')"></el-input>
                </div>
                <span>分</span>
            </div>
        </div>
        <div>
            <span slot="footer" class="dialog-footer fcc">
                <el-button type="primary" @click="submit">确 认</el-button>
                <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
            </span>
        </div>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    name: 'createCardDialog',
    props: ['data'],
    data() {
        return {
            hasCancel: true,
            condition1: "",
            xfjem:"",
            xfcsm:"",
            jfhdm:""
        }
    },
    methods: {
        checkZero(event,val,ele) {
            val = val.replace(/[^\d.]/g,'');
            val = val.replace(/^0/g,'');
            this[ele] = val;
        },
        checkZen(event,val,ele) {
            val = val.replace(/[^\d]/g,'');
            val = val.replace(/^0/g,'');
            this[ele] = val;
        },
        submit() {
            let params;
            if(this.condition1 == "消费金额满") {
                if(this.xfjem !== "") {
                    params = {
                        level: this.data.level,
                        levelConditionValueDto: {
                            levelConditionId: this.getId(this.data.conditionList,'消费金额满'),
                            conditionValue: this.xfjem
                        }
                    }
                    this._apis.client.checkCardValue(params).then((response) => {
                        if(!response) {
                            this.$notify({
                                title: '警告',
                                message: '高等级条件数值要大于低等级的条件数值',
                                type: 'warning'
                            });
                        }else{
                            this.visible = false;
                            this.$emit('getCondition', {levelConditionId: this.getId(this.data.conditionList,'消费金额满'), conditionValue: this.xfjem, label: '消费金额满'});
                        }
                    }).catch((error) => {
                        this.visible = false;
                        console.log(error);
                    })
                }else{
                    this.$notify({
                        title: '警告',
                        message: '请输入消费金额',
                        type: 'warning'
                    });
                }
            }else if(this.condition1 == "消费次数满") {
                if(this.xfcsm !== "") {
                    params = {
                        level: this.data.level,
                        levelConditionValueDto: {
                            levelConditionId: this.getId(this.data.conditionList,'消费次数满'),
                            conditionValue: this.xfcsm
                        }
                    }
                    this._apis.client.checkCardValue(params).then((response) => {
                        if(!response) {
                            this.$notify({
                                title: '警告',
                                message: '高等级条件数值要大于低等级的条件数值',
                                type: 'warning'
                            });
                        }else{
                            this.visible = false;
                            this.$emit('getCondition', {levelConditionId: this.getId(this.data.conditionList,'消费次数满'), conditionValue: this.xfcsm, label: '消费次数满'});
                        }
                    }).catch((error) => {
                        this.visible = false;
                        console.log(error);
                    })
                }else{
                    this.$notify({
                        title: '警告',
                        message: '请输入消费次数',
                        type: 'warning'
                    });
                }
            }else{
                this.$notify({
                    title: '警告',
                    message: '请选择领取条件',
                    type: 'warning'
                });
            }
        },
        getIndex(arr, val) {
            let i = arr.findIndex((value,index,arr) => {
                return value.name == val;
            });
            return i;
        },
        getId(arr, val) {
            let id = "";
            arr.map((v) => {
                if(v.name == val) {
                    id = v.id
                }
            });
            return id;
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
        if(this.data.conditionData) {
            this.condition1 = this.data.conditionData.name;
            let value = this.data.conditionData.value;
            switch(this.condition1) {
                case '消费金额满':
                    this.xfjem = value;
                    break;
                case '消费次数满':
                    this.xfcsm = value;
                    break;
                case '积分获得满':
                    this.jfhdm = value;
                    break;
                default: 
                    break;
            }
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
/deep/ .el-radio{
    margin-right: 0;
}
.c_container{
    width: 350px;
    .c_line{
        margin-bottom: 10px;
        .input_wrap{
            width: 100px;
            display: inline-block;
        }
    }
}
.dialog-footer{
    margin-top: 20px;
}

</style>


