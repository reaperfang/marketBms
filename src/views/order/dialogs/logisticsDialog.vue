<template>
  <DialogBase
    class="logistics"
    :visible.sync="visible"
    @submit="submit"
    :title="title"
    width="714px"
    :showFooter="showFooter"
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
                <div class="reject">未开启轨迹查询服务</div>
            </template>
            <template v-else>
              <el-timeline v-show="data.length" :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in data"
                  :key="index"
                  :timestamp="activity.acceptTime"
                >{{activity.acceptStation}}</el-timeline-item>
              </el-timeline>
              <Empty v-show="!data.length"></Empty>
            </template>
          </div>
        </template>
        <!-- 第三方配送时骑手轨迹 -->
        <template v-else>
          <p>
            <span>物流信息</span>
            <span v-if="activities[0].status!=1" style="margin-left: 15px;">第三方配送{{data.thirdType | thirdDeliveryWayNameFilter}}
            </span>
            <span v-if="activities[0].status==1" style="margin-left: 15px;">第三方配送
            </span>
          </p>
          <el-timeline v-show="activities.length" :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  :timestamp="activity.acceptTime"
                >{{activity.acceptStation}}
                <p>
                  {{activity.distributorName}}  {{activity.distributorPhone}}
                </p>
                </el-timeline-item>
              </el-timeline>
              <Empty v-show="!activities.length"></Empty>
        </template>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import Empty from "@/components/Empty";

export default {
  data() {
    return {
      showFooter: false,
      reverse: true,
      activities: [],
      deliveryWay:1,
  
    };
  },
  filters:{
    thirdDeliveryWayNameFilter(type){
      switch(type){
        case 1:
          return '达达'
      }

    }
  },
  created() {
    this.deliveryWay = this.data.deliveryWay
    this.data.tracks=this.activities = [
        {
          cid: "2",
          acceptTime:"2020-09-23 19:50:54",
          createUserId: '2',
          acceptStation: '等待骑手接单2',
          distributorName: "",
          distributorPhone: "",
          status:1
      },
      {
          cid: "2",
          acceptTime:"2020-09-23 19:50:54",
          createUserId: '3',
          acceptStation: '等待骑手接单3',
          distributorName: "222",
          distributorPhone: "2222",
          status:2

      },
      {
          cid: "2",
          acceptTime:"2020-09-23 19:50:54",
          createUserId: '4',
          acceptStation: '等待骑手接单4',
          distributorName: "222",
          distributorPhone: "2222",
          status:3
      },
      {
          cid: "2",
          acceptTime:"2020-09-23 19:50:54",
          createUserId: '4',
          acceptStation: '等待骑手接单5',
          distributorName: "222",
          distributorPhone: "2222",
          status:1
      },
      
    ]
     this.activities= this.data.tracks.map(item=>{
  
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
        cid: "2",
        acceptTime:item.acceptTime,
        acceptStation: item.acceptStation,
        distributorName: item.distributorName,
        distributorPhone:item.distributorPhone
      }
    })
    
  },
  methods: {
    submit() {}
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
    top: 0px;
  }
}
</style>




