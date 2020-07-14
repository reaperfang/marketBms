/*
 ** 基于表格基础组件，相关dialog弹出框中选择、全选重写
 ** watch数据变化更新全选按钮状态
 */
let mixin = {
    data() {
        return {
			selectDisabled: false, //控制全选可不可用
			selectKeyArr: [
				'id',
				'spuId',
				'activityId'
			] //不同接口返回的唯一标识白名单数组
        }
    },
	watch: {
		'tableData': {
			handler(newValue) {
				this.$nextTick(() => {
					this.selectAllStatus();
				})
			},
			deep: true
		}
	},
	methods: {
		//选择改变
		handleSelectionChange(val) {
			this.multipleSelection = val;
			this.selectAllStatus();
		},
		// 全选
		selectAll(val) {
			const selectedTable = this.tableData.filter(item => !item.disabled);
			let nowPageSelectedLength = 0;
			let key;
			if(this.multipleSelection.length != 0){
				for(let i = 0; i < this.selectKeyArr.length; i++){
					const nowKey = this.selectKeyArr[i];
					if(!!this.multipleSelection[0][nowKey]){
						key = this.selectKeyArr[i];
						break;
					}
				}
			}
			this.multipleSelection.forEach((item) => {
				const id = item[key];
				nowPageSelectedLength = nowPageSelectedLength + selectedTable.filter(items => items[key] === id).length;
            })
			if (nowPageSelectedLength && nowPageSelectedLength == selectedTable.length) {
				selectedTable.forEach((row) => {
					this.$refs.multipleTable.toggleRowSelection(row, false);
				})
				this.selectStatus = false;
			} else {
				selectedTable.forEach((row) => {
					this.$refs.multipleTable.toggleRowSelection(row, true);
				})
				this.selectStatus = true;
			}
		},

		//全选状态更新
		selectAllStatus() {
            const selectedTable = this.tableData.filter(item => !item.disabled);
            //如果当前页没有可以选择的，则全选禁用
            if(selectedTable.length == 0){
                this.selectDisabled = true;
            }else{
                this.selectDisabled = false;
            }
			let nowPageSelectedLength = 0;
			let key;
			console.log(this.multipleSelection)
			if(this.multipleSelection.length != 0){
				for(let i = 0; i < this.selectKeyArr.length; i++){
					const nowKey = this.selectKeyArr[i];
					if(!!this.multipleSelection[0][nowKey]){
						key = this.selectKeyArr[i];
						break;
					}
				}
			}
			console.log(key)
			this.multipleSelection.forEach((item) => {
				const id = item[key];
				nowPageSelectedLength = nowPageSelectedLength + selectedTable.filter(items => items[key] === id).length;
            })
			if (nowPageSelectedLength && nowPageSelectedLength == selectedTable.length) {
				this.selectStatus = true;
			} else {
				this.selectStatus = false;
			}
		}
	}
}

export default mixin
