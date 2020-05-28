/* 移动H5商品分类装修 -- 继承自 微信商品分类装修 */
<script>
import goodsGroup from '../wxShop/goodsGroup';
import componentGoodsGroupPageSetting from './editorComps/h5ComponentGoodsGroupPageSetting';
import propertyGoodsGroupPageSetting from './editorComps/h5PropertyGoodsGroupPageSetting';
export default {
  name: "h5GoodsGroup",
  extends: goodsGroup,
  components: {componentGoodsGroupPageSetting, propertyGoodsGroupPageSetting},
}
</script>