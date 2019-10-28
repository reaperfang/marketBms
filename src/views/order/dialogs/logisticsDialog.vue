<template>
  <DialogBase
    class="logistics"
    :visible.sync="visible"
    @submit="submit"
    :title="title"
    width="714px"
    :showFooter="showFooter"
  >
    <div class="container">
        <p><span>物流公司：{{expressCompanys}}</span><span style="margin-left: 5px;">快递单号：{{expressNo}}</span></p>
      <!-- <div class="header">
                <div class="item">时间</div>
                <div class="item">状态</div>
      </div>-->
      <div class="content">
        <template v-if="reject">
            <div class="reject">未开启轨迹查询服务</div>
        </template>
        <template v-else>
          <el-timeline v-show="data.length" :reverse="reverse">
            <el-timeline-item
              v-for="(activity, index) in data"
              :key="index"
              :timestamp="activity.AcceptTime"
            >{{activity.AcceptStation}}</el-timeline-item>
          </el-timeline>
          <Empty v-show="!data.length"></Empty>
        </template>
      </div>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import Empty from "@/components/Empty";

export default {
  data() {
    return {
      showFooter: false,
      reverse: true,
      activities: []
    };
  },
  created() {},
  methods: {
    submit() {}
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    title() {
      return "提示";
    }
  },
  props: {
    data: {
      type: Array,
      default: []
    },
    dialogVisible: {
      type: Boolean,
      required: true
    },
    reject: {},
    expressNo: {},
    expressCompanys: {}
  },
  components: {
    DialogBase,
    Empty
  }
};
</script>
<style lang="scss" scoped>
.reject {
    margin-top: 50px;
}
</style>
<style lang="scss">
.logistics {
  .dialog-container {
    text-align: left;
  }
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    p {
        align-self: flex-start;
    }
  }
}
</style>




