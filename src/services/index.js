import request from '@/utils/request';

export const login = (data = {}) => request.post('/login', data);
export const groupCompanyLogin = (data = {}) => request.post('/group-company-login', data);
export const getMe = () => request.get('/me');
export const triggerResetPwd = (data = {}) => request.post('/trigger-reset-password', data);
export const resetPwd = (data = {}) => request.post('/reset-password', data);
export const updatePwd = (data = {}, token) =>
  request.post('/me/update-password', data, { headers: { Authorization: token } });
export const updateMyAccountPwd = (data = {}, options = {}) =>
  request.post('/account/update-my-password', data, options);
export const getMyCompany = (data) => request.get('/my-company', data);
export const updateMyCompany = (data = {}) => request.post('/my-company', data);
export const updateMyAccountProfile = (data = {}) =>
  request.post('/account/update-my-profile', data);

/** Merchant Group */
export const getProjectList = (data = {}) =>
  request.get('/project/list', data);
export const createProject = (data = {}) =>
  request.post('/project/item', data);
export const updateProject = (id, data = {}) =>
  request.post(`/project/item/${id}`, data);
export const deleteProject = (id) => request.delete(`/project/item/${id}`);
