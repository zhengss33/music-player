<template>
  <scroll class="listview" :data="data" ref="listview">
    <ul>
      <li class="list-group" v-for="group in data" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.Fsinger_avatar">
            <span class="name">{{item.Fsinger_name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="shortcut-list">
      <ul>
        <li
          class="shortcut-item"
          v-for="(item, index) in shortcutList"
          @touchstart.stop.prevent="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          :data-index="index"
        >{{item}}</li>
      </ul>
    </div>
    <div v-show="!data.length" class="loading-container"><loading></loading></div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';

  const ANCHOR_HEIGHT = 18;

  export default {
    props: {
      data: {
        type: Array,
        default: [],
      },
    },
    components: {
      Scroll,
      Loading,
    },
    created() {
      this.touch = {
        touchStartY: null,
        touchMoveY: null,
      };
    },
    methods: {
      onShortcutTouchStart(e) {
        const anchorIndex = e.target.dataset.index;
        const firstTouch = e.touches[0];
        this.touch.anchorIndex = anchorIndex;
        this.touch.touchStartY = firstTouch.pageY;

        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        const firstTouch = e.touches[0];
        this.touch.touchMoveY = firstTouch.pageY;
        const moved = this.touch.touchMoveY - this.touch.touchStartY;
        const anchorMoved = Math.floor(moved / ANCHOR_HEIGHT);
        const anchorIndex = parseInt(this.touch.anchorIndex, 10) + anchorMoved;
        this._scrollTo(anchorIndex);
      },
      _scrollTo(index) {
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
    },
    computed: {
      shortcutList() {
        return this.data.map(group => group.title.substring(0));
      },
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color:  $color-text-l
          font-size: $font-size-medium
    .shortcut-list
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .shortcut-item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .loading-container
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
</style>
