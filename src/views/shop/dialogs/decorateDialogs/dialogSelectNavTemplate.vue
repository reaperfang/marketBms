/* 选择导航模板弹窗 */
<template>
  <DialogBase :visible.sync="visible" width="460px" :title="'选择导航模板'" @submit="submit">
    <ul>
      <el-radio-group v-model="navType">
        <li v-for="(item, key) of navTypeList" :key="key">
          <div class="title">
            <span>{{item.name}}</span>
            <el-radio :label="item.id"></el-radio>
          </div>
          <div class="demo">
            <img :src="item.img" alt="">
          </div>
        </li>
      </el-radio-group>
    </ul>
  </DialogBase>
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogSelectNavTemplate",
  components: {DialogBase},
  props: {
      data: {},
      dialogVisible: {
          type: Boolean,
          required: true
      },
      navStyleId: {
        type: Number
      }
  },
  data() {
    return {
      navType: this.navStyleId || 1,
      navTypeList: [
        {
          id: 1,
          name: 'APP导航样式',
          img: require('../../../../assets/images/shop/shopNav1.png')
        },
        {
          id: 2,
          name: 'APP导航样式2',
          img: require('../../../../assets/images/shop/shopNav2.png')
        },
        {
          id: 3,
          name: '公众号样式',
          img: require('../../../../assets/images/shop/shopNav3.png')
        }
        // {
        //   id: 4,
        //   name: '隐藏展开样式',
        //   img: require('../../../../assets/images/shop/shopNav4.png')
        // },
      ]
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
    /* 向父组件提交选中的数据 */
    submit() {
      this.$emit("navTypeSelected", this.navTypeList[this.navType - 1]);
    }
  }
};
</script>

<style lang="scss" scoped>
ul{
  width:375px;
  margin:0 auto;
  li{
    border:1px solid rgba(235,235,235,1);
    margin-bottom:20px;
    .title{
      padding:10px 20px;
      box-sizing: border-box;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
      span{
        font-size:14px;
        color:rgba(68,67,75,1);
      }
      /deep/.el-radio__label{
        display:none;
      }
    }
    .demo{
      img{
        width:100%;
      }
    }
  }
}
</style>