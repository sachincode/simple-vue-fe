import MockAdapter from 'axios-mock-adapter';
// /*
//  * mock 文件
//  * 可阅读 https://www.npmjs.com/package/axios-mock-adapter 了解更多
//  */

export default (instance) => {
  const mock = new MockAdapter(instance);

  mock.onGet('/ssoagentlogin/getMenuesByAccount').reply(200, {
    resourceInfos: [{
      res_id: '0fb38a51-46a4-4155-aaf4-893ef9b003ea',
      app_id: '160f2533-e836-4776-a6d3-8b9c72bdcea8',
      code: 'L21lbnVlMg==',
      describe: '三级菜单管理',
      res_type: 'menu',
      icon: 'ios-folder-outline',
      uri: '/menue2',
      parent_code: '0',
      status: 1,
      create_time: '2017-07-28T17:00:08.000+08',
      last_modify_time: '2017-07-28T17:00:08.000+08',
      is_annotation: false,
      sort: 0,
    }],
  });

  mock.onAny().passThrough();
};