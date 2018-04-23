import axios from 'axios';
import { baseUrl } from 'api/config';

const debug = process.env.NODE_ENV !== 'production';

export function search(query, isShowSinger, page, limit) {
  const url = debug ? '/api/search' : `${baseUrl}/api/search`;
  const options = {
    limit,
    keywords: query,
    offset: (page - 1) * limit,
  };

  if (isShowSinger) {
    const getSinger = axios.get(url, {
      params: Object.assign({ type: 100 }, options),
    }).then(res => res.data);

    const getSongs = axios.get(url, {
      params: Object.assign({ type: 1 }, options),
    }).then(res => res.data);

    return Promise.all([getSinger, getSongs]).then((res) => {
      const singers = res[0];
      const songs = res[1];
      const result = {
        total: singers.result.artistCount + songs.result.songCount,
        songs,
        singers,
      };
      return result;
    });
  }

  return axios.get(url, {
    params: {
      type: 1,
      limit,
      keywords: query,
      offset: (page - 1) * limit,
    },
  }).then(res => res.data);
}
