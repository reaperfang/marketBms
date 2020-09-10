<template>
  <div class="deliver-goods">
    <deliver :data="orderData"></deliver>
  </div>
</template>
<script>
import deliver from "./components/deliver";

export default {
  data() {
    return {
      orderData: {
        deliveryWay: 1,
        list: [],
      }
    };
  },
  created() {
    this.getDetail()
  },
  filters: {},
  computed: {},
  methods: {
    getDetail() {
      let id = this.$route.query.id || this.$route.query.ids;

      this._apis.order
        .orderSendDetail({
          ids: [+this.$route.query.id || +this.$route.query.ids],
        })
        .then((res) => {
          let list
          let shopAddressInfo = res.shopAddressInfo

          list = [...res.sendInfoListData]
          this.orderData.deliveryWay = list[0].deliveryWay
          list.forEach(item => {
            if(!item.sendAddress) {
              if(this.orderData.deliveryWay == 1) {
                item.sendName = shopAddressInfo.name;
                item.sendPhone = shopAddressInfo.mobile;
                item.sendProvinceCode = shopAddressInfo.provinceCode;
                item.sendProvinceName = shopAddressInfo.provinceName;
                item.sendCityCode = shopAddressInfo.cityCode;
                item.sendCityName = shopAddressInfo.cityName;
                item.sendAreaCode = shopAddressInfo.areaCode;
                item.sendAreaName = shopAddressInfo.areaName;
                item.sendAddress = shopAddressInfo.address;
                item.sendDetail = shopAddressInfo.addressDetail;
                item.sendLatitude = shopAddressInfo.latitude
                item.sendLongitude = shopAddressInfo.longitude
              }
            }
          })

          this.orderData.list = list.map(item => ({
            deliveryWay: this.orderData.deliveryWay,
            orderId: this.$route.query.orderId || this.$route.query.id || this.$route.query.ids,
            memberInfoId: item.memberInfoId,
            orderCode: item.orderCode,
            orderItems: item.orderItemList.map(orderItem => ({
              ...orderItem,
              cacheSendCount: orderItem.sendCount,
              sendCount: orderItem.goodsCount - orderItem.sendCount
            })),
            id: item.id,
            memberSn: item.memberSn,
            receivedName: item.receivedName,
            receivedPhone: item.receivedPhone,
            receivedProvinceCode: item.receivedProvinceCode,
            receivedProvinceName: item.receivedProvinceName,
            receivedCityCode: item.receivedCityCode,
            receivedCityName: item.receivedCityName,
            receivedAreaCode: item.receivedAreaCode,
            receivedAreaName: item.receivedAreaName,
            receiveAddress: item.receiveAddress,
            sendAddress: item.sendAddress,
            receivedDetail: item.receivedDetail,
            sendName: item.sendName, // 发货人名称
            sendPhone: item.sendPhone, // 发货人手机号
            sendProvinceCode: item.sendProvinceCode, // 发货省cdoe
            sendProvinceName: item.sendProvinceName, // 发货省名称
            sendCityCode: item.sendCityCode, // 发货城市code
            sendCityName: item.sendCityName, // 发货城市名称
            sendAreaCode: item.sendAreaCode, // 发货区县code
            sendAreaName: item.sendAreaName, // 发货区县名称
            sendDetail: item.sendDetail // 发货人详细地址
          }))


        })
        .catch((error) => {});
    },
  },
  components: {
    deliver,
  },
};
</script>
<style lang="scss" scoped>
</style>

