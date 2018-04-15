<template lang="html">
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getDiscList } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import { createSong, isValidMusic, processSongsUrl } from 'common/js/format-song';

  export default {
    data() {
      return {
        songs: [],
      };
    },
    created() {
      this._getDiscList();
    },
    components: {
      MusicList,
    },
    computed: {
      title() {
        return this.disc.dissname;
      },
      bgImage() {
        return this.disc.picUrl;
      },
      ...mapGetters([
        'disc',
      ]),
    },
    methods: {
      _getDiscList() {
        if (!this.disc.id) {
          this.$router.push('/recommend');
          return;
        }

        getDiscList(this.disc.id).then((res) => {
          if (res.code === ERR_OK) {
            processSongsUrl(this._normalizeSongs(res.cdlist[0].songlist))
            .then((songs) => {
              this.songs = songs;
            });
          }
        });
      },
      _normalizeSongs(list) {
        const ret = [];
        list.forEach((musicData) => {
          if (isValidMusic(musicData)) {
            const songData = Object.assign({
              songid: musicData.id,
              songmid: musicData.mid,
              songname: musicData.title,
              albumname: musicData.album.name,
              interval: musicData.interval,
            }, musicData);
            ret.push(createSong(songData));
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
