<template>
  <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
    <div class="block form">
      <el-form-item label="购买公告" prop="buyType">
        <el-radio-group v-model="ruleForm.buyType">
          <el-radio :label="1">真实购买公告</el-radio>
          <el-radio :label="2">模拟购买公告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="字体大小" prop="fontSize">
        <el-radio-group v-model="ruleForm.fontSize">
          <el-radio :label="1">大</el-radio>
          <el-radio :label="2">中</el-radio>
          <el-radio :label="3">小</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="间隔时间" v-if="ruleForm.buyType === 2">
        <el-input v-model="ruleForm.intervalStart" style="width:60px"></el-input> - 
        <el-input v-model="ruleForm.intervalEnd" style="width:60px"></el-input>秒
      </el-form-item>
      <el-form-item label="背景颜色" prop="backgroundColor">
        <div class="color_block">
          <el-input v-model="ruleForm.backgroundColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.backgroundColor" defaultColor="rgb(255,248,233)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
      <el-form-item label="文字颜色" prop="fontColor">
        <div class="color_block">
          <el-input v-model="ruleForm.fontColor" :disabled="true"></el-input>
          <colorPicker  v-model="ruleForm.fontColor" defaultColor="rgb(102,102,102)"></colorPicker >
          <!-- <el-button type="text">重置</el-button> -->
        </div>
      </el-form-item>
       <el-form-item label="公告商品" prop="goods">
        <div class="goods_list">
          <ul>
            <li v-for="(item, key) of displayList" :key="key">
              <el-image :src="item.mainImage" alt="" lazy>
                <div slot="placeholder" class="el-image__lazyloading">
                    加载中...
                </div>
              </el-image>
              <i class="delete_btn" @click.stop="deleteItem(item)"></i>
            </li>
            <li class="add_button" @click="dialogVisible=true; currentDialog='dialogSelectGoods'">
              <i class="inner"></i>
              <p>添加商品</p>
            </li>
          </ul>
        </div>
      </el-form-item>
    </div>

     <!-- 动态弹窗 -->
    <component v-if="dialogVisible" :is="currentDialog" :dialogVisible.sync="dialogVisible" @dialogDataSelected="dialogDataSelected" :goodsEcho.sync="echoList"></component>
  </el-form>
</template>

<script>
import mixinPropsData from '../mixins/mixinPropsData';
import dialogSelectGoods from '@/components/Decorate/dialogs/dialogSelectGoods';
export default {
  name: 'propertyBuyNotice',
  mixins: [mixinPropsData],
  components: {dialogSelectGoods},
  data () {
    return {
      ruleForm: {
        buyType: 1,// 购买公告类型
        intervalStart: 10,//间隔时间开始
        intervalEnd: 60,// 间隔时间结束 
        fontSize: 2,
        backgroundColor: 'rgba(0,0,0,0.4)',//背景颜色
        fontColor: 'rgba(255,255,255,1)',//字体颜色
        ids: []//商品id列表
      },
      displayList: [],
      rules: {

      },
      echoList: [],
      dialogVisible: false,
      currentDialog: ''
    }
  },

  watch: {
    'items': {
      handler(newValue) {
        this.ruleForm.ids = [];
        for(let item of newValue) {
          this.ruleForm.ids.push(item.id);
        }
        this.fetch();
      },
      deep: true
    },
    'ruleForm.ids': {
      handler(newValue, oldValue) {
        const _self = this;
        if(!this.utils.isIdsUpdate(newValue, oldValue)) {
          this.echoList = [];
          newValue.forEach((item)=>{
            _self.echoList.push({id: item});
          })
        }
      },
      deep: true
    }
  },
  methods: {
    //根据ids拉取数据
    fetch(bNeedUpdateMiddle = true) {
      const componentData = this.ruleForm;
        if(componentData) {
          bNeedUpdateMiddle && this.syncToMiddle();
          if(Array.isArray(componentData.ids) && componentData.ids.length){
            this.loading = true;
            this._apis.goods.fetchAllSpuGoodsList({
                status: '1',
                ids: componentData.ids,
            }).then((response)=>{
                this.createList(response);
                this.loading = false;
            }).catch((error)=>{
                console.error(error);
                this.displayList = [];
                this.loading = false;
            });
          }else{
            this.displayList = [];
          }
        }
    },
      /* 创建数据 */
    createList(datas) {
      this.displayList = datas;
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.m-colorPicker .box.open {
    z-index: 10!important;
}
</style>
