/* H5导航编辑 */
<template>
   <div class="group-wrapper">

      <!-- 预览区 -->
      <div class="module view" ref="groupWrapper" v-calcHeight="314">

        <!-- 手机头部 -->
        <div class="phone-head">
          <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt />
          <span>页面标题</span>
        </div>

        <!-- 手机中部 -->
        <div class="phone-body" v-calcHeight="442">
          <img :src="require('@/assets/images/shop/shopNav.png')" alt="">
        </div>

        <!-- 手机底部 H5-->
        <div class="phone-footer">
          <ul class="navs type1" v-if="ruleForm.navStyle.id == 1">
            <li v-for="(item, key) of ruleForm.navIds" v-dragging="{ item: item, list: ruleForm.navIds, group: 'id'}" :class="{'active': ruleForm.navMap[item].active}" :key="key" @click="selectNav(item)">
              <img v-if="ruleForm.navMap[item].active && ruleForm.navMap[item].navIconActive" :src="ruleForm.navMap[item].navIconActive" />
              <img v-else-if="!ruleForm.navMap[item].active && ruleForm.navMap[item].navIcon" :src="ruleForm.navMap[item].navIcon" />
              <div v-else class="empty_img"></div>
              <span>{{ruleForm.navMap[item].navName}}</span>
            </li>
          </ul>
          <ul class="navs type2" v-if="ruleForm.navStyle.id == 2">
            <li v-for="(item, key) of ruleForm.navIds" v-dragging="{ item: item, list: ruleForm.navIds, group: 'id'}" :class="{'active': ruleForm.navMap[item].active}" :key="key" @click="selectNav(item)">
              <img v-if="ruleForm.navMap[item].active && ruleForm.navMap[item].navIconActive" :src="ruleForm.navMap[item].navIconActive" />
              <img v-else-if="!ruleForm.navMap[item].active && ruleForm.navMap[item].navIcon" :src="ruleForm.navMap[item].navIcon" />
              <div v-else class="empty_img"></div>
            </li>
          </ul>
          <ul class="navs type3" v-if="ruleForm.navStyle.id == 3">
            <div class="keyboard">
              <i class="el-icon-platform-eleme"></i>
            </div>
            <li v-for="(item, key) of ruleForm.navIds" v-dragging="{ item: item, list: ruleForm.navIds, group: 'id'}" :class="{'active': ruleForm.navMap[item].active}" :key="key" @click="selectNav(item)">
              <i class="el-icon-notebook-2"></i>
              <span>{{ruleForm.navMap[item].navName}}</span>
            </li>
          </ul>
          <!-- <ul class="navs type4" v-if="ruleForm.navStyle.id == 4">
            <li @click="addNav">
              <span>
                <i class="el-icon-plus"></i>
              </span>
            </li>
            <li v-for="(item, key) of ruleForm.navIds" v-dragging="{ item: item, list: ruleForm.navIds, group: 'id'}" :class="{'active': ruleForm.navMap[item].active}" :key="key" @click="selectNav(item)">
              <img v-if="ruleForm.navMap[item].navIconActive || ruleForm.navMap[item].navIcon" :src="ruleForm.navMap[item].active? ruleForm.navMap[item].navIconActive: ruleForm.navMap[item].navIcon" alt="">
              <img src="" alt="" class="empty_img" v-else>
            </li>
          </ul> -->

          <div class="add_btn" @click="addNav" v-if="ruleForm.navStyle.id != 4">
            <i class="el-icon-plus"></i>
          </div>
        </div>
      </div>

      <!-- 右侧属性区 -->
      <div class="module props">
        <div class="block header" style="border: 1px #D0D6E4 solid;">
            <p class="title">导航设置</p>
        </div>
        <el-form :model="currentNav" :rules="ruleForm.navStyle.id == 2 ? {} : rules" ref="ruleForm" label-width="90px" class="demo-ruleForm" v-calcHeight="470">
          <div class="block form" style="padding-top: 10px;">
            <div class="form-header clearfix">
              <span class="form-title">全局设置</span>
            </div>
            <el-form-item label="导航风格" prop="navStyle">
              <div class="nav_style_type">
                <span>{{ruleForm.navStyle.name || 'APP导航样式'}}</span>
                <el-button type="text" @click="dialogVisible=true; currentDialog='dialogSelectNavTemplate'">修改</el-button>
              </div>
            </el-form-item>
            <el-form-item label="应用页面" prop="applyPage">
              <el-checkbox-group v-model="ruleForm.applyPage">
                <el-checkbox label="1">主页</el-checkbox>
                <el-checkbox label="2">个人中心</el-checkbox>
                <el-checkbox label="3">商品搜索</el-checkbox>
                <el-checkbox label="4">商品分类</el-checkbox>
                <el-checkbox label="5">微页面及分类</el-checkbox>
                <el-checkbox label="6">购物车</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>

          <div class="block form" style="padding-top: 10px;">
            <div class="form-header clearfix">
              <span class="form-title">基础信息</span>
              <span class="form-state" @click="deleteNav" style="cursor:pointer;">删除导航</span>
            </div>
            <el-form-item label="导航名称" prop="navName" ref="navNameItem">
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
              <p class="nav_tips">建议尺寸：40*40像素，尺寸不匹配时，图片将被压缩或拉伸以铺满四周</p>
            </el-form-item>
            <!-- <el-form-item label="导航链接" prop="navLinkType" v-if="navigation_type === '0'">
              <el-radio-group v-model="currentNav.navLinkType">
                <el-radio :label="1">系统链接</el-radio>
                <el-radio :label="2">自定义链接</el-radio>
              </el-radio-group>
            </el-form-item> -->
            <el-form-item label="链接地址" prop="navLinkUrl" v-if="currentNav.navLinkType == 1">
              <el-select style="width:150px" v-model="currentNav.systemNavLinkUrl" placeholder="选择系统链接">
                  <el-option label="首页" value="1"></el-option>
                  <el-option label="购物车" value="2"></el-option>
                  <el-option label="个人中心" value="3"></el-option>
                  <el-option label="全部商品" value="4"></el-option>
                  <el-option label="全部分类" value="5"></el-option>
                  <!-- <el-option label="微信客服" value="6"></el-option> -->
                  <el-option label="微页面" value="7"></el-option>
                  <el-option label="微页面分类" value="8"></el-option>
                  <el-option label="指定商品" value="9"></el-option>
                  <el-option label="指定商品分类" value="10"></el-option>
                  <el-option label="营销活动" value="11"></el-option>
                </el-select>
                <el-button type="primary" @click="seleteOneLink" v-if="['7','8','9','10','11'].includes(currentNav.systemNavLinkUrl)">选择</el-button>
            </el-form-item>
            <el-form-item label="" prop="">
              <el-tag 
              type="success" 
              @close="deleteGoodsGroup()" 
              v-if="currentNav.linkTo" 
              class="nav_tag" 
              :title="currentNav.linkTo.typeName + ' - ' + (currentNav.linkTo.data.title || currentNav.linkTo.data.name)">
                {{'['+currentNav.linkTo.typeName + '] - ' + (currentNav.linkTo.data.title || currentNav.linkTo.data.name)}}
              </el-tag>
            </el-form-item>
          </div>


          <div class="block button">
            <div class="buttons">
              <el-button @click="resetData" :loading="resetDataLoading">重    置</el-button>
              <el-button @click="save" :loading="saveLoading">保    存</el-button>
              <el-button @click="saveAndApply" type="primary" :loading="saveAndApplyLoading">保存并启用</el-button>
            </div>
          </div>

        </el-form>
      </div>
      <!-- 动态弹窗 -->
      <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @navTypeSelected="navTypeSelected" :navStyleId="ruleForm.navStyle.id" :showSystemIcon="true"></component>

      <DialogBase :visible.sync="pageDialogVisible" width="816px" :title="currentPageName" @submit="seletePage">
        <component v-if="pageDialogVisible" :is="currentPageDialog" @seletedRow="rowSeleted"></component>
      </DialogBase>

    </div>
