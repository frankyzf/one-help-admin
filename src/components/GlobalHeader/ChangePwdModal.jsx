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

function ChangePwdModa(props) {
  const { visible, onCancel } = props;
  const [state, setState] = useSetState({
    loading: false,
  });
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  const handleFinish = async (values) => {
    setState({ loading: true });
    const [err] = await to(
      services.updateMyAccountPwd({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }),
    );
    setState({ loading: false });
    if (err) {
      return;
    }
    message.success('Password updated.');
    onCancel();
  };

  return (
    <Modal
      title="Change Passwrod"
      visible={visible}
      onCancel={onCancel}
      onOk={form.submit}
      confirmLoading={state.loading}
      width={650}
    >
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="oldPassword"
          label="Old Password"
          rules={[validation.required('Please enter the old password')]}
        >
          <Input.Password placeholder="Old Password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label="Password"
          rules={[validation.required('Please enter the password')]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={['password']}
          rules={[
            validation.required('Please enter the password again'),
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('The two passwords that you entered do not match!');
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ChangePwdModa;
