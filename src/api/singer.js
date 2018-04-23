import jsonp from 'common/js/jsonp';
import axios from 'axios';
import { commonParams, options, baseUrl } from './config';

const debug = process.env.NODE_ENV !== 'production';

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg';

  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  });

  return jsonp(url, data, options);
}

export function getSingerDetail(id) {
  const url = debug ? '/api/artists' : `${baseUrl}/api/artists`;

  return axios.get(url, {
    params: { id },
  }).then(res => Promise.resolve(res.data));
}

export function getSingerId(name) {
  const url = debug ? '/api/search' : `${baseUrl}/api/search`;
  return axios.get(url, {
    params: {
      keywords: name,
      type: 100,
    },
  }).then(res => Promise.resolve(res.data));
}
