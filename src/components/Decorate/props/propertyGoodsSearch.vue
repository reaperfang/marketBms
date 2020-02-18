<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="90px" v-calcHeight="height">
    <div class="block form">
      <el-form-item label="搜索热词" prop="">
        <p>鼠标拖拽调整热词顺序，搜索框默认展示第一个热词，其他搜索词将以标签形式显示在搜索页中
          <el-button type="text" @click="dialogVisible=true; currentDialog='dialogGoodsSearchDemo'">查看示例</el-button>
        </p>
        <el-tag
          :key="tag"
          v-for="tag in ruleForm.hotWords"
          closable
          type="success"
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" type="primary" size="small" @click="showInput">+ 添加热词</el-button>
      </el-form-item>
      <el-form-item label="搜索样式" prop="borderStyle">
        <el-radio-group v-model="ruleForm.borderStyle">
          <el-radio :label="1">方形</el-radio>
          <el-radio :label="2">圆形</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="框体高度" prop="borderHeight">
          <div class="slider-wrapper">
            <el-slider v-model="ruleForm.borderHeight" :min="28" :max="40"></el-slider>
            <span>{{ruleForm.borderHeight}}像素</span>
          </div>
          小程序V2.17及以上版本支持
        </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#ffffff"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <!-- <el-form-item label="框体颜色" prop="borderColor">
        <div class="color_block">
          <el-input v-model="ruleForm.borderColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.borderColor" defaultColor="#ffffff"></colorPicker >
          <el-button type="text">重置</el-button>
        </div>
      </el-form-item> -->
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="rgb(153,153,153)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="文本位置" prop="textPosition">
        <el-radio-group v-model="ruleForm.textPosition">
          <el-radio :label="1">居左</el-radio>
          <el-radio :label="2">居中</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item label="消息按钮" prop="noticeCartBtn">
        <el-radio-group v-model="ruleForm.noticeCartBtn">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="购物车按钮" prop="shoppingCartBtn">
        <el-radio-group v-model="ruleForm.shoppingCartBtn">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="2">不显示</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogGoodsSearchDemo from '@/views/shop/dialogs/decorateDialogs/dialogGoodsSearchDemo';
export default {
  name: 'propertyGoodsSearch',
  mixins: [propertyMixin],
  components: {dialogGoodsSearchDemo},
  data () {
    return {
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        hotWords: [],//热词列表
        borderStyle: 2,//框体样式
        borderHeight: 40,//框体高度
        backgroundColor: '#ffffff',//背景颜色
        // borderColor: '#ffffff',//框体颜色
        borderColor: '#eff1f0',//框体颜色
        fontColor: 'rgb(153,153,153)',//文字颜色
        textPosition: 1,//文本位置
        shoppingCartBtn: 1,//购物车按钮显示	
        noticeCartBtn: 1 //通知消息按钮显示	
      },
      rules: {},
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    handleClose(tag) {
      this.ruleForm.hotWords.splice(this.ruleForm.hotWords.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.ruleForm.hotWords.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  /deep/.m-colorPicker .box.open {
      z-index: 10!important;
  }
</style>
