<template>
  <el-dialog
    :visible.sync="visible"
    width="520"
    title="配送到"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="close">
    <div class="dialog-container">
      <div class="list" v-if="data && data.length > 0">
        <ul v-for="(item, key) in data" :key="key">
          <li> {{ item.name }} </li>
        </ul>
      </div>
    </div>
    <span slot="footer" class="dialog-footer fcc">
        <el-button @click="close">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "dialogAreaShow",
  data() {
    return {
    }
  },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    data:{
      type: Array,
      required: true,
      default() {
        return []
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
    
  },
  created(){
  },
  methods: {
    submit() {
    },
    close() {
      this.$emit('close')
    }
  },

}
</script>

<style lang="scss" scoped>
/deep/ .el-dialog {
    border-radius: 10px;
}
/deep/ .el-dialog__header {
    background: #f1f0ff;
    border-radius: 10px 10px 0 0;
}
/deep/ .el-dialog__title {
    color: #44434B;
}
.list{
  height:165px;
  background:rgba(208,214,228,0.1);
  overflow: auto;
  margin-top: -10px;
  padding: 10px;
  li {
    padding: 0 10px;
    width: 25%;
    float: left;
    font-size:14px;
    color:rgba(68,67,75,1);
    line-height:34px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    word-break: break-all;
  }
}
</style>
