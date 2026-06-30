import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import api from './config/apiConfig';

const SignUp = () => {
  const navigate = useNavigate();

  const handleRegister = async (values) => {
    try {
      const { data } = await api.post("/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
      });

      message.success("Đăng ký thành công");
      console.log(data);
      navigate("/login");
    } catch (error) {
      message.error(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <Form
        name="signup"
        style={{ maxWidth: 360, width: '100%' }}
        onFinish={handleRegister}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
        </Form.Item>

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
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại!" },
            {
              pattern: /^(0|\+84)[0-9]{9,10}$/,
              message: "Số điện thoại không hợp lệ!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Số điện thoại"
          />
        </Form.Item>
        <Form.Item
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Địa chỉ" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu!' },
            { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUp;