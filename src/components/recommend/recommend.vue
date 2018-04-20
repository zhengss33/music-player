<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div class="slider-wrapper" v-if="banners.length">
          <div class="slider-content">
            <slider>
              <div v-if="item.targetType !== 3000
" v-for="item in banners" :key="item.id">
                <a :href="item.url">
                  <img class="needsclick" @load="loadImage" :src="item.pic">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              class="list-item"
              v-for="item in discList"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="pic">
                <img v-lazy="item.coverImgUrl">
              </div>
              <div class="text">
                <p class="desc" v-html="item.name"></p>
                <h2 class="creator" v-html="item.creator.nickname"></h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import { getBanner, getDiscList } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import Slider from 'base/slider/slider';
  import { playListMixin } from 'common/js/mixin';
  import { mapMutations } from 'vuex';

  export default{
    mixins: [playListMixin],
    data() {
      return {
        banners: [],
        discList: [],
      };
    },
    components: {
      Slider,
      Scroll,
      Loading,
    },
    created() {
      this.getRecommendData();
    },
    methods: {
      handlePlayList(newList) {
        const bottom = newList.length > 0 ? '60px' : '';

        this.$refs.recommend.style.bottom = bottom;
        this.$refs.scroll.refresh();
      },
      getRecommendData() {
        getBanner().then((res) => {
          if (res.code === ERR_OK) {
            this.banners = res.banners;
          }
        }).catch((err) => {
          throw Error(err);
        });

        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.playlists;
          }
        }).catch((err) => {
          throw Error(err);
        });
      },
      loadImage() {
        if (!this.checkLoaded) {
          this.checkLoaded = true;
          setTimeout(() => {
            this.$refs.scroll.refresh();
          }, 20);
        }
      },
      selectItem(item) {
        this.$router.push({
          path: `/recommend/${item.id}`,
        });
        this.setDisc(item);
      },
      ...mapMutations({
        setDisc: 'SET_DISC',
      }),
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        height: 0
        padding-top: 40%
        overflow: hidden
        .slider-content
          position: absolute
          top: 0
          left: 0
          width: 100%
          height: 100%
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .list-item
          display: flex
          box-sizing: border-box
          padding: 0 20px 20px 20px
          .pic
            flex: 0 0 60px
            width: 60px
            height: 60px
            padding-right: 20px
            img
              display: block
              width: 100%
              height: 100%
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .desc
              margin-bottom: 10px
              color: $color-text
            .creator
              color: $color-text-d
              font-size: $font-size-small
      .loading-container
        position: absolute
        top: 50%
        left: 50%
        transform: translate(-50%,-50%)
</style>
