<template>
  <DialogBase :visible.sync="visible" @submit="submit" title="评价获取积分规则" :hasCancel="hasCancel">
    <div class="c_container">
      <div class="clearfix">
        <span class="fl marR20">评价获取积分规则</span>
        <el-switch class="fl" v-model="enable" active-color="#66CCAC"></el-switch>
      </div>
      <div v-if="enable" class="giveBottom">
        <div>
          评价订单五星好评且满足以下条件可获得积分
          <p>（条件1和条件3可独立启用，条件2需在条件1基础上启用）</p>
        </div>
        <div>
          <span>条件1： 文字满</span>
          <div class="input_wrap">
            <el-input v-model="fullWord1" @keyup.native="checkZero($event,fullWord1,'fullWord1')"></el-input>
          </div>
          <span>字</span>
          <span v-if="distinguish1 == false">获得</span>
          <div class="input_wrap" v-if="distinguish1 == false">
            <el-input v-model="allMember1" @keyup.native="checkZero($event,allMember1,'allMember1')"></el-input>
          </div>
          <span v-if="distinguish1 == false">积分&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-checkbox v-model="distinguish1">区分人群奖励</el-checkbox>
        </div>
        <div v-if="distinguish1 == true">
          <span>客户</span>
          <div class="input_wrap">
            <el-input v-model="noMember1" @keyup.native="checkZero($event,noMember1,'noMember1')"></el-input>
          </div>
          <span>积分</span>
          <span>新会员</span>
          <div class="input_wrap">
            <el-input v-model="newMember1" @keyup.native="checkZero($event,newMember1,'newMember1')"></el-input>
          </div>
          <span>积分</span>
          <span>老会员</span>
          <div class="input_wrap">
            <el-input v-model="oldMember1" @keyup.native="checkZero($event,oldMember1,'oldMember1')"></el-input>
          </div>
          <span>积分</span>
        </div>
        <div>
          <span>条件2： 满</span>
          <div class="input_wrap">
            <el-input v-model="fullWord2" @blur="checkBigger($event,fullWord2,'fullWord2')"></el-input>
          </div>
          <span>字</span>
          <span v-if="distinguish2 == false">额外获得</span>
          <div class="input_wrap" v-if="distinguish2 == false">
            <el-input v-model="allMember2" @keyup.native="checkZero($event,allMember2,'allMember2')"></el-input>
          </div>
          <span v-if="distinguish2 == false">积分&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-checkbox v-model="distinguish2">区分人群奖励</el-checkbox>
        </div>
        <div v-if="distinguish2 == true">
          <span>客户</span>
          <div class="input_wrap">
            <el-input v-model="noMember2" @keyup.native="checkZero($event,noMember2,'noMember2')"></el-input>
          </div>
          <span>积分</span>
          <span>新会员</span>
          <div class="input_wrap">
            <el-input v-model="newMember2" @keyup.native="checkZero($event,newMember2,'newMember2')"></el-input>
          </div>
          <span>积分</span>
          <span>老会员</span>
          <div class="input_wrap">
            <el-input v-model="oldMember2" @keyup.native="checkZero($event,oldMember2,'oldMember2')"></el-input>
          </div>
          <span>积分</span>
        </div>
        <div>
          <span>条件3： 图片/视频满</span>
          <div class="input_wrap">
            <el-input v-model="fullWord3" @keyup.native="checkZero($event,fullWord3,'fullWord3')"></el-input>
          </div>
          <span>张/条</span>
          <span v-if="distinguish3==false">可获得</span>
          <div class="input_wrap" v-if="distinguish3==false">
            <el-input v-model="allMember3" @keyup.native="checkZero($event,allMember3,'allMember3')"></el-input>
          </div>
          <span v-if="distinguish3==false">积分&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-checkbox v-model="distinguish3" @keyup.native="checkZero($event,distinguish3,'distinguish3')">区分人群奖励</el-checkbox>
        </div>
        <div v-if="distinguish3 == true">
          <span>客户</span>
          <div class="input_wrap">
            <el-input v-model="noMember3" @keyup.native="checkZero($event,noMember3,'noMember3')"></el-input>
          </div>
          <span>积分</span>
          <span>新会员</span>
          <div class="input_wrap">
            <el-input v-model="newMember3" @keyup.native="checkZero($event,newMember3,'newMember3')"></el-input>
          </div>
          <span>积分</span>
          <span>老会员</span>
          <div class="input_wrap">
            <el-input v-model="oldMember3" @keyup.native="checkZero($event,oldMember3,'oldMember3')"></el-input>
          </div>
          <span>积分</span>
        </div>
      </div>
    </div>
  </DialogBase>
