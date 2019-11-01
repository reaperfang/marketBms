<template>
  <!-- 视频 -->
  <div class="componentVideo" v-if="currentComponentData && currentComponentData.data">
    <div v-on:click="playVideo()">
      <video
        v-if="show"
        :src="currentComponentData.data.videoUrl"
        controls="controls"
        class="video"
        :poster="currentComponentData.data.coverUrl"
      >您的浏览器不支持 video 标签。</video>
    </div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentVideo',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      show: true
    }
  },
  created() {

  },
  computed: {
   
  },
  watch: {
    'currentComponentData.data.coverType': {
      handler(newValue) {
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
  .video {
    width: 100%;
    height: 210px;
  }
}
</style>
