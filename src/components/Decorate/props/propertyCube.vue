<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="选择模板" prop="templateType">
      </el-form-item>
      <ul class="tile-list n3 cube template_type">
        <li @click="selectTemplate(1)" :class="{'active': ruleForm.templateType === 1}">
          <div class="type type1">
            <div class="fill_block"></div>
            <div class="fill_block"></div>
          </div>
          <p>1行2个</p>
        </li>
        <li @click="selectTemplate(2)" :class="{'active': ruleForm.templateType === 2}">
          <div class="type type2">
            <div class="fill_block"></div>
            <div class="fill_block"></div>
            <div class="fill_block"></div>
          </div>
          <p>1行3个</p>
        </li>
        <li @click="selectTemplate(3)" :class="{'active': ruleForm.templateType === 3}">
          <div class="type type3">
            <div class="fill_block"></div>
            <div class="fill_block"></div>
            <div class="fill_block"></div>
            <div class="fill_block"></div>
          </div>
          <p>1行4个</p>
        </li>
        <li @click="selectTemplate(4)" :class="{'active': ruleForm.templateType === 4}">
          <div class="type type4">
            <div class="fill_block"></div>
            <div class="fill_block"></div>
            <div class="fill_block"></div>
            <div class="fill_block"></div>
          </div>
          <p>2左2右</p>
        </li>
        <li @click="selectTemplate(5)" :class="{'active': ruleForm.templateType === 5}">
          <div class="type type5">
            <div class="fill_block fill_block1"></div>
            <div class="fill_block fill_block2">
              <div class="fill_block fill_block3"></div>
              <div class="fill_block fill_block4"></div>
            </div>
          </div>
          <p>1左2右</p>
        </li>
        <li @click="selectTemplate(6)" :class="{'active': ruleForm.templateType === 6}">
          <div class="type type6">
            <div class="fill_block fill_block1"></div>
            <div class="fill_block fill_block2">
              <div class="fill_block fill_block3"></div>
              <div class="fill_block fill_block4"></div>
            </div>
          </div>
          <p>1上2下</p>
        </li>
        <li @click="selectTemplate(7)" :class="{'active': ruleForm.templateType === 7}">
          <div class="type type7">
            <div class="fill_block fill_block1"></div>
            <div class="fill_block fill_block2">
              <div class="fill_block fill_block3"></div>
              <div class="fill_block fill_block4">
                <div class="fill_block fill_block5"></div>
                <div class="fill_block fill_block6"></div>
              </div>
            </div>
          </div>
          <p>1左3右</p>
        </li>
      </ul>
      <el-form-item label="布局" prop="layout">
      </el-form-item>
      <div class="layout">
        <ul class="cube layout_wrapper">
          <li v-if="ruleForm.templateType === 1">
            <div class="type type1">
              <div class="fill_block"  @click="selectLayout(1,1)" :class="{'active': ruleForm.templateType === 1 && blockType === 1}">
                <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(1,2)" :class="{'active': ruleForm.templateType === 1 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 2">
            <div class="type type2">
              <div class="fill_block"  @click="selectLayout(2,1)" :class="{'active': ruleForm.templateType === 2 && blockType === 1}">
                  <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(2,2)" :class="{'active': ruleForm.templateType === 2 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(2,3)" :class="{'active': ruleForm.templateType === 2 && blockType === 3}">
                  <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 3">
            <div class="type type3">
              <div class="fill_block"  @click="selectLayout(3,1)" :class="{'active': ruleForm.templateType === 3 && blockType === 1}">
                  <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(3,2)" :class="{'active': ruleForm.templateType === 3 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(3,3)" :class="{'active': ruleForm.templateType === 3 && blockType === 3}">
                  <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(3,4)" :class="{'active': ruleForm.templateType === 3 && blockType === 4}">
                  <img v-if="ruleForm.list['4']" :src="ruleForm.list['4'].url" alt="">
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 4">
            <div class="type type4">
              <div class="fill_block"  @click="selectLayout(4,1)" :class="{'active': ruleForm.templateType === 4 && blockType === 1}">
                  <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(4,2)" :class="{'active': ruleForm.templateType === 4 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(4,3)" :class="{'active': ruleForm.templateType === 4 && blockType === 3}">
                  <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
              </div>
              <div class="fill_block"  @click="selectLayout(4,4)" :class="{'active': ruleForm.templateType === 4 && blockType === 4}">
                  <img v-if="ruleForm.list['4']" :src="ruleForm.list['4'].url" alt="">
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 5">
            <div class="type type5">
              <div class="fill_block fill_block1"  @click="selectLayout(5,1)" :class="{'active': ruleForm.templateType === 5 && blockType === 1}">
                <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2">
                <div class="fill_block fill_block3"  @click="selectLayout(5,2)" :class="{'active': ruleForm.templateType === 5 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4"  @click="selectLayout(5,3)" :class="{'active': ruleForm.templateType === 5 && blockType === 3}">
                  <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
                </div>
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 6">
            <div class="type type6">
              <div class="fill_block fill_block1"  @click="selectLayout(6,1)" :class="{'active': ruleForm.templateType === 6 && blockType === 1}">
                <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2">
                <div class="fill_block fill_block3"  @click="selectLayout(6,2)" :class="{'active': ruleForm.templateType === 6 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4"  @click="selectLayout(6,3)" :class="{'active': ruleForm.templateType === 6 && blockType === 3}">
                  <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
                </div>
              </div>
            </div>
          </li>
          <li v-if="ruleForm.templateType === 7">
            <div class="type type7">
              <div class="fill_block fill_block1"  @click="selectLayout(7,1)" :class="{'active': ruleForm.templateType === 7 && blockType === 1}">
                <img v-if="ruleForm.list['1']" :src="ruleForm.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2">
                <div class="fill_block fill_block3"  @click="selectLayout(7,2)" :class="{'active': ruleForm.templateType === 7 && blockType === 2}">
                  <img v-if="ruleForm.list['2']" :src="ruleForm.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4">
                  <div class="fill_block fill_block5"  @click="selectLayout(7,3)" :class="{'active': ruleForm.templateType === 7 && blockType === 3}">
                    <img v-if="ruleForm.list['3']" :src="ruleForm.list['3'].url" alt="">
                  </div>
                  <div class="fill_block fill_block6"  @click="selectLayout(7,4)" :class="{'active': ruleForm.templateType === 7 && blockType === 4}">
                    <img v-if="ruleForm.list['4']" :src="ruleForm.list['4'].url" alt="">
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <p>选定布局区域，在下方添加图片，建议添加比例一致的图片</p>
      </div>
      <el-form-item label="图片间隙" prop="imgMargin">
        <div class="slider-wrapper">
          <el-slider v-model="ruleForm.imgMargin" :min="0" :max="30"></el-slider>
          <span>{{ruleForm.imgMargin}}像素</span>
        </div>
      </el-form-item>
      <el-form-item label="页面间距" prop="pagePadding">
        <div class="slider-wrapper">
          <el-slider v-model="ruleForm.pagePadding" :min="0" :max="30"></el-slider>
          <span>{{ruleForm.pagePadding}}像素</span>
        </div>
      </el-form-item>
      <el-form-item label="添加图片" prop="">
        <div v-if="ruleForm.list[this.blockType] && ruleForm.list[this.blockType].url" class="img_preview">
          <img :src="ruleForm.list[this.blockType].url" alt="">
          <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
        </div>
        <div v-else class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
          <i class="inner"></i>
        </div>
      </el-form-item>
      <el-form-item label="跳转链接" prop="pageLink">
        <el-button 
        type="text" 
        @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'" 
        :title="ruleForm.list[this.blockType] && ruleForm.list[this.blockType].linkTo ? ruleForm.list[this.blockType].linkTo.typeName + '-' + (ruleForm.list[this.blockType].linkTo.data.title || ruleForm.list[this.blockType].linkTo.data.name) : '选择跳转到的页面'">
        {{ruleForm.list[this.blockType] && ruleForm.list[this.blockType].linkTo ? ruleForm.list[this.blockType].linkTo.typeName + '-' + (ruleForm.list[this.blockType].linkTo.data.title || ruleForm.list[this.blockType].linkTo.data.name) : '选择跳转到的页面'}}
        </el-button>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
  </el-form>
</template>

<script>
import propertyMixin from '../mixins/mixinProps';
import dialogSelectJumpPage from '@/views/shop/dialogs/dialogSelectJumpPage';
import dialogSelectImageMaterial from '@/views/shop/dialogs/dialogSelectImageMaterial';
export default {
  name: 'propertyCube',
  mixins: [propertyMixin],
  components: {dialogSelectJumpPage, dialogSelectImageMaterial},
  data () {
    return {
      ruleForm: {
        templateType: 1,//模板类型
        imgMargin: 2,//图片间隙
        pagePadding:0,//页面间距
        list: {}//魔方列表
      },
      rules: {},
      dialogVisible: false,
      currentDialog: '',
      blockType: 1 //块类型
    }
  },
  methods: {

    /* 选中模板 */
    selectTemplate(templateType) {
      this.ruleForm.templateType = templateType;
      this.blockType = 1;
    },
  
    /* 选中具体布局中的一块 */
    selectLayout(templateType, blockType) {
      this.ruleForm.templateType = templateType;
      this.blockType = blockType;
    },

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(!this.ruleForm.list[this.blockType]) {
        this.ruleForm.list[this.blockType] = {};
      }
      this.ruleForm.list[this.blockType]['url'] = dialogData.filePath;
      const tempRuleForm = {...this.ruleForm};
      this.ruleForm = tempRuleForm;
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      if(!this.ruleForm.list[this.blockType]) {
        this.ruleForm.list[this.blockType] = {};
      }
      this.ruleForm.list[this.blockType]['linkTo'] = linkTo;
      const tempRuleForm = {...this.ruleForm};
      this.ruleForm = tempRuleForm;
    },
  }
}
</script>

<style lang="scss" scoped>
/* 魔方样式混入了decorate.scss中的公共魔方样式 */
/deep/.el-form-item__label{
  text-align: left;
}
ul.cube.template_type{
  li{
    border:1px solid rgb(228,227,235);
    padding:10px;
    cursor:pointer;
    margin-right: 18px;
    width: 90px;
    &:nth-child(3n){
      margin-right: 0;
    }
    .type{
       height:54px;
    }
    &.active{
      border:2px dashed $globalMainColor;
    }
    p{
      margin-top:6px;
      text-align:center;
      line-height: 1;
      color:rgba(110,110,114,1);
    }
  }
}
.layout{
  ul.cube.layout_wrapper{
    li{
      .type{
          height:150px;
      }
      .fill_block{
        cursor:pointer;
        &.active{
          border:2px dashed $globalMainColor;
        }
      }
      p{
        margin-top:6px;
        text-align:center;
      }
    }
  }
  p{
    color:rgba(211,211,211,1);
    margin-top:5px;
    margin-bottom: 20px;
  }
}

</style>
