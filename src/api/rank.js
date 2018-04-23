import jsonp from 'common/js/jsonp';
import axios from 'axios';
import { commonParams, options, baseUrl } from 'api/config';

const debug = process.env.NODE_ENV !== 'production';

export function getTopList(idx) {
  const url = debug ? '/api/top/list' : `${baseUrl}/api/top/list`;

  return axios.get(url, {
    params: { idx },
  }).then(res => Promise.resolve(res.data));
}

export function getTopSongs(topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg';

  const data = Object.assign({}, commonParams, {
    topid,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
  });

  return jsonp(url, data, options);
}
