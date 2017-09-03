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

      <div class="middle"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <span class="cover"></span>
            <div class="cd" ref="cd">
              <img ref="cdImg" :class="cdStateClass" :src="currentSong.image" class="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>

        <scroll
          class="middle-r"
          ref="lyricList"
          :data="currentLyric && currentLyric.lines"
        >
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p
                v-for="(lyric, index) in currentLyric.lines"
                ref="lyricLine"
                class="text"
                :class="{'current': index === currentLineNum}"
              >{{lyric.txt}}</p>
            </div>
            <div class="pure-music">
              <p></p>
            </div>
          </div>
        </scroll>
      </div>

      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
          <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{formatTime(this.currentTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar @percentChange="onProgressBarChange" :percent="percent"></progress-bar>
          </div>
          <span class="time time-r">{{formatTime(this.currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left">
            <i @click="changePlayMode" :class="modeIcon"></i>
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
            <i class="icon" @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="openFullScreen">
        <div class="icon">
          <div class="imgWrapper" ref="minicd">
            <img ref="miniImg" :class="cdStateClass" :src="currentSong.image" width="40" height="40">
          </div>
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <progress-circle :radius="32" :percent="percent">
            <i @click.stop="togglePlay" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>
        <div class="control">
          <i class="icon-playlist" @click.stop="showPlayList"></i>
        </div>
      </div>
    </transition>
    <play-list ref="playList"></play-list>
    <audio
      :src="currentSong.url"
      ref="audio"
      @play="readyPlay"
      @error="errorPlay"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
  import ProgressBar from 'base/progress-bar/progress-bar';
  import ProgressCircle from 'base/progress-circle/progress-circle';
  import Scroll from 'base/scroll/scroll';
  import PlayList from 'components/playlist/playlist';
  import { mapGetters, mapMutations, mapActions } from 'vuex';
  import animations from 'create-keyframe-animation';
  import { prefixStyle } from 'common/js/dom';
  import { playMode } from 'common/js/config';
  import Lyric from 'lyric-parser';
  import { playerMixin } from 'common/js/mixin';

  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');

  export default {
    mixins: [playerMixin],
    data() {
      return {
        songReady: false,
        currentTime: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
      };
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList,
    },
    created() {
      this.touch = {};
    },
    computed: {
      percent() {
        return this.currentTime / this.currentSong.duration;
      },
      cdStateClass() {
        return this.playing ? 'play' : 'pause';
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
        'playing',
        'currentIndex',
      ]),
    },
    watch: {
      currentSong(song, oldSong) {
        if (!song || !song.id) {
          return;
        }

        if (oldSong && oldSong.id === song.id) {
          return;
        }

        if (this.currentLyric) {
          this.currentLyric.stop();
          this.currentLyric = null;
          this.currentTime = 0;
          this.playingLyric = '';
          this.currentLineNum = 0;
        }

        clearTimeout(this.timer);
        // 当从后台切换到当前页面时
        this.timer = setTimeout(() => {
          this.$refs.audio.play();
          this.getLyric();
        }, 1000);
      },
      playing(newState) {
        if (!this.currentSong) {
          return;
        }

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
      rotatePause() {
        const cd = this.$refs.cd;
        const cdImg = this.$refs.cdImg;
        const minicd = this.$refs.minicd;
        const miniImg = this.$refs.miniImg;
        const getComputedStyle = window.getComputedStyle;
        let parentTransform = 0;
        let childTransform = 0;
        let rotate = 0;

        if (this.fullScreen) {
          parentTransform = getComputedStyle(cd, null).transform;
          childTransform = getComputedStyle(cdImg, null).transform;
        } else {
          parentTransform = getComputedStyle(minicd, null).transform;
          childTransform = getComputedStyle(miniImg, null).transform;
        }

        if (parentTransform === 'none') {
          rotate = childTransform;
        } else {
          rotate = childTransform.concat('', parentTransform);
        }

        cd.style[transform] = rotate;
        minicd.style[transform] = rotate;
      },
      goBack() {
        this.setFullScreen(false);
      },
      openFullScreen() {
        this.setFullScreen(true);
      },
      togglePlay() {
        if (this.playing) {
          this.rotatePause();
          this.setPlayState(false);
        } else {
          this.setPlayState(true);
        }

        if (this.currentLyric) {
          this.currentLyric.togglePlay();
        }
      },
      prevSong() {
        if (!this.songReady) {
          return;
        }

        if (this.playlist.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex - 1;
          if (index < 0) {
            index = this.playlist.length - 1;
          }
          this.setCurrentIndex(index);
          this.songReady = false;
          if (!this.playing) {
            this.togglePlay();
          }
        }
      },
      nextSong() {
        if (!this.songReady) {
          return;
        }

        if (this.playlist.length === 1) {
          this.loop();
        } else {
          let index = this.currentIndex + 1;
          if (index > this.playlist.length - 1) {
            index = 0;
          }
          this.setCurrentIndex(index);
          this.songReady = false;
          if (!this.playing) {
            this.togglePlay();
          }
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.nextSong();
        }
      },
      loop() {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        this.setPlayState(true);

        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      readyPlay() {
        this.songReady = true;
        this.savePlayHistory(this.currentSong);
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
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent;
        this.$refs.audio.currentTime = currentTime;
        this.currentTime = currentTime;

        if (!this.playing) {
          this.togglePlay();
        }

        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000);
        }
      },
      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        }).catch(() => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        });
      },
      handleLyric({ lineNum, txt }) {
        this.currentLineNum = lineNum;

        if (lineNum > 5) {
          const lineEl = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(lineEl, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      touchStart(e) {
        this.touch.initialed = true;
        this.touch.startX = e.touches[0].pageX;
      },
      touchMove(e) {
        if (!this.touch.initialed) {
          return;
        }

        const lyricListEl = this.$refs.lyricList.$el;
        const middleLEl = this.$refs.middleL;
        const winWidth = window.innerWidth;
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const left = this.currentShow === 'cd' ? 0 : -winWidth;
        const offsetX = Math.min(0, Math.max(-winWidth, left + deltaX));
        this.touch.percent = Math.abs(offsetX / winWidth);

        lyricListEl.style[transform] = `translateX(${offsetX}px)`;
        lyricListEl.style[transitionDuration] = 0;
        middleLEl.style.opacity = 1 - this.touch.percent;
        middleLEl.style[transitionDuration] = 0;
      },
      touchEnd() {
        let offsetX;
        let opacity;
        const lyricListEl = this.$refs.lyricList.$el;
        const middleLEl = this.$refs.middleL;
        const time = 300;
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetX = -window.innerWidth;
            opacity = 0;
            this.currentShow = 'lyric';
          } else {
            offsetX = 0;
            opacity = 1;
          }
        } else if (this.currentShow === 'lyric') {
          if (this.touch.percent < 0.9) {
            offsetX = 0;
            opacity = 1;
            this.currentShow = 'cd';
          } else {
            offsetX = -window.innerWidth;
            opacity = 0;
          }
        }
        lyricListEl.style[transform] = `translateX(${offsetX}px)`;
        lyricListEl.style[transitionDuration] = `${time}ms`;
        middleLEl.style.opacity = opacity;
        middleLEl.style[transitionDuration] = `${time}ms`;
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
      showPlayList() {
        this.$refs.playList.show();
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
      }),
      ...mapActions([
        'savePlayHistory',
      ]),
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
        overflow: hidden
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
              background-image: url('cover.png')
              background-size: cover
            .cd
              position: absolute
              top: 10%
              left: 10%
              width: 80%
              height: 80%
              border-radius: 50%
              overflow: hidden
              .image
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                &.play
                  animation: rotate 20s linear infinite
                &.pause
                  animation: none !important
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
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
          margin-bottom: 10px
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
              animation: rotate 20s linear infinite
            &.pause
              animation: none !important
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
          position: absolute
          top: 0
          left: 0
          font-size: 32px

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
