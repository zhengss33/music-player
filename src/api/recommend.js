import jsonp from 'common/js/jsonp';
import axios from 'axios';
import { commonParams, options } from './config';

const debug = process.env.NODE_ENV !== 'production';

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
  const url = debug ? 'api/getPlayList' : 'https://zhengss33.github.io/music-player/api/getPlayList';

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

export function getDiscList(disstid) {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';

  const data = Object.assign({}, commonParams, {
    type: 1,
    onlysong: 0,
    disstid,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  });

  return jsonp(url, data, options);
}
