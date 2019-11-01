<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'分组'" :showFooter="false">
    <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="分组名称：" prop="groupName">
           <el-input v-model="form.groupName" class="w250"></el-input>
        </el-form-item>
         <el-form-item  class="dialog-footer">
            <el-button type="primary" @click="submit('form')">确 认</el-button>
            <el-button  @click="dialogVisible = false">取 消</el-button>
        </el-form-item>
      </el-form>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogGroups",
  components: {DialogBase},
  props: {
      data: { },
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      form:{
        groupName:this.data.name || ''
      },
      rules:{
        groupName:[
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在1到20个字符', trigger: 'blur' }
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
          if(this.data.type == 'edit'){
            this.$emit('submit',{edit:{groupId:this.data.id,groupName:this.form.groupName}})
          }else{
            this.$emit('submit',{add:{groupName:this.form.groupName}})
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