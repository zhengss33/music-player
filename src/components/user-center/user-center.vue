<template lang="html">
  <transition name="slide">
    <div class="user-center">
      <div class="back-btn" @click="back">
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="switchIndex"></switches>
      </div>
      <div class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放</span>
      </div>
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" :data="favoriteSongs" v-show="switchIndex === 0">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="favoriteSongs"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" :data="playHistory" v-show="switchIndex === 1">
          <div class="list-inner">
            <song-list @select="selectSong" :songs="playHistory"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script>
import Switches from 'base/switches/switches';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import NoResult from 'base/no-result/no-result';
import { mapGetters, mapActions } from 'vuex';
import Song from 'common/js/format-song';
import { playListMixin } from 'common/js/mixin';


export default {
  mixins: [playListMixin],
  data() {
    return {
      switches: [
        { title: '我喜欢的' },
        { title: '最近播放' },
      ],
      switchIndex: 0,
    };
  },
  components: {
    Switches,
    SongList,
    Scroll,
    NoResult,
  },
  computed: {
    noResult() {
      if (this.switchIndex === 0) {
        return !this.favoriteSongs.length;
      }
      return !this.playHistory.length;
    },
    noResultDesc() {
      return this.switchIndex === 0 ? '暂无喜欢歌曲' : '你还没有听过歌曲';
    },
    ...mapGetters([
      'favoriteSongs',
      'playHistory',
    ]),
  },
  watch: {
    switchIndex(index) {
      this.$nextTick(() => {
        if (index === 0) {
          this.$refs.favoriteList.refresh();
        } else {
          this.$refs.playList.refresh();
        }
      });
    },
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.listWrapper.style.bottom = bottom;

      this.$refs.favoriteList.refresh();
      this.$refs.playList.refresh();
    },
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.switchIndex = index;
    },
    selectSong(song) {
      this.insertSong(new Song(song));
    },
    random() {
      const list = this.switchIndex === 0 ? this.favoriteSongs : this.playHistory;
      if (!list.length) { return; }
      const playlist = list.map(song => new Song(song));
      this.randomPlay({ playlist });
    },
    ...mapActions([
      'insertSong',
      'randomPlay',
    ]),
  },
};
</script>

<style lang="stylus" ref="stylesheet/stylus" scoped>
  @import "~common/stylus/variable";

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translateX(100%)
    .back-btn
      position: absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
