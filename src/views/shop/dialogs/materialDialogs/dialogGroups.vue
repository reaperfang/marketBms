<template>
  <DialogBase :visible.sync="visible" width="500px" :title="dialogTitle" :showFooter="false">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="分组名称：" prop="groupName">
           <el-input v-model.trim="form.groupName" class="w250"></el-input>
        </el-form-item>
         <el-form-item  class="dialog-footer">
            <el-button type="primary" @click="submit('form')">确 认</el-button>
            <el-button  @click="visible = false">取 消</el-button>
        </el-form-item>
      </el-form>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
export default {
  name: "dialogGroups",
  components: {DialogBase},
  props: {
      typeData:{},
      dialogTitle: { },
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      form:{
        groupName:this.typeData.name || ''
      },
      rules:{
        groupName:[
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max:12, message: '长度在1到12个字符', trigger: 'blur' }
        ]
      }
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
  created() {
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.typeData.type == 'edit'){
            this.$emit('submit',{edit:{groupName:this.form.groupName}})
          }else{
            if(this.dialogTitle == '新建一级分组'){
              this.$emit('submit',{add:{groupLevel:'1',groupName:this.form.groupName}})
            }else{
              this.$emit('submit',{add:{groupLevel:'2',groupName:this.form.groupName}})
            }
          }          
          this.visible = false
        }
      })
    }
  }
};
</script>

<style>

</style>


<style lang="scss" scoped>
.w250{
  width: 250px;
}
</style>