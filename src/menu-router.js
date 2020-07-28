import {DataFactory} from './components/ilayout';
import {ssoData, userData} from './api/sso';
import config from './config';
import HomePage from './pages/home/index.vue';
import TestPage from './pages/test-content/index.vue';
import NotFoundPage from './pages/404/index.vue';
import ParentPage from './pages/parent-pages/index.vue';

let useSSOMenu = false; // 是否需要使用 SSO 菜单

async function getMenuRouterData(store, code) {

  // 自定义 顶部菜单
  const headerMenuData = [
    {
      select: true,
      code: 'menu1-1',
      describe: '顶部菜单一',
      uri: '#1',
      linkType: 'a-link',
    },
    {
      code: 'menu1-2',
      describe: '顶部菜单二',
      uri: '#2',
      linkType: 'a-link',
      hide: false,
    },
    {
      code: 'menu1-3',
      describe: '顶部菜单三',
      // uri: '#3',
      // linkType: 'a-link',
      path: '/menu1-3',
      component: TestPage,
    },
  ];

  /**
   * 自定义 侧边栏菜单 
   * 1. 如果 SSO 菜单存在，则和 SSO 菜单数据拼接起来
   * 2. 如果菜单不依赖 SSO 则是 自定义菜单，请将 useSSOMenu 置为 false
   * @type {Array}
   */
  const customSidebarMenuRouters = {
    'menu1-1': [
      {
        path: '',
        name: 'first-menu',
        describe: '一级菜单',
        icon: 'ios-flower',
        component: ParentPage,
        children: [
          {
            name: 'child-menu11',
            path: '/child-menu11',
            describe: '二级菜单',
            component: HomePage,
            hide: false,
            children: [
              {
                name: 'child-menu111',
                path: '/child-menu111',
                describe: '三级菜单',
                component: HomePage,
              },
            ],
          },
          {
            name: 'child-menu12',
            path: '/child-menu12',
            describe: '二级菜单',
            component: HomePage,
            children: [
              {
                name: 'child-menu121',
                path: '/child-menu121',
                describe: '三级菜单',
                component: HomePage,
                hide: false,
              },
            ],
          },
        ],
      },
      {
        path: '/404',
        name: '404',
        describe: '404',
        icon: 'ios-recording',
        component: NotFoundPage,
      },
    ],
    'menu1-2': [
      {
        path: '',
        name: 'first-menu2',
        describe: '一级菜单2',
        icon: 'ios-flower',
        component: ParentPage,
        children: [
          {
            name: 'child-menu2',
            path: '/child-menu2',
            describe: '二级菜单2',
            component: HomePage,
          },
        ],
      },
    ],
  };

  function getSidebarMenu(code) {
    if (code === '***' || code === '###') {
      let all = [];
      headerMenuData.forEach((item) => {
        all = all.concat(customSidebarMenuRouters[item.code] || []);
        if (item.path && item.component) {
          all.push(item);
        }
        if (code === '###') {
          item.children = customSidebarMenuRouters[item.code] || [];
        }
      });
      all = all.concat([{
        path: '*',
        component: NotFoundPage,
        hide: true,
      }]);
      return all;
    }
    if (code == undefined) {
      let dcode = code;
      headerMenuData.forEach((item) => {
        if (item.select) {
          dcode = item.code;
        }
      });
      if (dcode == undefined) {
        headerMenuData[0].select = true;
        dcode = headerMenuData[0].code;
      }
      return customSidebarMenuRouters[dcode] || [];
    } else {
      return customSidebarMenuRouters[code] || [];
    }
  }

  if (!config.useSSO) {
    const user = {
      age: 18,
      sex: 'female',
    };
    console.log(user);
    return {
      headerMenuData,
      sidebarMenuData: getSidebarMenu(code),
      routes: getSidebarMenu(code),
    };
  }

  if (!store.state.ssoData) {
    const data = await ssoData.get();
    store.dispatch('updateSsoData', {
      ssoData: data.resourceInfos,
    });
  }

  if (!store.state.user) {
    const user = await userData.get();
    store.dispatch('updateUser', {
      user,
    });
  }

  // ************** 使用 SSO 菜单，请将 useSSOMenu 置为 true 并 配置以下内容 ************** 

  /**
   * SSO 菜单信息 
   * 指定 SSO 菜单信息中 uri 与 页面 的配对关系
   * @type {Object}
   */
  const ssoRouterComponent = {
    '/': TestPage,
  };

  /**
   * DataFactory 函数，对 SSO 源数据进行处理，用来实现
   * 1. updateHideItems: 隐藏不需要在侧边栏展示的路由
   * 2. updateLinkItems: 指定菜单的路由跳转类型, 第一个参数路由类型 a-link/router-link
   * 3. updateOpenItems: 指定拥有子菜单的菜单栏是否展开
   * 4. generateRoutes: 得到菜单所需要的路由
   * 用法：
   *   const factory = new DataFactory(data.resourceInfos);
   *   factory.updateHideItems([uri1, uri2])
   *        .updateLinkItems('router-link', ['a-link1', 'a-link2'])
   *        .updateOpenItems(['describe1','describe2'])
   * @type {DataFactory}
   */
  const factory = new DataFactory(store.state.ssoData);
  factory.updateHideItems([
    '/menue2',
    '/menue2.3',
    '/menue2.1.1',
    '/menue3']);
  factory.generateRoutes(ssoRouterComponent);


  if (useSSOMenu) {
    return {
      user: store.state.user,
      headerMenuData: headerMenuData,
      sidebarMenuData: factory.data.concat(getSidebarMenu(code)),
      routes: factory.routes.concat(getSidebarMenu(code)),
    };
  } else {
    return {
      user: store.state.user,
      headerMenuData: headerMenuData,
      sidebarMenuData: getSidebarMenu(code),
      routes: getSidebarMenu(code),
    };
  }

}

export default getMenuRouterData;

