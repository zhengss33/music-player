import originJsonp from 'jsonp';

export function param(data) {
  let url = '';
  Object.keys(data).forEach((k) => {
    const value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${value}`;
  });

  return url ? url.substring(1) : '';
}

export default function jsonp(url, data, options) {
  const formatUrl = url + (url.indexOf('?') < 0 ? '?' : '') + param(data);

  return new Promise((resolve, reject) => {
    originJsonp(formatUrl, options, (err, res) => {
      if (!err) {
        resolve(res);
      } else {
        reject(err);
      }
    });
  });
}
