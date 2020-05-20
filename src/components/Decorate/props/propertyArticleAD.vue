<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" v-calcHeight="height">
    <div class="block form">
      <el-form-item label="选择模板" prop="templateType">
        <ul class="tile-list n2 template_type">
          <li @click="selectTemplate(1)" :class="{'active': ruleForm.templateType === 1}">
            <div class="type type1">
              <img src="../../../assets/images/shop/articleAD/ad1.png" alt="">
            </div>
            <p>一行一个</p>
          </li>
          <li @click="selectTemplate(2)" :class="{'active': ruleForm.templateType === 2}">
            <div class="type type2">
              <img src="../../../assets/images/shop/articleAD/ad2.png" alt="">
            </div>
            <p>轮播海报</p>
          </li>
          <li @click="selectTemplate(3)" :class="{'active': ruleForm.templateType === 3}">
            <div class="type type3">
              <img src="../../../assets/images/shop/articleAD/ad3.png" alt="">
            </div>
            <p>大图横向滑动</p>
          </li>
          <li @click="selectTemplate(4)" :class="{'active': ruleForm.templateType === 4}">
            <div class="type type4">
              <img src="../../../assets/images/shop/articleAD/ad4.png" alt="">
            </div>
            <p>小图横向滑动</p>
          </li>
          <li @click="selectTemplate(5)" :class="{'active': ruleForm.templateType === 5}">
            <div class="type type5">
              <img src="../../../assets/images/shop/articleAD/ad5.png" alt="">
            </div>
            <p>导航横向滑动</p>
          </li>
        </ul>
      </el-form-item>
    </div>

    <div class="block form">
      添加图片:
      <p style="color:rgb(211, 211, 211);margin-top:5px;">最多添加10个广告，鼠标拖拽可调整广告顺序</p>

      <!-- 可拖拽调整顺序 -->
      <vuedraggable
      class="drag-wrap item_list"
      :list='ruleForm.itemList'
      v-bind="dragOptions"
      @start="drag=true"
      @end="drag=false">
          <li v-for="(item, key) of ruleForm.itemList" :key="key">
            <div class="left">
              <div v-if="item.url" class="img_preview">
                <img :src="item.url" alt="">
                <i class="delete_btn" @click.stop="deleteImage(item)"></i>
                <span @click="dialogVisible=true; currentAD=item; currentDialog='dialogSelectImageMaterial'">更换图片</span>
              </div>
              <div v-else class="add_button" @click="dialogVisible=true; currentAD=item; currentDialog='dialogSelectImageMaterial'">
                <i class="inner"></i>
              </div>
            </div>
            <div class="right">
              <p>
                <span>图片标题</span>
                <el-input v-model="item.title"></el-input>
              </p>
              <p style="display:flex;">
                <el-button type="text" style="width: 60px;color: rgba(68,67,75,1);cursor: text;">跳转链接</el-button>
                <el-button
                v-if="!item.linkTo"
                type="text"
                @click="dialogVisible=true; currentAD = item; currentDialog='dialogSelectJumpPage'">选择跳转到的页面</el-button>
              </p>
              <div class="link_overview clearFix" v-if="item.linkTo">
                <div class="cont l">
                  <span class="l" :title="item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name)">{{item.linkTo.typeName + ' | ' + (item.linkTo.data.title || item.linkTo.data.name)}}</span>
                  <i @click="removeLink(item)"></i>
                </div>
                <span class="modify r" @click="dialogVisible=true; currentAD = item; currentDialog='dialogSelectJumpPage'">修改</span>
              </div>
            </div>
            <i class="delete_btn" @click.stop="deleteItem(item)" title="移除"></i>
          </li>
      </vuedraggable>
      <!-- <ul class="item_list">
      </ul> -->
      <el-button type="info" plain style="width:100%" @click="addNav">添加一个广告图</el-button>
      <p style="margin-top:10px;color:rgb(211,211,211)">{{suggestSize}}</p>
    </div>

     <div class="block form">
        <el-form-item label="页面边距" prop="pageMargin">
          <div class="slider-wrapper">
            <el-slider v-model="ruleForm.pageMargin" :min="0" :max="30"></el-slider>
            <span>{{ruleForm.pageMargin}}像素</span>
          </div>
        </el-form-item>
        <el-form-item label="图片间距" prop="imgMargin" v-if="hasContent">
            <div class="slider-wrapper">
            <el-slider v-model="ruleForm.imgMargin" :min="0" :max="30"></el-slider>
            <span>{{ruleForm.imgMargin}}像素</span>
            </div>
        </el-form-item>
    </div>

    <div class="block form">
      <el-form-item label="图片样式" prop="imgStyle">
        <el-radio-group v-model="ruleForm.imgStyle">
          <el-radio :label="1">常规</el-radio>
          <el-radio :label="2">投影</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图片倒角"  prop="imgChamfer">
        <el-radio-group v-model="ruleForm.imgChamfer">
          <el-radio :label="1">直角</el-radio>
          <el-radio :label="2">圆角</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>


   <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
