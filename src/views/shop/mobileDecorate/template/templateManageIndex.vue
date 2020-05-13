<template>
  <div class="template_wrapper">
    <ul class="clearFix" v-loading="loading">
      <li v-if="!templateList.length || startIndex == 1">
        <div class="inner">
          <div class="view">
            <div style="width:100%;height:100%;background:rgb(230,228,255)"></div>
          </div>
          <div class="info">
            <div class="top">
              <span>空白模板</span>
            </div>
            <div class="bottom">
              <span class="price"></span>
              <el-button type="primary" plain  @click="_routeTo('m_shopEditor')">立即创建</el-button>
            </div>
          </div>
        </div>
      </li>
      <li v-for="(item, key) of templateList" :key="key">
        <div class="inner">
          <div class="view">
            <img :src="item.photoHalfUrl" alt="">
            <div class="cover_small">
              <div class="cover_button" @click="preview(item)">预览模板</div>
            </div>
          </div>
          <div class="info">
            <div class="top">
              <span>{{item.name || '页面模板'}}</span>
              <i class="mini_program"></i>
              <i class="wechat"></i>
            </div>
            <!-- <div class="bottom">
              <el-button type="success" size="mini" v-if="item.price === 0" plain>免费</el-button>
              <span class="price" v-if="item.price !== 0">￥{{item.price}}</span>
              <el-button type="success" plain v-if="item.state === 2" @click="_routeTo('m_templateEdit', {id: scope.row.id})">立即应用</el-button>
              <el-button type="warning" plain v-if="item.state === 1">立即购买</el-button>
            </div> -->
            <div class="bottom">
              <div style="color:#3EB488;line-height: 25px;">免费</div>
              <!-- <el-button type="success" size="mini"  plain>免费</el-button> -->
              <!-- <span class="price" v-if="item.price !== 0">￥{{item.price}}</span> -->
              <el-button type="success" plain @click="apply(item)">立即应用</el-button>
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
      <div class="apply" @click="apply(currentTemplate)">立即应用</div>
    </div>

    <div class="pagination" v-if="templateList.length || (!templateList.length && startIndex != 1)">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="Number(startIndex) || 1"
          :page-size="pageSize*1"
          :page-sizes="[12]"
          :total="total*1"
          layout="total, sizes, prev, pager, next, jumper"
          >
        </el-pagination>
      </div>
  </div>
</template>

