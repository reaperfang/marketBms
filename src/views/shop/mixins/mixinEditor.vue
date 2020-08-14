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

    /* 检测基础信息 */
    // checkBaseInfo(data) {
    //   if (this.baseInfo.vError || !data.name || !data.title || !data.explain) {
    //     this.$alert('请填写基础信息后重试，点击确认返回编辑页面信息!', '警告', {
    //       confirmButtonText: '确定',
    //       callback: action => {
    //         //打开基础信息面板
    //         this.$store.commit('setCurrentComponentId', this.basePropertyId);
    //         this.setLoading(false);
    //       }
    //     });
    //     return false;
    //   }
    //   return true;
    // },

    /* 检测组件有回调函数则执行 */
    checkComponents(data) {
      for(let item of this.componentDataIds) {
        const componentData = this.componentDataMap[item];
        const saveCallBack = componentData.data.saveCallBack;
        if(!!saveCallBack && !saveCallBack(componentData.data, this)){
          this.$store.commit('setCheckErrorId', uuidv4());
          this.$store.commit('setCurrentComponentId', componentData.id);
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
            this.$store.commit('setCurrentComponentId', componentData.id);
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
