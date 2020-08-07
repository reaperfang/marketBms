<template>
	<section style="padding: 20px; background-color: #FFFFFF; height: 100%">
		<div class="printer-title">小票打印机设置</div>
		<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="margin-top: 40px">
			<el-form-item label="设备品牌：" prop="resource">
				<el-radio-group v-model="ruleForm.resource">
					<el-radio label="飞鸽"></el-radio>
					<el-radio label="易联云"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="打印纸宽：" prop="width">
				<el-radio v-model="ruleForm.width" label="58mm"></el-radio>
				<div style="color: #92929B; font-size: 12px">打印机背后有标注</div>
			</el-form-item>
			<el-form-item label="设备号码：" prop="number">
				<el-input v-model="ruleForm.number" placeholder="输入打印机底部的机器号" style="width: 400px"></el-input>
				<el-popover
					placement="bottom"
					trigger="click">
					<img src="@/assets/images/order/printerInfo.png" alt="" style="">
					<div slot="reference" class="hint">找不到设备号？</div>
				</el-popover>
			</el-form-item>
			<el-form-item label="设备密钥：" prop="pwa">
				<el-input v-model="ruleForm.pwa" placeholder="输入打印机底部的密匙" style="width: 400px"></el-input>
				<span style="color: #655EFF; font-size: 14px; cursor: pointer">连接设备</span>
			</el-form-item>
			<el-form-item label="设备状态：" prop="pwa">
				<span class="state">已连接</span>
			</el-form-item>
				<el-button class="buttonSty" @click="goPrinter('ruleForm')">去打印</el-button>
		</el-form>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				ruleForm: {
					resource: '',
					width: '58mm',
					number: '',
					pwa: ''
				},
				rules: {
					resource: [
						{ required: true, message: '请选择设备品牌', trigger: 'change' }
					],
					width: [
						{ required: true, message: '', trigger: 'change' }
					],
					number: [
						{ required: true, message: '请输入设备号码', trigger: 'change' }
					],
					pwa: [
						{ required: true, message: '请先点击连接，获取设备连接状态，连接成功后才能去打印', trigger: 'change' },
						{ required: true, message: '请输入设备密钥', trigger: 'blur' },
					],
				}
			}
		},
		created(){
			console.log(this.$route.query.printType)
		},
		methods: {
			goPrinter(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						alert('submit!');
					} else {
						console.log('error submit!!');
						return false;
					}
				});
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
</style>