</template>

<script>
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
import dialogSelectNavTemplate from '@/views/shop/dialogs/decorateDialogs/dialogSelectNavTemplate';

import DialogBase from "@/components/DialogBase";
import microPage from "@/views/shop/dialogs/jumpLists/microPage";
import microPageClassify from "@/views/shop/dialogs/jumpLists/microPageClassify";
import marketCampaign from "@/views/shop/dialogs/jumpLists/marketCampaign";
import goods from "@/views/shop/dialogs/jumpLists/goods";
import goodsGroup from "@/views/shop/dialogs/jumpLists/goodsGroup";

import utils from "@/utils";

import store from '@/store';
let shopInfo = store.getters.shopInfos
const cid = shopInfo && shopInfo.id || ''
export default {
  name: 'shopNav',
  components: {dialogSelectImageMaterial, dialogSelectNavTemplate, DialogBase, microPage, microPageClassify, marketCampaign, goods, goodsGroup},
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
      pageDialogVisible: false,
      currentPageDialog: '',
      currentPageName: '',
      utils,
      ruleForm: {
        navStyle: {id: 1},  //系统-全局导航样式
        applyPage: ['1','2','3', '4', '5', '6'],  //系统-应用页面
        navIds: [],
        navMap: {}
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
    'currentNav.systemNavLinkUrl'(newValue) {
      switch(newValue) {
        case '1':
          this.currentNav.linkTo = {
            pageType: 'systemPage',
            typeName: '系统页面',
            id: 7,
            data: {
              id: 'index',
              name: 'index',
              title: '首页'
            },
            cid: cid
          };
          break;
        case '2':
          this.currentNav.linkTo = {
            pageType: 'systemPage',
            typeName: '系统页面',
            id: 7,
            data: {
              id: 'shoppingCart',
              name: 'shoppingCart',
              title: '购物车',
            },
            cid: cid
          };
          break;
        case '3':
          this.currentNav.linkTo = {
            pageType: 'systemPage',
            typeName: '系统页面',
            id: 7,
            data: {
              id: 'userCenter',
              name: 'userCenter',
              title: '个人中心',
            },
            cid: cid
          };
          break;
        case '4':
          this.currentNav.linkTo = {
            pageType: 'systemPage',
            typeName: '系统页面',
            id: 7,
            data: {
              id: 'allGoods',
              name: 'allGoods',
              title: '全部商品',
            },
            cid: cid
          };
          break;
        case '5':
          this.currentNav.linkTo = {
            pageType: 'systemPage',
            typeName: '系统页面',
            id: 7,
            data: {
              id: 'allClassify',
              name: 'allClassify',
              title: '全部分类',
            },
            cid: cid
          };
          break;
      }
    }
  },
  created() {
    this._globalEvent.$on('apiNavDataChange', (data, navType)=> {
      if(navType === '0') {
        this.ruleForm = data;
        this.selectNav(data.navIds[0], true);
      }
    })
    this.initnavMap();
  },
  mounted() {
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

    /* 选中导航样式 */
    navTypeSelected(navType) {
      this.ruleForm.navStyle = navType;
      if(navType.id == 2){ //如果选中的是APP导航样式2，则隐藏导航名称的错误验证信息
        this.$refs.navNameItem.clearValidate();
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
        id: uuidv4(),
        navName: params && params.navName || '导航',
        navIcon: params && params.navIcon || '',
        navIconActive: params && params.navIconActive || '',
        navLinkType: 1,
        systemNavLinkUrl: '1',
        customNavLinkUrl: '',
        active: false,
        linkTo: {
          pageType: 'systemPage',
          id: 7,
          data: {
            id: 'index',
            name: 'index',
            title: '首页'
          },
          cid: cid
        }
      };
    },

    /* 选中一个导航来编辑 */
    selectNav(id, first) {
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

      if(!first){ //如果是手动点击触发则执行验证
        this.$nextTick(() => {
          this.$refs['ruleForm'].validate();
        })
      }
    },

    /* 添加一个新导航 */
    addNav() {
      if(this.ruleForm.navIds.length < 5) {
        let navObj = this.createNav();
        this.ruleForm.navIds.push(navObj.id);
        this.ruleForm.navMap[navObj.id] = navObj;
        this.selectNav(navObj.id);
      }
    },

    /* 删除当前导航 */
    deleteNav() {
      if(this.ruleForm.navIds.length <= 2) {
        return;
      }
      const id = this.currentNav.id;
      const index = this.ruleForm.navIds.indexOf(id);

      //删除顺序列表中对应项
			const prevId = this.ruleForm.navIds[index - 1];
			const nextId = this.ruleForm.navIds[index + 1];
			if (nextId) {
				this.selectNav(nextId);
			} else if (prevId) {
				this.selectNav(prevId);
			}

      if(index > -1) {
        this.ruleForm.navIds.splice(index, 1);
      }
      if(this.ruleForm.navMap[id]) {
        delete this.ruleForm.navMap[id];
      }
    },

    //循环验证是否有未填写的导航名称
    validateNavName() {
      let mark = false;
      const data = this.checkIcon();
      //如果APP导航样式必须有导航名称，则循环验证
      if(data.navStyle.id != 2){
        for(let i = 0; i < data.navIds.length; i++){
          if(data.navMap[data.navIds[i]].navName == ''){
            mark = true;
            this.selectNav(data.navIds[i]);
            break;
          }
        }
      }
      return mark;
    },

    /* 保存并启用 */
    saveAndApply() {
      this.$refs.ruleForm.validate( valid => {
        if(valid) {

          const mark = this.validateNavName();
          if(mark){
            return;
          }

          this.saveAndApplyLoading = true;
          this.$emit('submitNavData',{
            navigationKey: '',
            status: '0',
            navigation_type: '0',
            navigation_json: utils.compileStr(JSON.stringify(this.checkIcon()))
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

          const mark = this.validateNavName();
          if(mark){
            return;
          }
        
          this.saveLoading = true;
          this.$emit('submitNavData', {
            navigationKey: '',
            status: '1',
            navigation_type: '0',
            navigation_json: utils.compileStr(JSON.stringify(this.checkIcon()))
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
        navigation_type: '0'
      }, (status) => {
        this.resetDataLoading = false;
      })
    },

    rowSeleted(row) {
      this.seletedData = row;
    },

     /* 弹窗选中了跳转链接 */
    seletePage() {
      const tempCurrentNav = {...this.currentNav};
      tempCurrentNav['linkTo'] = this.seletedData;
      this.currentNav = tempCurrentNav;
    },

    seleteOneLink() {
       switch(this.currentNav.systemNavLinkUrl) {
        case '7':
          this.currentPageDialog = 'microPage';
          this.currentPageName = '选择微页面';
          this.pageDialogVisible = true;
          break;
        case '8':
          this.currentPageDialog = 'microPageClassify';
          this.currentPageName = '选择微页面分类';
          this.pageDialogVisible = true;
          break;
        case '9':
          this.currentPageDialog = 'goods';
          this.currentPageName = '选择指定商品';
          this.pageDialogVisible = true;
          break;
        case '10':
          this.currentPageDialog = 'goodsGroup';
          this.currentPageName = '选择商品分类';
          this.pageDialogVisible = true;
          break;
        case '11':
          this.currentPageDialog = 'marketCampaign';
          this.currentPageName = '选择营销活动';
          this.pageDialogVisible = true;
          break;
      }
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
    },

    /* 检查图标 */
    checkIcon() {
      let copyData = {...this.ruleForm};
      for(let k in copyData.navMap) {
        for(let k2 in copyData.navMap[k]) {
          if(k2 === 'navIcon' || k2 === 'navIconActive') {
            if(this.utils.validate.isBase64(copyData.navMap[k][k2])) {
              copyData.navMap[k][k2] = '';
            }
          }
        }
      }
      return copyData;
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
  .module {
    &.view {
      width: 377px;
      border: 1px #D0D6E4 solid;
      box-shadow: none !important;
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
              display:block;
            }
            .empty_img{
              width:24px;
              height:24px;
              background:#D8D8D8;
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
              display:block;
            }
            .empty_img{
              width:30px;
              height:30px;
              background:#D8D8D8;
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
          justify-content: space-around;
          position: relative;
          height: 80px;
          li{
            width: 20px;
            height: 20px;
            padding: 1px;
            position: absolute;
            border-radius: 10px;
            background: #ddd;
            img{
              width: 100%;
              height: 100%;
              &.empty_img{
                background:#D8D8D8;
              }
            }
            &:nth-child(1){
              top:  27px;
              left: 10px;
              width:26px;
              height:26px;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              background:rgba(0,0,0,0.1);
              span{
                width:20px;
                height:20px;
                border-radius: 10px;
                padding: 1px;
                display: flex;
                justify-content: center;
                align-items: center;
                background:rgba(0,0,0,0.3);
              }
            }
            &:nth-child(2){
              top:  0px;
              left: 20px;
            }
            &:nth-child(3){
              top: 8px;
              left: 45px;
            }
            &:nth-child(4){
              top: 28px;
              left: 60px;
            }
            &:nth-child(5){
              top: 50px;
              left: 45px;
            }
            &:nth-child(6){
              bottom:  0;
              left: 20px;
            }
          }
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

      .nav_tag{
        padding: 0px 5px;
        width: 220px!important;
        overflow-x: hidden!important;
        text-overflow: ellipsis!important;
        white-space: nowrap!important;
        display: block!important;
        text-align: left!important;
      }
      .nav_style_type{
        width:100%;
        display:flex;
        span{
          display:inline-block;
          min-width: 100px;
          color:rgba(211,211,211,1);
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
//导航装修tips样式
.nav_tips{
  color:rgba(211,216,223,1);line-height:20px;margin-top:10px;
}
.form-header {
  padding-bottom: 20px;
}
.form-title {
  float: left;
  height: 20px;
  padding: 0 10px;
  line-height: 20px;
  margin-left: -20px;
  background:rgba(182,181,200,0.2);
  color: #44434B;
}
.form-state {
  float: right;
  color: #FD4C2B;
}
</style>
