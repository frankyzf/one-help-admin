/* eslint-disable no-restricted-syntax */
/* eslint-disable no-shadow */
import humps from 'humps';
import { useSetState } from 'react-use';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { js_beautify as jsBeautify } from 'js-beautify';
import BigNumber from 'bignumber.js';
import * as validation from './validation';
import getStaticUrl, { getDownloadsUrl } from './getStaticUrl';
import download from './download';
import * as hooks from './hooks';
import { allPath } from './permission';
import html2Pdf from './pdf-export';

export { validation, getStaticUrl, getDownloadsUrl, download, hooks, uuid, html2Pdf };

export function generateSearchFields(columns, options = {}) {
  const { searchFieldInitialValue } = options;
  columns = columns.filter((_) => _);
  const valueEnum = columns.reduce((total, cur) => {
    if (cur && cur.showInSearchField) {
      total[humps.decamelize(cur.dataIndex || cur.key)] = cur.title;
    }
    return total;
  }, {});
  const indexColumn = {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index, action) => {
      return action.pageInfo.pageSize * (action.pageInfo.current - 1) + index + 1;
    },
    hideInSearch: true,
    width: 72,
  };
  if (columns[0] && columns[0].valueType === 'index') {
    columns[0] = indexColumn;
  } else {
    columns.unshift(indexColumn);
  }
  return [
    ...columns,
    {
      dataIndex: 'searchField',
      hideInTable: true,
      initialValue: searchFieldInitialValue && humps.decamelize(searchFieldInitialValue),
      valueEnum,
      fieldProps: {
        placeholder: 'search field',
      },
    },
    {
      dataIndex: 'keyword',
      hideInTable: true,
      fieldProps: {
        placeholder: 'keyword',
      },
    },
  ];
}

export function useModal() {
  const [state, setState] = useSetState({
    visible: false,
    type: 'add',
    currentRow: null,
  });
  const toggleVisible = (type = 'add', row = null) => {
    setState((prevState) => ({
      visible: !prevState.visible,
      type,
      currentRow: row,
    }));
  };
  return {
    ...state,
    toggleVisible,
  };
}

export function fillPrefixZero(num) {
  return num > 9 ? `${num}` : `0${num}`;
}

export function formatDuration(duration, { showSeconds = false } = {}) {
  if (duration === null || duration === undefined) {
    return '-';
  }
  let days = parseInt(duration / 86400, 10);
  let hours = parseInt((duration % 86400) / 3600, 10);
  const tempMinutes = (duration - days * 86400 - hours * 3600) / 60;
  let minutes = showSeconds ? parseInt(tempMinutes, 10) : Math.ceil(tempMinutes);
  const seconds = parseInt(duration - days * 86400 - hours * 3600 - minutes * 60, 10);

  if (!showSeconds) {
    if (minutes === 60) {
      minutes = 0;
      hours += 1;
    }

    if (hours === 24) {
      hours = 0;
      days += 1;
    }
  }

  let result = '';

  if (days > 0) {
    result += `${days}d`;
  }

  result += `${fillPrefixZero(hours)}:${fillPrefixZero(minutes)}`;

  if (showSeconds) {
    result += `:${fillPrefixZero(seconds)}`;
  }

  return result;
}

export function isNil(value) {
  return value == null;
}

export function formatMoney(num, { def = num, prefix = '' } = {}) {
  if (isNil(num)) {
    return def;
  }
  return `${prefix}${Number(num)
    .toFixed(2)
    .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,')}`;
}

export function uniqueJsonArr(arr, key) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[key]) && res.set(item[key], 1));
}

export function toJSON(jsonStr, def = null) {
  try {
    if (jsonStr) return JSON.parse(jsonStr);
    return def;
  } catch (e) {
    return def;
  }
}

export function stringify(val) {
  if (!val) {
    return '';
  }
  if (typeof val === 'string') {
    return val;
  }
  return JSON.stringify(val);
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function convertListToTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children',
  };

  const childrenListMap = {};
  const nodeIds = {};
  const tree = [];

  for (const d of data) {
    const parentId = d[config.parentId];
    if (childrenListMap[parentId] == null) {
      childrenListMap[parentId] = [];
    }
    nodeIds[d[config.id]] = d;
    childrenListMap[parentId].push(d);
  }

  for (const d of data) {
    const parentId = d[config.parentId];
    if (nodeIds[parentId] == null) {
      tree.push(d);
    }
  }

  for (const t of tree) {
    adaptToChildrenList(t);
  }

  function adaptToChildrenList(o) {
    if (childrenListMap[o[config.id]] != null) {
      o[config.childrenList] = childrenListMap[o[config.id]];
    }
    if (o[config.childrenList]) {
      for (const c of o[config.childrenList]) {
        adaptToChildrenList(c);
      }
    }
  }
  return tree;
}

export function isJSON(str) {
  return !!toJSON(str);
}

export function beautifyJSON(str) {
  if (!isJSON(str)) {
    return str;
  }
  return jsBeautify(str, { indent_size: 2 });
}

export function divide(a, b) {
  return new BigNumber(a).div(b).toNumber();
}

export function add(a, ...args) {
  let result = new BigNumber(a);
  for (const i of args) {
    result = result.plus(i);
  }
  return result.toNumber();
}

export function multiply(a, ...args) {
  let result = new BigNumber(a);
  for (const i of args) {
    result = result.times(i);
  }
  return result.toNumber();
}

export function shouldFillCompanyId() {
  const { pathname } = window.location;
  const whiteList = ['/carpark-management/overview'];
  return [...allPath, ...whiteList].some((item) => item === pathname);
}

export function transOptionsToEnum(
  data = [],
  { valueKey = 'value', labelKey = 'label', useMap = false } = {},
) {
  if (useMap) {
    return new Map(data.map((item) => [item[valueKey], item[labelKey]]));
  }
  return data.reduce((total, cur) => {
    total[cur[valueKey]] = cur[labelKey];
    return total;
  }, {});
}

export function formatDate(str, isApiField = false) {
  return moment(str).format(isApiField ? 'YYYY-MM-DD' : 'DD/MM/YYYY');
}

export function formatDateTime(str, isApiField = false) {
  return moment(str).format(isApiField ? 'YYYY-MM-DD HH:mm:ss' : 'HH:mm:ss DD/MM/YYYY');
}

export function formatDateTimeWithoutYear(str, isApiField = false) {
  return moment(str).format(isApiField ? 'MM-DD HH:mm:ss' : 'HH:mm:ss DD/MM');
}

export function toUpperCase(str) {
  if (!str) {
    return str;
  }
  return str.toUpperCase();
}

export function toLowerCase(str) {
  if (!str) {
    return str;
  }
  return str.toLowerCase();
}

export function loadImage(url, { anonymous = false } = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (anonymous) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function hasDuplicates(arr, key) {
  let newArr = arr;

  if (key) {
    newArr = newArr.map((item) => item[key]);
  }

  return new Set(newArr).size !== newArr.length;
}
