/* 小程序导航编辑 */
<template>
   <div class="group-wrapper">

      <!-- 预览区 -->
      <div class="module view" ref="groupWrapper">

        <!-- 手机头部 -->
        <div class="phone-head">
          <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt />
          <span>页面标题</span>
        </div>

        <!-- 手机中部 -->
        <div class="phone-body" :style="bodyHeight">
          <img :src="require('@/assets/images/shop/shopNav.png')" alt="">
        </div>

        <!-- 手机底部 小程序-->
        <div class="phone-footer" :style="{backgroundColor: ruleForm.backgroundColor}">
          <ul class="navs type1">
            <li
              v-for="(item, key) of ruleForm.navIds"
              :class="{'active': ruleForm.navMap[item].active}"
              :key="key"
              @click="selectNav(item)">
              <img :src="ruleForm.navMap[item].active? (ruleForm.navMap[item].navIconActive || defaultActiveImg(ruleForm.navMap[item])): (ruleForm.navMap[item].navIcon || defaultImg(ruleForm.navMap[item]))" alt="">
              <span v-if="ruleForm.navMap[item].active" :style="{color: ruleForm.activeColor}">{{ruleForm.navMap[item].navName}}</span>
              <span v-else :style="{color: ruleForm.unactiveColor}">{{ruleForm.navMap[item].navName}}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 右侧属性区 -->
      <div class="module props">
        <el-form :model="currentNav" :rules="rules" ref="ruleForm" label-width="90px" class="demo-ruleForm" :style="propsHeight">
          <div class="block header">
            <p class="title">导航设置</p>
          </div>
          <div class="block form">
            <el-form-item label="导航名称" prop="navName">
              <el-input @input="setNavName" :value="currentNav.navName" placeholder="请输入导航名称(请勿超过4个汉字或8个字母)"></el-input>
            </el-form-item>
            <el-form-item label="导航图标" prop="">
              <div class="upload_img_list">
                <div class="img_block">
                  <p>选中</p>
                  <div class="img_preview" v-if="currentNav.navIconActive">
                    <img :src="currentNav.navIconActive" alt="">
                    <span @click="currentImg='active';dialogVisible=true; currentDialog='dialogSelectImageMaterial'">修改</span>
                  </div>
                  <div class="add_button" v-if="!currentNav.navIconActive" @click="currentImg='active';dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
                    <i class="inner"></i>
                  </div>
                </div>
                <div class="img_block">
                  <p>未选中</p>
                  <div class="img_preview" v-if="currentNav.navIcon">
                    <img :src="currentNav.navIcon" alt="">
                    <span @click="currentImg='normal';dialogVisible=true; currentDialog='dialogSelectImageMaterial'">修改</span>
                  </div>
                  <div class="add_button" v-if="!currentNav.navIcon" @click="currentImg='normal';dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
                    <i class="inner"></i>
                  </div>
                </div>
              </div>
              建议尺寸：750*370，尺寸不匹配时，图片将被压缩或拉伸以铺满四周
            </el-form-item>
          </div>

          <div class="block header">
            <p class="title">导航样式设置</p>
            <p class="state"></p>
          </div>
          <div class="block form">
            <el-form-item label="背景颜色" prop="backgroundColor">
              <div class="color_block">
                <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
                <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="#fff"></colorPicker >
                <!-- <el-button type="text">重置</el-button> -->
              </div>
            </el-form-item>
            <el-form-item label="选中文字颜色" prop="activeColor">
              <div class="color_block">
                <el-input v-model="ruleForm.activeColor" :disabled="true"></el-input>
                <colorPicker  v-model="ruleForm.activeColor" defaultColor="#000"></colorPicker >
                <!-- <el-button type="text">重置</el-button> -->
              </div>
            </el-form-item>
            <el-form-item label="未选中文字颜色" prop="unactiveColor">
              <div class="color_block">
                <el-input v-model="ruleForm.unactiveColor" :disabled="true"></el-input>
                <colorPicker  v-model="ruleForm.unactiveColor" defaultColor="#ddd"></colorPicker >
                <!-- <el-button type="text">重置</el-button> -->
              </div>
            </el-form-item>
          </div>

          <div class="block button">
            <div class="help_blank"></div>
            <div class="buttons">
              <el-button @click="resetData" :loading="resetDataLoading">重    置</el-button>
              <el-button @click="save" :loading="saveLoading">保    存</el-button>
              <el-button @click="saveAndApply" type="primary" :loading="saveAndApplyLoading">保存并启用</el-button>
            </div>
          </div>

        </el-form>
      </div>
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected"></component>
    </div>
</template>

