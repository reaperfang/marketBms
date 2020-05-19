/* 移动H5店铺首页 -- 继承自 微信店铺首页 */
<script>
import shopMainDefault from './h5ShopMainDefault';
import shopMainDecorated from './h5ShopMainDecorated';
import personCenter from './h5PersonCenter';
import goodsGroup from './h5GoodsGroup';
import shopNavIndex from './h5ShopNavIndex';
import wxShopIndex from '../wxShop/wxShopIndex';
import utils from "@/utils";
export default {
  name: 'h5ShopIndex',
  components: {shopMainDefault, shopMainDecorated, personCenter, goodsGroup, shopNavIndex},
  extends: wxShopIndex,
  data() {
    return {
      ruleForm: {
        pageTag: 1,
        webPageStatus: 0  //未绑定过域名
      }
    }
  },
  methods: {
    // getH5StoreStatus() {
    //   this.shop.getH5StoreStatus().then((response)=>{
    //     this.webPageStatus = response.webPageStatus;
    //   }).catch((error)=>{
    //     console.error(error);
    //     this.loading = false;
    //   });
    // }
  }
}
</script>