<template>
    <div class="c_container">
        <p class="c_title">批量导入：</p>
        <div class="c_top">
            <div class="form_container">
                <el-form ref="ruleForm" :rules="rules" :model="ruleForm">
                    <el-form-item label="所属渠道：" prop="channelId">
                        <div class="input_wrap">
                            <el-select v-model="ruleForm.channelId" placeholder="选择渠道" clearable>
                                <el-option
                                    v-for="item in channelOptions"
                                    :key="item.id"
                                    :label="item.channerlName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <span class="addMainColor pointer marL10" @click="handleNew">新建</span>
                    </el-form-item>
                    <!-- <el-form-item label="身份：" prop="memberType">
                        <div class="input_wrap">
                            <el-radio v-model="ruleForm.memberType" label="1">会员</el-radio>
                            <el-radio v-model="ruleForm.memberType" label="0">非会员</el-radio>
                        </div>
                    </el-form-item> -->
                    <el-form-item label="上传文件：" style="margin-left:9px">
                        <div class="input_wrap marL">
                            <el-upload
                                class="upload-block"
                                ref="upload"
                                :action="uploadUrl"
                                :on-success="handleAvatarSuccess"
                                :on-remove="handleRemove"
                                :before-upload="beforeAvatarUpload"
                                :limit="1"
                                :data="{json: JSON.stringify({cid: cid})}"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">导入规则：请先下载导入模板，在模板中按要求填写用户信息，然后上传该文件</div>
                            </el-upload>
                            <el-button class="download_btn" @click="handleDownload">下载导入模板</el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
            <div class="btn_container btns">
                <el-button type="primary" @click="importMemberFile">导入</el-button>
                <el-button class="marL5" @click="cancel">取消</el-button>
            </div>
        </div>
        <div class="table_container clearfix">
            <p class="c_title">导入记录：</p>
            <div class="fr marR">
                <span>导入时间：</span>
                <el-date-picker
                    v-model="importTime"
                    class="marL2"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="utils.globalTimePickerOption.call(this)"
                >
                </el-date-picker>
                <span class="marL20">渠道：</span>
                <el-select v-model="channelId2" placeholder="选择渠道" clearable>
                    <el-option
                        v-for="item in channelOptions"
                        :key="item.id"
                        :label="item.channerlName"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-button type="primary" class="marL20" @click="handleCheck">查 询</el-button>
                <el-button @click="handleReset">重 置</el-button>
            </div>
            <ciTable style="margin-top: 68px" :params="params"></ciTable>
        </div>
        <component :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="currentData" @refreshPage="refreshPage"></component>
    </div>
</template>
<script type="es6">
import utils from "@/utils";
import Blob from '@/assets/js/excel/Blob'
import Export2Excel from '@/assets/js/excel/Export2Excel.js'
import ciTable from './components/clientImport/ciTable';
import addChannelDialog from './dialogs/clientImport/addChannelDialog';
export default {
    components: { ciTable, addChannelDialog },
    name: 'clientImport',
    data() {
        return {
            uploadUrl: `${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
            ruleForm: {
                channelId:""
            },
            rules: {
                channelId: [
                    { required: true, message: "请选择渠道", trigger:'blur' }
                ]
            },
            channelName:"",
            //上传参数
            fileList: [],
            //查询导入记录所需要的参数：
            importTime: '',
            channelId2:"",
            channelOptions:[],
            params: {},
            //dialog所需
            currentDialog: "",
            dialogVisible: false,
            currentData: {}
        }
    },
    methods: {
        handleReset() {
            this.importTime = "";
            this.channelId2 = "";
        }, 
        handleDownload() {
            window.location.href = `${process.env.DATA_API}/web-file/0/excel/2e9d1/用户导入模板.xlsx?random=${new Date().getTime()}`;
        },
        refreshPage() {
            this.getChannels();
        },
        handleAvatarSuccess(res, file) {
            this.importUrl = res.data.url;
        },
        beforeAvatarUpload(file) {
            //const isCSV = file.type.indexOf('ms-excel') !== -1 || file.type.indexOf('sheet') !== -1;
            const isLt10M = file.size / 1024 / 1024 < 10;

            // if (!isCSV) {
            //     this.$message.error('上传模板只能是 .csv或.xsl 格式!');
            // }
            if (!isLt10M) {
                this.$message.error("上传模板大小不能超过 10MB!");
            }
            return isLt10M ;
        },
        handleRemove(file) {
            this.importUrl = "";
        },
        handleCheck() {
            let params = {
                importTimeStart: !!this.importTime ? this.importTime[0] : "",
                importTimeEnd: !!this.importTime ? this.importTime[1] : "",
                channelId: this.channelId2
            }
            this.params = Object.assign({}, params);
        },
        //获取渠道下拉
        getChannels() {
            this._apis.client.getChannels({}).then((response) => {
                this.channelOptions = [].concat(response);
            }).catch((error) => {
                console.error(error);
            })
        },
        handleNew() {
            this.dialogVisible = true;
            this.currentDialog = "addChannelDialog"; 
        },
        importMemberFile() {
            if(this.ruleForm.channelId == "") {
                this.$message({
                    message: '请选择渠道',
                    type: 'warning'
                });
            }else if(!this.importUrl){
                this.$message({
                    message: '请上传文件',
                    type: 'warning'
                });
            }else{
                this.channelOptions.map((v) => {
                    if(v.id == this.ruleForm.channelId) {
                        this.channelName = v.channerlName
                    }
                })
                let params = {
                    channelId: this.ruleForm.channelId,
                    channelName: this.channelName,
                    importUrl: this.importUrl
                }
                this._apis.client.importMemberFile(params).then((response) => {
                    this.handleCheck();
                    this.$message({
                        message: '导入成功',
                        type: 'success'
                    });
                }).catch((error) => {
                    this.$message.error(error);
                })
            }
        },
        cancel() {
            this.$refs.ruleForm.resetFields();
            this.$refs.upload.clearFiles();
        }
    },
    computed: {
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        }
    },
    mounted() {
        this.getChannels();
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
/deep/.el-form-item__label{
    width: 100px;
}
/deep/ .el-upload{
    line-height: 0 !important;
    height: 30px !important;
}
/deep/ .el-upload__tip{
    font-size: 12px;
    color: #92929B;
}
/deep/ .el-upload-list__item{
    width: 300px !important;
}
/deep/ .el-date-editor .el-range-separator{
    width: 8%;
}
/deep/ .el-button+.el-button{
    margin-left: 8px;
}
.marL20{
    margin-left: 20px;
}
.marL10{
    margin-left: 7px;
}
.marL5{
    margin-left: 5px;
}
.marL2{
    margin-left: -2px;
}
.c_container{
    background-color: #fff;
    padding: 20px;
    .c_title{
        color: #3D434A;
        font-weight: 600;
    }
    .c_top{
        padding-top: 17px;
        border-bottom: 1px dashed #D3D3D3;
        .form_container{
            margin-left: 20px;
            .input_wrap{
                position: relative;
                display: inline-block;
                width: 202px;
                .upload-block{
                    width: 500px;
                }
                .download_btn{
                    position: absolute;
                    right: 9px;
                    top: 0;
                }
            }
            .c_support{
                font-size: 12px;
                color: #92929B;
                margin-left: 100px;
            }
        }
        .btns{
            margin-left: 111px;
        }
    }
    .table_container{
        padding-top: 30px;
    }
}
</style>
