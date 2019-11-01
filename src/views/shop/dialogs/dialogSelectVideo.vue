/* 选择视频素材弹框 */
<template>
  <DialogBase :visible.sync="visible" width="816px" :title="'选择视频'" @submit="submit">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="0" :inline="true">
      <div class="inline-head">
        <el-form-item label="" prop="name">
          <el-select v-model="ruleForm.group" placeholder="">
            <el-option label="全部" :value="1"></el-option>
            <el-option label="文章配图" :value="2"></el-option>
            <el-option label="封面配图" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入视频名称"></el-input>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button type="primary" @click="fetch">搜  索</el-button>
        </el-form-item>
      </div>
    </el-form>
    <ul class="tile-list n3 video_list" v-if="videoList.length" ref="videoList">
      <li v-for="(item, key) of videoList" :key="key" class="cell-item" @click="selectVideo($event, item)">
        <div class="video_head">
          <span>{{item.createTime}}</span>
          <span>{{(item.fileSize || '-- ') + 'MB'}}</span>
        </div>
        <div class="video_body">
          <p>{{item.fileName}}</p>
          <video
            :src="item.filePath"
            controls="controls"
            class="video"
            :poster="item.fileCover"
          >您的浏览器不支持 video 标签。</video>
        </div>
      </li>
    </ul>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
import uuid from 'uuid/v4';
export default {
  name: "dialogSelectVideo",
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
  },
  data() {
    return {
      videoList: [],
      ruleForm: {
        name: '',
        group: 1
      },
      rules: {},
      selectedItem: null  //选中的视频
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
    this.fetch();
  },
  mounted() {
  },
  methods: {
    fetch() {
      this.loading = true;
      this._apis.file.getMaterialList({
        fileGroupInfoId:"",
        startIndex:"1",
        pageSize:"10",
        sourceMaterialType:"2",
      }).then((response)=>{
        this.videoList = response.list;
        this.loading = false;
      }).catch((error)=>{
        this.$notify.error({
          title: '错误',
          message: error
        });
        this.loading = false;
      });
    },

    /* 选中视频 */
    selectVideo(event, item) {
      this.selectedItem = item;

      const videos = this.$refs.videoList.querySelectorAll('.cell-item');
      for(let dom of videos) {
        dom.className = 'cell-item';
      };
      event.currentTarget.className = 'cell-item video_active';
    },

    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit('videoSelected',  this.selectedItem);
    },
  }
};
</script>

<style lang="scss">
ul.video_list{
  li{
    border: 1px solid #ddd;
    cursor:pointer;
    &.video_active{
      border: 2px dashed $globalMainColor!important;
    }
  }
}
.video_head{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:5px 20px;
}
.video_body{
  border-top: 1px solid #ddd;
  p{
    text-align:left;
    padding:5px 20px;
  }
  video{
    width: 100%;
    padding: 20px;
    padding-top: 0;
    height: 210px;
  }
}
</style>