/*店铺管理 */
<template>
    <div class="main">
        <el-form ref="form" :model="form" :rules="rules" :inline="true" class="demo-form-inline">
            <el-form-item label="店铺名称:" prop="shopName">
                <el-input v-model="form.name" style="width:182px;" placeholder="全部"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="_routeTo('shopDistribute')">店铺分配</el-button>
        <smTable class="mt20"></smTable>
    </div>
</template>

<script>
import smTable from './components/smTable'
// import { listArea } from '@/api/area'
export default {
  name: 'shopManages',
  components:{smTable},
  data() {
    return {
      form: {
          shopName: '',
          phone: '',
          role: ['运营']
      },
      options:[
          {
              label:'店铺1',
              value:1
          },
          {
              label:'店铺2',
              value:2
          },
          {
              label:'店铺3',
              value:3
          },
          {
              label:'店铺4',
              value:4
          }
      ],
      rules:{
        name: [
          { required: true, message: '请输入管理员名称', trigger: 'blur' },
          { min: 1, max: 10, message: '要求1~10个字符', trigger: 'blur' }
        ],
        phone:[
          { required: true, message: '请输入管理员手机号', trigger: 'blur' },
        ],
        role:[
          { required: true, message: '请选择店铺', trigger: 'blur' },
        ]
      }

    }
  },
  methods:{
     
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
.mt20{
    margin-top: 20px;
}
</style>