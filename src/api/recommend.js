import jsonp from 'common/js/jsonp';
import axios from 'axios';
import { commonParams, options } from './config';

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1,
  });

  return jsonp(url, data, options);
}

export function getPlayList() {
  const url = 'api/getPlayList';

  const data = Object.assign({}, commonParams, {
    rnd: Math.random(),
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json',
  });

  return axios.get(url, {
    params: data,
  }).then(res => Promise.resolve(res.data));
}
