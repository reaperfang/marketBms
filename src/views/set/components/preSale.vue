/*售前相关 */
<template>
  <div class="main">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <div class="item">
            <h2>自动关闭未付款订单：</h2>
            <el-form-item label="拍下未付款:" prop="autoCancelUnpayOrder">
                <el-input-number 
                v-model="form.autoCancelUnpayOrder" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="当前未启动该功能，输入数值即生效"
                :min="1" 
                :precision="0"
                v-if="form.acuoType == 1">
                </el-input-number>
                <el-input-number 
                v-model="form.autoCancelUnpayOrder" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="当前未启动该功能，输入数值即生效"
                :min="1" 
                :precision="0"
                v-else>
                </el-input-number>
                <el-select 
                v-model="form.acuoType" 
                placeholder="请选择" 
                style="width:100px;">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                后，订单自动关闭
            </el-form-item>
        </div>
        <div class="item">
            <h2>发货方式：</h2>
            <el-form-item  prop="deliverGoodsType">
                <el-checkbox v-model="deliverGoodsTypeCheckout">快递发货</el-checkbox>
                <el-popover
                  placement="top-start"
                  title="选择计费方式"
                  width="430"
                  trigger="hover">
                  <div class="scrollContent">
                    <p>选择计费方式说明</p>
                    <p>支持商家选择【按商品累加运费】和【组合运费】，默认使用组合运费。</p>
                    <p>1.按商品累加运费</p>
                    <p> 1）不同或相同的商品，设置同一运费模板：按该模板设置的规则计算不足续件或者续重的数目的时候，仍然按照续件或者续重的数目进行计算。</p>
                    <p> 例如商品A，B都是用模板M（首件10块，续2件5块），如果购买商品A和B，各一件，则一共购买两件，运费=10+5=15元。</p>
                    <p>2）不同的商品，设置不同的运费模板：分别计算每个运费模板规则应收运费，再累加计算合计运费；</p>
                    <p>例如： 例如商品A（1kg）使用用模板M（首1kg，10块，续2kg，5块），商品B（0.5kg）使用模板N（首2kg，12块，续1kg，5块），如果购买商品A和B，各2件，则运费=模板M的运费+模板N的运费=（10+5）+（12）=27元。</p>
                    <p>2.组合运费</p>
                    <p>运费模板计费原则：首运费取所有商品中，首件/首重/首体积金额最大的运费模板，使用其他模板的商品都按照相应续件/续重/续体积金额来计算，再求和。</p>
                    <p>1）不同或相同的商品，设置同一运费模板：同按商品累加运费的计算方式，按该模板设置的规则计算。</p>
                    <p>例如商品A，B都是用模板M（首件10块，续2件5块），如果购买商品A和B，各一件，则一共购买两件，运费=10+5=15元。</p>
                    <p>2）不同的商品，设置不同的运费模板：不同于按照商品累加的计算方式。</p>
                    <p>例如： 例如商品A（1件）使用用模板M（首1件，10块，续1件，5块），商品B（1kg）使用模板N（首2kg，12块，续1kg，5块），如果购买商品A和B，各2件，则运费=模板N的运费（首费为12，大于模板M的10）+模板N的运费（按照续费计算）=（12）+（5*2）=22元。</p>
                    <p>如果按商品累加计费，则运费=模板M的运费+模板N的运费=（10+5）+（12）=27元。</p>
                    <p>注：①运费模板：选择相应的运费模板，即可指定该商品，可配送至相应区域，并按规则收取相应运费；</p>
                    <p>②每件商品，仅可设置一种运费收取方式，即指定运费模板</p>
                  </div>
                  <el-button slot="reference" class="data_note">
                    <i class="el-icon-warning-outline"></i>
                  </el-button>
                </el-popover>
                选择计费方式：
                <el-radio-group v-model="form.transportationExpenseType">
                    <el-radio :label="0">组合运费（推荐）</el-radio>
                    <el-radio :label="1">按商品累计运费</el-radio>
                </el-radio-group>
                <el-checkbox  
                disabled 
                v-model="form.name5" 
                style="display:block;">
                自提店自提（本期暂不支持）
                </el-checkbox>
                <el-checkbox  
                disabled 
                v-model="form.name6"
                style="display:block;">
                商家自送（本期暂不支持）
                </el-checkbox>
            </el-form-item>
        </div>
        <div class="item">
            <h2>自动发货：<span>开启后立即对所有订单生效，若需要关闭该功能则清空输入框数值</span></h2>
            <el-form-item  prop="orderAutoSend" label="下单">
                <el-input-number 
                v-model="form.orderAutoSend" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="当前未启动该功能，输入数值即生效"
                :min="1" 
                :precision="0"
                v-if="form.oasType == 1">
                </el-input-number>
                <el-input-number 
                v-model="form.orderAutoSend" 
                controls-position="right" 
                style="width:260px;" 
                placeholder="当前未启动该功能，输入数值即生效"
                :min="1" 
                :precision="0"
                v-else>
                </el-input-number>
                <el-select 
                v-model="form.oasType" 
                placeholder="请选择" 
                style="width:100px;">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
                后，订单状态变更为已发货
            </el-form-item>
        </div>
        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" v-permission="['设置', '交易设置', '售前相关', '保存']">保存</el-button>
        </el-form-item>
    </el-form>
  </div>     
