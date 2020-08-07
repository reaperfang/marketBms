<template>
  <!-- 购买公告 -->
  <div class="component_wrapper">
    <div class="componentLocation" v-if="currentComponentData && currentComponentData.data">
      <div class="location_box" :style="{'backgroundColor': (currentComponentData.data.bgType==1 ? currentComponentData.data.backgroundColor:'transparent'),
      'background-image':currentComponentData.data.bgType==2 ?'url('+currentComponentData.data.backgroundImage+')':'none'}">
          <i class="icon-location">
            <svg width="13px" height="16px" viewBox="0 0 13 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <title>形状</title>
                <desc>Created with Sketch.</desc>
                <g id="2.0" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="页面装修" transform="translate(-578.000000, -135.000000)" :fill="currentComponentData.data.fontColor" fill-rule="nonzero">
                        <g id="当前位置" transform="translate(568.000000, 125.000000)">
                            <g id="编组" transform="translate(7.000000, 9.000000)">
                                <g id="定位图标">
                                    <path d="M9.5,1 C5.91084634,1 3,3.20512821 3,7.68717949 C3,12.4974359 9.5,17 9.5,17 C9.5,17 16,12.2564103 16,7.68717949 C16,3 13.0891537,1 9.5,1 Z M9.5,10 C8.11934041,10 7,8.88097234 7,7.50069852 C7,6.1204247 8.11934041,5 9.5,5 C10.8806596,5 12,6.11902766 12,7.49930148 C12,8.8795753 10.8806596,10 9.5,10 Z" id="形状"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
          </i><div class="location_text" :style="{'color': currentComponentData.data.fontColor}">{{currentComponentData.data.text}}<i class="el-icon-arrow-right"></i></div>
      </div>
    </div>
  </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: "componentLocation",
  mixins: [mixinCompsBase],
  components: {},
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
  mounted() {
  },
  beforeDestroy() {
  },
  destroyed() {
  }
};
</script>

<style lang="scss" scoped>
.location_box{
  background-repeat: no-repeat;
  background-size: 100% 100%;
  height: 34px;
  line-height: 34px;
  display: flex;
  overflow: hidden;
  word-break: break-all;
}
.icon-location{
  display: block;
  width: 13px;
  height: 16px;
  margin: 3px 7px 0 7px;
}
.location_text{
  width: 332px;
  font-size:16px;
  font-family:PingFangSC-Regular,PingFang SC;
  font-weight:400;
  color:#000;
}
</style>