<script>
import tableBase from '@/components/TableBase';
export default {
  name: 'templateManage',
  extends: tableBase,
  components: {},
  data () {
    return {
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
      cacheLast: null
    }
  },
  created() {
    this.fetch();
    this.preLoadObj = new Image();
  },
  watch: {
    zoomRatio(newValue) {
      let width = this.$refs.bigImage.clientWidth;
      if(this.mode === 'plus') {
        this.$refs.bigImage.style.width = width * this.zoomRatio + 'px';
      }else if(this.mode === 'reduce') {
        this.$refs.bigImage.style.width = width / this.zoomRatio + 'px';
      }
      if(this.zoomRatio > 1) {
        this.$refs.bigImage.style.height = 'auto';
      }else{
        this.$refs.bigImage.style.width = 'auto';
        this.$refs.bigImage.style.height = '100%';
      }
    },
  },
  methods: {
    fetch() {
      const _self = this;
      this.loading = true;
      console.log(11,this.startIndex);
      console.log(22,this.pageSize);
      this._apis.goodsOperate.getTemplateList({
        startIndex: this.startIndex,
        pageSize: this.pageSize
      }).then((response)=>{
        _self.total = response.total;
        if(_self.startIndex == 1) {
          _self.cacheLast = response.list[response.list.length - 1];
          response.list.pop();
          _self.templateList = response.list;
        }else {
          if(_self.startIndex != response.pages) {
            const tempCache =  response.list[response.list.length - 1];
            response.list.pop();
            _self.templateList = [_self.cacheLast].concat(response.list);
            _self.cacheLast = tempCache;
          }else {
            _self.templateList = [_self.cacheLast].concat(response.list);
          }
        }
        _self.imgNow = 0;
        _self.preload(_self.templateList, 'photoDetailsUrl');
        _self.loading = false;
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        return;
      }
      this.preLoadObj.src = data[this.imgNow][name];
      this.preLoadObj.onerror = function () {
          console.log("图片加载失败");
          _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                return;
            }
      }
      this.preLoadObj.onload = function () { 
        console.log(this.clientWidth)
        console.log(this.clientHeight)
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                return;
            }
        };

    },

    /* 预览模板 */
    preview(item) {
      this.showBigPreview=true; 
      this.currentTemplate = item; 
      this.zoomRatio = 1;
    },

    /* 放大 */
    plus() {
      this.mode = 'plus';
      if(this.$refs.bigImage.clientWidth <= this.maxWidth * 0.9) {
        this.zoomRatio += 0.1;
      }
    },

    /* 缩小 */
    reduce() {
      this.mode = 'reduce';
      // if(this.$refs.bigImage.clientWidth >= this.maxWidth) {
      //    this.zoomRatio = 1.1;
      // }
      if(this.zoomRatio >= 1.1) {
        this.zoomRatio -= 0.1;
      }
    },

    /* 关闭预览 */
    close() {
      this.showBigPreview=false;
    },

    /* 应用模板 */
    apply(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: `部分私有数据需要您自行配置<br/>我们为您预置了这些组件的装修样式！`
      }).then(() => {
         this._routeTo('m_templateEdit', {id: item.id});
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.template_wrapper{
  // min-width:1650px;
  background: #fff;
  padding-bottom:20px;
  ul{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    background: #fff;
    padding: 20px;
    padding-right:0;
    box-sizing: border-box;
    li{
      width:255px;
      margin-right: 10px;
      margin-bottom: 10px;
      .inner{
        width:255px!important;
        height:400px!important;
        padding: 15px;
        background: #fff;
        box-shadow:0px 2px 10px 0px rgba(232,231,255,1);
        position:relative;
        .view{
          width:100%;
          height:300px;
          position: relative;
          img{
            width:100%;
            height:100%;
            object-fit: cover;
          }
          .cover_small{
              width:100%;
              height:100%;
              position:absolute;
              top:0;
              left:0;
              background: rgba(0,0,0,0.6);
              display:flex;
              justify-content: center;
              align-items: center;
              opacity: 0;
              transition: all 0.4s;
              &:hover{
                opacity: 1;
              }
              .cover_button{
                font-size:14px;
                font-family:MicrosoftYaHei;
                color:rgba(255,255,255,1);
                line-height:19px;
                padding:6px 17px;
                border-radius:4px;
                border:1px solid rgba(255,255,255,1);
                cursor: pointer;
                transition: all 0.4s;
                &:hover{
                  background:rgba(101,94,255,1);
                  border:1px solid rgba(101,94,255,1);
                }
              }
            }
        }
        .info{
          margin-top:10px;
          .top{
            display:flex;
            align-items: center;
            span{
              margin-right:30px;
            }
            i{
              width:23px;
              height:23px;
              border-radius:50%;
              margin-right:10px;
              &.mini_program{
                background:url('../../../../assets/images/shop/xiaochengxu.png') no-repeat 0 0;
              }
              &.wechat{
                background:url('../../../../assets/images/shop/weixin.png') no-repeat 0 0;
              }
            }
          }
          .bottom{
            display:flex;
            justify-content: space-between;
            margin-top:10px;
            .price{
              color:rgb(253,76,43);
              font-weight:700;
            }
          }
        }
      }
    }
  }
  .big_preview{
    position:fixed;
    top:0;
    left:0;
    background:rgba(0,0,0,0.5);
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
    z-index: 1001;
    .img_wrapper{
      height:100%;
      overflow-y: auto;
      img{
        transition: all 0.4s;
        max-width:550px;
        height:100%;
      }
    }
    .close_preview{
      position: absolute;
      top:50px;
      right:59px;
      display:block;
      background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
      width:50px;
      height:50px;
      border-radius:50%;
      transition: all 0.4s;
      cursor: pointer;
      &:hover{
        background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/tempClose.png') no-repeat 15px 15px;
      }
    }
    .zoom{
      position:absolute;
      bottom:144px;
      right:59px;
      .plus,.reduce{
        width:50px;
        height:50px;
        display:block;
        border-radius:4px;
        transition: all 0.4s;
        cursor: pointer;
      }
      .plus{
        background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
        margin-bottom: 14px;
        &:hover{
          background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/plus.png') no-repeat 3px 3px;
        }
      }
      .reduce{
        background: rgba(255,255,255,0.3) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;
        &:hover{
          background: rgba(255,255,255,0.5) url('../../../../assets/images/shop/reduce.png') no-repeat 3px 3px;
        }
      }
    }
    .apply{
      position:absolute;
      bottom:60px;
      right:40px;
      font-size:15px;
      font-family:PingFangSC-Medium,PingFang SC;
      color:rgba(255,255,255,1);
      padding:9px 10px;
      background:rgba(255,255,255,0.3);
      border-radius:4px;
      transition: all 0.4s;
      cursor: pointer;
      &:hover{
        background: rgba(255,255,255,0.5);
      }
    }
  }
}
/deep/.el-button--small{
  padding:9px 12px;
  background: #fff;
  border-radius:4px;
}
/deep/.el-button--success{
  border:1px solid rgba(62,180,136,1);
  color: rgba(62,180,136,1);
}
</style>
