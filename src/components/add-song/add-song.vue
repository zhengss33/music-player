<template lang="html">
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close-btn" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" placeholder="搜索歌曲" @queryChange="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches
          :switches="switches"
          :currentIndex="switchIndex"
          @switch="switchItem"
        ></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-show="switchIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list @select="selectSong" :songs="playHistory"></song-list>
            </div>
          </scroll>
          <scroll
            ref="searchList"
            class="list-scroll"
            v-show="switchIndex === 1"
            :data="searchHistory"
          >
            <div class="list-inner">
              <search-list :searches="searchHistory" @select="addQuery" @delete="deleteHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest
          :showSinger="false"
          :query="query"
          @select="selectSuggest"
          @listScroll="inputBlur"
        ></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="top-title">
          <i class="icon-ok"></i>
          <span class="text">已添加一首歌曲到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import Switches from 'base/switches/switches';
import Scroll from 'base/scroll/scroll';
import SongList from 'base/song-list/song-list';
import SearchList from 'base/search-list/search-list';
import TopTip from 'base/top-tip/top-tip';
import { searchMixin } from 'common/js/mixin';
import { mapGetters, mapActions } from 'vuex';
import Song from 'common/js/format-song';

export default {
  mixins: [searchMixin],
  data() {
    return {
      showFlag: false,
      switches: [
        { title: '最近播放' },
        { title: '搜索历史' },
      ],
      switchIndex: 0,
    };
  },
  components: {
    SearchBox,
    Suggest,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip,
  },
  computed: {
    ...mapGetters([
      'playHistory',
    ]),
  },
  methods: {
    show() {
      this.showFlag = true;
      this.refreshList();
      this.$emit('show');
    },
    refreshList() {
      setTimeout(() => {
        if (this.switchIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
      this.$emit('hide');
    },
    switchItem(index) {
      this.switchIndex = index;
      this.refreshList();
    },
    selectSong(item, index) {
      if (index > 0) {
        this.insertSong(new Song(item));
      }
      this.showTopTip();
    },
    selectSuggest() {
      this.saveHistory();
      this.showTopTip();
    },
    showTopTip() {
      this.$refs.topTip.show();
    },
    ...mapActions([
      'insertSong',
    ]),
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translateX(100%)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close-btn
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme
    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 20px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .top-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        margin-right: 4px
        font-size: $font-size-medium
        color: $color-theme
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
