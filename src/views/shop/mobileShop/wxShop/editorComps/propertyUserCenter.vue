/* 微信个人中心装修属性区 */
<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" v-calcHeight="303">
        <div class="block header">
          <p class="title">个人信息页设置</p>
          <p class="state" :class="{'normal': ruleForm.status === 0}">{{ruleForm.status === 0 ? '生效中' : '未生效'}}</p>
        </div>
        <div class="block form">
          <el-form-item label="背景图片" prop="backgroundImage" style="margin-bottom: 0;">
            <div class="img_preview" v-if="ruleForm.backgroundImage">
              <img :src="ruleForm.backgroundImage" alt="">
              <span @click="changeBackground">更换图片</span>
            </div>
            <div class="add_button" v-if="!ruleForm.backgroundImage" @click="changeBackground">
              <i class="inner"></i>
            </div>
            <span style="color:rgba(182,181,200,1);">建议尺寸 750*400 像素</span>
          </el-form-item>
          <el-form-item label="背景渐变" prop="backgroundGradients">
            <el-radio-group v-model="ruleForm.backgroundGradients">
              <el-radio :label="1">无渐变</el-radio>
              <el-radio :label="2">白色渐变</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="block form">
          <el-form-item label="头像位置" prop="avatarPosition">
             <el-radio-group v-model="ruleForm.avatarPosition">
              <el-radio :label="1">居左</el-radio>
              <el-radio :label="2">居中</el-radio>
              <el-radio :label="3">居右</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="个人昵称颜色" prop="nickColor">
            <div class="color_block">
              <el-input v-model="ruleForm.nickColor" :disabled="true"></el-input>
              <colorPicker  v-model="ruleForm.nickColor" defaultColor="#000000"></colorPicker >
              <!-- <el-button type="text">重置</el-button> -->
            </div>
          </el-form-item>
          <el-form-item label="会员栏样式" prop="memberColumeStyle">
             <el-radio-group v-model="ruleForm.memberColumeStyle">
              <el-radio :label="1">样式一</el-radio>
              <el-radio :label="2">样式二</el-radio>
              <el-radio :label="3">样式三</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>

        <div class="block form custom">
          <div class="add-btn-wrap" ref="customAddWrap">
            <div class="add-btn" :style="customAddStyle">
              <span @click="customAdd">添加自定义</span>
            </div>
          </div>
          <!-- v-if=" item.name =='commission'?isOpenResell==1&&pathname=='/bp/shop/m_wxShopIndex':(item.name !== 'integralMarket' && item.name !== 'messageCenter')"/  h5隐藏分销入口 -->
          <ul class="custom-list">
            <template v-for="(item, index) in ruleForm.moduleList">
              <li :key="index" v-if="item.title.includes('分销中心') ? isOpenResell==1 : (item.title !== '积分商城' && item.title !== '消息中心')">
                <div class="clearfix">
                  <el-checkbox @change="disabledChange(item.disabled, index)" v-if="!item.title.includes('自定义')" v-model="item.disabled" :true-label="2" :false-label="1"></el-checkbox>
                  <i v-else class="el-icon-delete" @click="deleteCustom(item, index)"></i>
                  <el-form-item
                    :ref="'customFormItem'+index"
                    class="custom-form"
                    :key="index"
                    :label="item.title"
                    label-width="72px"
                    :prop="'moduleList['+ index +'].titleValue'"
                    :rules="item.disabled === 2 ? [{ required: true, message: '请输入内容', trigger: 'blur' },{ min: 1, max: 10, message: '请输入1~10个字符',trigger: 'blur' }] : []">
                    <div class="module_block color_block" style="position:relative;">
                        <div class="custom-disabled" v-show="item.disabled === 1"></div>
                        <el-input :disabled="item.disabled === 1" v-model="item.titleValue" placeholder="请输入"></el-input>
                        <div class="img_preview">
                          <img :src="item.icon" alt="" title="点击更换">
                          <span @click="currentModule=item;dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换</span>
                        </div>
                        <colorPicker  v-model="item.color" defaultColor="#000"></colorPicker >
                        <div class="custom-do">
                          <div class="custom-center">
                            <span class="icon top" v-if="index != 0" @click="sortTop(item, index)"></span>
                            <span class="icon bottom" v-if="index != ruleForm.moduleList.length - 1" @click="sortBottom(item, index)"></span>
                          </div>
                        </div>
                        <!-- <el-button type="text">重置</el-button> -->
                    </div>
                  </el-form-item>
                </div>
                <div class="custom-link" v-if="item.title.includes('自定义')">
                  <div v-show="item.linkTo === null" class="el-form-item__error" style="left: 158px;top: 15px;">
                    请选择跳转页面
                  </div>
                  <span class="title">跳转链接</span>
                  <el-button
                  v-if="!item.linkTo"
                  type="text"
                  style="padding-top: 0;"
                  @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">选择跳转到的页面</el-button>
                  <div class="link_overview clearFix arrow" v-if="item.linkTo && item.linkTo.typeName">
                    <div class="cont l">
                      <span class="l" :title="item.linkTo.typeName + '-' + (item.linkTo.data.title || item.linkTo.data.name)">{{item.linkTo.typeName + ' | ' + (item.linkTo.data.title || item.linkTo.data.name)}}</span>
                      <i @click="removeLink(item, index)"></i>
                    </div>
                    <span class="modify r" @click="dialogVisible=true; currentNav = item; currentDialog='dialogSelectJumpPage'">修改</span>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </div>  

        <div class="block button">
          <div class="buttons">
            <el-button @click="resetLoading = true; resetData()" :loading="resetLoading">重    置</el-button>
            <el-button @click="userCenterSave()" :loading="saveDataLoading">保    存</el-button>
            <el-button type="primary" @click="userCenterSaveAndApply()" :loading="saveAndApplyDataLoading">保存并生效</el-button>
            <el-popover
              v-if="showPreviewCode"
              ref="popover2"
              placement="bottom"
              title=""
              style="margin-left:10px;"
              width="170"
              trigger="click"
              content="">
              <img v-if="showCode" :src="qrCode" alt="">
              <span v-else>无分享地址</span>
              <el-button slot="reference" @click="getQrcode();showCode=true">预    览</el-button>
            </el-popover>
          </div>
        </div>

        <!-- 动态弹窗 -->
        <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
      </el-form>
