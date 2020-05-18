import axios from 'axios';
import addInterceptors from './instance';

export const instance = axios.create({
  withCredentials: true,
});

addInterceptors(instance);

export const ssoData = {
  get() {
    return instance.get('/ssoagentlogin/getMenuesByAccount');
  },
};

export const userData = {
  get() {
    return instance.get('/ssoagentlogin/getcurrentUserInfo');
  },
};

export const logout = {
  get() {
    return instance.get('/ssoagentlogin/logoutAndGetLoginUrl');
  },
};

export const login = {
  post(data) {
    return instance.post('/ssoagentlogin/dologin', data);
  },
};