</template>
<script>
import DialogBase from "@/components/DialogBase";
export default {
  props: ["data"],
  name: "repurchaseRegularDialog",
  data() {
    return {
      hasCancel: true,
      enable: false,
      distinguish1: false,
      distinguish2: false,
      distinguish3: false,
      fullWord1: "",
      fullWord2: "",
      fullWord3: "",
      allMember1: "",
      allMember2: "",
      allMember3: "",
      noMember1: "",
      noMember2: "",
      noMember3: "",
      newMember1: "",
      newMember2: "",
      newMember3: "",
      oldMember1: "",
      oldMember2: "",
      oldMember3: ""
    };
  },
  methods: {
    checkZero(event,val,ele) {
      val = val.replace(/[^\d]/g,'');
      val = val.replace(/^0/g,'');
      this[ele] = val;
    },
    checkBigger(event,val,ele) {
      val = val.replace(/[^\d]/g,'');
      val = val.replace(/^0/g,'');
      if(Number(val) <= Number(this.fullWord1)) {
        val = "";
        this.$notify({
          title: '警告',
          message: '条件2文字个数需大于条件1的',
          type: 'warning'
        });
      }
      this[ele] = val;
    },
    submit() {
      let params;
      if (this.enable) {
        params = {
          id: this.data.row.id,
          enable: this.enable,
          sceneRule: {
            condition1: {
              distinguish: this.distinguish1,
              noDistinguish: {
                fullWord: this.fullWord1,
                allMember: this.allMember1
              },
              yesDistinguish: {
                fullWord: this.fullWord1,
                noMember: this.noMember1,
                newMember: this.newMember1,
                oldMember: this.oldMember1
              }
            },
            condition2: {
              distinguish: this.distinguish2,
              noDistinguish: {
                fullWord: this.fullWord2,
                allMember: this.allMember2
              },
              yesDistinguish: {
                fullWord: this.fullWord2,
                noMember: this.noMember2,
                newMember: this.newMember2,
                oldMember: this.oldMember2
              }
            },
            condition3: {
              distinguish: this.distinguish3,
              noDistinguish: {
                fullWord: this.fullWord3,
                allMember: this.allMember3
              },
              yesDistinguish: {
                fullWord: this.fullWord3,
                noMember: this.noMember3,
                newMember: this.newMember3,
                oldMember: this.oldMember3
              }
            }
          }
        };
      }else{
          params = {
              id: this.data.row.id,
              enable: this.enable,
          }
      }

      this._apis.client
        .editCreditRegular(params)
        .then(response => {
          this.$notify({
            title: "成功",
            message: "保存成功",
            type: "success"
          });
          this.$emit('refreshPage');
        })
        .catch(error => {
          console.log(error);
        });
    },
    getInfo() {
      let row = this.data.row;
      if (row.sceneRule.length > 0) {
        let sceneRule = JSON.parse(row.sceneRule);
        this.enable = row.enable == "启用" ? true : false;
        this.distinguish1 = sceneRule.condition1.distinguish ? true : false;
        this.fullWord1 =
          sceneRule.condition1.noDistinguish.fullWord ||
          sceneRule.condition1.yesDistinguish.fullWord;
        this.allMember1 = sceneRule.condition1.noDistinguish.allMember;
        this.newMember1 = sceneRule.condition1.yesDistinguish.newMember;
        this.noMember1 = sceneRule.condition1.yesDistinguish.noMember;
        this.oldMember1 = sceneRule.condition1.yesDistinguish.oldMember;
        this.distinguish2 = sceneRule.condition2.distinguish ? true : false;
        this.fullWord2 =
          sceneRule.condition2.noDistinguish.fullWord ||
          sceneRule.condition2.yesDistinguish.fullWord;
        this.allMember2 = sceneRule.condition2.noDistinguish.allMember;
        this.newMember2 = sceneRule.condition2.yesDistinguish.newMember;
        this.noMember2 = sceneRule.condition2.yesDistinguish.noMember;
        this.oldMember2 = sceneRule.condition2.yesDistinguish.oldMember;
        this.distinguish3 = sceneRule.condition3.distinguish ? true : false;
        this.fullWord3 =
          sceneRule.condition3.noDistinguish.fullWord ||
          sceneRule.condition3.yesDistinguish.fullWord;
        this.allMember3 = sceneRule.condition3.noDistinguish.allMember;
        this.newMember3 = sceneRule.condition3.yesDistinguish.newMember;
        this.noMember3 = sceneRule.condition3.yesDistinguish.noMember;
        this.oldMember3 = sceneRule.condition3.yesDistinguish.oldMember;
      }
    }
  },
  computed: {
    visible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      }
    }
  },
  mounted() {
    this.getInfo();
  },
  props: {
    data: {},
    dialogVisible: {
      type: Boolean,
      required: true
    }
  },
  components: {
    DialogBase
  }
};
</script>
<style lang="scss" scoped>
.c_container {
  > div {
    margin-bottom: 17px;
  }
  .giveBottom {
    > div {
      text-align: left;
      margin-bottom: 17px;
      .input_wrap {
        width: 80px;
        display: inline-block;
      }
    }
  }
  .marR20 {
    margin-right: 20px;
  }
}
</style>


