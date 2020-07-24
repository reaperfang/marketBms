/* 图片素材 */
<template>
      <div>
        <div class="material_head">
          <div class="select">
            <el-cascader :props="cascaderProps" @change="cascaderChange" placeholder="全部"></el-cascader>
          </div>
          <el-input v-model="materialName" placeholder="请输入图片名称" clearable></el-input>
          <el-button type="primary" @click="search">搜 索</el-button>
        </div>
        <div class="material_wrapper" ref="materialWrapper" v-loading="materialLoading" :style="{'overflow-y': materialLoading ? 'hidden' : 'auto'}">
            <template v-if="materialResultList.length">
              <waterfall :col='3' :width="245" :gutterWidth="10" :data="materialResultList" :isTransition="false" v-if="!materialLoading">
                <template >
                  <div class="cell-item" :class="{'img_active':  materialSelectedItem && materialSelectedItem.id === item.id, 'img-checked-active': item.checked, 'cell-item-checkbox': isCheckbox}" v-for="(item,key) in materialResultList" :key="key" @click="selectImg(item)">
                    <img :src="item.filePath" alt="加载错误"/> 
                    <div class="item-body">
                        <div class="item-desc">{{item.fileName}}</div>
                    </div>
                    <div class="item-checkbox" v-if="isCheckbox">
                      <el-checkbox v-model="item.checked" @change="checkboxChange(item)">{{item.checked ? '已选择' : '选择'}}</el-checkbox>
                    </div>
                  </div>
                </template>
              </waterfall>
            </template>
            <p class="empty" v-else>暂无数据</p>
        </div>
        <p class="pages" v-if="materialResultList.length">
            <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="materialCurrentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="materialPageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="materialTotal*1"
            class="page_nav">
            </el-pagination>
        </p>
      </div>
</template>

<script>
import utils from "@/utils";
export default {
  name: "dialogSelectImageMaterials",
  props: ['max', 'isHave', 'isCheckbox', 'cid'],
  data() {
    return {
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象

      /* 素材库 */
      materialLoading: true,  //获取图片列表的loading
      materialResultList: [], //素材库列表数据
      materialCurrentPage:1,  //素材库当前页
      materialPageSize:10,   //素材库一页条数
      materialTotal:0,  //素材库总条数
      materialName: '',  //素材库文件名称，用于检索
      materialGroupId:'0',  //素材库分组id
      cascaderProps: {  //级联选择器属性
        lazy: true,  //是否懒加载
        checkStrictly: true,  //是否严格的遵守父子节点不互相关联
        lazyLoad: this.cascaderLazyload
      },
      materialTabInited: true,  //素材库点击tab初始化
      materialSelectedItem: null, //素材库选中的图片对象（最终发送给调用页面的结果）
    };
  },
  
  created() {
    this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
  },
  mounted() {
    this.preLoadObj = new Image();
  },
  methods: {

    /**************************** 多选相关 *******************************/

    //选择切换
    checkboxChange(item) {
      console.log(item.checked)
      console.log(item)
    },

    /**************************** 列表数据拉取相关 *******************************/
    initHandler() {
      this.imgNow = 0;
      if(!this.materialTabInited) {
        this.materialTabInited = true;
        this.materialGroupId = '0';
        this.fetchMaterial();
      }
      //如果是单选，则每次切换后当前选中的数据变为当前tab下的
      if(!this.isCheckbox){
        this.$emit('selectedItemUpdate', this.materialSelectedItem, 'filePath');
      }
    },

    /* 查询素材库图片 */
    fetchMaterial(startIndex, pageSize) {
      this.materialLoading = true;
      this.imgNow = 0;
      this._apis.file.getMaterialList({
        fileGroupInfoId:this.materialGroupId == '0'?'':this.materialGroupId || '',
        startIndex: startIndex,
        pageSize: pageSize,
        sourceMaterialType:"0",
        fileName: this.materialName
      }).then((response)=>{
        this.materialSelectedItem = null;
        this.$emit('selectedItemUpdate', null, 'filePath');
        this.materialResultList = response.list;
        this.preload(response.list, 'filePath');
        this.materialTotal = response.total;
      }).catch((error)=>{
        this.$message.error(error);
        this.materialLoading = false;
      });
    },

    //查询素材库分组
    getMaterialGroups(parentId, callback){
      this._apis.file.getGroup({
        type:'0',
        parentId
      }).then((response)=>{
        callback && callback(response);
      }).catch((error)=>{
        this.$message.error(error);
      })
    },
    /**************************** 瀑布流相关 *******************************/

    /* 选中图片 */
    selectImg(item) {
      //如果是多选，则不可选中图片，只能通过checkbox选择
      if(this.isCheckbox){
        return;
      }
      this.materialSelectedItem = item;
      this.$emit('selectedItemUpdate', item, 'filePath');
    },

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        _self.materialLoading = false;
        return;
      }
      this.preLoadObj.src = data[this.imgNow][name];
      this.preLoadObj.onerror = function () {
          console.log("图片加载失败");
          _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.materialLoading = false;
                return;
            }
      }
      this.preLoadObj.onload = function () { 
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.materialLoading = false;
                return;
            }
        };

    },

    /*************************** 分页相关  ****************************/

    /* 分页大小改变 */
    handleSizeChange(val){
      this.materialPageSize = val || this.materialPageSize;
      this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
    },

    /* 当前页改变 */
    handleCurrentChange(pIndex){
      this.materialCurrentPage = pIndex || this.materialCurrentPage;
      this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
    },

    /************************ 素材库分组，级联选择器分相关   **********************/

    /* 级联选择器选中改变，赋值给分组id，用于获取图片列表 */
    cascaderChange(value) {
      let val=value.length-1;
      this.materialGroupId = value[val];
    },

    /* 级联选择器懒加载回调 */
    cascaderLazyload(node, resolve) {
      const { level } = node;
      const { data } = node;
      let parentId = data ? data.value : '0';
      this.materialGroupId = data ? data.value: '0';
      this.getMaterialGroups(parentId, (response)=>{
        let nodes = level === 0 ?[{
          value: '0',
          label: '全部',
          leaf: true
        }] : [];
        if(response && Array.isArray(response)) {
          for(let item of response) {
            nodes.push({
              value: item.id,
              label: item.name
            })
          }
        }
        // 通过调用resolve将子节点数据返回，通知组件数据加载完成
        resolve(nodes);
      });
    },
    //搜索
    search() {
      this.materialCurrentPage = 1;
      this.fetchMaterial(this.materialCurrentPage, this.materialPageSize);
    }
  }
};
</script>

