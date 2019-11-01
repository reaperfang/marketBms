<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="发放会员卡" :hasCancel="hasCancel">
        <div class="c_container">
            <p class="user_id">用户ID：{{data.memberSn}}</p>
            <div class="s_cont">
                <span>发放会员卡：</span>
                <el-select v-model="selectLevel" style="margin-bottom: 10px">
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
                let params = {memberInfoId: this.data.id, cardLevelInfoId: levelInfoId, name: levelInfoName};
                this._apis.client.giveCard(params).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: "发放会员成功",
                        type: 'success'
                    });
                    this.$emit('refreshPage');
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
            this._apis.client.getCardList({}).then((response) => {
                let list = response.list.filter((v) => {
                    return v.enable == 0
                })
                this.levelList = [].concat(list);
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


