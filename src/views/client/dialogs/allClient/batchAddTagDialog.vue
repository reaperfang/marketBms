<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="批量加标签" :hasCancel="hasCancel" :showFooter="false">
        <div class="c_container">
            <p class="c_info">当前选中共{{data.checkedItem.length}}个客户，批量添加以下标签：</p>
            <el-checkbox-group
                v-model="checkedItems"
                :max="5">
                <el-checkbox v-for="tag in tagNames" :label="tag" :key="tag">{{tag}}</el-checkbox>
            </el-checkbox-group>
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
import clientApi from '@/api/client';
import DialogBase from '@/components/DialogBase'
export default {
    props: ['data'],
    name: "batchAddTagDialog",
    data() {
        return {
            hasCancel: true,
            checkedItems:[],
            tagList:[]
        }
    },
    methods: {
        submit() {
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
            let memberInfoIds = [];
            this.data.checkedItem.map((v) => {
                memberInfoIds.push(v.id);
            });
            memberInfoIds = memberInfoIds.join(',');
            if(memberLabelInfoIds.length > 0) {
                this._apis.client.batchMarkLabel({memberInfoIds,memberLabelInfoIds}).then((response) => {
                    this.visible = false;
                    this.$notify({
                        title: '成功',
                        message: '批量打标签成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    this.visible = false;
                    console.log(error);
                })
            }else{
                this.$notify({
                    title: '警告',
                    message: '请选择标签',
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
    .c_info{
        text-align: left;
        font-size: 18px;
        margin-bottom: 20px;
    }
}
.dialog-footer{
    margin-top: 20px;
}
</style>


