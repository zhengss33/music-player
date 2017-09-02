import { mapGetters, mapMutations, mapActions } from 'vuex';
import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/utils';

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

export const playerMixin = {
  computed: {
    modeIcon() {
      switch (this.mode) {
        case playMode.sequence:
          return 'icon-sequence';

        case playMode.loop:
          return 'icon-loop';

        default:
          return 'icon-random';
      }
    },
    ...mapGetters([
      'currentSong',
      'mode',
      'sequenceList',
    ]),
  },
  methods: {
    changePlayMode() {
      const mode = (this.mode + 1) % 3;
      let list = this.sequenceList;

      if (mode === playMode.random) {
        list = shuffle(list);
      }

      this.resetCurrentIndex(list);
      this.setPlayMode(mode);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      const index = list.findIndex(song => song.id === this.currentSong.id);
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST',
    }),
  },
};

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100,
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory',
    ]),
  },
  methods: {
    onQueryChange(query) {
      this.query = query;
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    inputBlur() {
      this.$refs.searchBox.blur();
    },
    saveHistory() {
      this.setSearchHistory(this.query);
    },
    deleteHistory(item) {
      this.deleteSearchHistory(item);
    },
    ...mapActions([
      'setSearchHistory',
      'deleteSearchHistory',
    ]),
  },
};
