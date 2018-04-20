<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
    >
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list';
  import { getSingerId, getSingerDetail } from 'api/singer';
  import { ERR_OK } from 'api/config';
  import { createSong } from 'common/js/format-song';

  export default {
    data() {
      return {
        id: '',
        title: '',
        bgImage: '',
        songs: [],
      };
    },
    components: {
      MusicList,
    },
    created() {
      this._getDetail();
    },
    methods: {
      _getDetail() {
        const name = this.$route.query.name;
        if (!name) {
          this.$router.push('/singer');
          return;
        }

        getSingerId(name).then((res) => {
          if (res.code === ERR_OK) {
            const id = res.result.artists[0].id;
            this.id = id;
            return Promise.resolve(id);
          }
        }).then((id) => {
          getSingerDetail(id).then((res) => {
            if (res.code === ERR_OK) {
              const { hotSongs, artist: { name: title, picUrl } } = res;
              this.title = title;
              this.bgImage = picUrl;
              this.songs = this._normalizeSongs(hotSongs);
            }
          });
        });
      },
      _normalizeSongs(list) {
        const ret = [];
        list.forEach((song) => {
          if (song.id && song.al.id) {
            const { id, name, ar, dt, al: { name: albumName, picUrl } } = song;
            ret.push(createSong({
              id,
              singer: ar,
              name,
              album: albumName,
              duration: dt,
              image: picUrl,
            }));
          }
        });
        return ret;
      },
    },
  };
</script>
<style scoped lang="stylus" rel="stylesheel/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease
  .slide-enter, .slide-leave-to
    transform: translateX(100%);
</style>
