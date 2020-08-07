<template>
<el-dialog
    :visible.sync="visible" width="750px" :title="'请选择想创建自提点'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="false"
    @close="close"
    v-bind="$attrs"
    v-on="$listeners">
    <div class="dialog-container">
      <div class="dialogChooseAddress">
      <dl>
        <dt>
          <div class="address">
            地址
          </div>
          <div class="name">联系人</div>
          <div class="mobile">联系电话</div>
        </dt>
        <dd style="overflow:auto">
          <ul v-infinite-scroll="load" :infinite-scroll-disabled="isCompleted" >
            <li v-for="(item, key) in list" :key="key">
              <div class="address">
                <el-radio v-model="currAddress" :label="+item.id">
                  {{ item.address }}
                </el-radio>
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="mobile">{{ item.mobile }}</div>
            </li>
          </ul>
          <p class="prompt" v-if="loading">加载中。。。</p>
          <p class="prompt" v-if="isCompleted">已经到底了</p>
        </dd>
      </dl>
    </div>
    </div>
    <span slot="footer" class="dialog-footer fcc">
        <el-button type="primary" @click="submit">确 认</el-button>
        <el-button @click="visible = false">取 消</el-button>
    </span>
</el-dialog>
  <!-- <DialogBase :visible.sync="visible" width="750px" :title="'请选择想创建自提点'" @submit="submit">
    <div class="dialogChooseAddress">
      <dl>
        <dt>
          <div class="address">
            地址
          </div>
          <div class="name">联系人</div>
          <div class="mobile">联系电话</div>
        </dt>
        <dd style="overflow:auto">
          <ul v-infinite-scroll="load" :infinite-scroll-disabled="isCompleted" >
            <li v-for="(item, key) in list" :key="key">
              <div class="address">
                <el-radio v-model="currAddress" :label="+item.id">
                  {{ item.address }}
                </el-radio>
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="mobile">{{ item.mobile }}</div>
            </li>
          </ul>
          <p class="prompt" v-if="loading">加载中。。。</p>
          <p class="prompt" v-if="isCompleted">已经到底了</p>
        </dd>
      </dl>
    </div>
  </DialogBase> -->
</template>

<script>
import DialogBase from "@/components/DialogBase";
import utils from "@/utils";
export default {
  name: "dialogChooseAddress",
  components: {DialogBase},
  data() {
    return {
      ruleForm: {
        startIndex: 1,
        pageSize: 5
      },
      list: [],
      currAddress: null,
      loading: false,
      isCompleted: false
    }
  },
  props: {
      dialogVisible: {
          type: Boolean,
          required: true
      }
  },
  computed: {
    visible: {
      get() {
          return this.dialogVisible
      },
      set(val) {
          this.$emit('update:dialogVisible', val)
      }
    },
    shopInfo(){
        return JSON.parse(localStorage.getItem('shopInfos'))
     }
  },
  created(){
    // this.init()
  },
  methods: {
    close() {
      this.$emit('close');
      this.visible = false
    },
    load() {
      if (!this.loading) {
        console.log(222)
        this.getAddress()
      }
    },
    getAddress() {
      const req = this.ruleForm
      this.loading = true
      this._apis.set.getAddressList(req).then((res) => {
        if (res.list < req.pageSize) {
          this.isCompleted = true
          this.ruleForm.startIndex--
        } else {
          this.list = this.list.concat(res.list)
          this.ruleForm.startIndex++
        }
        // this.total = res.total
      }).catch((err) => {
        // this.$message.error(err || '获取数据失败')
      }).finally(() => {
        this.loading = false
      })
    },
    init() {
      this.getAddress()
    },
    submit() {
      if (!this.currAddress) {
        this.$message.error('请选择地址后再点击确定');
        this.visible = true
        return false
      }
      this.visible = false
      this.$emit('submit',this.currAddress)
    }
  }
}
</script>

<style lang="scss" scoped>
.dialogChooseAddress {
  overflow: hidden;
  .prompt {
    padding: 20px;
    text-align: center;
    color:#ccc;
  }
  dl {
    dt {
      display: flex;
    }
    dd, dt {
      ul li {
        display: flex;
      }
      .address {
        flex: 1;
        text-align: left;
        max-width: 441px;
        overflow: hidden;
      }
      .name {
        width: 120px;
        padding: 15px;
        text-align: center;
      }
      .mobile {
        width: 200px;
        padding: 15px;
        text-align: center;
      }
    }
    dt {
      background:rgba(246,247,250,1);
      font-size:14px;
      font-weight:500;
      color:rgba(68,67,75,1);
      line-height:20px;
      .address {
        padding: 15px 15px 15px 58px;   
      }
    }
    dd {
      height: 300px;
      ul li {
        padding: 5px 0;
        div {
          padding: 15px;
        }
        font-size:14px;
        font-weight:400;
        color:rgba(68,67,75,1);
        line-height:20px;
        border-bottom: 1px solid #D9DEE9;
      }
    }
  }
}
</style>
