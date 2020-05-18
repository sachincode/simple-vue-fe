/**
 * 此文件为统一错误处理文件
 * axios 是Vue推荐的请求工具, 相关使用访问的文档地址: https://github.com/mzabriskie/axios
 */
import config from '../config';

function addInterceptors(instance) {
  instance.defaults.timeout = 5000;
  instance.defaults.withCredentials = true;

  const errorMap = {
    400: '请求失败',
    401: '未授权',
    403: '禁止访问',
    404: '地址未找到',
    499: '未登录',
  };

  // 返回结果拦截器,处理默认的错误
  instance.interceptors.response.use((response) => {
    // 正常的请求前拦截,在这里处理
    return response.data;
  }, function(error) {
    // 非200请求时的错误处理
    const res = error.response.data; // 请求data
    const status = error.response.status; // 请求状态吗
    const message = res.message || (res.errors && res.errors[0].message); // 错误消息

    console.log(
      {
        title: errorMap[status] || '未知错误',
        description: message,
      });

    if (status === 499 && !config.customLogin) {
      // sso 未登录错误
      let backUrl = window.location.href;
      let jumpUrl = res.url.replace(/^https?:\/\/[\s\S]+?\//, '/');
      // 实现登录成功后回跳
      window.location.href = jumpUrl.split('?reffer=')[0].concat(`?reffer=${encodeURIComponent(backUrl)}`);
    }
    // Do something with response error
    return Promise.reject(error);
  });
}

export default addInterceptors;
