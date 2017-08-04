<template lang="html">
  <div class="progress-bar" @click="progressClick">
    <div class="bar-inner" ref="bar">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
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
  created() {
    this.touch = {};
  },
  watch: {
    percent(newPer) {
      this.setProgressOffset(newPer);
    },
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const moveX = e.touches[0].pageX - this.touch.startX;
      const barWidth = this.$refs.bar.clientWidth - progressBtnWidth;
      const offsetX = Math.min(barWidth, Math.max(0, this.touch.left + moveX));

      this._offset(offsetX);
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const offsetL = this.$refs.bar.offsetLeft;
      const offsetX = e.pageX - offsetL;
      this._offset(offsetX);
      this._triggerPercent();
    },
    setProgressOffset(percent) {
      if (percent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.bar.clientWidth - progressBtnWidth;
        const offsetX = barWidth * percent;
        this._offset(offsetX);
      }
    },
    _triggerPercent() {
      this.$emit('percentChange', this._getPercent());
    },
    _getPercent() {
      const barWidth = this.$refs.bar.clientWidth - progressBtnWidth;
      const progressWidth = this.$refs.progress.clientWidth;

      return progressWidth / barWidth;
    },
    _offset(offset) {
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
