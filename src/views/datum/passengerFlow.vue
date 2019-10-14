<template>
  <div class="p_container">
      <div class="clearfix">
          <div class="fr">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '客流分析', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '客流分析', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '客流分析', '公众号']">公众号</el-radio-button>
            </el-radio-group>
          </div>
      </div>
        <div class="pane_container">
          <div class="p_line">
            <el-radio-group v-model="nearDay" @change="changeDay">
              <el-radio-button class="btn_bor" label="7">最近7天</el-radio-button>
              <el-radio-button class="btn_bor" label="15">最近15天</el-radio-button>
              <el-radio-button class="btn_bor" label="30">最近30天</el-radio-button>
              <el-radio-button class="btn_bor" label="4">自定义时间</el-radio-button>
            </el-radio-group>
            <div class="input_wrap" v-if="nearDay == 4">
              <el-date-picker
                v-model="range"
                type="daterange"
                range-separator="—"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeTime"
              ></el-date-picker>
            </div>
          </div>
          <div class="btn_tabs clearfix">
            <el-radio-group class="fr" v-model="analysisType" @change="changeType">
              <el-radio-button class="btn_bor" label="1">浏览量/访问量</el-radio-button>
              <el-radio-button class="btn_bor" label="2">到店时段</el-radio-button>
              <el-radio-button class="btn_bor" label="3">访问次数</el-radio-button>
              <el-radio-button class="btn_bor" label="4"  v-if="visitSourceType ==0 ">访问来源</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart_container">
            <pfChart 
            :title="'测试图表'" 
            ref="prChart"
            :dataChart="dataChart"
            :type="analysisType"
            >
            </pfChart>
          </div>
        </div>
        <div class="btn_tabs clearfix" style="margin-top:40px;">
            <el-radio-group class="fr" v-model="duration" @change="changeDp">
              <el-radio-button class="btn_bor" label="1">停留时长</el-radio-button>
              <el-radio-button class="btn_bor" label="2">跳出率</el-radio-button>
            </el-radio-group>
        </div>
        <div>
            <durationChart 
            :title="'测试图表'" 
            ref="dtChart"
            :dataChart="dataChart1"
            :type="duration">
            </durationChart>
        </div>
  </div>
</template>
<script>
import {GetDateStr} from "@/utils/validate.js"
import pfChart from "./components/pfChart";
import durationChart from "./components/durationChart";
export default {
  name: "passengerFlow",
  components: { pfChart,durationChart },
  data() {
    return {
      activeName: "first",
      range: "",
      startTime: "",
      endTime:"",
      visitSourceType: 0, //1 小程序 2 公众号
      analysisType:'1', //数据类型
      nearDay: 7, 
      dataChart: {},
      dataChart1:{},
      title:'浏览/访问',
      duration:'1',
      channel:0,
      type:1
    };
  },
  created() {
    this.init()
  }, 
  methods: {
    init(){
      this.getFlowAnalysis()
      this.getResidetime()
    },
    //浏览量/访问量
    getFlowAnalysis(){
      let data = {
          channel:this.visitSourceType,
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.flowAnalysis(data).then(response => {
        this.dataChart = response
      }).catch(error => {
        this.$message.error(error);
      });
    },

    //到店时段
    getUvhour(){
      let data = {
          channel:this.visitSourceType,
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.uvhour(data).then(response => {
        this.dataChart = response
      }).catch(error => {
        this.$message.error(error);
      });
    },

    //访问次数
    getPvady(){
      let data = {
          channel:this.visitSourceType,
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.pvady(data).then(response => {
        this.dataChart = response
      }).catch(error => {
        this.$message.error(error);
      });
    },

    //访问来源
    getChannel(){
      let data = {
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.channel(data).then(response => {
          this.dataChart = response
        }).catch(error => {
          this.$message.error(error);
        });
    },

    //停留时长
    getResidetime(){
       let data = {
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.residetime(data).then(response => {
          this.dataChart1 = response
        }).catch(error => {
          this.$message.error(error);
        });
    },

    //跳出率
    getPathOut(){
        let data = {
          startTime: this.startTime,
          endTime: this.endTime,
          nearDay: this.nearDay  == '4' ? null : this.nearDay,
        };
      this._apis.data.bouncerate(data).then(response => {
            this.dataChart1 = response
        }).catch(error => {
          this.$message.error(error);
        });
    },

    //浏览量/访客量 or 到店时段 or 访问次数 or 访问来源
    changeType(e) {
      switch (e) {
        case '1':
          this.getFlowAnalysis()
          break;
        case '2':
          this.getUvhour()
          break;
        case '3': 
            this.getPvady()
            break;
        case '4': 
            this.getChannel()
            break;
      }
    },

    //停留时长 or 跳出率
    changeDp(e){
      switch(e){
        case '1':
          this.getResidetime()
          break;
        case '2':
          this.getPathOut()
          break;
      }
    },

    //全部 or  小程序  or  公众号
    all() {
      this.changeType(this.analysisType)
    },


    //最近7天 or  最近15天  or 最近30天 or 自定义时间
    changeDay() {
      if(this.nearDay != 4){
        this.startTime = ''
        this.endTime = ''
        this.changeType(this.analysisType)
        this.changeDp(this.duration)
      }
    },

    //自定义时间选择
    changeTime(val){
      this.startTime = val[0];
      this.endTime = val[1];
      this.changeType(this.analysisType)
      this.changeDp(this.duration)
    },  
  },
};
</script>
<style lang="scss" scoped>
.p_container {
  padding: 20px;
  background-color: #fff;
  .pane_container {
    .p_line {
      .input_wrap {
        width: 350px;
        display: inline-block;
      }
      span {
        color: #655eff;
        margin-left: 20px;
      }
    }
    .btn_tabs {
      margin: 30px 0 22px 0;
      .active_btn {
        background: rgba(101, 94, 255, 0.1);
        color: #655eff;
      }
      .btn_bor {
        // margin: 0 10px;
        border-radius: 20px;
      }
    }
    .chart_container {
      padding-top: 20px;
      border-top: 1px dashed #d3d3d3;
    }
  }
}
</style>

