/* 系统素材 */
<template>
  <div>
    <div class="icon_head">
      <span class="title">图标分组</span>
      <div class="select">
        <el-select v-model="systemGroupId" placeholder="全部">
          <el-option value="">全部</el-option>
          <el-option
              v-for="item in systemGroupList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
        </el-select>
      </div>
      <el-button type="primary" @click="fetchSystemIcon">搜 索</el-button>
    </div>
    <div class="icon_wrapper" ref="systemWrapper" v-loading="localLoading">
      <template v-if="systemResultList.length">
          <div style="display:none">{{systemSelectedItem}}</div>
          <ul v-if="!localLoading">
            <li class="cell-item" :class="{'img_active': systemGroupId === systemLoadedGroupId ?  (systemRecordMap[systemGroupId] && systemRecordMap[systemGroupId].id === item.id) : (systemRecordMap[''] && systemRecordMap[''].id === item.id)}" v-for="(item,key) in systemResultList" :key="key" @click="selectImg(item)">
              <img :src="item.address" alt="加载错误"/> 
              <!-- <p class="item-desc">{{item.id}}</p> -->
            </li>
          </ul>
      </template>
      <p class="empty" v-else>暂无数据</p>
    </div>
    <p class="pages" v-if="systemResultList.length">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="systemCurrentPage"
        :page-sizes="[48, 96, 144, 240, 480]"
        :page-size="systemPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="systemTotal*1"
        class="page_nav">
        </el-pagination>
    </p>
  </div>
</template>

<script>
import utils from "@/utils";
export default {
  name: "dialogSelectImageSystem",
  props: ['max', 'isHave', 'isCheckbox', 'cid'],
  data() {
    return {
     imgNow: 0,  //当前预加载的第几张
     preLoadObj: null,  //预加载对象

      /* 系统图库 */
      localLoading: true, //系统图库loading
      systemResultList: [], //系统图库列表图片数据
      systemPageSize:48,    //系统图库一页条数
      systemCurrentPage:1,   //系统图库当前页
      systemTotal:0,  //系统图库总条数
      systemGroupId:'',  //系统图库分组id
      systemGroupList:[],  //系统图库分组列表
      systemTabInited: false,  //系统图标点击tab初始化
      systemSelectedItem: null, //系统图标选中的图片对象（最终发送给调用页面的结果）
      systemRecordMap: {},  //系统图标库选中记录表,
      systemLoadedGroupId: ''  //加载后确认的系统图标分组Id
    };
  },
  watch:{
    //切换系统图标分组分页重置
    systemGroupId(newValue) {
      this.systemCurrentPage = 1;
      this.systemTotal = 0;
    }

  },
  created() {
    
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
      if(!this.systemTabInited) {
        this.systemTabInited = true;
        this.getSystemIconGroups();
        this.fetchSystemIcon();
      }
      //如果是单选，则每次切换后当前选中的数据变为当前tab下的
      if(!this.isCheckbox){
        this.$emit('selectedItemUpdate', this.systemSelectedItem, 'address');
      }
    },

    /* 查询系统图库 */
    fetchSystemIcon() {
      this.localLoading = true;
      this.imgNow = 0;
      this._apis.goodsOperate.getSystemIconByGroupId({
        groupId:this.systemGroupId || '',
        startIndex:this.systemCurrentPage,
        pageSize:this.systemPageSize,
      }).then((response)=>{
        this.systemResultList = response.list
        this.systemTotal = response.total
        this.systemLoadedGroupId = this.systemGroupId;

        if(!this.isCheckbox){ //如果是单选时
          this.systemSelectedItem = this.systemRecordMap[this.systemGroupId];
          this.$emit('selectedItemUpdate', this.systemSelectedItem, 'address');
        }
        

        this.preload(this.systemResultList, 'address');
      }).catch((error)=>{
        this.$message.error(error);
        this.localLoading = false;
      });
    },

    //查询系统图库分组
    getSystemIconGroups(){
      this._apis.goodsOperate.getSystemIconGroup({}).then((response)=>{
        this.systemGroupList = response
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
      this.systemSelectedItem = item;
      this.systemRecordMap[''] = item; 
      this.systemRecordMap[item.groupId] = item;
      this.$emit('selectedItemUpdate', item, 'address');
    },

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        _self.localLoading = false;
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
                _self.localLoading = false;
                return;
            }
      }
      this.preLoadObj.onload = function () { 
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.localLoading = false;
                return;
            }
        };

    },


    
    /*************************** 分页相关  ****************************/

    /* 分页大小改变 */
    handleSizeChange(val){
      this.systemPageSize = val || this.systemPageSize;
      this.fetchSystemIcon();
    },

    /* 当前页改变 */
    handleCurrentChange(pIndex){
      this.systemCurrentPage = pIndex || this.systemCurrentPage;
      this.fetchSystemIcon();
    },

  }
};
</script>

<style lang="scss" scoped>

.pages{
  text-align: center;
  margin-top: 45px;
}
.empty{
  text-align: center;
  margin-top: 100px;
  color: #b6b5c8;
}

/* *******************************系统素材样式*********************************** */
.icon_head{
    margin-bottom:20px;
    display: flex;
    flex-direction: row;
    .title{
      font-size:14px;
      font-family:MicrosoftYaHei;
      color:rgba(68,67,75,1);
      margin-right:10px;
      line-height: 30px;
    }
    .select{
      padding-left: 5px;
      margin-right:20px;
    }
}
.icon_wrapper{
  max-height:390px;
  min-height:200px;
  overflow-y: auto;
  ul{
    display: grid;
    grid-template-columns: repeat(8,1fr);
    grid-gap: 10px;
    @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
      /*兼容IE10和IE11*/
      display:flex;
      flex-direction: row;
      flex-wrap: wrap;
    }
    .cell-item {
      width: 100%;
      height: 80px;
      background: rgba(211,211,211,1);
      border: 1px solid transparent;
      cursor: pointer;
      align-items: center;
      position: relative;
      display:flex;
      flex-direction: row;
      justify-content: center;
      @media screen and(-ms-high-contrast:active),(-ms-high-contrast:none){
        /*兼容IE10和IE11*/
        width: 80px;
        margin-top:14px;
        margin-left:14px;
      }
      &:nth-child(8n){
        margin-right:0;
      }
      img{
        width: 80px;
        height:100%;
        object-fit: scale-down;
      }
      .item-desc{
        width: 100%;
        height:18px;
        background:rgba(0,0,0,0.39);
        color:#fff;
        text-align:center;
        line-height:18px;
        position:absolute;
        bottom:0;
        left:0;
      }
    }
    .img_active{
      border: 2px dashed $globalMainColor!important;
    }
  }
}
</style>