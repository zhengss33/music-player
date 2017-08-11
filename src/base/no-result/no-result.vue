<template lang="html">
  <div class="no-result">
    <div class="no-result-icon"></div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .no-result
    text-align: center
    .no-result-icon
      margin: 0 auto
      width: 86px
      height: 90px
      bg-image('no-result')
      background-size: 86px 90px
    .no-result-title
      margin-top: 30px
      font-size: $font-size-medium
      color: $color-text-d
</style>
