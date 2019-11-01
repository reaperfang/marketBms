<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'移动分组'" @submit="submit">
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="分组名称：">
           <el-select v-model="form.groupId" placeholder="请选择">
            <el-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogGroupsMove",
  components: {DialogBase},
  props: {
      data:{},
      arrayData: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      form:{
        groupId:''
      },
      groupList:[],
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
    this.getGroups()
  },
  methods: {
    //查询分组
    getGroups(){
      let type = this.data == 'image' ? '0' : '2'
      this._apis.file.getGroup({type:type}).then((response)=>{
        this.groupList = response
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    submit() {
      if(this.arrayData.length){
        this.$emit('submit',{moveGroup:{imageId:this.arrayData,groupId:this.form.groupId}})
      }else{
        this.$message.error('请选择移动分组的数据')
      }
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