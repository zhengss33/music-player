import 'babel-polyfill';
import Vue from 'vue';
import fastclick from 'fastclick';
import 'common/stylus/index.styl';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

fastclick.attach(document.body);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
