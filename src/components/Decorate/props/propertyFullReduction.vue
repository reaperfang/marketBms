<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <!-- <el-form-item label="显示标题" prop="title">
        <el-input
          placeholder="请输入标题"
          v-model="ruleForm.title">
        </el-input>
      </el-form-item> -->
      <el-form-item label="选择活动" prop="promotions">
        <el-button type="primary" plain @click="dialogVisible=true; currentDialog='dialogSelectFullReduction'">选择活动</el-button>
        <div>
          <el-tag
            v-for="tag in list"
            :key="tag.name"
            closable
            style="margin-right:5px;"
            type="success" @close="deleteItem(tag)">
            {{tag.name}}
          </el-tag>
        </div>
      </el-form-item>
      <el-form-item label="展示样式" prop="displayStyle">
        <el-radio-group v-model="ruleForm.displayStyle">
          <el-radio :label="1">样式1</el-radio>
          <el-radio :label="2">样式2</el-radio>
          <el-radio :label="3">样式3</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="list"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectFullReduction from '@/views/shop/dialogs/dialogSelectFullReduction';
import uuid from 'uuid/v4';
export default {
  name: 'propertyFullReduction',
  mixins: [propertyMixin],
  components: {dialogSelectFullReduction},
  data () {
    return {
      ruleForm: {
        title: '满减/满折',//显示标题
        displayStyle: 1,//展示样式
        ids: [],//满减满折活动id列表
        loading: false
      },
      rules: {

      },
      list: [],
      dialogVisible: false,
      currentDialog: ''
    }
  },
  created() {
    this.fetch();
  },
   watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.id);
        }
        this.fetch();
        this._globalEvent.$emit('fetchFullReduction', this.ruleForm, this.$parent.currentComponentId);
      },
      deep: true
    }
  },
  methods: {
     //根据ids拉取数据
    fetch(componentData = this.ruleForm) {
      if(componentData) {
          if(Array.isArray(componentData.ids) && componentData.ids.length){
              this.loading = true;
              this._apis.shop.getFullReductionListByIds({
                  ids: componentData.ids.join(',')
              }).then((response)=>{
                  this.createList(response);
                  this.loading = false;
              }).catch((error)=>{
                  // this.$notify.error({
                  //     title: '错误',
                  //     message: error
                  // });
                  console.error(error);
                  this.list = [];
                  this.loading = false;
              });
          }else{
              this.list = [];
          }
      }
    },

      /* 创建数据 */
    createList(datas) {
        this.list = datas;
    },
  }
}
</script>

<style lang="scss">
</style>
