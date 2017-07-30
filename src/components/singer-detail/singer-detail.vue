<template>
  <transition name="slide">
    <music-list
      :title="title"
      :bgImge="bgImage"
      :songs="songs"
    >
    </music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list';
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from 'api/singer';
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
      this._getDetail();
    },
    computed: {
      title() {
        return this.singer.Fsinger_name;
      },
      bgImage() {
        return this.singer.Fsinger_avatar;
      },
      ...mapGetters([
        'singer',
      ]),
    },
    methods: {
      _getDetail() {
        const id = this.singer.Fsinger_mid;
        if (!id) {
          this.$router.push('/singer');
          return;
        }

        getSingerDetail(id).then((res) => {
          if (res.code === ERR_OK) {
            const list = res.data.list;
            this.songs = this._normalizeSongs(list);
          }
        });
      },
      _normalizeSongs(list) {
        const ret = [];
        list.forEach((song) => {
          const { musicData } = song;
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData));
          }
        });
        return ret;
      },
    },
  };
</script>
<style scoped lang="stylus" rel="stylesheel/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%);
</style>
