import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { useSetState } from 'ahooks';
import { validation } from '@/utils';
import * as services from '@/services';
import to from 'await-to-js';

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

function CUModal(props) {
  const { visible, type, onCancel, onSuccess, data } = props;
  const [state, setState] = useSetState({
    loading: false,
  });

  const [form] = Form.useForm();
  const isAdd = type === 'add';

  useEffect(() => {
    if (visible) {
      if (!isAdd) {
        form.setFieldsValue({
          name: data.name,
          url: data.url,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone,
          criterial: data.criterial,
          details: data.details,
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible]);

  const handleCancel = () => {
    onCancel();
  };

  const handleFinish = async (values) => {
    let requestMethod;
    let params;
    let tips;
    if (isAdd) {
      requestMethod = services.createProject;
      params = [{ ...values, enable: true }];
      tips = 'Added.';
    } else {
      requestMethod = services.updateProject;
      params = [data.id, values];
      tips = 'Updated.';
    }
    setState({ loading: true });
    const [err] = await to(requestMethod(...params));
    setState({ loading: false });

    if (err) {
      return;
    }

    message.success(tips);
    onSuccess();
    handleCancel();
  };

  const title = isAdd ? 'Add Project' : 'Edit Project';

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      onOk={form.submit}
      confirmLoading={state.loading}
      width={800}
    >
      <Form {...layout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[validation.required('Please enter name')]}
          validateFirst
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="url"
          label="Url"
          rules={[validation.required('Please enter url')]}
          validateFirst
        >
          <Input placeholder="Url" />
        </Form.Item>
        <Form.Item
          name="contactEmail"
          label="Contact Email"
          rules={[validation.isEmail()]}
          validateFirst
        >
          <Input placeholder="Contact Email" />
        </Form.Item>
        <Form.Item name="contactPhone" label="Contact Mobile" rules={[validation.isMobile()]} validateFirst>
          <Input placeholder="Contact Mobile" />
        </Form.Item>
        <Form.Item
          name="details"
          label="Details"
          validateFirst
        >
          <Input.TextArea placeholder="Details" />
        </Form.Item>
        <Form.Item
          name="criterial"
          label="Criterial"
          validateFirst
        >
          <Input.TextArea placeholder="Criterial" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default CUModal;
