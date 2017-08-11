<template lang="html">
  <transition name="slider">
    <music-list :songs="discList" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getDiscList } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import { createSong } from 'common/js/format-song';

  export default {
    data() {
      return {
        discList: [],
      };
    },
    created() {
      this._getDiscList();
    },
    components: {
      MusicList,
    },
    computed: {
      ...mapGetters([
        'disc',
      ]),
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.imgurl;
      },
    },
    methods: {
      _getDiscList() {
        if (!this.disc.dissid) {
          this.$router.push('/recommend');
          return;
        }

        getDiscList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
            this.discList = this._normalizeList(res.cdlist[0].songlist);
          }
        });
      },
      _normalizeList(list) {
        const ret = [];
        list.forEach((musicData) => {
          if (musicData.albummid && musicData.songid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
    },
  };
</script>

<style lang="stylus" scoped>
  .slider-enter-active, .slider-leave-active
    transition: all 0.3s ease

  .slider-enter, .slider-leave-to
    transform: translateX(100%);
</style>
