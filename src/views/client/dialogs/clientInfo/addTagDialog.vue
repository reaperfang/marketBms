<template>
    <DialogBase :visible.sync="visible" @submit="submit" title="加标签" :hasCancel="hasCancel">
        <div class="c_container">
            <el-checkbox-group
                v-model="checkedItems"
                :max="5">
                <el-checkbox v-for="tag in tagNames" :label="tag" :key="tag" :disabled="data.selectedNames.indexOf(tag) !== -1">{{tag}}</el-checkbox>
            </el-checkbox-group>
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
            checkedItems:[]
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
            let params = {
                memberInfoId:this.data.id, 
                memberLabelInfoIds: memberLabelInfoIds
            }
            if(params.memberLabelInfoIds.length > 0) {
                this._apis.client.markLabel(params).then((response) => {
                    this.$notify({
                        title: '成功',
                        message: '打标签成功',
                        type: 'success'
                    });
                    this.$emit('refreshPage');
                }).catch((error) => {
                    console.log(error);
                }) 
            }else{
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
        this.$nextTick(() => {
            this.checkedItems = [];
        });
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
</style>


