<template>
    <div class="import mh">
        <section class="header">
            <el-row type="flex" align="center">
                <el-col :span="12">
                    <div class="grid-content header-lefter">
                        <el-button @click="$router.push('/goods/addGoods')" type="primary">新建商品</el-button>
                        <!-- <el-button @click="$router.push('/goods/batchPriceChange')" class="border-button">批量改价</el-button> -->
                        <!-- <span class="import-records">导入记录</span> -->
                    </div>
                </el-col>
                <!-- <el-col :span="12">
                    <div class="grid-content header-righter">
                        <span @click="renovate" class="span-box pointer"><span>刷新</span><i></i></span>
                    </div>
                </el-col> -->
            </el-row>
            <el-steps class="steps" :space="234" :active="active" finish-status="success">
                <el-step title="上传模板"></el-step>
                <el-step title="系统批量导入"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </section>
        <section class="importing">
            <p class="title">用Excel表格快速导入商品数据</p>
            <p>说明：</p>
            <ol class="step">
                <li>导入功能必须使用指定模板；</li>
                <li>在【商品导入模板】按规则添加商品数据信息；</li>
                <li>导入结果会在导入完成后提示，并在导入记录中展示； </li>
                <li>一次最多导入1000个SKU商品；</li>
                <li>模板中商品图片的链接需要先将所需图片上传至“我的文件-素材库”中，然后复制其图片地址链接；</li>
                <li>导入的商品默认状态全部为”上架“；正式导入前请您删除模板中的样例商品信息，否则将会被示为默认导入并上架。</li>
            </ol>
            <p class="import-box tc">
                <el-upload
                    v-show="showImport"
                    ref="upload"
                    :action="uploadUrl"
                    :limit="1"
                    list-type="picture-card"
                    :data="{json: JSON.stringify({cid: cid})}"
                    :on-success="success"
                    :show-file-list="showFileList"
                    class="p_imgsCon">
                    <i class="el-icon-plus"></i>
                    <p style="line-height: 21px; margin-top: -39px; color: #92929B;">上传文件</p>
                </el-upload>
                <el-button @click="importGoods" class="import-button" type="primary" :loading="importing">
                    <template v-if="importing">
                        导入中
                    </template>
                    <template v-else>
                        <i class="i-import"></i>批量导入商品
                    </template>
                </el-button>
            </p>
            <p class="download-box">导入规则：请先<a class="download" href="javascript:;" @click="downloadTemplate">下载商品导入模板</a>，在模板中按要求填写商品信息，然后上传该文件</p>
        </section>
        <section>
            <p class="records">导入记录</p>
            <el-table
                v-loading="loading"
                :data="tableData"
                :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
                style="width: 100%;margin-bottom: 10px;">
                <el-table-column
                    prop="number"
                    align="left"
                    header-align="left"
                    label="序号"
                    width="120"
                    fixed="left" 
                    class-name="table-padding"
                    >
                </el-table-column>
                <el-table-column
                    align="right"
                    header-align="right"
                    prop="importCount"
                    label="导入数量"
                    width="180">
                </el-table-column>
                <el-table-column
                    align="right"
                    prop="importSuccessCount"
                    header-align="right"
                    min-width="90"
                    label="导入成功数">
                </el-table-column>
                <el-table-column
                    align="right"
                    header-align="right"
                    prop="importFailCount"
                    min-width="90"
                    label="导入失败数">
                </el-table-column>
                <el-table-column
                    align="center"
                    header-align="center"
                    prop="createUserName"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    align="center"
                    header-align="center"
                    prop="createTime"
                    label="导入时间"
                    fixed="right"
                    width="200"
                    class-name="table-padding">
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </section>
        <div v-if="importing" class="loadding-box">
            <div class="loadding-icon"></div>
        </div>
    </div>
</template>
<script>
import Pagination from '@/components/Pagination'

