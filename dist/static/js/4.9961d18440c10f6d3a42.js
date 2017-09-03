webpackJsonp([4],{553:function(t,i,e){function n(t){e(592)}var s=e(8)(e(571),e(604),n,"data-v-c42e29ae",null);t.exports=s.exports},555:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=e(54),s=e.n(n),a=e(64),o=e.n(a),A=e(188),l=e.n(A),r=e(186),c=e.n(r),p=e(187),d=e(45),g=e(82),u=e.i(p.a)("transform"),C=e.i(p.a)("backdrop-filter");i.default={mixins:[g.c],data:function(){return{scrollY:0}},props:{title:{type:String,default:""},bgImage:{type:String,default:""},songs:{type:Array,default:function(){return[]}},rank:{type:Boolean,default:!1}},components:{Scroll:o.a,SongList:l.a,Loading:c.a},created:function(){this.probeType=3,this.listenScroll=!0},mounted:function(){this.imageHeight=this.$refs.bgImage.clientHeight,this.minTransalteY=40-this.imageHeight,this.$refs.list.$el.style.top=this.imageHeight+"px"},computed:{bgStyle:function(){return"background-image: url("+this.bgImage+");"}},watch:{scrollY:function(t){var i=Math.max(this.minTransalteY,t),e=0,n="70%",s="",a=1,o=0,A=Math.abs(t/this.imageHeight);this.$refs.bgLayer.style[u]="translateY("+i+"px)",t>0?(a=1+A,e=10):o=Math.min(20*A,20),t<this.minTransalteY&&(e=10,n="40px",s="none"),this.$refs.playBtn.style.display=s,this.$refs.bgImage.style[u]="scale("+a+")",this.$refs.mask.style[C]="blur("+o+"px)",this.$refs.bgImage.style["padding-top"]=n,this.$refs.bgImage.style["z-index"]=e}},methods:s()({handlePlayList:function(t){var i=t.length>0?"60px":"";this.$refs.list.$el.style.bottom=i,this.$refs.list.refresh()},scroll:function(t){this.scrollY=t.y},back:function(){this.$router.back()},selectSong:function(t,i){this.selectPlay({list:this.songs,index:i})},playRandomSong:function(){this.randomPlay({list:this.songs})}},e.i(d.c)(["selectPlay","randomPlay"]))}},556:function(t,i,e){i=t.exports=e(545)(!0),i.push([t.i,".music-list[data-v-25690c2e]{position:fixed;z-index:100;top:0;left:0;bottom:0;right:0;background:#222}.music-list .back[data-v-25690c2e]{position:absolute;top:0;left:6px;z-index:50}.music-list .back .icon-back[data-v-25690c2e]{display:block;padding:10px;font-size:22px;color:#ffcd32}.music-list .title[data-v-25690c2e]{position:absolute;top:0;left:10%;z-index:40;width:80%;text-overflow:ellipsis;overflow:hidden;white-space:nowrap;text-align:center;line-height:40px;font-size:18px;color:#fff}.music-list .bg-image[data-v-25690c2e]{position:relative;width:100%;height:0;padding-top:70%;-webkit-transform-origin:top;transform-origin:top;background-size:cover}.music-list .bg-image .play-wrapper[data-v-25690c2e]{position:absolute;bottom:20px;z-index:50;width:100%}.music-list .bg-image .play-wrapper .play[data-v-25690c2e]{width:135px;padding:7px 0;margin:0 auto;text-align:center;-webkit-box-sizing:border-box;box-sizing:border-box;border:1px solid #ffcd32;color:#ffcd32;border-radius:100px;font-size:0}.music-list .bg-image .play-wrapper .play .icon-play[data-v-25690c2e]{display:inline-block;vertical-align:middle;margin-right:6px;font-size:16px}.music-list .bg-image .play-wrapper .play .text[data-v-25690c2e]{display:inline-block;vertical-align:middle;font-size:12px}.music-list .bg-image .mask[data-v-25690c2e]{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(7,17,27,.4)}.music-list .bg-layer[data-v-25690c2e]{position:relative;height:100%;background:#222}.music-list .list[data-v-25690c2e]{position:absolute;top:0;bottom:0;width:100%;background:#222}.music-list .list .song-list-container[data-v-25690c2e]{padding:20px 30px}.music-list .list .loading-container[data-v-25690c2e]{position:absolute;top:50%;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%)}","",{version:3,sources:["/Users/zheng/Documents/work-spaces/music-player/src/components/music-list/music-list.vue"],names:[],mappings:"AACA,6BACE,eAAgB,AAChB,YAAa,AACb,MAAO,AACP,OAAQ,AACR,SAAU,AACV,QAAS,AACT,eAAiB,CAClB,AACD,mCACE,kBAAmB,AACnB,MAAO,AACP,SAAU,AACV,UAAY,CACb,AACD,8CACE,cAAe,AACf,aAAc,AACd,eAAgB,AAChB,aAAe,CAChB,AACD,oCACE,kBAAmB,AACnB,MAAO,AACP,SAAU,AACV,WAAY,AACZ,UAAW,AACX,uBAAwB,AACxB,gBAAiB,AACjB,mBAAoB,AACpB,kBAAmB,AACnB,iBAAkB,AAClB,eAAgB,AAChB,UAAY,CACb,AACD,uCACE,kBAAmB,AACnB,WAAY,AACZ,SAAU,AACV,gBAAiB,AACjB,6BAA8B,AACtB,qBAAsB,AAC9B,qBAAuB,CACxB,AACD,qDACE,kBAAmB,AACnB,YAAa,AACb,WAAY,AACZ,UAAY,CACb,AACD,2DACE,YAAa,AACb,cAAe,AACf,cAAe,AACf,kBAAmB,AACnB,8BAA+B,AACvB,sBAAuB,AAC/B,yBAA0B,AAC1B,cAAe,AACf,oBAAqB,AACrB,WAAa,CACd,AACD,sEACE,qBAAsB,AACtB,sBAAuB,AACvB,iBAAkB,AAClB,cAAgB,CACjB,AACD,iEACE,qBAAsB,AACtB,sBAAuB,AACvB,cAAgB,CACjB,AACD,6CACE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,YAAa,AACb,2BAA8B,CAC/B,AACD,uCACE,kBAAmB,AACnB,YAAa,AACb,eAAiB,CAClB,AACD,mCACE,kBAAmB,AACnB,MAAO,AACP,SAAU,AACV,WAAY,AACZ,eAAiB,CAClB,AACD,wDACE,iBAAmB,CACpB,AACD,sDACE,kBAAmB,AACnB,QAAS,AACT,SAAU,AACV,uCAAyC,AACjC,8BAAiC,CAC1C",file:"music-list.vue",sourcesContent:["\n.music-list[data-v-25690c2e] {\n  position: fixed;\n  z-index: 100;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  background: #222;\n}\n.music-list .back[data-v-25690c2e] {\n  position: absolute;\n  top: 0;\n  left: 6px;\n  z-index: 50;\n}\n.music-list .back .icon-back[data-v-25690c2e] {\n  display: block;\n  padding: 10px;\n  font-size: 22px;\n  color: #ffcd32;\n}\n.music-list .title[data-v-25690c2e] {\n  position: absolute;\n  top: 0;\n  left: 10%;\n  z-index: 40;\n  width: 80%;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  white-space: nowrap;\n  text-align: center;\n  line-height: 40px;\n  font-size: 18px;\n  color: #fff;\n}\n.music-list .bg-image[data-v-25690c2e] {\n  position: relative;\n  width: 100%;\n  height: 0;\n  padding-top: 70%;\n  -webkit-transform-origin: top;\n          transform-origin: top;\n  background-size: cover;\n}\n.music-list .bg-image .play-wrapper[data-v-25690c2e] {\n  position: absolute;\n  bottom: 20px;\n  z-index: 50;\n  width: 100%;\n}\n.music-list .bg-image .play-wrapper .play[data-v-25690c2e] {\n  width: 135px;\n  padding: 7px 0;\n  margin: 0 auto;\n  text-align: center;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  border: 1px solid #ffcd32;\n  color: #ffcd32;\n  border-radius: 100px;\n  font-size: 0;\n}\n.music-list .bg-image .play-wrapper .play .icon-play[data-v-25690c2e] {\n  display: inline-block;\n  vertical-align: middle;\n  margin-right: 6px;\n  font-size: 16px;\n}\n.music-list .bg-image .play-wrapper .play .text[data-v-25690c2e] {\n  display: inline-block;\n  vertical-align: middle;\n  font-size: 12px;\n}\n.music-list .bg-image .mask[data-v-25690c2e] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(7,17,27,0.4);\n}\n.music-list .bg-layer[data-v-25690c2e] {\n  position: relative;\n  height: 100%;\n  background: #222;\n}\n.music-list .list[data-v-25690c2e] {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 100%;\n  background: #222;\n}\n.music-list .list .song-list-container[data-v-25690c2e] {\n  padding: 20px 30px;\n}\n.music-list .list .loading-container[data-v-25690c2e] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n}"],sourceRoot:""}])},557:function(t,i,e){var n=e(556);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e(546)("06df1d94",n,!0)},558:function(t,i,e){function n(t){e(557)}var s=e(8)(e(555),e(559),n,"data-v-25690c2e",null);t.exports=s.exports},559:function(t,i){t.exports={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{staticClass:"music-list"},[e("div",{staticClass:"back",on:{click:t.back}},[e("i",{staticClass:"icon-back"})]),t._v(" "),e("h1",{staticClass:"title",domProps:{innerHTML:t._s(t.title)}}),t._v(" "),e("div",{ref:"bgImage",staticClass:"bg-image",style:t.bgStyle},[e("div",{staticClass:"play-wrapper"},[e("div",{directives:[{name:"show",rawName:"v-show",value:t.songs.length>0,expression:"songs.length>0"}],ref:"playBtn",staticClass:"play",on:{click:t.playRandomSong}},[e("i",{staticClass:"icon-play"}),t._v(" "),e("span",{staticClass:"text"},[t._v("随机播放全部")])])]),t._v(" "),e("div",{ref:"mask",staticClass:"mask"})]),t._v(" "),e("div",{ref:"bgLayer",staticClass:"bg-layer"}),t._v(" "),e("scroll",{ref:"list",staticClass:"list",attrs:{data:t.songs,"probe-type":t.probeType,"listen-scroll":t.listenScroll},on:{scroll:t.scroll}},[e("div",{staticClass:"song-list-container"},[e("song-list",{attrs:{rank:t.rank,songs:t.songs},on:{select:t.selectSong}})],1),t._v(" "),e("div",{directives:[{name:"show",rawName:"v-show",value:!t.songs.length,expression:"!songs.length"}],staticClass:"loading-container"},[e("loading")],1)])],1)},staticRenderFns:[]}},560:function(t,i,e){"use strict";function n(){var t=o()({},l.b,{uin:0,platform:"h5",needNewCode:1,_:1502112165634});return e.i(A.a)("https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg",t,l.c)}function s(t){var i=o()({},l.b,{topid:t,uin:0,platform:"h5",needNewCode:1,tpl:3,page:"detail",type:"top"});return e.i(A.a)("https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg",i,l.c)}i.b=n,i.a=s;var a=e(83),o=e.n(a),A=e(185),l=e(63)},571:function(t,i,e){"use strict";Object.defineProperty(i,"__esModule",{value:!0});var n=e(54),s=e.n(n),a=e(558),o=e.n(a),A=e(45),l=e(560),r=e(63),c=e(124);i.default={data:function(){return{songs:[]}},components:{MusicList:o.a},created:function(){this._getTopSongs()},computed:s()({title:function(){return this.toplist.topTitle},bgImage:function(){return this.songs.length>0?this.songs[0].image:""}},e.i(A.a)(["toplist"])),methods:{_getTopSongs:function(){var t=this;if(!this.toplist.id)return void this.$router.push("/rank");e.i(l.a)(this.toplist.id).then(function(i){i.code===r.a&&(t.songs=t._normalizeList(i.songlist))})},_normalizeList:function(t){var i=[];return t.forEach(function(t){var n=t.data;n.albummid&&n.songid&&i.push(e.i(c.b)(n))}),i}}}},582:function(t,i,e){i=t.exports=e(545)(!0),i.push([t.i,".slide-enter-active[data-v-c42e29ae],.slide-leave-active[data-v-c42e29ae]{-webkit-transition:all .3s ease;transition:all .3s ease}.slide-enter[data-v-c42e29ae],.slide-leave-to[data-v-c42e29ae]{-webkit-transform:translateX(100%);transform:translateX(100%)}","",{version:3,sources:["/Users/zheng/Documents/work-spaces/music-player/src/components/top-list/top-list.vue"],names:[],mappings:"AACA,0EAEE,gCAAkC,AAClC,uBAA0B,CAC3B,AACD,+DAEE,mCAAoC,AAC5B,0BAA4B,CACrC",file:"top-list.vue",sourcesContent:["\n.slide-enter-active[data-v-c42e29ae],\n.slide-leave-active[data-v-c42e29ae] {\n  -webkit-transition: all 0.3s ease;\n  transition: all 0.3s ease;\n}\n.slide-enter[data-v-c42e29ae],\n.slide-leave-to[data-v-c42e29ae] {\n  -webkit-transform: translateX(100%);\n          transform: translateX(100%);\n}"],sourceRoot:""}])},592:function(t,i,e){var n=e(582);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);e(546)("263d4f49",n,!0)},604:function(t,i){t.exports={render:function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("transition",{attrs:{name:"slide"}},[e("music-list",{attrs:{rank:!0,title:t.title,bgImage:t.bgImage,songs:t.songs}})],1)},staticRenderFns:[]}}});
//# sourceMappingURL=4.9961d18440c10f6d3a42.js.map