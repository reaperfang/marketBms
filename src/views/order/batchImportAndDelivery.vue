<template>
  <div class="batch-import-and-delivery">
    <div class="title">批量导入发货</div>
    <p class="import-explain">说明：批量导入发货仅支持配送方式为普通快递的订单，且批量导入发货前您需要到地址库完成发货地址的设置，否则会导致您的批量导入发货失败，当前最多支持1000条发货信息数据。</p>
    <div class="content">
      <!-- <el-steps class="steps" :space="500" :active="1" finish-status="success">
                <el-step title="上传模板"></el-step>
                <el-step title="批量发货"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>
            <p class="progress">
                <span>批量发货模板导入文件.xlsx</span>
                <span>（100%）</span>
            </p>
            <p class="upload"><a href="javascript:;">重新上传</a></p>
            <p>
                <el-button>取 消</el-button>
                <el-button type="primary">批量发货</el-button>
      </p>-->
      <section class="step_1" v-if="active == 1">
        <el-steps class="steps" :space="500" :active="active" finish-status="success">
          <el-step title="上传模板"></el-step>
          <el-step title="批量发货"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div class="row justify-center align-center upload-container">
          <div class="col upload-col">
            <el-upload
              :action="uploadUrl"
              :limit="1"
              :show-file-list="false"
              :data="{json: JSON.stringify({cid: cid})}"
              :on-success="uploadSuccess"
              class="p_imgsCon"
              :before-upload="beforeUpload"
            >
              <i class="el-icon-plus"></i>
              <p style="line-height: 21px; margin-top: -39px; color: #92929B;">请选择上传文件</p>
            </el-upload>
          </div>
          <div class="col">
            <p>说明：请按模板内容仔细填写快递公司及快递单号，发货成功后不可修改，支持 csv、xls、xlsx。</p>
            <p @click="downloadTemplate" class="blue pointer">下载批量发货模板</p>
          </div>
        </div>
      </section>
      <section class="step_2" v-else-if="active == 2">
        <el-steps class="steps" :space="500" :active="active" finish-status="success">
          <el-step title="上传模板"></el-step>
          <el-step title="批量发货"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div class="content">
          <p>{{original}} (100%)</p>
          <p>
            <a href="javascript:;" @click="uploadAgin">重新上传</a>
          </p>
          <p>
            <el-button @click="cancelImport">取 消</el-button>
            <el-button @click="batchImport" type="primary">批量发货</el-button>
          </p>
        </div>
      </section>
      <section class="step_2" v-else-if="active == 3">
        <el-steps class="steps" :space="500" :active="active" finish-status="success">
          <el-step title="上传模板"></el-step>
          <el-step title="批量发货"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div class="content">
          <template v-if="status == 0">
            <p>批量发货操作成功</p>
            <p>已处理单据数：{{successNumber}}</p>
          </template>
          <template v-else-if="status == 1">
            <p>批量发货操作失败</p>
            <p>已处理单据数：{{successNumber}}</p>
            <p>导入失败单据数：{{errorNumber}}</p>
          </template>
          <template v-else-if="status == 2">
            <p>批量发货操作失败</p>
            <p>已处理单据数：0</p>
            <p>导入失败单据数：{{errorNumber}}</p>
          </template>
          <p>
            <el-button v-if="status != 2" @click="print">打印配送单</el-button>
            <el-button @click="active = 1" type="primary">继续导入</el-button>
            <el-button @click="$router.push('/order/deliveryManagement')">返回列表</el-button>
          </p>
        </div>
      </section>
    </div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="onSubmit"></component>
	  <el-dialog
		  class="dia_Box"
		  :visible.sync="dialogVisible1"
		  width="30%">
		  <div class="diaBox">
			  <div>
				  <i class="el-icon-warning" style="color: #FD932B"></i>
			  </div>
			  <div class="center">
				  您未完成发货地址设置，请到地址库设置发货地址。
			  </div>
		  </div>
		  <span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="goSetAddress">去设置</el-button>
			  <el-button @click="dialogVisible1 = false">取消</el-button>
			</span>
	  </el-dialog>
  </div>
</template>
<script>
import CancelImportDialog from "@/views/order/dialogs/cancelImportDialog";

