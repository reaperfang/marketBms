<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'移动分组'" @submit="submit">
    <el-form ref="form" :model="form" label-width="100px">
         <el-form-item label="当前分组：">
           分组名称
         </el-form-item>
        <el-form-item label="转移分组：">
          <el-cascader
          v-model="form.groupId"
          :options="options"
          :props="defaultProps"
          class="w_300">
          </el-cascader>
        </el-form-item>
      </el-form>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogGroupsMove",
  data() {
    return {
      form:{
        groupId:['-1']
      },
      defaultProps: {
        children: 'childFileGroupInfoList',
        label: 'name',
        value:'id',
        checkStrictly: true,
      },
      options:[]
    };
  },

  components: {DialogBase},

  props: {
    data:{},
    arrayData: {},
    typeName:{},
    fromGroupId:'',
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

  created() {
    this.init()
    this.gitGroups()
  },

  methods: {
    //获取组id
    init(){
      this.form.groupId = this.fromGroupId
    },

     //获取分组数据
    gitGroups(){
      let type =  this.typeName == 'image' ? '0' : '1'
      let query ={
        type:type,
      }
      this._apis.file.getGroup(query).then((response)=>{
        this.options = response
      }).catch(error => {
        this.$message.error(error);
      })
    },

    //确定分组
    submit() {
      let leg = this.form.groupId.length
      if(this.arrayData.length){
        this.$emit('submit',{moveGroup:{imageId:this.arrayData,groupId:this.form.groupId[leg-1]}})
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
.w_300{
  width: 300px;
}
</style>