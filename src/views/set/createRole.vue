/*新建子账号 */
<template>
    <div class="main">
        <h1>创建角色</h1>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <!-- <el-form-item label="店铺名称:" prop="shopName">
                <el-input v-model="form.shopName" style="width:182px;" placeholder="10个汉字"></el-input>
            </el-form-item> -->
            <el-form-item label="角色名称:" prop="roleName">
                <el-input v-model.trim="form.roleName" style="width:182px;" placeholder="10个汉字"></el-input>
            </el-form-item>
            <el-form-item label="角色描述:" prop="roleDesc">
                <el-input v-model="form.roleDesc" style="width:182px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="同步店铺:" prop="shopChecked" class="display:flex;">
                <p style="color:#DC6662;">请先选择店铺之后，再选择权限，如果权限未勾选，已选择店铺无效；</p>
                <el-checkbox-group v-model="shopChecked" class="inline">
                    <div v-for="item in shops" :key="item.id">
                        <el-checkbox                                          
                        :label="item.id"
                        :value="item.id"                     
                        class="mr20">
                        {{item.shopName}}
                        </el-checkbox>
                        <el-link type="primary" @click="handleIsShow(item)">选择权限</el-link>
                    </div>                    
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="mtb200">
                <el-button type="primary" @click="onSubmit('form')" v-loading="loading">保存</el-button>
                <el-button @click="_routeTo('roleManage')">返回</el-button>
            </el-form-item>
        </el-form>
        <!-- 动态弹窗 -->
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" :data="data" @submit="handleSubmit"></component>
    </div>
</template>

<script>
import treeMenu from '@/components/TreeMenu'
import * as menus from '@/components/menus'
import dialogTree from './dialogs/dialogTree';
import { userInfo } from 'os';
export default {
  name: 'createRole',
  components:{
      treeMenu,
      dialogTree
  },
  data() {
    return {
      loading:false,
      form: {
          roleName:'',
          roleDesc: '',
          oldRoleName:'',
          shops: []
      },
      rules:{
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 1, max: 10, message: '要求1~10个字符', trigger: 'blur' }
        ],
        roleDesc:[
            { min: 0, max: 50, message: '长度不超过50个字符', trigger: 'blur' }
        ],
        shops:[
          { required: true, message: '请选择店铺', trigger: 'blur' },
        ]
      },  
      dialogVisible:false,
      currentDialog: '',
      data:{},
      shops:[],
      shopChecked:[],
    }
  },
  computed: {
      roleInfo(){
          return this.$route.params.data
      },
      userInfo(){
        return JSON.parse(localStorage.getItem('userInfo'))
     },
  },
  created(){
      this.init()
      this.getShops()
  },
  methods:{
    init(){
        if(this.roleInfo){
            this.form = {
                roleName:this.roleInfo.roleName,
                roleDesc:this.roleInfo.roleDesc,
                oldRoleName:this.roleInfo.roleName,
                shops:[]            
            }
            this.roleInfo.shopIds.split(',').map(item =>{
                this.shopChecked.push(item * 1)             
            }) 
        }
        
    },

    //获取所有店铺
    getShops(){
      let data = this.userInfo.shopInfoMap
      for(let key in data){
        // data[key].data.msfList = this.buildTree(data[key].data.msfList)
        let shopObj = Object.assign(data[key],{isShow:false})
        this.shops.push(shopObj)
      }
      this.shopChecked.map(item =>{
        this.shops.map(shop =>{           
            if(shop.id == item*1){
                let query = {
                    roleName:this.roleInfo.roleName,
                    shopInfoId:shop.id
                }
                this._apis.set.getRoleInfo(query).then(response =>{
                    let functions = response.list[0].functions
                    shop = Object.assign(shop,{functions:functions})
                    let obj = {shopId:item,functions:functions}
                    this.form.shops.push(obj)
                }).catch(error =>{
                    this.$notify.error({
                    title: '错误',
                    message: error
                    });
                }) 
            } 
        })
      })
    },
    //展示功能点弹窗
    handleIsShow(data){
        this.dialogVisible = true
        this.currentDialog = 'dialogTree'
        this.data = data
    },

    //确定权限
    handleSubmit(data){
        if(this.form.shops.length){
            this.form.shops.map((item,index) =>{
                item.shopId == data.shopId && this.form.shops.splice(index,1)                      
            })
        }
        this.shopChecked.map((id,shopIndex) =>{
            if(id == data.shopId){
                if(!data.functions.length){
                    this.shopChecked.splice(shopIndex,1)
                }else{
                    this.form.shops.push(data)
                    this.shops.map(shop =>{
                        shop.id == data.shopId && (shop = Object.assign(shop,{functions:data.functions}))
                    })
                } 
            }
        })
    },

    //新建角色
    onSubmit(formName){
        this.loading = true
        this.$refs[formName].validate((valid) => {
        if (valid) {
            let roleName = this.roleInfo && this.roleInfo.roleName
            let msg = roleName ? '修改成功！' : '添加成功！'
            if(this.form.shops.length){
                this._apis.set.newRole(this.form).then(response =>{
                    this.loading = false
                    this.$notify.success({
                        title: '成功',
                        message: msg
                    });
                    this.$router.push({path:'roleManage'})
                }).catch(error =>{
                    this.loading = false
                    this.$notify.error({
                        title: '错误',
                        message: error
                    });
                })
            }else{
                this.loading = false
                this.$notify.warning({
                    title: '提示',
                    message: '创建没有店铺权限的角色无效！'
                });
            }
        }
      })
    },      
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.main{
    width: 100%;
    background: #fff;
    padding: 20px;
    h1{
        font-size: 14px;
        color: #3D434A;
        margin-bottom: 30px;
    }
}
.inline{
    display: inline;
}
.ml20{
    margin-left: 20px;
}
.mr20{
    margin-right: 20px;
}
.mtb200{
    margin: 200px 0;
}
</style>