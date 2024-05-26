import axios from 'axios';
import { message } from 'antd';
import humps from 'humps';
import { isCloudPage, useCloudApi } from '@/utils/cloud';
import { getToken } from '@/utils/auth';

const instance = axios.create({
  baseURL: '/api',
  timeout: 15000,
});

instance.interceptors.request.use(
  (config) => {
    if (isCloudPage() && useCloudApi(config.url)) {
      config.baseURL = '/cloud-api';
    }
    const token = getToken();
    if (token) {
      config.headers.Authorization = token;
    }
    if (config.params) {
      config.params = humps.decamelizeKeys(config.params);
    }
    if (config.data) {
      config.data = humps.decamelizeKeys(config.data);
    }
    return config;
  },
  (error) => {
    message.error('Request error');
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response) => {
    const { data, headers } = response;
    const contentDisposition = headers['content-disposition'];
    const patt = new RegExp('filename="([^;]+\\.[^\\.;]+)";*');
    const result = patt.exec(contentDisposition);
    const fileName = decodeURI(result[1]);
    const blob = new Blob([data], { type: headers['content-type'] });
    const dom = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    dom.href = url;
    dom.download = fileName;
    dom.style.display = 'none';
    document.body.appendChild(dom);
    dom.click();
    dom.parentNode.removeChild(dom);
    window.URL.revokeObjectURL(url);
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
