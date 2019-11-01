<template>
  <DialogBase :visible.sync="visible" width="500px" :title="'选择功能点'" @submit="submit">
      <div class="content">
        <el-tree
        :data="data.data.functions"
        show-checkbox
        node-key="id"
        ref="tree"
        highlight-current
        :default-checked-keys="filterKeys(data.functions)"
        :props="defaultProps">
        </el-tree>
        <!-- :default-checked-keys="toNum(data.functions)" -->
      </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogTree",
  components: {DialogBase},
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      functions:[],
      leafs:[],
    }
  },
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
      data:{
          type: Object,
          required: true
      }
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    },
    shopInfo(){
        return JSON.parse(localStorage.getItem('shopInfos'))
     }
  },
  created(){
    this.init()
   },
  methods: {
    //获取所有叶子节点
    init(){
      let ids = []
      let parentIds = []
      if(this.shopInfo && this.shopInfo.data && this.shopInfo.data.msfList){
            let data = this.shopInfo.data.msfList
            data.map(item =>{
                ids.push(item.id)
                parentIds.push(item.parentId)
            })
        }
        ids.map(item =>{
            let id = String(item)
            if(parentIds.indexOf(id) == -1){
                this.leafs.push(id)
            }
        })
    },

    //在叶子节点中筛选出已经选中的节点，从而达到父节点半选中状态
    filterKeys(data){
        let keys = []
        data && data.map(item =>{
          let id = String(item)
          if(this.leafs.indexOf(id) !== -1){
                keys.push(id)
            }
        })
        return keys
    },

    submit() {
      let checkedKeys = this.$refs.tree.getCheckedKeys()
      let HalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
      this.functions =  checkedKeys.concat(HalfCheckedKeys)
      this.$emit('submit',{shopId:this.data.id,functions:this.functions})
    }
  },

}
</script>

<style lang="scss" scoped>
.content{
  line-height: 30px;
  font-size: 14px;
  color: #443D4A;
  text-align: center;
}
</style>
