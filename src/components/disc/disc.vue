<template lang="html">
  <transition name="slider">
    <music-list :songs="songs" :title="title" :bgImage="bgImage"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import { getDiscDetail } from 'api/recommend';
  import { ERR_OK } from 'api/config';
  import { createSong } from 'common/js/format-song';

  export default {
    data() {
      return {
        songs: [],
        title: '',
        bgImage: '',
      };
    },
    created() {
      this._getDiscList();
    },
    components: {
      MusicList,
    },
    methods: {
      _getDiscList() {
        if (!this.$route.params.id) {
          this.$router.push('/recommend');
          return;
        }

        getDiscDetail(this.$route.params.id).then((res) => {
          if (res.code === ERR_OK) {
            const data = res.playlist;
            this.songs = this._normalizeSongs(data.tracks);
            this.title = data.name;
            this.bgImage = data.coverImgUrl;
          }
        });
      },
      _normalizeSongs(list) {
        const ret = [];
        list.forEach((musicData) => {
          const { al: { picUrl, name: album }, ar, name, id, dt } = musicData;
          const song = createSong({
            id,
            name,
            album,
            singer: ar,
            image: picUrl,
            duration: dt,
          });
          ret.push(song);
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
