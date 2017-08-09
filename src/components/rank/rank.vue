<template>
  <div class="rank" ref="rank">
    <scroll ref="scroll" class="toplist" :data="topList">
      <ul>
        <li class="item" @click="selectItem(item)" v-for="item in topList" :key="item.id">
          <div class="pic">
            <img v-lazy="item.picUrl" width="100" height="100"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song, index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}} - {{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import { getTopList } from 'api/rank';
  import { ERR_OK } from 'api/config';
  import { playListMixin } from 'common/js/mixin';
  import { mapMutations } from 'vuex';

  export default{
    mixins: [playListMixin],
    data() {
      return {
        topList: [],
      };
    },
    components: {
      Scroll,
      Loading,
    },
    created() {
      this._getTopList();
    },
    methods: {
      handlePlayList(newList) {
        const bottom = newList.length > 0 ? '60px' : '';

        this.$refs.rank.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      _getTopList() {
        getTopList().then((res) => {
          if (res.code === ERR_OK) {
            this.topList = res.data.topList;
          }
        });
      },
      selectItem(item) {
        this.$router.push({
          path: `/rank/${item.id}`,
        });

        this.setTopList(item);
      },
      ...mapMutations({
        setTopList: 'SET_TOP_LIST',
      }),
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    top: 80px
    width: 100%
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .pic
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100%
          color: $color-text-d
          font-size: $font-size-small
          background: $color-highlight-background
          overflow: hidden
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        top: 50%
        left: 50%
        transform: translate3d(-50%, -50%, 0)
</style>
