<template>
  <scroll
    class="listview"
    :data="list"
    ref="listview"
    :probeType="probeType"
    :listenScroll="listenScroll"
    @scroll="onScroll"
  >
    <ul>
      <li class="list-group" v-for="group in list" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img class="avatar" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="shortcut-list"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :data-index="index"
          :class="['shortcut-item', {current: index === currentIndex}]"
        >{{item}}</li>
      </ul>
    </div>
    <div v-show="!list.length" class="loading-container"><loading></loading></div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
  </scroll>
</template>
<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';

  const ANCHOR_HEIGHT = 18;
  const TITLE_HEIGHT = 30;

  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1,
      };
    },
    props: {
      list: {
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
      this.probeType = 3;
      this.listenScroll = true;
      this.listHeight = [];
      this.fixedTop = 0;
    },
    watch: {
      list() {
        this.$nextTick(() => {
          this._calculateHeight();
        });
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        // 当滚动到顶部
        if (newY > 0) {
          this.currentIndex = 0;
          return;
        }
        for (let i = 0; i < listHeight.length - 1; i += 1) {
          const height1 = listHeight[i];
          const height2 = listHeight[i + 1];
          const y = Math.abs(newY);
          if (y >= height1 && y < height2) {
            this.currentIndex = i;
            this.diff = height2 - y;
            return;
          }
        }
        // 当滚动到最后的列表，且y大于最后一个列表的上限
        this.currentIndex = listHeight.length - 2;
      },
      diff(newVal) {
        let fixedTop = 0;
        if (newVal > 0 && newVal < TITLE_HEIGHT) {
          fixedTop = newVal - TITLE_HEIGHT;
        }
        if (this.fixedTop === fixedTop) {
          return;
        }
        this.fixedTop = fixedTop;
        this.$refs.fixed.style.transform = `translateY(${fixedTop}px)`;
      },
    },
    computed: {
      shortcutList() {
        return this.list.map(group => group.title.substring(0));
      },
      fixedTitle() {
        const currList = this.list[this.currentIndex];
        if (this.scrollY > 0) {
          return '';
        }
        return currList ? currList.title : '';
      },
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
        // 计算移动了几个锚点的距离
        const anchorMoved = Math.floor(moved / ANCHOR_HEIGHT);
        // 得出移动到的锚点索引
        const anchorIndex = parseInt(this.touch.anchorIndex, 10) + anchorMoved;
        this._scrollTo(anchorIndex);
      },
      onScroll(pos) {
        this.scrollY = pos.y;
      },
      _scrollTo(index) {
        const listHeight = this.listHeight;
        let toIndex = index;
        if (!toIndex && toIndex !== 0) {
          return;
        }
        if (toIndex < 0) {
          toIndex = 0;
        } else if (toIndex > listHeight.length - 2) {
          toIndex = listHeight.length - 2;
        }

        this.scrollY = -listHeight[toIndex];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[toIndex], 0);
      },
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);

        for (let i = 0; i < list.length; i += 1) {
          const item = list[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectItem(item) {
        this.$emit('select', item);
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
    .list-fixed
      position: absolute
      top: -1px;
      left: 0;
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
        border-top: 1px solid #000;
</style>