</template>

<script>
export default {
  name: 'preSale',
  data() {
    return {
      currentTab: 'preSale',
      form: {
            autoCancelUnpayOrder: '',
            acuoType: 1,
            deliverGoodsType:1,
            transportationExpenseType: 1,
            orderAutoSend: '',
            oasType: ''
        },
     rules: { },
     options: [
        {
          value: 1,
          label: '小时'
        }, 
        {
          value: 2,
          label: '分钟'
        }, 
     ]
    }
  },
  components: {},
  watch: {
  },
  computed:{
      deliverGoodsTypeCheckout:{
        get: function () {
            return this.form.deliverGoodsType == 1 ? true : false
        },
        set: function (newValue) {
            this.form.deliverGoodsType = newValue == true ? 1 : ''
        }
      },
      cid(){
          let shopInfo = JSON.parse(localStorage.getItem('shopInfos'))
          return shopInfo.id
      }
   },
  created() {
      this.getShopInfo()
  },
  destroyed() {
    
  },
  methods: {
    getShopInfo(){
      let id = this.cid
      this._apis.set.getShopInfo({id:id}).then(response =>{
        this.form = response
      }).catch(error =>{
        this.$notify.error({
          title: '错误',
          message: error
        });
      })
    },

    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            let id = this.cid
            let data = {
              id:id,
              autoCancelUnpayOrder:this.form.autoCancelUnpayOrder,
              acuoType:this.form.acuoType,
              deliverGoodsType:this.form.deliverGoodsType,
              transportationExpenseType:this.form.transportationExpenseType,
              orderAutoSend:this.form.orderAutoSend,
              oasType:this.form.oasType
            }
            this._apis.set.updateShopInfo(data).then(response =>{
              this.$notify.success({
                title: '成功',
                message: '保存成功！'
              });
            }).catch(error =>{
              this.$notify.error({
                title: '错误',
                message: error
              });
            })
          }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
.item{
    border-bottom: 1px dashed #D3D3D3;
    padding-bottom: 20px;
    margin-bottom: 20px;
    h2{
        font-size: 14px;
        color: #3D434A;
        margin-bottom: 20px;
        span{
            font-size: 12px;
            color: #92929B;
        }
    }
}
.data_note{
    color: #655EFF;
    font-size: 14px;
    cursor: pointer;
    border:none;
  }
.scrollContent{
  width:400px;
  height: 200px;
  overflow-y: scroll;
}
</style>