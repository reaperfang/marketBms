<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'移动分组'" @submit="submit">
    <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="分组名称：">
          <el-cascader
          v-model="form.groupId"
          :props="props"
          class="w_300"
          >
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
  data() {
    let self = this
    return {
      form:{
        groupId:['-1']
      },
      props: {
        lazy: true,
        checkStrictly: true,
        lazyLoad (node, resolve) {
          const {level} = node;
          setTimeout(() => {
            let id = node.level == 0 ? '0' : node.data.value
            let type =  self.typeName == 'image' ? '0' : '1'
            let query ={
              type:type,
              parentId:id
            }
            self._apis.file.getGroup(query).then((response)=>{
              if(response == null){
                return resolve([]);
              }else{
                const nodes = response.map(item => ({
                  value: item.id,
                  label: item.name,
                  leaf: level >=2
                }));
                // 通过调用resolve将子节点数据返回，通知组件数据加载完成
                resolve(nodes)
              }
            }).catch((error)=>{
              self.$message.error(error);
            })
          }, 500);
        }
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
    this.init()
  },
  methods: {
    init(){
      this.form.groupId = this.fromGroupId
    },

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