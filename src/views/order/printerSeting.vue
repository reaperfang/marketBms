<template>
	<section style="padding: 20px; background-color: #FFFFFF; height: 100%">
		<div class="printer-title">小票打印机设置</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="margin-top: 40px">
			<el-form-item label="设备品牌：" prop="brand">
				<el-radio-group v-model="ruleForm.brand">
					<el-radio :label="1">飞鸽</el-radio>
					<el-radio :label="2">易联云</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="打印纸宽：" prop="paperWidth">
				<el-radio v-model="ruleForm.paperWidth" label="58mm"></el-radio>
				<div style="color: #92929B; font-size: 12px">打印机背后有标注</div>
			</el-form-item>
			<el-form-item label="设备号码：" prop="code">
				<el-input v-model="ruleForm.code" placeholder="输入打印机底部的机器号" style="width: 400px"></el-input>
				<el-popover
					placement="bottom"
					trigger="click">
					<img src="@/assets/images/order/printerInfo.png" alt="" style="">
					<div slot="reference" class="hint">找不到设备号？</div>
				</el-popover>
			</el-form-item>
			<el-form-item label="设备密钥：" prop="keys">
				<el-input v-model="ruleForm.keys" placeholder="输入打印机底部的密匙" style="width: 400px"></el-input>
				<span style="color: #655EFF; font-size: 14px; cursor: pointer" @click="checkDevice('ruleForm')">连接设备</span>
			</el-form-item>
			<el-form-item label="设备状态：" style="margin-bottom:0;">
				<span v-if="ruleForm.status == 1" class="state">已连接</span>
				<span v-else class="state">未连接</span>
			</el-form-item>
			<span v-if="tip" class="no-connect-tip">请先点击连接，获取设备连接状态，连接成功后才能去打印</span>
			<br>
			<el-button class="buttonSty" :class="{notAllowed:ruleForm.status != 1}" @click="goPrinter()">去打印</el-button>
		</el-form>
		<el-dialog
			title="提示"
			:visible.sync="dialogVisible1"
			width="30%">
			<p style="text-align:center;">您尚未完成设备授权。</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="toYLyun">去授权</el-button>
			</span>
		</el-dialog>
		<el-dialog
			title="请确认授权状态"
			:visible.sync="dialogVisible2"
			width="30%">
			<p style="text-align:center;">请在新开页面中完成授权</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="authorizationOver">已完成授权</el-button>
				<el-button @click="dialogVisible2 = false">未完成授权</el-button>
			</span>
		</el-dialog>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				ruleForm: {
					brand: '',
					paperWidth: '58mm',
					code: '',
					keys: '',
					status: ''
				},
				rules: {
					brand: [
						{ required: true, message: '请选择设备品牌', trigger: 'change' }
					],
					paperWidth: [
						{ required: true, message: '', trigger: 'change' }
					],
					code: [
						{ required: true, message: '必填项，请输入设备号码', trigger: 'change' }
					],
					keys: [
						{ required: true, message: '必填项，请输入设备密钥', trigger: 'change' }
					],
				},
				tip: false,
				printerDetail: {},
				dialogVisible1: true,
				dialogVisible2: false,
				ylyURL: ''
			}
		},
		created(){
			// console.log(this.$route.query.printType)
			this.getPrinterDetail();
		},
		methods: {
			goPrinter(/* formName */) {
				/* this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				}); */
				if(this.ruleForm.status != 1) {
					this.tip = true;
					return false;
				} else {
					this.tip = false;
				}
			},
			checkDevice(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
					} else {
						console.log('error submit!!');
						return false;
					}
				});
				var params = JSON.parse(JSON.stringify(this.ruleForm));
				if (params.brand == 2) {
					delete params.keys;
				}
				delete params.status;
				this._apis.order.connectPrinter(params).then(res => {
					if(res != null) {
						this.dialogVisible1 = true;
						this.ylyURL = res;
					} else {
						this.getPrinterDetail();
					}
				})
			},
			getPrinterDetail(){
				this._apis.order.getPrinterSetDetail().then(res => {
					this.printerDetail = res;
					this.ruleForm.brand = res.brand;
					this.ruleForm.code = res.code;
					this.ruleForm.keys = res.secretKey;
					this.ruleForm.status = res.status;
				}).catch(error => {
                	this.$message.error(error);
            	})
			},
			toYLyun(){
				window.open('https://www.baidu.com');
				this.dialogVisible1 = false;
				this.dialogVisible2 = true;
			},
			authorizationOver(){
				this.getPrinterDetail();
				this.dialogVisible2 = false;
			}
		}
	}
</script>
<style scoped lang="scss">
	.printer-title{
		height: 60px;
		line-height: 60px;
		font-size: 16px;
		color: #44434B;
		border-bottom: 2px solid #CACFCB;
	}
	.hint{
		font-size: 14px;
		color: #655EFF;
		cursor: pointer;
		width: 100px;
	}
	.state{
		color: #44434B;
		font-size: 14px;
	}
	.buttonSty{
		background-color: #655EFF;
		color: #FFFFFF;
		border-radius: 5px;
		margin-left: 40%;
		margin-top: 20px;
	}
	.notAllowed{
		background-color: #aaa;
	}
	.notAllowed:hover{
		border-color: #aaa;
	}
	.no-connect-tip{
		margin-left: 120px;
		color: #FD4C2B;
		font-size: 12px;
	}
</style>
