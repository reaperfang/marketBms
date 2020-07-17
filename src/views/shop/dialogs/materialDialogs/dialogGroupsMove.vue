<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'移动分组'" @submit="submit">
    <el-form ref="form" :model="form" label-width="100px">
         <el-form-item label="当前分组：">
           {{currentGroup}}
         </el-form-item>
        <el-form-item label="转移分组：">
          <el-cascader
          v-model="form.groupId"
          :options="options"
          :props="defaultProps"
          @change="currentGroupHandleChange"
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
        groupId:[]
      },
      defaultProps: {
        children: 'childFileGroupInfoList',
        label: 'name',
        value:'id',
        checkStrictly: true,
      },
      options:[],
      currentGroup:''
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
    this.gitGroups()
  },

  methods: {
     //获取分组数据
    gitGroups(){
      let type =  this.typeName == 'image' ? '0' : '1'
      let query ={
        type:type,
      }
      this._apis.file.getGroup(query).then((response)=>{
        this.options = response
        //获取当前分组名称
        let groupIdArr = []
        this.getCategoryInfoIds(groupIdArr,this.fromGroupId)
        this.currentGroup = this.getCurrentGroup(groupIdArr)
      }).catch(error => {
        this.$message.error(error);
      })
    },

    // 获取类目
    getCategoryInfoIds(arr, id) {
        let data = this.treeToPath(this.options)
        let dataArr = [...data]
        try {   
          let parentId = ''
          if(dataArr.find(val => val.id == id)){
            parentId = dataArr.find(val => val.id == id).parentId
          }
          arr.unshift(id)
          if(parentId && parentId != 0) {
              this.getCategoryInfoIds(arr, parentId)
          }
        } catch(e) {
            console.error(e)
        }
    },

    //树形数组转化为扁平型数组
    treeToPath(tree){
      let queen = [...tree];
      let result = [];
      while(queen.length){
        let first = queen.shift();
        if(first.childFileGroupInfoList.length>0){
          queen = queen.concat(first.childFileGroupInfoList)
          // first['childFileGroupInfoList'] = true;
        }
        result.push(first)
      }
      return result
    },

     //当前分组根据转移分组的值变化
    currentGroupHandleChange(value){
      this.currentGroup = this.getCurrentGroup(value)
    },

    getCurrentGroup(value){
      let arr = []
      arr[0] = this.options.find(val => val.id == value[0])
      if(value[1]){
        arr[1] = arr[0].childFileGroupInfoList.find(val => val.id == value[1])
      }
      if(value[2]){
        arr[2] = arr[1].childFileGroupInfoList.find(val => val.id == value[2])
      }
      return arr.map(val => val.name).join(' > ')
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