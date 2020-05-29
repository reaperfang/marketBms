/*客户通知 */
<template>
 <div class="main">
    <p class="title">
      <i>请注意：</i>
      请先输入想要接受短信通知提醒的客户手机号： 
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" style="display:inline-block;">
        <el-form-item  prop="msgReceivePhone">
          <el-input v-model="ruleForm.msgReceivePhone" style="width:200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        </el-form-item>
      </el-form>
    </p>
    <p class="note ml57">如不设置则默认发送至店铺主账号绑定的手机号</p>
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%;">
      <el-table-column
        prop="msgType"
        label="消息类别"
        align="center"
        width="180">
      </el-table-column>
      <el-table-column
        prop="msgTitle"
        label="消息标题">
      </el-table-column>
      <el-table-column
        prop="triggerRule"
        label="推送规则">
      </el-table-column>
      <!-- <el-table-column
        prop="msgWechatPublic"
        label="公众号模版消息"
        align="center">
        <template slot-scope="scope">
          <el-switch
          v-if="!!scope.row.wechatPublicId"
          v-model="scope.row.msgWechatPublic"
          @change="switchMessage1(scope.row.id,scope.row.msgWechatPublic)"
          active-color="#13ce66"
          inactive-color="#eee"
          v-permission="['设置', '消息设置', '默认页面', '开启/关闭']">
          </el-switch>
          <el-tooltip
            :disabled="!scope.row.wechatPublicId" 
            placement="bottom">
            <div slot="content" style="width:200px;">
              <p class="preview_title">{{scope.row.msgTitle}}</p>
              <div class="preview_content" v-html="scope.row.wechatPublicPreview"></div>
              <p class="checkInfo" v-if="scope.row.isGotoWechatPublicDetail == 1">详情</p>
              <p class="preview_id">模板ID:{{scope.row.wechatPublicId}}</p>
            </div>
            <el-link type="primary" v-permission="['设置', '消息设置', '默认页面', '预览']">{{!!scope.row.wechatPublicId?'预览':'--'}}</el-link>
          </el-tooltip>
        </template>
      </el-table-column> -->
      <!-- <el-table-column
        prop="msgWechatApp"
        label="小程序模版消息"
        align="center">
        <template slot-scope="scope">
          <el-switch
          v-if="!!scope.row.wechatAppId"
          v-model="scope.row.msgWechatApp"
          @change="switchMessage2(scope.row.id,scope.row.msgWechatApp)"
          active-color="#13ce66"
          inactive-color="#eee"
          v-permission="['设置', '消息设置', '默认页面', '开启/关闭']">
          </el-switch>
          <el-popover
            :disabled="!scope.row.wechatAppId"
            placement="right"
            width="400"
            trigger="click">
              <p class="preview_title">{{scope.row.msgTitle}}</p>
              <div v-html="scope.row.wechatAppPreview" class="preview_content"></div>
              <p class="checkInfo" v-if="scope.row.isGotoWechatAppDetail == 1">查看详情</p>
              <p class="preview_id">模板ID:{{scope.row.wechatAppId}}</p>
            <el-link type="primary" slot="reference" v-permission="['设置', '消息设置', '默认页面', '预览']">{{!!scope.row.wechatAppId?'预览':'--'}}</el-link>
          </el-popover>
        </template>
      </el-table-column> -->
      <el-table-column
        prop="msgSms"
        label="短信通知"
        align="center">
        <template slot-scope="scope">
          <el-switch
          v-if="!!scope.row.smsTemplateKey"
          v-model="scope.row.msgSms"
          @change="switchMessage3(scope.row.id,scope.row.msgSms)"
          active-color="#13ce66"
          inactive-color="#eee"
          v-permission="['设置', '消息设置', '默认页面', '开启/关闭']">
          </el-switch>
          <el-tooltip
            :disabled="scope.row.smsPreview == undefined || !scope.row.smsTemplateKey"
            placement="bottom">
            <div slot="content" style="width:200px;">
              <p class="preview_title">{{scope.row.msgTitle}}</p>
              <div v-html="scope.row.smsPreview" class="rich_wrapper"></div>
            </div>
            <el-link type="primary" v-permission="['设置', '消息设置', '默认页面', '预览']">{{!!scope.row.smsTemplateKey?'预览':'--'}}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>     
