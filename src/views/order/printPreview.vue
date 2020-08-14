<template>
    <div class="print_preview_body">
        <div class="print_preview_info">
            <div class="print_preview_left">
                <p>打印配送单小票</p>
                <a href="javascript:void(0)">修改打印机设置</a>
            </div>
            <div class="print_preview_center"></div>
            <div class="print_preview_right"></div>
        </div>
        
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },
    computed: {
    },
    methods:{
    }
}
</script>
<style lang="scss" scoped>
.print_preview_body{
    padding: 20px;
    background: #fff;
    height: 100%;
    .print_preview_info{
        height: 100%;
        padding: 20px 30px 38px 20px;
        display: flex;
        display:flex;
        display:-webkit-flex;
        justify-content:space-between;
        // flex-wrap:wrap;
        .print_preview_left{
            font-size: 14px;
            color: #3D434A;
            line-height: 20px;
            a{
                color: #655EFF;
                margin-top: 20px;
            }
        }
        .print_preview_center{
            width: 272px;
            height: 100%;
            background: violet;
            overflow-y:auto
        } 
    }
    
}
</style>