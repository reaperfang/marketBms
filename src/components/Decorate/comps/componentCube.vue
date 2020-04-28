<template>
    <div class="component_wrapper">
      <div v-if="currentComponentData && currentComponentData.data">
          <ul class="cube cube_preview">

              <!-- 一行2个 -->
              <li v-if="currentComponentData.data.templateType === 1">
                <template v-if="hasContent">
                  <div class="type type1" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
                    <div class="fill_block" 
                    :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                    >
                      <img v-if="currentComponentData.data.list['1']" :src="currentComponentData.data.list['1'].url" alt=""></div>
                    <div class="fill_block">
                      <img v-if="currentComponentData.data.list['2']" :src="currentComponentData.data.list['2'].url" alt="">
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube1.png"
                    alt
                  />
                </template>
              </li>


              <!-- 一行3个 -->
              <li v-if="currentComponentData.data.templateType === 2" >
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube2.png"
                    alt
                  />
                </template>
              </li>


              <!-- 一行4个 -->
              <li v-if="currentComponentData.data.templateType === 3">
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube3.png"
                    alt
                  />
                </template>
              </li>


              <!-- 2左2右 -->
              <li v-if="currentComponentData.data.templateType === 4">
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube4.png"
                    alt
                  />
                </template>
              </li>


              <!-- 1左2右 -->
              <li v-if="currentComponentData.data.templateType === 5">
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube5.png"
                    alt
                  />
                </template>
              </li>


              <!-- 1上2下 -->
              <li v-if="currentComponentData.data.templateType === 6">
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube6.png"
                    alt
                  />
                </template>
              </li>


              <!-- 1左3右 -->
              <li v-if="currentComponentData.data.templateType === 7">
                <template v-if="hasContent">
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
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube7.png"
                    alt
                  />
                </template>
              </li>
          </ul>
      </div>
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

    /* 检测是否数据 */
    hasContent() {
      let value = false;
      if(this.currentComponentData.data.list) {
        for(let k in this.currentComponentData.data.list) {
          if(this.currentComponentData.data.list[k].url) {
            value = true;
            break;
          }
        }
      }
      return value;
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.default_image{
  object-fit: none;
  width:100%;
}
.cube_preview{
  li{
    .type{
        // height:300px;
    }
  }
}
ul.cube li .fill_block{
  background:#fff;
}
</style>
