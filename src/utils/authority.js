import { getDvaApp } from 'umi';
import { reloadAuthorized } from './Authorized'; // use localStorage to store the authority info, which might be sent from server in actual project.

export function getAuthority() {
  const app = getDvaApp();
  // eslint-disable-next-line no-underscore-dangle
  const state = app._store.getState();
  const { currentUser } = state.user;
  return currentUser.pageConfig;
}
export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  localStorage.setItem('antd-pro-authority', JSON.stringify(proAuthority)); // auto reload

  reloadAuthorized();
}
