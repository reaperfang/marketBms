<template>
    <div class="p_container">
        <!-- <div class="clearfix">
          <div class="fr">
            <el-radio-group class="fr" v-model="visitSourceType" @change="all">
              <el-radio-button class="btn_bor" label="0" v-permission="['数据', '会员消费', '全部']">全部</el-radio-button>
              <el-radio-button class="btn_bor" label="1" v-permission="['数据', '会员消费', '小程序']">小程序</el-radio-button>
              <el-radio-button class="btn_bor" label="2" v-permission="['数据', '会员消费', '公众号']">公众号</el-radio-button>
            </el-radio-group>
          </div>
      </div> -->
        <div class="pane_container">
            <div class="i_line">
                <div class="input_wrap">
                    <el-select placeholder="排序" v-model="order" @change="changeSelet">
                        <el-option label="全部" value="0"></el-option>
                        <el-option label="订单数" value="deal_times"></el-option>
                        <el-option label="消费金额" value="total_deal_money"></el-option>
                    </el-select>
                </div>
                <div class="input_wrap">
                    <el-input placeholder="手机号" v-model="memberPhone">
                        <el-button slot="append" icon="el-icon-search" @click="changKeyWord(memberPhone)"></el-button>
                    </el-input>
                </div>
            </div>
            <el-table
            :data="list"
            :header-cell-style="{background:'#F6F7FA', color:'#44434B'}"
            style="margin-top:30px;width: 100%" 
            v-loading="loading"
            >
            <el-table-column
                type="index"
                label="排行"
                fixed="left"
                class-name="table-padding"
                width="100"
                align="left">
            </el-table-column>
            <el-table-column
                prop="name"
                align="center"
                label="会员昵称">
            </el-table-column>
            <el-table-column
                prop="phone"
                align="center"
                min-width="140"
                label="手机号">
            </el-table-column>
            <el-table-column
                prop="levelName"
                align="center"
                label="等级"
            >
            </el-table-column>
            <el-table-column
                prop="score"
                min-width="140"
                label="积分（余额）"
                align="right"
            >
            </el-table-column>
            <el-table-column
                prop="totalTradeMoney"
                min-width="170"
                label="消费金额（累计）"
                align="right"
            >
            </el-table-column>
            <el-table-column
                prop="orderCount"
                min-width="160"
                label="订单数（累计）"
                align="right"
                fixed="right"
                class-name="table-padding"
            >
            </el-table-column>
            </el-table>
            <div class="page_styles">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="startIndex"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    layout="prev, pager, next, sizes"
                    :total="total"
                    :background="true">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'memberConsumption',
    data() {
        return {
            order:'0',
            memberPhone:'',
            list:[],
            total:0,
            startIndex:1,
            pageSize:10,
            visitSourceType:0,
            loading: true
        }
    },
    created(){
        this.getMemberConsumption()
    },
    props:['background'],
    methods:{
        getMemberConsumption(){
            let data = {
                startIndex:this.startIndex,
                pageSize:this.pageSize,
                orderBy:this.order == '0' ? null : this.order,
                memberPhone:this.memberPhone
            };
            this.loading = true;
            this._apis.data.memberConsumption(data).then(response => {
                this.list = response.list;
                this.total = response.total
                this.loading = false;
            }).catch(error => {
                this.$message.error(error);
                this.loading = false;
            });
        },

        changeSelet(){
            this.getMemberConsumption()
        },

        handleSizeChange(val){
            this.pageSize = val;
            this.getMemberConsumption()
        },

        handleCurrentChange(val){
            this.startIndex = val
            this.getMemberConsumption()
        },
        changKeyWord(val){
            this.getMemberConsumption()
        }

        // all(){
        //     this.value = '';
        //     this.keyWords = '';
        //     this.orderSortType = 0;
        //     this.getMemberConsumption(1,10)
        // },
    },
}
</script>
<style lang="scss" scoped>
.p_container{
    padding: 20px;
    background-color: #fff;
    min-height:100%;
    border-radius: 4px;
    .pane_container{
        color: #3D434A;
        .i_line{
            font-size: 0;
            .input_wrap{
                // width: 320px;
                display: inline-block;
                margin-right: 20px;
            }
        }
    }
}
.page_styles {
    margin: 40px 0 30px 0;
}
.p_container .input_wrap{
    vertical-align: middle;
}
/deep/.el-input{
    .el-input__inner{
        width: 210px;
    }
}
</style>