</template>

<script>
export default {
  name: 'buyer',
  data() {
    var validatePass = (rule, value, callback) => {
      let mobile = /^1[3456789]\d{9}$/;
      if (!mobile.test(value)) {
        return callback(new Error("您输入的手机号有误，请您重新输入"));
      } else {
        callback();
      }
    };
    return {
      tableData: [],
      loading:true,
      ruleForm:{
        msgReceivePhone:'',
      },
      rules: {
          msgReceivePhone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' },
            { validator: validatePass, trigger: "blur" },
          ],
      }
    }
  },
  components: { },
  watch: {
    
  },
  computed: {
    cid() {
      let shopInfo = JSON.parse(localStorage.getItem("shopInfos"));
      return shopInfo.id;
    },
  }, 
  created() {
    this.getShopMessage()
    this.getShopInfo()
  },
  methods: {
    getShopMessage(){
      this._apis.set.getShopMessage({msgReceiver:'1'}).then(response =>{
        this.tableData = []
        response.map(item => {
          if(item.tcShopInfoMsgTemplateId != 21){
            item.msgWechatPublic = item.msgWechatPublic == 0 ? false : true
            item.msgWechatApp = item.msgWechatApp == 0 ? false : true
            item.msgSms = item.msgSms == 0 ? false : true
            this.tableData.push(item);
          }
        })
        this.loading = false
      }).catch(error =>{
        this.loading = false
      })
    },

    getShopInfo(){
      let id = this.cid;
      this._apis.set.getShopInfo({ id: id }).then(response => {
        this.ruleForm.msgReceivePhone = response.msgReceivePhone
      }).catch(error =>{
        console.log(error)
      })
    },

    switchMessage1(id,publics){
      let query = {
        id:id,
        msgWechatPublic: publics == false ? 0 : 1,
      }
      this.handleSwitch(query);
    },
    switchMessage2(id,app){
      let query = {
        id:id,
        msgWechatApp: app == false ? 0 : 1,
      }
      this.handleSwitch(query);
    },
    switchMessage3(id,sms){
      let query = {
        id:id,
        msgSms: sms == false ? 0 : 1
      }
      this.handleSwitch(query);
    },
    handleSwitch(query) {
      this.$msgbox({
        title: '确认提示',
        message: '确认要进行此项操作吗？',
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        this._apis.set.setShopMessage(query).then(response =>{
          this.$message({
            type: 'success',
            message: '操作成功！'
          });
          this.getShopMessage()
        }).catch(error =>{
          this.$message.error(error);
          this.getShopMessage()
        })        
      }).catch(() =>{
        this.getShopMessage()
      })
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let data = {
            id:this.cid,
            msgReceivePhone:this.ruleForm.msgReceivePhone
          }
          this._apis.set.updateShopInfo(data).then(response =>{
            this.$message({
              type: 'success',
              message: '操作成功！'
            });
          this.getShopInfo()
          }).catch(error =>{
            this.$message.error(error);
          })    
        } else {
          return false;
        }
      });
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
        return {
          rowspan: 2,
          colspan: 1
        };
        } else {
          return {
              rowspan: 0,
              colspan: 0
          };
        }
      }
    },
  },
  mounted() {

  },
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.tabs{
  background:#fff; 
  padding:10px 20px;
}
.main{
  width: 100%;
  padding: 0px 20px 50px 20px;
  background: #fff;
}
.title{
  font-size: 14px;
  line-height: 26px;
  padding-bottom: 10px;
  i{
    color: red;
    font-style: normal;
  }
}
.note{
  font-size: 12px;
  color: #9FA29F;
  padding-bottom: 10px;
}
.preview_title{
  // padding-left: 6px;
  height: 36px;
  line-height: 36px;
  // background-color: #eee;
  font-size: 12px;
  text-align: center;
}
.preview_content{
  font-size: 10px;
}
.rich_wrapper{
  padding: 6px 0 0 6px;
  line-height: 25px;
}
.preview_id{
  padding-top: 10px;
}
.checkInfo{
  color: red;
  padding: 4px 0 0 6px;
}
.ml57{
  margin-left:57px;
}
.el-form-item{
  margin-bottom:0px;
} 
/deep/.el-form-item--small .el-form-item__error{
  padding-top: 5px;
}
</style>