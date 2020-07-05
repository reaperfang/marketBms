<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" v-calcHeight="height">
    <div class="block form">
      <el-form-item class="form-item-select-template" label="选择模板" prop="templateType">
        <ul class="tile-list n2 template_type">
          <li @click="selectTemplate(1)" :class="{'active': ruleForm.templateType === 1}">
            <div class="type1">
              <div class="fill_block"></div>
              <div class="fill_block"></div>
              <div class="fill_block"></div>
            </div>
            <p>图片导航</p>
          </li>
          <li @click="selectTemplate(2)" :class="{'active': ruleForm.templateType === 2}">
            <div class="type2">
              <div class="fill_block">导航</div>
              <div class="fill_block">导航</div>
            </div>
            <p>文字导航</p>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="滑动设置" prop="slideType">
        <el-radio-group v-model="ruleForm.slideType">
          <el-radio :label="1">固定</el-radio>
          <el-radio :label="2">横向滑动</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#fff"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="文字颜色" prop="fontColor" v-if="hasContent">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="#000"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
    </div>
    <div class="block form">
      添加导航：
      <p class="prop-message" style="margin-top:5px;">最多添加10个导航，鼠标拖拽可调整导航顺序</p>
      <!-- 可拖拽调整顺序 -->
      <vuedraggable 
      class="drag-wrap item_list"
      :list='ruleForm.itemList'
      v-bind="dragOptions"
      @start="drag=true"
      @end="drag=false">
          <li v-for="(item, key) of ruleForm.itemList" :key="key">
            <div class="left" v-if="ruleForm.templateType === 1">
              <div v-if="item.url" class="img_preview">
                <img :src="item.url" alt="">
                <i class="delete_btn" @click.stop="deleteImage(item)"></i>
                <span @click="dialogVisible=true; currentNav=item; currentDialog='dialogSelectImageMaterial'">更换图片</span>
              </div>
              <div v-else class="add_button" @click="dialogVisible=true; currentNav=item; currentDialog='dialogSelectImageMaterial'">
                <i class="inner"></i>
                <p>上传图片</p>
              </div>
            </div>
            <div class="right">
              <p>
                <span class="span-title" v-if="ruleForm.templateType === 1">图片标题</span>
                <span class="span-title" v-else-if="ruleForm.templateType === 2">导航文字</span>
                <el-input v-model="item.title"></el-input>
              </p>
              <p style="display:flex;">
                <el-button type="text" style="width: 60px;color: rgba(68,67,75,1);cursor: text;">跳转链接</el-button>
                <el-button
                v-if="!item.linkTo"
                type="text"
                @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">选择跳转到的页面</el-button>
              </p>
              <div class="link_overview clearFix arrow" v-if="item.linkTo">
                <div class="cont l">
                  <span class="l" :title="item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name)">{{item.linkTo.typeName + ' | ' + (item.linkTo.data.title || item.linkTo.data.name)}}</span>
                  <i @click="removeLink(item)"></i>
                </div>
                <span class="modify r" @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">修改</span>
              </div>
            </div>
            <i class="delete_btn" :class="{'input-linkTo' : item.linkTo}" @click.stop="deleteItem(item)" title="移除"></i>
          </li>
      </vuedraggable>
      <div @click="addNav" class="add-button-x add-image-ad" v-if="canAdd">
        <i class="el-icon-plus"></i>
        <span>添加一个图文导航</span>
      </div>
      <p class="prop-message" style="margin-top:10px;">{{suggestSize}}</p>
      <!-- <p style="margin-top:10px;color:rgb(211,211,211)">最多添加 10 个导航，拖动选中的导航可对其排序小程序 v2.3.1 及以上版本支持</p> -->
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import mixinPropsBase from '../mixins/mixinPropsBase';
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import vuedraggable from "vuedraggable";
export default {
  name: 'propertyArticleNav',
  mixins: [mixinPropsBase],
  components: {dialogSelectJumpPage, dialogSelectImageMaterial, vuedraggable},
  data () {
    return {
      ruleForm: {
        templateType: 1,//模板类型
        slideType: 1,//滑动类型
        backgroundColor: '#fff',//背景颜色
        fontColor: '#000',//文字颜色
        itemList: [],
      },
      rules: {},
      currentNav: null,  //当前操作的图文导航
      dialogVisible: false,
      currentDialog: '',
      suggestSize: '建议上传尺寸160*160像素(或其他1: 1尺寸)且小于3M的图片（当尺寸不匹配时图片会被压缩或拉伸至变形）',
      dragOptions: {
          animation: 300,
          group: "description",
          ghostClass: "ghost"
      },
      drag: false,
      canAdd: true
    }
  },
   watch: {
    'ruleForm.itemList': {
      handler(newValue) {
        this.canAdd = newValue.length < 10;
      },
      deep: true
    }
  },
  computed: {
    /* 检测是否有数据 */
    hasContent() {
        let value = false;
        if(this.ruleForm.itemList) {
          if(Object.prototype.toString.call(this.ruleForm.itemList) === '[object Object]') {
            this.ruleForm.itemList = [...this.ruleForm.itemList];
          }
          return !!this.ruleForm.itemList.length;
        }
        return value;
    }
  },
  methods: {
    selectTemplate(templateType) {
      this.ruleForm.templateType = templateType;
      this.blockType = 1;
      switch(Number(templateType)) {
        case 1:
          this.suggestSize = '建议上传尺寸160*160像素(或其他1: 1尺寸)且小于3M的图片（当尺寸不匹配时图片会被压缩或拉伸至变形）';
          break; 
        case 2:
          this.suggestSize = '建议：不超过5个汉字';
          break; 
      }
    },

    addNav() {
      this.ruleForm.itemList.push({
        title: '导航',
        url: '',
        linkTo: null,
        id: uuidv4()
      });
      this.currentNav = this.ruleForm.itemList[this.ruleForm.itemList.length - 1];
      // this.dialogVisible=true; 
      // this.currentDialog='dialogSelectImageMaterial';
    },

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.currentNav.title= dialogData.name ||  dialogData.fileName || dialogData.original,
      this.currentNav.url= dialogData.filePath;
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.currentNav.linkTo = linkTo;
    },

    deleteItem(item) {
      this.confirm({
        title: '提示', 
        customClass: 'goods-custom', 
        icon: true, 
        text: '确定删除此图文导航吗？'
      }).then(() => {
        const tempItems = [...this.ruleForm.itemList];
        for(let i=0;i<tempItems.length;i++) {
          if(item === tempItems[i]) {
            tempItems.splice(i, 1);
          }
        }
        this.ruleForm.itemList = tempItems;
      })
    },

    /* 清除某一个图片 */
    deleteImage(item) {
      const tempList = [...this.ruleForm.itemList];
      for(let item2 of tempList) {
        if(item.id === item2.id) {
          item2.url = '';
          break;
        }
      }
      this.ruleForm.itemList = tempList;
    },

    /* 移除链接 */
    removeLink(item) {
      const tempList = [...this.ruleForm.itemList];
      for(let item2 of tempList) {
        if(item.id === item2.id) {
          item2.linkTo = null;
          break;
        }
      }
      this.ruleForm.itemList = tempList;
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  &:nth-child(2) {
    padding-left: 17px!important;
  }
  .form-item-select-template {
    /deep/ .el-form-item__content {
      margin-left: 15px!important;
      clear: both;
    }
  }
  .add_button {
    width: 80px;
    height: 80px;
  }
  .add-image-ad {
    text-align: center;
  }
  .img_preview {
    .delete_btn {
      right: -8px;
      top: -8px;
    }
  }
}
ul.template_type{
  li{
    width:90px!important;
    margin-right:20px!important;
    height:100px;
    border:1px solid rgb(228,227,235);
    padding:20px 10px 10px 10px;
    box-sizing: border-box;
    cursor:pointer;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &.active{
      border:1px solid $globalMainColor;
    }
    .fill_block{
      height:100%;
      background:rgb(230,228,255);
      margin-right:2px;
      color:rgb(188,187,255);
      width: 50%;
      height: 15px;
      margin-top: 3px;
      line-height: 15px;
      font-size: 12px;
      text-align: center;
      &:last-child{
        margin-right:0;
      }
    }
    .type1{
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      .fill_block{
        width:33.3%;
        height: 20px;
        background:rgb(230,228,255) url('../../../assets/images/shop/editor/pic.png') no-repeat 2px 3px;
      }
    }
    .type2{
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      .fill_block{
        width: 50%;
        height: 19px;
        line-height: 20px;
      }
    }
    p{
      margin-top:6px;
      text-align:center;
      line-height: 21px;
    }
  }
}

.item_list{
  margin-top:20px;
  li{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom:20px;
    position:relative;
    .left{
      margin-right:12px;
    }
    .right{
      display: flex;
      flex-direction: column;
      justify-content: center;
      p{
        span{
          &.span-title {
            margin-right: 10px;
          }
        }
        .el-input{
          width: 142px;
          display: inline-block;
        }
      }
    }
     i.delete_btn{
      width:14px;
      height:14px;
      border-radius:50%;
      background:url('../../../assets/images/shop/editor/delete.png') no-repeat 0 0;
      position:absolute;
      cursor: pointer;
      background-size: 100% 100%;
      right: 0;
      top: -1px;
      &.input-linkTo {
        right: 0;
        top: -7px;
      }
    }
  }
}
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
