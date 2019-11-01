<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量变更客户身份" :hasCancel="hasCancel">
        <div class="c_container">
            <p class="user_id">该批次导入客户共{{data.successNum}}人，确定批量变更为以下会员等级吗？</p>
            <div class="s_cont">
                <span>会员等级：</span>
                <el-select v-model="selectLevel" style="margin-bottom: 10px">
                    <el-option v-for="item in levelList" :label="item.alias" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <p>注：若客户当前会员等级高于变更级别，则此次变更无效</p>
            </div>
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
            levelList: []
        }
    },
    methods: {
        submit() {
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
                    this.$notify({
                        title: '成功',
                        message: "批量变更身份成功",
                        type: 'success'
                    });
                }).catch((error) => {
                    console.log(error);
                    // this.$notify.error({
                    //     title: '错误',
                    //     message: error
                    // });
                })
            }else{
                this.$notify({
                    title: '警告',
                    message: '请选择用户等级',
                    type: 'warning'
                });
            }
            
        },
        getLevelList() {
            this._apis.client.getLevelList({}).then((response) => {
                this.levelList = [].concat(response);
            }).catch((error) => {
                console.log(error);
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
</style>


