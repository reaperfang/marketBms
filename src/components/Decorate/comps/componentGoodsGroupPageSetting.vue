<template>
    <div ref="groupWrapper" :style="fontStyle" v-if="data">
      <div class="componentGoodsSearch" style="z-index:4;">
          <div class="inputBox" :class="{'borderStyle': ruleForm.searchStyle==2}" style="background:rgb(238,238,238);height: 36px;">
              <img src="@/assets/images/shop/fdj.png" class="fdj" />
              <p :style="fontStyle">商品搜索</p>
          </div>
          <!-- <p class="searchButton">搜索</p> -->
          <div class="gwcIcon">
              <img src="@/assets/images/shop/template2/tongzhi-3.png" alt="">
          </div>
      </div>
       <div class="left-style" v-if="ruleForm.groupStyle==1">
          <ul class="nav">
            <li>分类一</li>
            <li>分类二</li>
            <li>分类三</li>
            <li>分类四</li>
            <li>分类五</li>
          </ul>
          <div class="content" :style="pageMargin">
            <div class="wrapper" :style="groupMargin">
              <p :style="fontStyle">二级分分类一
                <span :style="fontStyle">全部商品 ></span>
              </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类四</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类五</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类六</span>
                </li>
              </ul>
            </div>
            <div class="wrapper" :style="groupMargin">
              <p :style="fontStyle">二级分分类二
                <span :style="fontStyle">全部商品 ></span>
              </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
              </ul>
            </div>
            <div class="wrapper" :style="groupMargin">
              <p :style="fontStyle">二级分分类三
                <span :style="fontStyle">全部商品 ></span>
              </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="top-style" v-else-if="ruleForm.groupStyle==2">
          <ul class="nav tile-list n5">
            <li>分类一</li>
            <li>分类二</li>
            <li>分类三</li>
            <li>分类四</li>
            <li>分类五</li>
          </ul>
          <div class="content" :style="pageMargin">
            <div class="wrapper" :style="groupMargin">
               <p :style="fontStyle">二级分分类一
                 <span :style="fontStyle">全部商品 ></span>
               </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
              </ul>
            </div>
            <div class="wrapper" :style="groupMargin">
              <p :style="fontStyle">二级分分类二
                <span :style="fontStyle">全部商品 ></span>
              </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
              </ul>
            </div>
            <div class="wrapper" :style="groupMargin">
              <p :style="fontStyle">二级分分类三
                <span :style="fontStyle">全部商品 ></span>
              </p>
              <ul class="group tile-list n3">
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类一</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类二</span>
                </li>
                <li>
                  <img src="@/assets/images/shop/goodsDemo.png" alt="">
                  <span :style="fontStyle">三级分分类三</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'componentGoodsGroupPageSetting',
  components: {},
  props: ['data'],
  data () {
    return {
      fontStyle: {fontWeight: 500},  //动态字体样式对象
      pageMargin: {padding: '15px'},  //动态页面边距对象
      groupMargin: {marginBottom: '20px'},  //动态分分类间距对象
      ruleForm: this.data
    }
  },
  mounted() {
    this.setFont();
    this.setImgRadius();
  },
  watch:{

    data:{
      handler(newValue) {
        this.ruleForm = newValue;
      },
      deep: true
    },

    /* 监听样式类型改变 */
    'ruleForm.groupStyle'() {
      this.$nextTick(()=>{
        this.setFont();
        this.setImgRadius();
      })
    },

    /* 监听字体粗细改变 */
    'ruleForm.groupFont'(newValue) {
      this.setFont(newValue);
    },

    /* 监听图片圆角改变 */
    'ruleForm.groupImg'(newValue) {
      this.setImgRadius(newValue);
    },

    /* 监听页面边距改变 */
    'ruleForm.pageMargin'(newValue) {
      this.pageMargin = {padding: `${newValue}px`};
    },

    /* 监听分分类边距改变 */
    'ruleForm.groupMargin'(newValue) {
      this.groupMargin = {marginBottom: `${newValue}px`};
    }
  },
  methods: {
     /* 设置字体粗细 */
    setFont(value = this.ruleForm.groupFont) {
      if(value == 1) {
        this.fontStyle = {fontWeight: 500};
      }else if(value == 2) {
        this.fontStyle = {fontWeight: 700};
      }
    },

    /* 设置图片圆角 */
    setImgRadius(value = this.ruleForm.groupImg) {
      const imgs = this.$refs.groupWrapper.querySelectorAll('img');
      for(let i=0;i<imgs.length;i++){
        if(value == 1){
          imgs[i].style.borderRadius = '0%';
        }else if(value == 2) {
          imgs[i].style.borderRadius = '10px';
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
 ul.nav {
    width: 100%;
    background: #fff;
    li {
      font-size: 13px;
      padding: 4px;
      text-align: center;
      line-height: 30px;
      margin-bottom: 0;
      color:rgba(124,124,124,1);
      cursor: pointer;
      &:hover{
        font-size:13px;
        color:rgba(252,61,66,1);
        transition:all 0.4s;
      }
      &:first-child{
        color:rgba(252,61,66,1);
        transition:all 0.4s;
        position:relative;
        &:after{
          content: "";
          display: block;
          background: #ff7068;
          position: absolute;
        }
      }
    }
  }
  .content {
    padding: 10px 0 0 10px;
    box-sizing: border-box;
    width: 100%;
    background:#fff;
    .wrapper {
      background: #fff;
      margin-bottom: 10px;
      p {
        background: #fff;
        padding: 10px;
        margin-bottom: 20px;
        height: 44px;
        line-height:22px;
        font-size:13px;
        color:rgba(51,51,51,1);
        border-radius: 8px;
        -webkit-box-shadow: 2px 0px 8px rgba(0,0,0,0.2);
        box-shadow: 0px 0px 4px rgba(0,0,0,0.1);
        display:flex;
        justify-content: space-between;
        span{
          font-size:12px;
          color:rgba(124,124,124,1);
        }
      }
      ul.group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          cursor:pointer;
          img {
            width: 75px;
            height: 75px;
          }
          span {
            margin-top: 20px;
            font-size:13px;
            color:rgba(51,51,51,1);
            text-align: center;
            width: 74px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }
      }
    }
  }
.left-style {
  display:flex;
  flex-direction: row;
  justify-content: space-between;
  ul.nav{
    width: 98px;
    li{
      margin-bottom: 10px;
      &:first-child{
        &:after{
          width: 3px;
          height: 15px;
          top: 12px;
          left: 0;
        }
      }
    }
  }
  .content{
    width:calc( 100% - 98px );
  }
}
.top-style {
  ul.nav{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding:0 10px;
    li{
      padding: 0 4px;
      text-align: center;
      line-height: 26px;
      border-radius:6px;
      font-size:13px;
      &:first-child{
        border:1px solid rgb(252,65,70);;
        color:rgb(252,65,70);
      }
    }
  }
  .content{
    width: 100%;
  }
}


// 搜索框样式
.componentGoodsSearch{
    padding:15px 0;
    background:#fff;
    display:flex;
    align-items:center;
    .searchButton{
        text-align:center;
        color:#333;
        width:50px;
        height:100%;
        font-size:16px;
        margin-left:5px;
        @extend .flexCenterMiddle;
    }
    .gwcIcon{
        width:50px;
        height:100%;
        display: -webkit-flex;
        display: flex;
        flex-direction:column;
        justify-content:center;
        align-items:center;
        margin-left:5px;
        position:relative;
        img{
            width:16px;
            height:20px;
        }
        .redCircle{
            position:absolute;
            top:1.5px;
            right:10px;
            font-size:7px;
            color:#fff;
            padding:0 2.5px;
            height:9px;
            line-height:9px;
            background:#FC3D42;
            @include borderRadius(25px);
        }
    }
    .inputBox.textPosition{
        justify-content:center;
    }
    .inputBox.borderStyle{
        border-radius:25px;
    }
    .inputBox{
        position:relative;
        overflow:hidden;
        margin-left:10px;
        height:100%;
        display:flex;
        flex:1;
        align-items:center;
        padding:0 10px;
        .fdj{
            width:14px;
            height:14px;
            margin-right:10px;
        }
        p{
            font-size:14px;
            color:rgba(153,153,153,1);
        }
    }
}
</style>
