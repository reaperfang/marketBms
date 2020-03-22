<template>
<div class="groups_cont">
<!-- <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="search"></el-input> -->
    <el-tree 
      :data="treeData"
      node-key="id"
      @node-click="handleLeftclick"
      @node-contextmenu="rightClick"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      :load="loadNode"
      lazy
      ref="tree">
        <span class="slot-t-node" slot-scope="{ node, data }">
          <span>{{data.name}}</span>
        </span>
    </el-tree>
    <span class="newClass" @click="addSameLevelNode()">+ 新建分组</span>
    <el-card class="box-card" ref="card" v-show="menuVisible">
      <img src="@/assets/images/shop/group_add.png" @click="addChildNode()">
      <img src="@/assets/images/shop/group_edit.png" @click="editNode()">
      <img src="@/assets/images/shop/group_del.png" @click="deleteNode()">
    </el-card>
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
    eleId:'',
    isShow:false,
    currentData:'',
    currentNode:'',
    menuVisible:false,
    firstLevel:false,
    // filterText:'',
    maxexpandId:4,
    loadData:[],
    treeData:[],
    defaultProps: {
      children:'children',
      label:'label'
    },
    dialogVisible: false,
    currentDialog: '',
    dialogTitle:'',
    typeData:''
  }
},

props:['typeName'],

components:{dialogGroups,dialogGroupsDel},

watch: {
  // filterText (val) {
  //   this.$refs.tree.filter(val)
  // }
},

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
            data.add.groupLevel == 1 ? this.handleAddSameLevelNode(data.add.groupName) : this.handleAddChildNode(data.add.groupName)
          break;
          case 'edit':
            this.handelEditNode(data.edit.groupName)
          break;
          case 'delete':
            this.handelDeleteNode()
          break;
        }
      }
  },

  // 查询
  filterNode (value, data) {
    if (!value)return true
      return data.label.indexOf(value) !== -1
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
        let data = {id:response,name:name}
        this.$refs.tree.append(data,this.currentNode.parent)
      }).catch((error)=>{
        this.$message.error(error);
      })
  },

  // 增加子级节点弹窗打开
  addChildNode () {
    if (this.currentNode.level >=3) {
      this.$message.error('最多只支持三级！')
      return false
    }else{
      this.dialogVisible = true
      this.currentDialog = 'dialogGroups'
      this.dialogTitle = this.currentNode.level == 1 ? '新建二级分组' : '新建三级分组'
      this.typeData = {
        type:'add'
      }
    }
  },

  // 增加子级节点事件
  handleAddChildNode(name){
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      name:name,
      type:type,
      parentId:this.currentNode.data.id 
    }
    this._apis.file.newGroup(query).then((response)=>{
      let data = {id:response,name:name}
      this.$refs.tree.append(data,this.currentNode)
    }).catch((error)=>{
      this.$message.error(error);
    })
  },

  // 删除节点弹窗打开
  deleteNode () {
    this.dialogVisible = true
    this.currentDialog = 'dialogGroupsDel'
    this.dialogTitle = '删除分组'
  },

  // 删除节点事件
  handelDeleteNode(){
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      id:this.currentNode.data.id,
      type:type,
      parentId:this.currentNode.data.parentId
    }
    this._apis.file.deleteGroup(query).then((response)=>{
        this.$refs.tree.remove(this.currentNode)
      }).catch((error)=>{
        this.$message.error(error);
      })
  },

  // 编辑节点弹窗打开
  editNode(){
    this.dialogVisible = true
    this.currentDialog = 'dialogGroups'
    this.dialogTitle = '编辑分组'
    this.typeData = {
      type:'edit',
      name:this.currentNode.data.name
    }
  },

  // 编辑节点事件
  handelEditNode (name) {
    let type =  this.typeName == 'image' ? '0' : '1'
    let query ={
      id:this.currentNode.data.id,
      name:name,
      type:type,
      parentId:this.currentNode.data.parentId
    }
    this._apis.file.editGroup(query).then((response)=>{
        this.$set(this.currentData,'name',name)
    }).catch((error)=>{
      this.$message.error(error);
    })
  },

  // 鼠标右击事件
  rightClick (MouseEvent, object, Node, element) {
    this.currentData = object
    this.currentNode = Node
    if(Node.data.id != '-1'){
      if (Node.level ===1) {
        this.firstLevel =true
      }else {
        this.firstLevel =false
      }
      this.menuVisible =true
    // /* 菜单定位基于鼠标点击位置 */
      document.addEventListener('click',this.foo)
      this.$refs.card.$el.style.left =event.clientX - 60 +'px'
      this.$refs.card.$el.style.top =event.clientY - 90 +'px'
    }
  },

  // 鼠标左击事件
  handleLeftclick (data, node) {
    if(this.typeName == 'image'){
      this.$emit('submit',{getGroupImage:{groupId:node.data.id}})
    }else{
      this.$emit('submit',{getGroupVideo:{groupId:node.data.id}})
    }
    this.foo()
  },

  //  取消鼠标监听事件 菜单栏
  foo () {
    this.menuVisible =false
    //  要及时关掉监听，不关掉的是一个坑，不信你试试，虽然前台显示的时候没有啥毛病，加一个alert你就知道了
    document.removeEventListener('click',this.foo)
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
</style>

