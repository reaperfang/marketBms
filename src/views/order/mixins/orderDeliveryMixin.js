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
      this.currentDialog = 'CloseThirdPartyOrderDialog'
      this.dialogVisible = true
  },
  },
  components: {
    
  }
}