export default {
    data() {
        return {
            active: 1,
            tableData: [

            ],
            total: 0,
            listQuery: {
                startIndex: 1,
                pageSize: 20,
            },
            uploadUrl: `${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
            url: '',
            showFileList: false,
            loading: false,
            showImport: true,
            importing: false,
        }
    },
    computed:{
        cid(){
            let shopInfo = this.$store.getters.shopInfos
            return shopInfo.id
        }
    },
    created() {
        this.getList()
    },
    methods: {
        downloadTemplate() {
          window.location.href = location.protocol + '//' + location.host + `/bp/static/template/${encodeURIComponent('商品导入模板')}.xlsx`
        },
        renovate() {
            this.getList()
        },
        success(response, file, fileList){
            if(file.status == "success"){
                this.$message.success(response.msg);
                this.url = response.data.url;
                this.active = 2
            }else{
                this.$message.error(response.msg);
            }
        },
        getList(param) {
            this.loading = true
            let _param
            
            _param = Object.assign({}, this.listQuery, param)

            this._apis.goods.getImportPageList(_param).then((res) => {
                this.total = +res.total
                res.list.forEach((val, index) => {
                    val.number = index
                })
                this.tableData = res.list
                this.loading = false
            }).catch(error => {
                console.error(error)
                this.loading = false
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
            })
        },
        importGoods() {
            // let message = this.$message({
            // showClose: true,
            // message: '导入中...',
            // duration: 0
            // });
            if(!this.url) {
                this.$message({
                    message: '请先上传文件',
                    type: 'warning'
                });
                return
            }
            this.showImport = false
            this.importing = true

            this._apis.goods.importGoods({cid: this.cid, importUrl: this.url}).then((res) => {
                this.url = res.url
                let _text = ''

                //message.close()
                this.getList()

                if(res.importFailCount == 0) {
                    _text = `累计导入共${res.importCount}条数据； 成功导入${res.importSuccessCount}条； 失败${res.importFailCount}条。`

                    this.confirm({text: _text, customClass: 'import-confirm'})
                    this.active = 3
                } else {
                    _text = ''
                    _text = `累计导入共${res.importCount}条数据； 成功导入${res.importSuccessCount}条； 失败${res.importFailCount}条。`
                    _text += '<br>' + res.failureMsg
                    this.confirm({icon: true, text: _text, showCancelButton: false, customClass: 'import-confirm'})
                    this.active = 1
                }
                this.$refs.upload.clearFiles();
                this.showImport = true
                this.importing = false
            }).catch(error => {
                //message.close()
                this.visible = false
                // this.$message.error({
                //     message: error,
                //     type: 'error'
                // });
                this.confirm({text: error, showCancelButton: false})
                this.active = 1
                this.$refs.upload.clearFiles();
                this.showImport = true
                this.importing = false
            })
        },
        next() {
            if (this.active++ > 2) this.active = 0;
        }
    },
    components: {
        Pagination
    }
}
</script>
<style lang="scss" scoped>
    .import {
        position: relative;
        background-color: #fff;
        padding: 20px;
        font-size: 14px;
        border-radius: 4px;
        section {
            // border-bottom: 1px dashed #d3d3d3;
            // padding-top: 15px;
            padding-bottom: 0px;
        }
        .header {
            .header-righter {
                text-align: right;
                .span-box {
                    display: inline-flex;
                    align-items: center;
                    padding: 7px 13px;
                    background:rgb(234, 249, 242);
                    color: rgb(178, 230, 209);
                    i {
                        display: inline-block;
                        width: 16px;
                        height: 16px;
                        background: url(../../assets/images/goods/renovate.png) no-repeat;
                        margin-left: 4px;
                    }
                }
            }
            .steps {
                margin-top: 36px;
                margin-left: 12px;
            }
        }
        .importing {
            color: rgb(93, 93, 99);
            margin-top: 15px;
            p.title {
                font-size:14px;
                color:#44434B;
                font-weight: bold;
                padding-bottom: 10px;
                padding-top: 20px;
            }
            p:nth-child(2) {
                margin-top: 5px;
            }
            .step {
                list-style-type:none;counter-reset:sectioncounter;
                li {
                    padding: 5px 0;
                }
                li:before {
                    content:counter(sectioncounter) "、"; 
                    counter-increment:sectioncounter;
                }
            }
            /deep/ .import-button {
                margin-top: 10px;
                span {
                    display: inline-flex;
                    align-items: center;
                }
                .i-import {
                    display: inline-block;
                    width: 18px;
                    height: 16px;
                    background: url(../../assets/images/goods/import.png) no-repeat;
                    margin-right: 5px;
                }
            }
            .import-box {
                margin-top: 21px;
            }
            .download-box {
                margin-top: 10px;
                text-align: center;
                .download {
                    color: rgb(119, 113, 255);
                }
            }
        }
        .loadding-box {
            position: absolute;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 400px;
            background-color: rgba(255, 255, 255, 0.9);
            .loadding-icon {
                width: 100px;
                height: 100px;
                background: url('../../assets/images/goods/pastedImage.gif') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
    /deep/ .el-step__head.is-process {
        color: $contentColor;
        font-weight: normal;
            border-color: $contentColor;
    }
    /deep/ .el-step__title.is-process {
        color: $contentColor;
        font-weight: normal;
    }
    .import-records {
        color: $globalMainColor;
        margin-left: 50px;
    }
    .records {
        color: #5d5d63;
        font-weight: bold;
        margin-bottom: 23px;
    }
    /deep/ .el-step__title {
        margin-top: 10px;
    }
    /deep/ .el-step:first-child {
        .el-step__title {
            margin-left: -13px;
        }
    }
    /deep/ .el-step:nth-child(2) {
        .el-step__title {
            margin-left: -27px;
        }
    }
    /deep/ .el-step:nth-child(3) {
        .el-step__title {
            margin-left: 4px;
        }
    }
    /deep/ .el-button--primary {
        background-color: #655eff;
    }
    /deep/ .el-message-box__message {
        max-height: 400px!important;
        overflow-y: scroll!important;
    }
    /deep/ .el-message-box__message::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    /deep/ .el-message-box__message::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
</style>
<style lang="scss">
    .import-confirm .el-message-box__message {
        max-height: 400px!important;
        overflow-y: scroll!important;
    }
    .import-confirm .el-message-box__message::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .import-confirm .el-message-box__message::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
</style>


