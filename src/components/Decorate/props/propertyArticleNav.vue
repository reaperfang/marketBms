<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px" :style="bodyHeight">
    <div class="block form">
      <el-form-item label="选择模板" prop="templateType">
        <ul class="tile-list n3 template_type">
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
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="#000"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
    </div>
    <div class="block form">
      添加导航
      <ul class="item_list">
        <li v-for="(item, key) of ruleForm.itemList" :key="key">
          <div class="left" v-if="ruleForm.templateType === 1">
            <div v-if="item.url" class="img_preview">
              <img :src="item.url" alt="">
              <span @click="dialogVisible=true; currentNav=item; currentDialog='dialogSelectImageMaterial'">更换图片</span>
            </div>
            <div v-else class="add_button" @click="dialogVisible=true; currentNav=item; currentDialog='dialogSelectImageMaterial'">
              <i class="inner"></i>
            </div>
          </div>
          <div class="right">
            <p>
              <span v-if="ruleForm.templateType === 1">图片标题</span>
              <span v-else-if="ruleForm.templateType === 2">导航文字</span>
              <el-input v-model="item.title"></el-input>
            </p>
            <p>
              <el-button 
              type="text" 
              @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'" 
              :title="item.linkTo ?  item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name) : '选择跳转到的页面'">
              {{item.linkTo ?  item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name) : '选择跳转到的页面'}}
              </el-button>
            </p>
          </div>
          <i class="delete_btn" @click.stop="deleteItem(item)" title="移除"></i>
        </li>
      </ul>
      <el-button type="info" plain style="width:100%" @click="addNav">添加一个图文</el-button>
      <p style="margin-top:10px;color:rgb(211,211,211)">最多添加 10 个导航</p>
      <!-- <p style="margin-top:10px;color:rgb(211,211,211)">最多添加 10 个导航，拖动选中的导航可对其排序小程序 v2.3.1 及以上版本支持</p> -->
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
  name: 'propertyArticleNav',
  mixins: [propertyMixin],
  components: {dialogSelectJumpPage, dialogSelectImageMaterial},
  data () {
    return {
      ruleForm: {
        templateType: 1,//模板类型
        slideType: 1,//滑动类型
        backgroundColor: '#fff',//背景颜色
        fontColor: '#000',//文字颜色
        itemList: [{//图文列表
          title: '导航',
          url: '',
          linkTo: null
        }],
      },
      rules: {},
      currentNav: null,  //当前操作的图文导航
      dialogVisible: false,
      currentDialog: '',
    }
  },
  methods: {
    selectTemplate(templateType) {
      this.ruleForm.templateType = templateType;
      this.blockType = 1;
    },

    addNav() {
      if(this.ruleForm.itemList.length <10) {
        this.ruleForm.itemList.push({
          title: '导航',
          url: '',
          linkTo: null
        });
        this.currentNav = this.ruleForm.itemList[this.ruleForm.itemList.length - 1];
        // this.dialogVisible=true; 
        // this.currentDialog='dialogSelectImageMaterial';
      }
    },

    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.currentNav.title= dialogData.fileName,
      this.currentNav.url= dialogData.filePath;
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.currentNav.linkTo = linkTo;
    },

    deleteItem(item) {
      if(this.ruleForm.itemList.length < 2) {
        this.$notify.warning({
            title: '警告',
            message: '最后一个不允许删除'
        });
        return;           
      }
      this.$confirm(`确定删除此图片广告吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempItems = [...this.ruleForm.itemList];
        for(let i=0;i<tempItems.length;i++) {
          if(item === tempItems[i]) {
            tempItems.splice(i, 1);
          }
        }
        this.ruleForm.itemList = tempItems;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul.template_type{
  li{
    width:100px;
    // height:100px;
    border:1px solid rgb(228,227,235);
    padding:10px;
    box-sizing: border-box;
    cursor:pointer;
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
    }
  }
}

ul.item_list{
  margin-top:20px;
  li{
    display:flex;
    flex-direction: row;
    justify-content: space-between;
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
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
