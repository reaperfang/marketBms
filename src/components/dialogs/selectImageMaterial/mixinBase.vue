<script>
import '@/styles/image-material.scss'
export default {
  name: "mixinBase",
  props: ['max', 'isHave', 'isCheckbox', 'cid'],
  data() {
    return {
      imgNow: 0,  //当前预加载的第几张
      preLoadObj: null,  //预加载对象
      scrollTop: 0, //记录滚动条位置
      loading: true,  //获取图片列表的loading
      currentPage:1,  //当前页
      total:0,  //素材库总条数

      selectedItem: null, //选中的图片对象（最终发送给调用页面的结果）
    }
  },
  activated() {
    this.imgNow = 0;
    //保持滚动到的位置
    this.$refs.wrapper.scrollTop = this.scrollTop;

    //如果是单选，则每次切换后当前选中的数据变为当前tab下的
    if(!this.isCheckbox){
      console.log(this.imgSrcKey)
      this.$emit('selectedItemUpdate', this.selectedItem, this.imgSrcKey);
    }
  },
  created() {
    this.preLoadObj = new Image();
  },
  methods: {
    /*************************** 分页相关  ****************************/

    /* 分页大小改变 */
    handleSizeChange(val){
      this.pageSize = val || this.pageSize;
      this.fetch();
    },

    /* 当前页改变 */
    handleCurrentChange(pIndex){
      this.currentPage = pIndex || this.currentPage;
      this.fetch();
    },

    /**************************** 瀑布流相关 *******************************/

    /* 预加载 */
    preload(data, name) {
      const _self = this;
      if(!data.length) {
        //全部加载失败 
        _self.loading = false;
        return;
      }
      this.preLoadObj.src = data[this.imgNow][name];
      this.preLoadObj.onerror = function () {
          console.log("图片加载失败");
          _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.loading = false;
                return;
            }
      }
      this.preLoadObj.onload = function () { 
            _self.imgNow++;              
            if ( _self.imgNow < data.length ) {  //  如果还没有加载到最后一张
                _self.preload(data, name);          //  递归调用自己
            } else {                            //  已经加载到最后一张
                //全部加载完成 
                _self.loading = false;
                return;
            }
        };

    },
  }
};
</script>	