export default {
  data() {
    return {
      uploadUrl: `${process.env.DATA_API}/web-file/file-server/api_file_remote_upload.do`,
      url: "",
      active: 1,
      original: "",
      currentDialog: "",
      dialogVisible: false,
      status: 0, // 0 全部成功 1 部分成功 2 全部失败
      successNumber: 0,
      errorNumber: 0,
      ids: "",
		dialogVisible1: false
    };
  },
  computed:{
      cid(){
          let shopInfo = this.$store.getters.shopInfos
          return shopInfo.id
      }
  },
  methods: {
    downloadTemplate() {
        let a = document.createElement("a");
        let str = ''

        if(this.$route.query.afterSale) {
          str = '/bp/static/template/afterSale'
        } else {
          str = '/bp/static/template'
        }

        a.setAttribute("href", location.protocol + '//' + location.host + `${str}/${encodeURIComponent('批量导入发货模板')}.xls`);
        a.setAttribute("target", "_blank");
        a.click();
    },
    print() {
      if(this.$route.query.afterSale) {
          this.$router.push("/order/printDistributionSheet?ids=" + this.ids + '&afterSale=true');
      } else {
          this.$router.push("/order/printDistributionSheet?ids=" + this.ids);
      }
    },
    import() {
      this._apis.order
        .orderSendInfoImportBatchDelever({ importUrl: this.url })
        .then(res => {
          // console.log(res);
          this.active = 3;
          let successLength = res.success && res.success.length || 0
          let errorLength = res.error && res.error.length || 0

          if (successLength != 0 && errorLength == 0) {
            this.status = 0;
            this.successNumber = res.success.length;
            this.errorNumber = 0;
            this.ids = res.deliver.map(val => val.id);
          } else if (successLength == 0 && errorLength != 0) {
            this.status = 2;
            this.successNumber = 0;
            this.errorNumber = res.error.length;
          } else {
            this.status = 1;
            this.successNumber = res.success.length;
            this.errorNumber = res.error.length;
            this.ids = res.deliver.map(val => val.id);
          }
        })
        .catch(error => {
        	if (error == '您未完成发货地址设置，请到地址库设置发货地址。') {
				this.dialogVisible1 = true
			} else {
				this.$message.error(error);
			}
        });
    },
    afterSaleImport() {
      this._apis.order
        .orderSendInfoImportAfterSaleBatchDelever({ importExcelUrl: this.url })
        .then(res => {
          // console.log(res);
          this.active = 3;
          let successLength = res.success && res.success.length || 0
          let errorLength = res.error && res.error.length || 0

          if (successLength != 0 && errorLength == 0) {
            this.status = 0;
            this.successNumber = res.success.length;
            this.errorNumber = 0;
            this.ids = res.deliver.map(val => val.id);
          } else if (successLength == 0 && errorLength != 0) {
            this.status = 2;
            this.successNumber = 0;
            this.errorNumber = res.error.length;
          } else {
            this.status = 1;
            this.successNumber = res.success.length;
            this.errorNumber = res.error.length;
            this.ids = res.deliver.map(val => val.id);
          }
        })
        .catch(error => {
          this.$message.error(error);
        });
    },
    batchImport() {
      if (this.$route.query.afterSale) {
        this.afterSaleImport();
      } else {
        this.import();
      }
    },
	  goSetAddress() {
    	// this.$router.push({path: '/set/addressAdd', query: { orderType: 1 }})
		  let routeData = this.$router.resolve({ path: '/set/addressAdd', query: { orderType: 1 } });
		  window.open(routeData.href, '_blank');
		  this.dialogVisible1 = false
	  },
    onSubmit() {},
    cancelImport() {
      this.currentDialog = "CancelImportDialog";
      this.dialogVisible = true;
    },
    uploadSuccess(response, file, fileList) {
      if (file.status == "success") {
        this.$message.success(response.msg);
        this.url = response.data.url;
        this.original = response.data.original;
        this.active = 2;
      } else {
        this.$message.error(response.msg);
      }
    },
    beforeUpload(file) {
      // console.log(file);
      if (file.name) {
		  let name=file.name.substring(file.name.lastIndexOf(".")+1);
		  if (name != 'csv' && name != 'xls' && name != 'xlsx') {
			  this.$message.error('上传的文件仅支持 csv、xls、xlsx格式！');
			  return false
		  }
	  }
      if (file.size > 1048576) {
        this.confirm({
          title: "提示",
          icon: true,
          text: "文件过大，请重新上传",
          confirmText: "我知道了"
        });
        return false;
      }
    },
    uploadAgin() {
      this.active = 1;
    }
  },
  components: {
    CancelImportDialog
  }
};
</script>
<style lang="scss" scoped>
.batch-import-and-delivery {
  color: #44434b;
  background-color: #fff;
  padding: 20px;
  padding-right: 70px;
  border-radius: 4px;
  .title {
    font-size: 16px;
    margin-bottom: 30px;
  }
  .content {
    padding-left: 50px;
    .steps {
      margin: 0 auto;
    }
    p {
      text-align: center;
    }
    .progress {
      margin-top: 74px;
    }
    .upload {
      margin-top: 10px;
      margin-bottom: 40px;
      color: $globalMainColor;
    }
  }

  .step_1 {
    .upload-container {
      margin-top: 50px;
      .upload-col {
        margin-right: 30px;
      }
      .col:last-child {
        p {
          text-align: left;
          line-height: 21px;
        }
      }
    }
  }
  .step_2 {
    .content {
      margin-top: 74px;
      p {
        text-align: center;
        line-height: 21px;
        &:nth-child(2) {
          margin-top: 15px;
          a {
            color: #655eff;
          }
        }
        &:last-child {
          margin-top: 40px;
        }
      }
    }
  }
}
/deep/ .el-steps .el-step:last-child {
  flex: 0;
  flex-basis: 40px !important;
}
/deep/ .el-upload {
  width: 173px !important;
  height: 94px !important;
}
/deep/ .el-icon-plus:before {
  content: "";
}
/deep/ .el-icon-plus {
  display: inline-block;
  width: 44px;
  height: 30px;
  background: url(../../assets/images/order/upload.png) no-repeat;
}
/deep/ .el-upload p {
  margin-top: -35px;
}
/deep/ .el-upload {
  border: 1px solid #d3d3d3;
  border-radius: 10px;
}
.import-explain {
  margin-left: 50px;
  margin-bottom: 20px;
}
	.diaBox{
		display: flex;
		justify-content: flex-start;
		i{
			font-size: 30px;
			margin-top: -7px;
		}
		.center{
			color: #44434B;
			font-size: 16px;
			margin-left: 5px;
		}
	}
</style>