</template>

<script>
import dialogSelectJumpPage from '@/views/shop/dialogs/decorateDialogs/dialogSelectJumpPage';
import dialogSelectImageMaterial from '@/components/dialogs/selectImageMaterial/index';
import vuedraggable from "vuedraggable";
let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
const cid = shopInfo && shopInfo.id || ''
export default {
  name: 'propertyUserCenter',
  components: {dialogSelectJumpPage, dialogSelectImageMaterial, vuedraggable},
  props: ['saveAndApply', 'save', 'resetData', 'data', 'isOpenResell'],
  data () {
    return {
      resetLoading: false,  //重置loading
      saveDataLoading: false,  //保存loading
      saveAndApplyDataLoading: false,  //保存并应用loading
      dialogVisible: false,
      currentDialog: '',
      currentModule: null,
      currentNav: null,  //当前操作的自定义菜单栏
      pathname:window.location.pathname,
      customAddStyle: null, //添加自定义固定样式
      ruleForm: {
        backgroundImage: '',  //背景图
        backgroundGradients: 1,  //背景渐变
        avatarPosition: 1,  //头像位置
        nickColor: '#000000',  //昵称颜色
        memberColumeStyle: 1,  //会员栏样式
        moduleList: [
          // integralMarket: {
          //   name: 'integralMarket',
          //   title: '积分商城',
          //   titleValue: '积分商城',
          //   icon: '',
          //   defaultIcon: 'userCenter11',
          //   color: '#000'
          // },
          // messageCenter: {
          //   name: 'messageCenter',
          //   title: '消息中心',
          //   titleValue: '消息中心',
          //   icon: '',
          //   defaultIcon: 'userCenter12',
          //   color: '#000'
          // },
          {
            id: uuidv4(),
            title: '会员等级',
            titleValue: '会员等级',
            icon: 'data:image/png;base64,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',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'memberRank',
              id: 8,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '赠品包',
            titleValue: '赠品包',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAsCAYAAAAn4+taAAAFmElEQVRoQ+2Zf0jUdxjH3895Y6BgWzaucF4bGpNB6B9lF7cMaciWmoiMXJ3TvI0t6yJ/7LJEbolpTvIIbZM1f+UPVBxZw59pGGg4wyZbMXRyW4wktXAQEzs7n/E5vHJ26n29s/nHPfD94/DzPN/n9fk8vz5fCU4IMxffunXriNlshlqtbgMQQ0TTjppk5tcAtLe0tIT4+Phgx44dRiJKdVR//jpaiZJNh5knFArFhkePHqGiogIajaYDQLQjMHMQHYWFhdvT0tLg7++PkZERExH5r8QnZ0GuFBQU7NPr9fDw8HAYxgZhNBq3p6amgohQVlaGxMTEMiLS/h8g6wF05eXlBZ86dQoymQyVlZVLnow9iIsXL0Kr1XYDiCSif146iHghM/sA6HQEZrUghB9Ohda8XFkWZjUhXAayzMlcA/AJgCtGozHElhOuCCeXVa2FsbxEmE0ZjUbP1YJY9kSY+VUAEQBUAN4A4OFAIoow25uXlwdbAYiLi0Ntba21Os2dBAO4DMCRxH4KYAxAj+g5RCR+vyCL5ggzf8zM5zo7Ozd1dXXxgwcPyGKxOMDxfElraytEj7GJr68vwsLCJNmQy+Xw9fXl8PBwCg0N/RPAUSJqXmjELggzZw0PD58+cOAADQwMSHrxai4ODQ1FVVUVK5VKAfPNkjnCzFEmk+mKSqWiiYkJbN68GQkJCdbOK5qeVOnp6UFJSQlOnDiBrVu3SlXHzMwMhoaGUF5ejrGxMSiVSvT391sUCsVuIuq1GfzPiTCz+P3bnj173rl+/ToiIyO5vr7e7OnpKegHAUiLLSAuIyMjIj8/nwoLC5GSklILoEUijVzk6OTk5GdRUVEevb292L9/P+rq6m4SkXoxkJA7d+78JHZODHEmk+mpt7e3IL8p8eXW5cz8tV6v/7KgoADiSU9PTyeicyu0tW90dLQpICCApqenMTo6yhs3bvQnoj9eqFrM/EVJScm3hw8fRlJSEkpLS2uISLOSF7saZM7etcjIyPebm5vR2NiI2NjYj4io0R6IPj8/Pz8jIwMnT55Ebm5uLhFlriGQ77VarVYMmKWlpWKzk4io3B5IQk1NTYVGo0F0dDSampp6iei9tQDCzCJXft25c2dgX18f2tvbER4evpeIWu2BvD0+Pj7i5+cnm52dxe3bt0WlOQ0gm4hmpQK5KkeY+RUAxu7u7uSwsDBat24d7t+/b/by8lIQ0d8vgMzFYfPx48c/PH/+PPn5+aGhoYFVKtXvAH5ZQdUK0uv1gfOSXVS+IYkbIk5iW0dHh/LgwYP08OFD5OTkIDMzs5KIEu1WrTmQgKmpqYGIiAjv7m5xRQCCg4OtfUR0WakyODho7QNBQUEIDAyUqv6sj9y9e9eqGxMTww0NDeNyuTyIiMToYpXFOnuo2Wy+fObMmfVGoxGPHz+W7ICrFUQ7EAUoJSVlVCaTRRCRON1nstSspQRwyWAw7M7OzrY2odjYWMn+VVdX4+rVq4iPj0dUVJRkfVGh2tracOHCBSQnJ/8I4FMiGl9oaMmLFTN/ZTAYDAJEPFlZWfUAfpDgjUav1++blyNVAIQzjkqSTqf7oLi42AZyZOGMtWRo2f5oBySLiHIc9cLZqsXMRTqd7qgbxH0iC2LOHVpzG+LOkYXVyF21noeGUxcrd2i5Q2uRVu8uv+7yu3hoLJx+pQ6NWWfPns0W9wgxjh86dOhzIvpOwtC5ZoZG/5mZmb6+vr4NarX6L5lMts3eXWIxsDVTfoWDzPw6APGt9GciknTVXFMgjoaRvXWrCTIMYMQZ5yTqvqvT6d5y6cVqy5YtEM/LFvH15N69e05fddOKiooKjh075pJ/mjqzCXV1deIDSDwRVduzs9zHhzctFkv/jRs3Nj158sQZP5zS9fLywq5du0aIKISIJu0Z+xcGMsVpfE7H+QAAAABJRU5ErkJggg==',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'gift',
              id: 10,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '我的拼团',
            titleValue: '我的拼团',
            icon: 'data:image/png;base64,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',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'myAssemble',
              id: 11,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '地址管理',
            titleValue: '地址管理',
            icon: 'data:image/png;base64,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',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'address',
              id: 12,
              cid: cid
            }
          },
          {
            id: uuidv4(),
            title: '分销中心',
            titleValue: '分销中心',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAsCAMAAAAQPRtoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjc2RTNCNkY5QzREMzExRUFCRjY1QjVCM0ZBMDA0QTA4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjc2RTNCNkZBQzREMzExRUFCRjY1QjVCM0ZBMDA0QTA4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzZFM0I2RjdDNEQzMTFFQUJGNjVCNUIzRkEwMDRBMDgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NzZFM0I2RjhDNEQzMTFFQUJGNjVCNUIzRkEwMDRBMDgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7oTte5AAAA2FBMVEX9/f1ZWVkMDAwCAgLX19fz8/PU1NRwcHAyMjIqKioBAQE6Ojpra2v5+flPT08mJiZ1dXWbm5sbGxs9PT2urq76+vpaWlojIyMHBweqqqpCQkJ2dnYEBATq6urg4OAGBgYnJyccHBxNTU2Tk5OZmZnLy8v7+/tlZWUzMzNISEhycnK0tLRKSkoJCQlkZGR9fX1sbGw5OTkfHx8wMDArKyvt7e3c3NwFBQXBwcGNjY3Z2dnw8PCkpKQSEhIkJCTHx8e7u7sPDw9VVVVvb2/19fUVFRUAAAD///+xiGnWAAAASHRSTlP//////////////////////////////////////////////////////////////////////////////////////////////wCc7PJgAAABgUlEQVR42qyW13KDMBBFRRG9d9yd3nvvdf3/f5RxbBgJ5EhmwtOK9WEO2ivGaLb2hdq30jLzZdnPylQUSXIoYkmKC8gTIQQFEIV4XuEwggAJIAF4uKqxBwEfScAj7iAPEh6S5hEm1zjKUw5SQki3Qyg5SFZguo2LjIP4cbMf+xxElpp9Sf5/pINYh9fvsMkdRtkhMF1i2SX8v0dssDhi08lI8CC/WpPFQd5WPgSR8+frZbULd0LIE2xW5fD9EgkgX9OrnXpxD1sCyCm8EaP1vx9XIppuyrKpa6Njj2wfwsEKxHUUy5Akw1JexjdUf//2gYm4PbDVeaHuwYVL9dXBUW1AIg70l4LoBBz6mZ+wURk4bo1oil3vArIVjUKG48rAhp5bIbqlEiaWTiEOnFUG/YXBfGka5G8Mk1wxDFDrI0F/IBgGPIRhwBNjPK79+qALIH9t8goxcpT9xigZBo3AVOPibTIZS8dthLBt0Ax/K+ptA8T9Z9Ay4CMzZvjXu34EGABVpAqSyI3rmAAAAABJRU5ErkJggg==',
            color: '#000',
            disabled: 2,
            linkTo: {
              pageType: 'commissionCenter',
              id: 13,
              cid: cid
            }
          }
        ]
      },
      rules: {},
      showCode: false,   //是否显示二维码
      qrCode: '',
      showPreviewCode: true  //预览二维码按钮是否可见
    }
  },
  watch:{
    data:{
      handler(newValue) {
        this.ruleForm = newValue;
        this.getQrcode();
      },
      deep: true
    },
    ruleForm: {
      handler(newValue) {
        this.$emit('userCenterDataChanged', newValue);
      },
      deep: true
    },
    shopInfo: {
      handler(newValue) {
        this.getQrcode();
      },
      deep: true
    }
    
  },
  created() {
    const _self = this;

    /* 监听接口操作结束事件，用来响应loading  保存按钮*/
    this._globalEvent.$on('userCenterSaveLoading', (status) => {
      _self.saveDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  保存并应用按钮*/
    this._globalEvent.$on('userCenterSaveAndApplyLoading', (status) => {
      _self.saveAndApplyDataLoading = false;
    });

     /* 监听接口操作结束事件，用来响应loading  重置按钮*/
    this._globalEvent.$on('userCenterResetLoading', (status) => {
      _self.resetLoading = false;
    });

    this.ruleForm.backgroundImage= '';
    this.$store.dispatch('getShopInfo');
    this.$emit('userCenterDataChanged', this.ruleForm);
  },
  mounted() {
    this.$refs.ruleForm.$el.addEventListener('scroll', this.scrollHandler, false)

    //如果没有分销中心，则先移除，避免向上向下移动时数量索引index不正确
    if(this.isOpenResell!=1){
      this.ruleForm.moduleList.pop();
    }
  },
  computed: {
      shopInfo() {
        return this.$store.getters.shopInfo || {};
      }
  },
  methods: {
    //监听form区域滚动
    scrollHandler() {
      const ruleForm = this.$refs.ruleForm.$el;
      const customAddTop = this.$refs.customAddWrap.offsetTop - ruleForm.offsetTop;
      const scrollTop = ruleForm.scrollTop;
      if(scrollTop >= customAddTop){
        this.customAddStyle = {
          'z-index': 10,
          'position': 'absolute',
          'top': (scrollTop-customAddTop)+'px'
        };
      }else{
        this.customAddStyle = null;
      }
    },

    disabledChange(disabled, index) {
      if(disabled === 2){ //选中时触发验证
        this.$nextTick(() => {
          this.$refs['ruleForm'].validate();
        })
      }else{ //不选中时清除当前的错误
        this.$refs['customFormItem'+index][0].clearValidate();
      }
    },

    //添加自定义栏
    customAdd() {
      const length = this.ruleForm.moduleList.filter((item) => item.title.includes('自定义')).length + 1;
      //自定义初始数据格式
      const obj = {
        id: uuidv4(),
        title: '自定义' + length,
        titleValue: '',
        icon: 'data:image/png;base64,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',
        color: '#000',
        disabled: 2
      };
      this.ruleForm.moduleList.push(obj);
      this.$emit('scrollToBottom');
      this.$nextTick(() => {
        const container = this.$refs.ruleForm.$el;
        const top = container.scrollHeight;
         container.scrollTo({
          top: top,
          behavior: "smooth"
        });
      })
    },

    //删除自定义
    deleteCustom(val, index) {
      this.confirm({icon: true, text: '是否确认删除'}).then(() => {
          const delNum = parseInt(val.title.substring(3));
          this.ruleForm.moduleList.splice(index, 1);
          this.ruleForm.moduleList.forEach((item) => {
            const title = item.title;
            if(title.includes('自定义') && parseInt(title.substring(3)) > delNum) {
              const num = parseInt(title.substring(3)) - 1;
              item.title = '自定义' + num;
            }
          })
          //this.$message.success('删除成功！');
      }).catch(error => {
          
      })
    },

    //向上移动
    sortTop(item, index) {
      const prevItem = this.ruleForm.moduleList[index - 1];
      this.$set(this.ruleForm.moduleList, index - 1, item);
      this.$set(this.ruleForm.moduleList, index, prevItem);
      this.$nextTick(() => {
        this.$refs['customFormItem'+index][0].clearValidate();
        this.$refs['ruleForm'].validate();
      })
    },

    //向下移动
    sortBottom(item, index) {
      const nextItem = this.ruleForm.moduleList[index + 1];
      this.$set(this.ruleForm.moduleList, index + 1, item);
      this.$set(this.ruleForm.moduleList, index, nextItem);
      this.$nextTick(() => {
        this.$refs['customFormItem'+index][0].clearValidate();
        this.$refs['ruleForm'].validate();
      })
    },

     /* 弹框选中图片 */
    imageSelected(dialogData) {
      if(this.currentModule.icon !== undefined && this.currentModule.icon !== null) {
        this.currentModule.icon = dialogData.filePath;
      }
      if(this.currentModule.backgroundImage !== undefined && this.currentModule.backgroundImage !== null) {
        this.currentModule.backgroundImage = dialogData.filePath;
      }
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.currentNav.linkTo = linkTo;
    },

    /* 移除链接 */
    removeLink(item, index) {
      item.linkTo = null;
      this.$set(this.ruleForm.moduleList, index, item);
    },

    //验证自定义的跳转链接
    validLinkTo() {
      let linkToMark = false;
      this.ruleForm.moduleList.forEach((item, index) => {
        if(item.title.includes('自定义') && !item.linkTo){
          linkToMark = true;
          item.linkTo = null;
          this.$set(this.ruleForm.moduleList, index, item);
        }
      })
      return linkToMark;
    },

    // 保存
    userCenterSave() {
      let self = this;
      const linkToMark = this.validLinkTo();
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          if(linkToMark){ //如果存在自定义且其未选择跳转链接，则不可保存
            return;
          }
          self.saveDataLoading = true;
          self.save();
        } else {
          // this.$message({ message: '请填写正确信息', type: 'warning' });
          return;
        }
      })
    },

    // 保存并生效
    userCenterSaveAndApply() {
      let self = this;
      const linkToMark = this.validLinkTo();
      self.$refs['ruleForm'].validate( valid => {
        if(valid) {
          if(linkToMark){ //如果存在自定义且其未选择跳转链接，则不可保存
            return;
          }
          self.saveAndApplyDataLoading = true;
          self.saveAndApply();
        } else {
          // this.$message({ message: '请填写正确信息', type: 'warning' });
          return;
        }
      })
    },

      /* 获取二维码 */
    getQrcode(codeType, callback) {
      if(!this.ruleForm.shareUrl) {
        return;
      }
      this._apis.shop.getQrcode({
        url: 'https:' + this.ruleForm.shareUrl.split(':')[1].replace("&","[^]"),
        width: '150',
        height: '150',
        logoUrl: this.shopInfo.logoCircle || this.shopInfo.logo
      }).then((response)=>{
        this.qrCode = `data:image/png;base64,${response}`;
        callback && callback(response);
      }).catch((error)=>{
        this.$message({ message: error, type: 'error' });
      });
    },

    /* 改变背景图片 */
    changeBackground() {
      this.currentModule=this.ruleForm; 
      this.dialogVisible=true; 
      this.currentDialog='dialogSelectImageMaterial';
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom {
    padding: 0 15px 20px 15px !important;
    .add-btn-wrap {
      position: relative;
      height: 40px;
      line-height: 40px;
    }
    .add-btn {
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #655EFF;
      background: #fff;
      cursor: pointer;
    }
    .custom-list {
      li {
        .el-checkbox {
          float: left;
        }
        .el-icon-delete{
          float: left;
          margin-top: 9px;
          color: #F55858;
          cursor: pointer;
        }
        /deep/ .el-checkbox__input {
          padding-top: 9px;
        }
        .custom-form{
          float: left;
          margin-bottom: 18px !important;
          .module_block {
            margin-bottom: 0;
          }
          /deep/ .el-form-item__label {
            text-align: right !important;
            padding: 0 10px 0 0;
          }
          /deep/ .el-form-item__label::before {
            display: none;
          }
          .el-input {
            width: 100px !important;
          }
          /deep/ .el-input__inner {
            height: 34px;
            line-height: 34px;
          }
          .img_preview {
            width: 34px !important;
            height: 34px !important;
          }
          .m-colorPicker {
            padding: 4px;
            margin-right: 5px;
            border:1px solid rgba(204,204,204,1);
            border-radius: 1px;
          }
          /deep/ .colorBtn{
            width: 24px !important;
            height: 24px !important;
            margin: 0;
          }
          .custom-do {
            display: flex;
            width: 34px;
            justify-content: center;
            align-items: center;
            .custom-center {
              display: inline-block;
              width: 20px;
            }
            .icon {
              display: block;
              width: 20px;
              height: 13px;
              background-repeat: no-repeat;
              background-position: center center;
              background-size: 14px 9px;
              cursor: pointer;
            }
            .top {
              background-image: url(~@/assets/images/common/icon-caret-top.png);
            }
            .bottom {
              background-image: url(~@/assets/images/common/icon-caret-bottom.png);
            }
            .top:hover {
              background-image: url(~@/assets/images/common/icon-caret-top-press.png);
            }
            .bottom:hover {
              background-image: url(~@/assets/images/common/icon-caret-bottom-press.png);
            }
          }
          .custom-disabled {
            z-index: 10;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            cursor: not-allowed;
            filter: grayscale(90%);
          }
        }
      }
    }
  }
  .custom-link {
    position: relative;
    padding-left: 88px;
    padding-bottom: 15px;
    .title {
      margin-right: 10px;
      color: #44434B;
    }
    .link_overview {
      padding-top: 10px;
    }
  }
  .module_block{
    display:flex;
    flex-direction: row;
    margin-bottom:10px;
    .el-input{
      margin-right:10px;
    }
    .img_preview{
      width: 64px!important;
      height: 31px!important;
      display: block;
      margin-right: 10px;
      &:hover span{
        opacity: 1;
        transition: all 0.3s;
      }
      span{
        font-size: 12px;
        height: 16px;
        line-height: 16px;
        opacity: 0;
        transition: all 0.3s;
        cursor: pointer;
      }
    }
    .colorBtn{
      width:31px!important;
      height:31px!important;
      margin-right:10px;
      border:1px solid #ddd;
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
