<template>
    <div class="sensitive-words">
        <div class="title">
            <div class="row">
                <div class="col words-label">敏感词设置</div>
                <div class="col des">说明：设定敏感词后，评论内容包含敏感词相对应的内容时会显示星号“*”代替。</div>
            </div>
        </div>
        <div class="content">
            <section>
                <div class="content-title">
                    <div class="row">
                        <div class="col">自定义敏感词</div>
                        <div @click="currentDialog = 'AddSensitiveWordsDialog'; dialogVisible = true" class="col add">+添加</div>
                    </div>
                </div>
                <div class="content-sensitive">
                    <span v-for="(item, index) in sensitiveList" :key="index">
                        {{item.name}}, <span @click="deleteSensitive(item)" class="delete pointer">删除</span>
                    </span>
                </div>  
            </section>
            <section>
                <div class="content-title">
                    系统敏感词库
                </div>
                <div class="content-sensitive">
                    <span v-for="(item, index) in systomSensitiveList" :key="index">
                        {{item}},
                    </span>
                </div>  
            </section>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="onSubmit"></component>
    </div>
</template>
<script>
import AddSensitiveWordsDialog from '@/views/order/dialogs/addSensitiveWordsDialog'

export default {
    data() {
        return {
            sensitiveList: [

            ],
            systomSensitiveList: [

            ],
            currentDialog: '',
            dialogVisible: false
        }
    },
    created() {
        this.getList()
        this.getPublicList()
    },
    methods: {
        deleteSensitive(item) {
            this.confirm({title: '提示', icon: true, text: '是否确认删除'}).then(() => {
                this._apis.order.deleteSensitiveWord({id: item.id}).then((res) => {
                this.getList()
                this.visible = false
                this.$notify({
                    title: '成功',
                    message: '删除成功！',
                    type: 'success'
                });
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
            })
        },
        onSubmit(words) {
            words = words.replace(/^\s+|\s+$/g, '')
            let wordsArr = words.split(/\s*,\s*/)

            this._apis.order.addSensitiveWord({names: wordsArr.join(',')}).then((res) => {
                this.getList()
                this.visible = false
                if(!res.length) {
                    this.$notify({
                    title: '成功',
                    message: '添加成功！',
                    type: 'success'
                });
                } else {
                    this.$notify({
                    title: '消息',
                    message: '敏感词重复！',
                    type: 'warning'
                });
                }
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
        getList(param) {
            //this.listLoading = true

            this._apis.order.getSensitiveWordList().then((res) => {
                console.log(res)
                this.sensitiveList = res
            }).catch(error => {
                //this.listLoading = false
            })
        },
        getPublicList(param) {
            this._apis.goodsOperate.fetchPublicSensitiveList().then((res) => {
                this.systomSensitiveList = res
                this.visible = false
            }).catch(error => {
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            })
        },
    },
    components: {
        AddSensitiveWordsDialog
    }
}
</script>
<style lang="scss" scoped>
    .sensitive-words {
        background-color: #fff;
        padding: 20px;
        .title {
            .words-label {
                font-size: 16px;
                margin-right: 20px;
            }
            .des {
                color: #9FA29F;
            }
        }
        .content {
            padding-left: 60px;
            section {
                margin-top: 30px;
                .content-title {
                    font-size: 16px;
                    margin-bottom: 20px;
                    .add {
                        font-size: 14px;
                        margin-left: 20px;
                        color: $globalMainColor;
                        cursor: pointer;
                    }
                }
                .content-sensitive {
                    border:1px solid rgba(202,207,203,1);
                    border-radius:4px;
                    padding: 10px;
                    color: #44434B;
                    min-height: 200px;
                    >span {
                        margin-right: 40px;
                    }
                    .delete {
                        color: $globalMainColor;
                        margin-left: 3px;
                    }
                }
            }
        }
    }
</style>

