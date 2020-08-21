<script>
import widget from '@/components/Decorate/config/widgetConfig';
import SAVE_BLACK_LIST from '@/components/Decorate/config/saveBlackList'
export default {
  name: "mixinEditor",
  methods: {
    /* 清洗数据 */
    washData(data) {
      let copyData = [...data.pageData];
      for(let item of copyData) {

        /* 图片广告清除无图片或者图片地址无效的数据（临时需求2020/7/7）start  */
        if(item.type === 'articleAD') {
          this.deleteEmptyArticleAD(item);
        }
        /* 图片广告清除无图片或者图片地址无效的数据（临时需求2020/7/  end  */

        const keys = Object.keys(item.data);
        for(let item2 of keys) {
          if(SAVE_BLACK_LIST.includes(item2)) {
            delete item.data[item2];
          }
        }
      }
      data.pageData = copyData;
    },

    /* 删除空的图文广告（临时需求） */
    deleteEmptyArticleAD(data) {
      const templateItemList = [...data.data.itemList];
      for(let i=0;i<templateItemList.length;i++) {
        if(!templateItemList[i].url || !this.utils.validate.isURL(templateItemList[i].url) || !this.utils.validate.isPic(templateItemList[i].url)) {
          templateItemList.splice(i, 1);
          i--;
        }
      }
      data.data.itemList = templateItemList;
    },

    /* 检测组件有回调函数则执行 */
    checkComponents(data) {
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        const saveCallBack = componentData.data.saveCallBack;
        if(!!saveCallBack && !saveCallBack(componentData)){
          this.$store.commit('setCheckErrorId', uuidv4());
          setTimeout(() => {
            //如果是当前编辑区，没有发生切换，则时长为0
            let wait = 0;
            //如果是切换编辑区，则时长需要设置长一些，以此来保证获取到的offsetTop是准确的
            if(this.$store.getters.currentComponentId !== componentData.id){
              wait = 280;
            }

            this.$store.commit('setCurrentComponentId', componentData.id);

            //延时执行，待右侧属性编辑区加载完成以便获取到具体第一个错误容器，来达到定位效果
            setTimeout(()=>{
              const errorTag = document.querySelector('.is-error');
              if(errorTag){
                const container = document.querySelector('.props_form');
                const top = errorTag.offsetTop - 58;
                container.scrollTo({
                  top: top,
                  behavior: "smooth"
                });
              }
            }, wait)
          })
          this.setLoading(false);
          return false;
        }
      }
      return true;
    },

    /* 检测假数据 （使用模板装修时）*/
    checkFakeData(data) {
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        if(widget.getNeedFakeDataWidgetTypes().includes(componentData.type)) {
          if(componentData.data.needReplace) {
            setTimeout(() => {
              this.$store.commit('setCurrentComponentId', componentData.id);
            })
            this.$alert(`【${componentData.title} - ${componentData.id.substring(componentData.id.length - 6)}】组件尚未更换真实数据，请在右侧选择真实数据后重试`, '提示', {
              confirmButtonText: '确定',
              callback: action => {
                //打开基础信息面板
                this.setLoading(false);
              }
            });
            return false;
          }
        }
      }
      return true;
    },
  }
};
</script>	
