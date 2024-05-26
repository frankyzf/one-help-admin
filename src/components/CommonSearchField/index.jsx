import React, { useMemo } from 'react';
import { Input, Select } from 'antd';
import humps from 'humps';

function CommonSearchField(props) {
  const { searchFieldOptions, value, onChange, columns } = props;
  const handleSearchFieldChange = (val) => {
    onChange([val, undefined]);
  };

  const handleKeywordChange = (val) => {
    onChange([value?.[0], val]);
  };

  const currentColumn = useMemo(() => {
    return columns.find((item) =>
      [item.dataIndex, item.key].includes(humps.camelize(value?.[0] ?? '')),
    );
  }, [columns, value?.[0]]);

  const keywordOptions = useMemo(() => {
    if (!currentColumn?.valueEnum) {
      return null;
    }
    return (currentColumn.valueEnum instanceof Map
      ? [...currentColumn.valueEnum.entries()]
      : Object.entries(currentColumn.valueEnum)
    ).map((item) => ({
      label: item[1],
      value: item[0],
    }));
  }, [currentColumn]);

  return (
    <Input.Group compact>
      <Select
        value={value?.[0]}
        onChange={handleSearchFieldChange}
        options={searchFieldOptions}
        placeholder="Search Field"
        style={{ width: '50%' }}
      />
      <Select
        value={value?.[1]}
        onChange={handleKeywordChange}
        options={keywordOptions ?? []}
        placeholder="Keyword"
        style={{ width: '50%', display: keywordOptions ? 'inline-block' : 'none' }}
      />
      <Input
        value={value?.[1] ?? ''}
        onChange={(e) => handleKeywordChange(e.target.value)}
        placeholder="Keyword"
        style={{ width: '50%', display: keywordOptions ? 'none' : 'inline-block' }}
      />
    </Input.Group>
  );
}

export default CommonSearchField;
