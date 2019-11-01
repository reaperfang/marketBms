<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="变更客户身份" :hasCancel="hasCancel">
        <div class="c_container">
            <p class="user_id">用户ID：{{ data.memberSn }}</p>
            <p class="user_id">当前身份：{{ data.identity }}</p>
            <div class="s_cont">
                <span>变更为：</span>
                <el-select v-model="selectLevel" style="margin-bottom: 10px" @change="handleChange">
                    <el-option v-for="item in levelList" :label="item.alias" :value="item.id" :key="item.id"></el-option>
                </el-select>
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
            levelList: [],
            flag: false
        }
    },
    methods: {
        submit() {
            if(this.selectLevel.length > 0 && this.flag) {
                let id;
                this.levelList.map((v) => {
                    if(v.id == this.selectLevel) {
                        id = v.id;
                    }
                });
                let params = {id: id, oldLevelId: this.data.oldLevelId, memberInfoId: this.data.id};
                this._apis.client.identityChange(params).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: "变更身份成功",
                        type: 'success'
                    });
                    this.$emit('refreshPage');
                }).catch((error) => {
                    console.log(error);
                })
            }else{
                this.$notify({
                    title: '警告',
                    message: '请正确选择用户等级',
                    type: 'warning'
                });
            }
        },
        getLevelList() {
            this._apis.client.getLevelList({}).then((response) => {
                this.levelList = [].concat(response);
            }).catch((error) => {
                console.log(error);
            })
        },
        handleChange(val) {
            let currentLevel = null;
            this.levelList.map((v) => {
                if(v.id == val) {
                    currentLevel = v.level;
                }
            });
            if(currentLevel <= this.data.oldLevel) {
                this.$notify({
                    title: '警告',
                    message: '只能高于当前身份等级',
                    type: 'warning'
                });
            }else{
                this.flag = true;
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


