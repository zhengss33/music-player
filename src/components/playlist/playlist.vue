<template lang="html">
  <transition name="list-fade">
    <div class="playlist" v-show="isShow" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text"></span>
            <span class="clear">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll ref="listContent" :data="sequenceList" class="list-content">
          <ul>
            <li class="item" ref="list" v-for="(song, index) in sequenceList" @click="selectItem(song, index)">
              <i class="current" :class="getCurrentIcon(song)"></i>
              <span class="text">{{song.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div class="add">
            <i class="icon-add"></i>
            <span class="text"></span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';

export default {
  data() {
    return {
      isShow: false,
    };
  },
  components: {
    Scroll,
  },
  computed: {
    ...mapGetters([
      'sequenceList',
      'mode',
      'playlist',
      'currentSong',
    ]),
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.isShow || newSong.id === oldSong.id) {
        return;
      }
      this.scrollToCurrent();
    },
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent();
      }, 20);
    },
    hide() {
      this.isShow = false;
    },
    getCurrentIcon(item) {
      return this.currentSong.id === item.id ? 'icon-play' : '';
    },
    selectItem(song, index) {
      let currentIndex = index;
      if (this.mode === playMode.random) {
        currentIndex = this.playlist.findIndex(item => item.id === song.id);
      }
      this.setCurrentIndex(currentIndex);
      this.setPlayingState(true);
    },
    scrollToCurrent() {
      const index = this.sequenceList.findIndex(item => this.currentSong.id === item.id);
      const currentEl = this.$refs.list[index];
      this.$refs.listContent.scrollToElement(currentEl, 300);
    },
    deleteItem(song) {
      this.deleteSong(song);
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'deleteSong',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .list-fade-enter-active, .list-fade-leave-active
    .playlist
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
        .list-content
          .item
            transition: all 0.1s
  .list-fade-enter, .list-fade-leave-to
    .playlist
      opacity: 0
      .list-wrapper
        transform: translateY(100%)
        .list-content
          .item
            height: 0


  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        border-bottom: 1px solid $color-background
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-text-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-theme-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background-color: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
