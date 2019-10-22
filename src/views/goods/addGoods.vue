<template>
<div class="app-container add-goods">
    <!-- <header class="header">
        <div :class="{active: index == 0}" @click="scrollTo(0)" class="item">基本信息</div>
        <div :class="{active: index == 1}" @click="scrollTo(1)" class="item">销售信息</div>
        <div :class="{active: index == 2}" @click="scrollTo(2)" class="item">物流/售后</div>
        <div :class="{active: index == 3}" @click="scrollTo(3)" class="item">详情描述</div>
    </header> -->
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="160px" class="demo-ruleForm">
        <section class="form-section">
            <h2>基本信息</h2>
            <el-form-item label="商品类目" prop="productCategoryInfoId">
                <el-cascader
                    :options="itemCatList"
                    v-model="ruleForm.itemCat"
                    @change="itemCatHandleChange"
                    :props="{ multiple: false, checkStrictly: true }"
                    clearable
                    filterable>
                </el-cascader>
                <span class="category-display">您当前的选择是：{{itemCatText}}</span>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input :disabled="!ruleForm.productCategoryInfoId" style="width: 840px;" v-model="ruleForm.name" maxlength="60" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input :disabled="!ruleForm.productCategoryInfoId" style="width: 840px;" type="textarea" :rows="4" v-model="ruleForm.description" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="images">
                <!-- <img v-for="(item, key) of imageList" :key="key" :src="item.src" alt="" style="width:100px;height:100px"> -->
                <el-upload
                    :disabled="!ruleForm.productCategoryInfoId"
                    :action="uploadUrl"
                    multiple
                    :class="{hide:hideUpload}"
                    :file-list="fileList"
                    list-type="picture-card"
                    :limit="6"
                    :data="{json: JSON.stringify({cid: cid})}"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="centerFileUrl"
                    :on-change="changeUpload"
                    class="p_imgsCon">
                    <i class="el-icon-plus"></i>
                    <p style="line-height: 21px; margin-top: -39px; color: #92929B;">上传图片</p>
                </el-upload>
                <el-dialog :visible.sync="imageDialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <span :style="{visibility: !ruleForm.productCategoryInfoId ? 'hidden' : 'visible'}" v-if="imagesLength < 6" @click="currentDialog = 'dialogSelectImageMaterial'; dialogVisible = true" class="material">素材库</span>
                <p class="description prompt">最多支持上传6张商品图片，默认第一张为主图；尺寸建议750x750（正方形模式）或750×1000（长图模式）像素以上，大小2M以下。</p>
            </el-form-item>
            <el-form-item label="商品分类" prop="productCatalogInfoId">
                <div class="block" style="display: inline-block;margin-left: 5px">
                    <el-cascader
                        :disabled="!ruleForm.productCategoryInfoId"
                        :options="categoryOptions"
                        v-model="categoryValue"
                        @change="handleChange"
                        :props="{ multiple: false, checkStrictly: true }"
                        clearable>
                    </el-cascader>
                </div>
                <div v-if="ruleForm.productCategoryInfoId" @click="addCategory" class="blue pointer" style="display: inline-block; margin-left: 24px;">新增分类</div>
            </el-form-item>
            <el-form-item label="商品标签" prop="productLabelId">
                <div class="add-tag">
                    <div class="item">
                        <el-select :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.productLabelId" placeholder="请选择">
                            <el-option
                                v-for="item in productLabelList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                                :disabled="item.enable == 0">
                            </el-option>
                        </el-select>
                    </div>
                    <div v-if="ruleForm.productCategoryInfoId" @click="currentDialog = 'AddTagDialog'; dialogVisible = true" class="item tag">新增标签</div>
                    <div @mouseenter="imageVisible = true" @mouseleave="imageVisible = false" class="item example">
                        查看样例
                        <div v-show="imageVisible" class="item images images-example">
                            <img src="../../assets/images/goods/example.png" alt="">
                        </div>
                    </div>
                </div>
            </el-form-item>
            <el-form-item label="商品编码" prop="code">
                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.code" minlength="6" maxlength="18" placeholder="请输入商品编码"></el-input>
            </el-form-item>
        </section>
        <section class="form-section">
            <h2>销售信息</h2>
            <el-form-item label="规格信息" prop="goodsInfos">
                <el-button :disabled="!ruleForm.productCategoryInfoId" v-if="!editor" class="border-button selection-specification" @click="selectSpecificationsCurrentDialog = 'SelectSpecifications'; currentData = specsList; selectSpecificationsDialogVisible = true">选择规格</el-button>
                <template v-if="!editor">
                    <el-table
                    class="spec-information"
                    :data="ruleForm.goodsInfos"
                    :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                    style="width: 100%">
                    <el-table-column
                        prop="label"
                        :label="specsLabel"
                        width="120">
                    </el-table-column>
                    <el-table-column
                        prop="costPrice"
                        label="成本价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.costPrice" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="salePrice"
                        label="售卖价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.salePrice" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="stock"
                        label="库存">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.stock" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="warningStock"
                        label="库存预警">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.warningStock" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="重量">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.weight" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="volume"
                        label="体积">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.volume" placeholder="请输入"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="image"
                        label="图片">
                        <template slot-scope="scope">
                            <!-- <div v-if="scope.row.image" class="image" :style="{backgroundImage: `url(${scope.row.image})`}"></div> -->
                            <el-upload
                                :disabled="!ruleForm.productCategoryInfoId"
                                class="upload-spec"
                                :action="uploadUrl"
                                :class="{hide:scope.row.image}"
                                list-type="picture-card"
                                :file-list="scope.row.fileList"
                                :limit="1"
                                :data="{json: JSON.stringify({cid: cid})}"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="function() {
                                    specHandleRemove(scope.$index)
                                }"
                                :on-success="function(response, file, fileList) {
                                    specUploadSuccess(response, file, fileList, scope.$index, scope.row)
                                }">
                                <p v-if="!scope.row.image">
                                    <i class="el-icon-plus"></i>
                                    点击上传
                                </p>
                            </el-upload>
                            <div v-if="!scope.row.image && ruleForm.productCategoryInfoId" style="cursor: pointer;"  @click="currentDialog = 'dialogSelectImageMaterial'; material = true; materialIndex = scope.$index; dialogVisible = true">素材库</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作"
                        width="90">
                        <template slot-scope="scope">
                            <div class="spec-operate">
                                <span @click="emptySpec(scope.$index)">清空</span>
                                <span @click="deleteSpec(scope.$index)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table>
                </template>
                <template v-else>
                    <el-table
                    class="spec-information-editor"
                    :data="ruleForm.goodsInfos"
                    :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                    style="width: 100%">
                        <el-table-column
                            prop="label"
                            :label="specsLabel"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="costPrice"
                            label="成本价"
                            width="180">
                            <template slot-scope="scope">
                                <!-- <span>¥{{scope.row.costPrice}}</span> -->
                                <el-input v-model="scope.row.costPrice" placeholder="请输入成本价"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="salePrice"
                            label="售卖价">
                            <template slot-scope="scope">
                                <span>¥{{scope.row.salePrice}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="stock"
                            label="库存">
                        </el-table-column>
                        <el-table-column
                            prop="warningStock"
                            label="库存预警">
                            <template slot-scope="scope">
                                <!-- <span>¥{{scope.row.costPrice}}</span> -->
                                <el-input v-model="scope.row.warningStock" placeholder="请输入库存预警"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="weight"
                            label="重量(kg)">
                            <template slot-scope="scope">
                                <!-- <span>{{scope.row.weight}}(kg)</span> -->
                                <el-input v-model="scope.row.weight" placeholder="请输入重量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="volume"
                            label="体积(m³)">
                            <template slot-scope="scope">
                                <!-- <span>{{scope.row.volume}}(m³)</span> -->
                                <el-input v-model="scope.row.volume" placeholder="请输入体积"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="image"
                            label="图片">
                            <template slot-scope="scope">
                                <!-- <img width="66" :src="scope.row.image" alt=""> -->
                                <!-- <div v-if="scope.row.image" class="image" :style="{backgroundImage: `url(${scope.row.image})`}"></div> -->
                                <el-upload
                                    :disabled="!ruleForm.productCategoryInfoId"
                                    class="upload-spec"
                                    :action="uploadUrl"
                                    :class="{hide:scope.row.image}"
                                    list-type="picture-card"
                                    :file-list="scope.row.fileList"
                                    :limit="1"
                                    :data="{json: JSON.stringify({cid: cid})}"
                                    :on-preview="handlePictureCardPreview"
                                    :on-remove="function() {
                                        specHandleRemove(scope.$index)
                                    }"
                                    :on-success="function(response, file, fileList) {
                                        specUploadSuccess(response, file, fileList, scope.$index, scope.row)
                                    }">
                                    <p v-if="!scope.row.image">
                                        <i class="el-icon-plus"></i>
                                        点击上传
                                    </p>
                                </el-upload>
                                <div v-if="!scope.row.image && ruleForm.productCategoryInfoId" style="cursor: pointer;"  @click="currentDialog = 'dialogSelectImageMaterial'; material = true; materialIndex = scope.$index; dialogVisible = true">素材库</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
                <div>
                    <el-checkbox :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isShowStock">商品详情显示剩余库存</el-checkbox>
                    <span class="prompt">库存为0时，商品会自动放到“已售罄"列表里，保存有效库存数字后，买家看到的商品可售库存同步更新</span>
                </div>
                <!-- <el-button v-if="!editor" class="border-button" @click="currentDialog = 'AddSpecifications'; selectSpecificationsCurrentDialog = ''; dialogVisible = true">新增规格</el-button> -->
            </el-form-item>
            <!-- <el-form-item label="起售数量" prop="number">
                <div class="input-number">
                    <span style="user-select: none;" class="pointer" @click="reduce">-</span>
                    <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.startSaleNum"></el-input>
                    <span style="user-select: none;" class="pointer" @click="increase">+</span>
                </div>
            </el-form-item> -->
            <el-form-item label="已售出数量" prop="selfSaleCount">
                <el-input :disabled="!ruleForm.productCategoryInfoId" type="number" v-model="ruleForm.selfSaleCount"></el-input>
                <el-checkbox :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isShowSaleCount">商品详情显示已售出数量</el-checkbox>
                    <span class="prompt">库存为0时，商品会自动放到“已售罄"列表里，保存有效库存数字后，买家看到的商品可售库存同步更新</span>
            </el-form-item>
            <el-form-item label="单位计量" prop="productUnit">
                <el-select v-model="ruleForm.productUnit" placeholder="请选择" :disabled="ruleForm.other || !ruleForm.productCategoryInfoId" clearable>
                    <el-option
                        v-for="item in unitList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                    </el-option>
                </el-select>
                <!-- <el-button class="border-button new-units">新增单位</el-button> -->
                <div style="margin-top: 21px;">
                    <el-checkbox :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.other">其他</el-checkbox>
                    <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.otherUnit" placeholder="请输入计量单位"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="商品品牌" prop="productBrandInfoId">
                <el-select :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.productBrandInfoId" placeholder="请选择">
                    <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </section>
        <section class="form-section">
            <h2>物流/售后</h2>
            <el-form-item label="上架时间" prop="status">
                <span>定时上架的商品在上架前请到“仓库中的宝贝”里编辑商品。</span>
                <div>
                    <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.status">
                        <el-radio :disabled="editor" :label="0">放入仓库</el-radio>
                        <el-radio :disabled="editor" :label="1">立即上架</el-radio>
                        <template v-if="editor">
                            <span><el-radio disabled :label="2">定时上架</el-radio></span>
                        </template>
                        <template v-else>
                            <span @click="timelyShelvingHandler"><el-radio :label="2">定时上架</el-radio></span>
                        </template>
                        <span v-if="ruleForm.status == 2" class="autoSaleTime">{{ruleForm.autoSaleTime}}</span>
                    </el-radio-group>
                </div>
            </el-form-item>
            <el-form-item label="会员打折" prop="isJoinDiscount">
                <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isJoinDiscount">
                    <el-radio :label="1">参与会员打折</el-radio>
                    <el-radio :label="0">不参与会员打折</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="积分赠送" prop="zhengsong">
                <el-radio-group v-model="ruleForm.zhengsong">
                    <el-radio :label="1">赠送</el-radio>
                    <el-radio :label="2">不赠送</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="开具发票" prop="isSupportInvoice">
                <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isSupportInvoice">
                    <el-radio :label="1">支持</el-radio>
                    <el-radio :label="0">不支持</el-radio>
                </el-radio-group>
                <span class="prompt">此功能在交易设置中开启后，可选择是否支持开具发票</span>
            </el-form-item>
            <el-form-item label="是否支持货到付款" prop="isCashOnDelivery">
                <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isCashOnDelivery">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="运费设置" prop="isFreeFreight">
                <div>
                    <el-radio :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isFreeFreight" :label="0">选择运费模板</el-radio>
                    <el-select :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.freightTemplateId" placeholder="请选择">
                        <el-option
                            v-for="item in shippingTemplates"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                </div>
                <div>
                    <el-radio :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isFreeFreight" :label="1">包邮</el-radio>
                </div>
            </el-form-item>
            <el-form-item label="是否支持售后维权" prop="isAfterSaleService">
                <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isAfterSaleService">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </section>
        <section class="form-section">
            <h2>详情描述</h2>
            <el-form-item label="是否显示关联商品" prop="isShowRelationProduct">
                <el-radio :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isShowRelationProduct" :label="0">否</el-radio>
                <el-radio :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isShowRelationProduct" :label="1">是</el-radio>
                <el-button :disabled="!ruleForm.productCategoryInfoId" v-if="ruleForm.isShowRelationProduct == 1" class="border-button" @click="currentDialog = 'ChoosingGoodsDialog'; dialogVisible = true">选择关联商品</el-button>
            </el-form-item>
            <div v-if="ruleForm.isShowRelationProduct == 1" class="associated-goods">
                <el-table
                    :data="tableData"
                    :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
                    style="width: 590px;">
                    <el-table-column
                        prop="name"
                        label="商品名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="productUnit"
                        label="单位"
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="salePrice"
                        label="价格（元）">
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.$index, scope.row)">移 除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-form-item label="是否勾选为“推荐商品”" prop="isRecommend">
                <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isRecommend">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">不是</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="商品详情" prop="productDetail">
                <RichEditor v-if="ruleForm.productCategoryInfoId" @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="this.ruleForm.productDetail"></RichEditor>
            </el-form-item>
            <div class="footer">
                <el-button :disabled="!ruleForm.productCategoryInfoId" @click="submitGoods('ruleForm')" type="primary">保存</el-button>
            </div>
        </section>
    </el-form>
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit" :data="currentData" @imageSelected="imageSelected" :specsLength.sync="specsLength" :add="add" :onSubmit="getCategoryList"></component>
    <component :is="selectSpecificationsCurrentDialog" :dialogVisible.sync="selectSpecificationsDialogVisible" @submit="submit" :data="currentData" :specsLength.sync="specsLength" :flatSpecsList="flatSpecsList"></component>
