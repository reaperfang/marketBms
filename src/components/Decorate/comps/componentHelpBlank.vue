<template>
  <!-- 辅助线 -->
  <div class="component_wrapper">
    <div class="componentHelpBlank" v-if="currentComponentData && currentComponentData.data">
      <div class="help_blank" :style="{'height':currentComponentData.data.blankHeight+'px'}"></div>
    </div>
  </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: 'componentHelpBlank',
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
.componentHelpBlank {
  & > .help_blank {
    width: 100%;
    // background: #fff;
  }
}
</style>
