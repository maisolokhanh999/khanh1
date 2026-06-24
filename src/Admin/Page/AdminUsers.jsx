import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Popconfirm, Space, Tag, message } from 'antd';
import { DeleteOutlined, EditOutlined, SearchOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import AdminLayout from '../Components/AdminLayout.jsx';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  
  // Quản lý Modal chỉnh sửa/đổi mật khẩu
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  // ── GET /api/users/ (Tải danh sách) ──────────────────────
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(Array.isArray(data) ? data : data?.users ?? []);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ── MỞ MODAL SỬA THÔNG TIN & ROLE ────────────────────────
  const openEditModal = (user) => {
    setSelectedUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setIsModalOpen(true);
  };

  // ── XỬ LÝ LƯU (PUT /api/users/:id & :id/role) ─────────────
  const handleSaveUser = async () => {
    try {
      const values = await form.validateFields();
      const token = localStorage.getItem('token');
      const id = selectedUser._id || selectedUser.id;
      const config = { headers: { Authorization: `Bearer ${token}` } };

      // 1. Cập nhật Role riêng biệt nếu có API chuyên biệt: PUT /api/users/:id/role
      if (values.role !== selectedUser.role) {
        await axios.put(`/api/users/${id}/role`, { role: values.role }, config);
      }

      // 2. Cập nhật thông tin chung: PUT /api/users/:id
      await axios.put(`/api/users/${id}`, { name: values.name, email: values.email }, config);

      message.success('Cập nhật người dùng thành công');
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      if (error.response) message.error(error.response.data?.message || 'Cập nhật thất bại');
    }
  };

  // ── MỞ MODAL ĐỔI MẬT KHẨU ─────────────────────────────────
  const openPasswordModal = (user) => {
    setSelectedUser(user);
    passwordForm.resetFields();
    setIsPasswordModalOpen(true);
  };

  // ── XỬ LÝ ĐỔI MẬT KHẨU (PUT /api/users/:id/password) ──────
  const handleChangePassword = async () => {
    try {
      const values = await passwordForm.validateFields();
      const token = localStorage.getItem('token');
      const id = selectedUser._id || selectedUser.id;

      await axios.put(`/api/users/${id}/password`, 
        { password: values.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      message.success(`Đã đổi mật khẩu cho tài khoản ${selectedUser.email}`);
      setIsPasswordModalOpen(false);
    } catch (error) {
      if (error.response) message.error(error.response.data?.message || 'Đổi mật khẩu thất bại');
    }
  };

  // ── DELETE /api/users/:id (Xóa User) ──────────────────────
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Xóa tài khoản thành công');
      fetchUsers();
    } catch (error) {
      message.error(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  };

  // Bộ lọc tìm kiếm Client-side
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Cấu hình bảng dữ liệu
  const columns = [
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Địa chỉ Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Quyền hạn',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 250,
      render: (_, record) => {
        const id = record._id || record.id;
        return (
          <Space size="small">
            <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={() => openEditModal(record)}>
              Sửa
            </Button>
            <Button type="text" icon={<LockOutlined className="text-amber-500" />} onClick={() => openPasswordModal(record)}>
              Mật khẩu
            </Button>
            <Popconfirm
              title="Xóa tài khoản này?"
              onConfirm={() => handleDelete(id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <AdminLayout
      title="Quản lý người dùng"
      subtitle="Xem danh sách, phân quyền và bảo mật tài khoản thành viên"
      action={
        <Input
          placeholder="Tìm kiếm tên, email..."
          prefix={<SearchOutlined className="text-gray-400" />}
          className="max-w-xs"
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
      }
    >
      <Table 
        columns={columns} 
        dataSource={filteredUsers.map((u, idx) => ({ ...u, key: u._id || u.id || idx }))} 
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* ── MODAL CHỈNH SỬA THÔNG TIN & ROLE ── */}
      <Modal
        title="Chỉnh sửa thông tin thành viên"
        open={isModalOpen}
        onOk={handleSaveUser}
        onCancel={() => setIsModalOpen(false)}
        okText="Cập nhật"
        cancelText="Hủy bỏ"
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng điền họ tên!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Địa chỉ Email" rules={[{ required: true, type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="role" label="Phân quyền hệ thống">
            <Select options={[{ value: 'user', label: 'User (Khách hàng)' }, { value: 'admin', label: 'Admin (Quản trị viên)' }]} />
          </Form.Item>
        </Form>
      </Modal>

      {/* ── MODAL ĐỔI MẬT KHẨU TỪ XA ── */}
      <Modal
        title={`Đổi mật khẩu tài khoản: ${selectedUser?.email}`}
        open={isPasswordModalOpen}
        onOk={handleChangePassword}
        onCancel={() => setIsPasswordModalOpen(false)}
        okText="Cấp mật khẩu mới"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <Form form={passwordForm} layout="vertical" className="mt-4">
          <Form.Item 
            name="newPassword" 
            label="Mật khẩu mới cấp cho người dùng" 
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }, { min: 6, message: 'Tối thiểu 6 ký tự!' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới..." />
          </Form.Item>
        </Form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;