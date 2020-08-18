<template>
  <div class="wrap">
    <div class="item-row" v-for="(item, index) in payData" :key="index">
      <div class="item-col"     v-for="(subItem, subindex) in item.children"
        :key="subindex">
          <vitem :title="subItem.title" :content="subItem.content"></vitem>
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
import vitem from "./item";
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
  components: { vitem },
  data: function() {
    return {
      payData: [
        {
          children: [
            { title: "支付人数", content: "8789" },
            { title: "支付金额", content: "5545" },
            { title: "客单价", content: "54556" },
          ],
        },
        {
          children: [
            { title: "支付订单数", content: "455" },
            { title: "退款金额", content: "45411" },
            { title: "退款订单数", content: "844" },
          ],
        },
      ],
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

<style lang="scss">
.wrap {
  height: 100%;
  display: flex;
  flex-direction: column;

  .item-row {
    height: 100%;
    margin: 10px 0 0 10px;
    display: flex;
    flex-direction: row;
    .item-col {
      flex: 1;
      background: RGBA(4, 25, 50, 1);
      height: 100%;
      margin-right: 10px;
      cursor: pointer;
    }

    .item-col:hover {
      background: rgba(71, 225, 255, 0.05);
      border: 1px solid rgba(6, 201, 221, 1);
    }
  }
}

</style>
