import axios from 'axios';
import { getDvaApp } from 'umi';
import { message } from 'antd';
import humps from 'humps';
import { getToken } from '@/utils/auth';

const instance = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

instance.interceptors.request.use(
  (config) => {
    if (!config.headers.Authorization) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = token;
      }
    }

    config.params = humps.decamelizeKeys(config.params ?? {});
    config.data = humps.decamelizeKeys(config.data ?? {});

    return config;
  },
  (error) => {
    message.error('Request error');
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.errorCode !== 0) {
      message.warning(res.errorMsg || 'Error');
      if (
        res.errorCode === 400 ||
        res.errorCode === 401 ||
        res.errorCode === 402 ||
        res.errorCode === 403
      ) {
        const app = getDvaApp();
        // eslint-disable-next-line no-underscore-dangle
        app._store.dispatch({
          type: 'login/logout',
        });
      }
      return Promise.reject(humps.camelizeKeys(res));
    }
    return humps.camelizeKeys(res.data, (key, convert, options) => {
      return /^\d{4}-\d{2}-\d{2}$/.test(key) ? key : convert(key, options);
    });
  },
  (error) => {
    const { response } = error;
    if (response && response.status) {
      const errorText = `${response.status} ${response.statusText}`;
      message.error(errorText);
    } else if (!response) {
      message.error('Network error');
    }
    return Promise.reject(error);
  },
);

export default instance;
