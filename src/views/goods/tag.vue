<template>
  <div class="tag">
    <div class="search">
      <div>
        <el-button v-permission="['商品', '商品标签', '默认页面', '新建标签']" @click="currentDialog = 'AddTagDialog'; dialogVisible = true" type="primary">新建标签</el-button>
        <el-button class="border-button" @click="moreManageHandler">批量管理</el-button>
      </div>
      <el-form :inline="true" :model="listQuery" ref="form" class="form-inline">
        <el-form-item label="搜索标签：" prop="name">
          <el-input v-model="listQuery.name" placeholder="请输入标签名称..."></el-input>
        </el-form-item>
        <el-form-item label="标签状态：" prop="enable">
          <el-select v-model="listQuery.enable" placeholder="请选择标签状态">
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="(item, index) in items"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="getList" type="primary">查询</el-button>
          <el-button class="fr marL20" @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="loading"
      :data="list"
      ref="table"
      :header-cell-style="{background:'#ebeafa', color:'#655EFF'}"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="showTableCheck" type="selection" width="55"></el-table-column>
      <el-table-column prop="name" label="标签名称" width="180"></el-table-column>
      <el-table-column prop="productCount" label="绑定商品数量" width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.enable | enableFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-permission="['商品', '商品标签', '默认页面', '修改']" class="operate-span blue pointer" @click="change(scope.row)">修改</span>
          <span v-permission="['商品', '商品标签', '默认页面', '显示/隐藏']" class="operate-span blue pointer" @click="hide(scope.row)">
            {{scope.row.enable | operateEnable}}
          </span>
          <span v-permission="['商品', '商品标签', '默认页面', '删除']" class="operate-span deleteColor pointer" @click="deleteTag(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-footer">
      <div class="row justify-between">
        <div class="col">
          <el-button v-if="showTableCheck" @click="checkAllHandler">全选</el-button>
        </div>
        <div class="col" v-if="showTableCheck">
          <el-button v-permission="['商品', '商品标签', '默认页面', '批量显示/隐藏']" @click="hideTags" class="border-button">隐 藏</el-button>
          <el-button v-permission="['商品', '商品标签', '默认页面', '批量显示/隐藏']" @click="showTags" type="primary">显 示</el-button>
          <el-button v-permission="['商品', '商品标签', '默认页面', '批量删除']" @click="deleteTags" class="delete-button">删 除</el-button>
          <el-button @click="showTableCheck = false" type="primary">完 成</el-button>
        </div>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.startIndex" :limit.sync="listQuery.pageSize" @pagination="getList" />
    </div>
    <component :is="currentDialog" :dialogVisible.sync="dialogVisible" @submit="submit" :data="currentData"></component>
  </div>
</template>
<script>
import AddTagDialog from "@/views/goods/dialogs/addTagDialog";
import Pagination from '@/components/Pagination'
import { fetchTagsList } from "@/api/goods";

