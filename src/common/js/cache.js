import storage from 'good-storage';

const SEARCH_KEY = '__search__';
const SEARCH_MAX_LENGTH = 15;

const PLAY_KEY = '__play__';
const PLAY_MAX_LENGTH = 200;

const FAVORITE_KEY = '__favorite__';
const FAVORITE_MAX_LENGTH = 200;


function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare);

  if (index === 0) {
    return;
  }

  if (index > 0) {
    arr.splice(index, 1);
  }

  arr.unshift(val);

  if (maxLen && arr.length > maxLen) {
    arr.pop();
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare);

  if (index > -1) {
    arr.splice(index, 1);
  }
}

export function saveSearch(query) {
  const searches = storage.get(SEARCH_KEY, []);
  insertArray(searches, query, item => item === query, SEARCH_MAX_LENGTH);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, []);
}

export function deleteSearch(query) {
  const searches = storage.get(SEARCH_KEY, []);
  deleteFromArray(searches, item => item === query);
  storage.set(SEARCH_KEY, searches);
  return searches;
}

export function clearSearch() {
  storage.remove(SEARCH_KEY);
  return [];
}

export function savePlay(song) {
  let playHistory = storage.get(PLAY_KEY, []);
  insertArray(playHistory, song, item => item.id === song.id, PLAY_MAX_LENGTH);
  storage.set(PLAY_KEY, playHistory);
  return playHistory;
}

export function loadPlay() {
  return storage.get(PLAY_KEY, []);
}


export function saveFavorite(song) {
  const favoriteSongs = storage.get(FAVORITE_KEY, []);
  insertArray(favoriteSongs, song, item => item.id === song.id, FAVORITE_MAX_LENGTH);
  storage.set(FAVORITE_KEY, favoriteSongs);
  return favoriteSongs;
}

export function deleteFavorite(song) {
  const favoriteSongs = storage.get(FAVORITE_KEY, []);
  deleteFromArray(favoriteSongs, item => item.id === song.id);
  storage.set(FAVORITE_KEY, favoriteSongs);
  return favoriteSongs;
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, []);
}
