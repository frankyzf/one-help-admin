import React from 'react';
import { Upload } from 'antd';
import { useDispatch } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { isLocal } from '@/config/env';
import { getToken } from '@/utils/auth';
import styles from './index.less';

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function ImageListUpload(props) {
  const {
    value = [],
    onChange,
    max = 9,
    useCloud = false,
    action = `${useCloud && isLocal ? '/cloud-api' : '/api'}/photo/upload`,
    hideDeleteButton = false,
    ...rest
  } = props;
  const dispatch = useDispatch();

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = ({ fileList }) => {
    onChange(fileList);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    dispatch({
      type: 'global/previewImages',
      payload: [file.url || file.preview],
    });
  };

  return (
    <Upload
      action={action}
      listType="picture-card"
      fileList={value}
      onChange={handleChange}
      headers={{ Authorization: getToken(), platform: 'web' }}
      accept="image/*"
      onPreview={handlePreview}
      className={hideDeleteButton && styles.hideDeleteButton}
      {...rest}
    >
      {value.length >= max ? null : uploadButton}
    </Upload>
  );
}

export default ImageListUpload;
