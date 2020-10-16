export const afterSalesManagementMethods = {
  data() {
    return {
      updateStatusDisabled: false
    }
  },
  computed: {
    
  },
  methods: {
    drawback(row) {
      this._apis.order.orderAfterSaleDrawback({id: row.id, memberInfoId: row.memberInfoId}).then((res) => {
          console.log(res)
          this.$message.success('已发起退款，系统处理中。');
          this.getList()
      }).catch(error => {
          this.$message.error(error);
      }) 
    },
    updateStatus(row) {
      if(!this.updateStatusDisabled) {
          this.updateStatusDisabled = true

          let _orderAfterSaleStatus

          if(row.type == 3) {
              _orderAfterSaleStatus = 2
          } else {
              _orderAfterSaleStatus = 1
          }
          if(row.type == 2) {
              let _row = JSON.parse(JSON.stringify(row))

              this.currentDialog = 'ExchangeGoodsDialog'
              this.currentData = _row;
              this.currentData.orderAfterSaleStatus = _orderAfterSaleStatus;
              this.dialogVisible = true
              return
          }
          this._apis.order.orderAfterSaleUpdateStatus({id: row.id, orderAfterSaleStatus: _orderAfterSaleStatus}).then((res) => {
              if(this.$route.name == 'afterSalesManagement') {
                this.getList();
              } else if(this.$route.name == 'afterSalesDetails') {
                this.getDetail()
              }
              this.$message.success('审核成功！');
              this.updateStatusDisabled = true
          }).catch(error => {
              this.$message.error(error);
          })
      }
    },
    updateRejectStatus(row) {
      this.currentDialog = 'RejectDialog'
      this.currentData = row
      this.title = '拒绝审核'
      this.dialogVisible = true
    },
    rejectHandler(value) {
      this._apis.order.orderAfterSaleUpdateStatus({id: this.currentData.id, orderAfterSaleStatus: 5, refuseReason: value}).then((res) => {
        if(this.$route.name == 'afterSalesManagement') {
          this.getList();
        } else if(this.$route.name == 'afterSalesDetails') {
          this.getDetail()
        }
        this.$message.success('拒绝审核成功！');
      }).catch(error => {
          this.$message.error(error);
      })
    },
    confirmReceived(row) {
      this._apis.order.orderConfirmReceived({id: row.id, isSellerReceived: 1}).then(res => {
          this.confirm({iconSuccess: true, text: '确认收货成功', showCancelButton: false, confirmText: '我知道了'}).then(() => {
              
          })
          this.getList()
      }).catch(error => {
          this.$message.error(error);
      }) 
    },
  },
  components: {
    
  }
}
