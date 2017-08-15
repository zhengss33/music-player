<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
    </div>
    <div ref="shortcutWrap" class="shortcut-wrapper" v-show="!query">
      <scroll ref="shortcut" class="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" v-for="item in hotkey" class="item">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="this.searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click="comfirmShow"><i class="icon-clear"></i></span>
            </h1>
            <search-list
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteHistory"
            ></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div ref="searchResult" class="search-result" v-show="query">
      <suggest ref="suggest" @select="saveHistory" @listScroll="inputBlur" :query="query"></suggest>
    </div>
    <comfirm
      :isShow="isComfirmShow"
      title="是否清理搜索历史"
      comfirmBtnText="清空"
      cancelBtnText="取消"
      @cancel="cancelHandle"
      @comfirm="clearSearch"
    ></comfirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Suggest from 'components/suggest/suggest';
  import SearchBox from 'base/search-box/search-box';
  import SearchList from 'base/search-list/search-list';
  import Comfirm from 'base/comfirm/comfirm';
  import Scroll from 'base/scroll/scroll';
  import { getHotKey } from 'api/search';
  import { ERR_OK } from 'api/config';
  import { mapActions, mapGetters } from 'vuex';
  import { playListMixin } from 'common/js/mixin';

  export default{
    mixins: [playListMixin],
    data() {
      return {
        hotkey: [],
        query: '',
        isComfirmShow: false,
      };
    },
    components: {
      SearchBox,
      Suggest,
      SearchList,
      Comfirm,
      Scroll,
    },
    created() {
      this._getHotKey();
    },
    computed: {
      shortcut() {
        return this.hotkey.concat(this.searchHistory);
      },
      ...mapGetters([
        'searchHistory',
      ]),
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
      onQueryChange(query) {
        this.query = query;
      },
      addQuery(query) {
        this.$refs.searchBox.setQuery(query);
      },
      inputBlur() {
        this.$refs.searchBox.blur();
      },
      saveHistory() {
        this.setSearchHistory(this.query);
      },
      deleteHistory(item) {
        this.deleteSearchHistory(item);
      },
      clearSearch() {
        this.clearSearchHistory();
        this.isComfirmShow = false;
      },
      comfirmShow() {
        this.isComfirmShow = true;
      },
      cancelHandle() {
        this.isComfirmShow = false;
      },
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotkey = res.data.hotkey.slice(0, 10);
          }
        });
      },
      ...mapActions([
        'setSearchHistory',
        'deleteSearchHistory',
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
