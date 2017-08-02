<template lang="html">
  <div class="player" v-if="playlist.length>0">
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @afterLeave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
      <div class="bg">
        <img :src="currentSong.image" width="100%" height="100%">
      </div>
      <div class="top">
        <div class="back" @click="goBack">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>

      <div class="middle">
        <div class="middle-l">
          <div class="cd-wrapper" ref="cdWrapper">
            <span class="cover"></span>
            <div class="cd" :class="cdStateClass">
              <img :src="currentSong.image" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric"></div>
          </div>
        </div>

        <div class="lyric-wrapper">
          <div>
            <p class="text"></p>
          </div>
          <div class="pure-music">
            <p></p>
          </div>
        </div>
      </div>

      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(this.currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent"></progress-bar>
          </div>
          <span class="time time-r">{{formatTime(this.currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i></i>
          </div>
          <div class="icon i-left" :class="disableClass">
            <i @click="prevSong" class="icon-prev"></i>
          </div>
          <div class="icon i-center">
            <i class="needsclick" :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right" :class="disableClass">
            <i @click="nextSong" class="icon-next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <div class="imgWrapper">
            <img :class="cdStateClass" :src="currentSong.image" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio
      :src="currentSong.url"
      ref="audio"
      @canplay="readyPlay"
      @error="errorPlay"
      @timeupdate="updateTime"
    ></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import animations from 'create-keyframe-animation';
  import { prefixStyle } from 'common/js/dom';
  import ProgressBar from 'base/progress-bar/progress-bar';

  const transform = prefixStyle('transform');

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
      };
    },
    components: {
      ProgressBar,
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      cdStateClass() {
        return this.playing ? 'play' : 'play pause';
      },
      disableClass() {
        return this.songReady ? '' : 'disable';
      },
      playIcon() {
        return this.playing ? 'icon-pause' : 'icon-play';
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini';
      },
      ...mapGetters([
        'fullScreen',
        'playlist',
        'currentSong',
        'playing',
        'currentIndex',
      ]),
    },
    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play();
        });
      },
      playing(newState) {
        this.$nextTick(() => {
          const audio = this.$refs.audio;

          if (newState) {
            audio.play();
          } else {
            audio.pause();
          }
        });
      },
    },
    methods: {
      goBack() {
        this.setFullScreen(false);
      },
      openFullScreen() {
        this.setFullScreen(true);
      },
      togglePlay() {
        this.setPlayState(!this.playing);
      },
      prevSong() {
        if (!this.songReady) {
          return;
        }

        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playlist.length - 1;
        }
        this.setCurrentIndex(index);
        this.songReady = false;
        if (!this.playing) {
          this.togglePlay();
        }
      },
      nextSong() {
        if (!this.songReady) {
          return;
        }

        let index = this.currentIndex + 1;
        if (index > this.playlist.length - 1) {
          index = 0;
        }
        this.setCurrentIndex(index);
        this.songReady = false;
        if (!this.playing) {
          this.togglePlay();
        }
      },
      readyPlay() {
        this.songReady = true;
      },
      errorPlay() {
        this.songReady = true;
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      formatTime(interval) {
        const time = Math.floor(interval);
        const minute = Math.floor(time / 60);
        const second = this._pad(Math.floor(time % 60));
        return `${minute}:${second}`;
      },
      enter(el, done) {
        const { x, y, scale } = this._getPosAndScale();

        const animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          },
          60: {
            transform: 'translate3d(0, 0, 0) scale(1.1)',
          },
          100: {
            transform: 'translate3d(0, 0, 0) scale(1)',
          },
        };

        animations.registerAnimation({
          name: 'moveDown',
          animation,
          presets: {
            duration: 400,
            easing: 'linear',
          },
        });

        animations.runAnimation(this.$refs.cdWrapper, 'moveDown', done);
      },
      afterEnter() {
        animations.unregisterAnimation('moveDown');
        this.$refs.cdWrapper.style.animation = '';
      },
      leave(el, done) {
        const { x, y, scale } = this._getPosAndScale();

        this.$refs.cdWrapper.style.transition = 'all 0.4s';
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        this.$refs.cdWrapper.addEventListener('transitionend', () => {
          done();
        });
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        let numPad = num;
        while (len < n) {
          numPad = `0${numPad}`;
          len += 1;
        }
        return numPad;
      },
      _getPosAndScale() {
        const winWidth = window.innerWidth;
        const targetWidth = 40;
        const paddingLeft = 40;
        const paddingBottom = 30;
        const paddingTop = 100;
        const width = winWidth * 0.8;
        const scale = targetWidth / width;
        const x = -((winWidth / 2) - paddingLeft);
        const y = window.innerHeight - paddingTop - (winWidth / 2) - paddingBottom;

        return {
          x,
          y,
          scale,
        };
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
      }),
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .bg
        position: absolute
        left: 0
        top: 0
        z-index: -1
        width: 100%
        height: 100%
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin: 10px 0 25px
        .back
          position: absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 100px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          vertical-align: top
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            box-sizing: border-box
            .cover
              position: absolute
              top: 0
              bottom: 0
              right: 0
              left: 0
              z-index: 10
              background-image: url('./cover.png')
              background-size: cover
            .cd
              position: absolute
              top: 10%
              left: 10%
              width: 80%
              height: 80%
              border-radius: 50%
              overflow: hidden
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
              .play
                animation: rotate 20s linear infinte
        .middle-r
          display: inline-block
          width: 100%
          height: 100%
          overflow: hidden
          vertical-align: top
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            width: 8px
            height: 8px
            margin: 0 4px
            vertical-align: middle
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          width: 80%
          margin: 0px auto
          padding: 10px 0
          align-items: center
          .time
            flex: 0 0 30px
            width: 30px
            color: $color-text
            font-size: $font-size-small
            line-height: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme

      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transiton: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          width: 100%
          height: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
