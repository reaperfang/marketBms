<template>
    <div>
        <DialogBase :visible.sync="visible" :title="title" width="659px" :showFooter="showFooter">
            <el-form :model="basicForm" :rules="basicRules" ref="basicForm" label-width="100px" size="small">
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
                <template v-if="data.level == 0">
                    <el-form-item label="分类名称：" prop="name">
                        <el-input placeholder="请输入分类名称" class="formInput" v-model="basicForm.name"></el-input>
                        <span class="description">仅支持展示最多10个字的文本标签</span>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="分类名称：" prop="name23">
                        <el-input placeholder="请输入分类名称" class="formInput" v-model="basicForm.name23"></el-input>
                        <span class="description">仅支持展示最多10个字的文本标签</span>
                    </el-form-item>
                </template>
                <el-form-item label="状态：" prop="enable" class="enable">
                    <el-radio v-model="basicForm.enable" :label="1">启用</el-radio>
                    <el-radio v-model="basicForm.enable" :label="0">禁用</el-radio>
                </el-form-item>
                <el-form-item label="排序：" prop="sort" class="sort">
                    <el-input maxlength="6" class="formInput" v-model="basicForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="分类描述：" prop="description" class="description">
                    <el-input
                        type="textarea"
                        :rows="5"
                        placeholder="请输入内容"
                        v-model="basicForm.description"
                        maxlength="100"
                        show-word-limit>
                    </el-input>
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
import DialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index'

export default {
    data() {
        var sortValidator = (rule, value, callback) => {
            // console.log(this.basicForm.sort)
            if(!/^\d{1,6}$/.test(this.basicForm.sort)) {
                callback(new Error('请输入正确的格式'));
            } else {
                callback();
            }
        };
        return {
            parentId:' ',
            showFooter: false,
            basicForm: {
                name:'',  // 分类名称
                name23: '',
                level: 1, // 分类级别
                enable: 1, // 状态
                sort: 0, // 分类顺序
                parentId: 0, // 分类父ID
                imageUrl:'', // 分类图片
                image: '',
                description: ''
            },
            basicRules:{
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { max: 10, message: '最多支持10个字符', trigger: 'blur' }
                ],
                name23: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { max: 10, message: '最多支持10个字符', trigger: 'blur' }
                ],
                enable: [
                    { required: true, message: '请选择状态', trigger: 'blur' },
                ],
                sort: [
                    { validator: sortValidator, trigger: 'blur' },
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
                // console.log(res)
                if(this.data.level == 0) {
                    this.basicForm.name = res.name
                } else {
                    this.basicForm.name23 = res.name
                }
                this.basicForm.enable = res.enable
                this.basicForm.sort = res.sort
                this.basicForm.image = res.image
                this.basicForm.description = res.description
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
                    if(this.basicForm.sort < 0) {
                        this.$message({
                            message: '排序值不能小于0',
                            type: 'warning'
                        });
                        return
                    }
                    let param = Object.assign({}, this.basicForm)

                    if(this.data.level == 0) {
                        if(/\s+/.test(this.basicForm.name)) {
                            this.$message({
                                message: '分类名称不能为空',
                                type: 'warning'
                            });
                            return
                        }
                    } else {
                        if(/\s+/.test(this.basicForm.name23)) {
                            this.$message({
                                message: '分类名称不能为空',
                                type: 'warning'
                            });
                            return
                        }
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
                        if(this.data.level != 0) {
                            param = Object.assign(param, {
                                name: param.name23
                            })
                        }
                        this._apis.goods.addCategory(param).then(res => {
                            this.$message({
                                message: '新增成功！',
                                type: 'success'
                            });
                            this.$emit('submit')
                            this.onSubmit()
                        }).catch(error => {
                            this.$message.error({
                                message: error,
                                type: 'error'
                            });
                        })
                    } else {
                        let param = Object.assign({}, this.basicForm, {id: this.data.id, parentId: this.data.parentId})
                        if(this.data.level != 0) {
                            param = Object.assign(param, {
                                name: param.name23
                            })
                        }

                        delete param.parentId

                        this._apis.goods.editorCategory(param).then(res => {
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });
                            this.$emit('submit')
                            this.onSubmit()
                        }).catch(error => {
                            this.$message.error({
                                message: error,
                                type: 'error'
                            });
                        })
                    }
                    this.visible = false
                } else {
                    console.error('error submit!!');
                    return false;
                }
            });
        },
        getCategoryDetail(id) {
            return  new Promise((resolve, reject) => {
                this._apis.goods.getCategoryDetail({id}).then(res => {
                    resolve(res)
                }).catch(error => {
                    console.error(error);
                    reject(error);
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
                    return '新建一级分类'
                } else if(this.data.level == 1) {
                    // 新增二级分类
                    return '新建二级分类'
                } else if(this.data.level == 2) {
                    // 新增三级分类
                    return '新建三级分类'
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
        // margin-bottom: 40px;
    }
    /deep/ .el-form .el-form-item {
        &.enable {
            float: left;
        }
        &.sort {
            float: right;
        }
        &.description {
            clear: both;
        }
        .el-form-item__label {
            text-align: left;
            &:before {
                margin-right: 10px;
            }
        }
    }
    /deep/ .el-dialog__body {
        padding: 25px 31px;
    }
    /deep/ .el-form {
        .el-form-item.sort {
            .el-form-item__label {
                width: 74px!important;
            }
            .el-form-item__content {
                margin-left: 74px!important;
            }
        }
    }
</style>


