<template>
  <div class="profile_intelligent">
    <h2>智能开店</h2>
    <span>
      让做生意变得更简单
    </span>
    <router-link to="/profile/intelligent" class="to_intelligent">立即体验</router-link>
  </div>
</template>

<script>
export default {
    name: 'profile_intelligent',
    data() {
        return {
            step: '',
        }
    },
    methods:{
      //智能开店引导
      toIntelligent() {
        this.$router.push({ path: '/profile/intelligent' });
      },
    }
}
</script>

<style lang="scss" scoped>
  .profile_intelligent {
    margin-top: 15px;
    padding: 15px;
    border-radius: 5px;
    background-color: #fff;

    .to_intelligent{
      color: blue;
    }
  }
</style>
