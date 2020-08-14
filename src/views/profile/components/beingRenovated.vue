<template>
  <div class="beingRenovated">
    <steps class="steps" :step="step"></steps>
    <h2 class="clearfix">线上生意又进一步，完善下面的工作吧!<el-button v-if="templateList.length > 0" class="next" @click="next">不喜欢，换一组</el-button></h2>
    <swiper v-if="templateList.length > 0" ref="mySwiper" class="list" :options="swiperOption">
      <swiper-slide class="item" v-for="(item, key) of templateList" :key="key" :class="[isCurrentCheckedTemplate(item.id) ? 'active': '']">
        <ul @click="choose(item)">
          <li class="img">
            <img :src="item.photoHalfUrl" alt="">
          </li>
          <li class="desc">
            <span>{{ item.name }}</span>
            <i class="mini_program"></i>
            <i class="wechat"></i>
          </li>
          <li class="btn">
            <el-button class="preview" @click="preview(item)">预览</el-button>
          </li>
        </ul>
      </swiper-slide>
    </swiper>
    <div class="btn">
      <el-button class="prev" @click="goPrev">上一步</el-button>
      <el-button class="next" type="primary" :loading="loading" @click="submit()" :disabled="isDisabled">完成</el-button>
    </div>
    <div class="big_preview animated fadeInDown faster" v-if="showBigPreview">
        <div class="img_wrapper">
          <img :src="currentPreviewTemplate && currentPreviewTemplate.photoDetailsUrl" alt="" ref="bigImage">
        </div>
        <i class="close_preview" @click="close"></i>
        <div class="zoom">
          <i class="plus" @click="plus"></i>
          <i class="reduce" @click="reduce"></i>
        </div>
        <!--<div class="apply" @click="apply(currentPreviewTemplate)">立即应用</div>-->
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
        allowSlidePrev : false,
        slidesPerView: 5,
        spaceBetween: 20,
        slidesPerGroup: 5,
        loop: true,
        loopedSlides: 5,
        loopFillGroupWithBlank: true,
        noSwiping : true,
        noSwipingClass : 'item',
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
      preLoadObj: null,  //预加载对象
      templateList: [],
      totalPage: 0,
      showBigPreview: false,
      currentTemplate: null,
      currentPreviewTemplate: null,
      zoomRatio: 1,
      qrCodeInfo: null,
      mode: null,
      isOtherEnterCompleted: false,
      maxWidth: 550,
      imgNow: 0
    }
  },

  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
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
      }
  },

  created() {
    this.getEffTemplateList()
    this.preLoadObj = new Image();
    this.handleCompleteStatus()
  },

  mounted() {},

  methods: {
    goPrev() {
      this.$emit('getStep', 4)
    },
    // 处理用户已完成的情况返回页面弹窗提示
    handleCompleteStatus() {
      if (this.step === 6) {
        this.confirm({
          title: "提示",
          iconSuccess: true,
          text: '引导步骤已完成',
          confirmText: '确定',
          showCancelButton: false
        }).then(() => {
          this.$router.push({ path: '/profile/profile'})
        }).catch(() => {
          this.$router.push({ path: '/profile/profile'})
        });
      }
    },
    setStoreGuide(storeGuide) {
      let id = this.cid
      let data = {
        id,
        storeGuide
      }
      return new Promise((resolve, reject) => {
        this._apis.set.updateShopInfo(data).then(response =>{
          this.$store.dispatch('getShopInfo');
          this.$store.commit('setStoreGuide', storeGuide)
          resolve(response)
        }).catch(error =>{
          reject(error)
          console.log('updateShopInfo:error', error)
          // this.$message.error('保存失败');
        })
      })
      
    },
    updateStep() {
      const cid = this.cid;
      const step = 6
      return new Promise((resolve, reject) => {
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            setTimeout(() => {
              this.$emit('getStep', step)
            }, 500)
            resolve(response)
          }).catch((err) => {
            reject(err)
          })
      })
    },
    isCurrentCheckedTemplate(id) {
      return this.currentTemplate && this.currentTemplate.id === id
    },
    test(){
      console.log('parent')
    },
    test2() {
      console.log('children')
    },
    choose(item) {
      this.currentTemplate = item
    },
    /* 放大 */
    plus() {
      this.mode = 'plus';
      console.log(this.$refs.bigImage, this.$refs.bigImage.clientWidth)
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
      this._apis.shop.getTemplateInfo({
        pageTemplateId: item.id
      }).then(res1 => {
        if (item.chargeType !== 1) {
          // if (res1 === null || res1.status === 2) {
          //   this._apis.templatePay.getOrcode({
          //     orderSource: 1,
          //     orderType: 1,
          //     shopName: JSON.parse(localStorage.getItem('shopInfos')).shopName,
          //     templateChargeType: item.chargeType,
          //     templateId: item.id,
          //     templateName: item.name,
          //     templatePrice: item.price
          //   }).then(res => {
          //     this.qrCodeInfo = res
          //     // this.dialogVisible = true // 全部为免费模版
          //     this.tempInfo = item
          //   })
          // } else {
          //   this.confirm({
          //     title: '提示',
          //     customClass: 'goods-custom',
          //     // icon: true,
          //     text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
          //   }).then(() => {
          //     this._routeTo('m_templateEdit', {id: item.id});
          //   })
          // }
        } else {
          if (res1 === null) {
            this._apis.shop.addFreeTemplate({
              pageTemplateId: item.id
            }).then(response => {
              this.confirm({
                title: '提示',
                customClass: 'goods-custom',
                // icon: true,
                text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
              }).then(() => {
                this._routeTo('m_templateEdit', {id: item.id});
              })
            })
          } else {
            this.confirm({
              title: '提示',
              customClass: 'goods-custom',
              // icon: true,
              text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
            }).then(() => {
              this._routeTo('m_templateEdit', {id: item.id});
            })
          }
        }
      })
    },
    /* 预览模板 */
    preview(item) {
      this.showBigPreview = true;
      this.currentPreviewTemplate = item;
      this.zoomRatio = 1;
    },

    getEffTemplateList() {
      const reqParams = {
        type: 1,
        chargeType: 1,
        startIndex: this.form.pageNo,
        pageSize: this.form.pageSize,
        sortBy: 3 // 新增根据人气排序
      }
      return new Promise((resolve, reject) => {
        this._apis.goodsOperate.getEffTemplateList(reqParams).then((response) => {
          this.totalPage = Math.ceil(response.total / this.form.pageSize);
          this.templateList = this.templateList.concat(response.list);
          this.imgNow = 0;
          this.preload(this.templateList, 'photoDetailsUrl');
          resolve(response)
        }).catch((err) => {
          reject(err)
        })
      })
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
        console.log("图片加载失败");
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
    hasBeenComplete(id) {
      const p1 = this.updateStep()
      const p2 = this.setStoreGuide(1)
      Promise.all([p1, p2]).then(() => {
        this._routeTo('m_templateEdit', { id });
      }).catch(() => {
         this.$message.error('保存失败');
      })
    },
    submit() {
      if (!this.currentTemplate) return false
      const id = this.currentTemplate.id
      this._apis.shop.getTemplateInfo({
        pageTemplateId: id
      }).then(res1 => {
        if (res1 === null) {
          this._apis.shop.addFreeTemplate({
            pageTemplateId: id
          }).then(response => {
            this.confirm({
              title: '提示',
              showCancelButton: false,
              icon: true,
              text: `您已选择${this.currentTemplate.name}模板，为了保证商城的完整性， 需要您对当前模板进行信息编辑。`,
              confirmText: '去设置'
            }).then(() => {
              this.hasBeenComplete(id)
              // this._routeTo('m_templateEdit', { id });
            })
          })
        } else {
          this.confirm({
            title: '提示',
            showCancelButton: false,
            icon: true,
            text: `您已选择${this.currentTemplate.name}模板，为了保证商城的完整性， 需要您对当前模板进行信息编辑。`,
            confirmText: '去设置'
          }).then(() => {
            this.hasBeenComplete(id)
            // this._routeTo('m_templateEdit', { id });
          })
        }
      })
    },
    next() {
      if (this.form.pageNo < this.totalPage) {
        this.form.pageNo =  this.form.pageNo + 1
        this.getEffTemplateList().then(() => {
          if (this.currPage < this.totalPage ) {
            this.currPage++
          } else {
            this.currPage = 0
          }
          this.swiper.update()
          // this.swiper.slideTo(this.currPage, 1000, false)
          this.swiper.slideNext()
        })
      } else {
          
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
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.beingRenovated {
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
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      box-shadow:0px 2px 10px 0px rgba(232,231,255,1);
      border:2px solid rgba(255,255,255,1);
      &.active,&:hover {
        border:2px solid rgba(101,94,255,1);
      }
      ul {
        padding: 15px 8px 12px 8px;
      }
      li {
        &.img {
          max-width: 100%;
          height: 254px;
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
        background: rgba(255, 255, 255, 0.3) url('~@/assets/images/shop/tempClose.png') no-repeat 15px 15px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        transition: all 0.4s;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.5) url('~@/assets/images/shop/tempClose.png') no-repeat 15px 15px;
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
          background: rgba(255, 255, 255, 0.3) url('~@/assets/images/shop/plus.png') no-repeat 3px 3px;
          margin-bottom: 14px;

          &:hover {
            background: rgba(255, 255, 255, 0.5) url('~@/assets/images/shop/plus.png') no-repeat 3px 3px;
          }
        }

        .reduce {
          background: rgba(255, 255, 255, 0.3) url('~@/assets/images/shop/reduce.png') no-repeat 3px 3px;

          &:hover {
            background: rgba(255, 255, 255, 0.5) url('~@/assets/images/shop/reduce.png') no-repeat 3px 3px;
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