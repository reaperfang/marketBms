<template>
  <!-- 辅助线 -->
  <div class="componentHelpBlank" v-if="currentComponentData && currentComponentData.data">
    <div class="help_blank" :style="{'height':currentComponentData.data.blankHeight+'px'}"></div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentHelpBlank',
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
.componentHelpBlank {
  & > .help_blank {
    width: 100%;
    // background: #fff;
  }
}
</style>
