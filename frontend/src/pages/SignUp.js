import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/authActions';
import {
  Layout,
  Button,
 Typography,
  Card,
  Form,
  Input,
  Alert,
  Spin,
  Select,
} from 'antd';
import { Link, useHistory } from 'react-router-dom';
import {
  DribbbleOutlined,
  TwitterOutlined,
  InstagramOutlined,
  GithubOutlined,
} from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

const SignUp = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_type, setUserType] = useState('normal_user');

  const history = useHistory();
  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, signupInfo } = userRegister;

  const submitHandler = (values) => {
    dispatch(register(first_name, last_name, email, password, user_type));
  };

  if (signupInfo) {
    history.push('/sign-in');
  }

  return (
    <>
      <div className="layout-default ant-layout layout-sign-up">
        <Content className="p-0">
          <div className="sign-up-header">
            <div className="content">
              <Title>Sign Up</Title>
            </div>
          </div>

          <Card
            className="card-signup header-solid h-full ant-card pt-0"
            bordered="false"
          >
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={submitHandler}
              className="row-col"
            >
              <Form.Item
                name="first_name"
                rules={[
                  { required: true, message: 'Please input your first name!' },
                ]}
              >
                <Input
                  placeholder="First Name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="last_name"
                rules={[
                  { required: true, message: 'Please input your last name!' },
                ]}
              >
                <Input
                  placeholder="Last Name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' },
                ]}
              >
                <Input
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Please input your password!' },
                ]}
              >
                <Input.Password
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                name="user_type"
                rules={[
                  { required: true, message: 'Please select your user type!' },
                ]}
              >
                <Select
                  value={user_type}
                  onChange={(value) => setUserType(value)}
                >
                  <Option value="normal_user">Normal User</Option>
                  <Option value="admin">Admin</Option>
                </Select>
              </Form.Item>

              {error && <Alert message={error} type="error" showIcon />}
              {loading && <Spin />}

              <Form.Item>
                <Button
                  style={{ width: '100%' }}
                  type="primary"
                  htmlType="submit"
                >
                  SIGN UP
                </Button>
              </Form.Item>
            </Form>
            <p className="font-semibold text-muted text-center">
              Already have an account?{' '}
              <Link to="/sign-in" className="font-bold text-dark">
                Sign In
              </Link>
            </p>
          </Card>
        </Content>
      </div>
    </>
  );
};

export default SignUp;
