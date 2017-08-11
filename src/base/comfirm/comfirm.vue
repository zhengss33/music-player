<template lang="html">
  <transition name="confirm-fade">
    <div class="confirm" v-show="isShow">
      <div class="confirm-inner">
        <div class="confirm-content">
          <p class="title">{{title}}</p>
          <div class="operate">
            <div
              class="operate-btn left"
              @click="cancel"
            >{{cancelBtnText}}</div>
            <div
              class="operate-btn"
              @click="comfirm"
            >{{comfirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    comfirmBtnText: {
      type: String,
      default: '',
    },
    cancelBtnText: {
      type: String,
      default: '',
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    comfirm() {
      this.$emit('comfirm');
    },
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";

  .confirm
    position: fixed
    top: 0
    bottom: 0
    right: 0
    left: 0
    z-index: 998
    background-color: $color-background-d
    &.confirm-fade-enter-active
      animation: confirm-fadein 0.3s
      .confirm-content
        animation: confirm-zoom 0.3s
    .confirm-inner
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      z-index: 999
      .confirm-content
        width: 270px
        border-radius: 13px
        background-color: $color-highlight-background
        .title
          padding: 19px 15px
          line-height: 22px
          text-align: center
          font-size: $font-size-large
          color: $color-text-l
        .operate
          display: flex
          align-items: center
          text-align: center
          font-size: $font-size-large
          .operate-btn
            flex: 1
            padding: 10px 0
            line-height: 22px
            border-top: 1px solid $color-backgrpund-d
            color: $color-text-d
            &.left
              border-right: 1px solid $color-background-d

  @keyframes confirm-fadein
    0%
      opacity: 0
    100%
      opacity: 1

  @keyframes confirm-zoom
    0%
      transform: scale(0)
    50%
      transform: scale(1.1)
    100%
      transform: scale(1)

</style>
