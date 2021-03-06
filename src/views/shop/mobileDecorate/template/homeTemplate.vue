<template>
  <div v-loading="isLoading">
    <div class="template_wrapper-head">
      <div class="template_wrapper-head-tags">
        <el-tag
          v-for="(item, index) of checkboxGroup1"
          :key="index"
          closable
          :disable-transitions="true"
          @close="handleSelectItems(item)">
          {{ getIndustryName(item) }}
        </el-tag>
      </div>
      <div class="template_wrapper-head-industries">
        <div class="template_wrapper-head-industries-items" ref="industriesScroll"
             :style="ifShowAll ? styleShow : styleHidden">
          <div class="template_wrapper-head-industries-item" @click="handleSelectAll"
               :class="{'checked' : checkboxGroup1.length ===  0}"
          >
            {{industries.length ? '全部行业' : '暂无行业'}}
          </div>
          <div class="template_wrapper-head-industries-item" v-for="(item, index) of industries"
               :key="index + 'industries'" @click="handleSelectItems(item.id)"
               :class="{'checked': checkboxGroup1.indexOf(item.id) > -1}"
          >
            {{item.name}}
          </div>
        </div>
        <div class="template_wrapper-head-industries-option" @click="showAllIndustries" v-show="showAllBtn">
          {{ifShowAll ? '收起' : '全部显示'}}<i :class="ifShowAll ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
        </div>
      </div>
      <div class="template_wrapper-head-conditions">
        <el-form ref="ruleForm" :model="ruleForm" :inline="true">
          <el-form-item label="" prop="name">
            <el-radio-group v-model="ruleForm.sortBy" size="small" @change="sortByChange">
              <el-radio-button :value="0" :label="0">综合排序</el-radio-button>
              <el-radio-button :value="1" :label="1">价格<i class="el-icon-top"></i></el-radio-button>
              <el-radio-button :value="2" :label="2">价格<i class="el-icon-bottom"></i></el-radio-button>
              <el-radio-button :value="3" :label="3">人气从高到低</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-checkbox v-model="checked" :disabled="freeDisabled">只看免费模板</el-checkbox>
          </el-form-item>
          <el-form-item label="" prop="name">
            <el-input-number v-model="ruleForm.lowPrice" controls-position="right" :precision="2" :disabled="checked"
                             :min="0" :max="9999" width="150" placeholder="最低金额（元）"></el-input-number>
            <span style="color: #B6B5C8"> &nbsp;-&nbsp; </span>
            <el-input-number v-model="ruleForm.highPrice" controls-position="right" :precision="2" :disabled="checked"
                             :min="0" :max="9999" width="150" placeholder="最高金额（元）"></el-input-number>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="template_wrapper">
      <ul v-show="templateList.length > 0" class="clearFix" v-loading="loading">
        <li v-for="(item, key) of templateList" :key="key">
          <div class="inner">
            <div class="inner-tag">
              <img src="@/assets/images/template-tag-icon.png" alt=""/>
              <span>使用人数：{{item.useCount}}</span>
            </div>
            <div class="view">
              <img :src="item.photoHalfUrl" alt="">
              <div class="cover_small">
                <div class="cover_button" @click="preview(item)">预览模板</div>
                <el-button type="primary" class="cover_button_apply" @click="apply(item)">使用模板</el-button>
              </div>
            </div>
            <div class="info">
              <div class="top">
                <div class="price" v-show="item.chargeType !== 1">
                  <div class="price-left">
                    ￥{{item.price}}<span style="color:rgba(146,146,155,1);">/</span>
                  </div>
                  <div class="price-right">
                    {{chargeTypeConstant[item.chargeType]}}
                  </div>
                </div>
                <div class="free" v-show="item.chargeType === 1">
                  <div class="free-left">
                    免费
                  </div>
                  <div class="free-right">
                    永久使用
                  </div>
                </div>
              </div>
              <div class="body" :title="item.name">
                <span>{{item.name || '页面模板'}}</span>
              </div>
              <div class="bottom">
                <i class="mini_program"></i>
                <i class="wechat"></i>
              </div>
            </div>
          </div>
        </li>
      </ul>

      <div class="big_preview animated fadeInDown faster" v-if="showBigPreview">
        <div class="img_wrapper">
          <img :src="currentTemplate && currentTemplate.photoDetailsUrl" alt="" ref="bigImage">
        </div>
        <i class="close_preview" @click="close"></i>
        <div class="zoom">
          <i class="plus" @click="plus"></i>
          <i class="reduce" @click="reduce"></i>
        </div>
        <!--<div class="apply" @click="apply(currentTemplate)">立即应用</div>-->
      </div>

      <!--   空数据   -->
      <empty-list v-show="templateList.length === 0" :tipText="tipText"></empty-list>

      <div v-show="Number(total) > 0" class="pagination"
           v-if="templateList.length || (!templateList.length && startIndex != 1)">
        <el-pagination
          :background="true"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex)"
          :page-size="pageSize*1"
          :page-sizes="[12]"
          :total="total*1"
          layout="prev, pager, next, sizes"
        >
        </el-pagination>
      </div>

      <template-pay :dialogVisible="dialogVisible" :tempInfo="tempInfo" :qrCodeInfo="qrCodeInfo"
                    @closePay="closePay"></template-pay>
    </div>
  </div>
