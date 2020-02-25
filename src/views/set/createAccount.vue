/*新建子账号 */
<template>
    <div class="main">
        <h1>创建子账号</h1>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <!-- <el-form-item label="店铺名称:" prop="shopName">
                <el-input v-model="form.shopName" style="width:182px;" placeholder="10个汉字"></el-input>
            </el-form-item> -->
            <el-form-item label="登录账号:" prop="userName">
                <el-input v-model="form.userName" style="width:182px;" placeholder="10个汉字" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" prop="mobile">
                <el-input v-model="form.mobile" style="width:182px;" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="角色:" prop="roleName">
                <el-radio-group v-model="form.roleName">
                    <el-radio
                    v-for="item in roles"
                    :key="item.roleName"
                    :label="item.roleName"
                    :value="item.roleName"
                    @change="handleShop(item.roleName)"
                    style="display:block; width:100px; height:30px; line-height:30px;">
                    {{item.roleName}}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="同步店铺:" prop="shopInfoIds">
                <el-checkbox-group v-model="form.shopInfoIds" class="inline">
                    <el-checkbox 
                    v-for="item in shops" 
                    :label="String(item.id)"
                    :key="String(item.id)"
                    style="display:block; width:100px;">
                    {{item.shopName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item class="mtb100">
                <el-button type="primary" @click.native.prevent="onSubmit('form')" v-loading="loading">保存</el-button>
                <el-button @click="_routeTo('subaccountManage')">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
// import { listArea } from '@/api/area'
export default {
  name: 'createAccount',
  data() {
    var validateMobile = (rule,value,callback) =>{
      let regFormat = /^[1][3578][0-9]{9}$/; //正确手机号
      if (!value) {
        return callback(new Error('不能为空'));
      }
      if (!(regFormat.test(value))) {
        callback(new Error('请输入正确手机号'));
      } else {
        callback();
      }
    }
    return {
      loading:false,
      form: {
          userName: '',
          mobile: '',
          roleName:'',
          shopInfoIds:[]
      },
      rules:{
        userName: [
          { required: true, message: '请输入人员名称', trigger: 'blur' },
          { min: 1, max: 10, message: '要求1~10个字符', trigger: 'blur' }
        ],
        mobile:[
          { required: true, message: '请输入登录手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        roleName:[
          { required: true, message: '请选择角色', trigger: 'blur' },
        ],
        shopInfoIds:[
          { required: true, message: '请选择店铺', trigger: 'blur' },
        ]
      },
      roles:[ ],
      shops:[ ],
      shopsData:[],
      isEdit:false
    }
  },
  computed:{
      accountInfo(){
          return this.$route.params.data
      },
      userInfo(){
        return JSON.parse(localStorage.getItem('userInfo'))
     },
     cid(){
        let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
        return shopInfo.id
     },
  },
  created(){
      this.getShops()
      this.getRoleList()
      this.init()
  },
  methods:{
    init(){
      if(this.accountInfo){
          this.form = {
            userName: this.accountInfo.userName,
            mobile: this.accountInfo.mobile,
            roleName:this.accountInfo.roleNames && this.accountInfo.roleNames.split(',')[0],
            shopInfoIds:this.accountInfo.shopIds && this.accountInfo.shopIds.split(',')
          }
          this.isEdit = this.accountInfo.id ? true : false
      }
    },
    //获取所有店铺
    getShops(){
      let data = this.userInfo.shopInfoMap
      for(let key in data){
        let shopObj = data[key]
        this.shops.push(shopObj)
        this.shopsData = this.shops
      }
    },
    //获取角色列表
    getRoleList(){
      let query = {
        cid:this.cid,
        shopInfoId:'',
        startIndex:1,
        pageSize:100,
      } 
      this._apis.set.getRoleList(query).then(response =>{
        this.roles = response.list
        if(this.roles.length){
          let roleName = ''
          if(this.accountInfo && this.accountInfo.roleNames){
              roleName = this.accountInfo.roleNames.split(',')[0]
          }else{
              roleName = this.roles[0].roleName
              this.form.roleName = roleName
          }
          this.handleShop(roleName)
        }
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    handleShop(roleName){
      if(this.accountInfo && this.accountInfo.roleNames){
        this.accountInfo.roleNames.split(',')[0] !=roleName && (this.form.shopInfoIds = [])
      }      
      let query = {
          cid:this.cid,
          roleName:roleName,
          startIndex:1,
          pageSize:10,
      }
      this._apis.set.getRoleList(query).then(response =>{
        let shopIds = response.list[0].shopIds.split(',')
        let newShops = []
        this.shopsData.map(item =>{
            shopIds.map(id =>{
                item.id == id && newShops.push(item)
            })
        })
        this.shops = JSON.parse(JSON.stringify(newShops)) 
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },
    //保存
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
        let id = this.accountInfo && this.accountInfo.id
        this.loading = true
        if(id){//修改子账号
           let query = {
               id:id,
               cid:this.cid,
               userName:this.form.userName,
               userNameOld:this.accountInfo.userName,
               mobile:this.form.mobile,
               platform:this.userInfo.platform,
               mcOrganizationId:0,
               roleName:this.form.roleName,
               shopInfoIds:this.form.shopInfoIds
           }
           this._apis.set.editSubAccount(query).then(response =>{
              this.loading = false
              this.$notify.success({
                  title: '成功',
                  message: '修改成功！'
              });
              this.$router.push({path:'subaccountManage'})
            }).catch(error =>{
              this.loading = false
              this.$notify.error({
                  title: '错误',
                  message: error
              });
            }) 
        }else{//新建子账号
            let query = {
               cid:this.cid,
               userName:this.form.userName,
               mobile:this.form.mobile,
               platform:this.userInfo.platform,
               mcOrganizationId:0,
               roleName:this.form.roleName,
               shopInfoIds:this.form.shopInfoIds
           } 
            this._apis.set.newSubAccount(query).then(response =>{
              this.loading = false
              this.$notify.success({
                  title: '成功',
                  message: '添加成功！'
              });
              this.$router.push({path:'subaccountManage'})
            }).catch(error =>{
              this.loading = false
              this.$notify.error({
                  title: '错误',
                  message: error
              });
            })
        }
        }
      })
    }
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
.mtb100{
    margin: 100px 0;
}
</style>