<template>
  <div>
    <h3>注册条款设置</h3>
    <p>注册条款：</p>
    <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig"></RichEditor>
  </div>
</template>

<script>
import RichEditor from '@/components/RichEditor';
export default {
  name: '1picText',
  components: {RichEditor},
  data() {
    return {
      editorData: '',  //富文本数据
      myConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 700,
        // 初始容器宽度
        initialFrameWidth: '100%'
      }
    }
  },

  created() {
  },

  methods: {
    /* 
     * 富文本数据更新
    */
    editorValueUpdate(value) {
      this.editorData = value;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
