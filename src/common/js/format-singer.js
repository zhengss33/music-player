export default class FormatSinger {
  constructor({ id, name }) {
    this.mid = id;
    this.name = name;
    this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`;
  }
}
