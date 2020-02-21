<template>
  <DialogBase :visible.sync="visible" :showFooter="false" width="816px" :title="'视频'">
    <video v-if="data.filePath !=''"  
    :src="data.filePath"
    controls="controls"
    width="600"
    height="300"
    style="margin-left:80px;">
    您的浏览器不支持视频播放
    </video>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogVideo",
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {},
  methods: {
  }
};
</script>

<style lang="scss">
</style>