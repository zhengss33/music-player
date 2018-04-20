<template>
  <div class="singer-container" ref="singer">
    <listview ref="list" @select="selectSinger" :list="singerList"></listview>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import { getSingerList } from 'api/singer';
  import { STATUS_OK } from 'api/config';
  import FormatSinger from 'common/js/format-singer';
  import Listview from 'base/listview/listview';
  import { mapMutations } from 'vuex';
  import { playListMixin } from 'common/js/mixin';

  const HOT_NUM = 10;
  const HOT_NAME = '热门';

  export default{
    mixins: [playListMixin],
    data() {
      return {
        singerList: [],
      };
    },
    components: {
      Listview,
    },
    created() {
      this._getSingerList();
    },
    methods: {
      handlePlayList(newList) {
        const bottom = newList.length > 0 ? '60px' : '';

        this.$refs.singer.style.bottom = bottom;
        this.$refs.list.$children[0].refresh();
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.mid}?name=${singer.name}`,
        });
        this.setSinger(singer);
      },
      _getSingerList() {
        getSingerList().then((res) => {
          if (res.code === STATUS_OK) {
            this.singerList = this._normalSingerList(res.data.list);
          }
        }).catch((err) => {
          throw Error(err);
        });
      },
      // 格式化数据
      _normalSingerList(list) {
        const singerList = {
          hot: {
            title: HOT_NAME,
            items: [],
          },
        };

        list.forEach((item, index) => {
          // 取前十为热门
          if (index < HOT_NUM) {
            singerList.hot.items.push(new FormatSinger({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
            }));
          }
          const key = item.Findex;
          if (!singerList[key]) {
            singerList[key] = {
              title: key,
              items: [],
            };
          }
          singerList[key].items.push(new FormatSinger({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
          }));
        });
        // 转为有序列表
        const ret = [];
        const hot = [];
        Object.keys(singerList).forEach((item) => {
          const val = singerList[item];

          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val);
          } else if (val.title === HOT_NAME) {
            hot.push(val);
          }
        });

        ret.sort((a, b) => a.title.charCodeAt(0) - b.title.charCodeAt(0));

        return hot.concat(ret);
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
      }),
    },
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer-container
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
