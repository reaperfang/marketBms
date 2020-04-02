import Pagination from '@/components/Pagination'

export const search = {
	data() {
		return {
			listQuery: {
        startIndex: 1,
        pageSize: 20,
      },
      total: 0,
      list: []
		}
	},
	methods: {
		resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getList(param) {
      
    },
  },
  components: {
    Pagination,
  }
}