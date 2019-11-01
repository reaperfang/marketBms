<template>
  <!-- 微页面分类 -->
  <div class="componentClassify" >
    <div class="rich_editor" v-if="currentComponentData.data.explain" v-html="currentComponentData.data.explain"></div>
    <div class="rich_editor default" v-else>分类简介预览</div>
    <ul class="page_list name_list" v-if="currentComponentData.data.showType === 1">
      <li v-for="(item, key) of currentComponentData.data.pageInfos" :key="key">
        <span>{{item.name}}</span>
        <i class="el-icon-arrow-right"></i>
      </li>
    </ul>

    <ul class="page_list paper_list" v-if="currentComponentData.data.showType === 2">
      <li v-for="(item, key) of currentComponentData.data.pageInfos" :key="key">
        <img src="http://img11.360buyimg.com/n1/jfs/t1/72253/36/6701/86164/5d4d4484E47be505a/fa7ff166e9661ccf.jpg" alt="">
        <p>{{item.name}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentClassify',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      
    }
  },
  created() {
    
  },
  computed: {
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentClassify {
  background: rgb(242,242,249);
  .rich_editor{
    min-height:80px;
    padding:10px;
    background:#fff;
    &.default{
      background:rgba(239,239,239,1);
      font-size:18px;
      color:rgba(146,146,155,1);
      text-align: center;
      height: 180px;
      line-height:180px;
    }
  }
  ul.page_list.name_list{
    li{
      padding:15px;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      border-top: 1px solid rgba(238,238,238,1);
      background:#fff;
      :last-child{
        border-bottom: 1px solid rgba(238,238,238,1);
      }
      span{
        font-size:15px;
        color:rgba(58,64,72,1);
        border-top:none!important;
      }
      i{
        color:rgba(58,64,72,1);
        font-size: 21px;
        border-bottom:none!important;
      }
    }
  }
  ul.page_list.paper_list{
    li{
      padding:15px;
      display:flex;
      flex-direction: row;
      justify-content: flex-start;
      margin-top:10px;
      background:#fff;
      img{
        width:80px;
        height:80px;
        margin-right:10px;
      }
      p{
        font-size:15px;
        color:rgba(58,64,72,1);
        padding-top:10px;
      }
    }
  }
}
</style>
