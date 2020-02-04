<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'同步确认'" @submit="submit">
      <div class="content">
        <p>将微信公众平台的图片同步至有翼电商平台，</p>
        <p>一小时只能进行一次，确定要同步吗？</p>
      </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSync",
  components: {DialogBase},
  data() {
    return {}
  },
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
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
  methods: {
    submit() {
      this.$emit('submit',{syncImage:''})
    }
  },

}
</script>

<style lang="scss" scoped>
.content{
  line-height: 30px;
  font-size: 14px;
  color: #443D4A;
  text-align: center;
}
</style>
