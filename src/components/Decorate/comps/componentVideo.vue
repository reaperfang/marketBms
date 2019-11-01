<template>
  <!-- 视频 -->
  <div class="componentVideo" v-if="currentComponentData && currentComponentData.data">
    <div v-on:click="playVideo()">
      <video
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
.componentVideo {
  .video {
    width: 100%;
    height: 210px;
  }
}
</style>
