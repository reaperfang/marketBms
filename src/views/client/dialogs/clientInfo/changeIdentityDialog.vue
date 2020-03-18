<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="变更用户身份" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="user_id">用户ID：{{ data.memberSn }}</p>
            <p class="user_id">当前身份：{{ data.memberType == 0? '非会员用户':`VIP${data.level} ${data.identity}`}}</p>
            <div class="s_cont">
                <span>变更为：</span>
                <el-select v-model="selectLevel" style="margin-bottom: 10px">
                    <el-option v-for="item in levelList" :label="item.alias" :value="item.id" :key="item.id"></el-option>
                </el-select>
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
                let id;
                this.levelList.map((v) => {
                    if(v.id == this.selectLevel) {
                        id = v.id;
                    }
                });
                let params = {id: id, oldLevelId: this.data.oldLevelId, memberInfoId: this.data.id};
                this._apis.client.identityChange(params).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$message({
                        message: '变更身份成功',
                        type: 'success'
                    });
                    this.$emit('refreshPage');
                }).catch((error) => {
                    this.btnLoading = false;
                    this.visible = false;
                    console.log(error);
                })
            }else{
                this.btnLoading = false;
                this.$message({
                    message: '请正确选择用户等级',
                    type: 'warning'
                });
            }
        },
        getLevelList() {
            this._apis.client.getLevelList({}).then((response) => {
                this.levelList = response.filter(item => item.level > this.data.level);
                this.levelList.map((item) => {
                    this.$set(item, 'alias', `${item.alias} ${item.name}`)
                });
            }).catch((error) => {
                console.log(error);
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


