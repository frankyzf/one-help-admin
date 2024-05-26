import React, { useRef, useEffect } from 'react';
import { Link, history } from 'umi';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { useSetState, useCounter, useUnmount } from 'react-use';
import { validation } from '@/utils';
import * as services from '@/services';
import styles from './index.less';

function ForgetPwd() {
  const [state, setState] = useSetState({
    loading: false,
    counting: false,
    step: 1,
    stepOneData: {},
  });
  const [form] = Form.useForm();
  const timer = useRef(null);
  const [count, { dec, reset }] = useCounter(60);
  const onFinish = (values) => {
    if (state.step === 1) {
      setState({
        stepOneData: values,
        step: 2,
      });
    } else {
      services
        .resetPwd({
          ...state.stepOneData,
          password: values.password,
        })
        .then(() => {
          message.success('Reset password successfully!');
          history.push('/user/login');
        });
    }
  };
  const handleGetCode = () => {
    form.validateFields(['email']).then((res) => {
      setState({ loading: true });
      services
        .triggerResetPwd(res)
        .then(() => {
          setState({
            counting: true,
          });
          timer.current = setInterval(() => {
            dec();
          }, 1000);
          message.success(`We havs send an code email to ${res.email}`);
        })
        .finally(() => setState({ loading: false }));
    });
  };
  useEffect(() => {
    if (count === 0) {
      setState({ counting: false });
      reset();
      clearInterval(timer.current);
    }
  }, [count]);
  useUnmount(() => {
    clearInterval(timer.current);
  });
  return (
    <div className={styles.loginForm}>
      <Form name="resetPwd" form={form} layout="vertical" onFinish={onFinish}>
        {state.step === 1 && (
          <>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter email' }, validation.isEmail()]}
              validateFirst
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item label="Code" noStyle>
              <Row gutter={8}>
                <Col span={12}>
                  <Form.Item
                    name="code"
                    rules={[
                      { required: true, message: 'Please enter the code you got' },
                      validation.isCode,
                    ]}
                    validateFirst
                  >
                    <Input maxLength={6} placeholder="Code" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Button onClick={handleGetCode} loading={state.loading} disabled={state.counting}>
                    {state.counting ? `${count}s` : 'Get code'}
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </>
        )}
        {state.step === 2 && (
          <>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please enter your password' }]}
            >
              <Input.Password placeholder="New Password" maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              rules={[
                { required: true, message: 'Please enter new password again' },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    // eslint-disable-next-line prefer-promise-reject-errors
                    return Promise.reject('The two passwords that you entered do not match!');
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" maxLength={30} />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Link to="/user/login">Login</Link>
        </Form.Item>

        <Form.Item>
          <Button
            loading={state.loading}
            className={styles.loginButton}
            type="primary"
            htmlType="submit"
          >
            {state.step === 1 ? 'Next' : 'Submit'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ForgetPwd;
