
<template>
    <div class="component_wrapper" :style="{cursor: dragable ? 'pointer' : 'text'}">
      <div class="rich_wrapper" v-if="currentComponentData && currentComponentData.data && currentComponentData.data.richValue" v-html="currentComponentData.data.richValue" :style="{'padding': (currentComponentData.data.remainPageMargin ? '10px' : '0'), 'backgroundColor': currentComponentData.data.backgroundColor}"></div>
      <div class="rich_wrapper" v-else :style="{'padding': (currentComponentData.data.remainPageMargin ? '10px' : '0')}">
        <p><br></p><p><span data-v-6945bc11="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word;"></span></p><p data-v-654887ae="" style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px; padding: 0px; overflow-wrap: break-word;">点此编辑『富文本』内容 ——&gt;</p><p data-v-654887ae="" style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px; padding: 0px; overflow-wrap: break-word;">你可以对文字进行<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; font-weight: bolder;">加粗</span>、<em data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px;">斜体</em>、<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; text-decoration-line: underline;">下划线</span>、<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; text-decoration-line: line-through;">删除线</span>、文字<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; color: rgb(0, 176, 240);">颜色</span>、<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; background-color: rgb(255, 192, 0); color: rgb(255, 255, 255);">背景色</span>、以及字号<span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; font-size: 20px;">大</span><span data-v-654887ae="" style="box-sizing: inherit; margin: 0px; padding: 0px; overflow-wrap: break-word; font-size: 14px;">小</span>等简单排版操作。</p><p data-v-654887ae="" style="box-sizing: inherit; margin-top: 0px; margin-bottom: 0px; padding: 0px; overflow-wrap: break-word;">也可在这里添加图片、并对图片加上超级链接，方便用户点击。</p>
      </div>
    </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: 'componentRichEditor',
  mixins:[mixinCompsBase],
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
