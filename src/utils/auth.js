const TokenKey = 'One-Help-Admin-Token';

const ExpiresInKey = 'Admin-Expires-In';

export function getToken() {
  return window.localStorage.getItem(TokenKey);
}

export function setToken(token) {
  return window.localStorage.setItem(TokenKey, token);
}

export function removeToken() {
  return window.localStorage.removeItem(TokenKey);
}

export function getExpiresIn() {
  return window.localStorage.getItem(ExpiresInKey) || -1;
}

export function setExpiresIn(time) {
  return window.localStorage.setItem(ExpiresInKey, time);
}

export function removeExpiresIn() {
  return window.localStorage.removeItem(ExpiresInKey);
}
