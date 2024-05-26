/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import React, { useRef } from 'react';
import ProList from '@ant-design/pro-list';
import humps from 'humps';

const defaultProps = {
  rowKey: 'id',
  search: {
    collapseRender: () => null,
    collapsed: false,
  },
  pagination: {
    showQuickJumper: true,
    defaultPageSize: 20,
  },
  tableAlertRender: () => false,
};

function List(props) {
  const formatProps = {
    ...defaultProps,
    ...props,
  };
  formatProps.actionRef = props.actionRef;
  const formRef = useRef();
  formatProps.formRef = props.formRef || formRef;
  const { metas: originalMetas, onReset } = formatProps;

  const handleReset = () => {
    onReset?.();
  };

  if (formatProps.request && !formatProps.noRequestFormat) {
    const originalRequest = formatProps.request;
    formatProps.request = (params = {}, sort = {}, filter = {}) => {
      const { current = 1, pageSize = 20, ...rest } = params;
      const formatParams = {
        ...rest,
      };
      if (formatProps.pagination) {
        formatParams.from = (current - 1) * pageSize;
        formatParams.size = pageSize;
      }
      const formatSort = Object.keys(sort).reduce((total, cur) => {
        total.sortField = humps.decamelize(cur);
        total.sortType = sort[cur] === 'ascend' ? 'asc' : 'desc';
        return total;
      }, {});
      return originalRequest({
        params: {
          ...formatParams,
          ...formatSort,
          ...filter,
        },
      }).then((res) => {
        return {
          data: res.list,
          total: res.total,
          success: true,
        };
      });
    };
  }

  return <ProList {...formatProps} onReset={handleReset} metas={originalMetas} />;
}

export default List;
