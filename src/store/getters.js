
const singer = state => state.singer;

const playing = state => state.playing;

const fullScreen = state => state.fullScreen;

const playlist = state => state.playlist;

const sequenceList = state => state.sequenceList;

const playMode = state => state.playMode;

const currentIndex = state => state.currentIndex;

const currentSong = state => state.playlist[state.currentIndex];

export {
  singer,
  playing,
  fullScreen,
  playlist,
  sequenceList,
  playMode,
  currentIndex,
  currentSong,
};