</template>

<script>
  import emptyList from './components/emptyList';
  import templatePay from './components/templatePay';
  import templateConstant from '@/system/constant/template';

  export default {
    name: 'templateManage',
    components: {templatePay, emptyList},
    computed: {
      chargeTypeConstant() {
        return templateConstant.chargeType
      },
      freeDisabled() {
        if (this.ruleForm.lowPrice && this.ruleForm.highPrice) return true
        else return false
      }
    },
    data() {
      return {
        isLoading: false,
        showAllBtn: false,
        tempInfo: {},
        dialogVisible: false,
        checkboxGroup1: [],
        styleShow: {
          maxHeight: '150px',
          overflowY: 'scroll'
        },
        styleHidden: {
          height: '50px',
          overflowY: 'hidden'
        },
        ifShowAll: false,
        ruleForm: {
          sortBy: 0,
          lowPrice: undefined,
          highPrice: undefined,
          industryIds: [],
          chargeType: '',
          type: 1
        },
        num: 0,
        orderType: '',
        industries: [],
        checked: false,
        startIndex: 1,
        pageSize: 12,
        loading: true,
        templateList: [],
        showBigPreview: false,
        currentTemplate: null,
        zoomRatio: 1, //缩放比
        imgNow: 0,  //当前预加载的第几张
        preLoadObj: null,  //预加载对象
        maxWidth: 550,  //最大宽度
        mode: null,
        qrCodeInfo: {},
        tipText: ''
      }
    },
    created() {
      this.effIndustryList()
      this.fetchList();
      this.preLoadObj = new Image();
    },
    watch: {
      zoomRatio(newValue) {
        let width = this.$refs.bigImage.clientWidth;
        if (this.mode === 'plus') {
          this.$refs.bigImage.style.width = width * this.zoomRatio + 'px';
        } else if (this.mode === 'reduce') {
          this.$refs.bigImage.style.width = width / this.zoomRatio + 'px';
        }
        if (this.zoomRatio > 1) {
          this.$refs.bigImage.style.height = 'auto';
        } else {
          this.$refs.bigImage.style.width = 'auto';
          this.$refs.bigImage.style.height = '100%';
        }
      },
      'checked': function (v) {
        if (v) {
          this.ruleForm.chargeType = 1;
          this.ruleForm.lowPrice = undefined;
          this.ruleForm.highPrice = undefined;
          this.ruleForm.sortBy = 0;
        } else {
          this.ruleForm.chargeType = ""
        }
      }
    },
    methods: {
      resetfetch() {
        this.checked = false
        this.ruleForm = {
          sortBy: 0,
          lowPrice: undefined,
          highPrice: undefined,
          industryIds: [],
          chargeType: '',
          type: 1
        }
        this.checkboxGroup1 = []
        this.startIndex = 1
        this.fetchList()
      },
      fetchList() {
        this.loading = true;
        this.ruleForm.industryIds = this.checkboxGroup1
        if (this.ruleForm.industryIds.length === 0) {
          this.tipText = '当前搜索无结果，请您重新搜索！'
        } else {
          this.tipText = '您搜索的行业内当前没有可使用的模版，请您换个行业再次搜索！'
        }

        const reqParams = {
          startIndex: this.startIndex,
          pageSize: this.pageSize,
          sortBy: this.ruleForm.sortBy,
          lowPrice: this.ruleForm.lowPrice,
          highPrice: this.ruleForm.highPrice,
          industryIds: this.ruleForm.industryIds,
          chargeType: this.ruleForm.chargeType,
          type: this.ruleForm.type
        };

        this._apis.goodsOperate.getEffTemplateList(reqParams).then((response) => {
          this.total = response.total;
          this.templateList = response.list;
          this.imgNow = 0;
          this.preload(this.templateList, 'photoDetailsUrl');
          this.loading = false;
        }).catch((error) => {
          this.$alert(error, '警告', {
            confirmButtonText: '确定',
            callback: action => {

            }
          });
          this.templateList = [];
          this.loading = false;
        });
      },

      /**
       *  查询
       */
      query() {
        if ((this.ruleForm.lowPrice !== 0 && this.ruleForm.lowPrice && !this.ruleForm.highPrice) || (this.ruleForm.lowPrice !== 0 && this.ruleForm.highPrice && !this.ruleForm.lowPrice)) {
          this.templateList = [];
          this.total = 0;
          this.$alert('当前价格区间输入有误、请您重新输入查询', '警告', {
            confirmButtonText: '确定'
          });
          return
        }

        if (this.ruleForm.lowPrice * 1 >= this.ruleForm.highPrice * 1) {
          this.templateList = [];
          this.total = 0;
          this.$alert('您输入的价格有误、请您重新输入查询', '警告', {
            confirmButtonText: '确定'
          });
          return
        }

        this.startIndex = 1;
        this.fetchList();
      },

      handleCurrentChange(val) {
        this.startIndex = val;
        this.fetchList();
      },

      handleSizeChange(val) {
        this.startIndex = 1;
        this.fetchList();
      },

      /* 预加载 */
      preload(data, name) {
        const _self = this;
        if (!data.length) {
          //全部加载失败
          return;
        }
        this.preLoadObj.src = data[this.imgNow][name];
        this.preLoadObj.onerror = function () {
          console.warn("图片加载失败");
          _self.imgNow++;
          if (_self.imgNow < data.length) {  //  如果还没有加载到最后一张
            _self.preload(data, name);          //  递归调用自己
          } else {                            //  已经加载到最后一张
            //全部加载完成
            return;
          }
        }
        this.preLoadObj.onload = function () {
          _self.imgNow++;
          if (_self.imgNow < data.length) {  //  如果还没有加载到最后一张
            _self.preload(data, name);          //  递归调用自己
          } else {                            //  已经加载到最后一张
            //全部加载完成
            return;
          }
        };

      },

      /* 预览模板 */
      preview(item) {
        this.showBigPreview = true;
        this.currentTemplate = item;
        this.zoomRatio = 1;
      },

      /* 放大 */
      plus() {
        this.mode = 'plus';
        if (this.$refs.bigImage.clientWidth <= this.maxWidth * 0.9) {
          this.zoomRatio += 0.1;
        }
      },

      /* 缩小 */
      reduce() {
        this.mode = 'reduce';
        // if(this.$refs.bigImage.clientWidth >= this.maxWidth) {
        //    this.zoomRatio = 1.1;
        // }
        if (this.zoomRatio >= 1.1) {
          this.zoomRatio -= 0.1;
        }
      },

      /* 关闭预览 */
      close() {
        this.showBigPreview = false;
      },

      /* 应用模板 */
      apply(item) {
        this.isLoading = true;
        this._apis.shop.getTemplateInfo({
          pageTemplateId: item.id
        }).then(res1 => {
          if (item.chargeType !== 1) {
            if (res1 === null || res1.status === 2) {
              this._apis.templatePay.getOrcode({
                orderSource: 1,
                orderType: 1,
                shopName: this.$store.getters.shopInfos.shopName,
                templateChargeType: item.chargeType,
                templateId: item.id,
                templateName: item.name,
                templatePrice: item.price
              }).then(res => {
                this.qrCodeInfo = res;
                this.dialogVisible = true;
                this.tempInfo = item
              }).catch((err)=> {
                console.error(err);
                this.$message.error(err)
              }).finally(() => {this.isLoading = false})
            } else {
              this.isLoading = false;
              this.confirm({
                customClass: 'goods-custom',
                icon: true,
                text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
              }).then(() => {
                this._routeTo('m_templateEdit', {id: item.id});
              })
            }
          } else {
            if (res1 === null) {
              this._apis.shop.addFreeTemplate({
                pageTemplateId: item.id
              }).then(response => {
                this.confirm({
                  customClass: 'goods-custom',
                  icon: true,
                  text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
                }).then(() => {
                  this._routeTo('m_templateEdit', {id: item.id});
                })
              }).catch((err)=> {
                this.$message.error(err)
              }).finally(() => {this.isLoading = false})
            } else {
              this.isLoading = false;
              this.confirm({
                customClass: 'goods-custom',
                icon: true,
                text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
              }).then(() => {
                this._routeTo('m_templateEdit', {id: item.id});
              })
            }
          }
        }).catch((error) => {this.isLoading = false;console.error(error)})
      },

      /* 关闭支付模板 */
      closePay() {
        this.dialogVisible = false;
        this.fetchList()
      },
      showAllIndustries() {
        this.ifShowAll = !this.ifShowAll;
        this.$refs.industriesScroll.scrollTop = 0;
      },
      // 选择
      handleSelectItems(value) {
        if (this.checkboxGroup1.indexOf(value) > -1) {
          this.checkboxGroup1.splice(this.checkboxGroup1.indexOf(value), 1);
        } else {
          this.checkboxGroup1.push(value)
        }
        // this.startIndex = 1;
        // this.fetchList()
      },
      // 全选
      handleSelectAll() {
        this.checkboxGroup1.splice(0)
        /*
        if (this.checkboxGroup1.length === this.industries.length) {
          this.checkboxGroup1 = []
        } else {
          this.checkboxGroup1.length = 0
          this.industries.map(item => {
            this.checkboxGroup1.push(item.id)
          })
        }
         */
        // this.startIndex = 1;
        // this.fetchList()
      },
      sortByChange(v) {
        // this.startIndex = 1;
        // this.fetchList();
        this.query();
      },
      // 有效行业列表
      effIndustryList() {
        this._apis.industry.effIndustryList({}).then((response) => {
          if(!response) return;
          this.industries = response; // 当后台返回response:null的时候，会报错typeError,length of null
          let that = this;
          this.$nextTick(function () {
            let height = document.getElementsByClassName('template_wrapper-head-industries-items')[0].scrollHeight
            if (height > 50) {
              that.showAllBtn = true
            } else {
              that.showAllBtn = false
            }
          })
        }).catch((error) => {
          console.error(error);
        });
      },
      // 获取行业名称
      getIndustryName(id) {
        let name = ''
        this.industries.map(item => {
          if (item.id == id) {
            name = item.name
          }
        })
        return name
      }
    }
  }
