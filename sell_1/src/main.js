import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';

import 'common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

// 如果new是一下的形式，就要写这个备注
// /* eslint-disable no-new */
// new Vue({
//   el: 'body',
//   components: { App }
// });

// App挂载的组件
let app = Vue.extend(App);

// router的时候可以传入一些配置
let router = new VueRouter({
  linkActiveClass: 'active'
});

router.map({
  '/goods': {
    component: goods
  },
  '/seller': {
    component: seller
  },
  '/ratings': {
    component: ratings
  }
});

// #app 是挂载点
router.start(app, '#app');

// 进入默认页面，模式不配置默认页面，当上线的时候默认在链接后边配置hash值来表示进入到哪一个页面
// router.go('/goods');
