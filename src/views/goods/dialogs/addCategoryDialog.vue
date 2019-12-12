<template>
    <div>
        <DialogBase :visible.sync="visible" :title="title" width="659px" :showFooter="showFooter">
            <el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="140px" size="small">
                <!-- <el-form-item label="分类名称：" prop="parentId">
                    <el-select placeholder="请选择上级分类" class="formInput" v-model="basicForm.parentId">
                        <el-option label="顶级栏目" value="0" style="paddingLeft:1em"></el-option>
                            <el-option
                                v-for="item in data.flatArr"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                :style="{paddingLeft:`${item.floor*1.2}em`}"
                            ></el-option>
                    </el-select>
                </el-form-item> -->
                <template v-if="data.add && data.level === 1">
                    <el-form-item label="上级分类：">
                        <span>第一级：{{data.name}}</span>
                    </el-form-item>
                </template>
                <template v-else-if="data.add && data.level === 2">
                    <el-form-item label="上级分类：">
                        <span>第一级：{{level1Title}}</span>
                        <span style="margin-left: 20px;">第二级：{{data.name}}</span>
                    </el-form-item>
                </template>
                <el-form-item label="分类名称：" prop="name">
                    <el-input placeholder="请输入分类名称" class="formInput" v-model="basicForm.name"></el-input>
                    <span class="description">仅支持展示最多5个字的文本标签</span>
                </el-form-item>
                <el-form-item label="状态：" prop="enable">
                    <el-radio v-model="basicForm.enable" :label="1">启用</el-radio>
                    <el-radio v-model="basicForm.enable" :label="0">禁用</el-radio>
                </el-form-item>
                <el-form-item label="排序：" prop="sort">
                    <el-input class="formInput" v-model="basicForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="分类图片：" prop="image">
                    <ul class="upload-ul">
                        <li @click="currentDialog = 'DialogSelectImageMaterial'; libraryVisible = true" class="upload">
                            <i class="el-icon-plus"><br /><span>上传图片</span></i>
                        </li>
                        <li v-if="imageVisible" class="image">
                            <div :style="{backgroundImage: `url(${basicForm.image})`}" class="image-div"></div>
                            <i @click="deleteImage" class="el-icon-error"></i>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <div class="footer">
                <el-button @click="submitCategory('basicForm')" type="primary">确认</el-button>
                <el-button @click="visible = false">取消</el-button>
            </div>
        </DialogBase>
        <component :is="currentDialog" :dialogVisible.sync="libraryVisible" @imageSelected="imageSelected"></component>
    </div>
</template>
<script>
import DialogBase from '@/components/DialogBase'
import LibraryDialog from '@/views/goods/dialogs/libraryDialog'
import DialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial'

