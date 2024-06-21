import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/authActions';
import { Layout, Row, Col, Typography, Form, Input, Switch, Alert, Spin, Button } from 'antd';
import { DribbbleOutlined, TwitterOutlined, InstagramOutlined, GithubOutlined } from '@ant-design/icons';
import signinbg from '../assets/images/feed.jpg';

const { Title } = Typography;
const { Header, Footer, Content } = Layout;

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [useDemoNormal, setUseDemoNormal] = useState(false);
  const [useDemoAdmin, setUseDemoAdmin] = useState(false);
  
  const history = useHistory();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const submitHandler = (values) => {
    dispatch(login(values.username, values.password));
  };

  useEffect(() => {
    if (userInfo) {
      history.push('/');
    }
  }, [userInfo, history]);

  useEffect(() => {
    if (useDemoNormal) {
      setUsername('testuser@gmail.com');
      setPassword('P@ssw0rd123');
    } else if (useDemoAdmin) {
      setUsername('eshway@gmail.com');
      setPassword('P@ssw0rd123');
    } else {
      setUsername('');
      setPassword('');
    }
  }, [useDemoNormal, useDemoAdmin]);

  useEffect(() => {
    if ((useDemoNormal || useDemoAdmin) && username && password) {
      dispatch(login(username, password));
    }
  }, [username, password, useDemoNormal, useDemoAdmin, dispatch]);

  const handleDemoNormalChange = (checked) => {
    setUseDemoNormal(checked);
    if (checked) {
      setUseDemoAdmin(false);
    }
  };

  const handleDemoAdminChange = (checked) => {
    setUseDemoAdmin(checked);
    if (checked) {
      setUseDemoNormal(false);
    }
  };

  return (
    <>
      <Layout className="layout-default layout-signin">
        <Content className="signin">
          <Row gutter={[24, 0]} justify="space-around">
            <Col xs={{ span: 24, offset: 0 }} lg={{ span: 6, offset: 2 }} md={{ span: 12 }}>
              <Title className="mb-15">Sign In</Title>
              <Title className="font-regular text-muted" level={5}>
                Enter your username and password to sign in
              </Title>
              <Form onFinish={submitHandler} layout="vertical" className="row-col">
                <Form.Item
                  className="username"
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please input your email!' }]}
                >
                  <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
                </Form.Item>

                <Form.Item
                  className="username"
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please input your password!' }]}
                >
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
                </Form.Item>

                <Form.Item className="align-center">
                  <Switch checked={useDemoNormal} onChange={handleDemoNormalChange} /> USE DEMO NORMAL ACCOUNT
                </Form.Item>

                <Form.Item className="align-center">
                  <Switch checked={useDemoAdmin} onChange={handleDemoAdminChange} /> USE DEMO ADMIN ACCOUNT
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                    {loading ? <Spin /> : 'SIGN IN'}
                  </Button>
                </Form.Item>
                {error && <Alert message={error} type="error" />}
                <p className="font-semibold text-muted">
                  Don't have an account?{' '}
                  <Link to="/sign-up" className="text-dark font-bold">
                    Sign Up
                  </Link>
                </p>
              </Form>
            </Col>
            <Col className="sign-img" style={{ padding: 12 }} xs={{ span: 24 }} lg={{ span: 12 }} md={{ span: 12 }}>
              <img src={signinbg} alt="" />
            </Col>
          </Row>
        </Content>
      </Layout>
    </>
  );
};

export default SignIn;
