import { playMode } from 'common/js/config';
import { shuffle } from 'common/js/utils';
import * as types from './mutations-types';

const findIndex = function (list, song) {
  return list.findIndex(item => item.id === song.id);
};

export const selectPlay = function ({ commit, state }, { list, index }) {
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

export const randomPlay = function ({ commit }, { list }) {
  const randomList = shuffle(list);

  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_PLAYING_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
};
