<template>
  <DialogBase :visible.sync="visible" title="区域选择" width="500px" :showFooter="showFooter">
    <div>
      <div class="wrapper" id="wrapper">
        <template v-for="(item, key) of region">
          <div class="province" :key="key">
            <!-- <div class="title" @mouseenter="titleMouseover(item)" @mouseleave="closeCity(key)"> -->
            <div class="title" @click.self="titleMouseover(item)">
              <i class="icon el-icon-caret-right" :class="[item.over ? 'icon-isOpen' : '']" @click.self="titleMouseover(item)"></i>
              <el-checkbox
                :indeterminate="item.isIndeterminate"
                @change="checkboxChange(item)"
                v-model="item.checked"
              ></el-checkbox>
              {{item.name}}
              <div
                class="citys"
                v-if="item.over"
                v-clickoutside:[classlist]="closeCitys"
              >
                <div class="tr">
                  <i class="el-icon-close" @click="closeCitys"></i>
                </div>
                <!-- <el-tree :data="item.citys" :props="defaultProps" @node-click="checkListchange"></el-tree> -->
                <div class="citys-tree">
                  <el-tree
                    :data="item.citys"
                    show-checkbox
                    ref="areaTree"
                    node-key="code"
                    :default-checked-keys="defaultCheckedCode"
                    @check-change="checkListchange"
                    :props="defaultProps">
                  </el-tree>
                </div>
                <!-- <el-checkbox-group @change="checkListchange(key)" v-model="item.checkList">
                  <el-checkbox
                    v-for="(city, key2) of item.citys"
                    :key="key2"
                    :label="`${item.code},${item.name},${city.code},${city.name}`"
                  >{{city.name}}</el-checkbox>
                </el-checkbox-group> -->
              </div>
            </div>
          </div>
        </template>
      </div>
      <div style="padding-top: 23px;padding-bottom: 11px;">
        <el-checkbox @change="checkedAllChange" :indeterminate="isAllIndeterminate" v-model="checkedAll">全选</el-checkbox>
      </div>
      <div>
        已选中：
        <el-tag
          closable
          @close="handleClose(item)"
          v-for="(item, key) of checkedTagList()"
          :key="key"
          style="margin-right:5px;margin-bottom:5px;"
        >{{ item.name }}</el-tag>
      </div>
      <div slot="footer" class="dialog-footer">
        <!-- <el-checkbox @change="checkedAllChange" :indeterminate="isAllIndeterminate" v-model="checkedAll">全选</el-checkbox> -->
        <el-button type="primary" @click="submit" :loading="loading">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
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
    const isLeaf = function(data, node) {
      if (data.areas) return true
      return false
    }
    return {
      region: [], //地区列表json
      // dialogWidth: '1000px',
      dialogFormVisible: true,
      checkList: [],
      checkList2: [],
      showFooter: false,
      checkedAll: false,
      isAllIndeterminate: false,
      classlist: ['wrapper'],
      defaultProps:  {
        children: 'areas',
        label: 'name',
        isLeaf: isLeaf
      },
      checkedList: [],
      currOneNode: null, // 一级节点
      defaultCheckedCode: []
    };
  },
  created() {
    this.fetch();
    this.convertData();
  },
  computed: {
    // checkedTagList() {
    //   let arr = []
    //   const { provinceList } = this.getProvinceList()
    //   const { cityList } = this.getCityList()
    //   const { areaList } = this.getAreaList()
    //   console.log('provinceList',provinceList)
    //   console.log('cityList',cityList)
    //   console.log('areaList',areaList)
    //   arr = arr.concat(provinceList,cityList,areaList)
    //   return arr
    // },
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
    // region: {
    //   deep: true,
    //   handler() {
    //     this.checkList = this.region.reduce((total, val, index) => {
    //       let _region = this.region[index];

    //       if (_region.citys.length == _region.checkList.length) {
    //         let arr = []
    //         let str = ' , , ,'

    //         str += _region.checkList[0].split(',')[1]
    //         arr.push(str)

    //         return total.concat(arr);
    //       } else {
    //         return total.concat(val.checkList);
    //       }
    //   }, []);
    //   this.checkList2 = this.region.reduce((total, val, index) => {
    //       let _region = this.region[index];

    //       return total.concat(val.checkList);
    //   }, []);
    //   }
    // }
  },
  components: {
    DialogBase
  },
  directives: {
    //  v-clickoutside:[classList]="closeIconBlock"  classList: ['cal1','cal2','cal4'] 外部不触发元素
    'clickoutside': {
      bind(el, binding) {
        function handler(e) {
            if (el.contains(e.target)) {
                return false;
            }
            let isReturn = false
            // console.log('- binding.arg--', binding.arg)
            if (binding.arg) {
            binding.arg.map(item => {
                if (document.querySelector('#' + item).contains(e.target)) {
                    isReturn = true
                }
            })
            }
            if (isReturn){
                return false
            }
            
            if (binding.expression) {
                binding.value(e);
            }
        }
        el._zClickOutside = handler;
        document.addEventListener('click', handler);
      },
      unbind(el) {
        // 解除事件监听
        document.removeEventListener('click', el._zClickOutside);
        delete el._zClickOutside;
      }
    }
  },
  methods: {
    checkedTagList() {
      let arr = []
      const { provinceList } = this.getProvinceList()
      const { cityList } = this.getCityList()
      const areaList = this.getAreaList()
      // console.log('provinceList',provinceList)
      // console.log('cityList',cityList)
      // console.log('areaList',areaList)
      arr = arr.concat(provinceList,cityList,areaList)
      return arr
    },
    // 获取省级集合
    getProvinceList() {
      let provinceList = []
      const map = JSON.parse(JSON.stringify(this.checkedList))
      const filterList = map.filter(item => {
        // 处理省
        // console.log('item',item)
        const isTrue = item.receivedProvinceCode && item.province
        if (isTrue) {
          provinceList.push(item)
        }
        return !isTrue
      })
      return {
        provinceList,
        filterList
      }
    },
    // 获取市级集合
    getCityList() {
      const { provinceList, filterList } = this.getProvinceList()
      let cityList = []
      const filterSubList = filterList.filter(item => {
        // 处理省
        // console.log('item',item)
        const isTrue = !this.isExistProvince(provinceList, item.receivedProvinceCode) &&
        item.receivedCityCode && item.city
        if (isTrue) {
          cityList.push(item)
        }
        return !isTrue
      })
      return {
        cityList,
        filterSubList
      }
    },
    // 获取县级集合
    getAreaList() {
      let arr = []
      const { provinceList } = this.getProvinceList()
      const { cityList, filterSubList } = this.getCityList()
     filterSubList.forEach(item => {
        const isTrue = this.isExistProvince(provinceList, item.receivedProvinceCode)  
        || this.isExistCity(cityList, item.receivedCityCode) 
        if (!isTrue) {
          arr.push(item)
        }
      })
      return arr
    },
    // 是否已经存在省级了
    isExistProvince(arr = [], receivedProvinceCode) {
      const index = arr.findIndex(item => {
        return item.receivedProvinceCode === receivedProvinceCode
      })
      return index >= 0 ? true : false
    },
    // 是否已经存在市级了
    isExistCity(arr = [], receivedCityCode) {
      const index = arr.findIndex(item => {
        return item.receivedCityCode === receivedCityCode
      })
      return index >= 0 ? true : false
    },
    openChildNode(e) {
      // console.log('openChildNode')
    },
    pushAll() {
      let i = 0;
      const region = this.region
      let len = region.length;
      while(i < len) {
        const data = region[i]
        const index = this.checkCheckedListIsHasProvinceNode(data)
        if (data.checked) {
          data.isIndeterminate = false
          // 添加到checkedlist
          if (index === -1) {
            const node = this.getCurrCheckedProvinceNode(data, data.isIndeterminate)
            if (node) {
              this.checkedList.push(node)
            }
          }
        }
        i++
      }
    },
    checkedAllChange() {
      let region
      
      if(this.checkedAll) {
        // this.region.forEach((val, index) => {
        //   this.checkboxChange(val)
        // })

        // region = JSON.parse(JSON.stringify(this.region))
        this.region.forEach(val => {
          val.checked = true
        })
        this.pushAll()
        // this.region.forEach((val, index) => {
        //   this.checkboxChange(val)
        // })
        // this.region = region
      } else {
        // this.region.forEach((val, index) => {
        //   this.checkboxChange(val)
        // })

        // region = JSON.parse(JSON.stringify(this.region))
        this.region.forEach(val => {
          val.checked = false
        })
        this.checkedList = []
        // this.region.forEach((val, index) => {
        //   this.checkboxChange(val)
        // })
        // this.region = region
      }
      this.setAllCheckedStatus()
    },
    // 获取当前选中区、县节点
    getCurrCheckedAreaNode(node, indeterminate) {
      const halfCheckedNodes = this.$refs.areaTree[0].getHalfCheckedNodes()
      let receivedProvinceCode = this.currOneNode && this.currOneNode.code
      let receivedCityCode = ''
      let receivedAreaCode = ''
      let isIndeterminate = indeterminate
      let name = ''
      // console.log('----', halfCheckedNodes)
      if (halfCheckedNodes && halfCheckedNodes.length > 0) {
        let i = 0
        while(i < halfCheckedNodes.length) {
          const city = halfCheckedNodes[i]
          const areas = city && city.areas
          if (Array.isArray(areas)) {
            const area = areas.find(item => {
              return item.code === node.code
            })
            if (area) {
              receivedCityCode = city.code
              receivedAreaCode = area.code
              name = area.name
              break
            }
          }
          i++
        }
        return { receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate }
      }
    },
    // 获取当前选中市节点
    getCurrCheckedCityNode(node, indeterminate) {
      let receivedProvinceCode = this.currOneNode && this.currOneNode.code
      let receivedCityCode = ''
      let receivedAreaCode = ''
      let isIndeterminate = indeterminate
      let name = ''
      const citys = this.currOneNode && this.currOneNode.citys
      const city = citys.find(item => {
        return item.code === node.code
      })
      if (city) {
        receivedCityCode = city.code
        name = city.name
      }
      return { city, receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate }
    },
    // 获取当前选中省节点
    getCurrCheckedProvinceNode(node) {
      let receivedProvinceCode = node && node.code
      let receivedCityCode = ''
      let receivedAreaCode = ''
      let isIndeterminate = node.isIndeterminate
      let name = node.name
      let province = node
      return { province, receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate }
    },
    // 检查区、县级是否在选中列表中
    checkCheckedListIsHasAreaNode(node) {
      // let code = node.receivedAreaCode
      // if (!code) {
      //   const newNode = this.getCurrCheckedAreaNode(node)
      //   code = newNode.receivedAreaCode
      // }
      // const index = this.checkedList.findIndex(item => {
      //   return item.receivedAreaCode === code
      // })
      // return index
      const index = this.checkedList.findIndex(item => {
        return item.receivedAreaCode === node.code
      })
      return index
    },
    // 检查市级是否在选中列表中
    checkCheckedListIsHasCityNode(node) {
      let code = node.receivedCityCode
      if (!code) {
        const newNode = this.getCurrCheckedCityNode(node)
        code = newNode.receivedCityCode
      }
      const index = this.checkedList.findIndex(item => {
        return item.city && item.city.code === code
      })
      return index
    },
    // 检查省级是否在选中列表中
    checkCheckedListIsHasProvinceNode(node) {
      let code = node.receivedProvinceCode
      if (!code) {
        const newNode = this.getCurrCheckedProvinceNode(node)
        code = newNode.receivedProvinceCode
      }
      const index = this.checkedList.findIndex(item => {
        return item.province && item.province.code === code
      })
      // console.log('---index-', index)
      return index
    },
    removeCheckedListNodeByIndex(index) {
      return this.checkedList.splice(index, 1)
    },
    // 存储 city 节点
    pushCityNode(node, currOneNode = this.currOneNode) {
      if (node) {
        const cityNodeIndex = this.checkCheckedListIsHasCityNode(node)
        if (cityNodeIndex === -1) this.checkedList.push(node)
        const areas = node.city && node.city.areas
        const receivedProvinceCode = currOneNode && currOneNode.code
        const receivedCityCode = node.receivedCityCode
        for(let i = 0; i < areas.length; i++) {
          let receivedAreaCode = areas[i].code
          let name = areas[i].name
          const areaNodeIndex = this.checkCheckedListIsHasAreaNode(areas[i])
          if (areaNodeIndex === -1) {
            this.checkedList.push({ receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate: false })
          }
        }
      }
    },
    // 存储 Province 节点
    pushProvinceNode(node) {
      if (node) {
        const index = this.checkCheckedListIsHasProvinceNode(node)
        if (index === -1) this.checkedList.push(node)
        const citys = node.province && node.province.citys
        const receivedProvinceCode = node.receivedProvinceCode
        let receivedCityCode = ''
        let receivedAreaCode = ''
        for(let i = 0; i < citys.length; i++) {
          let receivedCityCode = citys[i].code
          let name = citys[i].name
          // const cityNodeIndex = this.checkCheckedListIsHasCityNode(citys[i])
          // if (cityNodeIndex === -1) {
            let city = citys[i]
            let newNode = { city, receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate: false }
            // this.checkedList.push( { city, receivedProvinceCode, receivedCityCode, receivedAreaCode, name, isIndeterminate: false })
            this.pushCityNode(newNode, node.province)
          // }
        }
      }
    },
    // 删除县级子节点
    removeCheckedListAreaNodeByNode(node, currOneNode = this.currOneNode) {
      const areaNodeIndex = this.checkCheckedListIsHasAreaNode(node)
      if (areaNodeIndex !== -1 )this.removeCheckedListNodeByIndex(areaNodeIndex)
      // 删除省级节点
     if (currOneNode) {
        const provinceIndex = this.checkCheckedListIsHasProvinceNode(currOneNode)
        if (provinceIndex !== -1 ) this.removeCheckedListNodeByIndex(provinceIndex)
        // 之所以不删除市，省级与tree组件脱离，市级，在县级删除后，自动删除无需处理
        // 取消全选
        this.isAllIndeterminate = true
        this.checkedAll = false
      }
    },
    // 删除node(市)节点的当前节点以及子节点
    removeCheckedListCityNodeByNode(node, isIndeterminate, currOneNode = this.currOneNode) {
      const cityNodeIndex = this.checkCheckedListIsHasCityNode(node)
      if (isIndeterminate) {
        // 如果子节点有部分选中，则直接删除父节点；
        this.removeCheckedListNodeByIndex(cityNodeIndex)
      } else {
        const areas = node.areas
        if (cityNodeIndex !== -1)  this.removeCheckedListNodeByIndex(cityNodeIndex)
        for(let i = 0; i < areas.length; i++) {
          // const areaNodeIndex = this.checkCheckedListIsHasAreaNode(areas[i])
          // if (areaNodeIndex !== -1)  this.removeCheckedListNodeByIndex(areaNodeIndex)
          this.removeCheckedListAreaNodeByNode(areas[i], currOneNode)
        }
      }
    },
    // 删除node(省)节点的当前节点以及子节点
    removeCheckedListProvinceNodeByNode(node, isIndeterminate) {
      const provinceNodeIndex = this.checkCheckedListIsHasProvinceNode(node)
      if (isIndeterminate) {
        // 如果子节点有部分选中，则直接删除父节点；
        this.removeCheckedListNodeByIndex(provinceNodeIndex)
      } else {
        const citys = node.citys
        if (provinceNodeIndex !== -1)  this.removeCheckedListNodeByIndex(provinceNodeIndex)
        for(let i = 0; i < citys.length; i++) {
          // const areaNodeIndex = this.checkCheckedListIsHasAreaNode(areas[i])
          // if (areaNodeIndex !== -1)  this.removeCheckedListNodeByIndex(areaNodeIndex)
          this.removeCheckedListCityNodeByNode(citys[i], citys[i].isIndeterminate, node)
        }
      }
    },
    // 获取当前currOneNode节点市级选中 个数
    getCheckedCitysCount(currOneNode) {
      let count = 0
      if (currOneNode) {
        const citys = currOneNode.citys
        let len = citys.length
        for (let i = 0; i < len; i++) {
          const index = this.checkedList.findIndex(item => {
            return item.receivedCityCode === citys[i].code && item.city
          })
          if (index >= 0) {
            count++
          }
        }
      }
      return count
    },
    // 当前currOneNode节点县级是否有选中, 由于县级节点 存在的话有会有receivedCityCode字段，所以通过该字段判断即可
    isHasCheckedArea(currOneNode) {
      let isTrue = false
      const citys = currOneNode.citys
      let len = citys.length
      for (let i = 0; i < len; i++) {
        const index = this.checkedList.findIndex(item => {
          return item.receivedCityCode === citys[i].code && !item.city
        })
        if (index >= 0) {
          isTrue = true
          break
        }
      }
      return isTrue
    },
    // 设置1级省级的状态 选中、待定、还是未选中； 处理逻辑，当前节点（currOneNode）下的子节点是否全部存在于checkedlist，如果存在则选中，如果不勾选则不选中，如果勾选一部分，则待定状态
    setOneLevelStatus() {
      const currOneNode = this.currOneNode
      if (currOneNode) {
        const key = this.region.findIndex(item => {
          return currOneNode.code === item.code
        })
        const citys = currOneNode.citys
        let len = citys.length
        const count = this.getCheckedCitysCount(currOneNode)
        if (len === count) {
          this.region[key].checked = true
          this.region[key].isIndeterminate = false
          // 将省级push到列表中
          const provinceIndex = this.checkCheckedListIsHasProvinceNode(currOneNode)
          if (provinceIndex === -1) {
            const node = this.getCurrCheckedProvinceNode(currOneNode, currOneNode.isIndeterminate)
            if (node) {
              this.checkedList.push(node)
            }
          }
        } else if (count === 0) {
          this.region[key].checked = false
          this.region[key].isIndeterminate = this.isHasCheckedArea(currOneNode)
        } else {
          this.region[key].checked = false
          this.region[key].isIndeterminate = true
        }
        
      }
    },
    // 设置全选状态
    setAllCheckedStatus() {
      let isAllChecked = true
      let count = 0
      this.region.forEach(item => {
        if (!item.checked) {
          isAllChecked = false
        } else {
          count++
        }
      })
      // console.log(count, isAllChecked,(count === 0 || count === this.region.length))
      this.checkedAll = isAllChecked
      this.isAllIndeterminate = count === 0 || count === this.region.length ? false : true
    },
    checkListchange(data, checked, indeterminate) {
      // 当前节点是否为市节点
      if (!data.areas) {
        const areaNodeIndex = this.checkCheckedListIsHasAreaNode(data)
        // 当前节点是否选中
        if (checked) {
          // 列表中是否存在区县节点
          if (areaNodeIndex === -1) {
            const node = this.getCurrCheckedAreaNode(data, indeterminate)
            // 获取省市区县等完全信息后，判断判断当前node是否有效
            if (node) {
              this.checkedList.push(node)
            }
          }
        } else {
          if (areaNodeIndex !== -1) {
            this.removeCheckedListAreaNodeByNode(data)
            // this.removeCheckedListNodeByIndex(areaNodeIndex)
          }
        }
      } else {
        const cityNodeIndex = this.checkCheckedListIsHasCityNode(data)
        if (checked) {
          // 列表中是否存在市节点
          if (cityNodeIndex === -1) {
            const node = this.getCurrCheckedCityNode(data, indeterminate)
            // 获取省市等完全信息后，判断判断当前node是否有效，并且是选中状态
            if (node) {
              this.pushCityNode(node)
            }
          }
        }
        else {
          if (cityNodeIndex !== -1) {
            this.removeCheckedListCityNodeByNode(data, indeterminate)
          }
        }
      }
      this.setOneLevelStatus()
      this.setAllCheckedStatus()
    },
    checkboxChange(data) {
      this.currOneNode = data
      // const index = this.checkCheckedListIsHasProvinceNode(data)
      if (data.checked) {
        data.isIndeterminate = false
        // 添加到checkedlist
        // if (index === -1) {
          const node = this.getCurrCheckedProvinceNode(data, data.isIndeterminate)
          // if (node) {
            this.pushProvinceNode(node)
            this.defaultCheckedCode = this.getDefaultCheckedCodeByNode(data)
          // }
        // }
      } else {
        // 删除checkedlist
        // if (index !== -1) {
          this.removeCheckedListProvinceNodeByNode(data, data.isIndeterminate)
          // this.defaultCheckedCode = []
          const areaTree = this.$refs.areaTree
          if (areaTree && areaTree.length > 0 ) this.$refs.areaTree[0].setCheckedKeys([]);
        // }
      }
      this.setAllCheckedStatus()
    },
    getOriginalProvinceNode(node) {
      const index = this.region.findIndex(item => {
        return item.code === node.code
      })
      return index
    },
    handleClose(tag) {
      // console.log(tag)
      // 为省级
      if (tag.province) {
        const index = this.getOriginalProvinceNode(tag.province)
        
        if (index !== -1) {
          const province = this.region[index]
          province.checked = false
          this.checkboxChange(province)
        }
      }
      // 为市级
      if (tag.city) {
        const city = tag.city
        this.checkListchange(city, false, false)
      }
      // 为县级
      if (tag.receivedAreaCode) {
        this.checkListchange({
          code: tag.receivedAreaCode,
          name: tag.name
        }, false, false)
      }
      // this.checkList.splice(this.checkList.indexOf(tag), 1);
      // let _region = JSON.parse(JSON.stringify(this.region))

      // _region.forEach(val => {
      //   let arr = tag.split(',')

      //   if(arr[0] == ' ' && arr[1] == ' ' && arr[2] == ' ') {
      //     if(val.name == arr[3]) {
      //       val.checkList = []
      //     }
      //   } else {
      //     for(let i=0; i<val.checkList.length; i++) {
      //       if(val.checkList[i] == tag) {
      //         val.checkList.splice(i, 1)
      //         i--
      //       }
      //     }
      //   }
      // })

      // this.region = _region

      // this.region.forEach((val, index) => {
      //   this.checkListchange(index)
      // })
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
            val.checked = false
          });
          this.region = response;
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error);
        });
    },
    formateSubmitData() {
      let arr = []
      const { provinceList } = this.getProvinceList()
      const { cityList } = this.getCityList()
      const areaList = this.getAreaList()
      const province = provinceList.map(item => {
        delete item.province
        delete item.isIndeterminate
        return item
      })
      const city = cityList.map(item => {
        delete item.city
        delete item.isIndeterminate
        return item
      })
      const area = areaList.map(item => {
        delete item.isIndeterminate
        return item
      })
      // console.log('province',province)
      // console.log('city',city)
      // console.log('city',area)
      arr = arr.concat(province,city,area)
      return arr
    },
    submit() {
      // const data = this.checkedTagList()
      const data = this.formateSubmitData()
      this.$emit(
        "submit",
        data
        // this.checkList2.map(val => {
        //   let arr = val.split(",");

        //   return {
        //     code: arr[0],
        //     name: arr[1],
        //     city: {
        //       code: arr[2],
        //       name: arr[3]
        //     }
        //   };
        // })
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
    // 通过node 节点获取默认选中值
    getDefaultCheckedCodeByNode(node) {
      const arr = []
      this.checkedList.forEach(item => {
        const index = node.citys.findIndex(val => {
          return val.code === item.receivedCityCode
        })
        if (index !== -1 && !item.city) {
          arr.push(item.receivedAreaCode)
        }
        if (index !== -1 && item.city) {
          arr.push(item.receivedCityCode)
        }
      })
      return arr
    },
    //鼠标移入、覆盖
    titleMouseover(item) {
      const tempItem = [...this.region];
      for (let one of tempItem) {
        if (one.code === item.code) {
          //one.checked = true;
          one.over = !one.over;
        } else {
          //one.checked = false;
          one.over = false;
        }
      }
      this.region = tempItem;
      this.currOneNode = item
      // console.log('titleMouseover',item)
      this.checkboxChange(item)
      this.defaultCheckedCode = this.getDefaultCheckedCodeByNode(item)
    },

    //鼠标移出
    titleMouseout() {
      // console.log('--titleMouseout--')
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
  //  width: 90px;
  //  margin: 0 5px 10px 0 !important;
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
    width: 150px;
    margin: 0 0 10px !important;
    position: relative;
    .title {
      cursor: pointer;
      .icon {
        font-size: 12px;
        color:#B6B5C8;
        transition:all .5s;
        &.icon-isOpen {
          transform:rotate(90deg);
        }
      }
    }
    .citys {
      position: absolute;
      background: #fff;
      top: 0;
      z-index: 10;
      left: 50px;
      min-width: 200px;
      max-width: 500px;
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
      &-tree {
        max-height: 250px;
        overflow: auto;
      }
    }
  }
}
.dialog-footer {
  text-align: center;
}
// p.title:hover + .citys{
//  display:block;
// }
/deep/ .el-tag {
  padding: 0 5px;
}
.el-button+.el-button {
    margin-left: 20px;
}
/deep/ .dialog-footer {
  margin-top: 30px;
  .el-checkbox {
    float: left;
    margin-top: 6px;
  }
}
</style>
