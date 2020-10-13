<template>
  <DialogBase
    class="logistics"
    :visible.sync="visible"
    @submit="submit"
    :title="title"
    width="714px"
    :showFooter="showFooter"
    :useHtmlTitle="useHtmlTitle"
  >
    <div class="container">
      <!-- 其他配送方式物流轨迹消息 -->
       <template v-if="deliveryWay!=3">
          <p><span v-if="expressCompanys">物流公司：{{expressCompanys}}</span><span style="margin-left: 5px;">快递单号：{{expressNo}}</span></p>
      <!-- <div class="header">
                <div class="item">时间</div>
                <div class="item">状态</div>
      </div>-->
          <div class="content">
            <template v-if="reject">
                <!-- <div class="reject">未开启轨迹查询服务</div> -->
            </template>
            <template v-else>
              <el-timeline v-show="data.traces.length" :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in data.traces"
                  :key="index"
                  :icon="activity.icon"
                  :type="activity.type"
                  :timestamp="activity.acceptTime"
                >{{activity.acceptStation}}</el-timeline-item>
              </el-timeline>
              <Empty v-show="!data.traces.length"></Empty>
            </template>
          </div>
        </template>
        <!-- 第三方配送时骑手轨迹 -->
        <template v-else>  
          <el-timeline v-show="activities.length" :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :timestamp="activity.createTime"
                  :icon="activity.icon"
                  :type="activity.type"
                >{{activity.acceptStation}}
                <p class="distributionInfo">
                  {{activity.distributorName}}  {{activity.distributorPhone}}
                </p>
                </el-timeline-item>
              </el-timeline>
              <Empty v-show="!activities.length"></Empty>
        </template>
        
    </div>
    <div slot="title">
        <span class="title">物流信息{{this.data | thirdDeliveryWayNameFilter}}</span>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import Empty from "@/components/Empty";
import { sortCreateTime } from "@/utils/base.js";

export default {
  data() {
    return {
      showFooter: false,
      reverse: true,
      activities: [],
      deliveryWay:1,
      useHtmlTitle:true

    };
  },
  filters:{
    thirdDeliveryWayNameFilter(item){
      if(item.deliveryWay==3){
          switch(item.thirdType){
            case 1:
                return "（第三方配送-达达）"
            default:
                return "（第三方配送）"
          }
      }else{
         return ""
      }
    }
  },
  created() {
    this.deliveryWay = this.data.deliveryWay
    debugger
    if(this.deliveryWay==3){
     this.activities= this.data.traces.map((item,index)=>{
       switch(item.status){
         case 1:
           item.acceptStation='等待骑手接单' 
           break
          case 2:
             item.acceptStation='待取货' 
           break
          case 3:
              item.acceptStation='配送中'
              break
          case 4:
              item.acceptStation='已完成'
              break
          case 5:
            item.acceptStation='取消订单'
              break
          case 7:
            item.acceptStation='订单超时'
              break
          case 8:
            item.acceptStation='系统重新指派'
              break
          case 9:
            item.acceptStation= '妥投异常之物品返回中'
             break
          case 10:
            item.acceptStation='妥投异常之物品返回完成 '
             break
          case 1000:
            item.acceptStation= '创建达达运单失败'
            break
       }
      return{
        createTime:item.createTime,
        acceptStation: item.acceptStation,
        distributorName: item.distributorName,
        distributorPhone:item.distributorPhone,
        status:item.status,
        thirdType:this.data.thirdType,
        type: index==0?'primary':'',
        icon: 'el-icon-check',
      }
    })
      this.activities = sortCreateTime(this.activities)
    }else{
      if(this.data.traces.length>0){
        this.data.traces.forEach(item=>{
             item.type = index==0 ?'primary':'';
             item.icon ='el-icon-check';
        })
      }
    }
  },
  methods: {
    submit() {},
    
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
    title() {
      return "提示";
    }
  },
  props: {
    data: {
     
    },
    dialogVisible: {
      type: Boolean,
      required: true
    },
    reject: {},
    expressNo: {},
    expressCompanys: {}
  },
  components: {
    DialogBase,
    Empty
  }
};
</script>
<style lang="scss" scoped>
.reject {
    margin-top: 50px;
    
}
/deep/ .el-timeline{
  transform: translateX(60px);
}
/deep/ .el-timeline-item{
    .el-timeline-item__content,.el-timeline-item__timestamp{
        color:#92929B!important;
      }
}
/deep/.el-timeline-item:first-child{
      .el-timeline-item__content,.el-timeline-item__timestamp{
        color:#44434B!important;
      }
      
  } 
</style>
<style lang="scss">
.logistics {
  .dialog-container {
    text-align: left;
  }
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    p {
        align-self: flex-start;
    }
    .content {
      padding-top: 20px;
    }
  }
  /deep/.el-timeline-item__timestamp.is-bottom{
    position: absolute;
    left: -130px;
    top: -4px;
    color:#92929B;
    font-size:12px;
  }
  .title{
    margin-left:20px;
    font-size:16px;
    color:#44434B;
    font-weight:bold;
  }
  .distributionInfo{
    margin-top:8px;
  }

}
</style>