<script>
import dialogSelectImageMaterial from '../../dialogs/dialogSelectImageMaterial';
import utils from "@/utils";
import uuid from 'uuid/v4';
export default {
  name: 'apiNavData',
  props: ['apiNavData'],
  components: {dialogSelectImageMaterial},
  data () {
    let validLength = (RULE, value, callback) => {
      let regExp = /^([A-z]{1,8}|[\u4e00-\u9fa5]{1,4})$/;
      if (regExp.test(value) === false) {
          callback(new Error('请输入4个汉字或8个字母'));
      } else {
          callback();
      }
    };
    return {
      resetDataLoading: false,  //重置loading
      saveLoading: false,  //保存loading
      saveAndApplyLoading: false,  //保存并应用loading
      dialogVisible: false,
      currentDialog: '',
      utils,
      ruleForm: {
        navIds: [],
        navMap: {},
        backgroundColor: '#fff',
        activeColor: '#000',
        unactiveColor: '#ddd'
      },
      rules: {
        navName: [
          { required: true, message: "请输入导航名称", trigger: "blur" },
          {
            validator: validLength, trigger: 'blur'
          }
        ]
      },
      currentNav: null,  //当前导航对象
      currentImg: 'active',  //当前上传图片类型   高亮和普通
      bodyHeight: {},  //内容区高度
      propsHeight: {},  //属性区高度
      seletedData: null  //临时选中的页面
    }
  },
  watch: {
    currentNav: {
      handler(newValue) {
        if(this.ruleForm.navMap[newValue.id]) {
          this.ruleForm.navMap[newValue.id] = newValue;
        }
      },
      depp: true
    },
    apiNavData: {
      handler(newValue) {
        if(newValue) {
          this.ruleForm = newValue;
        }
      },
      deep:true
    }
  },
  created() {
    this._globalEvent.$on('apiNavDataChange', (data, navType)=> {
      if(navType === '1') {
        this.ruleForm = data;
        this.selectNav(data.navIds[0]);
      }
    })
    this.initnavMap();
  },
  mounted() {
    this.bodyHeight = {
      height: document.body.clientHeight - 364 + 'px'
    },
    this.propsHeight = {
      height: document.body.clientHeight - 364 + 'px'
    }
  },
  methods: {

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(this.currentImg === 'active') {
        this.currentNav.navIconActive = dialogData.filePath;
      }else if(this.currentImg === 'normal') {
        this.currentNav.navIcon = dialogData.filePath;
      }
    },

    /* 初始化导航列表 */
    initnavMap() {
       let indexNav = this.createNav({
        navName: '首页',
        navIcon: require(`@/assets/images/navIcon1.png`),
        navIconActive: require(`@/assets/images/navIcon1Active.png`),
      });
      this.ruleForm.navIds.push(indexNav.id);
      this.ruleForm.navMap[indexNav.id] = indexNav;

      
      let classifyNav = this.createNav({
        navName: '分类',
        navIcon: require(`@/assets/images/navIcon2.png`),
        navIconActive: require(`@/assets/images/navIcon2Active.png`),
      });
      this.ruleForm.navIds.push(classifyNav.id);
      this.ruleForm.navMap[classifyNav.id] = classifyNav;

      let shoppingCartNav = this.createNav({
        navName: '购物车',
        navIcon: require(`@/assets/images/navIcon3.png`),
        navIconActive: require(`@/assets/images/navIcon3Active.png`),
      });
      this.ruleForm.navIds.push(shoppingCartNav.id);
      this.ruleForm.navMap[shoppingCartNav.id] = shoppingCartNav;

      let mineNav = this.createNav({
        navName: '我的',
        navIcon: require(`@/assets/images/navIcon4.png`),
        navIconActive: require(`@/assets/images/navIcon4Active.png`),
      });
      this.ruleForm.navIds.push(mineNav.id);
      this.ruleForm.navMap[mineNav.id] = mineNav;

      this.selectNav(this.ruleForm.navIds[0]);
    },

    /* 创建导航 */
    createNav(params) {
      return {
        id: uuid(),
        navName: params && params.navName || '导航',
        navIcon: params && params.navIcon || '',
        navIconActive: params && params.navIconActive || '',
        navLinkType: 1,
        systemNavLinkUrl: '1',
        customNavLinkUrl: '',
        active: false
      };
    },

    /* 选中一个导航来编辑 */
    selectNav(id) {
      this.currentNav = this.ruleForm.navMap[id];
      let curentActiveNav = null;
      for(let k in this.ruleForm.navMap) {
        if(this.ruleForm.navMap[k].active) {
          curentActiveNav = this.ruleForm.navMap[k];
        }
      }
      if(curentActiveNav){
        this.$set(curentActiveNav, 'active', false);
      }
      this.$set(this.ruleForm.navMap[id], 'active', true);
    },

    /* 保存并启用 */
    saveAndApply() {
      this.$refs.ruleForm.validate( valid => {
        if(valid) {
          this.saveAndApplyLoading = true;
          this.$emit('submitNavData',{
            navigationKey: '',
            status: '0',
            navigation_type: '1',
            navigation_json: utils.compileStr(JSON.stringify(this.ruleForm))
          }, (status) => {
            this.saveAndApplyLoading = false;
          })
        }
      })
    },

    /* 保存 */
    save() {
       this.$refs.ruleForm.validate( valid => {
        if(valid) {
          this.saveLoading = true;
          this.$emit('submitNavData', {
            navigationKey: '',
            status: '1',
            navigation_type: '1',
            navigation_json: utils.compileStr(JSON.stringify(this.ruleForm))
          }, (status) => {
            this.saveLoading = false;
          })
        }
      })
    },

      /* 重置 */
    resetData() {
      this.resetDataLoading = true;
      this.$emit('resetNavData', {
        navigation_type: '1'
      }, (status) => {
        this.resetDataLoading = false;
      })
    },

    // 设置名称
    setNavName(name) {
      let isName = this.isRepeatName(name);
      if (isName) {
        this.$message({ message: '导航名称请勿重复', type: 'warning' });
      } else {
        this.currentNav.navName = name;
      }
    },

    // 是否重复
    isRepeatName(name) {
      let result  = false;
      let navMaps = this.ruleForm.navMap;
      if (name) {
        for (let key in navMaps) {
          const item = navMaps[key];
          if (item.navName == name) {
            result = true;
            break;
          }
        }
      }
      return result;
    }
  },

  beforeDestroy() {
      //组件销毁前需要解绑事件。否则会出现重复触发事件的问题
      // this._globalEvent.$off('apiNavDataChange');
  },
}
</script>