</script>

<style lang="scss" scoped>

  /deep/ .el-tag--small .el-icon-close {
    transform: scale(1);
    font-size: 14px;
  }

  .el-radio-group label:last-child {
    margin-left: 0;
  }

  .template_wrapper-head {
    background: #fff;
    padding-bottom: 5px;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: start;
    flex-flow: row wrap;
    border-radius: 0 0 4px 4px;

    &-tags {
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: start;
      flex-flow: row wrap;
      padding-left: 20px;
      padding-right: 20px;

      .el-tag {
        min-width: 67px;
        border-radius: 2px;
        border: 1px dashed $globalMainColor;
        font-size: 14px;
        margin-right: 16px;
        margin-top: 15px;
        color: $globalMainColor;
        line-height: 22px;
        padding-right: 10px;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }

    &-industries {
      position: relative;
      padding: 0 20px 16px 20px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: start;
      flex-flow: row wrap;
      width: 100%;
      border-bottom: 1px solid #f2f2f9;

      &-items {
        padding: 0 110px 0 0;
        flex: 1;
        display: flex;
        flex-direction: row;
        justify-content: start;
        align-items: start;
        flex-flow: row wrap;

        &::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        &::-webkit-scrollbar-track {
          border-radius: 0 !important;
          background: #fff !important;
        }

        &::-webkit-scrollbar-thumb {
          border-radius: 10px !important;
          background: rgba(101, 94, 255, 0.4) !important;
        }

        &::-webkit-scrollbar-track-piece {
          background-color: #fff;
        }
      }

      &-option {
        position: absolute;
        top: 22px;
        right: 20px;
        width: 100px;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        flex-flow: row wrap;
        color: $contentColor;
        cursor: pointer;
      }

      &-item {
        min-width: 80px;
        padding-left: 10px;
        padding-right: 10px;
        border-radius: 2px;
        border: 1px solid rgba(182, 181, 200, 1);
        margin-right: 16px;
        margin-top: 14px;
        font-size: 14px;
        text-align: center;
        color: #B6B5C8;
        line-height: 34px;
        cursor: pointer;
        background: #fff;
        box-sizing: border-box;

        &.checked {
          background: #655EFF;
          color: #fff;
          border: none;
        }
      }
    }

    &-conditions {
      background: #ffffff;
      width: 100%;
      margin: 0 20px 0;
      padding-top: 20px;
      display: flex;
      flex-direction: row;
      justify-content: start;
      align-items: center;
      flex-flow: row wrap;

      /deep/ .is-active .el-radio-button__inner {
        background: #fff;
        /*border-width: 2px;*/
        /*border-left: 1px solid $globalMainColor;*/
        color: $globalMainColor;
        border-color: $globalMainColor;
      }

      /deep/ .el-radio-button__inner {
        font-size: 14px;
      }

      /*/deep/ .el-radio-button:first-child .el-radio-button__inner {*/
      /*  border-width: 2px;*/
      /*}*/

      /deep/ .el-input-number--small {
        width: 162px;
      }

    }
  }

  .template_wrapper {
    // min-width:1650px;
    margin-top: 20px;
    background: #fff;
    padding-bottom: 50px;
    border-radius: 4px;

    ul {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      flex-wrap: wrap;
      background: #fff;
      padding: 10px 0 0 20px;
      box-sizing: border-box;
      border-radius: 4px;

      li {
        width: 255px;
        margin-right: 10px;
        margin-top: 10px;

        .inner {
          width: 255px !important;
          height: 421px !important;
          padding: 15px;
          background: #fff;
          box-shadow: 0 2px 10px 0 rgba(232, 231, 255, 1);
          position: relative;

          &-tag {
            min-width: 137px;
            padding-left: 36px;
            height: 26px;
            position: absolute;
            top: 0;
            right: 0;
            z-index: 100;
            line-height: 26px;
            text-align: right;
            font-size: 12px;
            font-weight: 500;
            color: #fff;
            // background: $warningColor;
            &:after {
              content: '';
              display: block;
              position: absolute;
              right: 0;
              top: 0;
              width: 90px;
              height: 26px;
              background: $warningColor;
            }

            img {
              position: absolute;
              height: 100%;
              top: 0;
              left: 0;
              z-index: 101;
            }

            span {
              margin-right: 10px;
              position: relative;
              z-index: 102;
            }
          }

          .view {
            width: 100%;
            height: 300px;
            position: relative;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }

            .cover_small {
              width: 100%;
              height: 100%;
              position: absolute;
              top: 0;
              left: 0;
              background: rgba(0, 0, 0, 0.6);
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: all 0.4s;

              &:hover {
                opacity: 1;
              }

              .cover_button {
                width: 90px;
                height: 34px;
                font-size: 14px;
                color: #fff;
                line-height: 34px;
                text-align: center;
                border-radius: 4px;
                border: 1px solid #fff;
                cursor: pointer;
                transition: all 0.4s;

                &:hover {
                  background: $globalMainColor;
                  border: 1px solid $globalMainColor;
                }
              }

              .cover_button_apply {
                width: 90px;
                height: 34px;
                margin-top: 16px;
                font-size: 14px;
                color: #fff;
                border-radius: 4px;
              }
            }
          }

          .info {
            margin-top: 10px;

            .top {
              display: flex;
              flex-direction: row;
              justify-content: start;
              align-items: center;
              height: 23px;

              .price {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: flex-end;
                height: 18px;
              }

              .price-left {
                font-size: 18px;
                color: rgba(240, 80, 39, 1);
                height: 18px;
                line-height: 18px;
              }

              .price-right {
                font-size: 12px;
                color: $grayColor;
                height: 13px;
                line-height: 13px;
              }

              .free {
                width: 108px;
                height: 22px;
                border: 1px solid rgba(62, 180, 136, 1);
                border-radius: 4px;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
              }

              .free-left {
                text-align: center;
                width: 40px;
                height: 22px;
                border-radius: 4px 0 0 4px;
                background: rgba(62, 180, 136, 1);
                font-size: 14px;
                color: #fff;
                line-height: 22px;
              }

              .free-right {
                text-align: center;
                width: 68px;
                height: 22px;
                border-radius: 0 4px 4px 0;
                font-size: 14px;
                color: rgba(62, 180, 136, 1);
                line-height: 22px;
              }
            }

            .body {
              width: 225px;
              height: 16px;
              font-size: 14px;
              color: rgba(68, 67, 75, 1);
              line-height: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 1;
              -webkit-box-orient: vertical;
              word-wrap: break-word;
              margin-top: 10px;
            }

            .bottom {
              display: flex;
              flex-direction: row;
              justify-content: start;
              margin-top: 10px;
              align-items: center;

              i {
                width: 23px;
                height: 23px;
                border-radius: 50%;
                margin-right: 10px;

                &.mini_program {
                  background: url('../../../../assets/images/shop/xiaochengxu.png') no-repeat 0 0;
                }

                &.wechat {
                  background: url('../../../../assets/images/shop/weixin.png') no-repeat 0 0;
                }
              }
            }
          }
        }
      }
    }

    .big_preview {
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1001;

      .img_wrapper {
        height: 100%;
        overflow-y: auto;

        img {
          transition: all 0.4s;
          max-width: 550px;
          height: 100%;
        }
      }

      .close_preview {
        position: absolute;
        top: 50px;
        right: 59px;
        display: block;
        background: rgba(255, 255, 255, 0.3) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        transition: all 0.4s;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.5) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
        }
      }

      .zoom {
        position: absolute;
        bottom: 144px;
        right: 59px;

        .plus, .reduce {
          width: 50px;
          height: 50px;
          display: block;
          border-radius: 4px;
          transition: all 0.4s;
          cursor: pointer;
        }

        .plus {
          background: rgba(255, 255, 255, 0.3) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
          margin-bottom: 14px;

          &:hover {
            background: rgba(255, 255, 255, 0.5) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
          }
        }

        .reduce {
          background: rgba(255, 255, 255, 0.3) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;

          &:hover {
            background: rgba(255, 255, 255, 0.5) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;
          }
        }
      }

      .apply {
        position: absolute;
        bottom: 60px;
        right: 40px;
        font-size: 15px;
        color: #fff;
        padding: 9px 10px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        transition: all 0.4s;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }
</style>
