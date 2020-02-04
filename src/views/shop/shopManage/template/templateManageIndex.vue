<template>
  <div class="template_wrapper">
    <ul class="tile-list n5">
      <li>
        <div class="view">
          <div style="width:100%;height:100%;background:rgb(230,228,255)"></div>
        </div>
        <div class="info">
          <div class="top">
            <span>空白模板</span>
          </div>
          <div class="bottom">
            <span class="price"></span>
            <el-button type="primary" plain  @click="_routeTo('shopEditor')">立即创建</el-button>
          </div>
        </div>
      </li>
      <li v-for="(item, key) of templateList" :key="key" v-loading="loading">
        <div class="view">
          <img :src="item.url" alt="">
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
            <el-button type="success" plain v-if="item.state === 2" @click="_routeTo('templateEdit', {id: scope.row.id})">立即应用</el-button>
            <el-button type="warning" plain v-if="item.state === 1">立即购买</el-button>
          </div> -->
          <div class="bottom">
            <div style="color:green;line-height: 25px;">免费</div>
            <!-- <el-button type="success" size="mini"  plain>免费</el-button> -->
            <!-- <span class="price" v-if="item.price !== 0">￥{{item.price}}</span> -->
            <el-button type="success" plain @click="_routeTo('templateEdit', {id: item.id})">立即应用</el-button>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'templateManage',
  components: {},
  data () {
    return {
      loading: true,
      templateList: []
    }
  },
  created() {
    this.fetch();
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.shop.getTemplateList({}).then((response)=>{
        this.templateList = response;
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.template_wrapper{
  ul{
    li{
      width:255px;
      height:400px;
      padding: 15px;
      background: #fff;
      box-shadow: 6px 1px 30px rgba(0,0,0,0.2);
      .view{
        width:100%;
        height:300px;
        img{
          width:100%;
          height:100%;
          object-fit: cover;
        }
      }
      .info{
        margin-top:10px;
        .top{
          display:flex;
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
</style>