import vuedraggable from "vuedraggable";
export default {
  name: 'propertyArticleAD',
  mixins: [propertyMixin],
  components: {dialogSelectJumpPage, dialogSelectImageMaterial, vuedraggable},
  data () {
    return {
      dialogVisible: false,
      currentDialog: '',
      ruleForm: {
        templateType: 1,  //模板类型
        pageMargin: 0,  //页面边距
        imgMargin: 10,  //图片间距
        imgStyle: 1,  //图片样式
        imgChamfer: 1,  //图片倒角
        itemList: [{  //图片列表
          title: '图片广告',
          url: '',
          linkTo: null,
          id: uuidv4()
        }],
      },
      rules: {},
      currentAD: null,  //当前操作的图文导航
      suggestSize: '建议尺寸：宽度750像素，高度360像素。', //推荐尺寸文本
      dragOptions: {
          animation: 300,
          group: "description",
          ghostClass: "ghost"
      },
      drag: false
    }
  },
  watch: {
    'ruleForm.itemList': {
      handler(newValue) {
        let list = [...newValue];
        list.forEach((item)=>{
          if(!item.id) {
            item.id = uuidv4();
          }
        })
        newValue = list
      },
      deep: true
    }
  },
  computed: {
     /* 检测是否有数据 */
    hasContent() {
      let value = false;
      let array = [];
      if(this.ruleForm.itemList) {
        if(Object.prototype.toString.call(this.ruleForm.itemList) === '[object Object]') {
          this.ruleForm.itemList = [...this.ruleForm.itemList];
        }
        for(let item of this.ruleForm.itemList) {
          if(item.url) {
            value = true;
            break;
          }
        }
      }
      return value;
    }
  },
  methods: {

    /*  */
    selectTemplate(templateType) {
      this.ruleForm.templateType = templateType;
      switch(Number(templateType)) {
        case 1:
          this.suggestSize = '建议尺寸：宽度750像素，高度360像素。';
          break;
        case 2:
          this.suggestSize = '建议尺寸：宽度750像素，高度320像素。';
          break;
        case 3:
          this.suggestSize = '建议尺寸：宽度750像素，高度430像素。';
          break;
        case 4:
          this.suggestSize = '建议上传220像素*220像素，或宽高1: 1的图片';
          break;
        case 5:
          this.suggestSize = '建议上传220像素*110像素，或宽高2: 1的图片';
          break;
      }
    },

    addNav() {
      this.ruleForm.itemList.push({
        title: '图片广告',
        url: '',
        linkTo: null,
        id: uuidv4()
      });
      // this.currentNav = this.ruleForm.itemList[this.ruleForm.itemList.length - 1];
      // this.dialogVisible=true;
      // this.currentDialog='dialogSelectImageMaterial';
    },

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.currentAD.title= '',
      this.currentAD.url= dialogData.filePath;
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.currentAD.linkTo = linkTo;
    },

    deleteItem(item) {
      if(this.ruleForm.itemList.length < 2) {
        this.$message.warning('最后一个不允许删除');
        return;
      }
      this.confirm({
        title: '提示',
        customClass: 'goods-custom',
        icon: true,
        text: '确定删除此图片广告吗？'
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
/deep/.el-form-item__label{
  text-align: left;
}
ul.template_type{
  li{
    width: 85px!important;
    height: 100px90px!important;
    border: 1px solid #e4e3eb;
    padding: 10px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 18px!important;
    cursor: pointer;
    font-size:12px;
    &.active{
      border:1px solid $globalMainColor;
    }
    p{
      margin-top:6px;
      text-align:center;
      line-height: 1;
      color:rgba(110,110,114,1);
      white-space: nowrap;
      text-indent: -4px;
    }
    .type{
      height: 53px;
      display: flex;
      align-items: center;
      img{
        width:100%;
      }
    }
    .type2{
      // display: flex;
      // justify-content: center;
      // align-items: center;
      // width: 100%;
      // height: calc(100% - 36px);
    }
  }
}

.item_list{
  margin-top:20px;
  li{
    display:flex;
    flex-direction: row;
    justify-content: flex-start;
    margin-bottom:20px;
    position:relative;
    .left{
      margin-right:20px;
    }
    .right{
      display: flex;
      flex-direction: column;
      justify-content: center;
      p{
        span{

        }
        .el-input{
          width: 130px;
          display: inline-block;
        }
      }
    }
    i.delete_btn{
      width:20px;
      height:20px;
      border-radius:50%;
      background:url('../../../assets/images/shop/editor/delete.png') no-repeat 0 0;
      position:absolute;
      top: -6px;
      right: -10px;
      cursor:pointer;
    }
  }
}
</style>
