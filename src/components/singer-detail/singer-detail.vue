<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex';
  import { getSingerDetail } from 'api/singer';
  import { ERR_OK } from 'api/config';

  export default {
    created() {
      this.getDetail();
    },
    computed: {
      ...mapGetters([
        'singer',
      ]),
    },
    methods: {
      getDetail() {
        const id = this.singer.Fsinger_mid;
        if (!id) {
          this.$router.push('/singer');
          return;
        }

        getSingerDetail(id).then((res) => {
          if (res.code === ERR_OK) {
            console.log(res);
          }
        });
      },
    },
  };
</script>
<style scoped lang="stylus" rel="stylesheel/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translateX(100%);
  .singer-detail
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom:0
    z-index: 100
    background: #222
</style>
