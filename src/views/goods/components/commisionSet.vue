<template>
  <div style="margin-top:20px;">
    <div class="line">
      <div class="line-title">是否参与分销：</div>
      <div class="line-content">
        <el-radio-group v-model="status">
          <el-radio :label="0">不参与分销</el-radio>
          <el-radio :label="1">参与分销</el-radio>
        </el-radio-group>
        <p class="line-tip">如商品不参与分销，则不产生分销销售佣金</p>
      </div>
    </div>

    <div class="line" v-if="status == 1">
      <div class="line-title">海报图片：</div>
      <div class="line-content">
        <el-radio-group v-model="picSorce">
          <el-radio :label="0">从商品图片中选取</el-radio>
          <el-radio :label="1">上传新图片</el-radio>
        </el-radio-group>
        <div v-if="picSorce == 0" class="goods-images">
          <div
            v-for="(img, key) in images"
            class="good-img"
            :key="key"
            @click="changeImgCheck(key)"
          >
            <img :src="img" alt />
            <span v-if="key == checkedImg">
              <i class="el-icon-check"></i>
            </span>
          </div>
        </div>
        <div v-if="picSorce == 1" class="goods-images">
          <img v-if="src" style="width:86px;height:86px;dispaly:block;" :src="src" />
          <div style="width:260px;">
            <div class="uploadBtn">
              <i @click="changeDialog" class="el-icon-plus"></i>
            </div>
            <div
              style="display:inline-block;margin:60px 0 0 10px;"
              class="line-tip"
            >建议尺寸：640PX*640PX</div>
            <div class="uploadBtnTip">上传图片</div>
          </div>
        </div>
      </div>
    </div>

    <div class="line" v-if="status == 1">
      <div class="line-title">独立规则：</div>
      <div class="line-content">
        <el-checkbox-group v-model="enable">
          <el-checkbox label="启用独立分销比例"></el-checkbox>
        </el-checkbox-group>
        <div>
          <p class="line-tip">启用独立佣金设置，此商品拥有独自的佣金比例,不受分销员等级比例的默认设置限制</p>
        </div>
        <div class="commision totalCommission" v-if="enable">
          <p>分销总佣金：&nbsp;&nbsp;&nbsp;占分销商品利润</p>
          <div class="commision-prent">
            <el-input
              type="number"
              v-model="resellRule.percentOfCommodityProfit"
              placeholder="0.00"
            ></el-input>
            <span>%</span>
          </div>
          <span class="prompt">利润=订单实付金额-成本价-运费</span>
        </div>
        <div v-if="enable">
          <div class="commision totalCommission">
            <p style="margin-right:0px">层级佣金占比</p>
            <span class="prompt">层级佣金比例总和为100%，金额对应上面的分销总佣金。设置后该spu下的所有sku将均按照此比例计算分销金额</span>
          </div>
          <div style="margin-top:18px;">
            <!-- <p class="line-tip">建议参考商品的实际利润设置分销比例，设置后该spu下的所有sku将均按照此比例计算分销金额</p> -->
            <!-- 分销比例设置 -->
            <div class="commision">
              <div class="commision-cell-left">
                <div
                  v-if="resellConfigInfo.resellGrade >=1"
                  class="commision-title"
                >分销员本人（一级）佣金与商品总利润占比</div>
                <div
                  v-if="resellConfigInfo.resellGrade >=2"
                  class="commision-title"
                >上级分销员（二级）佣金与商品总利润占比</div>
                <div
                  v-if="resellConfigInfo.resellGrade >=3"
                  class="commision-title"
                >上上级分销员（三级）佣金与商品总利润占比</div>
              </div>
              <div class="commision-cell-center">
                <div v-if="resellConfigInfo.resellGrade >=1" class="commision-prent">
                  <el-input
                    type="number"
                    v-model="resellRule.percentOfCommissionOne"
                    placeholder="0.00"
                  ></el-input>
                  <span>%</span>
                </div>
                <div v-if="resellConfigInfo.resellGrade >=2" class="commision-prent">
                  <el-input v-model="resellRule.percentOfCommissionTwo" placeholder="0.00"></el-input>
                  <span>%</span>
                </div>
                <div v-if="resellConfigInfo.resellGrade >=3" class="commision-prent">
                  <el-input v-model="resellRule.percentOfCommissionThree" placeholder="0.00"></el-input>
                  <span>%</span>
                </div>
              </div>
              <div class="commision-right">
                <p class="line-tip">（注：所有层级分销比例相加之和不能大于100%）</p>
              </div>
            </div>
            <div class="consult" style="display:none">
              <!-- 商品利润参考 -->
              <div class="line-title" style="margin-bottom:18px;">参考数据：</div>
              <div>
                <el-table :data="sku" tooltip-effect="dark" style="width: 100%">
                  <el-table-column prop="sku" label="SKU"></el-table-column>
                  <el-table-column prop="specs" label="规格"></el-table-column>
                  <el-table-column prop="status" label="状态"></el-table-column>
                  <el-table-column label="售卖价">
                    <template slot-scope="scope">
                      <div>¥{{scope.row.salePrice}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="成本价">
                    <template slot-scope="scope">
                      <div>¥{{scope.row.costPrice}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column>
                    <template slot="header">
                      <el-tooltip placement="top">
                        <div slot="content">利润=订单实付金额-成本价-运费;当商品利润小于0时，各级佣金为0。</div>
                        <p>
                          利润&nbsp;
                          <i class="el-icon-warning" style="color:#655EFF;"></i>
                        </p>
                      </el-tooltip>
                    </template>
                    <template slot-scope="scope">
                      <div>¥{{scope.row.profits}}</div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="profitRate">
                    <template slot="header">
                      <el-tooltip placement="top">
                        <div slot="content">利润率=利润/成本*100%</div>
                        <p>
                          利润率&nbsp;
                          <i class="el-icon-warning" style="color:#655EFF;"></i>
                        </p>
                      </el-tooltip>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <p class="line-tip">&nbsp;</p>
              <!-- 分销佣金参考  按商品利润=订单实付金额-成本价-运费计算，以下部分隐藏-->
              <!-- <p v-if="resellGood.length" class="line-tip">（以下是我们根据您填写各层级分销比例计算出的商品各层级分销佣金，仅供参考。实际分销结果将以最终保存的比例计算）</p>
                        <div v-if="resellGood.length">
                            <el-table :data="resellGood" tooltip-effect="dark" style="width: 100%">
                                <el-table-column prop="sku" label="SKU"></el-table-column>
                                <el-table-column prop="specs" label="规格"></el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=1" label="分销员本人（一级）佣金金额" width="220">
                                    <template slot-scope="scope"><div>¥{{scope.row.one}}</div></template> 
                                </el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=2" label="上级分销员（二级）佣金金额" width="220">
                                    <template slot-scope="scope"><div>¥{{scope.row.two}}</div></template> 
                                </el-table-column>
                                <el-table-column v-if="resellConfigInfo.resellGrade >=3" prop="three" label="上上级分销员（三级）佣金金额" width="220">
                                    <template slot-scope="scope"><div>¥{{scope.row.three}}</div></template> 
                                </el-table-column>
                            </el-table>
              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btns">
      <el-button @click="submit" style="margin-right:50px;" type="primary">保&nbsp;&nbsp;存</el-button>
      <el-button @click="historyBack">返&nbsp;&nbsp;回</el-button>
    </div>
    <component
      v-if="dialogVisible"
      :is="currentDialog"
      :dialogVisible.sync="dialogVisible"
      @imageSelected="imageSelected"
    ></component>
  </div>
</template>
<script>
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      currentDialog: "", // 动态弹窗
      dialogVisible: false, // 动态弹窗可见
      resellGood: [], // 商品分销列表
      enable: false, // 是否开启独立规则
      status: 0, // 是否参与分销
      picSorce: 0, // 海报图片来源你
      checkedImg: 0, // 海报默认选中那个商品图
      src: "", // 上传海报图片路径
      images: [], // 所有商品图
      sku: [], // 商品利润列表
      // 分销佣金比例
      resellRule: {
        percentOfCommissionOne: "",
        percentOfCommissionTwo: "",
        percentOfCommissionThree: "",
        percentOfCommodityProfit: ""
      },
      resellConfigInfo:""
    };
  },
  watch: {
    resellRule: {
      handler(value, oldVal) {
        let regPos = /^[0-9]\d*$/;
        if (
          (regPos.test(value.percentOfCommissionOne) ||
            value.percentOfCommissionOne === "") &&
          (regPos.test(value.percentOfCommissionTwo) ||
            value.percentOfCommissionTwo === "") &&
          (regPos.test(value.percentOfCommissionThree) ||
            value.percentOfCommissionThree === "") &&
          (regPos.test(value.percentOfCommodityProfit) ||
            value.percentOfCommodityProfit === "")
        ) {
          let total;
          if (this.resellConfigInfo.resellGrade == 3)
            total =
              value.percentOfCommissionOne -
              0 +
              (value.percentOfCommissionTwo - 0) +
              (value.percentOfCommissionThree - 0);
          if (this.resellConfigInfo.resellGrade == 2)
            total =
              value.percentOfCommissionOne -
              0 +
              (value.percentOfCommissionTwo - 0);
          if (this.resellConfigInfo.resellGrade == 1)
            total = value.percentOfCommissionOne - 0;
          if (value.percentOfCommodityProfit > 100) {
            this.$message({
              message: "分销总佣金占商品总利润占比不能大于100%",
              type: "warning"
            });
            return;
          }
          if (total <= 100) this.initResellGood();
          else {
            this.$message({
              message: "所有层级分销比例相加之和不能大于100%",
              type: "warning"
            });
          }
        } else {
          this.$message({ message: "分销比例必须是正整数", type: "warning" });
        }
      },
      deep: true
    }
  },
  components: { dialogSelectImageMaterial },
  methods: {
    ...mapMutations(["SETCURRENT"]),
    // 选中商品图片
    changeImgCheck(key) {
      this.checkedImg = key;
    },
    /**
     *
     */
    goodDetails() {
      this._apis.goods
        .commisionGoodsDetails({ productInfoId: this.detail.id })
        .then(res => {
          this.status = res.isResell; //0不参与分销，1参与分销
          // 分销图片展示
          this.images = res.productInfoView.images
            ? res.productInfoView.images.split(",")
            : [];
          if (
            res.productInfoView.images.length &&
            res.commissionImage &&
            res.productInfoView.images.indexOf(res.commissionImage) !== -1
          ) {
            this.checkedImg = res.productInfoView.images.indexOf(
              res.commissionImage
            );
            this.picSorce = 0;
          } else {
            this.picSorce = 1;
            this.src = res.commissionImage;
          }
          //是否开启独立规则
          this.enable = res.isAloneResellRule == 1 ? true : false;
          // 显示金额
          if (res.isAloneResellRule == 1) {
            // 是否独立分销商品
            let resellRule = res.resellRule ? JSON.parse(res.resellRule) : null;
            if (resellRule) {
              resellRule.percentOfCommissionOne = resellRule.percentOfCommissionOne
                ? (resellRule.percentOfCommissionOne * 100).toFixed(0)
                : "0";
              resellRule.percentOfCommissionTwo = resellRule.percentOfCommissionTwo
                ? (resellRule.percentOfCommissionTwo * 100).toFixed(0)
                : "0";
              resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree
                ? (resellRule.percentOfCommissionThree * 100).toFixed(0)
                : "0";
              resellRule.percentOfCommodityProfit = resellRule.percentOfCommodityProfit
                ? (resellRule.percentOfCommodityProfit * 100).toFixed(0)
                : "0";
              this.resellRule = resellRule;
            }
          }
        })
        .catch(error => {
          this.$message({ message: error, type: "warning" });
        });
    },
    /**
     * 查看-分销店铺（默认）设置详情 commisionSetDetail
     */
    goodsSetDetail(){
      this._apis.goods
        .commisionSetDetail()
        .then(res => {
          this.resellConfigInfo=JSON.parse(res.resellConfigInfo);
        })
        .catch(error => {
          this.$message({ message: error, type: "warning" });
        });
    },
    // 开启独立分销
    changeEnable(val) {
      this.enable = val ? 1 : 0;
    },
    // 上传图片
    imageSelected(img) {
      this.src = img.filePath;
    },
    // 打开上传图片弹窗
    changeDialog() {
      this.dialogVisible = true;
      this.currentDialog = "dialogSelectImageMaterial";
    },
    // 初始化商品分销佣金  分销1.1隐藏商品分销佣金
    initResellGood() {
      let detail = this.detail;
      let resellGood = [];
      detail.goodsInfos.forEach(v => {
        let tmp = {};

        tmp.sku = v.id;
        tmp.specs = Object.values(JSON.parse(v.specs)).join(" ");
        tmp.status = v.status;
        tmp.salePrice = v.salePrice;
        tmp.costPrice = v.costPrice;
        tmp.profits = v.salePrice - v.costPrice;
        tmp.one = (
          (tmp.profits * (this.resellRule.percentOfCommissionThree - 0)) /
          100
        ).toFixed(2);
        tmp.two = (
          (tmp.profits * (this.resellRule.percentOfCommissionTwo - 0)) /
          100
        ).toFixed(2);
        tmp.three = (
          (tmp.profits * (this.resellRule.percentOfCommissionOne - 0)) /
          100
        ).toFixed(2);
        tmp.one = tmp.one > 0 ? tmp.one : 0;
        tmp.two = tmp.two > 0 ? tmp.two : 0;
        tmp.three = tmp.three > 0 ? tmp.three : 0;

        tmp.profitRate = ((tmp.profits / v.costPrice) * 100).toFixed(2) + "%";
        resellGood.push(tmp);
      });
      this.resellGood = resellGood;
    },
    // 保存数据校验
    getSubmitData() {
      let data = {};
      let resellConfigInfo = this.resellConfigInfo;
      data.isResell = this.status;
      if (this.picSorce == 0)
        data.commissionImage = this.images[this.checkedImg];
      if (this.picSorce == 1) {
        if (!this.src) {
          this.$message({ message: "请上传海报图片", type: "warning" });
          return false;
        } else {
          data.commissionImage = this.src;
        }
      }
      data.isAloneResellRule = this.enable ? 1 : 0;
      let resellRule = Object.assign({}, this.resellRule);
      let regPos = /^[0-9]\d*$/;

      // 开启了独立分销
      if (this.status == 1 && this.enable) {
        if (regPos.test(resellRule.percentOfCommodityProfit)) {
          if (resellRule.percentOfCommodityProfit <= 100) {
            resellRule.percentOfCommodityProfit =
              resellRule.percentOfCommodityProfit / 100;
          } else {
            this.$message({
              message: "分销总佣金占商品总利润不能大于100%",
              type: "warning"
            });
            return false;
          }
        } else {
          this.$message({
            message: "分销总佣金占商品总利润必须是正整数",
            type: "warning"
          });
          return false;
        }
        if (resellConfigInfo.resellGrade == 1) {
          resellRule.percentOfCommissionTwo = "";
          resellRule.percentOfCommissionThree = "";
          if (regPos.test(resellRule.percentOfCommissionOne)) {
            resellRule.percentOfCommissionOne =
              resellRule.percentOfCommissionOne / 100;
            let total = resellRule.percentOfCommissionOne - 0;
            if (total != 1) {
              this.$message({
                message: "当分销层级只有一级时，层级分销比例应为100%",
                type: "warning"
              });
              return false;
            } else data.resellRule = resellRule;
            // if(total > 1  || total < 0) {
            //     this.$message({ message: '所有层级分销比例相加之和不能大于100%', type: 'warning' });
            //     return false;
            // } else data.resellRule = resellRule;
          } else {
            this.$message({ message: "分销比例必须是正整数", type: "warning" });
            return false;
          }
        } else if (resellConfigInfo.resellGrade == 2) {
          resellRule.percentOfCommissionThree = "";
          if (
            regPos.test(resellRule.percentOfCommissionOne) &&
            regPos.test(resellRule.percentOfCommissionTwo)
          ) {
            resellRule.percentOfCommissionOne =
              resellRule.percentOfCommissionOne / 100;
            resellRule.percentOfCommissionTwo =
              resellRule.percentOfCommissionTwo / 100;
            let total =
              resellRule.percentOfCommissionOne -
              0 +
              (resellRule.percentOfCommissionTwo - 0);
            // if(total > 1  || total < 0) {
            //     this.$message({ message: '所有层级分销比例相加之和不能大于100%', type: 'warning' });
            //     return false;
            // } else data.resellRule = resellRule;
            if (total != 1) {
              this.$message({
                message: "所有层级分销比例相加之和应为100%",
                type: "warning"
              });
              return false;
            } else data.resellRule = resellRule;
          } else {
            this.$message({ message: "分销比例必须是正整数", type: "warning" });
            return false;
          }
        } else if (resellConfigInfo.resellGrade == 3) {
          if (
            regPos.test(resellRule.percentOfCommissionOne) &&
            regPos.test(resellRule.percentOfCommissionTwo) &&
            regPos.test(resellRule.percentOfCommissionThree)
          ) {
            resellRule.percentOfCommissionOne =
              resellRule.percentOfCommissionOne / 100;
            resellRule.percentOfCommissionTwo =
              resellRule.percentOfCommissionTwo / 100;
            resellRule.percentOfCommissionThree =
              resellRule.percentOfCommissionThree / 100;
            let total =
              resellRule.percentOfCommissionOne -
              0 +
              (resellRule.percentOfCommissionTwo - 0) +
              (resellRule.percentOfCommissionThree - 0);
            // if(total > 1  || total < 0) {
            //     this.$message({ message: '所有层级分销比例相加之和不能大于100%', type: 'warning' });
            //     return false;
            // } else data.resellRule = resellRule;
            if (total != 1) {
              this.$message({
                message: "所有层级分销比例相加之和应为100%",
                type: "warning"
              });
              return false;
            } else data.resellRule = resellRule;
          } else {
            this.$message({ message: "分销比例必须是正整数", type: "warning" });
            return false;
          }
        } else return false;
        // data.resellRule = resellRule;
      }

      return data;
    },
    // 保存
    submit() {
      let data = this.getSubmitData();
      if (data) {
        data.productInfoId = this.detail.id;
        // todo 保存商品分销设置
        this._apis.goods
          .commisionGoodsSet(data)
          .then(res => {
            this.historyBack();
          })
          .catch(error => {
            this.$message({ message: error, type: "warning" });
          });
      }
    },
    // 返回
    historyBack() {
      // TODO 返回
      if (this.$route.query.commissionEdit) {
        // 分销商品列表
        this.$router.push({
          path: "/apply",
          query: { paths: "/commission/commissionGoods/goods" }
        });
        this.SETCURRENT(8);
      } else {
        // bms 商品列表
        this.$router.push({ name: "goodsList" });
      }
    }
  },
  created() {
    if(this.detail.id){
      this.goodDetails();
      this.goodsSetDetail();
    }

    // 商品详情
    let detail = this.detail;
    // if (detail.isAloneResellRule == 1) {
    //   // 是否独立分销商品
    //   // this.enable = true;

    //   let resellRule = detail.resellRule ? JSON.parse(detail.resellRule) : null;
    //   if (resellRule) {
    //     resellRule.percentOfCommissionOne = resellRule.percentOfCommissionOne
    //       ? (resellRule.percentOfCommissionOne * 100).toFixed(0)
    //       : "0";
    //     resellRule.percentOfCommissionTwo = resellRule.percentOfCommissionTwo
    //       ? (resellRule.percentOfCommissionTwo * 100).toFixed(0)
    //       : "0";
    //     resellRule.percentOfCommissionThree = resellRule.percentOfCommissionThree
    //       ? (resellRule.percentOfCommissionThree * 100).toFixed(0)
    //       : "0";
    //     resellRule.percentOfCommodityProfit = resellRule.percentOfCommodityProfit
    //       ? (resellRule.percentOfCommodityProfit * 100).toFixed(0)
    //       : "0";
    //     this.resellRule = resellRule;
    //   }
    // }

    // // 分销图片展示
    // this.images = detail.images ? detail.images.split(",") : [];
    // if (
    //   this.images.length &&
    //   detail.resellImage &&
    //   this.images.indexOf(detail.resellImage) !== -1
    // ) {
    //   this.checkedImg = this.images.indexOf(detail.resellImage);
    //   this.picSorce = 0;
    // } else {
    //   this.picSorce = 1;
    //   this.src = detail.resellImage;
    // }

    // 是否参与分销
    // if (detail.isResell == 1) this.status = 1;
    // let sku = [];
    // detail.goodsInfos.forEach(v => {
    //   let tmp = {};

    //   tmp.sku = v.code;
    //   tmp.specs = Object.values(JSON.parse(v.specs)).join(" ");
    //   tmp.status = "";
    //   if (v.stock > 0) {
    //     if (v.status == 1) tmp.status = "上架";
    //     if (v.status == 0) tmp.status = "下架";
    //     if (v.status == -1) tmp.status = "售罄";
    //   } else {
    //     tmp.status = "售罄";
    //   }

    //   tmp.salePrice = v.salePrice;
    //   tmp.costPrice = v.costPrice;
    //   tmp.profits = v.salePrice - v.costPrice;
    //   tmp.profitRate = ((tmp.profits / v.costPrice) * 100).toFixed(2) + "%";
    //   sku.push(tmp);
    // });
    // this.sku = sku;
  },
  props: {
    detail: {
      type: Object,
      default: function() {
        return {
          goodsInfos: []
        };
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.line {
  margin-bottom: 22px;
  font-size: 14px;
  color: #3d434a;
  display: flex;
  .line-title {
    width: 108px;
    text-align: left;
  }
  .line-tip {
    font-size: 12px;
    line-height: 2;
    color: #92929b;
  }
  .goods-images {
    margin-top: 19px;
    display: flex;
    .good-img {
      position: relative;
      width: 86px;
      height: 86px;
      margin: 0 15px 15px 5px;
      img {
        width: 100%;
        height: 100%;
      }
      span {
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 1;
        background: #13ce66;
        i {
          color: #fff;
        }
      }
    }
  }
  .uploadBtn {
    width: 84px;
    height: 84px;
    margin-left: 10px;
    float: left;
    text-align: center;
    line-height: 84px;
    border: 1px dotted #d0d6e4;
    border-radius: 4px;
    i {
      font-size: 24px;
      color: #d0d6e4;
    }
  }
  .uploadBtnTip {
    width: 84px;
    margin-left: 10px;
    text-align: center;
    font-size: 12px;
    color: #655eff;
    line-height: 2;
    font-weight: 500;
  }
  .commision {
    display: flex;
    .commision-cell-left {
      width: 300px;
      .commision-title {
        margin-top: 12px;
        height: 34px;
        line-height: 34px;
        text-align: left;
      }
    }
    .commision-cell-center {
      width: 160px;
      input {
        width: 126px;
        height: 34px;
      }
    }
    .commision-prent {
      margin-top: 14px;
      width: 164px;
      position: relative;
      span {
        position: absolute;
        right: 0;
        z-index: 1;
        background: #d8d8d8;
        width: 32px;
        height: 32px;
        border-radius: 0 4px 4px 0;
        line-height: 34px;
        text-align: center;
      }
    }
    .commision-right {
      margin: 14px 60px 0 55px;
      display: flex;
      align-items: center;
      display: none;
    }
    /deep/ .el-input {
      width: 160px;
    }
  }
  .consult {
    margin-top: 40px;
    padding: 16px;
    width: 100%;
    border: 1px solid #cccccc;
    border-radius: 4px;
    background: rgba(250, 250, 250, 0.62);
    /deep/ .el-table .el-table__row {
      background: rgba(250, 250, 250, 0.62);
    }
  }
  .totalCommission {
    margin-left: -96px;
    margin-top: 10px;
    p {
      margin-top: 12px;
      height: 34px;
      line-height: 34px;
      text-align: left;
      position: relative;
      margin-right: 20px;
      &:before {
        content: "*";
        display: block;
        color: #fd932b;
        position: absolute;
        left: -12px;
        top: 6px;
        font-size: 26px;
      }
    }
    .prompt {
      font-size: 13px;
      margin-top: 12px;
      height: 34px;
      line-height: 34px;
      text-align: left;
      position: relative;
      margin-left: 32px;
      color: #fd932b;
      &:before {
        content: "";
        width: 14px;
        height: 14px;
        position: absolute;
        background: url(../../../assets/images/commissionOfficerAlertIcon.png);
        background-size: 100% 100%;
        top: 10px;
        left: -18px;
      }
    }
  }
  /deep/ .el-table th {
    background: rgb(235, 234, 250);
    color: rgb(101, 94, 255);
  }
  /deep/ .el-table .cell {
    text-align: center;
  }
  /deep/ .el-table td .cell {
    color: #44434b;
  }
  /deep/.el-table__header {
    width: 100% !important;
  }
  /deep/.el-table__body {
    width: 100% !important;
  }
}
.btns {
  margin-top: 100px;
  display: flex;
  justify-content: center;
}
</style>