</div>
</template>
<script>
import SelectSpecifications from '@/views/goods/dialogs/selectSpecifications'
import AddSpecifications from '@/views/goods/dialogs/addSpecifications'
import RichEditor from '@/components/RichEditor';
import ChoosingGoodsDialog from '@/views/goods/dialogs/choosingGoodsDialog'
import TimelyShelvingDialog from '@/views/goods/dialogs/timelyShelvingDialog'
import LibraryDialog from '@/views/goods/dialogs/libraryDialog'
import AddCategoryDialog from '@/views/goods/dialogs/addCategoryDialog'
import AddTagDialog from '@/views/goods/dialogs/addTagDialog'
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial'



export default {
    data() {
        var productUnitValidator = (rule, value, callback) => {
            // if(value === '') {
            //     callback(new Error('请选择优惠方式'));
            // } else {
            //     if(value == 0) {
            //     if(this.ruleForm.useTypeFullcut === '') {
            //         callback(new Error('请输入金额'));
            //     } else {
            //         callback();
            //     }
            //     } else if(value == 1) {
            //     if(this.ruleForm.useTypeDiscount === '') {
            //         callback(new Error('请输入折扣'));
            //     } else {
            //         callback();
            //     }
            //     }
            // }
            if(this.ruleForm.other) {
                if(!this.ruleForm.otherUnit) {
                    callback(new Error('请输入计量单位'));
                } else {
                    callback();
                }
            } else {
                if(!this.ruleForm.productUnit) {
                    callback(new Error('请选择计量单位'));
                } else {
                    callback();
                }
            }
        };
        var isFreeFreightValidator = (rule, value, callback) => {
            if(this.ruleForm.isFreeFreight == 0) {
                if(!this.ruleForm.freightTemplateId) {
                    callback(new Error('请选择运费模板'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            itemCatText: '',
            categoryValue: [],
            categoryOptions: [],
            productLabelList: [], // 商品标签列表
            specIds: [],
            add: true,
            ruleForm: {
                productCategoryInfoId: '', // 商品类目id
                productCatalogInfoId: '', // 商品商家分类ID
                name: '', // 商品名称
                description: '', // 商品描述
                images: '', // 商品图片
                productCategoryInfoIds: '',
                selfSaleCount: '', // 自定义销量
                productLabelId: '', // 商品标签
                startSaleNum: 1, // 起售数量
                quantitySold: 0,
                productBrandInfoId: '', // 商品品牌id
                status: 0, // 上架状态
                autoSaleTime: '', // 自动上架时间
                isJoinDiscount: 0, // 是否参与打折 1参与 ,0不参与
                zhengsong: 1,
                isSupportInvoice: 0, // 是否开发票
                isShowStock: true, // 是否显示库存 1显示 0不显示
                isShowSaleCount: true, // 是否显示销量 1显示 0不显示
                productUnit: '', // 商品计量单位
                other: false,
                otherUnit: '',
                isCashOnDelivery: 0, // 是否支持货到付款
                isFreeFreight: 0, // 是否包邮
                isAfterSaleService: 1, // 是否支持售后服务
                isShowRelationProduct: 0, // 是否显示关联商品
                relationProductInfoIds: [], // 关联商品
                productDetail: '', // 商品详情
                goodsInfo: [],
                goodsInfos: [], // sku列表
                freightTemplateId: '', // 运费模版ID
                code: '', // 商品编码
                isRecommend: 1, // 是否推荐商品
                itemCat: '',
                imageData: {
                    fileName: 'image',
                    cid: this.cid
                }
                
            },
            specFileList: [],
            imageList: [],
            rules: {
                productCategoryInfoId: [
                    { required: true, message: '请选择商品类目', trigger: 'blur' },
                ],
                name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                images: [
                    { required: true, message: '请上传商品图片', trigger: 'blur' },
                ],
                productCatalogInfoId: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' },
                ],
                goodsInfos: [
                    { required: true, message: '请输入规格信息', trigger: 'blur' },
                ],
                // selfSaleCount: [
                //     { required: true, message: '请输入已售出数量', trigger: 'blur' },
                // ],
                productUnit: [
                    { validator: productUnitValidator, trigger: 'blur' },
                ],
                // productBrandInfoId: [
                //     { required: true, message: '请选择商品品牌', trigger: 'blur' },
                // ],
                status: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                isSupportInvoice: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                isCashOnDelivery: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                isFreeFreight: [
                    { validator: isFreeFreightValidator, trigger: 'blur' },
                ],
                isAfterSaleService: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                isJoinDiscount: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
                isShowRelationProduct: [
                    { required: true, message: '请选择', trigger: 'blur' },
                ],
            },
            uploadUrl: `${process.env.UPLOAD_SERVER}/web-file/file-server/api_file_remote_upload.do`,
            optionsTypeList: [],
            imageVisible: false,
            currentDialog: '',
            dialogVisible: true,
            unitList: [],
            brandList: [],
            myConfig: {
                // 编辑器不自动被内容撑高
                autoHeightEnabled: false,
                // 初始容器高度
                initialFrameHeight: 400,
                // 初始容器宽度
                initialFrameWidth: 700,
            },
            index: 0,
            shippingTemplates: [],
            tableData: [],
            operateCategoryList: [],
            itemCatList: [],
            specsList: [],
            flatSpecsList: [],
            flatCategoryList: [],
            currentData: [],
            specsLabel: '',
            showFileList: false,
            fileList: [],
            dialogImageUrl: '',
            imageDialogVisible: false,
            specsLength: 0,
            selectSpecificationsCurrentDialog: '',
            selectSpecificationsDialogVisible: false,
            materialIndex: 0,
            material: false,
            hideUpload: false,
        }
    },
    created() {
        // this.getOperateCategoryList().then(res => {
        //     this.getCategoryList()
        //     this.getProductLabelList()
        //     this.getUnitList()
        //     this.getBrandList()
        //     this.getTemplateList()
        //     if(this.$route.query.id && this.$route.query.goodsInfoId) {
        //         this.getGoodsDetail()
        //     }
        // })
        Promise.all([this.getOperateCategoryList(), this.getCategoryList(), this.getProductLabelList(), this.getUnitList(), this.getBrandList(), this.getTemplateList()]).then(() => {
            if(this.$route.query.id && this.$route.query.goodsInfoId) {
                this.getGoodsDetail()
            }
        })
    },
    computed: {
        editor() {
            if(this.$route.query.id && this.$route.query.goodsInfoId) {
                return true
            } else {
                return false
            }
        },
        cid(){
            let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
            return shopInfo.id
        },
        imagesLength() {
            let images = this.ruleForm.images

            if(images && images.split(',').length) {
                return images.split(',').length
            }

            return 0
        }
    },
    watch: {
        'ruleForm.other': function(value) {
            if(value) {
                this.ruleForm.productUnit = ''
            }
        },
        'ruleForm.goodsInfos': function(value) {
            if(!value.length) {
                this.specsLabel = ''
            }
        },
        specsLabel(value) {
            if(!value) {
                this.specsLength = 0
            } else {
                this.specsLength = value.split(',').length
            }
        },
        // 'ruleForm.itemCat': function() {
        //     this.getOperateCategoryList()
        // }
    },
    methods: {
        changeUpload() {
            this.hideUpload = this.imagesLength >= 6
        },
        addCategory() {
            this.currentDialog = 'AddCategoryDialog'
            this.currentData = {level: 0, add: true}
            this.dialogVisible = true
        },
        getTemplateList() {
            return new Promise((resolve, reject) => {
                this._apis.order.fetchTemplatePageList({pageSize: 1000}).then((res) => {
                    res.list.unshift({
                        id: '',
                        name: '请选择'
                    })
                    this.shippingTemplates = res.list

                    resolve()
                }).catch(error => {
                    this.visible = false
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                    reject(error)
                })
            })
        },
        deleteSpec(index) {
            this.ruleForm.goodsInfos.splice(index, 1)
        },
        emptySpec(index) {
            this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                costPrice: '',
                salePrice: '',
                stock: '',
                warningStock: '',
                weight: '',
                volume: '',
                image: '',
            }))

            console.log(this.ruleForm.goodsInfos)
        },
        specHandleRemove(index) {
            this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                image: ''
            }))
        },
        specUploadSuccess(response, file, fileList, index, row) {
            if(file.status == "success"){
                this.$message.success(response.msg);
                //this.ruleForm.goodsInfos[index].image = response.data.url
                if(!this.editor) {
                    this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                        image: response.data.url
                    }))
                } else {
                    this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                        image: response.data.url
                    }))
                }
            }else{
                this.$message.error(response.msg);
            }
        },
        handleEdit(index, row) {
            this.tableData.splice(index, 1)
        },
        getCategoryIds(arr, id) {
            try {
                let parentId = this.flatCategoryList.find(val => val.id == id).parentId

                arr.unshift(id)

                if(parentId && parentId != 0) {
                    this.getCategoryIds(arr, parentId)
                }
            } catch(e) {
                console.error(e)
            }
        },
        // 获取类目
        getCategoryInfoIds(arr, id) {
            try {
                let parentId = this.operateCategoryList.find(val => val.id == id).parentId

                arr.unshift(id)

                if(parentId && parentId != 0) {
                    this.getCategoryInfoIds(arr, parentId)
                }
            } catch(e) {
                console.error(e)
            }
        },
        getGoodsDetail() {
            let {id, goodsInfoId} = this.$route.query
            var that = this

            this._apis.goods.getGoodsDetail({id, goodsInfoId}).then(res => {
                console.log(res)
                let arr = []
                let itemCatAr = []

                this.getCategoryIds(arr, res.productCatalogInfoId)
                this.getCategoryInfoIds(itemCatAr, res.productCategoryInfoId)

                let _arr = itemCatAr.map(id => {
                    return this.operateCategoryList.find(val => val.id == id)
                })

                this.itemCatText = _arr.map(val => val.name).join(' > ')

                let specs = JSON.parse(res.goodsInfo.specs)

                let specsLabelArr = []
                let labelArr = []

                for(let i in specs) {
                    if(specs.hasOwnProperty(i)) {
                        specsLabelArr.push(i)
                        labelArr.push(specs[i])
                    }
                }

                this.specsLabel = specsLabelArr.join(',')
                res.goodsInfo.label = labelArr.join(',')
                
                this.ruleForm = Object.assign({}, this.ruleForm, res, {
                    goodsInfos: [res.goodsInfo]
                })
                this.categoryValue = arr
                this.ruleForm.itemCat = itemCatAr
                if(this.ruleForm.images) {
                    console.log(this.ruleForm.images.split(','))
                    this.fileList = this.ruleForm.images.split(',') && this.ruleForm.images.split(',').length ? this.ruleForm.images.split(',').map(val => ({
                        name: '', 
                        url: val
                    })) : []

                    console.log(this.fileList)
                }
                if(this.ruleForm.goodsInfos && this.ruleForm.goodsInfos.length) {
                    let goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))

                    goodsInfos.forEach(val => {
                        val.fileList = [{
                            name: '',
                            url: val.image
                        }]
                    })
                    this.ruleForm.goodsInfos = goodsInfos
                }
                if(this.ruleForm.relationProductInfoIds && this.ruleForm.relationProductInfoIds.length) {
                    this._apis.goods.getSPUGoodsList({ids: this.ruleForm.relationProductInfoIds}).then((res) => {
                        this.tableData = res.list
                    }).catch(error => {
                        this.$notify.error({
                            title: '错误',
                            message: error
                        });
                    })
                }
                if(this.ruleForm.productUnit) {
                    if(!this.unitList.find(val => val.name == this.ruleForm.productUnit)) {
                        this.ruleForm.other = true
                        this.ruleForm.otherUnit = this.ruleForm.productUnit
                    }
                }
                if(!this.productLabelList.find(val => val.id == this.ruleForm.productLabelId)) {
                    this.ruleForm.productLabelId = ''
                }
                this.ruleForm.isShowSaleCount = this.ruleForm.isShowSaleCount == 1 ? true : false
                this.ruleForm.isShowStock = this.ruleForm.isShowStock == 1 ? true : false

                // if(this.ruleForm.productDetail) {
                //     let _productDetail = ''

                //     _productDetail = decodeURIComponent(escape(window.atob(this.ruleForm.productDetail)))
                //     this.ruleForm.productDetail = _productDetail
                // }
            }).catch(error => {

            }) 
        },
        flatTreeArray(array = [], childrenKey = 'childrenList') {
            var result = [];
            let flat = (array = {}, childrenKey, floor) => {
                array.forEach(item => {
                let dataItem = {
                    floor: floor,
                    name: item.name,
                    id: item.id,
                    parentId: item.parentId,
                }
                result.push(dataItem);

                let childrenArr;
                if (item.hasOwnProperty(childrenKey)) {
                    childrenArr = item[childrenKey];
                    delete item[childrenKey];
                }
                if (childrenArr && childrenArr.length > 0) {
                    flat(childrenArr, childrenKey, floor + 1)
                }
                });
            }
            flat(array, childrenKey, 1);
            return result;
        },
        getRootId(id) {
            let rootId = ''
            let that = this

            var getId = function(id) {
                let category = that.operateCategoryList.find(val => val.id == id)
                let parentId = category.parentId

                if(parentId != 0) {
                    getId(parentId)
                } else {
                    rootId = id
                }
            }

            getId(id)

            return rootId
        },
        // 获取商品规格列表
        getSpecsList() {
            let productCategoryInfoId = this.ruleForm.productCategoryInfoId
            let rootId = this.getRootId(productCategoryInfoId)
            this._apis.goodsOperate.fetchSpecsList({productCategoryId: rootId, enable: 1}).then(res => {
                console.log(res)
                res.forEach(val => {
                    val.level = '1'
                })
                this.specsList = res
                //this.specsLength = this.specsList.length
                this.flatSpecsList = this.flatTreeArray(JSON.parse(JSON.stringify(res)), 'list')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        },
        addGoods(params) {
            this._apis.goods.addGoods(params).then(res => {
                this.$notify({
                    title: '成功',
                    message: '新增成功！',
                    type: 'success'
                });
                this.$router.push('/goods/goodsList')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        },
        editorGoods(params) {
            this._apis.goods.editorGoods(params).then(res => {
                this.$notify({
                    title: '成功',
                    message: '编辑成功！',
                    type: 'success'
                });
                this.$router.push('/goods/goodsList')
            }).catch(error => {
                this.$notify.error({
                    title: '错误',
                    message: error
                });
            }) 
        },
        submitGoods(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let params
                    let _goodsInfos
                    let obj = {
                        isShowSaleCount: this.ruleForm.isShowSaleCount ? 1 : 0,
                        isShowStock: this.ruleForm.isShowStock ? 1 : 0,
                        productUnit: this.ruleForm.other ? this.ruleForm.otherUnit : this.ruleForm.productUnit,
                    }

                    let calculationWay
                    
                    if(this.ruleForm.isFreeFreight == 0) {
                        let id = this.ruleForm.freightTemplateId

                        calculationWay = this.shippingTemplates.find(val => val.id == id).calculationWay

                        if(calculationWay == 3) {
                            if(this.ruleForm.goodsInfos.some(val => val.volume == '')) {
                                this.$message({
                                    message: '规格信息中体积不能为空',
                                    type: 'warning'
                                });
                                return
                            }
                        } else if(calculationWay == 2) {
                            if(this.ruleForm.goodsInfos.some(val => val.weight == '')) {
                                this.$message({
                                    message: '规格信息中重量不能为空',
                                    type: 'warning'
                                });
                                return
                            }
                        }
                    }

                    if(this.ruleForm.goodsInfos.some(val => val.costPrice == '')) {
                        this.$message({
                            message: '规格信息中成本价不能为空',
                            type: 'warning'
                        });
                        return
                    }
                    if(!this.editor && this.ruleForm.goodsInfos.some(val => val.salePrice == '')) {
                        this.$message({
                            message: '规格信息中售卖价不能为空',
                            type: 'warning'
                        });
                        return
                    }
                    if(!this.editor && this.ruleForm.goodsInfos.some(val => val.stock == '')) {
                        this.$message({
                            message: '规格信息中库存不能为空',
                            type: 'warning'
                        });
                        return
                    }
                    if(this.ruleForm.goodsInfos.some(val => !val.warningStock)) {
                        this.$message({
                            message: '规格信息中库存预警不能为空',
                            type: 'warning'
                        });
                        return
                    }
                    if(this.ruleForm.goodsInfos.some(val => val.image == '')) {
                        this.$message({
                            message: '规格信息中图片不能为空',
                            type: 'warning'
                        });
                        return
                    }

                    // if(this.ruleForm.productDetail) {
                    //     let _productDetail = ''

                    //     _productDetail = btoa(unescape(encodeURIComponent(this.ruleForm.productDetail)));
                    //     obj.productDetail = _productDetail
                    // }

                    if(!this.editor) {
                        _goodsInfos = this.ruleForm.goodsInfos.map(val => {
                            let _specs = {}

                            val.label.split(',').forEach((spec, index) => {
                                _specs[this.specsLabel.split(',')[index]] = spec
                            })

                            val.specs = _specs

                            return val
                        })

                        obj.goodsInfos = _goodsInfos
                    } else {
                        obj.goodsInfos = this.ruleForm.goodsInfos
                    }

                    params = Object.assign({}, this.ruleForm, obj)
                    
                    if(!this.editor) {
                        this.addGoods(params)
                    } else {
                        this.editorGoods(params)
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 获取单品牌管理列表
        getBrandList() {
            return new Promise((resolve, reject) => {
                this._apis.goodsOperate.fetchBrandList().then(res => {
                    res.unshift({
                        id: '',
                        name: '请选择'
                    })
                    this.brandList = res

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取单位计量列表
        getUnitList() {
            return new Promise((resolve, reject) => {
                this._apis.goodsOperate.fetchUnitList().then(res => {
                    res.unshift({
                        id: '',
                        name: '请选择'
                    })
                    this.unitList = res

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        itemCatHandleChange(value) {
            let _value = [...value]
            let arr = this.ruleForm.itemCat.map(id => {
                return this.operateCategoryList.find(val => val.id == id)
            })

            this.itemCatText = arr.map(val => val.name).join(' > ')
            this.ruleForm.productCategoryInfoId = _value.pop()

            this.getSpecsList()
        },
        // 获取商品类目列表
        getOperateCategoryList() {
            return new Promise((resolve, reject) => {
                this._apis.goodsOperate.fetchCategoryList({enable: 1}).then(res => {
                    // let arr = this.transTreeData(res.list, 0)
                    // this.operateCategoryList = res.list
                    // this.itemCatList = arr

                    let arr = this.transTreeData(res, 0)
                    this.operateCategoryList = res
                    this.itemCatList = arr
                    resolve(res.list)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        getProductLabelList() {
            return new Promise((resolve, reject) => {
                this._apis.goods.fetchAllTagsList().then(res => {
                    res.unshift({
                        id: '',
                        name: '请选择'
                    })
                    this.productLabelList = res

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        transTreeData(data, pid) {
            var result = [], temp;
            for (var i = 0; i < data.length; i++) {
                if (data[i].parentId == pid) {
                    var obj = {"categoryName": data[i].name,"id": data[i].id, 
                        parentId: data[i].parentId, level: data[i].level, sort: data[i].sort, 
                        image: data[i].image, enable: data[i].enable, label: data[i].name, value: data[i].id};
                    temp = this.transTreeData(data, data[i].id);
                    if (temp.length > 0) {
                        obj.children = temp;
                    }
                    result.push(obj);
                }
            }
            return result;
        },
        getCategoryList() {
            return new Promise((resolve, reject) => {
                this._apis.goods.fetchCategoryList().then((res) => {
                    this.flatCategoryList = res
                    let arr = this.transTreeData(res, 0)
                    
                    this.categoryOptions = arr

                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleChange(value) {
            let _value = [...value]
            this.ruleForm.productCatalogInfoId = _value.pop()
        },
        timelyShelvingHandler() {
            this.currentDialog = 'TimelyShelvingDialog'
            this.dialogVisible = true
        },
        increase() {
            this.ruleForm.startSaleNum++
        },
        reduce() {
            if(this.ruleForm.startSaleNum > 0) {
                this.ruleForm.startSaleNum--
            }
        },
        selectSpecificationsHandler(value) {
            let results = [];
            let result = [];

            var doExchange = function(arr, index) {
                for (var i = 0; i<arr[index].length; i++) {
                    result[index] = arr[index][i];
                    if (index != arr.length - 1) {
                        doExchange(arr, index + 1)
                    } else {
                        results.push(result.join(','))
                    }
                } 
            }

            if(value.length) {
                let _arr = []
                let obj = {}

                value.forEach(val => {
                    if(!obj[val[0]]) {
                        obj[val[0]] = []
                        obj[val[0]].push(val[1])
                    } else {
                        obj[val[0]].push(val[1])
                    }
                })

                for(let i in obj) {
                    _arr.push(obj[i])
                }

                doExchange(_arr, 0);
                let _results = results.map((val, index) => {
                    let valArr = []
                    let pId = []
                    let names = []

                    val.split(',').forEach(id => {
                        let item = this.flatSpecsList.find(flatItem => flatItem.id == id)

                        valArr.push(item.name)
                        pId.push(item.parentId)
                    })

                    pId.forEach(id => {
                        console.log(this.flatSpecsList)
                        let item = this.flatSpecsList.find(flatItem => flatItem.id == id)

                        names.push(item.name)
                    })

                    this.specsLabel = names.join(',')

                    let _specs = {} //{"尺寸": "XL", "颜色": "黑色" }

                    valArr.forEach((val, index) => {
                        _specs[names[index]] = val
                    })

                    return {
                        label: valArr.join(','),
                        costPrice: '',
                        salePrice: '',
                        stock: '',
                        warningStock: '',
                        weight: '',
                        volume: '',
                        specs: _specs,
                        image: '',
                        fileList: []
                    }
                })
                this.ruleForm.goodsInfos.forEach((val, index) => {
                    let label = val.label

                    if(_results.find(spec => spec.label == label)) {
                        let specIndex = _results.findIndex(val => val.label == label)
                        
                        _results.splice(specIndex, 1, Object.assign({}, this.ruleForm.goodsInfos[index]))
                    }
                })

                this.ruleForm.goodsInfos = _results

                console.log(_results)
            } else {
                this.ruleForm.goodsInfos = []
            }
        },
        submit(value) {
            if(this.currentDialog == 'ChoosingGoodsDialog') {
                // 关联商品
                this.tableData.push(value)
                this.ruleForm.relationProductInfoIds = this.tableData.map(val => val.id)
            } else if(this.currentDialog == 'TimelyShelvingDialog') {
                // 设置自动上架时间
                this.ruleForm.autoSaleTime = value
            } else if(this.selectSpecificationsCurrentDialog == 'SelectSpecifications') {
                this.specIds = value
                this.selectSpecificationsHandler(value)
            } else if(this.currentDialog == 'AddSpecifications') {
                let arr = []
                let _arr= []

                value.forEach(val => {
                    arr = arr.concat(val)
                })

                _arr = Array.from(new Set(arr))

                _arr.forEach(id => {
                    if(!this.flatSpecsList.find(val => val.id == id)) {
                        this.flatSpecsList.push({id: id, name: id, parentId: value[0][0]})
                    }
                })

                this.specIds = [...this.specIds, ...value]

                this.selectSpecificationsHandler(this.specIds)
            } else if(this.currentDialog == 'AddTagDialog') {
                this.getProductLabelList()
            }
        },
        editorValueUpdate(value) {
            this.ruleForm.productDetail = value;
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.imageDialogVisible = true;
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
            let url = file.url

            this.fileList.splice(this.fileList.findIndex(val => val.url == url), 1)
            this.ruleForm.images = fileList.map(val => {
                if(val.response) {
                    return val.response.data.url
                }
                return val.url
            }).join(',')
            this.hideUpload = this.imagesLength >= 6
        },
        centerFileUrl(response, file, fileList){
            if(response.status == "success"){
                this.$message.success(response.msg);
                this.fileList.push({
                    name: '',
                    url: response.data.url
                })
                if(this.ruleForm.images != '') {
                    this.ruleForm.images += ',' + response.data.url;
                } else {
                    this.ruleForm.images = response.data.url;
                }
            }else{
                this.$message.error(response.msg);
            }
        },
        handleScroll() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || 
                document.body.scrollTop
            
            if(scrollTop > 21) {
                document.querySelector('.add-goods .header').style.position = 'fixed'
                document.querySelector('.add-goods .header').style.background = '#fff'
                document.querySelector('.add-goods .header').style.zIndex = 1000
                document.querySelector('.add-goods .header').style.top = '60px'
            } else {
                document.querySelector('.add-goods .header').style.position = 'static'
            }

            if(scrollTop < 385) {
                this.index = 0
            } else if(scrollTop >= 385 && scrollTop < 811) {
                this.index = 1
            } else if(scrollTop >= 811 && scrollTop < 1282) {
                this.index = 2
            } else {
                this.index = 3
            }
        },
        scrollTo(index) {
            if(index == 0) {
                window.scrollTo(0,0)
                this.index = 0
            } else if(index == 1) {
                window.scrollTo(0,385)
                this.index = 1
            } else if(index == 2) {
                window.scrollTo(0,811)
                this.index = 2
            } else if(index == 3) {
                window.scrollTo(0,1282)
                this.index = 3
            }
        },

        imageSelected(image) {
            if(this.material) {
                this.ruleForm.goodsInfos.splice(this.materialIndex, 1, Object.assign({}, this.ruleForm.goodsInfos[this.materialIndex], {
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
    mounted() {
        window.addEventListener('scroll', this.handleScroll)
    },
    components: {
        SelectSpecifications,
        AddSpecifications,
        RichEditor,
        ChoosingGoodsDialog,
        TimelyShelvingDialog,
        LibraryDialog,
        AddCategoryDialog,
        AddTagDialog,
        dialogSelectImageMaterial,
        RichEditor
    }
}
</script>
<style lang="scss" scoped>
$blue: #655EFF;
.gray {
    color: $grayColor;
}
.prompt {
    color: $grayColor;
    font-size: 12px;
    margin-top: -27px;
}
.blue {
    color: $blue;
}
.pointer {
    cursor: pointer;
}
.flc {
    display: flex;
    align-items: center;
}
.app-main .content-box .content-main {
    margin-top: 2px;
}
.add-goods {
    padding: 18px 21px;
    padding-top: 2px;
    background-color: #fff;
    section {
        h2 {
            margin-bottom: 20px;
            font-size: 18px;
        }
    }
    .header {
        display: flex;
        align-items: center;
        border-bottom: 2px solid #CACFCB;
        width: 100%;
        height: 56px;
        .item {
            margin-right: 40px;
            height: 100%;
            line-height: 56px;
            &.active {
                border-bottom: 1px solid $blue;
                color: $blue;
            }
        }
    }
    .material {
        color: $globalMainColor;
        cursor: pointer;
        margin-left: -53px;
        position: relative;
        top: -54px;
    }
    .add-tag {
        display: flex;
        .item {
            margin-right: 24px;
            &.tag {
                margin-right: 72px;
                color: $blue;
                cursor: pointer;
            }
            &.example {
                color: $blue;
                cursor: pointer;
                position: relative;
                .images-example {
                    position: absolute;
                    left: 65px;
                    top: 10px;
                }
            }
            &.images {
                border: 1px solid #d0d6e4;
            }
        }
    }
    .form-section {
        border-bottom: 1px dashed #d3d3d3;
        &:last-child {
            border: none;
        }
        padding-bottom: 30px;
        padding-top: 24px;
        .new-units {
            margin-left: 30px;
        }
        .category-display {
            margin-left: 10px;
        }
        .selection-specification {
            margin-bottom: 35px;
        }
        .image {
            width: 60px;
            height: 60px;
            background-size: 100%;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
}
/deep/ .el-input {
    width: auto;
}
/deep/ .el-upload--picture-card {
    width: 66px;
    height: 66px;
    line-height: 74px;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 66px;
    height: 66px;
}
.input-number {
    span {
        display: inline-block;
        width: 34px;
        height: 34px;
        background-color: rgb(239, 238, 255);
        text-align: center;
        line-height: 34px;
    }
}
/deep/ .input-number .el-input--small .el-input__inner {
    width: 34px;
    height: 34px;
    padding-left: 2px;
    padding-right: 2px;
    text-align: center;
}
/deep/ .el-checkbox {
    margin-right: 23px;
}
/deep/ .el-radio-group {
    margin-right: 20px;
}
/deep/ .el-textarea {
    width: auto;
}
/deep/ .spec-information thead th:nth-child(2) .cell,
    /deep/ .spec-information thead th:nth-child(3) .cell,
    /deep/ .spec-information thead th:nth-child(4) .cell,
    /deep/ .spec-information thead th:nth-child(5) .cell,
    /deep/ .spec-information thead th:nth-child(8) .cell {
    position: relative;
    &:before {
        content: '*';
        display: block;
        color: #FD4C2B;
        position: absolute;
        left: 1px;
        top: 2px;
    }
}
/deep/ .spec-information-editor thead th:nth-child(2) .cell,
    /deep/ .spec-information-editor thead th:nth-child(3) .cell,
    /deep/ .spec-information-editor thead th:nth-child(4) .cell,
    /deep/ .spec-information-editor thead th:nth-child(5) .cell,
    /deep/ .spec-information-editor thead th:nth-child(8) .cell {
    position: relative;
    &:before {
        content: '*';
        display: block;
        color: #FD4C2B;
        position: absolute;
        left: 1px;
        top: 2px;
    }
}
.footer {
    text-align: center;
}
/deep/ .upload-spec .el-upload {
    width: 75px!important;
    height: 30px!important;
    line-height: 30px!important;
    color: #655EFF;
    border: none;
    i {
        font-size: 14px;
    }
}
.spec-operate {
    span {
        cursor: pointer;
        &:first-child {
            color: #655EFF;
            margin-right: 5px;
        }
        &:last-child {
            color: #FD4C2B;
        }
    }
}
/deep/ label[for="productUnit"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
/deep/ label[for="isFreeFreight"]::before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
}
.autoSaleTime {
    font-size: 12px;
    margin-left: 10px;
}
/deep/ .hide .el-upload--picture-card {
    display: none;
}
/deep/ .el-form-item__content {
    line-height: 21px;
}
.description {
    padding-top: 10px;
}
/deep/ .el-upload-list__item.is-uploading {
    display: none;
}
</style>


