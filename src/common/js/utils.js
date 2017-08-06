function getRandomInt(min, max) {
  const range = max - min;
  return Math.floor(Math.random() * (range + 1)) + min;
}


export function shuffle(arr) {
  const _arr = arr.slice();

  for (let i = 0; i < _arr.length; i += 1) {
    const j = getRandomInt(0, i);
    const t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr;
}
