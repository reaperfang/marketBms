<template>
  <div class="group-wrapper">
    <div class="module view" ref="groupWrapper">
      <div class="phone-head" @click="clickTitle(null)" title="点击编辑页面信息">
        <img :src="require('@/assets/images/shop/editor/phone_head.png')" alt="">
        <span>页面广告</span>
      </div>
      <div class="phone-body" :style="bodyHeight">
        <div class="img_wrapper">
          <img :src="ruleForm.imagePath" alt="">
          <i></i>
        </div>
      </div>
    </div>
    <div class="module props" v-loading="loading">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm" :style="propsHeight">
        <div class="block header">
          <p class="title">启动广告设置</p>
          <p :class="{'state': ruleForm.status === 2 || ruleForm.status === 3}" v-if="ruleForm.status === 0">展示中</p>
          <p :class="{'state': ruleForm.status === 2 || ruleForm.status === 3}" v-else-if="ruleForm.status === 1">排期中</p>
          <p :class="{'state': ruleForm.status === 2 || ruleForm.status === 3}" v-else-if="ruleForm.status === 2">已过期</p>
          <p :class="{'state': ruleForm.status === 2 || ruleForm.status === 3}" v-else-if="ruleForm.status === 3">已停用</p>
        </div>
        <div class="block form">
          <el-form-item label="出现页面" prop="type">
            <el-radio-group v-model="ruleForm.type">
              <el-radio :label="0">首页</el-radio>
              <el-radio :label="1">微页面</el-radio>
              <el-radio :label="2">微页面分类</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="广告名称" prop="name">
             <el-input v-model="ruleForm.name" placeholder="请输入广告名称"></el-input>
          </el-form-item>
          <el-form-item label="广告图片" prop="imagePath">
            <div class="img_preview" v-if="ruleForm.imagePath">
              <img :src="ruleForm.imagePath" alt="">
              <span @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">更换图片</span>
            </div>
            <div class="add_button" v-if="!ruleForm.imagePath" @click="dialogVisible=true; currentDialog='dialogSelectImageMaterial'">
              <i class="inner"></i>
            </div>
            <span class="upload_tips">建议尺寸:640 * 350 , 请将所有广告图片尺寸保持一致，图片只能选择一张</span>
          </el-form-item>
          <el-form-item label="广告链接" prop="advertiseUrl">
            <el-button type="text" @click="dialogVisible=true; currentDialog='dialogSelectJumpPage'">{{ruleForm.advertiseJump ? ruleForm.advertiseJump.typeName + '-' + (ruleForm.advertiseJump.data.title || ruleForm.advertiseJump.data.name) : '选择跳转页面'}}</el-button>
          </el-form-item>
          <el-form-item label="展示时间" prop="">
            <div>
              <el-date-picker
                v-model="ruleForm.startTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
            至
            <div>
              <el-date-picker
                v-model="ruleForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期"
                :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </el-form-item>
        </div>

        <div class="block button">
          <div class="help_blank"></div>
          <div class="buttons">
            <el-button @click="saveData" type="primary" :loading="saveDataLoading">保    存</el-button>
            <el-button @click="_routeTo('ADManageIndex')">取    消  </el-button>
          </div>
        </div>

      </el-form>
    </div>
    <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @imageSelected="imageSelected" @seletedPage="seletedPage"></component>
  </div>
</template>

<script>
import dialogSelectImageMaterial from '../../dialogs/dialogSelectImageMaterial';
import dialogSelectJumpPage from '../../dialogs/dialogSelectJumpPage';
export default {
  name: 'shopIndex',
  components: {dialogSelectImageMaterial, dialogSelectJumpPage},
  data () {
    return {
      currentADId: this.$route.query.ADId || '',
      dialogVisible: false,
      currentDialog: '',
      loading: false,
      saveDataLoading: false,
      ruleForm: {
        type: 0,
        name: '',
        imagePath: '',
        advertiseUrl: '',
        startTime: '',
        endTime: '',
      },
      rules: {
        name: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          {
            min: 1,
            max: 30,
            message: "请勿超过30个字符",
            trigger: "blur"
          },
        ]
      },
      bodyHeight: {},
      propsHeight: {},
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    }
  },
  created() {
    if(this.currentADId) {
      this.getADdetail(); 
    }
  },
  mounted() {
    this.bodyHeight = {
      height: document.body.clientHeight - 146 - 20 + 'px'
    },
    this.propsHeight = {
      height: document.body.clientHeight - 190 - 20 + 'px'
    }
  },
  watch: {
    'ruleForm.advertiseJump': {
      handler(newValue) {
        if(newValue && typeof newValue === 'string') {
          this.ruleForm.advertiseJump = JSON.parse(newValue);
        } 
      },
      deep: true
    }
  },
  methods: {
    /* 弹框选中图片 */
    imageSelected(dialogData) {
      this.ruleForm.imagePath= dialogData.filePath;
    },

    /* 弹窗选中了跳转链接 */
    seletedPage(linkTo) {
      this.ruleForm.advertiseJump = linkTo;
    },

    /* 获取广告详情 */
    getADdetail() {
      this.loading = true;
      this._apis.shop.getADInfo({id: this.currentADId}).then((response)=>{
        this.ruleForm = response;
        this.loading = false;
      }).catch((error)=>{
        // this.$notify.error({
        //   title: '错误',
        //   message: error
        // });
        console.error(error);
        this.loading = false;
      });
    },

    /* 保存图片广告数据 */
    saveData() {
       this.$refs.ruleForm.validate( valid => {
        if(valid) {
          this.saveDataLoading = true;
          if(this.currentADId) {
            this._apis.shop.editADInfo(this.ruleForm).then((response)=>{
              this.$notify({
                title: '成功',
                message: '编辑成功！',
                type: 'success'
              });
              this._routeTo('ADManageIndex');
              this.saveDataLoading = false;
            }).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: error
              });
              this.saveDataLoading = false;
            });
          }else{
            this._apis.shop.createAD(this.ruleForm).then((response)=>{
              this.$notify({
                title: '成功',
                message: '创建成功！',
                type: 'success'
              });
              this._routeTo('ADManageIndex');
              this.saveDataLoading = false;
            }).catch((error)=>{
              this.$notify.error({
                title: '错误',
                message: error
              });
              this.saveDataLoading = false;
            });
          }
        }
      })
    }
  }
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
.upload_tips{
  color:rgba(211,211,211,1);
}
.module {
  &.view {
    .phone-body {
      background: rgb(217,217,223);
      width:100%;
      position:relative;
      .img_wrapper{ 
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%, -50%);
        display:flex;
        flex-direction: column;
        width:calc(100% - 80px);
        align-items: center;
        img{
          max-width: 100%;
        }
        i{
          background: url('../../../../assets/images/shop/icon_close.png') no-repeat 0 0;
          width:44px;
          height:44px;
          margin-top:22px;
        }
      }
    }
  }
}
</style>
