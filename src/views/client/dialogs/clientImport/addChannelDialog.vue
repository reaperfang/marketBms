<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="添加渠道" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <span>请输入渠道名称: </span>
            <div class="input_wrap">
                <el-input v-model="channerlName"></el-input>
            </div>
        </div>
        <div>
            <span slot="footer" class="dialog-footer fcc">
                <el-button type="primary" @click="submit" :loading="btnLoading">确 认</el-button>
                <el-button v-if="hasCancel" @click="visible = false">取 消</el-button>
            </span>
        </div>
    </DialogBase>
</template>
<script>
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    props: ['data'],
    name: "addTagDialog",
    data() {
        return {
            hasCancel: true,
            channerlName:"",
            btnLoading: false
        }
    },
    methods: {
        submit() {
            this.btnLoading = true;
            if(this.channerlName == "") {
                this.btnLoading = false;
                this.$message({
                    message: '请输入渠道名称',
                    type: 'warning'
                });
            }else{
                this._apis.client.addChannel({channerlName: this.channerlName}).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message({
                        message: '添加渠道成功',
                        type: 'success'
                    });
                    this.$emit('refreshPage')
                }).catch((error) => {
                    //为了验证渠道重名的情况，打开此错误提示
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message.error(error);
                })   
            }
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
.c_container{
    padding: 0 30px;
    .input_wrap{
        width: 200px;
        display: inline-block;
    }
}
.dialog-footer{
    margin-top: 20px;
}
</style>


