<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="加标签" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <el-checkbox-group
                v-model="checkedItems"
                :max="5">
                <el-checkbox v-for="tag in tagNames" :label="tag" :key="tag">{{tag}}</el-checkbox>
            </el-checkbox-group>
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
            tagList: [],
            checkedItems:[],
            btnLoading: false
        }
    },
    methods: {
        submit() {
            this.btnLoading = true;
            let memberLabelInfoIds = [];
            if(this.checkedItems.length > 0) {
                this.tagList.map((item) => {
                    this.checkedItems.map((v) => {
                        if(v == item.tagName) {
                            memberLabelInfoIds.push(item.id);
                        }
                    })
                });
            }
            memberLabelInfoIds = memberLabelInfoIds.join(',');
            let params = {
                memberInfoId:this.data.id, 
                memberLabelInfoIds: memberLabelInfoIds
            }
            if(params.memberLabelInfoIds.length > 0) {
                this._apis.client.markLabel(params).then((response) => {
                    this.btnLoading = false;
                    this.visible = false;
                    this.$notify({
                        title: '成功',
                        message: '打标签成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    this.btnLoading = false;
                    this.visible = false;
                    console.log(error);
                }) 
            }else{
                this.btnLoading = false;
                this.$notify({
                    title: '警告',
                    message: '请选择要添加的标签',
                    type: 'warning'
                });
            }
        },
        getLabels() {
            this._apis.client.getLabels({tagType:0}).then((response) => {
                this.tagList = [].concat(response); 
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
        },
        tagNames() {
            let arr = [];
            this.tagList.map((item) => {
                arr.push(item.tagName)
            })
            return arr;
        }
    },
    mounted() {
        this.getLabels();
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
/deep/ .el-checkbox-group{
    text-align: left;
}
/deep/ .el-checkbox{
    margin: 0 10px 9px 0;
}
.c_container{
    padding: 0 30px;
}
.dialog-footer{
    margin-top: 20px;
}
</style>


