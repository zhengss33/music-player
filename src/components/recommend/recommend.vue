<template>
  <div class="recommend">
    <scroll ref="scroll" class="recommend-content" :data="playList">
      <div>
        <div class="slider-wrapper" v-if="recommends.length">
          <div class="slider-content">
            <slider>
              <div v-for="item in recommends" :key="item.id">
                <a :href="item.linkUrl">
                  <img class="needsclick" @load="loadImage" :src="item.picUrl">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li class="list-item" v-for="item in playList" :key="item.dissid">
              <div class="pic">
                <img v-lazy="item.imgurl">
              </div>
              <div class="text">
                <p class="desc" v-html="item.dissname"></p>
                <h2 class="creator" v-html="item.creator.name"></h2>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!playList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll';
  import Loading from 'base/loading/loading';
  import { getRecommend, getPlayList } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import Slider from 'base/slider/slider';

  export default{
    data() {
      return {
        recommends: [],
        playList: [],
      };
    },
    components: {
      Slider,
      Scroll,
      Loading,
    },
    created() {
      this.getRecommendData();
      this.getPlayListData();
    },
    methods: {
      getRecommendData() {
        getRecommend().then((res) => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
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
      getPlayListData() {
        getPlayList().then((res) => {
          if (res.code === ERR_OK) {
            this.playList = res.data.list;
          }
        }).catch((err) => {
          throw Error(err);
        });
      },
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

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
