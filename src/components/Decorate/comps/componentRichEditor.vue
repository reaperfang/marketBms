
<template>
    <div v-if="currentComponentData && currentComponentData.data">
      <div class="rich_wrapper" v-if="currentComponentData.data.richValue" v-html="currentComponentData.data.richValue" :style="{'padding': (currentComponentData.data.remainPageMargin ? '10px' : '0'), 'backgroundColor': currentComponentData.data.backgroundColor}"></div>
      <div class="rich_wrapper" v-else :style="{'padding': (currentComponentData.data.remainPageMargin ? '10px' : '0')}">
        <p>点此编辑『富文本』内容 ——&gt;</p><p>你可以对文字进行<strong>加粗</strong>、<em>斜体</em>、<span style="text-decoration: underline;">下划线</span>、<span style="text-decoration: line-through;">删除线</span>、文字<span style="color: rgb(0, 176, 240);">颜色</span>、<span style="background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span style="font-size: 20px;">大</span><span style="font-size: 14px;">小</span>等简单排版操作。</p>
      </div>
    </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentRichEditor',
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
</style>
