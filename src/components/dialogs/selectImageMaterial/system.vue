/* 系统素材 */
<template>
  <div class="imageMaterial">
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
      <el-button type="primary" @click="fetch">搜 索</el-button>
    </div>
    <div class="icon_wrapper" ref="wrapper" v-loading="loading">
      <template v-if="systemResultList.length">
          <div style="display:none">{{selectedItem}}</div>
          <ul v-if="!loading">
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
        :current-page="currentPage"
        :page-sizes="[48, 96, 144, 240, 480]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total*1"
        class="page_nav">
        </el-pagination>
    </p>
  </div>
</template>

<script>
import utils from "@/utils";
import mixinBase from './mixinBase';
export default {
  name: "system",
  mixins: [mixinBase],
  data() {
    return {
      /* 系统图库 */
      systemResultList: [], //系统图库列表图片数据
      pageSize:48,    //系统图库一页条数
      systemGroupId:'',  //系统图库分组id
      systemGroupList:[],  //系统图库分组列表
      systemRecordMap: {},  //系统图标库选中记录表,
      systemLoadedGroupId: '',  //加载后确认的系统图标分组Id

      imgSrcKey: 'address', //接口返回的图片地址路径的参数名称
    };
  },
  watch:{
    //切换系统图标分组分页重置
    systemGroupId(newValue) {
      this.currentPage = 1;
      this.total = 0;
    }

  },
  created() {
    this.getSystemIconGroups();
    this.fetch();
  },
  activated() {
    
  },
  methods: {

    /**************************** 选择相关 *******************************/

    //选择切换
    checkboxChange(item) {
      console.log(item.checked)
      console.log(item)
    },

    /* 选中图片 */
    selectImg(item) {
      //如果是多选，则不可选中图片，只能通过checkbox选择
      if(this.isCheckbox){
        return;
      }
      this.selectedItem = item;
      console.log(item)
      this.systemRecordMap[''] = item; 
      this.systemRecordMap[item.groupId] = item;
      this.$emit('selectedItemUpdate', item, this.imgSrcKey);
    },

    /**************************** 列表数据拉取相关 *******************************/

    /* 查询系统图库 */
    fetch() {
      this.loading = true;
      this.imgNow = 0;
      this._apis.goodsOperate.getSystemIconByGroupId({
        groupId:this.systemGroupId || '',
        startIndex:this.currentPage,
        pageSize:this.pageSize,
      }).then((response)=>{
        this.systemResultList = response.list
        this.total = response.total
        this.systemLoadedGroupId = this.systemGroupId;

        if(!this.isCheckbox){ //如果是单选时
          this.selectedItem = this.systemRecordMap[this.systemGroupId];
          this.$emit('selectedItemUpdate', this.selectedItem, this.imgSrcKey);
        }
        

        this.preload(this.systemResultList, this.imgSrcKey);
      }).catch((error)=>{
        this.$message.error(error);
        this.loading = false;
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

    
  }
};
</script>

<style lang="scss" scoped>


</style>