<style lang="scss" scoped>
.group-wrapper{
  display:flex;
  flex-direction: row;
  .content {
    padding: 10px 0 0 10px;
    box-sizing: border-box;
    width: 100%;
    .wrapper {
      background: #fff;
      margin-bottom: 10px;
      p {
        background: rgba(247, 247, 247, 1);
        padding: 10px;
        margin-bottom: 20px;
      }
      ul.group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        li {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-bottom: 20px;
          cursor:pointer;
          img {
            width: 65px;
            height: 65px;
          }
          span {
            margin-top: 20px;
          }
        }
      }
    }
  }
}
.module {
  &.view {
    .phone-body {
      .component_wrapper{
        cursor:text;
      }
    }
    .phone-footer{
      min-height:50px;
      background:#fff;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      ul.navs{
        display:flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        li{
          cursor:pointer;
          border:2px solid transparent;
          padding:0 10px;
          &.active{
            border:2px dashed $globalMainColor;
          }
        }
        &.type1{
          justify-content: space-around;
          padding: 5px 0;
          li{
            display:flex;
            flex-direction: column;
            align-items: center;
            img{
              width:24px;
              height:24px;
              object-fit: cover;
              background:#D8D8D8;
              display:block;
            }
            span{
              margin-top:5px;
              text-align:center;
              font-size:12px;
            }
          }
        }
        &.type2{
          justify-content: space-around;
          padding: 10px 0;
          li{
            img{
              width:30px;
              height:30px;
              object-fit: cover;
              background:#D8D8D8;
              display:block;
            }
          }
        }
        &.type3{
          height:50px;
          .keyboard{
            width:50px;
            height:50px;
            border-right:1px solid #ddd;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            i{
              font-size:30px;
            }
          }
          li{
            padding:0;
            border-right:1px solid #ddd;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            &:last-child{
              border-right:0;
            }
            &.active{
              border:2px dashed $globalMainColor;
            }
            i{
              width:5px;
              height:10px;
              margin-right: 5px;
            }
            span{
              margin-left: 5px;
              margin-top: 2px;
            }
          }
        }
        &.type4{

        }
      }
      .add_btn{
        width:50px;
        border-left:1px solid #eee;
        display:flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        cursor:pointer;
        i{
          font-size:29px;
          color:rgba(216,216,216,1);
          &:hover{
            color:$globalMainColor;
          }
        }
      }
    }
  }
  &.props{
    .block{
      .upload_img_list{
        display:flex;
        flex-direction: row;
        .img_block{
          margin-right:10px;
          .img_preview{
            width:50px;
            height:50px;
            span{
              font-size:12px;
            }
          }
          .add_button{
            width:50px;
            height:50px;
          }
        }
      }
    }
  }
}

.el-radio-group{
  margin-top: 9px;
  .el-radio {
      margin-bottom: 10px;
      margin-right: 10px;
  }
}
.el-checkbox-group{
  .el-checkbox{
    margin-right: 10px;
  }
}
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
