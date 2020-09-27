export const orderDeliveryMethods = {
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    reOrder(row) {
      this._apis.order.reOrder({cid: this.cid, orderId: row.orderId}).then((res) => {
          this.getList()
          this.$message.success('重新发单成功！');
      }).catch(error => {
          this.$message.error(error);
      })
    },
    closeOrder(row) {
      this.currentData = row
      this.currentDialog = 'CloseOrderDialog'
      this.dialogVisible = true
  },
  },
  components: {
    
  }
}
