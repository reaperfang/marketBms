<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="发放会员卡" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="user_id">会员卡：{{data.name}}</p>
            <div class="clearfix">
                <p class="c_label fl">发放人群：</p>
                <div class="fl tags_container">
                    <el-checkbox-group v-model="checkList" @change="handleChange">
                        <el-checkbox v-for="item in tags" :key="item.id" :label="item.tagName"></el-checkbox>
                    </el-checkbox-group>
                </div>
            </div> 
            <p class="red">确定给{{this.labels || '  '}}发放会员卡：{{data.name}}吗？</p>
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
    name: "addBlackDialog",
    props: ['data'],
    data() {
        return {
            hasCancel: true,
            tags: [],
            checkList: [],
            labels: "",
            btnLoading: false
        }
    },
    methods: {
        submit() {
            this.btnLoading = true;
            let tagIds = [];
            if(this.checkList.length !== 0) {
                this.checkList.map((v) => {
                    this.tags.map((item) => {
                        if(item.tagName == v) {
                            tagIds.push(item.id);
                        }
                    })
                });
                tagIds = tagIds.join(',');
                let params = {
                    memberLabelInfoIds: tagIds,
                    cardLevelInfoId: this.data.id,
                    cardLevel: this.data.level,
                    name: this.data.name
                }
                this._apis.client.sendCard(params).then((response) => {
                    this.visible = false;
                    this.btnLoading = false;
                    this.$notify({
                        title: '成功',
                        message: '发卡成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$notify.info({
                        title: '提示',
                        message: error
                    });
                })
            }else{
                this.btnLoading = false;
                this.$notify.info({
                    title: '提示',
                    message: '请选择标签'
                });
            }
        },
        getLabels() {
            let params = { tagType: null }
            this._apis.client.getLabels(params).then((response) => {
                this.tags = [].concat(response);
            }).catch((error) => {
                console.log(error);
            })
        },
        handleChange() {
            this.labels = this.checkList.join(',');
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
        this.checkList = [];
        this.getLabels();
    },
    create() {
        
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
/deep/ .el-checkbox{
    margin: 0 10px 10px 0;
}
.user_id{
    text-align: left;
    padding: 0 0 10px 15px;
}
.c_label{
    width: 70px;
}
.tags_container{
    width: 464px;
}
.check_container{
    text-align: left;
    padding-left: 100px;
}
.red{
    color: #F55858;
    margin-top: 15px;
}
.dialog-footer{
    margin-top: 20px;
}
</style>


