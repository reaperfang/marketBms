<template>
  <!-- 标题 -->
  <div class="componentTitle" :style="{'backgroundColor':currentComponentData.data.backgroundColor}" v-if="currentComponentData && currentComponentData.data">

    <template v-if="hasContent">
      <!-- 1、传统样式 -->
      <div v-if="currentComponentData.data.titleTemplate===1" :class="'title'+currentComponentData.data.displayPosition">
        <div class="title_Title">
          <span class="title_Title1">{{currentComponentData.data.mainTitle}}</span>
          <span class="title_Title2"> {{currentComponentData.data.navName}}</span>
        </div>
        <div class="title_vice" @click="_routeTo('')">{{currentComponentData.data.subTitle}}</div>
      </div>
      <!-- 2、模仿微信图文页样式 -->
      <div v-if="currentComponentData.data.titleTemplate===2" :class="'title'+currentComponentData.data.displayPosition">
        <div class="title_Title">
          <span class="title_Title1">{{currentComponentData.data.mainTitle}}</span>
        </div>
        <div class="title_two">
          <span class="title_time">{{currentComponentData.data.date}}</span>
          <span class="title_author">{{currentComponentData.data.author}}</span>
          <span class="title_link" @click="_routeTo('')">链接</span>
        </div>
      </div>
    </template>
    <img v-else class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentTitle',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      
    }
  },
  created() {

  },
  computed: {
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.currentComponentData.data.mainTitle) {
            value = true;
        }
        return value;
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentTitle {
  padding: 10px 15px;
  line-height: 1;
  .title_Title {
    & > .title_Title1 {
      font-size: 20px;
      font-weight: 500;
      color: #1c1d1f;
    }
    & > .title_Title2 {
      display: inline-block;
      color: #655eff;
      font-size: 14px;
      padding-left: 5px;
    }
  }
  .title_vice {
    padding-top: 12px;
    font-size: 14px;
    color: #999999;
  }
  .title_two {
    font-size: 14px;
    padding-top: 12px;
    & > .title_time,
    .title_author {
      color: #999999;
      padding-right: 5px;
    }
    & > .title_link {
      color: #655eff;
    }
  }
  .title1 {
    text-align: left;
  }
  .title2 {
    text-align: center;
  }
  .title3 {
    text-align: right;
  }
}
</style>
