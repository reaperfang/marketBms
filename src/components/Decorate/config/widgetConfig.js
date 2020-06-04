/* 店铺装修组件常量配置
 * type: 组件type
 * iconClass: 组件图标className
 * title: 组件标题
 * hidden：组件在预览区是否隐藏
 * preLoad: 组件是否预加载
 * isBase: 是否是基础组件，用于记录装修页面信息
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
              preLoad: false,
              isBase: true
            },
            {
              type: 'classify',
              iconClass: '',
              title: '微页面分类',
              hidden: false,
              preLoad: false,
              isBase: true
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
              preLoad: false,
              isBase: false
            },
            {
              type: 'goods',
              iconClass: 'goods',
              title: '商品',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'goodsGroup',
              iconClass: 'goods-group',
              title: '商品分类',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'articleAD',
              iconClass: 'article-ad',
              title: '图片广告',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'cube',
              iconClass: 'cube',
              title: '魔方',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'articleNav',
              iconClass: 'article-nav',
              title: '图文导航',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'text',
              iconClass: 'text',
              title: '文本',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'title',
              iconClass: 'title',
              title: '标题',
              hidden: false,
              preLoad: false,
              isBase: false
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
              preLoad: true,
              isBase: false
            },
            {
              type: 'multiPerson',
              iconClass: 'multi-person',
              title: '多人拼团',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'secondkill',
              iconClass: 'second-kill',
              title: '限时秒杀',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'discount',
              iconClass: 'discount',
              title: '限时折扣',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'discountPackage',
              iconClass: 'discountPackage',
              title: '优惠套装',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'fullReduction',
              iconClass: 'full-reduction',
              title: '满减满折',
              hidden: false,
              preLoad: true,
              isBase: false
            },
            {
              type: 'nyuan',
              iconClass: 'nyuan',
              title: 'N元N件',
              hidden: false,
              preLoad: true,
              isBase: false
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
              preLoad: false,
              isBase: false
            },
            {
              type: 'enterShop',
              iconClass: 'enter-shop',
              title: '进入店铺',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'goodsSearch',
              iconClass: 'goods-search',
              title: '商品搜索',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'notice',
              iconClass: 'notice',
              title: '公告',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'helpLine',
              iconClass: 'help-line',
              title: '辅助线',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'video',
              iconClass: 'video',
              title: '视频',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'helpBlank',
              iconClass: 'help-blank',
              title: '辅助空白',
              hidden: false,
              preLoad: false,
              isBase: false
            },
            {
              type: 'buyNotice',
              iconClass: 'buy-notice',
              title: '购买公告',
              hidden: false,
              preLoad: false,
              isBase: false
            }
          ]
        },

      },

      getWidgetList() {
        const widgetList = [];
        for(let k in this.widgetList){
          for(let item of this.widgetList[k].list) {
            widgetList.push(item);
          }
        }
        return widgetList;
    }
};
