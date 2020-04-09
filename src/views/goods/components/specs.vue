<template>
    <div v-if="list.length" class="specs">
        <table :style="{width: (specsLabel.split(',').length*50 + 1350) + 'px'}" style="border-collapse: collapse;" border="1">
            <!-- <tr>
                <td rowspan="3">XLL</td>
                <td rowspan="2">红色</td>
                <td>移动</td>
            </tr>
            <tr>
                <td>联通</td>
                </tr>
            <tr>
                <td>绿色</td>
                <td>移动</td>
            </tr> -->
            <tr>
                <th width="50" v-for="(labelItem, labelIndex) in specsLabel.split(',')">
                    <span>{{labelItem}}</span>
                </th>
                <th class="image" width="150"><span>图片</span></th>
                <th class="costPrice" width="150"><span>成本价</span></th>
                <th class="salePrice" width="150"><span>售卖价</span></th>
                <th class="stock" width="150"><span>库存</span></th>
                <th class="warningStock" width="150"><span>库存预警</span></th>
                <th width="150"><span>重量</span></th>
                <th width="150"><span>体积</span></th>
                <th width="150"><span>SKU编码</span></th>
                <th width="150"><span>操作</span></th>
            </tr>
            <tr v-for="(item, index) in list">
                <!-- <td v-if="!item.大小_hide" :rowspan="item.大小_rowspan">{{item.大小}}</td>
                <td v-if="!item.颜色_hide" :rowspan="item.颜色_rowspan">{{item.颜色}}</td>
                <td>{{item.网络}}</td> -->
                <template v-for="(labelItem, labelIndex) in specsLabel.split(',')">
                    <td class="spec" width="100" v-if="!item[labelItem + '_hide']" :rowspan="item[labelItem + '_rowspan']">
                        {{item.label.split(',') && item.label.split(',')[labelIndex]}}
                    </td>
                </template>
                <td v-if="!item['image_hide']" :rowspan="item['image_rowspan']">
                    <el-upload
                        :disabled="!productCategoryInfoId"
                        class="upload-spec"
                        :action="uploadUrl"
                        :ref="`uploadImage_${index}`"
                        list-type="picture-card"
                        :file-list="item.fileList"
                        :class="{hide:item.image}"
                        :limit="1"
                        :data="{json: JSON.stringify({cid: cid})}"
                        :on-preview="function() {
                            $emit('handlePictureCardPreview')
                        }"
                        :on-remove="function() {
                            $emit('specHandleRemove', index)
                        }"
                        :on-success="function(response, file, fileList) {
                            $emit('specUploadSuccess', response, file, fileList, index, item)
                        }">
                        <p v-if="!item.image">
                            <i class="el-icon-plus"></i>
                            点击上传
                        </p>
                    </el-upload>
                    <div class="upload-spec-ku" v-if="!item.image && productCategoryInfoId" style="cursor: pointer;"  @click="currentDialog = 'dialogSelectImageMaterial'; material = true; materialIndex = index; dialogVisible = true">素材库</div>
                </td>
                <td>
                    <el-input type="number" min="0" v-model="item.costPrice" placeholder="请输入价格(元)"></el-input>
                </td>
                <td>
                    <el-input type="number" min="0" :disabled="item.editorDisabled" v-model="item.salePrice" placeholder="请输入价格(元)"></el-input>
                </td>
                <td>
                    <el-input type="number" min="0" :disabled="item.editorDisabled" v-model="item.stock" placeholder="请输入库存"></el-input>
                </td>
                <td>
                    <el-input type="number" min="0" v-model="item.warningStock" placeholder="请输入库存预警"></el-input>
                </td>
                <td>
                    <el-input type="number" min="0" v-model="item.weight" placeholder="请输入重量(kg)"></el-input>
                </td>
                <td>
                    <el-input type="number" min="0" v-model="item.volume" placeholder="请输入体积(m³)"></el-input>
                </td>
                <td>
                    <el-input @blur="codeBlur(item.code, index)" :disabled="hideDelete" v-model="item.code" placeholder="请输入SKU编码"></el-input>
                    <!-- <p class="error-message" v-if="item.showCodeSpan">输入格式有误</p> -->
                </td>
                <td>
                    <div class="spec-operate">
                        <span @click="function() {
                            $emit('emptySpec', index)
                        }">清空</span>
                        <span v-if="!hideDelete" class="deleteSpan" @click="() => {
                            $emit('deleteSpec', index)
                        }">删除</span>
                    </div>
                </td>
            </tr>
        </table>
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
    </div>
