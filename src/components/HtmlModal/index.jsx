/* eslint-disable react/no-danger */
import React from 'react';
import { Modal } from 'antd';

function HtmlModal(props) {
  const { visible, onCancel, data, title = 'Body' } = props;

  return (
    <Modal title={title} open={visible} onCancel={onCancel} footer={null}>
      <div dangerouslySetInnerHTML={{ __html: data ?? '' }} />
    </Modal>
  );
}

export default HtmlModal;
