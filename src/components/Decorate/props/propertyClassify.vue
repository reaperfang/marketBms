<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px">
    <div class="block form">
      <el-form-item label="分类名称" prop="name">
        <el-input placeholder="请勿超过10个字" v-model="ruleForm.name" @blur="changeValidate"></el-input>
      </el-form-item>
      <el-form-item label="排序优先级" prop="sortType">
        <el-radio-group v-model="ruleForm.sortType">
          <el-radio :label="1">创建时间越晚越靠前</el-radio>
          <el-radio :label="2">创建时间越早越靠前</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="展示方式" prop="showType">
        <el-radio-group v-model="ruleForm.showType">
          <el-radio :label="1">名称列表</el-radio>
          <el-radio :label="2">期刊列表</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <RichEditor @editorValueUpdate="editorValueUpdate" :myConfig="myConfig" :richValue="ruleForm.explain"></RichEditor>
    </div>

    <div class="block form" v-if="ruleForm.pageInfos && ruleForm.pageInfos.length">
      <p>页面管理</p>
      <div class="page_tags">
        <el-tag v-for="item of ruleForm.pageInfos" :key="item.name" closable @close="resetClassify(item)">{{item.name}}</el-tag>
      </div>
    </div>

  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
import RichEditor from '@/components/RichEditor';
import DialogBase from "@/components/DialogBase";
export default {
  name: 'propertyTitle',
  mixins: [mixinPropsBase],
  components: {DialogBase, RichEditor},
  data () {
    return {
      editorData: '',  //富文本数据
      myConfig: {
          // 编辑器不自动被内容撑高
          autoHeightEnabled: false,
          // 初始容器高度
          initialFrameHeight: 220,
          // 初始容器宽度
          initialFrameWidth: 306
      },
      ruleForm: {
        name: '',
        sortType: 1,
        showType: 1,
        colorStyle: '#fff',
        explain: '',
        vError: false,
        pageInfos: []
      },
      errorMessage: '请填写基础信息后重试',
      rules: {
        name: [
          { required: true, message: "请输入内容", trigger: "blur", validator: this.utils.ruleValidator.validateRequired },
          {
            min: 1,
            max: 10,
            message: "要求1~10个字符",
            trigger: "blur",
            validator: this.utils.ruleValidator.validateMax
          }
        ],
        explain: [
          { required: true, message: "请输入内容", trigger: "blur", validator: this.utils.ruleValidator.validateRequired }
        ],
      }
    }
  },
  mounted() {
    // this.changeValidate('');
  },
  methods: {
     /* 富文本内容更新 */
    editorValueUpdate(html) {
      this.ruleForm.explain = html;
    },


     /* 重置页面分类 */
    resetClassify(item) {
       this.currentItem = item;
       this.confirm({
        customClass: 'goods-custom', 
        icon: true, 
        text: `确定移除 [ ${item.name} ] 吗？移除后会进入[未分类]`
      }).then(() => {
           this._apis.shop.modifyClassify({
            status: '0',
            ids: [item.id],
            pageCategoryInfoId: '-1'
          }).then((response)=>{
            this.$message.success('移除成功！');

            const index = this.ruleForm.pageInfos.indexOf(item);
            if(index > -1) {
              this.ruleForm.pageInfos.splice(index, 1);
            }
          }).catch((error)=>{
            this.$message.error(error);
          });
        })
    },

    // 值改变
    changeValidate(value) {
      let self = this;
      this.$refs.ruleForm.validate( valid => {
        self.ruleForm.vError = !valid;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page_tags{
  span{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    i{
      top: 4px!important;
      right: 5px!important;
    }
  }
}
/deep/.edui-editor{
    z-index: initial!important;
}
</style>
