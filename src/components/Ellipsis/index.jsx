import React from 'react';
import { Tooltip } from 'antd';

function Ellipsis(props) {
  const { width, children } = props;
  const style = {
    // display: 'flex',
    maxWidth: width,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  return (
    <Tooltip title={children} placement="topLeft">
      <div style={style}>{children}</div>
    </Tooltip>
  );
}

export default Ellipsis;
