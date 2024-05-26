import React from 'react';
import { Button } from 'antd';
import { useToggle } from 'react-use';
import { download } from '@/utils';

function ExportButton(props) {
  const {
    url,
    children = 'Export',
    method = 'get',
    params = {},
    data = {},
    buttonProps = {},
  } = props;
  const [loading, toggleLoading] = useToggle(false);

  function handleDownload() {
    const realParams = typeof params === 'function' ? params() : params;
    const { commonSearchField, ...rest } = realParams;
    if (commonSearchField) {
      rest.searchField = commonSearchField[0] ?? '';
      rest.keyword = commonSearchField[1] ?? '';
    }
    toggleLoading(true);
    download({
      url,
      method,
      params: rest,
      data: typeof data === 'function' ? data() : data,
      responseType: 'blob',
    }).finally(() => toggleLoading(false));
  }

  return (
    <Button loading={loading} onClick={handleDownload} {...buttonProps}>
      {children}
    </Button>
  );
}

export default ExportButton;
