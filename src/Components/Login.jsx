import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../config/apiConfig';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      login({ user: data.user, token: data.token });
      message.success(data.message || 'Đăng nhập thành công');

      // Chuyển hướng theo quyền hạn
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <Form
        name="login"
        initialValues={{ remember: true }}
        style={{ maxWidth: 360, width: '100%' }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập email!' },
            { type: 'email', message: 'Email không hợp lệ!' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#">Quên mật khẩu?</a>
          </div>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Đăng nhập
          </Button>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            Chưa có tài khoản?{' '}
            <NavLink to="/signup">Đăng ký ngay!</NavLink>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;