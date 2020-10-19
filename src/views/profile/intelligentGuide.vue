<template>
  <section v-if="isFirstLogin" class="intelligent_guide">
    <h2 class="i_g_title"> 请选择您需要的开店方式 </h2>
    <div class="i_g_content">
      <div class="i_g_item left">
        <div @click="goPrompt"> 立即开店 </div>
      </div>
      <div class="i_g_item right">
        <div @click="toIntelligent"> 立即开店 </div>
      </div>
    </div>
    <div class="i_g_footer">
      <span @click="toProfile"> 我想再看看 </span>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'intelligent-guide',
    data() {
      return {
        isFirstLogin: false,
        isClick: false, // 为了解决在初始化设置引导状态时，后端未返回结果的情况，用户直接操作后，导致bug
      }
    },

    computed: {
      cid() {
        let shopInfo = this.$store.getters.shopInfos;
        return shopInfo.id;
      },
      storeGuide() {
        return this.$store.state.shop.storeGuide || null
        // let shopInfo = this.$store.getters.shopInfos;
        // return shopInfo.storeGuide || null;
      }
    },

    created() {
      this.init();
    },

    methods: {
      setStoreGuide(storeGuide) {
        let id = this.cid
        let data = {
          id,
          storeGuide
        }
        this._apis.set.updateShopInfo(data).then(response =>{
          this.$store.dispatch('getShopInfo');
          const storeGuide = response && response.storeGuide || storeGuide
          this.$store.commit('setStoreGuide', storeGuide)
          this.isClick = true
          // this.$nextTick(()=> {
          //   this.$refs.shopInfoMap.clearSearchResultList()
          //   this.$refs.shopInfoMap.clearKeyword()
          // })
        }).catch(error =>{
          console.log('updateShopInfo:error', error)
          // this.$message.error('保存失败');
        })
      },
      init() {
        this.isFirstLogin = this.storeGuide && this.storeGuide === -1
        if (!this.isFirstLogin) {
          this.isClick = true
          this.$router.push({ path: '/profile/profile'}) 
        } else {
          this.setStoreGuide(0)
        }
      },
      updateStep() {
        const cid = this.cid;
        const step = 1
        this._apis.shop
          .updateStep({ cid, step })
          .then(response => {
            this.$router.push({ path: '/profile/shopGuide'})
          }).catch((err) => {
            console.log(err)
          })
      },

      /** v1.6开店 */
      goPrompt() {
        if (this.isClick) this.updateStep();
      },

      /** v1.8智能开店 */
      toIntelligent() {
        if (this.isClick) this.$router.push({ path: '/profile/intelligent'});
      },

      /** 返回概况页 */
      toProfile() {
        if (this.isClick) this.$router.push({ path: '/profile/profile'});
      },
    },
  }
</script>

<style lang="scss" scope>
  .intelligent_guide {
    background: #fff;
    height: 100%;
    min-height: 780px;
    min-width: 860px;
    border-radius: 4px;
    text-align: center;
    padding-top: 60px;
  }

  .i_g_title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    letter-spacing: 1px;
  }

  .i_g_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 822px;
    margin: 60px auto 0;
  }

  .i_g_item {
    width: 381px;
    height: 461px;

    div {
      width: 160px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 380px auto auto;
      border: 1px solid #fff;
      border-radius: 20px;
      color: #fff;
      user-select: none;
      cursor: pointer;
      transition: background 0.5s;
    }

    &.left {
      background: url('../../assets/images/profile/i_g_01.png') no-repeat;
      background-size: contain;

      div:hover {
        background: #fff;
        color: #F85052;
      }
    }

    &.right {
      background: url('../../assets/images/profile/i_g_02.png') no-repeat;
      background-size: contain;

      div:hover {
        background: #fff;
        color: $globalMainColor;
      }
    }
  }

  .i_g_footer {
    margin-top: 60px;

    span {
      font-size: 14px;
      font-weight: 400;
      text-decoration: underline;
      color: $grayColor;
      letter-spacing: 1px;
      cursor: pointer;
      transition: color 0.2s;

      &:hover {
        color: $globalMainColor;
      }
    }
  }
</style>
