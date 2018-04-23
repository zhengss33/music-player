<template lang="html">
  <scroll
    class="suggest"
    :pullupRefresh="pullup"
    :data="songs.concat(singers)"
    :listenBeforeScroll="listenBeforeScroll"
    @beforeScroll="listScroll"
    @scrollToEnd="_searchMore"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in singers" @click="selectItem(item)">
        <div class="icon"><i class="icon-mine"></i></div>
        <div class="name">
          <p class="text" v-html="item.singername"></p>
        </div>
      </li>
      <li class="suggest-item" v-for="item in songs" @click="selectItem(item)">
        <div class="icon"><i class="icon-music"></i></div>
        <div class="name">
          <p class="text" v-html="`${item.name}-${item.singer}`"></p>
        </div>
      </li>
      <loading v-show="hasMore"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import NoResult from 'base/no-result/no-result';
  import { search } from 'api/search';
  import { ERR_OK } from 'api/config';
  import { createSong } from 'common/js/format-song';
  import FormatSinger from 'common/js/format-singer';
  import { mapMutations, mapActions } from 'vuex';

  const LIMIT = 30;

  export default {
    data() {
      return {
        total: 0,
        page: 1,
        singers: [],
        songs: [],
        pullup: true,
        hasMore: true,
        listenBeforeScroll: true,
      };
    },
    props: {
      showSinger: {
        type: Boolean,
        default: true,
      },
      query: {
        type: String,
        default: '',
      },
    },
    components: {
      Scroll,
      Loading,
      NoResult,
    },
    watch: {
      query(newQuery) {
        if (!newQuery) { return; }
        this._search();
      },
    },
    methods: {
      selectSong(song) {
        this.insertSong(song);
        this.$emit('select');
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/search/${singer.mid}`,
        });
        this.$emit('select');
        this.setSinger(singer);
      },
      listScroll() {
        this.$emit('listScroll');
      },
      refresh() {
        this.$refs.suggest.refresh();
      },
      _getSearchResult() {
        search(this.query, this.showSinger, this.page, LIMIT)
          .then((res) => {
            console.log(res);
            if (res.singers.code === ERR_OK) {
              this.singers = this.singers.concat(this._normalizeSinger(res.singers.result.artists));
            }

            if (res.songs.code === ERR_OK) {
              this.songs = this.songs.concat(this._normalizeSongs(res.songs.result.songs));
            }

            this._checkMore();
          });
      },
      _search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scroll.scrollTo(0, 0);
        this._getSearchResult();
      },
      _searchMore() {
        if (!this.hasMore) {
          return;
        }

        this.page += 1;
        this._getSearchResult();
      },
      _checkMore() {
        const { songs, singers, page, total } = this;
        if (!songs.length || !singers.length || page * LIMIT >= total) {
          this.hasMore = false;
        }
      },
      _normalizeSinger(singers) {
        const ret = singers.map((item) => {
          const singer = new FormatSinger({
            name: item.singername,
            id: item.singermid,
          });
          return singer;
        });

        return ret;
      },
      _normalizeSong(songs) {
        const ret = songs.map((item) => {
          let song = null;
          if (item.id && item.album.id) {
            song = createSong(item);
          }
          return song;
        });

        return ret;
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
      }),
      ...mapActions({
        insertSong: 'insertSong',
      }),
    },
  };
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable";
  @import "~common/stylus/mixin";

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      top: 50%
      left: 50%
      transform: translate3d(-50%, -50%, 0)
</style>
