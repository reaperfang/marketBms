<template>
  <DialogBase :visible.sync="visible" title="定时上架" :showFooter="showFooter">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      class="demo-ruleForm"
    >
      <!-- <el-form-item label="设定上架时间" prop="time">
        <el-date-picker
          v-model="ruleForm.time"
          type="datetime"
          :picker-options="pickerBeginDateBefore"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item> -->
      <el-form-item label="设定上架时间" prop="time">
        <el-date-picker
          format="yyyy-MM-dd HH:mm"
          popper-class="timelyShelving"
          v-model="ruleForm.time"
          type="datetime"
          :picker-options="utils.globalTimePickerOption.call(this, true, false)"
          placeholder="选择日期时间"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="footer">
        <el-button @click="onSubmit('ruleForm')" type="primary">上 架</el-button>
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
    var validateTime = (rule, value, callback) => {
      value && value.setSeconds(0)
      let now = new Date()

      now.setSeconds(0)
      if (value.getTime() < now.getTime() && (now.getTime() - value.getTime() > 1000)) {
        callback(new Error('选择时间必须大于当前时间'));
      } else {
        callback();
      }
    };
    return {
      showFooter: false,
      ruleForm: {
        time: ""
      },
      rules: {
        time: [
          { required: true, message: '请选择', trigger: 'change' },
          { validator: validateTime, trigger: 'blur' },
        ]
      },
      pickerBeginDateBefore: {
        disabledDate(time) {
          return time.getTime() < (new Date().getTime() - 24*60*60*1000);
        }
      },
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
    if(this.data && this.data.time) {
      this.ruleForm.time = new Date(this.data.time)
    }
  },
  methods: {
    // pickerBeginDateBefore (time) {

    // },
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit(
            "submit",
            utils.formatDate(
              new Date(this.ruleForm.time * 1),
              "yyyy-MM-dd hh:mm:ss"
            )
          );
          this.visible = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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
<style lang="scss">
  .timelyShelving .el-time-spinner {
    .el-time-spinner__wrapper {
      width: 50%!important;
      &:last-child {
        display: none!important;
      }
    }
  }
</style>


