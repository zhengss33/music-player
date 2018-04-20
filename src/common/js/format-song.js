import { getLyric } from 'api/song';
import { ERR_OK } from 'api/config';

export default class Song {
  constructor({ id, singer, name, album, duration, image, url }) {
    this.id = id;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }

    return new Promise((resolve, reject) => {
      getLyric(this.id).then((res) => {
        if (res.code === ERR_OK) {
          this.lyric = res.lrc.lyric;
          resolve(this.lyric);
        } else {
          reject('no lyric');
        }
      });
    });
  }
}

function filterSinger(singers) {
  const ret = [];
  if (!singers) { return ''; }

  singers.forEach((singer) => {
    ret.push(singer.name);
  });
  return ret.join('/');
}

export function createSong(musicData) {
  // musicData = {
    // id:
    // singer:
    // name:
    // album:
    // duration:
    // image:
  // }
  const data = Object.assign(musicData, {
    url: `http://music.163.com/song/media/outer/url?id=${musicData.id}.mp3`,
    singer: filterSinger(musicData.singer),
    duration: musicData.duration / 1000,
  });
  return new Song(data);
}
