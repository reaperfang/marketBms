<template>
    <svg viewBox="0 0 28 28" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="页面1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="搜索商品展示1" transform="translate(-318.000000, -259.000000)" :stroke="color1">
                <g id="编组" transform="translate(15.000000, 166.000000)">
                    <g id="添加按钮" transform="translate(304.000000, 94.000000)">
                        <circle id="椭圆形" cx="13" cy="13" r="13"></circle>
                        <g id="编组-8" transform="translate(5.200000, 5.200000)">
                            <path d="M2.96000696,3.86 L0.627259708,14.06 L14.9704231,14.06 L12.5990783,3.86 L2.96000696,3.86 Z" id="矩形"></path>
                            <path d="M5.57142857,7.84 L5.57142857,2.7778463 C5.57142857,1.24368415 6.56919399,0 7.8,0 C9.03080601,0 10.0285714,1.24368415 10.0285714,2.7778463 L10.0285714,7.84" id="路径"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
</template> 
<script>
export default {
    name:"gwcIcon",
    data(){
        return{
            width:56,
            height:56
        }
    },
    created() {
          this.$store.dispatch('getShopStyle');
    },
    computed: {
        colorStyle() {
          return this.$store.getters.colorStyle || {colors:[]};
        },
        color1(){
            return this.colorStyle.colors && this.colorStyle.colors[0]
        },
        color2(){
            return this.colorStyle.colors && this.colorStyle.colors[1]
        },
        color3(){
            return this.colorStyle.colors && this.colorStyle.colors[2]
        }
    }
}
</script>
<style lang="scss" scoped>

</style>

