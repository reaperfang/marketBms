<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <!-- <el-form-item label="显示标题" prop="title">
        <el-input
          placeholder="请输入标题"
          v-model="ruleForm.title">
        </el-input>
      </el-form-item> -->
      <el-form-item label="选择活动" prop="promotions">
        <div class="row align-center">
          <div class="add-button-x" @click="dialogVisible=true; currentDialog='dialogSelectFullReduction'">
            <i class="el-icon-plus"></i>
            <span>选择活动</span>
          </div>
          <p class="message">最多添加10个活动</p>
        </div>
        <div v-loading="loading" class="goods_groups">
          <el-tag
            v-for="tag in displayList"
            :key="tag.name"
            :closable="deleteShow ? true : false"
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
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="echoList"></component>
  </el-form>
</template>

<script>
import mixinPropsData from '../mixins/mixinPropsData';
import dialogSelectFullReduction from '@/components/Decorate/dialogs/dialogSelectFullReduction';
export default {
  name: 'propertyFullReduction',
  mixins: [mixinPropsData],
  components: {dialogSelectFullReduction},
  data () {
    return {
      ruleForm: {
        title: '满减/满折',//显示标题
        displayStyle: 1,//展示样式
        ids: []//满减满折活动id列表
      },
      displayList: [],
      loading: false,
      rules: {

      },
      echoList: [],
      dialogVisible: false,
      currentDialog: ''
    }
  },
   watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.id);
        }
        this.fetch();
      },
      deep: true
    },

    'ruleForm.ids': {
      handler(newValue, oldValue) {
        const _self = this;
        if(!this.utils.isIdsUpdate(newValue, oldValue)) {
          this.echoList = [];
          newValue.forEach((item)=>{
            _self.echoList.push({id: item});
          })
        }
      },
      deep: true
    }
  },
  methods: {
     //根据ids拉取数据
    fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
      if(componentData) {
         bNeedUpdateMiddle && this.syncToMiddle();
          if(Array.isArray(componentData.ids) && componentData.ids.length){
              this.loading = true;

              this._apis.shop.getFullReductionListByIds({
                  ids: componentData.ids.join(',')
              }).then((response)=>{
                  this.createList(response);
                  this.loading = false;
                  this.deleteShow = true;
              }).catch((error)=>{
                  console.error(error);
                  this.displayList = [];
                  this.loading = false;
                  this.deleteShow = true;
              });
          }else{
              this.displayList = [];
          }
      }
    },

      /* 创建数据 */
    createList(datas) {
        this.displayList = datas;
    },
  }
}
</script>

<style lang="scss" scoped>
  .message {
    margin-left: 6px!important;
    font-size: 12px;
    color:rgba(146,146,155,1);
  }
  .goods_groups{
    margin-top: 10px;
    .el-tag{
      margin-right:12px!important;
    }
    /deep/ .el-tag {
      border-radius:4px;
      border:1px dashed rgba(101,94,255,1);
      padding: 4px 8px;
      height: 100%;
      margin-bottom: 10px;
      background-color: #fff;
      color: rgba(101,94,255,1);
      font-size: 14px;
      .el-tag__close {
        color: rgba(101,94,255,1);
        font-size: 16px;
        &:hover {
          color: rgba(101,94,255,1);
          background: #fff;
        }
      }
    }
  }
</style>
