<template lang="html">
  <transition name="slide">
    <music-list :rank="true" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getTopSongs } from 'api/rank';
  import { ERR_OK } from 'api/config';
  import { createSong } from 'common/js/format-song';

  export default {
    data() {
      return {
        songs: [],
      };
    },
    components: {
      MusicList,
    },
    created() {
      this._getTopSongs();
    },
    computed: {
      title() {
        return this.toplist.topTitle;
      },
      bgImage() {
        return this.songs.length > 0 ? this.songs[0].image : '';
      },
      ...mapGetters([
        'toplist',
      ]),
    },
    methods: {
      _getTopSongs() {
        if (!this.toplist.id) {
          this.$router.push('/rank');
          return;
        }

        getTopSongs(this.toplist.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeList(res.songlist);
          }
        });
      },
      _normalizeList(list) {
        const ret = [];

        list.forEach((song) => {
          const musicData = song.data;
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
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translateX(100%)
</style>
