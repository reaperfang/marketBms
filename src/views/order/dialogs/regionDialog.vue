<template>
  <DialogBase :visible.sync="visible" title="区域选择" width="500px" :showFooter="showFooter">
    <div>
      <div class="wrapper">
        <template v-for="(item, key) of region">
          <div class="province" :key="key">
            <div class="title" @mouseenter="titleMouseover(item)" @mouseleave="closeCity(key)">
              <el-checkbox
                :indeterminate="item.isIndeterminate"
                @change="checkboxChange(item.checked, key)"
                v-model="item.checked"
              ></el-checkbox>
              {{item.name}}
              <div
                class="citys"
                v-if="item.over"
                @mouseover="titleMouseover(item)"
                @mouseout="titleMouseout(item)"
              >
                <div class="tr">
                  <i class="el-icon-close" @click="closeCitys"></i>
                </div>
                <el-checkbox-group @change="checkListchange(key)" v-model="item.checkList">
                  <el-checkbox
                    v-for="(city, key2) of item.citys"
                    :key="key2"
                    :label="`${item.code},${item.name},${city.code},${city.name}`"
                  >{{city.name}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div>
        已选中：
        <el-tag
          closable
          @close="handleClose(item)"
          v-for="(item, key) of checkList"
          :key="key"
          style="margin-right:5px;margin-bottom:5px;"
        >{{item.split(',')[3]}}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
      </div>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
import { _nationalRegionInfo } from "@/api/order";
export default {
  name: "regionDialog",
  //extends: dialogBase,
  data() {
    return {
      region: [], //地区列表json
      // dialogWidth: '1000px',
      dialogFormVisible: true,
      checkList: [],
      showFooter: false
    };
  },
  created() {
    this.fetch();
    this.convertData();
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
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  watch: {
    region: {
      deep: true,
      handler() {
        this.checkList = this.region.reduce((total, val) => {
        return total.concat(val.checkList);
      }, []);
      }
    }
  },
  components: {
    DialogBase
  },
  methods: {
    checkListchange(key) {
      let _region = this.region[key];

      if (_region.citys.length == _region.checkList.length) {
        this.region[key].checked = true;
        this.region[key].isIndeterminate = false;
      } else if (!_region.checkList.length) {
        this.region[key].checked = false;
        this.region[key].isIndeterminate = false;
      } else {
        this.region[key].isIndeterminate = true;
        this.region[key].checked = false;
      }
    },
    checkboxChange(checked, key) {
      let checkList = [];

      if (checked) {
        this.region.forEach((val, index) => {
          if (index == key) {
            val.citys.forEach(item => {
              let str = "";

              str += val.code;
              str += "," + val.name;
              str += "," + item.code;
              str += "," + item.name;

              checkList.push(str);
            });
          }
        });
      }
      this.region.splice(
        key,
        1,
        Object.assign({}, this.region[key], {
          checkList,
          isIndeterminate: false
        })
      );
    },
    handleClose(tag) {
      this.checkList.splice(this.checkList.indexOf(tag), 1);
    },
    closeCity(index) {
      let _region = [...this.region];

      _region.forEach(val => {
        //val.checked = false
        val.over = false;
      });

      this.region = _region;
    },
    closeCitys() {
      let _region = [...this.region];

      _region.forEach(val => {
        //val.checked = false;
        val.over = false;
      });

      this.region = _region;
    },
    fetch() {
      this.loading = true;
      this._apis.order
        .getArea()
        .then(response => {
          response.forEach(val => {
            val.isIndeterminate = false;
            val.over = false;
            val.checkList = [];
          });
          this.region = response;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error);
        });
    },

    submit() {
      this.$emit(
        "submit",
        this.checkList.map(val => {
          let arr = val.split(",");

          return {
            code: arr[0],
            name: arr[1],
            city: {
              code: arr[2],
              name: arr[3]
            }
          };
        })
      );
      this.visible = false;
    },

    convertData() {
      this.checkList = [];
      if (this.data && this.data.deliveryAreaPrice) {
        for (let key in this.data.deliveryAreaPrice) {
          let oneType = this.data.deliveryAreaPrice[key];
          if (key !== "000000") {
            const provinces = key.split(",");
            for (let item of provinces) {
              // if(item === ) {
              // }
            }
            const citys = [];
            for (let item of oneType.subArea) {
              citys.push({
                code: item.zoneCode,
                name: item.zoneName
              });
            }
          }
        }
      }
    },

    //鼠标移入、覆盖
    titleMouseover(item) {
      const tempItem = [...this.region];
      for (let one of tempItem) {
        if (one.code === item.code) {
          //one.checked = true;
          one.over = true;
        } else {
          //one.checked = false;
          one.over = false;
        }
      }
      this.region = tempItem;
    },

    //鼠标移出
    titleMouseout(item) {
      // const tempItem = [...this.region];
      // for (let one of tempItem) {
      //   one.checked = false;
      // }
      // this.region = tempItem;
    },
    close() {}
  }
};
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  // .el-checkbox.title{
  // 	width: 90px;
  // 	margin: 0 5px 10px 0 !important;
  // }
  p.title {
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.4s;
    &:hover {
      border: 1px solid #98c4f1;
    }
  }
  .province {
    width: 120px;
    margin: 0 0 10px !important;
    position: relative;
    .citys {
      position: absolute;
      background: #fff;
      top: 0;
      z-index: 10;
      left: 50px;
      min-width: 200px;
      max-width: 500px;
      border: 1px solid #98c4f1;
      -webkit-box-shadow: 4px 3px 10px rgba(0, 0, 0, 0.2);
      box-shadow: 4px 3px 10px rgba(0, 0, 0, 0.2);
      padding: 8px 8px 6px;
      // display:none;
      transition: all 0.4s;
      .el-checkbox-group {
        .el-checkbox {
          margin: 0 5px 10px 0 !important;
        }
      }
      &.show {
        display: block;
      }
    }
  }
}
.dialog-footer {
  text-align: center;
}
// p.title:hover + .citys{
// 	display:block;
// }
/deep/ .el-tag {
  padding: 0 5px;
}
</style>




