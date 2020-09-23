export const orderDeliveryMethods = {
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  methods: {
    reOrder(row) {

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