export default {
  data() {
    return {
      listQuery: {
          startIndex: 1,
          pageSize: 20,
          name: '', // 标签名称
          enable: '', // 标签状态
      },
      items: [
        {
          label: '所有状态',
          value: ''
        },
        {
          label: '启用',
          value: '1'
        },
        {
          label: '禁用',
          value: '0'
        },
      ],
      list: [],
      multipleSelection: [],
      showTableCheck: false,
      currentDialog: "",
      currentData: {},
      dialogVisible: "",
      total: 0,
      loading: false
    };
  },
  created() {
    this.getList()
  },
  filters: {
    enableFilter(val) {
      if(val == 1) {
        return '启用'
      } else if(val == 0) {
        return '禁用'
      } else {
        return '全部'
      }
    },
    operateEnable(val) {
      if(val == 1) {
        return '隐藏'
      } else if(val == 0) {
        return '显示'
      }
    }
  },
  methods: {
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.getList()
    },
    hideTags() {
      if(!this.multipleSelection.length) {
        this.confirm({title: '批量隐藏', icon: true, text: '请选择想要批量隐藏的标签。'})
        return
      }
      this.confirm({title: '批量隐藏', icon: true, text: '确认隐藏所选标签吗？'}).then(() => {
          this._apis.goods
          .enableTag({enable: 0, ids: this.multipleSelection.map(val => val.id)})
          .then(res => {
            this.getList()
            this.$message({
              message: '批量隐藏成功',
              type: 'success'
            });
          })
          .catch(error => {
            
          });
      })
    },
    showTags() {
      if(!this.multipleSelection.length) {
        this.confirm({title: '批量显示', icon: true, text: '请选择想要批量显示的标签。'})
        return
      }
      this.confirm({title: '批量显示', icon: true, text: '确认显示所选标签吗？'}).then(() => {
          this._apis.goods
          .enableTag({enable: 1, ids: this.multipleSelection.map(val => val.id)})
          .then(res => {
            this.getList()
            this.$message({
              message: '批量显示成功',
              type: 'success'
            });
          })
          .catch(error => {
            
          });
      })
    },
    submit() {
      this.getList()
    },
    change(row) {
      this.currentDialog = 'AddTagDialog'
      this.currentData = Object.assign({}, row, {editor: true})
      this.dialogVisible = true
    },
    hide(row) {
      let _enable = ''
      let str = ''
      if(row.enable == 1) {
        _enable = 0
        str = '隐藏'
      } else if(row.enable == 0) {
        _enable = 1
        str = '显示'
      }

      this._apis.goods.enableTag({enable: _enable, ids: [row.id]}).then(() => {
        this.getList()
        this.$message({
            message: `${str}成功`,
            type: 'success'
          });
      }).catch(error => {

      })
    },
    deleteTag(row) {
      this.confirm({title: '立即删除', icon: true, text: '删除后将不可恢复，确认删除吗？'}).then(() => {
          this._apis.goods
          .deleteTag({ids: [row.id]})
          .then(res => {
            this.getList()
            this.$message({
              message: '删除成功',
              type: 'success'
            });
          })
          .catch(error => {
            
          });
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    moreManageHandler() {
      this.showTableCheck = true;
    },
    checkAllHandler() {
      this.$refs.table.clearSelection();
      this.list.forEach(row => {
        this.$refs.table.toggleRowSelection(row);
      });
    },
    deleteTags() {
      if(!this.multipleSelection.length) {
        this.confirm({title: '批量删除', icon: true, text: '请选择想要批量删除的标签。'})
        return
      }
      this.confirm({
        title: "批量删除",
        icon: true,
        text: "删除后将不可恢复，确认删除所选标签吗？"
      }).then(() => {
        console.log(this.multipleSelection)
        this._apis.goods.deleteTag({ids: this.multipleSelection.map(val => val.id)}).then(() => {
          this.getList()
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }).catch(error => {

        })
      });
    },
    async getList() {
      try {
        this.loading = true
        let res = await fetchTagsList(this.listQuery)

        if(res) {
          this.list = res.list
          this.total = +res.total
          this.loading = false
        }
      } catch(error) {
        this.loading = false
      }
    }
  },
  components: {
    AddTagDialog,
    Pagination
  }
};
</script>
<style lang="scss" scoped>
.blue {
  color: $globalMainColor;
}
.deleteColor {
  color: #f55858;
}
.tag {
  background-color: #fff;
  padding: 25px 38px;
  .dialog-container {
    text-align: left;
  }
}
.operate-span {
  margin-right: 40px;
}
.form-inline {
  margin-top: 23px;
}
.table-footer {
  margin-top: 35px;
  button {
    margin-left: 0;
    margin-right: 28px;
    &:last-child {
      margin-right: 65px;
    }
  }
}
</style>
<style lang="scss" scoped>
.tag {
  /deep/ .delete-button {
    background-color: #f55858;
    color: #fff;
  }
}
</style>