export default {
    data() {
        return {
            parentId:' ',
            showFooter: false,
            basicForm: {
                name:'',  // 分类名称
                level: 1, // 分类级别
                enable: 1, // 状态
                sort: 0, // 分类顺序
                parentId: 0, // 分类父ID
                imageUrl:'', // 分类图片
                image: ''
            },
            basicRules:{
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { max: 5, message: '最多支持5个字符', trigger: 'blur' }
                ],
                enable: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ],
                sort: [
                    { required: true, message: '请输入分类排序', trigger: 'blur' },
                ],
                image: [
                    { required: true, message: '请上传分类图片', trigger: 'blur' },
                ],
            },
            categoryData: [],
            currentDialog: '',
            libraryVisible: false,
            level1Title: '',
            imageVisible: false
        }
    },
    created() {
        if(this.data.editor) {
            this.getCategoryDetail(this.data.id).then(res => {
                console.log(res)
                this.basicForm.name = res.name
                this.basicForm.enable = res.enable
                this.basicForm.sort = res.sort
                this.basicForm.image = res.image
                if(res.image) {
                    this.imageVisible = true
                }
                
            })
        }
        if(this.data.add) {
            if(this.data.level == 2) {
                this.getCategoryDetail(this.data.parentId).then(res => {
                    this.level1Title = res.name
                })
            }
        }
    },
    methods: {
        deleteImage() {
            this.basicForm.image =  ''
            this.imageVisible = false
        },
        imageSelected(image) {
            this.basicForm.image = decodeURIComponent(image.filePath)
            this.imageVisible = true
        },
        submitCategory(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let param = Object.assign({}, this.basicForm)

                    if(/\s+/.test(this.basicForm.name)) {
                        this.$message({
                            message: '分类名称不能为空',
                            type: 'warning'
                        });
                        return
                    }

                    if(this.data.add) {
                        // 新增
                        if(this.data.level === 0) { 
                            // 新增一级分类
                            param = Object.assign(param, {level: 1})
                        } else if(this.data.level == 1) {
                            // 新增二级分类
                            param = Object.assign(param, {level: 2, parentId: this.data.id})
                        } else if(this.data.level == 2) {
                            // 新增三级分类
                            param = Object.assign(param, {level: 3, parentId: this.data.id})
                        }

                        this._apis.goods.addCategory(param).then(res => {
                            this.$notify({
                                title: '成功',
                                message: '新增成功！',
                                type: 'success'
                            });
                            this.$emit('submit')
                            this.onSubmit()
                        }).catch(error => {
                            this.$notify.error({
                                title: '错误',
                                message: error
                            });
                        })
                    } else {
                        let param = Object.assign({}, this.basicForm, {id: this.data.id, parentId: this.data.parentId})

                        delete param.parentId

                        this._apis.goods.editorCategory(param).then(res => {
                            this.$notify({
                                title: '成功',
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.$emit('submit')
                            this.onSubmit()
                        }).catch(error => {
                            this.$notify.error({
                                title: '错误',
                                message: error
                            });
                        })
                    }
                    this.visible = false
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getCategoryDetail(id) {
            return  new Promise((resolve, reject) => {
                this._apis.goods.getCategoryDetail({id}).then(res => {
                    resolve(res)
                })
            })
        },
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
        title() {
            if(this.data.add) {
                // 新增
                if(this.data.level === 0) { 
                    // 新增一级分类
                    return '新增一级分类'
                } else if(this.data.level == 1) {
                    // 新增二级分类
                    return '新增二级分类'
                } else if(this.data.level == 2) {
                    // 新增三级分类
                    return '新增三级分类'
                }
            } else {
                return '修改分类'
            }
        }
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
        add: {
            type: Boolean,
            required: true
        },
        onSubmit: {
            type: Function
        }
    },
    components: {
        DialogBase,
        LibraryDialog,
        DialogSelectImageMaterial
    }
}
</script>
<style lang="scss" scoped>
    .el-icon-warning {
        font-size: 60px;
        color: rgb(245, 88, 88);
    }
    .content-text {
        font-size: 18px;
        margin-top: 20px;
    }
    /deep/ .el-input {
        width: auto;
        margin-right: 12px;
    }
    .upload-ul {
        li {
            float: left;
            width: 60px;
            height: 60px;
            margin-right: 11px;
            &.upload {
                border: 1px dashed #d0d6e4;
                border-radius: 5px;
                text-align: center;
                box-sizing: border-box;
                padding-top: 14px;
                cursor: pointer;
                span {
                    font-size: 10px;
                    color: #D0D6E4;
                }

            }
            &.image {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                .image-div {
                    width: 60px;
                    height: 60px;
                    background-size: 100%;
                    background-repeat: no-repeat;
                    background-position: center;
                }
                .el-icon-error {
                    position: absolute;
                    right: -5px;
                    top: -5px;
                    color: rgb(253, 76, 43);
                    cursor: pointer;
                }
            }
        }
    }
    .footer {
        text-align: center;
        margin-top: 60px;
        margin-bottom: 40px;
    }
</style>


