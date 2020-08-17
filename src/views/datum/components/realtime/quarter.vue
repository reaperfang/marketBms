<template>
<div>
<mark
  style="position:fixed;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0);z-index:999;"
  v-show="showSeason"
  @click.stop="showSeason=false"
></mark>
<el-input class="dayinput" placeholder="请选择季度" v-model="showValue" @focus="showSeason=true">
  <i slot="prefix" class="el-input__icon el-icon-date"></i>
</el-input>
<el-card
  class="box-card"
  style="width:320px;padding: 0 3px 20px;margin-top:10px;position: absolute;
    z-index: 9999;
    top: 30px;
    right: 0;box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;border-radius:4px !important;"
  v-show="showSeason"
>
  <div slot="header" class="clearfix" style="text-align:center;padding:0">
    <button
      type="button"
      aria-label="前一年"
      class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
      @click="prev"
    ></button>
    <span role="button" class="el-date-picker__header-label">{{year}}年</span>
    <button
      type="button"
      aria-label="后一年"
      @click="next"
      class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
    ></button>
  </div>
  <div class="text item" style="text-align:center;">
    <el-button
      type="text"
      size="medium" class="quartBut" :class="{'quartClick':(monthcur>=1)}"
      @click="selectSeason(0)" :disabled="!(monthcur>=1)"
    >第一季度</el-button>
    <el-button
      type="text"
      size="medium" class="quartBut" :class="{'quartClick':(monthcur>=2)}"
      @click="selectSeason(1)" :disabled="!(monthcur>=2)"
    >第二季度</el-button>
  </div>
  <div class="text item" style="text-align:center;">
    <el-button
      type="text"
      size="medium" class="quartBut" :class="{'quartClick':(monthcur>=3)}"
      @click="selectSeason(2)" :disabled="!(monthcur>=3)"
    >第三季度</el-button>
    <el-button
      type="text" 
      size="medium" class="quartBut" :class="{'quartClick':(monthcur>=4)}" 
      @click="selectSeason(3)" :disabled="!(monthcur>=4)"
    >第四季度</el-button>
  </div>
</el-card>
</div>
</template>
<script>
/**
 * @file:  View 组件 季节选择控件
 * @author: v_zhuchun
 * @date: 2019-05-23
 * @description: UI组件  可选择季节
 * @api: valueArr : 季度value defalut['01-03', '04-06', '07-09', '10-12'] 默认值待设置
 */
export default {
  props: {
    valueArr: {
      default: () => {
        return ['01-03', '04-06', '07-09', '10-12']
      },
      type: Array
    },
    getValue: {
      default: () => {},
      type: Function
    },
    defaultValue: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      showSeason: false,
      season: '',
      year: new Date().getFullYear(),
      yearcur: new Date().getFullYear(),
      monthcur:Math.ceil((new Date().getMonth()+1)/3),
      showValue: ''
    }
  },
  created() {
    if (this.defaultValue) {
      let value = this.defaultValue
      let arr = value.split('-')
      this.year = arr[0].slice(0, 4)
      let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
      let arrAll = this.valueArr
      this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
    }
  },
  watch: {
    defaultValue: function(value, oldValue) {
      let arr = value.split('-')
      this.year = arr[0].slice(0, 4)
      let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
      let arrAll = this.valueArr
      this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
    }
  },
  methods: {
    one() {
      this.showSeason = false
    },
    prev() {
      this.year = this.year * 1 - 1
      if(this.year<this.yearcur){
        this.monthcur=12
      }
      if(this.year==this.yearcur){
        this.monthcur=Math.ceil((new Date().getMonth()+1)/3)
      }
    },
    next() {
      this.year = this.year * 1 + 1
      if(this.year>this.yearcur){
        this.monthcur=0
      }
      if(this.year==this.yearcur){
        this.monthcur=Math.ceil((new Date().getMonth()+1)/3)
      }
    },
    selectSeason(i) {
      let that = this
      that.season = i + 1
      let arr = that.valueArr[i].split('-')
      that.getValue(that.year + arr[0] + '-' + that.year + arr[1])
      that.showSeason = false
      this.showValue = `${this.year}年${this.season}季度`
      this.$emit("change",`${this.year}-${this.season}`)
    }
  }
}
</script>
<style lang="scss" scoped>
.quartBut{
  width:40%;float:left;
  margin: 10px 5% ;
  padding: 5px 0 !important;
  border-radius:0px !important; 
}
.quartClick{
  color: #161617;
}
.quartClick:hover{
  color: #fff;
  background: #655EFF;
}
</style>