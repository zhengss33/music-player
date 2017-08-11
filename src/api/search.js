import { commonParams, options } from 'api/config';
import jsonp from 'common/js/jsonp';

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
  });

  return jsonp(url, data, options);
}

export function search(query, zhida, page, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';

  const data = Object.assign({}, commonParams, {
    w: query,
    catZhida: zhida ? 1 : 0,
    p: page,
    perpage,
    n: perpage,
    zhidaqu: 1,
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
  });

  return jsonp(url, data, options);
}
