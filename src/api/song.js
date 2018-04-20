import axios from 'axios';
import { baseUrl } from './config';

const debug = process.env.NODE_ENV !== 'production';


export function getLyric(id) {
  const url = debug ? '/api/lyric' : `${baseUrl}/api/lyric`;

  return axios.get(url, {
    params: { id },
  }).then(res => Promise.resolve(res.data));
}
