/* 店铺装修组件常量 */
export default {
  widgetList: {

        hiddenWidget: {
          title:'隐藏组件',
          list: [
            {
              type: 'pageInfo',
              iconClass: '',
              title: '页面信息',
              hidden: true
            },
            {
              type: 'classify',
              iconClass: '',
              title: '微页面分类',
              hidden: true
            }
          ]
        },

        //基础组件
        baseWidget: {
          title:'基础组件',
          list: [
            {
              type: 'richEditor',
              iconClass: 'rich-editor',
              title: '富文本'
            },
            {
              type: 'goods',
              iconClass: 'goods',
              title: '商品'
            },
            {
              type: 'goodsGroup',
              iconClass: 'goods-group',
              title: '商品分类'
            },
            {
              type: 'articleAD',
              iconClass: 'article-ad',
              title: '图片广告'
            },
            {
              type: 'cube',
              iconClass: 'cube',
              title: '魔方'
            },
            {
              type: 'articleNav',
              iconClass: 'article-nav',
              title: '图文导航'
            },
            {
              type: 'text',
              iconClass: 'text',
              title: '文本'
            },
            {
              type: 'title',
              iconClass: 'title',
              title: '标题'
            }
          ]
        },

        //营销组件
        saleWidget: {
          title: '营销组件',
          list: [
            {
              type: 'coupon',
              iconClass: 'coupon',
              title: '优惠券'
            },
            {
              type: 'multiPerson',
              iconClass: 'multi-person',
              title: '多人拼团'
            },
            {
              type: 'secondkill',
              iconClass: 'second-kill',
              title: '限时秒杀'
            },
            {
              type: 'discount',
              iconClass: 'discount',
              title: '限时折扣'
            },
            {
              type: 'discountPackage',
              iconClass: 'discountPackage',
              title: '优惠套餐'
            },
            {
              type: 'fullReduction',
              iconClass: 'full-reduction',
              title: '满减满折'
            },
            {
              type: 'nyuan',
              iconClass: 'nyuan',
              title: 'N元N件'
            }
          ]
        },


        //其他组件
        otherWidget: {
          title: '其他组件',
          list: [
            {
              type: 'shopInfo',
              iconClass: 'shop-info',
              title: '店铺信息'
            },
            {
              type: 'enterShop',
              iconClass: 'enter-shop',
              title: '进入店铺'
            },
            {
              type: 'goodsSearch',
              iconClass: 'goods-search',
              title: '商品搜索'
            },
            {
              type: 'notice',
              iconClass: 'notice',
              title: '公告'
            },
            {
              type: 'helpLine',
              iconClass: 'help-line',
              title: '辅助线'
            },
            {
              type: 'video',
              iconClass: 'video',
              title: '视频'
            },
            {
              type: 'helpBlank',
              iconClass: 'help-blank',
              title: '辅助空白'
            },
            {
              type: 'buyNotice',
              iconClass: 'buy-notice',
              title: '购买公告'
            }
          ]
        },

      },

      getWidgetList() {
        const widgetList = [];
        for(let k in this.widgetList){
          for(let item of this.widgetList[k].list) {
            widgetList.push(item.type);
          }
        }
        return widgetList;
    }
};
