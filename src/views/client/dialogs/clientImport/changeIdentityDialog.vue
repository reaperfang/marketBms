<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量变更用户身份" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="user_id">该批次导入用户共{{data.successNum}}人，确定批量变更为以下会员等级吗？</p>
            <div class="s_cont">
                <span>会员等级：</span>
                <el-select v-model="selectLevel" style="margin-bottom: 10px">
                    <el-option v-for="item in levelList" :label="item.alias" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <p>注：若用户当前会员等级高于变更级别，则此次变更无效</p>
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
    name: "changeIdentityDialog",
    props: ['data'],
    data() {
        return {
            hasCancel: true,
            selectLevel:"",
            levelList: [],
            btnLoading: false
        }
    },
    methods: {
        submit() {
            this.btnLoading = true;
            if(this.selectLevel.length > 0) {
                let levelInfoId, levelInfoName;
                this.levelList.map((v) => {
                    if(v.id == this.selectLevel) {
                        levelInfoId = v.id;
                        levelInfoName = v.name;
                    }
                });
                let params = {importRecordId: this.data.id, levelInfoId: levelInfoId, levelName: levelInfoName};
                this._apis.client.modifyImportIdentity(params).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message({
                        message: '批量变更身份成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    console.error(error);
                    this.btnLoading = false;
                    this.visible = false;
                })
            }else{
                this.btnLoading = false;
                this.$message({
                    message: '请选择用户等级',
                    type: 'warning'
                });
            }
            
        },
        getLevelList() {
            this._apis.client.getLevelList({}).then((response) => {
                this.levelList = [].concat(response);
            }).catch((error) => {
                console.error(error);
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
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
        }
    },
    mounted() {
        this.getLevelList();
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
.user_id{
    text-align: left;
    padding: 0 0 21px 15px;
}
.s_cont{
    text-align: left;
    padding-left: 16px;
}
.dialog-footer{
    margin-top: 20px;
}
</style>


