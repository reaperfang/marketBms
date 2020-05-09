<template>
<div class="app-container add-goods">
    <!-- <header class="header">
        <div :class="{active: index == 0}" @click="scrollTo(0)" class="item">基本信息</div>
        <div :class="{active: index == 1}" @click="scrollTo(1)" class="item">销售信息</div>
        <div :class="{active: index == 2}" @click="scrollTo(2)" class="item">物流/售后</div>
        <div :class="{active: index == 3}" @click="scrollTo(3)" class="item">详情描述</div>
    </header> -->
    <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="152px" class="demo-ruleForm"><!--:disabled="ruleForm.isSyncProduct == 1 && authHide && hasLeiMu"-->
        <section class="form-section">
            <h2>基本信息</h2>
            <el-form-item label="商品类目" prop="productCategoryInfoId">
                <el-cascader
                    popper-class="leimu-popper"
                    @focus="leimuFocus"
                    @blur="leimuBlur"
                    @visible-change="visibleChange"
                    :options="itemCatList"
                    v-model="ruleForm.itemCat"
                    @change="itemCatHandleChange"
                    :props="{ multiple: false, checkStrictly: true }"
                    placeholder="请输入关键字"
                    clearable
                    filterable>
                </el-cascader>
                <span class="category-display">您当前的选择是：{{itemCatText}}</span>
                <p class="goods-message" v-if="leimuMessage != '' && leimuMessage == true && !itemCatText">历史类目已被禁用或删除，请您重新选择</p>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input :disabled="!ruleForm.productCategoryInfoId" style="width: 840px;" v-model="ruleForm.name" maxlength="60" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="description">
                <el-input :disabled="!ruleForm.productCategoryInfoId" style="width: 840px;" type="textarea" :rows="4" v-model="ruleForm.description" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="images">
                <!-- <img v-for="(item, key) of imageList" :key="key" :src="item.src" alt="" style="width:100px;height:100px"> -->
                <!-- <el-upload
                    :disabled="!ruleForm.productCategoryInfoId"
                    :action="uploadUrl"
                    accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
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
                    :before-upload="beforeUpload"
                    class="p_imgsCon">
                    <i class="el-icon-plus"></i>
                    <p style="line-height: 21px; margin-top: -39px; color: #92929B;">上传图片</p>
                </el-upload> -->
                <div class="upload-box">
                    <div class="image-list">
                        <div v-if="item" class="image-item" :style="{backgroundImage: `url(${item})`}" v-for="(item, index) in (ruleForm.images && ruleForm.images.split(',') || [])">
                            <label>
                                <i class="el-icon-check"></i>
                            </label>
                            <span class="image-item-actions">
                                <span @click="dialogImageUrl = item; imageDialogVisible = true" class="image-item-actions-preview"><i class="el-icon-zoom-in"></i></span>
                                <span @click="deleteImage(index)" class="image-item-actions-delete"><i class="el-icon-delete"></i></span>
                                <span class="image-item-actions-footer">
                                    <i class="lefter"><</i>
                                    <i class="righter">></i>
                                </span>
                            </span>
                        </div>
                        <div v-if="imagesLength < 6" @click="currentDialog = 'dialogSelectImageMaterial'; dialogVisible = true" class="upload-add">
                            <i data-v-03229368="" class="el-icon-plus"></i>
                            <p data-v-03229368="" style="line-height: 21px; margin-top: -39px; color: rgb(146, 146, 155);">上传图片</p>
                        </div>
                    </div>
                </div>
                <el-dialog :visible.sync="imageDialogVisible"
                :close-on-click-modal="false"
                :close-on-press-escape="false">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
                <!-- <span :style="{visibility: !ruleForm.productCategoryInfoId ? 'hidden' : 'visible'}" v-if="imagesLength < 6" @click="currentDialog = 'dialogSelectImageMaterial'; dialogVisible = true" class="material">素材库</span> -->
                <p class="upload-prompt">最多支持上传6张商品图片，默认第一张为主图；尺寸建议750x750（正方形模式）或750×1000（长图模式）像素以上，大小2M以下。</p>
            </el-form-item>
            <el-form-item class="productCatalogInfoId" label="商品分类" prop="productCatalogInfoIds">
                <div class="block" :class="{isIE: isIE}" style="display: inline-block;">
                    <el-cascader
                        ref="fenleiCascader"
						class="shop_classify_tag"
                        popper-class="fenlei-popper"
                        :disabled="!ruleForm.productCategoryInfoId"
                        :options="categoryOptions"
                        v-model="categoryValue"
                        @change="handleChange"
                        :props="{ multiple: true, checkStrictly: true }"
                        placeholder="请输入关键字"
                        filterable>
                    </el-cascader>
                </div>
                <div v-if="ruleForm.productCategoryInfoId" class="blue pointer" style="display: inline-block; margin-left: 24px; margin-right: 10px;">
                    <span @click="addCategory">新增分类</span>
                    <!-- <el-button type="primary" @click="getCategoryList">刷新</el-button> -->
                    <span class="shuaxin-fenlei" @click="getCategoryList">
                        刷新
                        <i></i>
                    </span>
                </div>
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
                <el-input :disabled="!ruleForm.productCategoryInfoId || (ruleForm.productCategoryInfoId && (ruleForm.isSyncProduct == 1 && authHide))" v-model="ruleForm.code" minlength="6" maxlength="18" placeholder="请输入商品编码"></el-input>
            </el-form-item>
        </section>
        <section class="form-section spec-form-section">
            <h2>销售信息</h2>
            <el-form-item label="规格信息" prop="goodsInfos">

            </el-form-item>
            <div class="goods-infos">
                <!-- <el-button :disabled="!ruleForm.productCategoryInfoId" v-if="!editor" class="border-button selection-specification" @click="selectSpecificationsCurrentDialog = 'SelectSpecifications'; currentDialog = ''; currentData = specsList; selectSpecificationsDialogVisible = true">选择规格</el-button> -->
                <div v-if="!editor" v-show="!(ruleForm.isSyncProduct == 1 && authHide)">
                    <ul class="added-specs">
                        <li v-for="(item, index) in addedSpecs" :key="index">
                            <div class="added-specs-header">
                                <span>{{item.name}}</span>
                                <el-button @click="deleteAddedSpec(index)">移除</el-button>
                            </div>
                            <ul class="spec-value-ul">
                                <li v-for="(spec, specValueIndex) in item.valueList" :key="specValueIndex">
                                    {{spec.name}}
                                    <i @click="deleteAddedSpecValue(index, specValueIndex)" data-v-03229368="" class="icon-circle-close"></i>
                                </li>
                            </ul>
                            <div class="add-specs-button">
                                <el-popover
                                    placement="bottom"
                                    width="430"
                                    :trigger="trigger"
                                    v-model="item.visible">
                                    <div class="add-specs-value">
                                        <div class="add-specs-value-input">
                                            <input  maxlength="50" @blur="specsValueBlur(index)" @focus="specsValueFocus(index)" v-model="item.newSpecValue" type="text" placeholder="选择或录入规格值">
                                            <el-button @click="addNewSpecValue(item, index)">新增</el-button>
                                        </div>
                                        <ul class="add-spec-value-ul">
                                            <li @click="selectSpecValue(index, valueIndex)" :class="{active: ValueItem.active}" v-for="(ValueItem, valueIndex) in item.list" :key="valueIndex">
                                                {{ValueItem.name}}
                                                <i v-if="ValueItem.type == 'new'" @click="(e) => {
                                                    deleteSpecValue(valueIndex, e, ValueItem)
                                                }" class="icon-circle-close"></i>
                                            </li>
                                            <div class="clear"></div>
                                        </ul>
                                        <p class="spec-message" v-if="item.focus && !item.list || (item.focus && item.list && !item.list.length)">暂无匹配项，您可新增规格值到列表</p>
                                        <div class="add-specs-value-footer">
                                            <el-button v-if="item.list && item.list.length" @click="specValueSubmit(false, index)" type="primary">确定</el-button>
                                            <el-button v-if="item.list && item.list.length" @click="specValueSubmit(false, index)">取消</el-button>
                                        </div>
                                    </div>
                                    <el-button v-show="addedSpecs.length" slot="reference" @click="addSpecValue(false, index)">添加规格值</el-button>
                                </el-popover>
                            </div>
                        </li>
                    </ul>
                    <div class="add-specs-button-box">
                        <div style="margin-right: 20px;" v-show="!showAddSpecsInput" class="add-specs-button">
                            <el-button class="spec-button" @click="addSpecs" type="primary">选择规格</el-button>
                        </div>
                    </div>
                    <div v-show="showAddSpecsInput" class="add-specs">
                        <div style="position: relative;" class="add-specs-input">
                            <input maxlength="50" v-model="newSpec" @focus="inputFocus" type="text" placeholder="选择或录入规格">
                            <el-button @click.native="addNewSpec">新增</el-button>
                        </div>
                        <ul class="spec-list" style="top: 35px;" v-show="showSpecsList">
                            <li style="font-size: 12px;" v-if="!specsList || (specsList && !specsList.length)">暂无匹配项，您可新增自定义规格到列表</li>
                            <li @click="addSpecClick(item)" v-for="item in specsList" :key="item.id">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <div v-else v-show="!(ruleForm.isSyncProduct == 1 && authHide)">
                    <ul class="added-specs">
                        <li v-for="(item, index) in addedSpecs" :key="index">
                            <div class="added-specs-header">
                                <span>{{item.name}}</span>
                                <!--<el-button @click="deleteAddedSpec(index)">移除</el-button>-->
                            </div>
                            <ul class="spec-value-ul">
                                <li v-for="(spec, specValueIndex) in item.valueList" :key="specValueIndex">
                                    {{spec.name}}
                                    <i @click="deleteAddedSpecValue(index, specValueIndex)" data-v-03229368="" class="icon-circle-close"></i>
                                </li>
                            </ul>
                            <div class="add-specs-button">
                                <el-popover
                                    placement="bottom"
                                    width="430"
                                    :trigger="trigger"
                                    v-model="item.visible">
                                    <div class="add-specs-value">
                                        <div class="add-specs-value-input">
                                            <input maxlength="50" @blur="specsValueBlur(index)" @focus="specsValueFocus(index)" v-model="item.newSpecValue" type="text" placeholder="选择或录入规格值">
                                            <el-button @click="addNewSpecValue(item, index)">新增</el-button>
                                        </div>
                                        <ul class="add-spec-value-ul">
                                            <li @click="selectSpecValue(index, valueIndex)" :class="{active: ValueItem.active}" v-for="(ValueItem, valueIndex) in item.list" :key="valueIndex">
                                                {{ValueItem.name}}
                                                <i v-if="ValueItem.type == 'new'" @click="(e) => {
                                                    deleteSpecValue(valueIndex, e, ValueItem)
                                                }" class="icon-circle-close"></i>
                                            </li>
                                            <div class="clear"></div>
                                        </ul>
                                        <p class="spec-message" v-if="item.focus && !item.list || (item.focus && item.list && !item.list.length)">暂无匹配项，您可新增规格值到列表</p>
                                        <div class="add-specs-value-footer">
                                            <el-button v-if="item.list && item.list.length" @click="specValueSubmit(false, index)" type="primary">确定</el-button>
                                        </div>
                                    </div>
                                    <el-button v-show="addedSpecs.length" slot="reference" @click="addSpecValue(false, index)">添加规格值</el-button>
                                </el-popover>
                            </div>
                        </li>
                    </ul>
                    <!-- <div class="add-specs-button-box">
                        <div style="margin-right: 20px;" v-show="!showAddSpecsInput" class="add-specs-button">
                            <el-button class="spec-button" @click="addSpecs" type="primary">选择规格</el-button>
                        </div>
                    </div> -->
                    <div v-show="showAddSpecsInput" class="add-specs">
                        <div style="position: relative;" class="add-specs-input">
                            <input maxlength="50" v-model="newSpec" @focus="inputFocus" type="text" placeholder="选择或录入规格">
                            <el-button @click.native="addNewSpec">新增</el-button>
                        </div>
                        <ul class="spec-list" style="top: 35px;" v-show="showSpecsList">
                            <li style="font-size: 12px;" v-if="!specsList || (specsList && !specsList.length)">暂无匹配项，您可新增自定义规格到列表</li>
                            <li @click="addSpecClick(item)" v-for="item in specsList" :key="item.id">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                <template v-if="!editor">
                    <el-button v-if="ruleForm.goodsInfos && ruleForm.goodsInfos.length" @click="batchFilling" class="batch-filling" type="primary">批量填充</el-button>
                    <!-- <el-table
                    class="spec-information"
                    :data="ruleForm.goodsInfos"
                    :header-cell-style="{background:'#f2ecff', color:'#655EFF'}"
                    style="width: 100%"
                    :span-method="objectSpanMethod"
                    border>
                    <el-table-column
                        class-name="columnSpec"
                        v-for="(item, index) in specsLabel.split(',')"
                        :key="index"
                        prop="label"
                        :label="item"
                        width="80">
                        <template slot-scope="scope">
                            {{scope.row.label.split(',') && scope.row.label.split(',')[index]}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="costPrice"
                        label="成本价"
                        class-name="costPrice operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.costPrice" placeholder="请输入价格(元)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="salePrice"
                        label="售卖价"
                        class-name="salePrice operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.salePrice" placeholder="请输入价格(元)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="stock"
                        label="库存"
                        class-name="stock operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.stock" placeholder="请输入库存"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="warningStock"
                        label="库存预警"
                        class-name="warningStock operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.warningStock" placeholder="请输入库存预警"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="weight"
                        label="重量"
                        class-name="weight operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.weight" placeholder="请输入重量(kg)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="volume"
                        label="体积"
                        class-name="volume operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.volume" placeholder="请输入体积(m³)"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="code"
                        label="SKU编码"
                        class-name="code operateInput"
                        width="152">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.code" placeholder="请输入SKU编码"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="image"
                        label="图片"
                        class-name="image"
                        width="152">
                        <template slot-scope="scope">
                            <el-upload
                                :disabled="!ruleForm.productCategoryInfoId"
                                class="upload-spec"
                                :action="uploadUrl"
                                :ref="`uploadImage_${scope.$index}`"
                                list-type="picture-card"
                                :file-list="scope.row.fileList"
                                :class="{hide:scope.row.image}"
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
                        width="152"
                        class-name="operateDelete">
                        <template slot-scope="scope">
                            <div class="spec-operate">
                                <span @click="emptySpec(scope.$index)">清空</span>
                                <span class="deleteSpan" @click="deleteSpec(scope.$index)">删除</span>
                            </div>
                        </template>
                    </el-table-column>
                    </el-table> -->
                    <Specs :list.sync="ruleForm.goodsInfos"
                        :specsLabel="specsLabel"
                        :productCategoryInfoId="ruleForm.productCategoryInfoId"
                        :uploadUrl="uploadUrl"
                        :hideDelete="hideDelete"
                        @handlePictureCardPreview="handlePictureCardPreview"
                        @specHandleRemove="specHandleRemove"
                        @specUploadSuccess="specUploadSuccess"
                        @emptySpec="emptySpec"
                        @deleteSpec="deleteSpec"></Specs>
                </template>
                <template v-else>
                    <!-- <el-table
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
                            width="180"
                            class-name="costPrice">
                            <template slot-scope="scope">
                                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="scope.row.costPrice" placeholder="请输入成本价"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="salePrice"
                            label="售卖价"
                            class-name="salePrice">
                            <template slot-scope="scope">
                                <span>¥{{scope.row.salePrice}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="stock"
                            label="库存"
                            class-name="stock">
                        </el-table-column>
                        <el-table-column
                            prop="warningStock"
                            label="库存预警"
                            class-name="warningStock">
                            <template slot-scope="scope">
                                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="scope.row.warningStock" placeholder="请输入库存预警"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="weight"
                            label="重量(kg)"
                            class-name="weight">
                            <template slot-scope="scope">
                                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="scope.row.weight" placeholder="请输入重量"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="volume"
                            label="体积(m³)"
                            class-name="volume">
                            <template slot-scope="scope">
                                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="scope.row.volume" placeholder="请输入体积"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="image"
                            label="图片"
                            class-name="image">
                            <template slot-scope="scope">
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
                            prop="code"
                            label="SKU编码"
                            class-name="code">
                            <template slot-scope="scope">
                                <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="scope.row.code" placeholder="请输入SKU编码"></el-input>
                            </template>
                        </el-table-column>
                    </el-table> -->
                    <Specs v-if="ruleForm.productSpecs" :list.sync="ruleForm.goodsInfos"
                        :specsLabel="specsLabel"
                        :productCategoryInfoId="ruleForm.productCategoryInfoId"
                        :uploadUrl="uploadUrl"
                        :hideDelete="hideDelete"
                        @handlePictureCardPreview="handlePictureCardPreview"
                        @specHandleRemove="specHandleRemove"
                        @specUploadSuccess="specUploadSuccess"
                        @emptySpec="emptySpec"
                        @deleteSpec="deleteSpec"></Specs>
                </template>
                <div class="prompt-box">
                    <el-checkbox :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.isShowStock">商品详情显示剩余库存</el-checkbox>
                    <span class="prompt">库存为0时，商品会自动放到“已售罄"列表里，保存有效库存数字后，买家看到的商品可售库存同步更新</span>
                </div>
                <!-- <el-button v-if="!editor" class="border-button" @click="currentDialog = 'AddSpecifications'; selectSpecificationsCurrentDialog = ''; dialogVisible = true">新增规格</el-button> -->
            </div>
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
                        :value="item.id">
                    </el-option>
                </el-select>
                <!-- <el-button class="border-button new-units">新增单位</el-button> -->
                <div style="margin-top: 21px;">
                    <el-checkbox :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.other">其他</el-checkbox>
                    <el-input :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.otherUnit" placeholder="请输入计量单位"></el-input>
                </div>
            </el-form-item>
            <!-- <el-form-item label="商品品牌" prop="productBrandInfoId">
                <el-select :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.productBrandInfoId" placeholder="请选择">
                    <el-option
                        v-for="item in brandList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <p class="goods-message" v-if="pinpaiMessage != '' && pinpaiMessage == true && ruleForm.productBrandInfoId == ''">历史品牌已被禁用或删除，请您重新选择</p>
            </el-form-item> -->
        </section>
        <section class="form-section">
            <h2>物流/售后</h2>
            <el-form-item label="上架时间" prop="status">
                <span style="font-size: 12px;">定时上架的商品在上架前为“下架”状态。</span>
                <span v-if="ruleForm.activity" class="activity-message">当前商品正在参与营销活动、待活动结束/失效才能编辑商品状态。</span>
                <div>
                    <el-radio-group :disabled="!ruleForm.productCategoryInfoId" v-model="ruleForm.status">
                        <el-radio :label="1">上架</el-radio>
                        <el-radio :disabled="editor && ruleForm.activity" :label="0">下架</el-radio>
                        <template v-if="editor">
                            <span><el-radio :disabled="ruleForm.activity" :label="2">定时上架</el-radio></span>
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
                    <div v-if="ruleForm.productCategoryInfoId" class="blue pointer" style="display: inline-block; margin-left: 24px; margin-right: 10px;">
                        <span @click="addTemplate">新增模板</span>
                        <!--<el-button type="primary" @click="getTemplateList">刷新</el-button>-->
                        <span class="shuaxin-fenlei" @click="getTemplateList">刷新<i></i></span>
                    </div>
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
                <RichEditor v-if="ruleForm.productCategoryInfoId" @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="(ruleForm.productDetail && ruleForm.productDetail != 'null') ? ruleForm.productDetail : ''"></RichEditor>
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
import Specs from '@/views/goods/components/specs'
import anotherAuth from '@/mixins/anotherAuth'
export default {
    name: 'addGoods',
    mixins: [anotherAuth],
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
                //productCatalogInfoId: '', // 商品商家分类ID
                productCatalogInfoIds: '', // 商品商家分类ID
                name: '', // 商品名称
                description: '', // 商品描述
                images: '', // 商品图片
                productCategoryInfoIds: '',
                selfSaleCount: '', // 自定义销量
                productLabelId: '', // 商品标签
                startSaleNum: 1, // 起售数量
                quantitySold: 0,
                //productBrandInfoId: '', // 商品品牌id
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
                productCatalogInfoIds: [
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
            leimuMessage: '',
            pinpaiMessage: '',
            catcheProductBrandInfoId: '',
            showSpecsList: false,
            addedSpecs: [],
            visible: false,
            specsValues: [],
            showAddSpecsValueButton: false,
            showAddSpecsInput: false,
            newSpec: '',
            newSpecValue: '',
            callObjectSpanMethod: false,
            deleteSpecArr: [],
            leimuSelected: false,
        }
    },
    created() {
        var that = this
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
        var that = this
        // Promise.all([this.getOperateCategoryList(), this.getCategoryList(), this.getProductLabelList(), this.getUnitList(), this.getBrandList(), this.getTemplateList()]).then(() => {
        //     if(this.$route.query.id && this.$route.query.goodsInfoId) {
        //         this.getGoodsDetail()
        //     }
        // })
        this.getOperateCategoryList()
        this.getCategoryList()
        this.getProductLabelList()
        this.getUnitList()
        this.getBrandList()
        this.getTemplateList()
        Promise.all([this.getOperateCategoryList(), this.getCategoryList()]).then(() => {
            if(this.$route.query.id && this.$route.query.goodsInfoId) {
                this.getGoodsDetail()
            }
        })
        document.querySelector('body').addEventListener('click', function(e) {
            //e.stopPropagation()
            this.hideFenlei = false
            if(e.target.parentNode.parentNode.className != 'add-specs') {
                that.showSpecsList = false
            }
            let parentNode = e.target.parentNode.parentNode.parentNode || e.target.parentNode.parentNode || e.target.parentNode
            if(parentNode.className != 'add-specs-button') {
                //that.visible = false
                let addedSpecs = JSON.parse(JSON.stringify(that.addedSpecs))

                addedSpecs.forEach(val => {
                    val.visible = false
                })
                that.addedSpecs = addedSpecs
            }

            if(that.editor) {
                that._globalEvent.$emit('addGoodsEvent', false);
            }
        })

        if(this.editor) {
            document.querySelector('body').click()
        }

        // this.$nextTick(() => {
        //     document.querySelector('.el-form-item.productCatalogInfoId .el-input__suffix').addEventListener('click', function(e) {
        //         that._globalEvent.$emit('addGoodsEvent', false);
        //     })
        // })

        if(this.editor) {
            this._globalEvent.$emit('addGoodsEvent', true);
        }

        console.log(this.$refs.fenleiCascader)
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
        },
        hideDelete() {
            if(this.ruleForm.isSyncProduct == 1 && this.authHide) {
                return true
            } else {
                return false
            }
        },
        hasLeiMu() {
            if(this.ruleForm.productCategoryInfoId) {
                if(this.operateCategoryList.find(val => val.id == this.ruleForm.productCategoryInfoId)) {
                    return true
                }
            }
            return false
        },
        isIE() {
            var userAgent = navigator.userAgent;
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE;
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                return true;
            } else if(isEdge) {
                return true;
            } else if(isIE11) {
                return true;
            }else{
                return false
            }
        },
        trigger() {
            if(this.isIE) {
                return 'click'
            } else {
                return 'manual'
            }
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
    beforeRouteEnter(to, from, next) {
        next(vm => {
            try {
                if(from.name == 'classify') {
                    let addGoods = localStorage.getItem('addGoods')
                    if(addGoods) {
                        vm.ruleForm = Object.assign({}, vm.ruleForm, JSON.parse(addGoods))
                        localStorage.removeItem('addGoods')
                    }
                }
            } catch(e) {
            }
        });
    },
    methods: {
        visibleChange(flag) {
            console.log(flag)
            if(flag) {
                this.leimuSelected = true
            } else {
                this.leimuSelected = false
            }
            this._globalEvent.$emit('addGoodsEvent', this.leimuSelected);
        },
        leimuFocus() {
            this.leimuSelected = true
            this._globalEvent.$emit('addGoodsEvent', this.leimuSelected);
        },
        leimuBlur() {
            // this.leimuSelected = false
            // this._globalEvent.$emit('addGoodsEvent', this.leimuSelected);
        },
        deleteImage(index) {
            let imagesArr = this.ruleForm.images.split(',')

            imagesArr.splice(index, 1)
            this.ruleForm.images = imagesArr.join(',')
        },
        beforeUpload(file) {
            console.log(file)
            if(file.size > 2097152) {
                this.$message({
                    message: '文件最大支持2M',
                    type: 'warning'
                });
                return false
            }
        },
        specValueSubmit(close, index) {
            this.getSpecs(close, index)
            this.closeSpecsValue(true, index)
        },
        specsValueFocus(index) {
            this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
                focus: true
            }))
        },
        specsValueBlur(index) {
            this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
                focus: false
            }))
        },
        deleteAddedSpecValue(index, specValueIndex) {
            if(this.$route.query.id) {
                if(this.ruleForm.goodsInfos && this.ruleForm.goodsInfos.some(val => val.activity)) {
                    this.$message({
                    message: '商品正在参加营销活动，不可删除',
                    type: 'warning'
                    });
                    return
                }
            }
            let addedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            let id

            id = addedSpecs[index].valueList[specValueIndex].id
            addedSpecs[index].valueList.splice(specValueIndex, 1)
            addedSpecs[index].list.forEach(val => {
                if(val.id == id) {
                    val.active = false
                }
            })
            this.addedSpecs = addedSpecs
            this.getSpecs(false, index)
        },
        batchFilling() {
            let goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))
            goodsInfos.forEach((val, index) => {
                val.costPrice = goodsInfos[0].costPrice
                val.salePrice = goodsInfos[0].salePrice
                val.stock = goodsInfos[0].stock
                val.warningStock = goodsInfos[0].warningStock
                val.weight = goodsInfos[0].weight
                val.volume = goodsInfos[0].volume
                val.image = goodsInfos[0].image
                val.fileList = goodsInfos[0].fileList
            })
            this.ruleForm.goodsInfos = goodsInfos
        },
        deleteSpecValue(index, e, item) {
            e.stopPropagation()
            let addedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            let name = item.name
            let flatIndex = this.flatSpecsList.findIndex(val => val.name == name)
            let copyAddedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            let flatCopyAddedSpecs = this.flatTreeArray(copyAddedSpecs, 'valueList')

            if(flatCopyAddedSpecs.find(val => val.name == name)) {
                this.$message({
                    message: '此规格值正在使用，不可删除',
                    type: 'warning'
                });
                return
            }
            addedSpecs[addedSpecs.length - 1].list.splice(index, 1)
            this.addedSpecs = addedSpecs
            this.specsValues.splice(index, 1)
            this.flatSpecsList.splice(flatIndex, 1)
        },
        addNewSpecValue(item, index) {
            let value = item.newSpecValue
            let lastAddedSpecs = this.addedSpecs[index]
            if(value == "") {
                this.$message({
                    message: '当前输入有误，请您重新输入',
                    type: 'warning'
                });
                return
            }
            if(!/[1-9a-zA-Z_\u4e00-\u9fa5]+/.test(value)) {
                this.$message({
                    message: '当前输入有误，请您重新输入',
                    type: 'warning'
                });
                return
            }
            if(/\s+/.test(value)) {
                this.$message({
                    message: '当前输入有误，请您重新输入',
                    type: 'warning'
                });
                return
            }
            // if(lastAddedSpecs.list.find(val => val.name == value)) {
            //     this.$message({
            //     message: '规格值不能与已有规格名重复，请您重新选择',
            //     type: 'warning'
            //     });
            //   return
            // }
            if(this.flatSpecsList.find(val => val.name == value)) {
                this.$message({
                message: '规格值不能与已有规格名或规格值重复，请您重新选择',
                type: 'warning'
                });
              return
            }
            const newChild = {
                id: new Date().getTime(),
                name: value,
                list: [],
                type: 'new',
                level: '2',
                parentId: lastAddedSpecs.id,
                active: false
            };
            if (!lastAddedSpecs.list) {
                this.$set(lastAddedSpecs, 'list', []);
            }
            let addedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            addedSpecs[index].list = addedSpecs[index].list || []
            addedSpecs[index].list.push(newChild)
            addedSpecs[index].newSpecValue = ''

            this.addedSpecs = addedSpecs
            this.flatSpecsList = [...this.flatSpecsList, newChild]
            this.addSpecValue(true)
            this.newSpecValue = ''

            let valueIndex = this.addedSpecs[index].list.findIndex(val => val.id == newChild.id)

            this.selectSpecValue(index, valueIndex)
            // this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
            //     visible: false
            // }))
        },
        addNewSpec() {
            if(this.newSpec == '' || /\s+/.test(this.newSpec)) {
                this.$message({
                    message: '当前输入有误，请您重新输入',
                    type: 'warning'
                });
                return
            }
            // if(this.specsList.find(val => val.name == this.newSpec)) {
            //     this.$message({
            //     message: '规格名称重复',
            //     type: 'warning'
            //     });
            //   return
            // }
            if(this.flatSpecsList.find(val => val.name == this.newSpec)) {
                this.$message({
                message: '规格名不能与已有规格名或规格值重复，请您重新选择',
                type: 'warning'
                });
              return
            }
            let newChild = {
                id: new Date().getTime(),
                name: this.newSpec,
                list: [],
                type: 'new',
                level: '1',
                parentId: '0',
                newSpecValue: ''
            }
            this.specsList = [...this.specsList, newChild]
            this.flatSpecsList.push({...newChild})
            this.newSpec = ''

            this.addSpecClick(newChild)
        },
        selectSpecs(arr) {
            let results = [];
            let result = [];
            if(typeof arr[0] != 'object') {
                this.ruleForm.goodsInfos = []
                return
            }
            function doExchange(arr, index){
                for (var i = 0; i<arr[index].length; i++) {
                    result[index] = arr[index][i];
                    if (index != arr.length - 1) {
                        doExchange(arr, index + 1)
                    } else {
                        results.push(result.join(','))
                    }
                }
            }
            doExchange(arr, 0);
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
                    fileList: [],
                    showCodeSpan: false
                }
            })
            this.ruleForm.goodsInfos.forEach((val, index) => {
                let label = val.label
                if(_results.find(spec => spec.label == label)) {
                    let specIndex = _results.findIndex(val => val.label == label)

                    _results.splice(specIndex, 1, Object.assign({}, this.ruleForm.goodsInfos[index]))
                }
            })
            let ___results = this.computedList(_results)

            this.ruleForm.goodsInfos = ___results
        },
        computedList(arr) {
            let _list = JSON.parse(JSON.stringify(arr))

            _list.forEach((val, index) => {
                for(let i in val) {
                    if(val.hasOwnProperty(i)) {
                        if(/\_hide$/.test(i)) {
                            //val[i] = false
                            delete val[i]
                        }
                        if(/\_rowspan$/.test(i)) {
                            //val[i] = 1
                            delete val[i]
                        }
                    }
                }
            })

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
                        let specs = val.specs

                        if(typeof specs == 'string') {
                            specs = JSON.parse(specs)
                        }

                        for(let i in specs) {
                            if(specs.hasOwnProperty(i)) {
                                if(specs[i] == specValue) {
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
                        if(labelIndex == labelArr.length - 2) {
                            val['image_rowspan'] = retObj.number
                            if(index != retObj.index) {
                                val['image_hide'] = true
                            }
                        }
                    })
                }
            })

            return _list
        },
        deleteAddedSpec(index) {
            if(this.$route.query.id) {
                if(this.ruleForm.goodsInfos && this.ruleForm.goodsInfos.some(val => val.activity)) {
                    this.$message({
                    message: '商品正在参加营销活动，不可删除',
                    type: 'warning'
                    });
                    return
                }
            }
            let name = this.addedSpecs[index].name
            let _index = this.flatSpecsList.findIndex(val => val.name == name)

            this.flatSpecsList.splice(_index, 1)
            this.specsList.splice(this.specsList.findIndex(val => val.name == name), 1)
            if(this.addedSpecs[index].valueList) {
                this.addedSpecs[index].valueList.forEach(val => {
                    let name = val.name

                    this.flatSpecsList.splice(this.flatSpecsList.findIndex(val => val.name == name), 1)
                })
            }
            this.addedSpecs.splice(index, 1)
            this.specsLabel = this.specsLabel.split(',').splice(index, 1).join(',')
            this.getSpecs(false, index)
        },
        closeSpecsValue(close, index) {
            if(close) {
                this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
                    visible: false
                }))
            } else {
                this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
                    visible: true
                }))
            }
        },
        getSpecs(open, index) {
            this.callObjectSpanMethod = true
            let arr = []
            // this.addedSpecs.forEach(val => {
            //     val.valueList.forEach(value => {
            //         let _arr = []
            //         _arr.push(val.id)
            //         _arr.push(value.id)
            //         arr.push(_arr)
            //     })
            // })
            this.addedSpecs.forEach(val => {
                let _arr = []
                val.valueList.forEach(item => {
                    _arr.push(item.id)
                })
                arr.push(_arr)
            })
            this.specIds = arr
            this.selectSpecs(arr)
            //this.deleteStyle()
            this.deleteSpecArr = []
            // if(open && typeof open == 'boolean') {
            //     this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
            //         visible: true
            //     }))
            // } else {
            //     this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
            //         visible: false
            //     }))
            // }
        },
        selectSpecValue(index, valueIndex) {
            let addedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            let specsValues = addedSpecs[index].list
            let id = specsValues[valueIndex].id
            specsValues[valueIndex].active = !specsValues[valueIndex].active
            this.specsValues = specsValues

            if(specsValues[valueIndex].active) {
                if(!this.addedSpecs[index].valueList.find(val => val.id == id)) {
                    addedSpecs[index].valueList.push(specsValues[valueIndex])
                    this.addedSpecs = addedSpecs
                }
            } else {
                let item = this.addedSpecs[index].valueList.find(val => val.id == id)

                if(this.addedSpecs[index].valueList.find(val => val.id == id)) {
                    let _index = this.addedSpecs[index].valueList.findIndex(val => val.id == id)
                    addedSpecs[index].valueList.splice(_index, 1)
                    this.addedSpecs = addedSpecs
                }
            }
            this.getSpecs(true, index)
        },
        addSpecValue(open, index) {
            let item = this.addedSpecs[this.addedSpecs.length - 1]
            let list = JSON.parse(JSON.stringify(item.list))

            list.forEach(val => {
                if(this.addedSpecs[this.addedSpecs.length - 1].valueList.find(valItem => valItem.id == val.id)) {
                    val.active = true
                } else {
                    val.active = false
                }
            })
            this.specsValues = list
            if(!open) {
                //this.visible = !this.visible
                this.addedSpecs.splice(index, 1, Object.assign({}, this.addedSpecs[index], {
                    visible: !this.addedSpecs[index].visible
                }))
            }
            console.log(this.addedSpecs)
        },
        addSpecClick(item) {
            if(this.addedSpecs.find(val => val.id == item.id)) {
                this.$message({
                    message: '规格不能重复添加',
                    type: 'warning'
                });
                return
            }
            let _item = JSON.parse(JSON.stringify(item))
            _item.valueList = []
            this.addedSpecs = Object.assign([], [...this.addedSpecs, _item])
            this.showSpecsList = false
            this.showAddSpecsInput = false
        },
        inputFocus() {
            this.showSpecsList = true
        },
        inputBlur() {
            this.showSpecsList = false
        },
        addSpecs() {
            this.callObjectSpanMethod = false
            if(this.addedSpecs.find(val => !val.valueList.length)) {
                this.$message({
                    message: '请添加规格值',
                    type: 'warning'
                });
                return
            }
            this.showAddSpecsInput = true
        },
        getNumber(row, column, rowIndex, columnIndex) {
            let goodsInfos = [...this.ruleForm.goodsInfos]
            let label = row.label
            let labbelArr = label.split(',')
            let number = 0
            let prevLabelArr = labbelArr.slice(0, columnIndex + 1)
            let prevLabel = prevLabelArr.join(',')

            if(columnIndex == labbelArr.length - 1) return number

            goodsInfos.forEach((val, index) => {
                let _label = val.label
                let _labbelArr = _label.split(',')
                let _prevLabelArr = _labbelArr.slice(0, columnIndex + 1)
                let _prevLabel = _prevLabelArr.join(',')

                if(_prevLabel == prevLabel) number++
            })
            return number
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if(!this.callObjectSpanMethod) return
            let length = this.addedSpecs.length
            let addedSpecs = JSON.parse(JSON.stringify(this.addedSpecs))
            if(length) {
                var index = columnIndex
                var val = addedSpecs[index]
                var number = 1
                if(columnIndex > length - 2) {
                    if(column.property == 'image1') {
                        if(length > 1) {
                            let arr = addedSpecs.slice(1)
                            number = arr.reduce((prev, cur) => {
                                return prev*cur.valueList.length
                            }, 1)
                            //number = this.getNumber(row, column, rowIndex, columnIndex)
                            if(number != 1) {
                                if(rowIndex % number === 0) {
                                    if((rowIndex == this.ruleForm.goodsInfos.length - 1) && (columnIndex == this.addedSpecs.length + 9 - 1)) {
                                        this.callObjectSpanMethod = false
                                    }
                                    return {
                                        rowspan: number,
                                        colspan: 1
                                    }
                                } else {
                                    if((rowIndex == this.ruleForm.goodsInfos.length - 1) && (columnIndex == this.addedSpecs.length + 9 - 1)) {
                                        this.callObjectSpanMethod = false
                                    }
                                    return {
                                        rowspan: 0,
                                        colspan: 0
                                    }
                                }
                            }
                        }
                    }
                    return
                }
                if(index + 1 < length) {
                    let arr = addedSpecs.slice(index + 1)
                    // number = arr.reduce((prev, cur) => {
                    //     return prev*cur.valueList.length
                    // }, 1)
                    number = this.getNumber(row, column, rowIndex, columnIndex)
                }
                if(number != 1) {
                    if(rowIndex % number === 0) {
                        return {
                            rowspan: number,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
        },
        changeUpload() {
            this.hideUpload = this.imagesLength >= 6
        },
        addCategory() {
            // this.currentDialog = 'AddCategoryDialog'
            // this.currentData = {level: 0, add: true}
            // this.dialogVisible = true
            localStorage.setItem('addGoods', JSON.stringify(this.ruleForm))
            //this.$router.push('/goods/classify')
            let routeData = this.$router.resolve({ path: '/goods/classify' });
            window.open(routeData.href, '_blank');
        },
        addTemplate() {
            localStorage.setItem('addGoods', JSON.stringify(this.ruleForm))
            let routeData = this.$router.resolve({ path: '/order/newTemplate', query: {mode: 'new'} });
            window.open(routeData.href, '_blank');
            // this.$nextTick(() => {
            //     let a = document.createElement('a')

            //     a.href = '/bp/order/newTemplate?mode=new'
            //     a.target = '_blank'

            //     a.click()
            // })
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
                    this.$message.error({
                        message: error,
                        type: 'error'
                    });
                    reject(error)
                })
            })
        },
        deleteStyle() {
            this.$nextTick(() => {
                try {
                    let trs = document.querySelectorAll('.el-table.spec-information .el-table__body tbody tr')
                    trs.forEach(tr => {
                        let elem = tr

                        if(elem.getAttribute('comstomerdelete')) {
                            elem.style.background = '#fff'
                            let tds = elem.getElementsByTagName('td')

                            for(let i=0; i<tds.length; i++) {
                                if(+tds[i].getAttribute('rowspan') > 1) {
                                    tds[i].style.background = '#fff'
                                    if(tds[i].querySelector('.cell s')) {
                                            tds[i].querySelector('.cell').innerHTML = tds[i].querySelector('.cell s').innerText
                                        }
                                } else {
                                    if(tds[i].className.indexOf('columnSpec') != -1) {

                                        if(tds[i].querySelector('.cell s')) {
                                            tds[i].querySelector('.cell').innerHTML = tds[i].querySelector('.cell s').innerText
                                        }
                                    } else {
                                        if(tds[i].className.indexOf('operateInput') != -1) {
                                            tds[i].querySelector('.cell input').removeAttribute('disabled')
                                        }
                                        if(tds[i].className.indexOf('operateDelete') != -1) {
                                            tds[i].querySelector('.cell .spec-operate .deleteSpan').style.display = 'inline-block'
                                        }
                                    }
                                }

                            }
                        }
                    })
                } catch(e) {
                    console.error(e)
                }

            })
        },
        addStyle(index) {
            this.$nextTick(() => {
                // this.deleteSpecArr.forEach(val => {
                //     let elem = document.querySelector('.el-table.spec-information .el-table__body').getElementsByClassName('el-table__row')[val]

                //     elem.style.background = '#ddd'
                //     let tds = elem.getElementsByTagName('td')

                //     for(let i=0; i<tds.length; i++) {
                //         if(+tds[i].getAttribute('rowspan') > 1) {
                //             tds[i].style.background = '#fff'
                //         } else {
                //             if(tds[i].className.indexOf('columnSpec') != -1) {
                //                 tds[i].querySelector('.cell').innerHTML = '<s>' + tds[i].querySelector('.cell').innerText + '</s>'

                //             } else {
                //                 if(tds[i].className.indexOf('operateInput') != -1) {
                //                     tds[i].querySelector('.cell input').setAttribute('disabled', true)
                //                 }
                //                 if(tds[i].className.indexOf('operateDelete') != -1) {
                //                     tds[i].querySelector('.cell .spec-operate .deleteSpan').remove()
                //                 }
                //             }
                //         }

                //     }
                // })
                let elem = document.querySelector('.el-table.spec-information .el-table__body').getElementsByClassName('el-table__row')[index]

                    elem.setAttribute('comstomerdelete', true)
                    elem.style.background = '#ddd'
                    let tds = elem.getElementsByTagName('td')

                    for(let i=0; i<tds.length; i++) {
                        if(+tds[i].getAttribute('rowspan') > 1) {
                            tds[i].style.background = '#fff'
                        } else {
                            if(tds[i].className.indexOf('columnSpec') != -1) {
                                tds[i].querySelector('.cell').innerHTML = '<s>' + tds[i].querySelector('.cell').innerText + '</s>'

                            } else {
                                if(tds[i].className.indexOf('operateInput') != -1) {
                                    tds[i].querySelector('.cell input').setAttribute('disabled', true)
                                }
                                if(tds[i].className.indexOf('operateDelete') != -1) {
                                    //tds[i].querySelector('.cell .spec-operate .deleteSpan').remove()
                                    tds[i].querySelector('.cell .spec-operate .deleteSpan').style.display = 'none'
                                }
                            }
                        }

                    }
            })
        },
        deleteSpec(index) {
            if(this.ruleForm.goodsInfos[index].activity) {
                this.confirm({title: '立即删除', icon: true, text: '当前商品正在参与营销活动，活动有效期内商品不得“删除”。', showCancelButton: false, confirmText: '我知道了'}).then(() => {

                })
                return
            }
            this.confirm({title: '立即删除', icon: true, text: '是否确认删除？'}).then(() => {
                console.log(index)
                let _goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))
                let __goodsInfos

                _goodsInfos.splice(index, 1)
                __goodsInfos = this.computedList(_goodsInfos)
                this.ruleForm.goodsInfos = __goodsInfos
            })


            // this.confirm({title: '立即删除', customClass: 'goods-custom', icon: true, text: '是否确认删除？'}).then(() => {
            //     this.deleteSpecArr.push(index)
            //     this.addStyle(index)
            // }).catch(() => {
            //     this.$message({
            //         type: 'info',
            //         message: '已取消删除'
            //     });
            // })
        },
        emptySpec(index) {
            this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                costPrice: '',
                //salePrice: '',
                //stock: '',
                warningStock: '',
                weight: '',
                volume: '',
                image: '',
                code: !(this.ruleForm.isSyncProduct == 1 && this.authHide) ? '' : this.ruleForm.goodsInfos[index].code
            }))
            this.$refs[`uploadImage_${index}`].clearFiles()
            console.log(this.ruleForm.goodsInfos)
        },
        specHandleRemove(index) {
            let goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))
            if(this.ruleForm.goodsInfos[index].label.split(',') && this.ruleForm.goodsInfos[index].label.split(',').length > 1) {
                let spec = this.ruleForm.goodsInfos[index].label.split(',')[0]
                goodsInfos.forEach(val => {
                    if(val.label.split(',')[0] == spec) {
                        val.image = '',
                        val.fileList = []
                    }
                })
                this.ruleForm.goodsInfos = goodsInfos
            } else {
                this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                    image: ''
                }))
            }
        },
        specUploadSuccess(response, file, fileList, index, row) {
            if(file.status == "success"){
                fileList[0].url = fileList[0].response.data.url;
                row.fileList = [].concat(fileList);
                this.$message.success(response.msg);
                //this.ruleForm.goodsInfos[index].image = response.data.url
                if(!this.editor) {
                    let goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))
                    if(row.label && row.label.split(',') && row.label.split(',').length > 1) {
                        let spec = row.label.split(',')[0]
                        goodsInfos.forEach(val => {
                            if(val.label.split(',')[0] == spec) {
                                val.image = response.data.url
                            }
                        })
                        this.ruleForm.goodsInfos = goodsInfos
                    } else {
                        this.ruleForm.goodsInfos.splice(index, 1, Object.assign({}, this.ruleForm.goodsInfos[index], {
                            image: response.data.url
                        }))
                    }
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
        computedAddSpecs(specs) {
            let _specs
            let _addedSpecs = []

            let computedSpecValue = (specValues, list, parentId) => {
                specValues.forEach(specValue => {
                    let flatSpecsValue = this.flatSpecsList.find(val => val.name == specValue)

                    if(flatSpecsValue) {
                        let _flatSpecsValue = JSON.parse(JSON.stringify(flatSpecsValue))

                        _flatSpecsValue = Object.assign({}, _flatSpecsValue, {
                            active: true
                        })
                        if(!list.list) {
                            this.$set(list, 'list', []);
                        }
                        list.valueList.push(_flatSpecsValue)
                        list.list.push(_flatSpecsValue)
                    } else {
                        let valueItem = {
                            id: new Date().getTime() + '' + specValue,
                            parentId: parentId || '0',
                            name: specValue,
                            active: true
                        }

                        this.flatSpecsList = [...this.flatSpecsList, Object.assign({}, valueItem, {
                            active: false
                        })]
                        if(!list.list) {
                            this.$set(list, 'list', []);
                        }
                        list.valueList.push(valueItem)
                        list.list.push(valueItem)
                    }
                })
            }

            if(typeof specs == 'string') {
                _specs = JSON.parse(specs)
            }
            //"{"网络":["移动","联通"],"质地":["细","粗"]}"
            for(let i in _specs) {
                if(_specs.hasOwnProperty(i)) {
                    let obj = {}
                    let specName = i
                    let specValues = _specs[i]
                    let flatSpecsItem = this.flatSpecsList.find(val => val.name == specName)

                    if(flatSpecsItem) {
                        let _flatSpecsItem = JSON.parse(JSON.stringify(flatSpecsItem))
                        let flatSpecsItemId = _flatSpecsItem.id

                        _flatSpecsItem = Object.assign({}, _flatSpecsItem, {
                            newSpecValue: '',
                            active: false,
                            visible: false,
                            focus: false,
                            valueList: []
                        })

                        computedSpecValue(specValues, _flatSpecsItem, flatSpecsItemId)

                        _addedSpecs.push(_flatSpecsItem)
                    } else {
                        let specItem = {
                            id: new Date().getTime() + specName,
                            name: specName,
                            parentId: '0',
                            list: [],
                            valueList: [],
                            newSpecValue:"",
                            active:false,
                            visible:false,
                            focus:false,
                        }

                        this.flatSpecsList = [...this.flatSpecsList, JSON.parse(JSON.stringify(specItem))]
                        computedSpecValue(specValues, specItem, specItem.id)
                        _addedSpecs.push(specItem)
                    }
                }
            }

            this.addedSpecs = _addedSpecs
        },
        sortGoodsInfos({productSpecs, goodsInfos}) {
            let _productSpecs = JSON.parse(productSpecs)
            let productSpecsArr = []
            let results = [];
            let result = [];

            function doExchange(arr, index) {
                for (let i = 0; i<arr[index].length; i++) {
                    result[index] = arr[index][i];
                    if (index != arr.length - 1) {
                        doExchange(arr, index + 1)
                    } else {
                        results.push(result.join(','))
                    }
                }
            }



            // {"版本类型":["中国大陆","日韩"],"颜色":["白色","灰色"],"存储容量":["256G","512G","1TB"]}
            for(let i in _productSpecs) {
                if(_productSpecs.hasOwnProperty(i)) {
                    productSpecsArr.push(_productSpecs[i])
                }
            }

            doExchange(productSpecsArr, 0)



            goodsInfos.sort((a, b) => {
                let aIndex = results.findIndex(val => val == a.label)
                let bIndex = results.findIndex(val => val == b.label)

                return aIndex - bIndex
            })

            return goodsInfos
        },
        getMarketActivity(ids) {
             return new Promise((resolve, reject) => {
                this._apis.goods.getMarketActivity({ids}).then((res) => {
                    resolve(res)
                }).catch(error => {
                    this.$message.error({
                    message: error,
                    type: 'error'
                });
                    reject(error)
                })
            })
        },
        setGoodsImage(arr) {
            arr.forEach((val, index) => {
                if(val.image_rowspan && val.image_rowspan > 1) {
                    if(!val.image && !val.image_hide) {
                        let _arr = arr.slice(index, index + val.image_rowspan)
                        
                        if(_arr && _arr.length) {
                            let imageArr = _arr.filter(val => val.image)

                            if(imageArr && imageArr.length) {
                                val.image = imageArr[0].image
                            }
                        }
                    }
                }
            })
        },
        getGoodsDetail() {
            let {id, goodsInfoId} = this.$route.query
            var that = this
            this._apis.goods.getGoodsDetail({id}).then(res => {
                console.log(res)
                let arr = []
                let itemCatAr = []
                let __goodsInfos


                if(this.isIE) {
                    if(this.editor) {
                        let flag = []

                        let timer = setInterval(() => {
                        
                            if(this.$refs.fenleiCascader.dropDownVisible) {
                                this.$refs.fenleiCascader.toggleDropDownVisible(false)
                                this._globalEvent.$emit('addGoodsEvent', false);

                                clearInterval(timer)
                            }
                        }, 500)
                    }
                }
                this.specsLabel = Object.keys(JSON.parse(res.productSpecs)).join(',')

                res.goodsInfos.forEach(val => {
                    let label = Object.values(JSON.parse(val.specs)).join(',')

                    val.label = label
                    val.editorDisabled = true
                    val.showCodeSpan = false
                })
                res.goodsInfos = this.sortGoodsInfos(res)
                this.computedAddSpecs(res.productSpecs)

                __goodsInfos = this.computedList(res.goodsInfos)
                this.setGoodsImage(__goodsInfos)
                res.goodsInfos = __goodsInfos
                res.productCatalogInfoIds.forEach((id, index) => {
                    let _arr = []
                    this.getCategoryIds(_arr, id)
                    arr.push(_arr)
                })
                this.getCategoryInfoIds(itemCatAr, res.productCategoryInfoId)
                let _arr = itemCatAr.map(id => {
                    return this.operateCategoryList.find(val => val.id == id)
                })
                this.itemCatText = _arr.map(val => val.name).join(' > ')
                let specs = JSON.parse(res.productSpecs)
                let specsLabelArr = []
                let labelArr = []
                for(let i in specs) {
                    if(specs.hasOwnProperty(i)) {
                        specsLabelArr.push(i)
                        labelArr.push(specs[i])
                    }
                }
                this.specsLabel = specsLabelArr.join(',')
                //res.goodsInfo.label = labelArr.join(',')


                try {
                    this.getMarketActivity([res.id]).then((activityRes) => {
                        activityRes.forEach((val, index) => {
                            res.activity = true
                            if(val.isParticipateActivity) {
                                res.goodsInfos.forEach(val => {
                                    val.activity = true
                                })
                            } else {
                                if(val.goodsInfos) {
                                    val.goodsInfos.forEach(skuVal => {
                                        let skuid = skuVal.id
                                        let item = res.goodsInfos.find(val => val.id == skuid)

                                        if(item) {
                                            item.activity = true
                                        }
                                    })
                                }
                            }
                        })

                        this.ruleForm = Object.assign({}, this.ruleForm, res, {
                            //goodsInfos: [res.goodsInfo]
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
                                this.$message.error({
                                    message: error,
                                    type: 'error'
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
                            this.ruleForm.productLabelId = '0'
                        }
                        this.ruleForm.isShowSaleCount = this.ruleForm.isShowSaleCount == 1 ? true : false
                        this.ruleForm.isShowStock = this.ruleForm.isShowStock == 1 ? true : false
                        if(!this.itemCatText) {
                            this.leimuMessage = true
                            this.ruleForm.productCategoryInfoId = ''
                        }
                        // if(this.ruleForm.productBrandInfoId && !this.brandList.filter(val => val.enable == 1).find(val => val.id == this.ruleForm.productBrandInfoId)) {
                        //     this.catcheProductBrandInfoId = this.ruleForm.productBrandInfoId
                        //     this.ruleForm.productBrandInfoId = ''
                        //     this.pinpaiMessage = true
                        // }
                        if(this.ruleForm.productDetail) {
                            //this.ruleForm.productDetail = window.decodeURIComponent(window.atob(this.ruleForm.productDetail))
                            this.ruleForm.productDetail = window.unescape(this.ruleForm.productDetail)
                        }
                        // if(this.ruleForm.productDetail) {
                        //     let _productDetail = ''
                        //     _productDetail = decodeURIComponent(escape(window.atob(this.ruleForm.productDetail)))
                        //     this.ruleForm.productDetail = _productDetail
                        // }
                    })
                } catch(e) {
                    console.error(e)
                }


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
                    val.newSpecValue = ''
                    val.active = false
                    val.visible = false
                    val.focus = false
                })
                this.specsList = res
                //this.specsLength = this.specsList.length
                this.flatSpecsList = this.flatTreeArray(JSON.parse(JSON.stringify(res)), 'list')
            }).catch(error => {
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        addGoods(params) {
            this._apis.goods.addGoods(params).then(res => {
                this.$message({
                    message: '新增成功！',
                    type: 'success'
                });
                this.$router.push('/goods/goodsList')
            }).catch(error => {
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        editorGoods(params) {
            this._apis.goods.editorGoods(params).then(res => {
                this.$message({
                    message: '编辑成功！',
                    type: 'success'
                });
                this.$router.push('/goods/goodsList')
            }).catch(error => {
                this.$message.error({
                    message: error,
                    type: 'error'
                });
            })
        },
        submitGoods(formName) {
            this.$refs[formName].validate((valid) => {
                if(this.ruleForm.other) {
                        if(!this.ruleForm.otherUnit) {
                            this.$message({
                                message: '请输入计量单位',
                                type: 'warning'
                            });
                            return
                        }
                    } else {
                        if(!this.ruleForm.productUnit) {
                            this.$message({
                                message: '请选择计量单位',
                                type: 'warning'
                            });
                            return
                        }
                    }
                if (valid) {
                    if(this.ruleForm.other) {
                        if(/\s+/.test(this.ruleForm.otherUnit)) {
                            this.$message({
                                message: '单位计量不能为空',
                                type: 'warning'
                            });
                            return
                        }
                    }

                    let params
                    let _goodsInfos
                    let obj = {
                        isShowSaleCount: this.ruleForm.isShowSaleCount ? 1 : 0,
                        isShowStock: this.ruleForm.isShowStock ? 1 : 0,
                        productUnit: this.ruleForm.other ? this.ruleForm.otherUnit : this.ruleForm.productUnit,
                    }
                    let calculationWay
                    try {
                        this.ruleForm.goodsInfos.forEach((val, index) => {
                            if(val.image_hide) {
                                // let image = this.ruleForm.goodsInfos[index - (val.image_rowspan - 1)].image

                                // val.image = image
                                val.image = this.ruleForm.goodsInfos[index - 1].image
                            }
                        })

                        for(let i=0; i<this.ruleForm.goodsInfos.length; i++) {
                            //this.ruleForm.goodsInfos[i].fileList && (this.ruleForm.goodsInfos[i].fileList = null)
                        // if(!/^[a-zA-Z0-9_]{6,}$/.test(this.ruleForm.goodsInfos[i].code)) {
                        //     this.$message({
                        //         message: '当前SKU编码输入有误，请您重新输入',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(!this.ruleForm.goodsInfos[i].code) {
                        //     this.$message({
                        //          message: '当前SKU编码输入有误，请您重新输入',
                        //          type: 'warning'
                        //      });
                        //      return
                        // }
                        if(this.ruleForm.goodsInfos[i].image == '') {
                            this.$message({
                                message: '请上传图片',
                                type: 'warning'
                            });
                            return
                        }
                        if(this.ruleForm.goodsInfos[i].costPrice == '') {
                            this.$message({
                                message: '请输入成本价',
                                type: 'warning'
                            });
                            return
                        }
                        if(+this.ruleForm.goodsInfos[i].costPrice <= 0) {
                            this.$message({
                                message: '成本价必须大于0',
                                type: 'warning'
                            });
                            return
                        }
                        if(/\./.test(this.ruleForm.goodsInfos[i].costPrice) && this.ruleForm.goodsInfos[i].costPrice.split(".")[1].length > 2) {
                            this.$message({
                                message: '只支持小数点后两位',
                                type: 'warning'
                            });
                            return
                        }
                        if(this.ruleForm.goodsInfos[i].salePrice == '') {
                            this.$message({
                                message: '请输入售卖价',
                                type: 'warning'
                            });
                            return
                        }
                        if(+this.ruleForm.goodsInfos[i].salePrice <= 0) {
                            this.$message({
                                message: '售卖价必须大于0',
                                type: 'warning'
                            });
                            return
                        }
                        if(/\./.test(this.ruleForm.goodsInfos[i].salePrice) && this.ruleForm.goodsInfos[i].salePrice.split(".")[1].length > 2) {
                            this.$message({
                                message: '只支持小数点后两位',
                                type: 'warning'
                            });
                            return
                        }
                        if(this.ruleForm.goodsInfos[i].stock === '') {
                            this.$message({
                                message: '请输入库存',
                                type: 'warning'
                            });
                            return
                        }
                        if(+this.ruleForm.goodsInfos[i].stock  < 0) {
                            this.$message({
                                message: '不能为负值',
                                type: 'warning'
                            });
                            return
                        }
                        if(+this.ruleForm.goodsInfos[i].stock  > 10000000) {
                            this.$message({
                                message: '库存不能超过10000000',
                                type: 'warning'
                            });
                            return
                        }
                        if(!this.ruleForm.goodsInfos[i].warningStock) {
                            this.$message({
                                message: '请输入库存预警',
                                type: 'warning'
                            });
                            return
                        }
                        if(+this.ruleForm.goodsInfos[i].warningStock  < 0) {
                            this.$message({
                                message: '不能为负值',
                                type: 'warning'
                            });
                            return
                        }
                        // if(+this.ruleForm.goodsInfos[i].weight  <= 0) {
                        //     this.$message({
                        //         message: '重量必须大于0',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(+this.ruleForm.goodsInfos[i].volume  <= 0) {
                        //     this.$message({
                        //         message: '体积必须大于0',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                    }
                    } catch(e) {
                        console.error(e)
                    }
                    if(this.ruleForm.name == '' || /^\s+$/.test(this.ruleForm.name)) {
                        this.$message({
                            message: '商品名称不能为空',
                            type: 'warning'
                        });
                        return
                    }

                    if(this.ruleForm.isFreeFreight == 0) {
                        let id = this.ruleForm.freightTemplateId
                        calculationWay = this.shippingTemplates.find(val => val.id == id).calculationWay
                        if(calculationWay == 3) {
                            if(this.ruleForm.goodsInfos.some(val => !val.volume)) {
                                this.$message({
                                    message: '规格信息中体积不能为空',
                                    type: 'warning'
                                });
                                return
                            }
                        } else if(calculationWay == 2) {
                            if(this.ruleForm.goodsInfos.some(val => !val.weight)) {
                                this.$message({
                                    message: '规格信息中重量不能为空',
                                    type: 'warning'
                                });
                                return
                            }
                        }
                    }
                    // if(this.editor) {
                    //     if(this.ruleForm.goodsInfos.some(val => val.costPrice == '')) {
                    //         this.$message({
                    //             message: '规格信息中成本价不能为空',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    //     if(!this.editor && this.ruleForm.goodsInfos.some(val => val.salePrice == '')) {
                    //         this.$message({
                    //             message: '规格信息中售卖价不能为空',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    //     if(!this.editor && this.ruleForm.goodsInfos.some(val => val.stock == '')) {
                    //         this.$message({
                    //             message: '规格信息中库存不能为空',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    //     if(!this.editor && this.ruleForm.goodsInfos.some(val => +val.stock < 0)) {
                    //         this.$message({
                    //             message: '规格信息中库存不能小于0',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    //     if(this.ruleForm.goodsInfos.some(val => !val.warningStock)) {
                    //         this.$message({
                    //             message: '规格信息中库存预警不能为空',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    //     if(this.ruleForm.goodsInfos.some(val => val.image == '')) {
                    //         this.$message({
                    //             message: '规格信息中图片不能为空',
                    //             type: 'warning'
                    //         });
                    //         return
                    //     }
                    // }

                    // if(this.ruleForm.productDetail) {
                    //     let _productDetail = ''
                    //     _productDetail = btoa(unescape(encodeURIComponent(this.ruleForm.productDetail)));
                    //     obj.productDetail = _productDetail
                    // }
                    if(this.categoryValue) {
                        let categoryValue = JSON.parse(JSON.stringify(this.categoryValue))
                        let arr = []
                        categoryValue.forEach(val => {
                            arr.push(val.pop())
                        })

                        this.ruleForm.productCatalogInfoIds = arr
                    }
                    //if(!this.editor) {
                        let __goodsInfos = JSON.parse(JSON.stringify(this.ruleForm.goodsInfos))

                        __goodsInfos.forEach(val => {
                            val.fileList = null
                        })
                        // let _deleteSpecArr = Array.from(new Set(this.deleteSpecArr))
                        // if(_deleteSpecArr.length) {
                        //     for(let i=0; i<_deleteSpecArr.length; i++) {
                        //         __goodsInfos.splice(_deleteSpecArr[i], 1)
                        //     }
                        // }

                        // if(__goodsInfos.some(val => val.costPrice == '')) {
                        //     this.$message({
                        //         message: '规格信息中成本价不能为空',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(!this.editor && __goodsInfos.some(val => val.salePrice == '')) {
                        //     this.$message({
                        //         message: '规格信息中售卖价不能为空',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(!this.editor && __goodsInfos.some(val => val.stock == '')) {
                        //     this.$message({
                        //         message: '规格信息中库存不能为空',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(!this.editor && __goodsInfos.some(val => +val.stock < 0)) {
                        //     this.$message({
                        //         message: '规格信息中库存不能小于0',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(__goodsInfos.some(val => !val.warningStock)) {
                        //     this.$message({
                        //         message: '规格信息中库存预警不能为空',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        // if(__goodsInfos.some(val => val.image == '')) {
                        //     this.$message({
                        //         message: '规格信息中图片不能为空',
                        //         type: 'warning'
                        //     });
                        //     return
                        // }
                        _goodsInfos = __goodsInfos.map(val => {
                            let _specs = {}
                            val.label.split(',').forEach((spec, index) => {
                                _specs[this.specsLabel.split(',')[index]] = spec
                            })
                            val.specs = _specs
                            val.fileList = []
                            return val
                        })
                        obj.goodsInfos = _goodsInfos
                    // } else {
                    //     obj.goodsInfos = this.ruleForm.goodsInfos
                    // }
                    // console.log(this.ruleForm.productDetail)
                    // console.log(window.encodeURIComponent(this.ruleForm.productDetail))
                    // console.log(window.btoa(window.encodeURIComponent(this.ruleForm.productDetail)))
                    params = Object.assign({}, this.ruleForm, obj, {
                        productDetail: window.escape(this.ruleForm.productDetail),
                        productCatalogInfoId: ''
                    })

                    if(this.ruleForm.other) {
                        params = Object.assign({}, params, {
                            productUnit: params.otherUnit
                        })
                    } else {
                        let item = this.unitList.find(val => val.id == this.ruleForm.productUnit)

                        params = Object.assign({}, params, {
                            productUnit: item && item.name || ''
                        })
                    }
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

            // this.$nextTick(() => {
            //     setTimeout(() => {
            //         this.$refs.fenleiCascader.toggleDropDownVisible(false)
            //         this._globalEvent.$emit('addGoodsEvent', false);
            //     }, 10000)
            // })
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
                        id: '0',
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
        sort(arr) {
            let sortFunction = function(sortArr) {
                sortArr.sort((obj1, obj2) => {
                    if(obj1.sort > obj2.sort) {
                        return 1
                    } else if(obj1.sort == obj2.sort) {
                        return 0
                    } else {
                        return -1
                    }
                })
                sortArr.forEach(val => {
                    if(val.children) {
                        sortFunction(val.children)
                    }
                })
            }
            sortFunction(arr)
            return arr
        },
        getCategoryList() {
            return new Promise((resolve, reject) => {
                this._apis.goods.fetchCategoryList({enable: 1}).then((res) => {
                    this.flatCategoryList = res
                    let arr = this.transTreeData(res, 0)
                    let _arr = this.sort(arr)

                    this.categoryOptions = _arr
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        handleChange(value) {
            let _value = [...value]
            //this.ruleForm.productCatalogInfoId = _value.pop()
            this.ruleForm.productCatalogInfoIds = _value
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
                console.log('SelectSpecifications', value)
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
            console.log(response, file, fileList)
            if(fileList.every(val => val.status == 'success')){
                this.$message.success('文件上传成功');
                if(fileList.length > 1 && fileList.every(val => val.status == 'success')) {
                    fileList.forEach(item => {
                        this.fileList.push({
                            name: '',
                            url: item.response.data.url
                        })
                        if(this.ruleForm.images != '') {
                            this.ruleForm.images += ',' + item.response.data.url;
                        } else {
                            this.ruleForm.images += item.response.data.url;
                        }
                    })
                } else {
                    this.fileList.push({
                        name: '',
                        url: response.data.url
                    })
                    if(this.ruleForm.images != '') {
                        this.ruleForm.images += ',' + response.data.url;
                    } else {
                        this.ruleForm.images = response.data.url;
                    }
                }
            }else{
                if(fileList.some(val => val.status == 'error')) {
                    this.$message.error('文件上传失败');
                }
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
            if(!/\.jpg|\.jpeg|\.png|\.gif|\.JPG|\.JPEG|\.PNG|\.GIF$/.test(image.filePath)) {
                this.$message({
                message: '上传的文件格式不正确，请重新上传',
                type: 'warning'
                });
                return
            }
            if(image.fileSize > 1024*1024*2) {
                this.$message({
                message: '上传图片不能超过2M',
                type: 'warning'
                });
                return
            }
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
                if(this.ruleForm.images) {
                    this.ruleForm.images += ',' + image.filePath
                } else {
                    this.ruleForm.images = image.filePath
                }
                this.hideUpload = this.imagesLength >= 6
            }
        }
    },
    mounted() {
        //window.addEventListener('scroll', this.handleScroll)
        window.thisv = this
        this.$nextTick(() => {
            if(this.isIE) {
                if(document.querySelector('.productCatalogInfoId .el-input').className.indexOf('is-focus') != -1) {
                    document.querySelector('.productCatalogInfoId .el-form-item__label').click()
                }

                
                
                
            }
        })
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
        RichEditor,
        Specs
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
            margin-right: 28px;
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
    padding-right: 2px!important;
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
/deep/ .spec-information thead th.costPrice .cell,
    /deep/ .spec-information thead th.salePrice .cell,
    /deep/ .spec-information thead th.stock .cell,
    /deep/ .spec-information thead th.warningStock .cell,
    /deep/ .spec-information thead th.image .cell {
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
/deep/ .spec-information-editor thead th.costPrice .cell,
    /deep/ .spec-information-editor thead th.salePrice .cell,
    /deep/ .spec-information-editor thead th.stock .cell,
    /deep/ .spec-information-editor thead th.warningStock .cell,
    /deep/ .spec-information-editor thead th.image .cell {
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
        color: #655EFF;
        // &:first-child {
        //     color: #655EFF;
        //     margin-right: 5px;
        // }
        // &:last-child {
        //     color: #FD4C2B;
        // }
        &.deleteSpan {
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
.goods-message {
    color: #FD4C2B;
    font-size: 12px;
    margin-top: 5px;
}
/deep/ .el-icon-arrow-down:before {
    content: "\e790";
}
/deep/ .el-input {
    width: 208px;
}
/deep/ .el-radio-group .el-radio {
    margin-right: 30px;
}
/deep/ .el-form-item__content {
    line-height: 32px;
}
/deep/ .el-radio {
    margin-right: 30px;
}
/deep/ .spec-information .el-input__inner {
    width: 120px;
}
/deep/ .spec-information-editor .el-input {
    width: auto;
}
.multiple-row {
    text-align: center;
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    height: 42px;
    line-height: 36px;
    padding: 2px;
    &:last-child {
        border: none;
    }
}
/deep/ .specs-table {
    .el-input {
        width: 100%;
    }
}
/deep/ .specs-table tbody tr td:nth-child(2),
/deep/ .specs-table tbody tr td:nth-child(4),
/deep/ .specs-table tbody tr td:nth-child(5),
/deep/ .specs-table tbody tr td:nth-child(6),
/deep/ .specs-table tbody tr td:nth-child(7),
/deep/ .specs-table tbody tr td:nth-child(8),
/deep/ .specs-table tbody tr td:nth-child(9),
/deep/ .specs-table tbody tr td:nth-child(10),
/deep/ .specs-table tbody tr td:nth-child(11) {
    padding: 0;
    .cell {
        padding: 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: stretch;
    }
}
.add-specs {
    position: relative;
    margin-bottom: 10px;
    .add-specs-input {
        display: flex;
        input {
            &:first-child {
                width: 251px;
                height: 34px;
                padding-left: 9px;
                &:focus {
                    border-color: #655EFF;
                }
            }
            &:nth-child(2) {
                width: 49px;
                height: 34px;
                background-color: #fff;
                outline: none;
                border: 1px solid #D0D6E4;
                border-left: none;
                margin-left: -5px;
                color: #655EFF;
            }
        }
    }
    ul {
        position: absolute;
        z-index: 1000;
        background-color: #fff;
        width: 251px;
        box-shadow:0px -2px 10px 0px rgba(204,204,204,0.5);
        li {
          text-align: left;
            cursor: pointer;
        }
    }
}
.added-specs {
    margin-bottom: 10px;
    li {
        margin-bottom: 2px;
        .added-specs-header {
            display: flex;
            justify-content: space-between;
            background-color: #eee;
            padding: 5px;
        }
        ul {
            display: flex;
            flex-wrap: wrap;
            li {
                margin-right: 5px;
            }
        }
    }
}
.add-specs-button {
    margin-bottom: 10px;
}
.add-specs-value {
    ul {
        margin: 10px 0;
        li {
            float: left;
            margin-right: 10px;
            border: 1px solid #ddd;
            padding: 7px 12px;
            border-radius:4px;
            margin-bottom: 5px;
            cursor: pointer;
            position: relative;
            &.active {
                border: 1px solid rgba(22, 155, 213, 1);
            }
            i {
                display: inline-block;
                vertical-align: middle;
                width: 14px;
                height: 14px;
                background: url('../../assets/images/goods/icon_close.png') no-repeat;
            }
        }
        .clear {
            clear: both;
        }
    }
    .add-specs-value-input {
        display: flex;
        input {
            &:first-child {
                width: 251px;
                height: 34px;
                padding-left: 9px;
                &:focus {
                    border-color: #655EFF;
                }
            }
            &:nth-child(2) {
                width: 49px;
                height: 34px;
                background-color: #fff;
                outline: none;
                border: 1px solid #D0D6E4;
                border-left: none;
                margin-left: -5px;
                color: #655EFF;
            }
        }
        button {
            color: #655EFF;
        }
    }
    .add-specs-value-footer {
        text-align: center;
    }
}
/deep/ .add-specs {
    button {
        height: 34px;
        border: 1px solid #D0D6E4;
        border-left: none;
        color: #655EFF;
    }
}
/deep/ .add-specs-input input {
    border: 1px solid #D0D6E4;
}
/deep/ .add-specs-value-input input {
    border: 1px solid #D0D6E4;
}
/deep/ .batch-filling {
    margin-bottom: 10px;
    margin-top: 20px;
}
.spec-information {
    ::-webkit-scrollbar-thumb {
        background-color:#bbb;
    }
}
/deep/ .productCatalogInfoId {
    .el-cascader__tags input {
        margin-left: 0;
    }
}
// /deep/ .el-cascader {
//     .el-icon-circle-close {
//         display: none;
//     }
// }
/deep/ .form-section.spec-form-section {
    .el-form-item {
        .el-form-item__content {
            margin-left: 80px!important;
        }
    }
}
.spec-list {
    color: #44434B;
    width: 251px;
    li {
        text-align: left;
        padding-left: 20px;
        height: 34px;
        line-height: 34px;
        &:hover {
            background:#ebeafa;
        }
    }
}
.goods-infos {
    margin-left: 77px;
    margin-bottom: 18px;
    .added-specs {
        .added-specs-header {
            background: #fff;
            height: 60px;
            line-height: 60px;
            padding: 0 20px;
            border-top: 1px solid #CACFCB;
            border-bottom: 1px solid #CACFCB;
            .el-button {
                width: 80px;
                height: 34px;
                color: #F55858;
                margin-top: 11px;
            }
        }
    }
    .spec-value-ul {
        margin-top: 10px;
        margin-bottom: 14px;
        padding-left: 20px;
      li {
            border: 1px solid #DCDFE6;
            padding: 5px 10px;
            i {
                margin-left: 2px;
                display: inline-block;
                vertical-align: middle;
                width: 14px;
                height: 14px;
                background: url('../../assets/images/goods/icon_close.png') no-repeat;
                cursor: pointer;
            }
        }
    }
    .add-spec-value-ul {
        li {
            padding: 7px 12px;
            margin-right: 15px;
            margin-bottom: 10px;
            border-radius:4px;
            margin-bottom: 5px;
            i {
                margin-left: 15px;
                display: inline-block;
                vertical-align: middle;
                width: 14px;
                height: 14px;
                background: url('../../assets/images/goods/icon_close.png') no-repeat;
                cursor: pointer;
            }
        }
    }
    .add-specs-button-box {
        display: flex;
        >.add-specs-button {
            &:first-child {
                // margin-right: 20px;
            }
        }
    }
    .el-table.spec-information .el-table__header-wrapper .el-table__header {
        border-top: 1px solid #CACFCB;
        border-bottom: 1px solid #CACFCB;
        thead tr {
            height: 46px;
        }
    }
}
.shuaxin-template {
    border: 1px solid #92929B;
    color: #44434B;
    margin-left: 28px;
}
.spec-message {
    margin-bottom: 10px;
    font-size: 12px;
}
.prompt-box {
    margin-top: 5px;
}
.upload-box {
    .image-list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .upload-add {
            &:hover {
                border-color: #655EFF;
                color: #655EFF;
            }
            &:focus {
                border-color: #655EFF;
                color: #655EFF;
            }
            .el-icon-plus {
                font-size: 28px;
                color: #8c939d;
            }
            width: 80px !important;
            height: 80px !important;
            line-height: 90px !important;
            display: inline-block;
            text-align: center;
            cursor: pointer;
            outline: 0;
            background-color: #fbfdff;
            border: 1px dashed #c0ccda;
            border-radius: 6px;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            width: 148px;
            height: 148px;
            line-height: 146px;
            vertical-align: top;
        }
        .image-item {
            &:hover {
                label {
                    display: none;
                }
            }
            margin-right: 8px;
            margin-bottom: 8px;
            width: 80px;
            height: 80px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            border: 1px solid #c0ccda;
            border-radius: 6px;
            position: relative;
            overflow: hidden;
            label {
                display: block;
                position: absolute;
                right: -15px;
                top: -6px;
                width: 40px;
                height: 24px;
                background: #13ce66;
                text-align: center;
                -webkit-transform: rotate(45deg);
                transform: rotate(45deg);
                -webkit-box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
                box-shadow: 0 0 1pc 1px rgba(0,0,0,.2);
                .el-icon-check {
                    color: #fff;
                    -webkit-transform: rotate(-45deg);
                    transform: rotate(-45deg);
                }
            }
            .image-item-actions {
                &:hover {
                    opacity: 1;
                }
                padding-top: 20px;
                //display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                cursor: default;
                text-align: center;
                color: #fff;
                opacity: 0;
                font-size: 20px;
                background-color: rgba(0,0,0,.5);
                -webkit-transition: opacity .3s;
                transition: opacity .3s;
                .image-item-actions-footer {
                    display: block;
                    height: 25px;
                    position: relative;
                    i {
                        display: inline-block;
                        width: 18px;
                        height: 16px;
                        line-height: 16px;
                        background: #000;
                        text-align: center;
                        font-size: 14px;
                        position: absolute;
                        bottom: 0;
                        &.lefter {
                            float: left;
                            left: 0;
                        }
                        &.righter {
                            float: right;
                            right: 0;
                        }
                    }
                }
                i {
                    font-family: element-icons!important;
                    speak: none;
                    font-style: normal;
                    font-weight: 400;
                    font-variant: normal;
                    text-transform: none;
                    line-height: 1;
                    vertical-align: baseline;
                    display: inline-block;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
                .image-item-actions-delete {
                    margin-left: 15px;
                }
            }
        }
    }
}
.upload-prompt {
    margin-top: 12px;
    font-size:12px;
    font-weight:400;
    color:rgba(146,146,155,1);
    line-height:17px;
}
/deep/ .isIE {
    .el-tag__close.el-icon-close {
        top: -6px;
    }
    .el-cascader__tags {
        .el-tag {
            display: inline-block;
            span {
                display: inline-block;
            }
        }
    }
}
/deep/ .shop_classify_tag{
	.el-input__inner{
		padding-right: 0!important;
	}
}
/deep/ .shop_classify_tag .el-input{
	.el-input--suffix .el-input__inner{
		padding-right: 0;
	}
	.el-input__inner{
		padding-right: 0;
	}
	input{
		width: 211px;
	}
	.el-input__suffix{

	}
}
/deep/ .el-form-item__label {
    color: #3D434A;
}

/deep/ .upload-box .image-list {
    .image-item {
        overflow: visible;
        label {
            position: absolute;
            right: -7px;
            top: -6px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #13ce66;
            .el-icon-check:before {
                position: absolute;
                top: -16px;
                left: 3px;
            }
        }
    }
}
.shuaxin-fenlei {
    display: inline-flex;
    align-items: center;
    padding: 12px;
    width: 80px;
    height: 34px;
    background-color: #e6fbf3;
    i {
        margin-left: 12px;
        display: inline-block;
        width: 16px;
        height: 16px;
        background: url('../../assets/images/goods/renovate.png');
    }
}
.activity-message {
    font-size:14px;
    font-weight:400;
    color:rgba(245,88,88,1);
    margin-left: 27px;
}
</style>
