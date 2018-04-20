// import jsonp from 'common/js/jsonp';
import axios from 'axios';

const debug = process.env.NODE_ENV !== 'production';

export function getBanner() {
  const url = debug ? '/api/banner' : 'https://zhengss33.github.io/music-player/api/banner';

  return axios.get(url).then(res => Promise.resolve(res.data));
}

export function getDiscList() {
  const url = debug ? '/api/top/playlist' : 'https://zhengss33.github.io/music-player/api/top/playlist';

  return axios.get(url, {
    params: {
      limit: 10,
    },
  }).then(res => Promise.resolve(res.data));
}
