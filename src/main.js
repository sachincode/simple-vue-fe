// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './components/layout/index.vue';
import getMenuRouterData from './menu-router';
import LoginPage from './pages/login/index.vue';
import {userData} from './api/sso';
import store from './store/index';
import config from './config';
import iView from 'iview';
import 'iview/dist/styles/iview.css';

Vue.use(VueRouter);
Vue.use(iView);

Vue.prototype.$store = store;

const router = new VueRouter({
  routes: [],
});

async function addRouters() {
  const data = await getMenuRouterData(store);
  router.addRoutes(data.routes);
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach((route) => {
  iView.LoadingBar.finish();
});

if (config.customLogin) {

  userData.get().then((user) => {

    const app = newApp();

    app.$store.dispatch('updateUser', {
      user,
    });

  }).catch((error) => {

    if (error.response.status !== 499) {
      throw error;
    }

    newLoginPage();

  });

} else {
  newApp();
}

// 登录之后的页面渲染
function newApp() {

  addRouters();

  return new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: {
      App,
    },
  });
}

// 登录页渲染
function newLoginPage() {
  return new Vue({
    el: '#app',
    router,
    template: '<LoginPage/>',
    components: {
      LoginPage,
    },
  });
}
