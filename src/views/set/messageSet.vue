/*消息设置 */
<template>
 <div class="main">
   <p class="title">买家通知<span><br><i>请注意：</i>1、设置前，请务必保证公众号或小程序已申请开通消息模板（约2-3个工作日） <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2、由于公众号、小程序官方后台最多支持25条模板消息，所以已设置成功的消息开启时不再重新获取  <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3、在微信官方后台删除模板时，请不要删除已设置成功的模板</span></p>
      <!-- :span-method="objectSpanMethod" -->
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
      <el-table-column
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
          <el-popover
            :disabled="!scope.row.wechatPublicId"
            placement="right"
            width="400"
            trigger="click">
              <p class="preview_title">{{scope.row.msgTitle}}</p>
              <div class="preview_content" v-html="scope.row.wechatPublicPreview"></div>
              <p class="checkInfo" v-if="scope.row.isGotoWechatPublicDetail == 1">详情</p>
              <p class="preview_id">模板ID:{{scope.row.wechatPublicId}}</p>
            <el-link type="primary" slot="reference" v-permission="['设置', '消息设置', '默认页面', '预览']">{{!!scope.row.wechatPublicId?'预览':'--'}}</el-link>
          </el-popover>
        </template>
      </el-table-column>
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
          <el-popover
            :disabled="scope.row.smsPreview == undefined || !scope.row.smsTemplateKey"
            placement="right"
            width="400"
            trigger="click">
              <p class="preview_title">{{scope.row.msgTitle}}</p>
              <div v-html="scope.row.smsPreview" class="rich_wrapper"></div>
            <el-link type="primary" slot="reference" v-permission="['设置', '消息设置', '默认页面', '预览']">{{!!scope.row.smsTemplateKey?'预览':'--'}}</el-link>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>     
</template>

<script>
import buyer from "./components/buyer";
import seller from "./components/seller";
export default {
  name: 'messageSet',
  data() {
    return {
      tableData: [],
      loading:true
    }
  },
  components: {buyer, seller},
  watch: {
    
  },
  computed: {
  }, 
  created() {
    this.getShopMessage()
  },
  methods: {
    getShopMessage(){
      this._apis.set.getShopMessage().then(response =>{
        response.splice(response.length - 1, 1);
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
          this.$notify.error({
            title: '错误',
            message: error
          });
          this.getShopMessage()
        })        
      }).catch(() =>{
        this.getShopMessage()
      })
    },
    handleClick(comp) {
      this.currentTab = comp.name;
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
    }
  },
  mounted() {
   // console.log(this.previewContent);
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
  padding: 20px;
  background: #fff;
}
.title{
  line-height: 26px;
  padding-bottom: 10px;
  span{
    margin-left: 20px;
    i{
      color: red;
      font-style: normal;
    }
  }
}
.preview_title{
  padding-left: 6px;
  height: 36px;
  line-height: 36px;
  background-color: #eee;
}
.rich_wrapper{
  padding: 6px 0 0 6px;
  line-height: 25px;
}
.preview_id{
  padding: 6px 0 0 6px;
}
.checkInfo{
  color: red;
  padding: 4px 0 0 6px;
}
</style>