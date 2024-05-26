import menuLocales from '@/locales/en-US/menu';
import { cloneDeep } from 'lodash';
import { toJSON } from './index';
import routes from '../../config/auth-routes';

const menuLocaleKeys = Object.keys(menuLocales);
const menuLocalesMap = menuLocaleKeys.reduce((total, cur) => {
  const keyArr = cur.split('.');
  const lastKey = keyArr[keyArr.length - 1];
  total[lastKey] = menuLocales[cur];
  return total;
}, []);

function convertPermissionTreeData(data = []) {
  data.forEach((item) => {
    item.title = menuLocalesMap[item.name];
    item.key = item.name;
    if (item.routes) {
      item.children = item.routes;
      convertPermissionTreeData(item.routes);
    }
  });
}

function parsePageConfig(data) {
  if (Array.isArray(data)) {
    return data;
  }
  const formatData = toJSON(data, []);
  return Array.isArray(formatData) ? formatData : [];
}

const allRoutes = cloneDeep(routes);
convertPermissionTreeData(allRoutes);

const allPermissions = [];
const allPath = [];
function getAllPermissions(data) {
  data.forEach((item) => {
    allPermissions.push(item.name);
    allPath.push(item.path);
    if (item.children && item.children.length > 0) {
      getAllPermissions(item.children);
    }
  });
}
getAllPermissions(allRoutes);

/** 所有目录的 name 数组 （最多三级就不递归了） */
const allRouteNames = [];
routes.forEach((item) => {
  if (item.routes) {
    allRouteNames.push(item.name);
    item.routes.forEach((subItem) => {
      if (subItem.routes) {
        allRouteNames.push(subItem.name);
      }
    });
  }
});

export {
  convertPermissionTreeData,
  allRoutes,
  parsePageConfig,
  allPermissions,
  allPath,
  allRouteNames,
};
