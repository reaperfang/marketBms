<template>
  <div class="realtime-user row-4-grid-content">
    <!-- <div id="table">
      <ul id="tbody" ref="tbody" :class="{ anim: animate == true }">
        <li v-for="item in items">{{ item.name }}</li>
      </ul>
    </div> -->

    <table class="table">
      <thead class="thead">
        <tr class="tr">
          <th rowspan="2">用户名</th>
          <th rowspan="2">时间</th>
          <th rowspan="2">操作</th>
          <th rowspan="2">商品</th>
        </tr>
      </thead>
      <tbody
        id="tbody"
        ref="tbody"
       
        class="tbody"
      >
        <tr v-for="(item, index) in tableData" class="tr">
          <th  :class="{ anim: animate == true }">{{ index + 1 }}</th>
          <th>Kolumna 2</th>
          <th>Kolumna 3</th>
          <th>Kolumna 4</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
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
  components: {},
  data: function() {
    return {
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市",
        },

        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市",
        },
      ],
      animate: false,
      items: [
        { name: "马云" },
        { name: "雷军" },
        { name: "王勤" },
        { name: "马云2" },
        { name: "雷军2" },
        { name: "王勤2" },
      ],
    };
  },
  computed: {
    //...mapState([""])
  },
  mounted() {
    setInterval(this.scroll, 1000);
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed: function() {},
  methods: {
    //...mapActions([""]),

    scroll() {
      this.animate = true; // 因为在消息向上滚动的时候需要添加css3过渡动画，所以这里需要设置true
      setTimeout(() => {
        //  这里直接使用了es6的箭头函数，省去了处理this指向偏移问题，代码也比之前简化了很多
        this.tableData.push(this.tableData[0]); // 将数组的第一个元素添加到数组的
        this.tableData.shift(); //删除数组的第一个元素
        this.animate = false; // margin-top 为0 的时候取消过渡动画，实现无缝滚动
      }, 500);
    },
  },
};
</script>

<style lang="scss">
.realtime-user {
  height: 100%;
  margin: 0 2px;

  .table {
    border-spacing: 0;
    // border: 1px solid rgba(6, 201, 221, 0.3);
    color: rgba(255, 255, 255, 1);
    width: 100%;
    height: 100%;

    .thead {
      color: #06c9dd;
      .tr {
        th {
          height: 40px;
          text-align: center;
          border: 1px solid rgba(6, 201, 221, 0.1);
        }
      }
    }
    .tbody {
      .tr {
        th {
          background: #000b23;
          height: 35px;
          text-align: center;
          border: 1px solid rgba(6, 201, 221, 0.1);
          // line-height: 30px;
          height: 25px;
          // border:none;
        }

		 &:hover{
		   background: RGBA(26, 39, 61, 1);
	   }
      }

	  
    }
  }

  //修改表格最底部颜色和高度
  //   table::before {
  //     height: 0;
  //   }

  // #table {
  //   width: 100%;
  //   height: 100px;
  //   overflow: hidden;
  //   padding-left: 30px;
  //   border: 1px solid black;
  //   background: white;
  // }
  .anim {
    transition: all 0.5s;
    margin-top: -30px;
  }
  // #tbody tr {
  //   list-style: none;
  //   line-height: 30px;
  //   height: 27px;
  // }
}
</style>
