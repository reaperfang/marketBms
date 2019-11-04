<template>
  <div class="main">
     <el-tabs v-model="currentTab" @tab-click="handleClick">
      <el-tab-pane label="图片素材" name="imageMaterial"></el-tab-pane>
      <el-tab-pane label="图文素材" name="articleMaterial"></el-tab-pane>
      <el-tab-pane label="视频素材" name="videoMaterial"></el-tab-pane>
    </el-tabs>
    <component :is="currentTab"></component>
  </div>
</template>

<script>
import imageMaterial from './material/imageMaterial';
import articleMaterial from './material/articleMaterial';
import videoMaterial from './material/videoMaterial';
export default {
  name: 'fileManageIndex',
  components: {imageMaterial, articleMaterial, videoMaterial},
  data () {
    return {
      currentTab: 'imageMaterial'
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(){
      let name = this.$route.query.active;
      this.currentTab = name
    },
    handleClick(comp) {
      this.currentTab = comp.name;
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  background: #fff;
  padding:20px;
}
</style>
