<template>
   <div class="decoration">
    <steps class="steps" :step="step"></steps>
    <h2 class="clearfix">线上生意又进一步，完善下面的工作吧!<el-button class="next" @click="next">不喜欢，换一组</el-button></h2>
    
    <swiper ref="mySwiper" class="list" :options="swiperOption">
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide class="item">
        <ul>
          <li class="img">
            <img src="https://test5-omo.aiyouyi.cn/web-file/0/image/30fb5/f225a847364b43269a45d70a4f37dc17.jpeg">
          </li>
          <li class="desc">
            <span>免费模版</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
    </swiper>
    <div class="btn">
      <el-button class="prev">上一步</el-button>
      <el-button class="next" type="primary" :loading="loading" @click="submit()" :disabled="isDisabled">下一步</el-button>
    </div>
   </div>
</template>

<script>

import Steps from './steps'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
export default {
  components: {
    Steps,
    Swiper,
    SwiperSlide
  },

  props: {
    step: {
      type: Number,
      default: 5
    }
  },

  data () {
    return {
      currPage: 0,
      loading: false,
      isDisabled: false,
      swiperOption: {
        slidesPerView: 5,
        spaceBetween: 20,
        slidesPerGroup: 5,
        loop: true,
        loopedSlides: 5,
        loopFillGroupWithBlank: true,
        // pagination: {
        //   el: '.swiper-pagination',
        //   clickable: true
        // },
        // navigation: {
        //   nextEl: '.swiper-button-next',
        //   prevEl: '.swiper-button-prev'
        // }
      },
      form: {
        pageNo: 1,
        pageSize: 5
      },
      totalPage: 2
    }
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },

  watch: {},

  created() {},

  mounted() {},

  methods: {
    submit() {},
    next() {
      if (this.currPage < this.totalPage ) {
        this.currPage++
      } else {
        this.currPage = 0
      }
      // this.swiper.slideTo(this.currPage, 1000, false)
      this.swiper.slideNext()
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.decoration {
  padding: 15px 13px 15px 31px;
  background-color: #fff;
  h2 {
      flex: 1;
      font-size:16px;
      font-weight:500;
      color:rgba(68,67,75,1);
      line-height:22px;
      padding: 42px 0 0 13px;
    .next {
      float: right;
      border-radius:4px;
      border:1px solid rgba(182,181,200,1);
    }
  }
  .list {
    padding: 35px 5px 5px 5px;
    .item {
      padding:15px 8px 12px 8px;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 10px 0px rgba(232,231,255,1);
      border:2px solid rgba(255,255,255,1);
      &.active,&:hover {
        border:2px solid rgba(101,94,255,1);
      }
      li {
        &.img {
          width: 100%;
          img {
            width: 100%;
            height: 100%;
          }
        }
        &.desc {
          padding-top: 5px;
          display: flex;
          span {
            width:84px;
            height:20px;
            font-size:14px;
            color:rgba(68,67,75,1);
            line-height:20px;
          }
          i {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            margin-right: 10px;
            &.mini_program {
              background: url('~@/assets/images/shop/xiaochengxu.png') no-repeat 0 0;
              background-size: 100% 100%;
            }

            &.wechat {
              background: url('~@/assets/images/shop/weixin.png') no-repeat 0 0;
              background-size: 100% 100%;
            }
          }

        }
        &.btn {
          padding-top: 14px;
          text-align: right;
          .preview {
            width:71px;
            border-radius:4px;
            border:1px solid rgba(62,180,136,1);
            font-size:14px;
            color:rgba(62,180,136,1);
          }
        }
      }
      
    }
  }
  >.btn {
    padding-top: 78px;
    padding-bottom: 202px;
    text-align: center;
    .prev {
      margin-right: 45px;
      border-radius:4px;
      border:1px solid rgba(101,94,255,1);
      font-size:12px;
      font-weight:400;
      color:rgba(101,94,255,1);
    }
  }
}
</style>