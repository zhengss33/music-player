<template lang="html">
  <scroll
    class="suggest"
    :pullupRefresh="pullup"
    :data="result"
    :listenBeforeScroll="listenBeforeScroll"
    @beforeScroll="listScroll"
    @scrollToEnd="_searchMore"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
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

  const TYPE_SINGER = 'singer';
  const perpage = 20;

  export default {
    data() {
      return {
        page: 1,
        result: [],
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
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername;
        }
        return `${item.name}-${item.singer}`;
      },
      getIconCls(item) {
        return item.type === TYPE_SINGER ? 'icon-mine' : 'icon-music';
      },
      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          this.selectSinger(item);
        } else {
          this.insertSong(item);
        }
        this.$emit('select');
      },
      selectSinger(item) {
        const singer = new FormatSinger({
          name: item.singername,
          id: item.singermid,
        });

        this.$router.push({
          path: `/search/${singer.mid}`,
        });
        this.setSinger(singer);
      },
      listScroll() {
        this.$emit('listScroll');
      },
      refresh() {
        this.$refs.suggest.refresh();
      },
      _search() {
        this.page = 1;
        this.hasMore = true;
        this.$refs.suggest.scroll.scrollTo(0, 0);
        search(this.query, this.showSinger, this.page, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._normalize(res.data);
            this._checkMore(res.data);
          }
        });
      },
      _searchMore() {
        if (!this.hasMore) {
          return;
        }

        this.page += 1;
        search(this.query, this.showSinger, this.page, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this.result.concat(this._normalize(res.data));
            this._checkMore(res.data);
          }
        });
      },
      _checkMore(data) {
        const song = data.song;
        if (!song.list.length || song.curnum + ((song.curpage - 1) * perpage) >= song.totalnum) {
          this.hasMore = false;
        }
      },
      _normalize(data) {
        let ret = [];
        const zhida = data.zhida;
        if (zhida.singername && zhida.singermid) {
          ret.push({ ...zhida, type: TYPE_SINGER });
        }

        if (data.song) {
          ret = ret.concat(this._normalizeSong(data.song.list));
        }
        return ret;
      },
      _normalizeSong(list) {
        const ret = [];
        list.forEach((musicData) => {
          if (musicData.albummid && musicData.songmid) {
            ret.push(createSong(musicData));
          }
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
