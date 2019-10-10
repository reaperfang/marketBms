<template>
    <div class="import">
        <section class="header">
            <el-row type="flex" align="center">
                <el-col :span="12">
                    <div class="grid-content header-lefter">
                        <el-button @click="$router.push('/goods/addGoods')" type="primary">新建商品</el-button>
                        <el-button @click="$router.push('/goods/batchPriceChange')" class="border-button">批量改价</el-button>
                        <span class="import-records">导入记录</span>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content header-righter">
                        <span @click="renovate" class="span-box pointer"><span>刷新</span><i></i></span>
                    </div>
                </el-col>
            </el-row>
            <el-steps class="steps" :space="234" :active="active" finish-status="success">
                <el-step title="上传模板"></el-step>
                <el-step title="系统批量导入"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
        </section>
        <section class="importing">
            <p>用Excel表格快速导入商品数据</p>
            <p>说明：</p>
            <ol class="step">
                <li>导入功能必须使用指定模板；</li>
                <li>在【商品导入模板】按规则添加商品数据信息；</li>
                <li>导入结果会在导入完成后提示，并在导入记录中展示； </li>
                <li>一次最多导入1000个SKU商品；</li>
            </ol>
            <p class="import-box tc">
                <el-upload
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
                <el-button @click="importGoods" class="import-button" type="primary"><i></i>批量导入商品</el-button>
            </p>
            <p class="download-box">导入规则：请先<a class="download" href="javascript:;" @click="downloadTemplate">下载商品导入模板</a>，在模板中按要求填写商品信息，然后上传该文件</p>
        </section>
        <section>
            <p class="records">导入记录</p>
            <el-table
                v-loading="loading"
                :data="tableData"
                :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                style="width: 100%">
                <el-table-column
                    prop="number"
                    label="序号"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="importCount"
                    label="导入数量"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="importSuccessCount"
                    label="导入成功数">
                </el-table-column>
                <el-table-column
                    prop="importFailCount"
                    label="导入失败数">
                </el-table-column>
                <el-table-column
                    prop="createUserName"
                    label="操作人">
                </el-table-column>
                <el-table-column
                    prop="createTime"
                    label="导入时间">
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
        </section>
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
            uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
            url: '',
            showFileList: false,
            loading: false,
        }
    },
    computed:{
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        }
    },
    created() {
        this.getList()
    },
    methods: {
        downloadTemplate() {
            let a = document.createElement("a");

            a.setAttribute("href", location.protocol + '//' + location.host + `/bp/static/template/${encodeURIComponent('商品导入模版')}.xls`);
            a.setAttribute("target", "_blank");
            a.click();
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
                this.loading = false
                // this.$notify.error({
                //     title: '错误',
                //     message: error
                // });
            })
        },
        importGoods() {
            let message = this.$message({
            showClose: true,
            message: '不能重复操作，上传文件批量导入文件。',
            duration: 0
            });

            this._apis.goods.importGoods({cid: this.cid, importUrl: this.url}).then((res) => {
                this.url = res.url
                let _text = ''

                message.close()
                this.getList()

                if(res.importFailCount == 0) {
                    _text = `累计导入共${res.importCount}条数据； 成功导入${res.importSuccessCount}条； 失败${res.importFailCount}条。`

                    this.confirm({title: '数据导入成功', text: _text})
                } else {
                    _text = ''
                    _text = `累计导入共${res.importCount}条数据； 成功导入${res.importSuccessCount}条； 失败${res.importFailCount}条。`
                    _text += '<br>' + res.failureMsg
                    this.confirm({title: '数据导入失败', text: _text})
                }
            }).catch(error => {
                message.close()
                this.visible = false
                this.$notify.error({
                    title: '错误',
                    message: error
                });
                this.active = 1
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
        background-color: #fff;
        padding: 32px 63px;
        section {
            border-bottom: 1px dashed #d3d3d3;
            padding-top: 15px;
            padding-bottom: 22px;
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
                margin-top: 32px;
            }
        }
        .importing {
            color: rgb(93, 93, 99);
            margin-top: 15px;
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
                i {
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
        color: $globalMainColor;
        margin-bottom: 23px;
    }
</style>


