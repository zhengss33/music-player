import 'babel-polyfill';
import Vue from 'vue';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';
import VueLazyload from 'vue-lazyload';
import defaultImg from 'common/images/default.png';

/* eslint-disable no-unused-vars */
import vConsole from 'vconsole';

import App from './App';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

fastclick.attach(document.body);
Vue.use(VueLazyload, {
  loading: defaultImg,
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
