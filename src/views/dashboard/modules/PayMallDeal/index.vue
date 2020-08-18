<template>
  <div class="grid-content  flex-column">
    <el-row type="flex" justify="space-between" class="item-start">
      <el-col :span="24">
        <vpay></vpay>
      </el-col>
    </el-row>
    <el-row class="item-end">
      <div class="maill-deal-s">
        <el-row class="box-item-start">
          <el-col :span="24">
            <gridtitle :title="'商城成交来源TOP3'"></gridtitle>
          </el-col>
        </el-row>
        <div class="box-item-end">
          <el-row class="fill-height">
            <el-col
              v-for="(item, index) in chartData"
              :key="index"
              :span="8"
              class="v-el-col"
              ><div
                class="grid-content-box bg-purple"
                :style="index == 2 ? '' : 'margin-right:3px'"
              >
                <pchart
                  :progress="item.progress"
                  :city="item.city"
                  :barColor="item.barColor"
                ></pchart>
				</div
            ></el-col>
          </el-row>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import gridtitle from "../../components/title/index";
import vpay from "../../components/pay/index";
// import pchart from "../../components/v-chart/canvaspersent/index";
import pchart from "../../components/v-chart/pie/index";
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  watch: {
    // flowData(val) {
    // }
  },
  props: {
    // data: {
    //   type: Object,
    //   default: false
    // }
  },
  components: { gridtitle, vpay, pchart },
  data: function() {
    return {
      startVal: 0,
      endVal: 1000000,
      chartData: [
        { progress: 75, barColor: "RGBA(255, 0, 139, 1)", city: "北京" },
        { progress: 70, barColor: "RGBA(255, 92, 49, 1)", city: "上海" },
        { progress: 95, barColor: "RGBA(245, 159, 0, 1)", city: "深圳" },
      ]
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {},
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),
  },
};
</script>
<style lang="scss" scoped>
.maill-deal-s {
  // background: yellow;
  height: 100%;
  .box-item-start {
    height: 43px;
  }

  .box-item-end {
    // background: red;
    margin: 0 8px;
    position: absolute;
    top: 43px;
    left: 0;
    bottom: 0;
    right: 0;

    // .bg-purple {
    // 	background: #d3dce6;
    // }
    // .bg-purple-light {
    // 	background: #e5e9f2;
    // }

    .grid-content-box {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .v-el-col {
      height: 100%;
    }

    .fill-height {
      height: 100%;
    }
  }
}
</style>
