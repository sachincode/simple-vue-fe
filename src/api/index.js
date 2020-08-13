/**
 * 开发阶段 mock 数据使用
 * 如有需要mock数据请打开下面 👇 这段代码的注释
 */

// if (process.env.NODE_ENV == 'development') {
//     const bootstrapMock = require('./mock.js');
//     bootstrapMock.default(instance);
// }

import axios from 'axios';
import addInterceptors from './instance';

// 配置 axios 实例，点击 https://www.kancloud.cn/yunye/axios/234845 查看配置方法
export const instance = axios.create({
  // axios 实例配置，如没有其他配置项，可以置空
});

addInterceptors(instance);

export const User = {
  get(params) {
    return instance.get('/user/get/', {params});
  },
  post(params, data) {
    return instance.post('/user/post/', data, {params});
  },
  put(params, data) {
    return instance.put('/user/post/', data, {params});
  },
  delete() {
    return instance.delete('/user/post/');
  },
};

export default instance;