<style lang="scss" scoped>
/* *******************************素材库样式*********************************** */
.pages{
  text-align: center;
  margin-top: 45px;
  /deep/ .el-pagination__editor.el-input {
    width: 50px;
  }
}
.empty{
  text-align: center;
  margin-top: 100px;
  color: #b6b5c8;
}
.material_head{
  margin-bottom:20px;
  display: flex;
    flex-direction: row;
    .select{
      display: flex;
      padding-left: 5px;
      margin-right:20px;
    }
    .el-input{
      margin-right:20px;
    }
    .upload-demo{
      width:100%;
      position:relative;
      .el-upload{
        position: absolute;
        right: 20px;
        top: -65px;
      }
      .el-upload-list{
        .el-upload-list__item {
            width: 100% !important;
            height: 30px !important;
            text-align: left;
            background: #f1efef;
        }
      }
    }
}
.material_wrapper{
  max-height:390px;
  min-height:200px;
  overflow-y: auto;
  .cell-item {
    width: 100%;
    background: #fff;
    border: 1px solid #efeaea;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-bottom: 10px;
    cursor: pointer;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      max-width: 100%;
      @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        /* 兼容IE10和IE11 */
        height:100%;
      }
    }
    .item-body{
      padding: 10px 0;
      position: relative;
      width: 100%;
      height: 18px;
      background: rgba(0,0,0,0.39);
      .item-desc{
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        height: 100%;
        color: #fff;
        text-align: center;
        line-height: 18px;
        position: absolute;
        bottom: 0;
        left: 0;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .item-checkbox {
      width: 100%;
      height: 30px;
      padding-left: 5px;
      line-height: 30px;
      text-align: left;
    }
  }
  .cell-item-checkbox {
    cursor: default;
  }
  .img_active{
    border: 2px dashed $globalMainColor!important;
  }
  .img-checked-active {
    border: 2px solid $globalMainColor!important;
  }
}
</style>