<template lang="html">
  <transition name="list-fade">
    <div class="playlist" v-show="isShow" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="modeIcon" @click="changePlayMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop="showConfirm">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll :refreshDelay="refreshDelay" ref="listContent" :data="sequenceList" class="list-content">
          <transition-group name="list" tag="ul">
            <li class="item" ref="list" v-for="(song, index) in sequenceList" :key="song.id" @click="selectItem(song, index)">
              <i class="current" :class="getCurrentIcon(song)"></i>
              <span class="text">{{song.name}}</span>
              <span class="like" @click.stop="toggleFavorite(song)">
                <i :class="getFavoriteIcon(song)"></i>
              </span>
              <span class="delete" @click.stop="deleteItem(song)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="showAddSong">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到列表</span>
          </div>
        </div>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <AddSong ref="addSong"></AddSong>
      <confirm
        title="是否清空播放列表"
        confirmBtnText="清空"
        :isShow="isConfirmShow"
        @confirm="clearSongList"
        @cancel="hideConfirm"
      ></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from 'base/scroll/scroll';
import Confirm from 'base/confirm/confirm';
import AddSong from 'components/add-song/add-song';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { playerMixin } from 'common/js/mixin';

export default {
  mixins: [playerMixin],
  data() {
    return {
      isShow: false,
      isConfirmShow: false,
      refreshDelay: 100,
    };
  },
  components: {
    Scroll,
    Confirm,
    AddSong,
  },
  computed: {
    modeText() {
      let text = '';
      switch (this.mode) {
        case playMode.sequence:
          text = '顺序播放';
          break;

        case playMode.loop:
          text = '循环播放';
          break;

        default:
          text = '随机播放';
          break;
      }
      return text;
    },
    ...mapGetters([
      'playlist',
    ]),
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.isShow || !newSong || newSong.id === oldSong.id) {
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
    deleteItem(song) {
      this.deleteSong(song);
    },
    clearSongList() {
      this.deleteSongList();
      this.hideConfirm();
    },
    scrollToCurrent() {
      const index = this.sequenceList.findIndex(item => this.currentSong.id === item.id);
      const currentEl = this.$refs.list[index];
      this.$refs.listContent.scrollToElement(currentEl, 300);
    },
    showConfirm() {
      this.isConfirmShow = true;
    },
    hideConfirm() {
      this.isConfirmShow = false;
    },
    showAddSong() {
      this.$refs.addSong.show();
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
    }),
    ...mapActions([
      'deleteSong',
      'deleteSongList',
    ]),
  },
};
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
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
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
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
