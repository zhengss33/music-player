import axios from 'axios';
import { commonParams } from './config';

/* eslint-disable */
export function getLyric(mid) {
  const url = 'api/getLyric';

  const data = Object.assign({}, commonParams, {
    pcachetime: +new Date(),
    songmid: mid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json',
  });

  return axios.get(url, {
    params: data,
  }).then(res => Promise.resolve(res.data));
}
/* eslint-disable */
