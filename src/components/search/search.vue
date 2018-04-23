<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrap" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="searchHistory">
        <div class="search-history">
          <h1 class="title">
            <span class="text">搜索历史</span>
            <span class="clear" @click="confirmShow"><i class="icon-clear"></i></span>
          </h1>
          <search-list
            :searches="searchHistory"
            @select="addQuery"
            @delete="deleteHistory"
          ></search-list>
          </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveHistory" @listScroll="inputBlur" :query="query"></suggest>
    </div>
    <confirm
      :isShow="isConfirmShow"
      title="是否清理搜索历史"
      confirmBtnText="清空"
      cancelBtnText="取消"
      @cancel="cancelHandle"
      @confirm="clearSearch"
    ></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Suggest from 'components/suggest/suggest';
  import SearchBox from 'base/search-box/search-box';
  import SearchList from 'base/search-list/search-list';
  import Confirm from 'base/confirm/confirm';
  import Scroll from 'base/scroll/scroll';
//  import { ERR_OK } from 'api/config';
  import { mapActions } from 'vuex';
  import { playListMixin, searchMixin } from 'common/js/mixin';

  export default{
    mixins: [playListMixin, searchMixin],
    data() {
      return {
        isConfirmShow: false,
      };
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll,
    },
    created() {
    },
    watch: {
      query(newquery) {
        if (!newquery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh();
          }, 20);
        }
      },
    },
    methods: {
      handlePlayList(list) {
        const bottom = list.length > 0 ? '60px' : '';

        this.$refs.shortcutWrap.style.bottom = bottom;
        this.$refs.searchResult.style.bottom = bottom;

        this.$refs.shortcut.refresh();
        this.$refs.suggest.refresh();
      },
      clearSearch() {
        this.clearSearchHistory();
        this.isConfirmShow = false;
      },
      confirmShow() {
        this.isConfirmShow = true;
      },
      cancelHandle() {
        this.isConfirmShow = false;
      },
      ...mapActions([
        'clearSearchHistory',
      ]),
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable";

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            hieght: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
</style>
