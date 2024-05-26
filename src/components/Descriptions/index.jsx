import React from 'react';
import ProDescriptions from '@ant-design/pro-descriptions';
import { timeFormatConfig } from '@/config/enum';

function Descriptions(props) {
  const { columns: originalColumns, ...rest } = props;

  const columns = originalColumns.map((item) => {
    if (item.render) {
      return item;
    }

    const { fieldProps = {} } = item;

    if (item.valueType === 'date') {
      return {
        ...item,
        fieldProps: {
          format: timeFormatConfig.date,
          ...fieldProps,
        },
      };
    }

    if (item.valueType === 'dateTime') {
      return {
        ...item,
        fieldProps: {
          format: timeFormatConfig.dateTime,
          ...fieldProps,
        },
      };
    }

    return item;
  });

  return <ProDescriptions columns={columns} {...rest} />;
}

export default Descriptions;
