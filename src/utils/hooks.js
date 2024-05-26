import { useSetState } from 'react-use';
import humps from 'humps';
import produce from 'immer';

function useSearchFields(options = {}) {
  const { searchFieldInitialValue, formRef } = options;
  const columns = options.columns.filter((_) => _);
  const searchFieldValueEnum = columns.reduce((total, cur) => {
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

  const [state, setState] = useSetState({
    newColumns: [
      ...columns,
      {
        dataIndex: 'searchField',
        hideInTable: true,
        initialValue: searchFieldInitialValue && humps.decamelize(searchFieldInitialValue),
        valueEnum: searchFieldValueEnum,
        fieldProps: {
          placeholder: 'search field',
          onChange: (val) => {
            formRef?.current?.resetFields(['keyword']);
            const camelKey = humps.camelize(val || '');
            const findColumn = options.columns.find(
              (item) => item.dataIndex === camelKey || item.key === camelKey,
            );
            if (findColumn && findColumn.valueEnum) {
              setState(
                produce((draft) => {
                  draft.newColumns[draft.newColumns.length - 1].valueEnum = findColumn.valueEnum;
                }),
              );
            } else {
              setState(
                produce((draft) => {
                  delete draft.newColumns[draft.newColumns.length - 1].valueEnum;
                }),
              );
            }
          },
        },
      },
      {
        dataIndex: 'keyword',
        hideInTable: true,
        fieldProps: {
          placeholder: 'keyword',
        },
      },
    ],
  });

  return {
    columns: state.newColumns,
  };
}

function useModal() {
  const [state, setState] = useSetState({
    visible: false,
    data: null,
    extra: null,
  });

  const show = ({ data = null, extra = null } = {}) => {
    setState({
      visible: true,
      data,
      extra,
    });
  };

  const hide = ({ data = null, extra = null } = {}) => {
    setState({
      visible: false,
      data,
      extra,
    });
  };

  return {
    visible: state.visible,
    type: state.type,
    extra: state.extra,
    data: state.data,
    show,
    hide,
  };
}

export { useSearchFields, useModal };
