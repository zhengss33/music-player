import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/utils';
import {
  saveSearch,
  deleteSearch,
  clearSearch,
  savePlay,
  saveFavorite,
  deleteFavorite,
} from 'common/js/cache';
import * as types from './mutations-types';

const findIndex = function findIndex(list, song) {
  return list.findIndex(item => item.id === song.id);
};

const selectPlay = function selectPlay({ commit, state }, { list, index }) {
  let playList = null;
  let currentIndex = 0;

  if (state.mode === playMode.random) {
    playList = shuffle(list);
    currentIndex = findIndex(playList, list[index]);
  } else {
    playList = list;
    currentIndex = index;
  }

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
};

const randomPlay = function randomPlay({ commit }, { list }) {
  const randomList = shuffle(list);

  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
};

const insertSong = function insertSong({ commit, state }, song) {
  /* eslint-disable */
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  /* eslint-disable */
  let currentIndex = state.currentIndex;
  const currentSong = playlist[currentIndex];

  // 查找播放列表中是否有待插入的歌曲并返回其索引
  const fpIndex = findIndex(playlist, song);

  currentIndex += 1;
  // 插入歌曲
  playlist.splice(currentIndex, 0, song);

  // 如果插入歌曲有重复，删除该歌曲
  if (fpIndex > -1) {
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex -= 1;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  // 查找列表中当前歌曲的索引
  const currentSIndex = findIndex(sequenceList, currentSong) + 1;
  // 查找列表中是否有待插入的歌曲并返回其索引
  const fsIndex = findIndex(sequenceList, song);
  // 插入歌曲
  sequenceList.splice(currentSIndex, 0, song);
  // 删除重复歌曲
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
};

const setSearchHistory = function setSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

const deleteSearchHistory = function deleteSearchHistory({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

const clearSearchHistory = function clearSearchHistory({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

const deleteSong = function deleteSong({ commit, state }, song) {
  /* eslint-disable */
  let playList = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  /* eslint-disable */
  let currentIndex = state.currentIndex;

  const fpIndex = playList.findIndex(item => item.id === song.id);
  playList.splice(fpIndex, 1);

  const fsIndex = sequenceList.findIndex(item => item.id === song.id);
  sequenceList.splice(fsIndex, 1);

  if (currentIndex > fpIndex || currentIndex === playList.length) {
    currentIndex -= 1;
  }

  const playState = playList.length > 0;

  commit(types.SET_PLAYLIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_PLAYING_STATE, playState);
};

const deleteSongList = function deleteSongList({ commit }) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CURRENT_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
}

const savePlayHistory = function savePlayHistory({ commit }, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
}

const saveFavoriteSong = function saveFavoriteSong({ commit }, song) {
  commit(types.SET_FAVORITE_SONGS, saveFavorite(song));
}

const deleteFavoriteSong = function deleteFavoriteSong({ commit }, song) {
  commit(types.SET_FAVORITE_SONGS, deleteFavorite(song));
}

export {
  selectPlay,
  randomPlay,
  insertSong,
  setSearchHistory,
  deleteSearchHistory,
  clearSearchHistory,
  deleteSong,
  deleteSongList,
  savePlayHistory,
  saveFavoriteSong,
  deleteFavoriteSong,
}
