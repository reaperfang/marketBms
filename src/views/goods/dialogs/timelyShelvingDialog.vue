<template>
  <DialogBase :visible.sync="visible" title="定时上架" :showFooter="showFooter">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <el-form-item label="设定上架时间" prop="time">
        <el-date-picker
          v-model="ruleForm.time"
          type="datetime"
          :picker-options="pickerBeginDateBefore"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="footer">
        <el-button @click="onSubmit" type="primary">上 架</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </el-form-item>
    </el-form>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";

export default {
  data() {
    return {
      showFooter: false,
      ruleForm: {
        time: ""
      },
      rules: {
        time: [{ required: true, message: "请选择", trigger: "blur" }]
      },
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < (new Date().getTime() - 24*60*60*1000);
        }
      }
    };
  },
  created() {
    // this.$nextTick(() => {
    //   this.pickerBeginDateBefore = {
    //     disabledDate(time) {
    //       return time.getTime() < new Date().getTime();
    //     }
    //   };
    // });
  },
  methods: {
    // pickerBeginDateBefore (time) {

    // },
    onSubmit() {
      this.$emit(
        "submit",
        utils.formatDate(
          new Date(this.ruleForm.time * 1),
          "yyyy-MM-dd hh:mm:ss"
        )
      );
      this.visible = false;
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
    },
    contentText() {
      return "是否确认删除？";
    }
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
.footer {
  margin-top: 85px;
}
</style>


