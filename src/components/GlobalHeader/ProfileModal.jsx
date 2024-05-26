import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useSetState } from 'ahooks';
import * as services from '@/services';
import to from 'await-to-js';
import { validation } from '@/utils';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function ProfileModal(props) {
  const { visible, onCancel, onSuccess, currentUser } = props;
  const [state, setState] = useSetState({
    loading: false,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        name: currentUser?.name,
      });
    }
  }, [visible]);

  const handleFinish = async (values) => {
    setState({ loading: true });
    const [err] = await to(services.updateMyAccountProfile(values));
    setState({ loading: false });
    if (err) {
      return;
    }
    message.success('Profile updated.');
    onCancel();
    onSuccess?.();
  };

  return (
    <Modal
      title="My Profile"
      visible={visible}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={state.loading}
    >
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item name="name" label="Name" rules={[validation.required('Please enter your name')]}>
          <Input placeholder="Name" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ProfileModal;
