import React, { useRef } from 'react';
import { connect } from 'umi';
import { message, Upload as AntdUpload } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getStaticUrl } from '@/utils';
import { getToken } from '@/utils/auth';
import { isLocal } from '@/config/env';
import styles from './index.less';

function ImageUpload(props) {
  const {
    useCloud = false,
    isFace = false,
    value,
    onChange,
    action = `${useCloud && isLocal ? '/cloud-api' : '/api'}${
      isFace ? '/fr/face-photo' : '/photo/upload'
    }`,
    children,
    dispatch,
    onSuccess,
    beforeUpload,
    canDelete = false,
    ...rest
  } = props;
  const loadingRef = useRef();

  const handleBeforeUpload = (file, fileList) => {
    if (beforeUpload) {
      const result = beforeUpload(file, fileList);
      if (!result) {
        if (loadingRef.current) {
          loadingRef.current();
          loadingRef.current = null;
        }
        return false;
      }
    }
    if (loadingRef.current) {
      return false;
    }
    loadingRef.current = message.loading('Uploading...', 0);
    return true;
  };

  const handleChange = (info) => {
    const {
      file: { status, response },
    } = info;
    if (status === 'uploading') {
      return;
    }
    if (loadingRef.current) {
      loadingRef.current();
      loadingRef.current = null;
    }
    if (status === 'error') {
      message.warning('Upload failed');
      return;
    }
    if (status === 'done') {
      if (response.errorCode !== 0) {
        message.warning(response.errorMsg || 'Upload failed');
        if (
          response.errorCode === 400 ||
          response.errorCode === 401 ||
          response.errorCode === 402 ||
          response.errorCode === 403
        ) {
          dispatch({
            type: 'login/logout',
          });
        }
        return;
      }
      onChange?.(response.data.key);
      onSuccess?.(response.data.key);
    }
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleDelete = (e) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <AntdUpload
      action={action}
      beforeUpload={handleBeforeUpload}
      onChange={handleChange}
      showUploadList={false}
      listType="picture-card"
      className={!children ? styles.imageUploader : ''}
      headers={{ Authorization: getToken(), platform: 'web' }}
      accept="image/*"
      {...rest}
    >
      {children ||
        (value ? (
          <div
            className={styles.imageWrapper}
            style={{ backgroundImage: `url(${getStaticUrl(value)})` }}
          >
            {canDelete && <DeleteOutlined className={styles.deleteButton} onClick={handleDelete} />}
          </div>
        ) : (
          uploadButton
        ))}
    </AntdUpload>
  );
}

export default connect()(ImageUpload);
