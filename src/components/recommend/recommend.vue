<template>
  <div class="recommend">
    <div class="slider-wrapper" v-if="recommends.length">
      <div class="slider-content">
        <slider>
          <div v-for="item in recommends" :key="item.id">
            <a>
              <img :src="item.picUrl">
            </a>
          </div>
        </slider>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getRecommend } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import Slider from 'base/slider/slider';

  export default{
    data() {
      return {
        recommends: [],
      };
    },
    components: {
      Slider,
    },
    created() {
      this.getRecommendData();
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
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
</style>
