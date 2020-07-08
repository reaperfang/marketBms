<template>
  <!-- 视频 -->
  <div class="component_wrapper">
    <div class="componentVideo" v-if="currentComponentData && currentComponentData.data && hasContent">
      <div>
        <video
          v-if="show"
          :src="currentComponentData.data.videoUrl"
          controls="controls"
          class="video"
          :poster="currentComponentData.data.coverUrl"
        >您的浏览器不支持 video 标签。</video>
      </div>
    </div>
    <componentEmpty v-else :componentData="currentComponentData"></componentEmpty>
  </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: 'componentVideo',
  mixins:[mixinCompsBase],
  components: {},
  data () {
    return {
      show: true
    }
  },
  created() {

  },
  computed: {
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.currentComponentData.data.videoUrl) {
            value = true;
        }
        return value;
    }
  },
  watch: {
    'currentComponentData.data.coverUrl': {
      handler(newValue, oldValue) {
        console.log(newValue)
        if(newValue === oldValue){
          return;
        }
        this.show = false;
        this.$nextTick(()=>{
          this.show = true;
        })
      },
      deep:true
    },
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentVideo {
  height: 210px;
  .video {
    width: 100%;
    height: 210px;
  }
}
</style>
