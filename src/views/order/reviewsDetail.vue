<template>
  <div class="reviews-detail">
    <section class="customer-reviews">
      <div class="title">
        <div class="row justify-between">
          <div class="clo">客户评价</div>
          <div class="clo">
            <el-button @click="$router.go(-1)">返 回</el-button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="row justify-between">
          <div class="clo reviews-lefter">
            <div class="row">
              <div class="col reviews-label">商品信息</div>
              <div class="col">
                <div class="row align-center">
                  <div class="col reviews-image">
                    <img :src="customerReviews.url" alt />
                  </div>
                  <div class="col">
                    <div class="goods-name">
                      <p>{{orderProductComment.goodsName}}</p>
                      <p>{{orderProductComment.goodsSpecs | goodsSpecsFilter}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col reviews-label">评论等级</div>
              <div class="col">
                <el-rate disabled :colors="colors" v-model="orderProductComment.starNum"></el-rate>
              </div>
            </div>
            <div class="row">
              <div class="col reviews-label">评价内容</div>
              <div class="col gray reviews-content">
                <p>{{orderProductComment.content}}</p>
                <div class="row">
                  <div class="col">
                    <img
                      width="66"
                      :src="item"
                      alt
                      v-for="(item, index) in orderProductComment.images"
                      :key="index"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="clo reviews-righter">
            <div class="row">
              <div class="col reviews-label">订单编号</div>
              <div class="col gray">{{orderProductComment.orderCode}}</div>
            </div>
            <div class="row">
              <div class="col reviews-label">客户ID</div>
              <div class="col gray">{{orderProductComment.memberSn}}</div>
            </div>
            <div class="row">
              <div class="col reviews-label">评价时间</div>
              <div class="col gray">{{orderProductComment.createTime}}</div>
            </div>
            <div class="row">
              <div class="col reviews-label">评论获得积分</div>
              <div class="col gray">{{orderProductComment.gainScore}}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section class="replay">
      <div class="title">
        <div class="row">
          <div class="col replay-label">商户回复</div>
          <div style="cursor: pointer;" v-if="orderProductComment.isReply != 1" @click="showReplayBox = true" class="col blue">我要回复评论</div>
          <div class="col" v-html="orderProductComment.replyContent"></div>
        </div>
      </div>
      <div v-if="showReplayBox" class="replay-box">
        <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig"></RichEditor>
        <div class="footer">
          <el-button @click="showReplayBox = false; textarea = ''">取 消</el-button>
          <el-button @click="replyComment" type="primary">确 定</el-button>
        </div>
      </div>
    </section>
    <section class="record">
      <div class="title">操作记录</div>
      <div class="table-box">
        <el-table
          :data="recordList"
          style="width: 100%"
          :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
        >
          <el-table-column prop="type" label="操作" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.type | typeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="操作人" width="180"></el-table-column>
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
        </el-table>
      </div>
    </section>
  </div>
</template>
<script>
import RichEditor from "@/components/RichEditor";

export default {
  data() {
    return {
      colors: ["#655EFF", "#655EFF", "#655EFF"],
      customerReviews: {
        url: require("../../assets/images/order/apple.png"),
        goodsName: "商品名称",
        spec: "属性1",
        level: 4,
        reviewsContent: "声音小",
        reviewsImages: [
          {
            url: require("../../assets/images/order/reviewsImages.png")
          },
          {
            url: require("../../assets/images/order/reviewsImages.png")
          }
        ],
        orderNumber: 1,
        customerId: 1,
        reviewsTime: "2019",
        integral: "2019"
      },
      textarea: "",
      tableData: [],
      showReplayBox: false,
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 400,
        // 初始容器宽度
        initialFrameWidth: 500
      },
      orderProductComment: {},
      recordList: []
    };
  },
  created() {
    this.getDetail();
  },
  filters: {
    typeFilter(code) {
      switch (code) {
        case 0:
          return "审核";
        case 1:
          return "回复";
        case 2:
          return "设为精选";
        case 3:
          return "取消精选";
      }
    },
    goodsSpecsFilter(value) {
      let str = ''
      let _value

      if(typeof value == 'string') {
        _value = JSON.parse(value)
      } else {
        _value = value
      }

      for(let i in _value) {
        str += i + ':' + _value[i] + ','
      }
      str = str.replace(/(^.*)\,$/, '$1')

      return str
    }
  },
  methods: {
    replyComment() {
        this._apis.order.replyComment({id: this.$route.query.id, replyContent: this.textarea}).then((res) => {
            this.$notify({
              title: "成功",
              message: "回复成功！",
              type: "success"
            });
            this.showReplayBox = false
        }).catch(error => {
            this.$notify.error({
            title: "错误",
            message: error
          });
          this.showReplayBox = false
        })
    },
    editorValueUpdate(value) {
      this.textarea = value;
    },
    getDetail() {
      this._apis.order
        .getCommentInfo({ id: this.$route.query.id })
        .then(res => {
          console.log(res);
          let images = res.orderProductComment.images;

          if (images) {
            res.orderProductComment.images = images.split(",");
          } else {
            res.orderProductComment.images = [];
          }
          this.orderProductComment = res.orderProductComment;
          this.recordList = res.recordList;
        })
        .catch(error => {});
    }
  },
  components: {
    RichEditor
  }
};
</script>
<style lang="scss" scoped>
.reviews-detail {
  .gray {
    color: #9fa29f;
  }
  color: #333333;
  section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    &.customer-reviews {
      .title {
        font-size: 16px;
      }
      .content {
        margin-top: 20px;
        .reviews-label {
          margin-right: 20px;
          flex-shrink: 0;
        }
        .reviews-lefter {
          > .row {
            margin-bottom: 10px;
          }
          .reviews-image {
            margin-right: 10px;
          }
          .goods-name {
            p {
              margin-bottom: 10px;
            }
            p:last-child {
              color: #9fa29f;
            }
          }
          .reviews-content {
            p {
              margin-bottom: 20px;
            }
            img {
              margin-right: 10px;
            }
          }
        }
        .reviews-righter {
          border-left: 1px solid #cacfcb;
          padding: 10px 20px;
          .reviews-label {
            width: 84px;
          }
        }
      }
    }
    &.replay {
      .title {
        font-size: 16px;
        margin-bottom: 30px;
        .replay-label {
          margin-right: 20px;
          flex-shrink: 0;
        }
      }
      .footer {
        text-align: center;
        margin-top: 30px;
        width: 500px;
      }
    }
    &.record {
      .title {
        font-size: 16px;
        margin-bottom: 20px;
      }
    }
  }
}
/deep/ .el-textarea__inner {
  min-height: 167px !important;
}
</style>


