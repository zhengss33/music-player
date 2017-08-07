import { mapGetters } from 'vuex';

export const playListMixin = {
  mounted() {
    this.handlePlayList(this.sequenceList);
  },
  activated() {
    this.handlePlayList(this.sequenceList);
  },
  computed: {
    ...mapGetters([
      'sequenceList',
    ]),
  },
  watch: {
    sequenceList(newVal) {
      this.handlePlayList(newVal);
    },
  },
  methods: {
    handlePlayList() {
      throw new Error('component must implement handlePlayList method');
    },
  },
};
