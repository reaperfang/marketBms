/* 选择页面跳转弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择跳转页面'" @submit="submit" :showFooter="false">
    <div class="jump_wrapper">
      <el-tabs v-model="currentTab">
        <el-tab-pane label="微页面" name="microPage"></el-tab-pane>
        <el-tab-pane label="微页面分类" name="microPageClassify"></el-tab-pane>
        <el-tab-pane label="商品分类" name="goodsGroup"></el-tab-pane>
        <el-tab-pane label="商品详情" name="goods"></el-tab-pane>
        <el-tab-pane label="营销活动" name="marketCampaign"></el-tab-pane>
        <el-tab-pane label="系统页面" name="systemPage"></el-tab-pane>
        <el-tab-pane label="自定义链接" name="customLink" v-if="!customLinkDisabled"></el-tab-pane>
      </el-tabs>
      <component :is="currentTab" @seletedRow="rowSeleted" @invalidChange="invalidChange"></component>
      <span class="dialog-footer fcc" style="margin-top:20px;">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </div>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import microPage from "../jumpLists/microPage";
import microPageClassify from "../jumpLists/microPageClassify";
import goods from "../jumpLists/goods";
import goodsGroup from "../jumpLists/goodsGroup";
import marketCampaign from "../jumpLists/marketCampaign";
import systemPage from "../jumpLists/systemPage";
import customLink from "../jumpLists/customLink";
export default {
  name: "dialogSelectJumpPage",
  components: {DialogBase, microPage, microPageClassify, goods, goodsGroup, marketCampaign, systemPage, customLink},
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      },
      customLinkDisabled: {
        default: true,
        type: Boolean
      }
  },
  data() {
    return {
      currentTab: 'microPage',
      seletedRow: null,
      seletedData: null,
      invalid: true
    };
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    }
  },
  created() {
  },
  methods: {

    rowSeleted(row) {
      this.seletedData = row;
    },

    /* 向父组件提交选中的数据 */
    submit() {
      if(this.seletedData && !this.invalid) {
        this.$emit('seletedPage',  this.seletedData);
        this.$nextTick(()=>{
          this.dialogVisible = false
        })
      }else {
        this.$message.warning('请填入正确的跳转页面或链接！')
      }
    },

    /* 数据可用性更新 */
    invalidChange(value) {
      this.invalid = value;
    }
  }
};
</script>

<style lang="scss" scoped>
.jump_wrapper{
  padding:0 20px 20px;
  background:rgb(242,242,249);
}
.name_wrapper{
    display: flex;
    flex-direction: row;
    align-items: center;
    img{
      width:50px;
      height:50px;
      margin-right:10px;
      object-fit: contain;
    }
    p{
      width: calc(100% - 50px);
    }
}
</style>