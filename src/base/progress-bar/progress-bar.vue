<template lang="html">
  <div class="progress-bar">
    <div class="bar-inner" ref="bar">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>

const progressBtnWidth = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    percent(newPer) {
      if (newPer > 0) {
        this.setProgressOffset(newPer);
      }
    },
  },
  methods: {
    setProgressOffset(percent) {
      const barWidth = this.$refs.bar.clientWidth - progressBtnWidth;
      const offset = barWidth * percent;
      this.$refs.progressBtn.style.transform = `translateX(${offset}px)`;
      this.$refs.progress.style.width = `${offset}px`;
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";

  .progress-bar
    height: 30px;
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        top: -6px
        .progress-btn
          position: relative
          width: 16px
          height: 16px
          box-sizing: border-box
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme

</style>
