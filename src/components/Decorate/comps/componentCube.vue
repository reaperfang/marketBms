<template>
    <div v-if="currentComponentData && currentComponentData.data">
        <ul class="cube cube_preview">

          <!-- 一行2个 -->
          <li v-if="currentComponentData.data.templateType === 1">
            <div class="type type1" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt=""></div>
              <div class="fill_block">
                <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
              </div>
            </div>
          </li>


          <!-- 一行3个 -->
          <li v-if="currentComponentData.data.templateType === 2" >
            <div class="type type2" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
              </div>
              <div class="fill_block">
                <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
              </div>
            </div>
          </li>


          <!-- 一行4个 -->
          <li v-if="currentComponentData.data.templateType === 3">
            <div class="type type3" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
              </div>
              <div class="fill_block">
                <img v-if="currentComponentData.data.list['4']" :src="currentComponentData.data.list['4'].url" alt="">
              </div>
            </div>
          </li>


          <!-- 2左2右 -->
          <li v-if="currentComponentData.data.templateType === 4">
            <div class="type type4" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block" 
              :style="{
                  marginRight: currentComponentData.data.imgMargin + 'px', 
                  marginBottom: currentComponentData.data.imgMargin + 'px', 
                  width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                  height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{
                marginBottom: currentComponentData.data.imgMargin + 'px', 
                width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{
                marginRight: currentComponentData.data.imgMargin + 'px', 
                width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
              </div>
              <div class="fill_block" 
              :style="{
                width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['4']" :src="currentComponentData.data.list['4'].url" alt="">
              </div>
            </div>
          </li>


          <!-- 1左2右 -->
          <li v-if="currentComponentData.data.templateType === 5">
            <div class="type type5" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block fill_block1" 
              :style="{
                marginRight: currentComponentData.data.imgMargin + 'px',
                width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2" 
              :style="{width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}">
                <div class="fill_block fill_block3" 
                :style="{marginBottom: currentComponentData.data.imgMargin + 'px'}"
                >
                  <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4">
                  <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
                </div>
              </div>
            </div>
          </li>


          <!-- 1上2下 -->
          <li v-if="currentComponentData.data.templateType === 6">
            <div class="type type6" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block fill_block1" 
              :style="{marginBottom: currentComponentData.data.imgMargin + 'px'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2">
                <div class="fill_block fill_block3" 
                :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                >
                  <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4">
                  <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
                </div>
              </div>
            </div>
          </li>


          <!-- 1左3右 -->
          <li v-if="currentComponentData.data.templateType === 7">
            <div class="type type7" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
              <div class="fill_block fill_block1" 
              :style="{
                marginRight: currentComponentData.data.imgMargin + 'px',
                width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
              >
                <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt="">
              </div>
              <div class="fill_block fill_block2" 
              :style="{width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}">
                <div class="fill_block fill_block3" 
                :style="{marginBottom: currentComponentData.data.imgMargin + 'px'}"
                >
                  <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
                </div>
                <div class="fill_block fill_block4">
                  <div class="fill_block fill_block5" 
                  :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                  >
                    <img v-if="currentComponentData.data.list['3']" :src="currentComponentData.data.list['3'].url" alt="">
                  </div>
                  <div class="fill_block fill_block6">
                    <img v-if="currentComponentData.data.list['4']" :src="currentComponentData.data.list['4'].url" alt="">
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
    </div>
</template>

<script>
import componentMixin from '../mixins/mixinComps';
export default {
  name: 'componentCube',
  mixins:[componentMixin],
  components: {},
  data () {
    return {
      
    }
  },
  created() {
    const _self = this;
  },
  computed: {
    
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.cube_preview{
  li{
    .type{
        // height:300px;
    }
  }
}
</style>
