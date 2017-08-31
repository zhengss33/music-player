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
        <search-box placeholder="搜索歌曲" @queryChange="onQueryChange"></search-box>
      </div>
      <div class="shortcut" v-show="!query">

      </div>
      <div class="search-result" v-show="query">
        <suggest
          :showSinger="false"
          :query="query"
          @select="saveHistory"
          @listScroll="inputBlur"
        ></suggest>
      </div>
    </div>
  </transition>
</template>

<script>
import SearchBox from 'base/search-box/search-box';
import Suggest from 'components/suggest/suggest';
import { searchMixin } from 'common/js/mixin';

export default {
  mixins: [searchMixin],
  data() {
    return {
      query: '',
    };
  },
  props: {
    showFlag: {
      type: Boolean,
      defalut: false,
    },
  },
  components: {
    SearchBox,
    Suggest,
  },
  methods: {
    hide() {
      this.$emit('hide');
    },
    selectSuggest() {
    },
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
    .search-result
      width: 100%
</style>