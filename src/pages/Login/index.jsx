import React from 'react';
import { Form, Input, Button } from 'antd';
import * as services from '@/services';
import { getPageQuery } from '@/utils/utils';
import { useSetState } from 'react-use';
import { validation } from '@/utils';
import { setToken } from '@/utils/auth';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import logo from '@/assets/logo2.png';
import to from 'await-to-js';
import styles from './index.less';

function Login() {
  const [form] = Form.useForm();
  const [state, setState] = useSetState({
    loading: false,
    email: '',
  });

  const onFinish = async (values) => {
    const { isGroupAdmin, ...rest } = values;
    const method = services.login;
    setState({ loading: true });
    const [err, data] = await to(method(rest));
    setState({ loading: false });
    if (err) {
      return;
    }
    setToken(data.token);
    const urlParams = new URL(window.location.href);
    const params = getPageQuery();
    let { redirect } = params;
    if (redirect) {
      const redirectUrlParams = new URL(redirect);
      if (redirectUrlParams.origin === urlParams.origin) {
        redirect = redirect.substr(urlParams.origin.length);

        if (redirect.match(/^\/.*#/)) {
          redirect = redirect.substr(redirect.indexOf('#') + 1);
        }
      } else {
        window.location.href = '/';
        return;
      }
    }
    window.location.href = redirect || '/';
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <img src={logo} className={styles.logo} alt="one-help" />
        <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" rules={[validation.required('Please enter your email')]}>
            <Input maxLength={64} placeholder="Email" size="large" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item name="password" rules={[validation.required('Please enter your password')]}>
            <Input.Password
              placeholder="Password"
              maxLength={64}
              size="large"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={state.loading}
              className={styles.loginButton}
              type="primary"
              htmlType="submit"
              size="large"
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Login;
