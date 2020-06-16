<template>
    <DialogBase class="freight-rules" :visible.sync="visible" title="计费规则说明" width="730px" :showFooter="showFooter">
        <pre>运费计算方式

支持商家选择【按商品累加运费】和【组合运费】，默认使用组合运费。

1.按商品累加运费

    1）不同或相同的商品，设置同一运费模板：按该模板设置的规则计算

         更新：不足续件或者续重的数目的时候，仍然按照续件或者续重的数目进行计算。

         例如商品A，B都是用模板M（首件10块，续2件5块），如果购买商品A和B，各一件，则一共购买
         两件，运费=10+5=15元。

    2）不同的商品，设置不同的运费模板：分别计算每个运费模板规则应收运费，再累加计算合计运费；

          例如： 例如商品A（1kg）使用用模板M（首1kg，10块，续2kg，5块），商品B（0.5kg）使用模
          板N（首2kg，12块，续1kg，5块），如果购买商品A和B，各2件，则运费=模板M的运费+模板N的
          运费=（10+5）+（12）=27元。

2.组合运费

运费模板计费原则：首运费取所有商品中，首件/首重/首体积金额最大的运费模板，使用其他模板的商品
都按照相应续件/续重/续体积金额来计算，再求和。

    1）不同或相同的商品，设置同一运费模板：同按商品累加运费的计算方式，按该模板设置的规则计
    算。

         例如商品A，B都是用模板M（首件10块，续2件5块），如果购买商品A和B，各一件，则一共购买
         两件，运费=10+5=15元。

    2）不同的商品，设置不同的运费模板：不同于按照商品累加的计算方式。

          例如： 例如商品A（1件）使用用模板M（首1件，10块，续1件，5块），商品B（1kg）使用模板
          N（首2kg，12块，续1kg，5块），如果购买商品A和B，各2件，则运费=模板N的运费（首费为12，
          大于模板M的10）+模板M的运费（按照续费计算）=（12）+（5*2）=22元。

          如果按商品累加计费，则运费=模板M的运费+模板N的运费=（10+5）+（12）=27元。

备注：

商品关联运费模板

1、商品关联设置：每件商品，仅可设置一种运费收取方式，即指定运费模板；

2、运费模板：选择相应的运费模板，即可指定该商品，可配送至相应区域，并按规则收取相应运费；</pre>
    </DialogBase>
</template>
<script>
import DialogBase from '@/components/DialogBase'

export default {
    data() {
        return {
            showFooter: false,
        }
    },
    methods: {
        
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
    },
    props: {
        data: {

        },
        dialogVisible: {
            type: Boolean,
            required: true
        },
    },
    components: {
        DialogBase
    }
}
</script>
<style lang="scss">
   .freight-rules {
       .dialog-container {
           text-align: left;
       }
   }
</style>


