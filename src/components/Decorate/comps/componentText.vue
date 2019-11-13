<template>
  <!-- 文本 -->
  <div
    class="componentText"
    :style="{'backgroundColor':currentComponentData.data.backgroundColor}"
    :class="currentComponentData.data.showDivider===true?'borb':''"
    v-if="currentComponentData && currentComponentData.data"
  >
    <div
      class="group_text"
      :class="['font_size'+currentComponentData.data.fontSize,'style'+currentComponentData.data.displayStyle]"
      :style="{'color':currentComponentData.data.fontColor}"
      v-if="hasContent"
    >{{currentComponentData.data.textContent}}</div>
     <div v-else class="temp_block">
       <img class="empty_data_img" src="../../../assets/images/shop/emptyData.png" alt="">
    </div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentText',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
     
    }
  },
  created() {

  },
  computed: {
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.currentComponentData.data.textContent) {
            value = true;
        }
        return value;
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentText {
  & > .group_text {
    padding: 10px 20px;
    // background: #fff;
  }
  .font_size1 {
    font-size: 16px;
  }
  .font_size2 {
    font-size: 12px;
  }
  .font_size3 {
    font-size: 10px;
    transform: scale(0.83);
  }
  .style1 {
    text-align: left;
  }
  .style2 {
    text-align: center;
  }
  .style3 {
    text-align: right;
  }
}
.borb {
  border-bottom: 1px solid #ccc !important;
}
</style>
