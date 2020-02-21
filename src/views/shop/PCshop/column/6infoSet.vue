<template>
    <div class="gbc_container">
      <h2>信息资讯编辑</h2>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title" placeholder="请输入标题" type="textarea" clearable autosize></el-input>
        </el-form-item>
        <el-form-item label="图片(一行一个)" prop="informationId">
         <el-button type="primary" style="margin-bottom:10px;" @click="dialogVisible=true; currentDialog='dialogSelectInfo'">新增</el-button>
          <el-table
            :data="infos"
            style="width: 100%">
            <el-table-column
              prop="title"
              label="标题">
              <template slot-scope="scope">
                <div class="info_block">
                  <img class="cover_img" :src="scope.row.cover || require('../../../../assets/images/shop/error_img.png')" alt="">
                  <span>{{scope.row.title}}</span>
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="author" label="作者"></el-table-column>
            <el-table-column prop="authorHeadPath" label="作者头像">
              <template slot-scope="scope">
                <img class="author_img" :src="scope.row.authorHeadPath" alt="">
              </template>
            </el-table-column> -->
            <el-table-column prop="" label="操作" :width="250">
              <template slot-scope="scope">
                  <span class="table-btn" @click="_routeTo('p_previewInfo', {id: scope.row.id})">查看</span>
                  <span class="table-btn" @click="deleteItem(scope.row)">删除</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div class="confirm_btn">
        <el-button type="primary" @click="saveData" :loading="submitLoadinig">保存并生效</el-button>
        <el-button type="primary" @click="$router.go(-1)">取消</el-button>
      </div>
    
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="infos" :multiple="false"></component>
    </div>
</template>

<script>
import utils from '@/utils';
import dialogSelectInfo from '@/views/shop/dialogs/decorateDialogs/dialogSelectInfo';
export default {
  name: "6infoSet",
  components: {dialogSelectInfo},
  data() {

    var validateBlank = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('请输入内容'));
      } else {
        callback();
      }
    };

    return {
      id: this.$route.query.id,
      loading: false,
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        title: 'HELP&INFORMATION',//标题
        type: this.$route.query.type,  //橱窗类型 1.one,2.two,3.three,4.four,5.five,6.six
        informationId: [] //咨询id集合
      },
      infos: [],
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "长度在 1 到 100 个字符",
            trigger: "blur"
          },
          {validator: validateBlank, trigger: "blur"}
        ]
        // informationId: [
        //   { required: true, message: "请添加图片", trigger: "change" }
        // ]
      },
      submitLoadinig: false
    };
  },
  created() {
    this.fetch();
  },
  watch: {
    infos: {
      handler(newValue) {
        this.ruleForm.informationId = newValue.map(item => item.id);
      }
    }
  },
  methods: {

    /* 获取装修数据 */
    fetch() {
      if(!this.ruleForm.type) {
        return;
      }
      this.loading = true;
      this._apis.shop.getWindow({type: this.ruleForm.type}).then((response)=>{
        this.loading = false;
        this.ruleForm = response;
        this.getInfoListByids(response.informationId);
      }).catch((error)=>{
        console.error(error);
        this.loading = false;
      });
    },

    /* 保存数据 */
    saveData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.submitLoadinig = true;
          this._apis.shop.modifyWindow(this.ruleForm).then((response)=>{
            this.$notify({
              title: '成功',
              message: '修改成功！',
              type: 'success'
            });
            this.submitLoadinig = false;
            this._routeTo('p_columnIndex');
          }).catch((error)=>{
            this.$notify.error({
              title: '错误',
              message: error
            });
            this.submitLoadinig = false;
          });
        } else {
          this.$message({ message: '填写正确的信息', type: 'warning' });
        }
      });
    },

    getInfoListByids(ids) {
        this._apis.shop.getInfoByIds({ids}).then((response)=>{
          this.infos = response.list.filter((item)=>{
            return item.status === 0 || item.status === '0'
          });
        }).catch((error)=>{
          console.error(error);
        });
    },

     /* 弹框选中资讯 */
    dialogDataSelected(dialogData) {
      if(this.ruleForm.informationId.includes(dialogData.id)) {
        this.$notify({
          title: '警告',
          message: '已添加此资讯',
          type: 'warning'
        });
      }else{
        this.infos.push(dialogData);
      }
      this.ruleForm.informationId = dialogData.map(item => item.id);
    },

     /* 删除数据项 */
    deleteItem(item) {
      if(item.fakeData) {  //如果是假数据
        this.$alert('示例数据不支持删除操作，请在右侧替换真实数据后重试!', '警告', {
          confirmButtonText: '确定'
        })
        return;
      }
      const tempItems = [...this.infos];
      for(let i=0;i<tempItems.length;i++) {
        if(item.id === tempItems[i].id) {
          tempItems.splice(i, 1);
        }
      }
      this.infos = tempItems;
    },


  },

};
</script>
<style lang="scss" scoped>
.confirm_btn{
  display:flex;
  flex-direction: row;
  justify-content: center;
  padding-bottom: 30px;
}
.info_block{
  display:flex;
  align-items: center;
  .cover_img{
    width: 50px;
    height: 40px;
    object-fit: contain;
    margin-right:10px;
  }
}
.author_img{
  width: 50px;
  height: 40px;
  object-fit: contain;
}
</style>

