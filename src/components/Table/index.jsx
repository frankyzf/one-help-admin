/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import React, { useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { Image } from 'antd';
import humps from 'humps';
import moment from 'moment';
import { timeFormatConfig } from '@/config/enum';
import {
  formatDate,
  formatDateTime,
  formatDateTimeWithoutYear,
  formatMoney,
  getStaticUrl,
} from '@/utils';
import CommonSearchField from '../CommonSearchField';
import styles from './index.less';

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
  scroll: {
    x: 'max-content',
  },
  options: false,
  editable: {},
  showIndex: true,
  syncUrl: false,
  tableAlertRender: () => false,
};

function Table(props) {
  const { onLoadOriginalData, ...restProps } = props;
  const formatProps = {
    ...defaultProps,
    ...restProps,
  };
  formatProps.actionRef = props.actionRef;
  const formRef = useRef();
  formatProps.formRef = props.formRef || formRef;
  const { columns: originalColumns, onReset } = formatProps;

  const hasSearchField = formatProps.columns.some((item) => item.showInSearchField);

  const searchFieldOptions = formatProps.columns.reduce((total, cur) => {
    if (cur?.showInSearchField) {
      total.push({
        label: cur.title,
        value: humps.decamelize(cur.dataIndex || cur.key),
      });
    }
    return total;
  }, []);

  const indexColumn = {
    title: '#',
    dataIndex: 'index',
    render: (text, record, index, action) => {
      if (action.pageInfo) {
        return action.pageInfo.pageSize * (action.pageInfo.current - 1) + index + 1;
      }
      return index;
    },
    hideInSearch: true,
    width: 72,
  };

  const columns = originalColumns.map((item) => {
    if (item.render) {
      return item;
    }

    const { fieldProps = {}, search = {} } = item;

    if (item.valueType === 'date') {
      return {
        ...item,
        search: {
          transform: (val) => ({
            [item.dataIndex ?? item.key]: formatDate(moment(val, timeFormatConfig.date), true),
          }),
          ...search,
        },
        fieldProps: {
          format: timeFormatConfig.date,
          ...fieldProps,
        },
      };
    }

    if (item.valueType === 'dateTime') {
      return {
        ...item,
        search: {
          transform: (val) => ({
            [item.dataIndex ?? item.key]: formatDateTime(
              moment(val, timeFormatConfig.dateTime),
              true,
            ),
          }),
          ...search,
        },
        fieldProps: {
          format: timeFormatConfig.dateTime,
          ...fieldProps,
        },
      };
    }

    if (item.valueType === 'dateTimeWithoutYear') {
      return {
        ...item,
        renderText: (_, row) =>
          row[item.dataIndex] ? formatDateTimeWithoutYear(row[item.dataIndex]) : '-',
      };
    }

    if (item.valueType === 'dateRange') {
      return {
        ...item,
        search: {
          transform: (val) => ({
            [item.startKey ?? 'start']: formatDate(moment(val[0], timeFormatConfig.date), true),
            [item.endKey ?? 'end']: formatDate(moment(val[1], timeFormatConfig.date), true),
          }),
          ...search,
        },
        fieldProps: {
          format: timeFormatConfig.date,
          placeholder: ['Start Date', 'End Date'],
          ...fieldProps,
        },
      };
    }

    if (item.valueType === 'amount') {
      return {
        ...item,
        renderText: (_, row) => formatMoney(row[item.dataIndex], { def: '-', prefix: '$' }),
      };
    }

    if (item.valueType === 'picture') {
      return {
        ...item,
        renderText: (_, row) =>
          row[item.dataIndex] ? (
            <Image width={60} src={getStaticUrl(row[item.dataIndex])} alt="" />
          ) : (
            '-'
          ),
      };
    }

    return item;
  });

  if (formatProps.showIndex) {
    if (columns[0] && columns[0].valueType === 'index') {
      columns[0] = indexColumn;
    } else {
      columns.unshift(indexColumn);
    }
  }

  const handleReset = () => {
    onReset?.();
  };

  const newColumns = hasSearchField
    ? [
        ...columns,
        {
          dataIndex: 'commonSearchField',
          hideInTable: true,
          formItemProps: () => ({
            className: styles.fitWidthWhioutTitle,
          }),
          initialValue: formatProps.searchFieldInitialValue
            ? [humps.decamelize(formatProps.searchFieldInitialValue)]
            : [],
          renderFormItem: () => {
            return <CommonSearchField searchFieldOptions={searchFieldOptions} columns={columns} />;
          },
          search: {
            transform: (val) => {
              return {
                searchField: val?.[0],
                keyword: val?.[1],
              };
            },
          },
        },
      ]
    : columns;

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
        if (onLoadOriginalData) {
          onLoadOriginalData(res);
        }
        return {
          data: res.list,
          total: res.total,
          success: true,
        };
      });
    };
  }

  return <ProTable {...formatProps} onReset={handleReset} columns={newColumns} />;
}

export default Table;
