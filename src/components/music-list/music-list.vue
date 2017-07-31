<template lang="html">
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" ref="playBtn" v-show="songs.length>0">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="mask" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll
      class="list"
      :data="songs"
      ref="list"
      :probe-type="probeType"
      :listen-scroll="listenScroll"
      @scroll="scroll"
    >
      <div class="song-list-container">
        <song-list :songs="songs"></song-list>
      </div>
      <div class="loading-container" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import SongList from 'base/song-list/song-list';
  import Loading from 'base/loading/loading';
  import { prefixStyle } from 'common/js/dom';

  const RESERVED_HEIGHT = 40;
  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');

  export default {
    data() {
      return {
        scrollY: 0,
      };
    },
    props: {
      title: {
        type: String,
        default: '',
      },
      bgImge: {
        type: String,
        default: '',
      },
      songs: {
        type: Array,
        default: () => [],
      },
    },
    components: {
      Scroll,
      SongList,
      Loading,
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
    },
    mounted() {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    },
    computed: {
      bgStyle() {
        return `background-image: url(${this.bgImge});`;
      },
    },
    watch: {
      scrollY(newY) {
        const translate = Math.max(this.minTransalteY, newY);
        let zIndex = 0;
        let paddingTop = '70%';
        let btnDisplay = '';
        let scale = 1;
        let blur = 0;
        const percent = Math.abs(newY / this.imageHeight);

        this.$refs.bgLayer.style[transform] = `translateY(${translate}px)`;

        if (newY > 0) {
          scale = 1 + percent;
          zIndex = 10;
        } else {
          blur = Math.min(percent * 20, 20);
        }
        if (newY < this.minTransalteY) {
          zIndex = 10;
          paddingTop = `${RESERVED_HEIGHT}px`;
          btnDisplay = 'none';
        }

        this.$refs.playBtn.style.display = btnDisplay;
        this.$refs.bgImage.style[transform] = `scale(${scale})`;
        this.$refs.bgImage.style[backdrop] = `blur(${blur}px)`;
        this.$refs.bgImage.style['padding-top'] = paddingTop;
        this.$refs.bgImage.style['z-index'] = zIndex;
      },
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y;
      },
      back() {
        this.$router.back();
      },
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          box-sizing: border-box
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .mask
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: absolute
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-container
        padding: 20px 30px
      .loading-container
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%, -50%)
</style>
