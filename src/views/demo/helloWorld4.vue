<template>
  <div class="hello">
    <h1>{{ msg }}</h1>


    <!-- 取色器demo -->
    <el-card style="height: 380px;">
      <h1>取色器</h1>
      <colorPicker  v-model="color" defaultColor="#ff0000"></colorPicker >
    </el-card>

    <!-- 时间轴demo -->
    <el-card>
      <h1>时间轴</h1>
      <div style="width:700px;">
        <light-timeline :items="items">
          <template slot='tag' slot-scope='{ item }'>
            {{item.tag}}
          </template>
          <template slot='content' slot-scope='{ item }'>
            {{item.content}}, {{item.context}}
          </template>
        </light-timeline>
      </div>
    </el-card>

    <!-- 四级联动demo -->
    <el-card style="height:420px;">
      <h1>四级联动</h1>
      <area-select type='all' v-model='selected' :data='$pcaa' :level='3'></area-select>
      <p>{{selected}}</p>
      <area-cascader :level="2" :data='$pcaa' v-model='selected2'></area-cascader>
      <p>{{selected2}}</p>
    </el-card>

  </div>
</template>

<script>
import utils from '@/utils';
export default {
  name: 'HelloWorld4',
  data () {
    return {
      msg: '中企电商VUE框架',
      color: '#ff0000',
      items: [
        {
          tag: '2019-02-12',
          content: '测试内容测试内容测试内容测试内容测试内容测试内容'
        },
        {
          tag: '2019-02-13',
          type: 'circle',
          content: '练习内容练习内容练习内容练习内容练习内容练习内容练习内容'
        },
        {
          tag: '2019-02-18',
          content: '其他内容其他内容其他内容其他内容其他内容其他内容'
        }
      ],
      selected: [],   //联动选择值1
      selected2: [],  //联动选择值2
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
