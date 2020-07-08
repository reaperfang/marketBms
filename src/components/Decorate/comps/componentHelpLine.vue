<template>
  <!-- 辅助线 -->
  <div class="component_wrapper" :style="{cursor: dragable ? 'pointer' : 'text'}">
    <div class="componentHelpLine" v-if="currentComponentData && currentComponentData.data">
      <div :class="currentComponentData.data.lineMargin===1?'help_blank':'help_blank1'">
        <p :style="styleObj"></p>
      </div>
    </div>
  </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: 'componentHelpLine',
  mixins:[mixinCompsBase],
  components: {},
  data () {
    return {
      pink: "pink",
      borderStyle: {
        1: "solid",
        2: "dashed",
        3: "dotted",
      }
    }
  },
  created() {

  },
  computed: {
    styleObj() {
      return {
        borderBottom: `1px ${this.borderStyle[this.currentComponentData.data.lineStyle]} ${
          this.currentComponentData.data.lineColor
        }`
      };
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.help_blank {
  padding: 15px 0px;
}
.help_blank1 {
  padding: 15px 10px;
}
</style>