</template>
<script>
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial'

export default {
    data() {
        return {
            list1: [
                {
                    大小: 'XLL',
                    颜色: '红色',
                    网络: '移动',
                    label: 'XLL,红色,移动',
                    specs: {
                        大小: 'XLL',
                        颜色: '红色',
                        网络: '移动'
                    },
                    //大小_rowspan: 3,
                    //颜色_rowspan: 2,
                    index: 0
                },
                {
                    大小: 'XLL',
                    颜色: '红色',
                    网络: '联通',
                    label: 'XLL,红色,联通',
                    specs: {
                        大小: 'XLL',
                        颜色: '红色',
                        网络: '联通'
                    },
                    // 大小_rowspan: 3,
                    // 颜色_rowspan: 2,
                    // 大小_hide: true,
                    // 颜色_hide: true,
                    index: 1
                },
                {
                    大小: 'XLL',
                    颜色: '绿色',
                    网络: '移动',
                    label: 'XLL,绿色,移动',
                    specs: {
                        大小: 'XLL',
                        颜色: '绿色',
                        网络: '移动'
                    },
                    // 大小_rowspan: 3,
                    // 大小_hide: true,
                    index: 2
                },
                {
                    大小: 'XL',
                    颜色: '红色',
                    网络: '移动',
                    label: 'XL,红色,移动',
                    specs: {
                        大小: 'XL',
                        颜色: '红色',
                        网络: '移动'
                    },
                    // 大小_rowspan: 3,
                    // 颜色_rowspan: 2,
                    index: 3
                },
                {
                    大小: 'XL',
                    颜色: '红色',
                    网络: '联通',
                    label: 'XL,红色,联通',
                    specs: {
                        大小: 'XL',
                        颜色: '红色',
                        网络: '联通'
                    },
                    // 大小_rowspan: 3,
                    // 颜色_rowspan: 2,
                    // 大小_hide: true,
                    // 颜色_hide: true,
                    index: 4
                },
                {
                    大小: 'XL',
                    颜色: '绿色',
                    网络: '移动',
                    label: 'XL,绿色,移动',
                    specs: {
                        大小: 'XL',
                        颜色: '绿色',
                        网络: '移动'
                    },
                    // 大小_rowspan: 3,
                    // 大小_hide: true,
                    index: 5
                },
            ],
            materialIndex: 0,
            material: false,
            currentDialog: '',
            dialogVisible: false,
        }
    },
    computed: {
        computedList() {
            let _list = JSON.parse(JSON.stringify(this.list))

            let computeRowspan = (prevSpecs, leftSpecs) => {
                let prevSpecsStr = prevSpecs.join(',')
                let number = 0
                let indexArr = []

                if(leftSpecs && leftSpecs.length) {
                    _list.forEach((val, index) => {
                        let label = val.label

                        if(label.indexOf(prevSpecsStr + ',') != -1) {
                            indexArr.push(index)
                            number++
                        }
                    })

                    indexArr.sort(function(a, b){return a - b})

                    return {
                        number,
                        index: indexArr.shift()
                    }
                } else {
                    return null
                }
            }

            _list.forEach((val, index) => {
                let label = val.label
                let labelArr = label.split(',')

                if(labelArr.length > 1) {
                    labelArr.forEach((labelItem, labelIndex) => {
                        let specValue = labelItem
                        let prevSpecs = labelArr.slice(0, labelIndex + 1)
                        let leftSpecs = labelArr.slice(labelIndex + 1)
                        let specLable = ''

                        for(let i in val.specs) {
                            if(val.specs.hasOwnProperty(i)) {
                                if(val.specs[i] == specValue) {
                                    specLable = i
                                }
                            }
                        }
                        //val[specLable + '_rowspan'] = 1
                        //val[specLable + '_hide'] = false

                        let retObj = computeRowspan(prevSpecs, leftSpecs)

                        if(retObj) {
                            val[specLable + '_rowspan'] = retObj.number
                            if(index != retObj.index) {
                                val[specLable + '_hide'] = true
                            }
                        }
                    })
                }
            })

            return _list
        },
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        },
    },
    watch: {
        // list: {
        //     deep: true,
        //     handler() {
        //         let _computedList = JSON.parse(JSON.stringify(this.computedList))

        //         this.$emit('update:list', _computedList)
        //     }
        // }
    },
    mounted () {
        
    },
    methods: {
        codeBlur(code, index) {
            if(!/^[a-zA-Z0-9_]{6,}$/.test(code)) {
                this.list.splice(index, 1, Object.assign({}, this.list[index], {
                    showCodeSpan: true
                }))
            } else {
                this.list.splice(index, 1, Object.assign({}, this.list[index], {
                    showCodeSpan: false
                }))
            }
        },
        costPriceChange(value) {
            console.log(value)
        },
        imageSelected(image) {
            if(this.material) {
                this.list.splice(this.materialIndex, 1, Object.assign({}, this.list[this.materialIndex], {
                    image: image.filePath,
                    fileList: [
                        {
                            name: '',
                            url: image.filePath
                        }
                    ]
                }))
                this.material = false
            } else {
                this.fileList.push(Object.assign({}, image, {
                    name: image.fileName,
                    url: image.filePath
                }))
                if(this.ruleForm.images != '') {
                    this.ruleForm.images += ',' + image.filePath
                } else {
                    this.ruleForm.images = image.filePath
                }
                this.hideUpload = this.imagesLength >= 6
            }
        }
    },
    props: {
        list: {
            type: Array
        },
        specsLabel: {
            type: String
        },
        productCategoryInfoId: {

        },
        uploadUrl: {

        },
        hideDelete: {
            type: Boolean
        }
    },
    components: {
        dialogSelectImageMaterial
    }
}
</script>
<style lang="scss" scoped>
    .specs {
        overflow: scroll;
        padding-bottom: 10px;
    }
    .specs::-webkit-scrollbar-thumb {
        background: rgba(101,94,255,0.4) !important;
    }
    .specs::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    /deep/ .el-input {
        width: 120px!important;
        margin-left: 11px;
    }
    /deep/ .el-input__inner {
        text-align: left!important;
    }
    /deep/ .el-input__inner {
        width: 120px;
    }
    td.spec {
        text-align: center;
    }
    table {
        border: 1px solid #DCDFE6;
        td {
            padding: 5px 0;
        }
        tr th {
            height: 40px;
            background: rgb(242, 236, 255);
            color: rgb(101, 94, 255);
        }
    }
    table th.costPrice span,
    table th.salePrice span,
    table th.stock span,
    table th.warningStock span,
    table th.image span {
        position: relative;
        &:before {
            content: '*';
            display: block;
            color: #FD4C2B;
            position: absolute;
            left: -6px;
            top: 2px;
        }
    }
    /deep/ .upload-spec {
        margin-left: 22px;
    }
    .upload-spec-ku {
       margin-left: 22px; 
    }
    .spec-operate {
        margin-left: 34px;
        span {
            cursor: pointer;
            color: #655EFF;
            &.deleteSpan {
                color: #FD4C2B;
            }
        }
    }
    .specs ::-webkit-scrollbar-thumb {
        background-color: #bbb;
        height: 10px;
    }
    .error-message {
        font-size: 12px;
        color: #FD4C2B;
        margin-left: 5px;
        margin-top: 2px;
    }
    table tr td {
        min-width: 147px;
        padding: 14px 2px;
    }
    /deep/ .el-input input {
        padding-right: 0;
    }
</style>


