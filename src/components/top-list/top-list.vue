<template lang="html">
  <transition name="slide">
    <music-list :rank="true" :title="title" :bgImage="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script>
  import MusicList from 'components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getTopList } from 'api/rank';
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
        return this.toplist.title;
      },
      bgImage() {
        const tracks = this.toplist && this.toplist.tracks;
        return tracks.length > 0 ? tracks[0].album.picUrl : '';
      },
      ...mapGetters([
        'toplist',
      ]),
    },
    methods: {
      _getTopSongs() {
        const idx = this.toplist.idx;
        if (idx === 'undefined') {
          this.$router.push('/rank');
          return;
        }

        getTopList(idx).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeList(res.result.tracks);
          }
        });
      },
      _normalizeList(list) {
        const ret = [];

        list.forEach((song) => {
          if (song.id && song.album.id) {
            const { id, artists, name, album, duration } = song;
            ret.push(createSong({
              id,
              name,
              duration,
              image: album.picUrl,
              album: album.name,
              singer: artists,
            }));
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
