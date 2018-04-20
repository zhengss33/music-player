const express = require('express');
// const compression = require('compression');
const config = require('./config/index');
const axios = require('axios');

const port = process.env.PROT || config.build.port;

const app = express();

const baseUrl = 'https://neteasemusic.leanapp.cn';

const apiRoutes = express.Router();

apiRoutes.get('/banner', function(req, res) {
  let url = `${baseUrl}/api/banner`;

  axios.get(url, {
    headers: {
      referer: baseUrl,
      host: 'neteasemusic.leanapp.cn'
    }
  }).then(response => {
    res.json(response)
  }).catch(err => {
    console.log('Error', err)
  })
})

apiRoutes.get('/top/playlist', function(req, res) {
  let url = `${baseUrl}/api/top/playlist`;

  axios.get(url, {
    headers: {
      referer: baseUrl,
      host: 'neteasemusic.leanapp.cn'
    }
  }).then(response => {
    res.json(response)
  }).catch(err => {
    console.log('Error', err)
  })
})

apiRoutes.get('/getLyric', function(req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data;
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var matches = ret.match(reg);
      if (matches) {
        ret = JSON.parse(matches[1])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e);
  })
})

apiRoutes.get('/getPlayList', function(req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes);

// app.use(compression());

app.use(express.static('./dist'));

module.exports = app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Listening at http://localhost: ${port} \n`);
  }
});
