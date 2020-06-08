
/* 移动H5商品分类装修属性区 -- 继承自 微信商品分类装修属性区 */
<script>
import propertyGoodsGroupPageSetting from '../../wxShop/editorComps/propertyGoodsGroupPageSetting';
export default {
  name: 'h5PropertyGoodsGroupPageSetting',
  extends: propertyGoodsGroupPageSetting,
  data() {
    return {
      showPreviewCode: false
    }
  }
}
</script>