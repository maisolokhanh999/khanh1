import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import api from '../config/apiConfig';

// SỬA: Nhận onLoginSuccess từ component App truyền xuống thông qua destructuring
const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post('/auth/login', {
        email: values.email,
        password: values.password,
      });

      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // SỬA: Gọi trực tiếp hàm callback đã nhận (không cần thông qua chữ 'props.')
      if (onLoginSuccess) {
        onLoginSuccess(); // Thông báo cho App.jsx biết để cập nhật state user ngay lập tức
      }
      
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
          <Flex justify="space-between" align="center">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ đăng nhập</Checkbox>
            </Form.Item>
            <a href="#">Quên mật khẩu?</a>
          </Flex>
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