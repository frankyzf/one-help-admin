/* eslint-disable prefer-promise-reject-errors */
import { toJSON } from './index';

export const reg = {
  posInt: /^[1-9]\d*$/,
  // eslint-disable-next-line no-useless-escape
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,
  mobile: /^\d{8}$/,
  amount: /(^[1-9](\d+)?(\.\d{1,2})?$)|(^0$)|(^\d\.\d{1,2}$)/,
  licensePlate: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{3,8}$/,
  httpUrl: /^(http|https):\/\//,
  verificationCode: /^\d{6}$/,
};

export const isPosInt = () => ({
  validator(rule, value) {
    if (!value || (value && reg.posInt.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid numbers');
  },
});

export const isEmail = () => ({
  type: 'email',
  message: 'Please enter a valid email',
});

export const isMobile = () => ({
  validator(rule, value) {
    if (!value || (value && reg.mobile.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid mobile');
  },
});

export const isCode = () => ({
  validator(rule, value) {
    if (!value || (value && reg.verificationCode.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter 6-digit code');
  },
});

export const isAmount = () => ({
  validator(rule, value) {
    if (!value || (value && reg.amount.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid amount');
  },
});

export const isJSON = () => ({
  validator(rule, value) {
    if (!value || toJSON(value)) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter valid JSON');
  },
});

export const isLicensePlate = () => ({
  validator(rule, value) {
    if (!value || (value && reg.licensePlate.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid vehicle number, length between 3-8, e.g SJR1234K.');
  },
});

export const required = (message, _required = true) => ({
  required: _required,
  message,
});

export const isHttpUrl = () => ({
  validator(rule, value) {
    if (!value || (value && reg.httpUrl.test(value))) {
      return Promise.resolve();
    }
    return Promise.reject('Please enter a valid url.');
  },
});
