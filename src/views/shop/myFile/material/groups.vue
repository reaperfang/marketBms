<template>
<div class="groups_cont">
    <el-tree 
      :data="treeData"
      node-key="id"
      @node-click="handleLeftclick"
      :expand-on-click-node="false"
      :load="loadNode"
      lazy
      ref="tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.name }}</span>
          <span>
            <img src="@/assets/images/shop/group_add.png" @click="addChildNode(node,data)" v-if="node.level !== 3">
            <img src="@/assets/images/shop/group_edit.png" @click="editNode(node,data)">
            <img src="@/assets/images/shop/group_del.png" @click="deleteNode(node,data)">
          </span>
        </span>
    </el-tree>
    <span class="newClass" @click="addSameLevelNode()">+ 新建分组</span>
<!-- 动态弹窗 -->
  <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :typeData="typeData" :dialogTitle="dialogTitle" @submit="handleSubmit"></component>
</div>
</template>

<script>
import dialogGroups from '@/views/shop/dialogs/materialDialogs/dialogGroups';
import dialogGroupsDel from '@/views/shop/dialogs/materialDialogs/dialogGroupsDel';
export default {
name:'processManagement',
data () {
  return {
    treeData:[],
    dialogVisible: false,
    currentDialog: '',
    dialogTitle:'',
    typeData:''
  }
},

props:['typeName'],

components:{dialogGroups,dialogGroupsDel},

watch: { },

mounted () {},

created(){ },

methods: {
  //节点数据懒加载
  loadNode(node, resolve) {
      setTimeout(() => {
        let id = node.data.id
        let type =  this.typeName == 'image' ? '0' : '1'
        let query ={
            type:type,
            parentId:id || '0'
          }
        this._apis.file.getGroup(query).then((response)=>{
          if(response == null){
            this.$message.warning('该分组下无其他分组')
            return resolve([ ]);
          }else{
            resolve(response)
          }
        }).catch((error)=>{
          this.$message.error(error);
        })
      }, 500);
  },

  //弹窗反馈
  handleSubmit(data){
      for(let key in data){
        switch (key) {
          case 'add':  
            data.add.groupLevel == 1 ? this.handleAddSameLevelNode(data.add.groupName) : this.handleAddChildNode(data.add.groupName,data.add.currentData,data.add.node)
          break;
          case 'edit':
            this.handelEditNode(data.edit.groupName,data.edit.currentData)
          break;
          case 'delete':
            this.handelDeleteNode(data.delete.node,data.delete.currentData)
          break;
        }
      }
  },

  // 增加同级节点弹窗打开
  addSameLevelNode () {
    this.dialogVisible = true
    this.currentDialog = 'dialogGroups'
    this.dialogTitle = '新建一级分组'
    this.typeData = {
      type:'add'
    }
  },

  // 增加同级节点事件
  handleAddSameLevelNode (name) {
    let type =  this.typeName == 'image' ? '0' : '1'
    let  query ={
        name:name,
        type:type,
        parentId:'0'  
      }
    this._apis.file.newGroup(query).then((response)=>{
        let obj = {
          id:response,
          parentId:null,
          name:name
        }
        this.treeData.unshift(obj)
      }).catch((error)=>{
        this.$message.error(error);
      })
  },

  // 增加子级节点弹窗打开
  addChildNode (node,data) {
    this.dialogVisible = true
    this.currentDialog = 'dialogGroups'
    this.dialogTitle = node.level == 1 ? '新建二级分组' : '新建三级分组'
    this.typeData = {
      type:'add',
      currentData:data,
      node:node
    }
  },

  // 增加子级节点事件
  handleAddChildNode(name,currentData,node){
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      name:name,
      type:type,
      parentId:currentData.id 
    }
    this._apis.file.newGroup(query).then((response)=>{
      let data = {id:response,name:name}
      this.$refs.tree.append(data,node)
    }).catch((error)=>{
      this.$message.error(error);
    })
  },

  // 删除节点弹窗打开
  deleteNode (node,data) {
    this.dialogVisible = true
    this.currentDialog = 'dialogGroupsDel'
    this.dialogTitle = '删除分组'
    this.typeData = {
      type:'del',
      node:node,
      currentData:data
    }
  },

  // 删除节点事件
  handelDeleteNode(node,currentData){
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      id:currentData.id,
      type:type,
      parentId:currentData.parentId
    }
    this._apis.file.deleteGroup(query).then((response)=>{
        this.$refs.tree.remove(node)
      }).catch((error)=>{
        this.$message.error(error);
      })
  },

  // 编辑节点弹窗打开
  editNode(node,data){
    this.dialogVisible = true
    this.currentDialog = 'dialogGroups'
    this.dialogTitle = '编辑分组'
    this.typeData = {
      type:'edit',
      currentData:data,
      name:data.name
    }
  },

  // 编辑节点事件
  handelEditNode (name,currentData) {
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      id:currentData.id,
      name:name,
      type:type,
      parentId:currentData.parentId
    }
    this._apis.file.editGroup(query).then((response)=>{
        this.$set(currentData,'name',name)
    }).catch((error)=>{
      this.$message.error(error);
    })
  },

  // 鼠标左击事件
  handleLeftclick (data, node) {
    if(this.typeName == 'image'){
      this.$emit('submit',{getGroupImage:{groupId:node.data.id}})
    }else{
      this.$emit('submit',{getGroupVideo:{groupId:node.data.id}})
    }
  },
}
}
</script>

<style scoped lang="scss">
.groups_cont{
  height: 840px;
  overflow-y: scroll;
}

.text {
  font-size:14px;
}

.el-tree{
  margin-top:10px;
}

.item {
  padding:18px 0;
}

.add{
  cursor:pointer;
  margin-top:10px;
}

.delete{
  margin:10px 0;
  cursor:pointer;
}

.edit{
  margin-bottom:10px;
  cursor:pointer;
}

.search {
  cursor:pointer;
}

.box-card {
  width:120px;
  position:absolute;
  z-index:1000;
  img{
    margin-right: 5px;
    cursor: pointer;
  }
}

.newClass{
  width: 100%;
  height: 28px;
  line-height: 28px;
  padding-left: 20px;
  display: inline-block;
  margin-top: 10px;
  cursor: pointer;
  &:hover{
    background:#DEE0FFFF;
  }
}

/deep/{
  .el-card{
    border:none;
    background: none;
  }
  .is-always-shadow{
    box-shadow:none !important;
    border-radius:0px !important;
  }
  .el-tree-node__content:hover{
    background:#DEE0FFFF !important;
    cursor: pointer;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>

