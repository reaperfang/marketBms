<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="选择规格" :showFooter="showFooter" height="500">
    <!-- <el-cascader
            :options="data"
            :props="props"
            @change="handleChange"
            clearable>
    </el-cascader> -->
    <el-button @click="newSpec" type="primary">自定义规格</el-button>
    <el-tree
      :data="data"
      ref="tree"
      show-checkbox
      node-key="id"
      :props="defaultProps"
      default-expand-all
      :current-node-key="currentNodeKey"
      :expand-on-click-node="false"
      @check-change="checkChange"
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button v-if="data.level == 1" type="text" size="mini" @click="() => append(data)">自定义规格值</el-button>
          <el-button v-if="data.type == 'new'" type="text" size="mini" @click="() => remove(node, data)">{{data.level | levelFilter}}</el-button>
        </span>
      </div>
    </el-tree>
    <div class="footer">
      <el-button @click="submit" type="primary">确认</el-button>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";

let id = new Date().getTime()
let count = 0

export default {
  data() {
    return {
      showFooter: false,
      props: {
        multiple: true,
        value: "id",
        label: "name",
        children: "list"
      },
      defaultProps: {
        children: "list",
        label: "name"
      },
      options: [],
      arr: [],
      currentNodeKey: ""
    };
  },
  filters: {
      levelFilter(value) {
          if(value == 1) {
              return '删除规格'
          } else {
              return '删除规格值'
          }
      }
  },
  methods: {
      newSpec() {
          // if(count > 2) {
          //     this.$message({
          //       message: '新增规格不能大于3',
          //       type: 'warning'
          //       });
          //     return
          // }

          let data = this.data

          this.$prompt('请输入规格', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            if(this.data.find(val => val.name == value)) {
                this.$message({
                message: '规格名称重复',
                type: 'warning'
                });
              return
            }
          const newChild = { id: id++, name: value, list: [], type: 'new', level: '1', parentId: '0' };
            data.push(newChild);
            this.flatSpecsList.push({...newChild})
            count++
        })
      },
    submit() {
      let arr = this.handleCheckChange()

        this.arr = arr
      this.$emit("submit", this.arr);
      this.visible = false;
    },
    handleChange(val) {
      this.arr = val;
    },

    handleCheckChange() {
      let res = this.$refs.tree.getCheckedNodes(true);
      let arr = [];

      if(res && res.filter(val => val.type == 'new') && res.filter(val => val.type == 'new').find(val => val.level == 1)) {
        this.$message({
          message: '请新建规格值',
          type: 'warning'
        });
      }
      res.forEach(item => {
        arr.push(item.id);
      });

      arr = arr.map(val => {
          let _arr = []

          _arr.push(val)
          let parentId = this.flatSpecsList.find(category => category.id == val).parentId

          _arr.unshift(this.flatSpecsList.find(category => category.id == parentId).id + '')

          return _arr
      })
      return arr
    },
    checkChange() {
        
    },
    append(data) {
        this.$prompt('请输入规格值', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            if(data.list.find(val => val.name == value)) {
                this.$message({
                message: '规格值重复',
                type: 'warning'
                });
              return
            }
          const newChild = { id: id++, name: value, list: [], type: 'new', level: '2', parentId: data.id };
            if (!data.list) {
                this.$set(data, 'list', []);
            }
            data.list.push(newChild);
            this.flatSpecsList.push({...newChild})
        })
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.list || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    },
    contentText() {
      return "是否将此分类其下的全部商品转移到其他分类中？";
    }
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    },
    flatSpecsList: {
        type: Array
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
ul li {
  margin: 10px 0;
}
/deep/ .el-button.el-button--small {
  color: #fff !important;
}
.footer {
  text-align: center;
  margin-top: 10px;
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 204px
}
</style>


