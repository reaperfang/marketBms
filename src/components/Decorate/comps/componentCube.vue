<template>
    <div class="component_wrapper" :style="{cursor: dragable ? 'pointer' : 'text'}">
      <div v-if="currentComponentData && currentComponentData.data">
          <ul class="cube cube_preview">

              <!-- 一行2个 -->
              <li v-if="currentComponentData.data.templateType === 1">
                <template v-if="hasContent">
                  <div class="type type1" :style="{padding: currentComponentData.data.pagePadding + 'px'}">
                    <div class="fill_block" 
                    :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                    >
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image></div>
                    <div class="fill_block">
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube1.jpg"
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
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block">
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube2.jpg"
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
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block">
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['4'] && currentComponentData.data.list['4'].url" :src="currentComponentData.data.list['4'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube3.jpg"
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
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{
                      marginBottom: currentComponentData.data.imgMargin + 'px', 
                      width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                      height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                      <div slot="placeholder" class="el-image__lazyloading">
                          加载中...
                      </div>
                    </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{
                      marginRight: currentComponentData.data.imgMargin + 'px', 
                      width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                      height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                    <div class="fill_block" 
                    :style="{
                      width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)',
                      height: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}"
                    >
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['4'] && currentComponentData.data.list['4'].url" :src="currentComponentData.data.list['4'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube4.jpg"
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
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                    <div class="fill_block fill_block2" 
                    :style="{width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}">
                      <div class="fill_block fill_block3" 
                      :style="{marginBottom: currentComponentData.data.imgMargin + 'px'}"
                      >
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                      </div>
                      <div class="fill_block fill_block4">
                        <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube5.jpg"
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
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                    <div class="fill_block fill_block2">
                      <div class="fill_block fill_block3" 
                      :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                      >
                        <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                      </div>
                      <div class="fill_block fill_block4">
                        <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube6.jpg"
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
                    <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['1'] && currentComponentData.data.list['1'].url" :src="currentComponentData.data.list['1'].url" alt="" lazy>
                        <div slot="placeholder" class="el-image__lazyloading">
                            加载中...
                        </div>
                      </el-image>
                    </div>
                    <div class="fill_block fill_block2" 
                    :style="{width: 'calc(50% - '+ currentComponentData.data.imgMargin/2 +'px)'}">
                      <div class="fill_block fill_block3" 
                      :style="{marginBottom: currentComponentData.data.imgMargin + 'px'}"
                      >
                      <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['2'] && currentComponentData.data.list['2'].url" :src="currentComponentData.data.list['2'].url" alt="" lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                      </div>
                      <div class="fill_block fill_block4">
                        <div class="fill_block fill_block5" 
                        :style="{marginRight: currentComponentData.data.imgMargin + 'px'}"
                        >
                        <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['3'] && currentComponentData.data.list['3'].url" :src="currentComponentData.data.list['3'].url" alt="" lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                        </div>
                        <div class="fill_block fill_block6">
                          <el-image :scroll-container="bodyClass ?  '.'+bodyClass : '.phone-body'" v-if="currentComponentData.data.list['4'] && currentComponentData.data.list['4'].url" :src="currentComponentData.data.list['4'].url" alt="" lazy>
                          <div slot="placeholder" class="el-image__lazyloading">
                              加载中...
                          </div>
                        </el-image>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <img
                    class="default_image"
                    :style="{padding: currentComponentData.data.pagePadding + 'px'}"
                    src="../../../assets/images/shop/defaultImage/cube7.jpg"
                    alt
                  />
                </template>
              </li>
          </ul>
      </div>
    </div>
</template>

<script>
import mixinCompsBase from '../mixins/mixinCompsBase';
export default {
  name: 'componentCube',
  mixins:[mixinCompsBase],
  components: {},
  data () {
    return {
      
    }
  },
  created() {
    const _self = this;
    // console.log(this.currentComponentData.data.list['2'])
  },
  mounted() {
    this.dataLoaded = true;
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
  background: transparent;
  .el-image {
    display: block;
    height: 100%;
  }
}
</style>
