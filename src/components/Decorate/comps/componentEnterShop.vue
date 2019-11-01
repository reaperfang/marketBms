<template>
  <!-- 进入店铺 -->
  <div class="componentEnterShop" v-if="currentComponentData && currentComponentData.data">
    <div class="group_shop">
      <ul>
        <li>
          <img :src="shopInfo.logoCircle || shopInfo.logo" alt />
        </li>
        <li class="ellipsis">{{shopInfo.shopName || '店铺名称'}}</li>
        <li class="ellipsis">{{currentComponentData.data.words}}</li>
        <li>
          <img src="@/assets/images/shop/triangle.png" alt />
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentEnterShop',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      
    }
  },
  created() {
    this.$store.dispatch('getShopInfo');
  },
  computed: {
    shopInfo() {
      return this.$store.getters.shopInfo || {};
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componentEnterShop {
  & > .group_shop {
    & > ul {
      padding: 10px;
      background: #fff;
      display: flex;
      & > li {
        height: 40px;
        line-height: 40px;
      }
      & > li:nth-child(1) {
        flex: 0 0 52px;
        & > img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 20px;
          float: left;
          overflow: hidden;
          border:1px solid #ddd;
        }
      }
      & > li:nth-child(2) {
        font-size: 15px;
        color: #1c1d1f;
        flex: 0 0 150px;
      }
      & > li:nth-child(3) {
        flex: 0 0 140px;
        font-size: 14px;
        color: #fc3d42;
        text-align: right;
      }
      & > li:last-child {
        flex: 1;
        & > img {
          width: 6px;
          height: 12px;
          display: inline-block;
          margin-left: 8px;
          margin-top: 14px;
        }
      }
    }
  }
}
</style>
