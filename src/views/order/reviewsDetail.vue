<template>
  <div class="reviews-detail">
    <section class="customer-reviews">
      <div class="title">
        <div class="row justify-between">
          <div class="clo">用户评价</div>
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
                    <img width="66" :src="orderProductComment.goodsImage" alt />
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
                <div class="row align-center">
                  <div class="col">
                    <el-rate disabled :colors="colors" v-model="orderProductComment.starNum"></el-rate>
                  </div>
                  <div class="col">
                    <span>{{orderProductComment.starNum | starNumFilter}}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col reviews-label">评价内容</div>
              <div class="col gray reviews-content">
                <p>{{orderProductComment.content}}</p>
                <div class="row">
                  <div class="col images">
                    <template v-for="(item, index) in orderProductComment.images">
                      <template v-if="/\.mp4|\.ogg|\.mov$/.test(item.image)">
                        <!-- <video width="66" controls="controls">
                          <source :src="item" type="video/ogg">
                          <source :src="item" type="video/mp4">
                        Your browser does not support the video tag.
                        </video> -->
                        <div @click="dialogVisible = true; bigMessage.image = false; bigMessage.url = item.image; bigMessage.images = orderProductComment.images; bigMessage.imageIndex = index;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
                            <video width="51" controls="controls">
                            <source :src="item.image" type="video/ogg">
                            <source :src="item.image" type="video/mp4">
                            <source :src="item.image" type="video/mov">
                            Your browser does not support the video tag.
                            </video>
                            <div class="over">
                                <i class="el-icon-zoom-in"></i>
                            </div>
                        </div>
                      </template>
                      <template v-else>
                        <!-- <img
                        width="66"
                        :src="item"
                        alt
                      /> -->
                      <div @click="dialogVisible = true; bigMessage.image = true; bigMessage.url = item.image; bigMessage.images = orderProductComment.images; bigMessage.imageIndex = index;" class="image-item" :class="{active: item.over}" @mouseover="item.over = true" @mouseout="item.over = false">
                          <img
                              width="51"
                              :src="item.image"
                              alt
                          />
                          <div class="over">
                              <i class="el-icon-zoom-in"></i>
                          </div>
                      </div>
                      </template>
                    </template>
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
            <template v-if="orderProductComment.isHideName">
              <div class="row">
                <div class="col reviews-label">匿名评价</div>
              </div>
            </template>
            <template v-else>
              <div class="row">
                <div class="col reviews-label">用户昵称</div>
                <div class="col gray">{{orderProductComment.memberName}}</div>
              </div>
              <div class="row">
                <div class="col reviews-label">用户ID</div>
                <div class="col gray">{{orderProductComment.memberSn}}</div>
              </div>
            </template>
            <div class="row">
              <div class="col reviews-label">评价时间</div>
              <div class="col gray">{{orderProductComment.createTime}}</div>
            </div>
            <div class="row">
              <div class="col reviews-label">评论获得积分</div>
              <div class="col gray">{{orderProductComment.gainScore || 0}}</div>
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
        <!-- <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig"></RichEditor> -->
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入回复内容，不超过200个字符"
            v-model="textarea"
            maxlength="200">
        </el-input>
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
          :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
        >
          <el-table-column prop="type" label="操作">
            <template slot-scope="scope">
              <span>{{scope.row.type | typeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createUserName" label="操作人"></el-table-column>
          <el-table-column prop="createTime" label="操作时间"></el-table-column>
        </el-table>
      </div>
    </section>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <template v-if="!/\.mp4|\.ogg|\.mov$/.test(bigMessage.url)">
          <div class="images-box">
              <div @click="goImage('left')" class="lefter"></div>
              <div class="image">
                  <img width="500" :src="bigMessage.url" />
              </div>
              <div @click="goImage('right')" class="righter"></div>
          </div>
      </template>
      <template v-else>
          <div class="video-box">
            <div @click="goImage('left')" class="lefter"></div>
            <video :src="bigMessage.url" width="500" controls="controls">
              <source :src="bigMessage.url" type="video/ogg">
              <source :src="bigMessage.url" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <div @click="goImage('right')" class="righter"></div>
          </div>
      </template>
  </el-dialog>
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
          
        ],
        orderNumber: 1,
        customerId: 1,
        reviewsTime: "",
        integral: ""
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
        initialFrameWidth: 500,
        toolbars: [
            ['emotion']
        ],
      },
      orderProductComment: {},
      recordList: [],
      systomSensitiveList: [],
      dialogVisible: false,
      bigMessage: {}
    };
  },
  created() {
    this.getDetail();
    this.getPublicList()
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
    starNumFilter(value) {
      switch (value) {
        case 1:
          return "差评";
        case 2:
          return "一般";
        case 3:
          return "挺好";
        case 4:
          return "满意";
        case 5:
          return "非常满意";
        default:
          return "";
      }
    }
  },
  methods: {
    // goImage(flag) {
    //     let index = this.bigMessage.imageIndex
    //     let list = this.bigMessage.images

    //     if(flag == 'left') {
    //         index = index - 1
    //         if(index >=0) {
    //             this.bigMessage.url = this.bigMessage.images[index].image
    //         }
    //     } else {
    //         index = index + 1
    //         if(index <= this.bigMessage.images.length - 1) {
    //             this.bigMessage.url = this.bigMessage.images[index].image
    //         }
    //     }
    // },
    goImage(flag) {
            let index = this.bigMessage.imageIndex
            let list = this.bigMessage.images
            
            if(flag == 'left') {
                index = index - 1

                if(index >=0) {
                    this.bigMessage.imageIndex = index
                    this.bigMessage.url = list[index].image
                    this.$forceUpdate()
                }
            } else {
                index = index + 1
                if(index <= list.length - 1) {
                    this.bigMessage.imageIndex = index
                    this.bigMessage.url = list[index].image
                    this.$forceUpdate()
                }
            }
        },
    getPublicList(param) {
        this._apis.goodsOperate.fetchPublicSensitiveList().then((res) => {
            this.systomSensitiveList = res
        }).catch(error => {
            this.$message.error(error);
        })
    },
    replyComment() {
      let replaced = this.textarea.replace(/<[^>]*>|<\/[^>]*>/gm, "")

      if(!replaced) {
          this.$message({
          message: '回复不能为空',
          type: 'warning'
        });
        return
        }
        if(/^\s+$/.test(replaced)) {
          this.$message({
          message: '回复不能为空字符',
          type: 'warning'
        });
        return
        }
        if(replaced.length > 200) {
          this.$message({
          message: '回复字符不能超过200',
          type: 'warning'
        });
        return
        }
        let _textarea = this.textarea

      //   var  replaceContent = function(html,keywords,replacecontents){
      //     //匹配html标签中间的内容
      //     var patt1 = new RegExp(">(.*?)(?=<)","g");
      //     //每个匹配结果会多一个>比如<p>哈哈</p>,匹配出来会是>哈哈,后面将>进行替换
      //     var matchStrs = html.match(patt1);
      //     var words = [];
      //     //替换>
      //     for(var i=0;i<matchStrs.length;i++){
      //         var matchStr = matchStrs[i].substring(1,matchStrs[i].length);
      //         for(var j=0;j<keywords.length;j++){
      //             var patt2 = new RegExp(keywords[j],"g");
      //             matchStr = matchStr.replace(patt2,replacecontents[j]);
      //         }
      //         words.push(matchStr);
      //     }
      //     // 将html中间的内容进行替换方便后面连接,如将<p>哈哈</p>替换成<p>%s</p>
      //     var temp = html.replace(patt1,">%s");
      //     //将拆分出来的标签按顺序和替换敏感字后的中间内容进行连接
      //     var arr = temp.split("%s");
      //     var finalStr = "";
      //     for(var i=0;i<(arr.length-1);i++){
      //         finalStr += arr[i] + words[i];
      //     }
      //     finalStr += arr[arr.length - 1]

      //     return finalStr;
      // }

      // this.systomSensitiveList.forEach(word => {
      //     let _word = word

      //     _textarea = replaceContent(_textarea, word, '**')
      //   })

        this._apis.order.replyComment({id: this.$route.query.id, replyContent: _textarea}).then((res) => {
            this.$message.success('回复成功！');
            this.showReplayBox = false
            this.getDetail()
        }).catch(error => {
            this.$message.error(error);
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
          // console.log(res);
          let images = res.orderProductComment.images;

          if (images) {
            res.orderProductComment.images = images.split(",").map(val => {
              return {
                image: val,
                over: false,
              }
            });
          } else {
            res.orderProductComment.images = [];
          }
          this.orderProductComment = res.orderProductComment;
          this.recordList = res.recordList;
        })
        .catch(error => {console.error(error)});
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
    font-size: 14px;
  }
  color: #333333;
  section {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
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
              &:first-child {
                padding-right: 30px;
              }
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
          .row {
            margin-bottom: 10px;
            .reviews-label {
              text-align: left;
            }
          }
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
.images {
        margin-top: 5px;
        display: flex;
        .image-item {
            margin-right: 5px;
            width: 51px;
            height: 51px;
            position: relative;
            overflow: hidden;
            .over {
                position: absolute;
                width: 51px;
                height: 51px;
                z-index: 1000;
                left: -999px;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
            }
            &.active {
                outline: 2px solid #35383a;
                .over {
                    left: 0;
                }
            }
            img, video {
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    /deep/ .el-icon-zoom-in:before {
        font-size: 18px;
    }
    /deep/ .el-dialog__body {
        text-align: center;
    }
    /deep/ .el-dialog__body {
        padding: 10px;
        padding-bottom: 60px;
    }
    .images-box, .video-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .lefter {
            width: 48px;
            height: 48px;
            background: url(../../assets/images/order/left-icon.png) no-repeat;
            cursor: pointer;
        }
        .righter {
            width: 48px;
            height: 48px;
            background: url(../../assets/images/order/right-icon.png) no-repeat;
            cursor: pointer;
        }
    }
    // .video-box {
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    // }
    /deep/ .el-table td, /deep/ .el-table th {
        text-align: center;
    }
    /deep/ .el-table tr th {
        border-bottom: none;
    }
    /deep/ .record .el-table td, /deep/ .record .el-table th {
        text-align: center;
        &:nth-child(1) {
            text-align: left;
        }
        &:nth-child(3) {
            text-align: right;
        }
    }
    /deep/ .record .el-table th {
        &:nth-child(3) {
            padding-right: 50px;
        }
    }
</style>
<style lang="scss">
  .reviews-detail {
    .edui-for-xiumi-connect, .edui-for-seletedImage, .edui-for-seletedVideo {
        display: none!important;
    }
  }
</style>


