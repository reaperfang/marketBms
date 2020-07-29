/* 装修组件常量配置表
 * type: 组件类型（判断组件类型的唯一依据）
 * iconClass: 组件图标className
 * title: 组件标题
 * describe： 组件描述
 * hidden：组件在预览区是否隐藏
 * isBase: 是否是基础组件，基础组件专门用来记录装修页面信息
 * needFakeData: 是否需要渲染假数据
 * hideWidget: 左侧控件是否隐藏(可在此配置表配置，也可在页面渲染入口异步设置，默认为不隐藏)
 * canDelete: 组件是否可删除
 * limit: 组件限制个数(最多可渲染几个此类组件, null代表无限制)
 */
export default {
  widgetList: {

        //隐藏组件
        hiddenWidget: {
          title:'隐藏组件',
          list: [
            {
              type: 'pageInfo',
              iconClass: '',
              title: '页面信息',
              hidden: true,
              isBase: true,
              describe: '',
              needFakeData: false,
              canDelete: false,
              limit: 1
            },
            {
              type: 'classify',
              iconClass: '',
              title: '微页面分类',
              hidden: false,
              isBase: true,
              describe: '',
              needFakeData: false,
              canDelete: false,
              limit: 1
            }
          ]
        },

        //基础组件
        baseWidget: {
          title:'基础组件',
          spread: true,
          list: [
            {
              type: 'richEditor',
              iconClass: 'rich-editor',
              title: '富文本',
              hidden: false,
              isBase: false,
              describe: '富文本展示以实际效果为准，左侧预览仅供参考',
              needFakeData: false,
              canDelete: false,
              limit: 1
            },
            {
              type: 'goods',
              iconClass: 'goods',
              title: '商品',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: false,
              limit: null
            },
            {
              type: 'goodsGroup',
              iconClass: 'goods-group',
              title: '商品分类',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'articleAD',
              iconClass: 'article-ad',
              title: '图片广告',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'cube',
              iconClass: 'cube',
              title: '魔方',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'articleNav',
              iconClass: 'article-nav',
              title: '图文导航',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'text',
              iconClass: 'text',
              title: '文本',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'title',
              iconClass: 'title',
              title: '标题',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            }
          ]
        },

        //营销组件
        saleWidget: {
          title: '营销组件',
          spread: true,
          list: [
            {
              type: 'coupon',
              iconClass: 'coupon',
              title: '优惠券',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'multiPerson',
              iconClass: 'multi-person',
              title: '多人拼团',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'secondkill',
              iconClass: 'second-kill',
              title: '限时秒杀',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'discount',
              iconClass: 'discount',
              title: '限时折扣',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'discountPackage',
              iconClass: 'discountPackage',
              title: '优惠套装',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'fullReduction',
              iconClass: 'full-reduction',
              title: '满减满折',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            },
            {
              type: 'nyuan',
              iconClass: 'nyuan',
              title: 'N元N件',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: true,
              canDelete: true,
              limit: null
            }
          ]
        },


        //其他组件
        otherWidget: {
          title: '其他组件',
          spread: true,
          list: [
            {
              type: 'shopInfo',
              iconClass: 'shop-info',
              title: '店铺信息',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'enterShop',
              iconClass: 'enter-shop',
              title: '进入店铺',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'goodsSearch',
              iconClass: 'goods-search',
              title: '商品搜索',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'notice',
              iconClass: 'notice',
              title: '公告',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'helpLine',
              iconClass: 'help-line',
              title: '辅助线',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'video',
              iconClass: 'video',
              title: '视频',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'helpBlank',
              iconClass: 'help-blank',
              title: '辅助空白',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            },
            {
              type: 'buyNotice',
              iconClass: 'buy-notice',
              title: '购买公告',
              hidden: false,
              isBase: false,
              describe: '',
              needFakeData: false,
              canDelete: true,
              limit: null
            }
          ]
        },

      },

      /* 获取所有控件列表 */
      getWidgetList() {
        const widgetList = [];
        for(let k in this.widgetList){
          for(let item of this.widgetList[k].list) {
            widgetList.push(item);
          }
        }
        return widgetList;
    },

    /* 获取需要假数据的控件列表 */
    getNeedFakeDataWidget() {
      const widgetList = [];
        for(let k in this.widgetList){
          for(let item of this.widgetList[k].list) {
            if(item.needFakeData) {
              widgetList.push(item);
            }
          }
        }
        return widgetList;
    },

    /* 获取需要假数据的控件类型列表 */
    getNeedFakeDataWidgetTypes() {
      let needFakeDataWidget = [];
      this.getNeedFakeDataWidget().forEach((item)=>{
        needFakeDataWidget.push(item.type);
      });
      return needFakeDataWidget;
    }
};
