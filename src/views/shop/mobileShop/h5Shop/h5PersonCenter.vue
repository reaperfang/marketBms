/* 移动H5个人中心装修 -- 继承自 微信个人中心装修 */
<script>
import personCenter from '../wxShop/personCenter'
import componentUserCenter from './editorComps/h5ComponentUserCenter';
import propertyUserCenter from './editorComps/h5PropertyUserCenter';
export default {
  name: "h5PersonCenter",
  extends: personCenter,
  components: {componentUserCenter, propertyUserCenter},
}
</script>