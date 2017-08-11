
const singer = state => state.singer;

const playing = state => state.playing;

const fullScreen = state => state.fullScreen;

const playlist = state => state.playlist;

const sequenceList = state => state.sequenceList;

const mode = state => state.mode;

const currentIndex = state => state.currentIndex;

const currentSong = state => state.playlist[state.currentIndex];

const disc = state => state.disc;

const toplist = state => state.toplist;

const searchHistory = state => state.searchHistory;

export {
  singer,
  playing,
  fullScreen,
  playlist,
  sequenceList,
  mode,
  currentIndex,
  currentSong,
  disc,
  toplist,
  searchHistory,
};
