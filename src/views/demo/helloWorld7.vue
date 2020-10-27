<template>
  <div class="hello">
    <h1>{{ msg }}</h1>


    <!-- 接口数据请求demo -->
    <el-card>
      <h1>接口数据请求demo</h1>
      <div v-for="(item, key) of data" :key="key">
        {{item.addressDetail}}
      </div>
    </el-card>
    <el-card>
      <h1>websocket测试demo</h1>
      接收消息：{{socketValue}}
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld7',
  data () {
    return {
      msg: '中企电商VUE框架',
      data: null,
      socketValue: ''
    }
  },

  created() {
    this.fetch();
  },

  methods:{
    fetch() {
      const _self = this;

      //获取列表demo
      this._apis.demo.getList({}).then((response)=>{
        this.data = response;
      }).catch((error)=>{
        this.$message.error(error);
      })

      //获取详情demo
      this._apis.demo2.getDemoDetail({id: 644}).then((response)=>{
        this.data = response;
      }).catch((error)=>{
        this.$message.error(error);
      })

      //长连接demo
      this._apis.websocketDemo.getData({aaa:1}, {
        onopen: () => {
          // console.log('opened');
        },
        onmessage: (res) => {
          _self.socketValue = res;
          // console.log(res);
        },
        onclose: (onclose) => {
          // console.log('closed原因：' + onclose);
        },
        onerror: (error) => {
          console.error(error);
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
